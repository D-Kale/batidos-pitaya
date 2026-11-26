import menuData from "./menu.json";
import { site, branches, club } from "./site";
import type { Branch } from "./site";

export { site, branches, club };
export type { Branch };

export interface MenuItem {
  id: string;
  name: string;
  star?: boolean;
  image?: string;
  ingredients?: string;
  base?: string;
  toppings?: string;
  options?: string;
  price?: number;
  prices?: { normal: number; small: number };
  priceVariants?: { label: string; price: number }[];
}

export interface MenuCategory {
  id: string;
  name: string;
  note?: string;
  sizeNote?: string;
  prices?: { normal: number; small: number };
  items: MenuItem[];
}

export const menu = menuData as { categories: MenuCategory[] };

export const WA_MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

export function formatPrice(n: number) {
  return `C$ ${n}`;
}
