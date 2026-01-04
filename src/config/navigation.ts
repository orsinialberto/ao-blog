import { strings } from "./strings";

export interface NavLink {
  href: string;
  label: string;
}

export const navigationLinks: NavLink[] = [
  { href: "/", label: strings.navigation.links.home },
  { href: "/viaggi", label: strings.navigation.links.travels },
  { href: "/galleria", label: strings.navigation.links.gallery },
  { href: "/about", label: strings.navigation.links.about },
];

