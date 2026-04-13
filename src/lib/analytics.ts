/**
 * Lightweight analytics façade. Calls a global `window.fichajeAnalytics`
 * if present (real provider plugged in via script), otherwise logs to
 * console in development. Centralising here means we can swap providers
 * (Plausible, Posthog, Segment) without touching components.
 */

type EventName =
  // Discovery
  | "search_submit"
  | "search_suggestion_click"
  | "search_no_results"
  | "filter_apply"
  | "filter_clear"
  | "sort_change"
  | "browse_viewed"
  | "breadcrumb_click"
  | "locale_changed"
  // PDP
  | "product_viewed"
  | "gallery_image_viewed"
  | "image_zoom_opened"
  | "fit_info_viewed"
  | "specs_expanded"
  | "faq_expanded"
  | "related_click"
  | "recently_viewed_click"
  // Cart
  | "add_to_cart"
  | "add_to_cart_confirmed"
  | "remove_from_cart"
  | "cart_drawer_opened"
  | "cart_drawer_checkout_click"
  | "cart_drawer_continue_click"
  | "free_ship_threshold_hit"
  | "coupon_toggled"
  | "coupon_applied"
  | "coupon_invalid"
  // Wishlist
  | "wishlist_add"
  | "wishlist_remove"
  | "wishlist_to_cart"
  // Checkout
  | "checkout_started"
  | "checkout_completed"
  | "field_error"
  | "field_corrected"
  | "payment_method_selected"
  // Post-purchase
  | "order_confirmation_viewed"
  | "track_order_click"
  // Help
  | "contact_click"
  | "returns_policy_click";

interface AnalyticsProvider {
  track: (event: EventName, props?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    fichajeAnalytics?: AnalyticsProvider;
  }
}

export function track(event: EventName, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (window.fichajeAnalytics) {
    window.fichajeAnalytics.track(event, props);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props ?? {});
  }
}
