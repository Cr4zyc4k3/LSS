// ==UserScript==
// @name         LSS MapLibre Globe
// @namespace    https://github.com/Cr4zyc4k3/LSS
// @version      1.0.1
// @description  Replace the Leaflet map view with a MapLibre globe, mirroring game markers and routes.
// @author       Crazycake
// @match        https://www.leitstellenspiel.de/*
// @match        https://leitstellenspiel.de/*
// @require      https://cdn.jsdelivr.net/npm/maplibre-gl@5.12.0/dist/maplibre-gl.js
// @grant        none
// @sandbox      raw
// @run-at       document-idle
// @noframes
// ==/UserScript==

(async function () {
    'use strict';

    const STYLE = 'https://tiles.openfreemap.org/styles/liberty';
    const CSS = 'https://cdn.jsdelivr.net/npm/maplibre-gl@5.12.0/dist/maplibre-gl.css';
    const PREFIX = '[LSS Globe]';
    // Keep window.map intact: the game continues to own its Leaflet layers/events.
    let leaflet;
    for (let attempt = 0; attempt < 5; attempt++) {
        if (window.L && window.map instanceof window.L.Map) {
            leaflet = window.map;
            break;
        }
        if (!document.getElementById('map') && attempt > 5) return;
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (!leaflet) {
        console.warn(PREFIX, 'No Leaflet map found. Select OpenStreetMap in the game settings and reload.');
        return;
    }
    const L = window.L;
    const host = leaflet.getContainer();
    if (host.querySelector('#lss-globe')) return;

    let globe;
    let active = false;
    let ready = false;
    let syncing = false;
    let stopped = false;
    let timer;
    let startupTimer;
    let observer;
    let popup;
    let popupOrigin;
    let geometrySignature = '';
    const markers = new Map();
    const paths = new Map();
    const overlay = document.createElement('div');
    overlay.id = 'lss-globe';
    overlay.style.cssText = 'position:absolute;inset:0;z-index:700;visibility:hidden;background:#d8e8ef;';
    const styles = document.createElement('style');
    styles.textContent = `
        .lss-globe-active > .leaflet-map-pane { visibility: hidden; pointer-events: none; }
        .lss-globe-active .leaflet-control-attribution { display: none; }
        #lss-globe .lss-globe-marker { width:0; height:0; cursor:pointer; }
        #lss-globe .lss-globe-marker > * { position:relative; left:0; top:0; transform:none; }
        #lss-globe .maplibregl-popup-content { color:#222; max-height:320px; overflow:auto; }
        .lss-globe-toggle { background:white; color:#222; padding:5px 8px; cursor:pointer; border:0; }
    `;
    document.head.appendChild(styles);
    host.appendChild(overlay);

    // Leaflet listens on the parent container. Do not let it process globe gestures twice.
    for (const type of ['mousedown', 'mouseup', 'mousemove', 'click', 'dblclick',
        'contextmenu', 'wheel', 'touchstart', 'touchmove', 'touchend', 'pointerdown',
        'pointermove', 'pointerup', 'keydown', 'keyup']) {
        overlay.addEventListener(type, event => event.stopPropagation());
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lss-globe-toggle';
    button.textContent = 'Globus lädt …';
    button.disabled = true;
    const worldButton = document.createElement('button');
    worldButton.type = 'button';
    worldButton.className = 'lss-globe-toggle';
    worldButton.textContent = '🌐';
    worldButton.title = 'Den ganzen Globus anzeigen';
    worldButton.setAttribute('aria-label', worldButton.title);
    worldButton.hidden = true;
    const Control = L.Control.extend({
        options: { position: 'topright' },
        onAdd() {
            const container = L.DomUtil.create('div', 'leaflet-bar');
            container.append(button, worldButton);
            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);
            return container;
        }
    });
    const control = new Control().addTo(leaflet);

    function setActive(value) {
        active = value && ready;
        host.classList.toggle('lss-globe-active', active);
        overlay.style.visibility = active ? 'visible' : 'hidden';
        button.textContent = active ? 'Originalkarte' : 'Globus';
        button.setAttribute('aria-pressed', String(active));
        worldButton.hidden = !active;
        if (active) {
            globe.resize();
            fromLeaflet();
            refresh();
        } else {
            closePopup();
            leaflet.invalidateSize({ pan: false });
        }
    }

    function fail(error) {
        if (stopped) return;
        console.error(PREFIX, error);
        ready = false;
        setActive(false);
        button.textContent = 'Globus nicht verfügbar';
        button.title = 'Die Originalkarte bleibt aktiv. Details stehen in der Browserkonsole.';
        button.disabled = true;
        stop();
    }

    function fromLeaflet() {
        if (!active || syncing) return;
        syncing = true;
        try {
            const center = leaflet.getCenter();
            // Leaflet uses 256px tiles, MapLibre 512px: the same scale differs by one zoom level.
            globe.jumpTo({ center: [center.lng, center.lat], zoom: Math.max(0, leaflet.getZoom() - 1) });
        } finally { syncing = false; }
    }

    function toLeaflet() {
        if (!active || syncing) return;
        syncing = true;
        try {
            const center = globe.getCenter();
            const zoom = Math.max(leaflet.getMinZoom(), Math.min(leaflet.getMaxZoom(), Math.round(globe.getZoom() + 1)));
            leaflet.setView([Math.max(-85, Math.min(85, center.lat)), center.lng], zoom, { animate: false });
        } finally { syncing = false; }
    }

    function eventData(latlng, originalEvent) {
        const point = leaflet.latLngToContainerPoint(latlng);
        return { latlng, containerPoint: point, layerPoint: leaflet.containerPointToLayerPoint(point), originalEvent };
    }

    function closePopup() {
        if (!popup) return;
        const previous = popup;
        popup = null;
        previous.remove();
    }

    function showPopup(event) {
        if (!active) return;
        closePopup();
        const original = event.popup;
        const position = original.getLatLng();
        const renderedContent = original.getElement()?.querySelector('.leaflet-popup-content');
        const content = renderedContent || original.getContent();
        if (!position || content == null) return;
        popupOrigin = original;
        popup = new maplibregl.Popup({ maxWidth: `${original.options.maxWidth || 320}px` })
            .setLngLat([position.lng, position.lat]);
        const contentParent = content instanceof HTMLElement ? content.parentNode : null;
        // Use Leaflet's rendered content, including function results and attached event listeners.
        if (content instanceof HTMLElement) popup.setDOMContent(content);
        else popup.setHTML(String(content));
        popup.on('close', () => {
            if (contentParent) contentParent.appendChild(content);
            if (popupOrigin !== original) return;
            popup = null;
            popupOrigin = null;
            leaflet.closePopup(original);
        });
        popup.addTo(globe);
    }

    function createMarker(layer) {
        const element = document.createElement('div');
        element.className = 'lss-globe-marker';
        const marker = new maplibregl.Marker({ element, anchor: 'center',
            draggable: Boolean(layer.dragging?.enabled()) });
        const record = { marker, element, icon: null, originalElement: null, dragging: false };
        for (const type of ['mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu', 'mouseover', 'mouseout']) {
            element.addEventListener(type, event => {
                event.stopPropagation();
                if (type === 'contextmenu') event.preventDefault();
                const data = eventData(layer.getLatLng(), event);
                // Leaflet's bound-popup click handler and game handlers run on the original layer.
                layer.fire(type, data, true);
                if (layer.options.bubblingMouseEvents) leaflet.fire(type, data);
            });
        }
        element.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.stopPropagation();
                layer.fire('click', eventData(layer.getLatLng(), event), true);
            }
        });
        marker.on('dragstart', () => {
            record.dragging = true;
            layer.fire('dragstart');
        });
        marker.on('drag', () => {
            const position = marker.getLngLat();
            layer.setLatLng([position.lat, position.lng]);
            layer.fire('drag', { latlng: layer.getLatLng() });
        });
        marker.on('dragend', () => {
            record.dragging = false;
            layer.fire('dragend', { latlng: layer.getLatLng() });
        });
        markers.set(layer, record);
        return record;
    }

    function refresh() {
        if (!active || stopped) return;
        const seen = new Set();
        const visited = new Set();
        const features = [];
        paths.clear();
        const visitLayer = layer => {
            if (visited.has(layer)) return;
            visited.add(layer);
            // LSS's canvasIconLayer owns stations/missions in its spatial index.
            // They are L.Markers, but are not registered as individual map layers.
            // Read the live index so removed markers and hidden filter groups stay absent.
            if (typeof layer._latlngsIdx?.all === 'function') {
                for (const marker of layer._latlngsIdx.all()) {
                    if (!layer._isMarkerHidden?.(marker)) visitLayer(marker);
                }
            }
            if (layer instanceof L.Marker) {
                seen.add(layer);
                const record = markers.get(layer) || createMarker(layer);
                const iconUrl = layer.options.icon.options?.iconUrl;
                const iconRetinaUrl = layer.options.icon.options?.iconRetinaUrl;
                if (record.icon !== layer.options.icon || record.originalElement !== layer.getElement()
                    || record.iconUrl !== iconUrl || record.iconRetinaUrl !== iconRetinaUrl) {
                    const icon = layer.options.icon.createIcon();
                    icon.classList.remove('leaflet-zoom-animated', 'leaflet-zoom-hide');
                    record.element.replaceChildren(icon);
                    record.icon = layer.options.icon;
                    record.originalElement = layer.getElement();
                    // Canvas updates mutate the existing icon instead of calling setIcon().
                    record.iconUrl = iconUrl;
                    record.iconRetinaUrl = iconRetinaUrl;
                }
                record.element.title = layer.options.title || '';
                record.element.setAttribute('aria-label', layer.options.title || layer.options.alt || 'Kartenmarker');
                record.element.tabIndex = layer.options.keyboard === false ? -1 : 0;
                record.element.style.opacity = String(layer.options.opacity ?? 1);
                record.element.style.zIndex = String(layer.options.zIndexOffset || 0);
                const position = layer.getLatLng();
                if (!record.dragging) {
                    record.marker.setLngLat([position.lng, position.lat]);
                }
                record.marker.setDraggable(Boolean(layer.dragging?.enabled()));
                if (!record.added) {
                    record.marker.addTo(globe);
                    record.added = true;
                }
            } else if (layer instanceof L.Polyline) {
                const id = L.stamp(layer);
                const feature = layer.toGeoJSON();
                feature.id = id;
                feature.properties = { color: layer.options.color || '#3388ff',
                    weight: layer.options.stroke === false ? 0 : (layer.options.weight ?? 3),
                    opacity: layer.options.opacity ?? 1,
                    fillColor: layer.options.fillColor || layer.options.color || '#3388ff',
                    fillOpacity: layer.options.fill === false ? 0 : (layer.options.fillOpacity ?? 0.2) };
                features.push(feature);
                paths.set(id, layer);
            }
        };
        leaflet.eachLayer(visitLayer);
        for (const [layer, record] of markers) {
            if (!seen.has(layer)) {
                record.marker.remove();
                markers.delete(layer);
            }
        }
        const data = { type: 'FeatureCollection', features };
        const signature = JSON.stringify(data);
        if (signature !== geometrySignature) {
            globe.getSource('lss-paths').setData(data);
            geometrySignature = signature;
        }
    }

    function onMapEvent(type, event) {
        if (!active) return;
        const latlng = L.latLng(event.lngLat.lat, event.lngLat.lng);
        const data = eventData(latlng, event.originalEvent);
        const hit = globe.queryRenderedFeatures(event.point, { layers: ['lss-lines', 'lss-fills'] })
            .map(feature => paths.get(feature.id))
            .find(layer => layer && layer.options.interactive !== false);
        if (hit) {
            hit.fire(type, data, true);
            if (hit.options.bubblingMouseEvents === false) return;
        }
        leaflet.fire(type, data);
    }

    function stop() {
        stopped = true;
        clearInterval(timer);
        clearTimeout(startupTimer);
        observer?.disconnect();
        leaflet.off('moveend zoomend', fromLeaflet);
        leaflet.off('popupopen', showPopup);
        leaflet.off('popupclose', closePopup);
        closePopup();
        for (const { marker } of markers.values()) marker.remove();
        markers.clear();
        globe?.remove();
        overlay.remove();
        styles.remove();
    }

    button.addEventListener('click', () => setActive(!active));
    worldButton.addEventListener('click', () => globe.flyTo({ zoom: 1, pitch: 0, bearing: 0 }));
    try {
        await new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = CSS;
            const timeout = setTimeout(() => reject(new Error('MapLibre CSS loading timed out.')), 15000);
            link.onload = () => { clearTimeout(timeout); resolve(); };
            link.onerror = () => { clearTimeout(timeout); reject(new Error('MapLibre CSS could not load.')); };
            document.head.appendChild(link);
        });
        const center = leaflet.getCenter();
        globe = new maplibregl.Map({ container: overlay, style: STYLE,
            center: [center.lng, center.lat], zoom: Math.max(0, leaflet.getZoom() - 1),
            minZoom: 0, maxZoom: Math.min(22, leaflet.getMaxZoom() - 1),
            attributionControl: true, renderWorldCopies: false });
        startupTimer = setTimeout(() => fail(new Error('Globe startup timed out.')), 30000);
        globe.on('error', event => {
            if (!ready) fail(event.error);
            else console.warn(PREFIX, 'Map resource could not load:', event.error);
        });
        globe.on('webglcontextlost', () => fail(new Error('WebGL context lost.')));
        globe.on('load', () => {
            if (stopped) return;
            try {
                globe.setProjection({ type: 'globe' });
                globe.addSource('lss-paths', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                globe.addLayer({ id: 'lss-fills', type: 'fill', source: 'lss-paths',
                    filter: ['==', ['geometry-type'], 'Polygon'],
                    paint: { 'fill-color': ['get', 'fillColor'], 'fill-opacity': ['get', 'fillOpacity'] } });
                globe.addLayer({ id: 'lss-lines', type: 'line', source: 'lss-paths',
                    paint: { 'line-color': ['get', 'color'], 'line-width': ['get', 'weight'],
                        'line-opacity': ['get', 'opacity'] } });
                globe.addControl(new maplibregl.NavigationControl(), 'bottom-right');
                globe.on('moveend', toLeaflet);
                for (const type of ['click', 'dblclick', 'contextmenu']) {
                    globe.on(type, event => onMapEvent(type, event));
                }
                leaflet.on('moveend zoomend', fromLeaflet);
                leaflet.on('popupopen', showPopup);
                leaflet.on('popupclose', closePopup);
                observer = new ResizeObserver(() => { if (active) globe.resize(); });
                observer.observe(host);
                ready = true;
                button.disabled = false;
                clearTimeout(startupTimer);
                setActive(true);
                timer = setInterval(() => {
                    try { refresh(); } catch (error) { fail(error); }
                }, 250);
            } catch (error) { fail(error); }
        });
        window.addEventListener('pagehide', event => {
            if (event.persisted) return;
            host.classList.remove('lss-globe-active');
            stop();
            control.remove();
        });
    } catch (error) { fail(error); }
})();
