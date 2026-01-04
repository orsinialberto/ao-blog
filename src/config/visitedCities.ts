import type { TravelCoords } from "@/lib/travels";

export interface VisitedCity {
  name: string;
  country: string;
  coords: TravelCoords;
  continent?: string; // Optional, for statistics
}

export const visitedCities: VisitedCity[] = [
  // Europa
  {
    name: "Dublino",
    country: "Irlanda",
    coords: { lat: 53.349805, lng: -6.26031 },
    continent: "Europa",
  },
  {
    name: "Praga",
    country: "Repubblica Ceca",
    coords: { lat: 50.075538, lng: 14.4378 },
    continent: "Europa",
  },
  {
    name: "Varsavia",
    country: "Polonia",
    coords: { lat: 52.229676, lng: 21.012229 },
    continent: "Europa",
  },
  {
    name: "Gand",
    country: "Belgio",
    coords: { lat: 51.05, lng: 3.7333 },
    continent: "Europa",
  },
  {
    name: "Barcellona",
    country: "Spagna",
    coords: { lat: 41.385064, lng: 2.173403 },
    continent: "Europa",
  },
  {
    name: "Edimburgo",
    country: "Regno Unito",
    coords: { lat: 55.953252, lng: -3.188267 },
    continent: "Europa",
  },
  {
    name: "Londra",
    country: "Regno Unito",
    coords: { lat: 51.507351, lng: -0.127758 },
    continent: "Europa",
  },
  {
    name: "Oslo",
    country: "Norvegia",
    coords: { lat: 59.913869, lng: 10.752245 },
    continent: "Europa",
  },
  {
    name: "Capo Nord",
    country: "Norvegia",
    coords: { lat: 71.171, lng: 25.7836 },
    continent: "Europa",
  },
  {
    name: "Parigi",
    country: "Francia",
    coords: { lat: 48.856614, lng: 2.352222 },
    continent: "Europa",
  },
  {
    name: "Monaco di Baviera",
    country: "Germania",
    coords: { lat: 48.135125, lng: 11.581981 },
    continent: "Europa",
  },
  {
    name: "Monte Carlo",
    country: "Monaco",
    coords: { lat: 43.7384, lng: 7.4246 },
    continent: "Europa",
  },
  // Africa
  {
    name: "Sharm el-Sheikh",
    country: "Egitto",
    coords: { lat: 27.915817, lng: 34.32995 },
    continent: "Africa",
  },
  // Asia
  {
    name: "Maldive",
    country: "Maldive",
    coords: { lat: 3.2028, lng: 73.2207 },
    continent: "Asia",
  },
  // Nord America
  {
    name: "Los Angeles",
    country: "Stati Uniti",
    coords: { lat: 34.052235, lng: -118.243683 },
    continent: "Nord America",
  },
  {
    name: "Grand Canyon",
    country: "Stati Uniti",
    coords: { lat: 36.1069, lng: -112.1129 },
    continent: "Nord America",
  },
  {
    name: "San Francisco",
    country: "Stati Uniti",
    coords: { lat: 37.774929, lng: -122.419416 },
    continent: "Nord America",
  },
  {
    name: "Negril",
    country: "Giamaica",
    coords: { lat: 18.2686, lng: -78.3472 },
    continent: "Nord America",
  },
  {
    name: "Santo Domingo",
    country: "Repubblica Dominicana",
    coords: { lat: 18.486058, lng: -69.931212 },
    continent: "Nord America",
  },
  {
    name: "Cancún",
    country: "Messico",
    coords: { lat: 21.161908, lng: -86.851528 },
    continent: "Nord America",
  },
  {
    name: "Las Vegas",
    country: "Stati Uniti",
    coords: { lat: 36.1699, lng: -115.1398 },
    continent: "Nord America",
  },
  // Europa - aggiunte
  {
    name: "Santorini",
    country: "Grecia",
    coords: { lat: 36.3932, lng: 25.4615 },
    continent: "Europa",
  },
  {
    name: "Porto",
    country: "Portogallo",
    coords: { lat: 41.1496, lng: -8.611 },
    continent: "Europa",
  },
  {
    name: "Lugano",
    country: "Svizzera",
    coords: { lat: 46.006182, lng: 8.951142 },
    continent: "Europa",
  },
  {
    name: "Innsbruck",
    country: "Austria",
    coords: { lat: 47.2627, lng: 11.3945 },
    continent: "Europa",
  },
];

