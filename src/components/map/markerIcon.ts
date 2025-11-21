import L from "leaflet";

export function createTravelMarkerIcon() {
  return L.divIcon({
    html: '<span class="travel-marker"></span>',
    className: "travel-marker-wrapper",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

