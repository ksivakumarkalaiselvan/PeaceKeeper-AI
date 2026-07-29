import { getToken } from './auth.js';

export function initMap(elementId, center = [25.0, 45.0], zoom = 3) {
  if (!document.getElementById(elementId)) return null;

  // Initialize Leaflet map
  const map = L.map(elementId).setView(center, zoom);

  // CartoDB Dark Matter tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  return map;
}

export function addThreatMarkers(map, pins) {
  if (!map || !pins) return;

  pins.forEach(pin => {
    let color = '#00F0FF';
    if (pin.riskLevel === 'Critical') color = '#FF0055';
    if (pin.riskLevel === 'High') color = '#FF7700';
    if (pin.riskLevel === 'Medium') color = '#FFB703';

    // Custom circle marker
    const marker = L.circleMarker([pin.lat, pin.lng], {
      radius: pin.riskLevel === 'Critical' ? 12 : 8,
      fillColor: color,
      color: '#FFFFFF',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map);

    // Popup card
    const popupContent = `
      <div style="font-family: Inter, sans-serif; padding: 6px; color: #0F172A; min-width: 180px;">
        <strong style="font-size: 13px; color: ${color};">${pin.title}</strong><br/>
        <small style="color: #475569;">${pin.country || pin.region || 'Global Zone'}</small><br/>
        <div style="margin-top: 6px; font-size: 11px;">
          <strong>Risk Level:</strong> ${pin.riskLevel || 'N/A'}<br/>
          <strong>Risk Index:</strong> ${pin.riskPercentage || 'N/A'}%
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    // Add demilitarized buffer zone radius for high risk
    if (pin.riskLevel === 'Critical' || pin.bufferZoneFlag) {
      L.circle([pin.lat, pin.lng], {
        radius: 400000,
        color: color,
        fillColor: color,
        fillOpacity: 0.1,
        dashArray: '4, 8'
      }).addTo(map);
    }
  });
}

/**
 * Adds Interactive GeoJSON Country Layer with Hover Tooltip & Click Handlers
 */
export function addCountryGeoJSON(map, geojsonData, onSelectCountryCallback) {
  if (!map || !geojsonData) return;

  L.geoJSON(geojsonData, {
    style: (feature) => {
      const risk = feature.properties.riskPercentage || 20;
      let fillColor = '#00E676'; // Low risk
      if (risk >= 76) fillColor = '#FF0055';
      else if (risk >= 51) fillColor = '#FF7700';
      else if (risk >= 26) fillColor = '#FFB703';

      return {
        fillColor,
        weight: 1.5,
        opacity: 0.8,
        color: '#00F0FF',
        dashArray: '3',
        fillOpacity: 0.25
      };
    },
    onEachFeature: (feature, layer) => {
      const props = feature.properties;
      const riskColor = props.riskPercentage >= 76 ? '#FF0055' : (props.riskPercentage >= 51 ? '#FF7700' : '#00F0FF');

      // 1. Tooltip on Hover
      const conflictBadge = props.hasActiveConflict
        ? `<div style="margin-top:6px; padding:3px 8px; border-radius:4px; background:rgba(255,0,85,0.25); border:1px solid #FF0055; color:#FF0055; font-weight:700; font-size:10px; display:inline-block;">🔥 ACTIVE WAR / CONFLICT ZONE</div>`
        : `<div style="margin-top:6px; padding:3px 8px; border-radius:4px; background:rgba(0,230,118,0.2); border:1px solid #00E676; color:#00E676; font-weight:700; font-size:10px; display:inline-block;">🛡️ STABLE / LOW CONFLICT RISK</div>`;

      const tooltipContent = `
        <div style="font-family:Inter, sans-serif; background:#0B132B; color:#F1F5F9; padding:10px 12px; border-radius:8px; border:1px solid var(--border-highlight); box-shadow:0 10px 25px rgba(0,0,0,0.6); min-width:210px;">
          <h4 style="margin:0 0 4px 0; font-size:14px; color:#fff;">${props.name}</h4>
          <div style="font-size:12px; margin-bottom:4px;">
            <strong>Current Risk Level:</strong> <span style="color:${riskColor}; font-weight:700;">${props.riskPercentage}% (${props.riskLevel})</span>
          </div>
          <p style="margin:4px 0 6px 0; font-size:11px; color:#94A3B8;">${props.shortDescription}</p>
          ${conflictBadge}
        </div>
      `;

      layer.bindTooltip(tooltipContent, {
        sticky: true,
        className: 'custom-country-tooltip',
        direction: 'auto'
      });

      // Hover Effect
      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({
            weight: 3,
            color: '#FFFFFF',
            fillOpacity: 0.5
          });
          l.bringToFront();
        },
        mouseout: (e) => {
          const l = e.target;
          l.setStyle({
            weight: 1.5,
            color: '#00F0FF',
            fillOpacity: 0.25
          });
        },
        click: () => {
          if (onSelectCountryCallback) {
            onSelectCountryCallback(props);
          }
        }
      });
    }
  }).addTo(map);
}
