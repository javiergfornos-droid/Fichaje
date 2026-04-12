import type { ShirtType, ShirtSize } from "./shirt";

/** Item stored in the cart. Each vintage shirt is unique, so quantity is always 1. */
export interface CartItem {
  shirtId: string;
  slug: string;
  name: string;
  season: string;
  type: ShirtType;
  size: ShirtSize;
  brand: string;
  playerName: string | null;
  priceCents: number;
  currency: string;
  clubId: string;
  clubName: string;
  imageUrl: string | null;
}

/** Item stored in the wishlist ("cartera"). */
export interface WishlistItem {
  shirtId: string;
  slug: string;
  name: string;
  season: string;
  size: ShirtSize;
  priceCents: number;
  currency: string;
  clubId: string;
  clubName: string;
  imageUrl: string | null;
}
