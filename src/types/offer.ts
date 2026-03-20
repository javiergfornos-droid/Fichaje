/** Offer status matching DB constraint */
export type OfferStatus = "pending" | "accepted" | "rejected" | "expired";

/** Offer data from the offers table */
export interface Offer {
  id: string;
  shirt_id: string;
  user_id: string;
  amount_cents: number;
  status: OfferStatus;
  created_at: string;
  responded_at: string | null;
}
