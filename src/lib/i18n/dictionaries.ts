import type { Locale } from "@/contexts/I18nContext";

export type TranslationKey =
  // Nav + header
  | "nav.explore"
  | "nav.map"
  | "nav.wishlist"
  | "nav.account"
  | "nav.cart"
  | "nav.search.placeholder"
  | "nav.search.label"
  | "nav.search.noResults"
  | "nav.search.recentHeader"
  | "nav.menu"
  | "nav.language"
  // Common
  | "common.back"
  | "common.close"
  | "common.apply"
  | "common.cancel"
  | "common.continueShopping"
  | "common.viewCart"
  | "common.loading"
  | "common.free"
  | "common.vatIncluded"
  | "common.uniquePiece"
  | "common.results"
  | "common.result"
  | "common.remove"
  | "common.required"
  // Product / PDP
  | "pdp.addToCart"
  | "pdp.inCart"
  | "pdp.soldOut"
  | "pdp.addToWishlist"
  | "pdp.inWishlist"
  | "pdp.size"
  | "pdp.type"
  | "pdp.stock"
  | "pdp.stockAvailable"
  | "pdp.stockSold"
  | "pdp.fit"
  | "pdp.fit.slim"
  | "pdp.fit.regular"
  | "pdp.fit.oversized"
  | "pdp.fitInfo"
  | "pdp.materials"
  | "pdp.materialsBody"
  | "pdp.care"
  | "pdp.careBody"
  | "pdp.story"
  | "pdp.conditionTitle"
  | "pdp.conditionSubtitle"
  | "pdp.statGeneral"
  | "pdp.statBrightness"
  | "pdp.statColor"
  | "pdp.statFeatures"
  | "pdp.zoomHint"
  | "pdp.galleryLabel"
  | "pdp.imageIndex"
  | "pdp.addedToast"
  | "pdp.wishlistAddedToast"
  | "pdp.wishlistRemovedToast"
  | "pdp.related"
  | "pdp.recentlyViewed"
  | "pdp.faqTitle"
  | "pdp.authNote"
  // Shirt (retro ficha) CTAs
  | "shirt.cta.buy_now"
  | "shirt.cta.buy_now_hint"
  | "shirt.cta.make_offer"
  | "shirt.cta.make_offer_hint"
  | "shirt.cta.wishlist"
  | "shirt.cta.wishlist_hint"
  // Shipping
  | "shipping.title"
  | "shipping.speed"
  | "shipping.returns"
  | "shipping.authenticity"
  // Cart
  | "cart.title"
  | "cart.empty.title"
  | "cart.empty.description"
  | "cart.empty.cta"
  | "cart.itemsCount"
  | "cart.subtotal"
  | "cart.shipping"
  | "cart.shippingEstimated"
  | "cart.total"
  | "cart.payCta"
  | "cart.wishlistFallback"
  | "cart.moveToWishlist"
  | "cart.freeShipAt"
  | "cart.freeShipRemaining"
  | "cart.freeShipReached"
  | "cart.coupon.toggle"
  | "cart.coupon.placeholder"
  | "cart.coupon.apply"
  | "cart.coupon.invalid"
  | "cart.coupon.applied"
  | "cart.secureNotice"
  // Checkout
  | "checkout.title"
  | "checkout.contact"
  | "checkout.contact.helper"
  | "checkout.shipping"
  | "checkout.payment"
  | "checkout.email"
  | "checkout.firstName"
  | "checkout.lastName"
  | "checkout.address"
  | "checkout.postalCode"
  | "checkout.city"
  | "checkout.country"
  | "checkout.emailInvalid"
  | "checkout.required"
  | "checkout.payCta"
  | "checkout.processing"
  | "checkout.pmCard"
  | "checkout.pmCardDesc"
  | "checkout.pmBizum"
  | "checkout.pmBizumDesc"
  | "checkout.pmApple"
  | "checkout.pmGoogle"
  | "checkout.pmPaypal"
  | "checkout.legalNotice"
  | "checkout.guestBadge"
  | "checkout.summaryTitle"
  | "checkout.addressHelper"
  | "checkout.errorGeneric"
  // Success
  | "success.title"
  | "success.subtitle"
  | "success.orderNumber"
  | "success.nextSteps"
  | "success.next1"
  | "success.next2"
  | "success.next3"
  | "success.trackOrder"
  | "success.keepShopping"
  | "success.questionsTitle"
  | "success.questionsBody"
  // Wishlist
  | "wishlist.title"
  | "wishlist.description"
  | "wishlist.empty.title"
  | "wishlist.empty.description"
  | "wishlist.empty.cta"
  | "wishlist.move"
  // Browse
  | "browse.title"
  | "browse.subtitle"
  | "browse.filters"
  | "browse.clearFilters"
  | "browse.sort"
  | "browse.sort.featured"
  | "browse.sort.priceAsc"
  | "browse.sort.priceDesc"
  | "browse.sort.newest"
  | "browse.filter.size"
  | "browse.filter.type"
  | "browse.filter.brand"
  | "browse.filter.maxPrice"
  | "browse.noResults.title"
  | "browse.noResults.description"
  | "browse.noResults.cta"
  // Footer
  | "footer.help"
  | "footer.contact"
  | "footer.returns"
  | "footer.faq"
  | "footer.shipping"
  | "footer.terms"
  | "footer.privacy"
  | "footer.tagline"
  | "footer.needHelp";

type Dictionary = Record<TranslationKey, string>;

const es: Dictionary = {
  "nav.explore": "Explorar",
  "nav.map": "Mapa",
  "nav.wishlist": "Cartera",
  "nav.account": "Cuenta",
  "nav.cart": "Carrito",
  "nav.search.placeholder": "Buscar camisetas, clubes, jugadores…",
  "nav.search.label": "Buscar camisetas, clubes, jugadores",
  "nav.search.noResults": "Sin coincidencias — prueba con otra palabra",
  "nav.search.recentHeader": "Búsquedas recientes",
  "nav.menu": "Menú",
  "nav.language": "Idioma",

  "common.back": "Volver",
  "common.close": "Cerrar",
  "common.apply": "Aplicar",
  "common.cancel": "Cancelar",
  "common.continueShopping": "Seguir fichando",
  "common.viewCart": "Ver carrito",
  "common.loading": "Cargando…",
  "common.free": "Gratis",
  "common.vatIncluded": "IVA incluido",
  "common.uniquePiece": "Pieza única",
  "common.results": "resultados",
  "common.result": "resultado",
  "common.remove": "Eliminar",
  "common.required": "obligatorio",

  "pdp.addToCart": "Fichar",
  "pdp.inCart": "En el carrito",
  "pdp.soldOut": "Fichado",
  "pdp.addToWishlist": "Poner en cartera",
  "pdp.inWishlist": "En tu cartera",
  "pdp.size": "Talla",
  "pdp.type": "Tipo",
  "pdp.stock": "Stock",
  "pdp.stockAvailable": "1 disponible",
  "pdp.stockSold": "Agotado",
  "pdp.fit": "Corte",
  "pdp.fit.slim": "Ajustado",
  "pdp.fit.regular": "Regular",
  "pdp.fit.oversized": "Oversized",
  "pdp.fitInfo": "Medido sobre cuerpo. Las camisetas vintage suelen venir con una talla más holgada.",
  "pdp.materials": "Materiales",
  "pdp.materialsBody": "100% poliéster. Tejido original de la época, con el peso y la textura auténticos del año de fabricación.",
  "pdp.care": "Cuidados",
  "pdp.careBody": "Lavar a mano o en frío (30°). No planchar los escudos ni los números. Secar a la sombra.",
  "pdp.story": "Historia",
  "pdp.conditionTitle": "Estado de la camiseta",
  "pdp.conditionSubtitle": "Evaluación realizada por nuestros expertos antes del fichaje. Cada camiseta es una pieza única, irrepetible.",
  "pdp.statGeneral": "Estado general",
  "pdp.statBrightness": "Brillo",
  "pdp.statColor": "Integridad color",
  "pdp.statFeatures": "Características",
  "pdp.zoomHint": "Toca la imagen para ampliar",
  "pdp.galleryLabel": "Imágenes del producto",
  "pdp.imageIndex": "Imagen {current} de {total}",
  "pdp.addedToast": "Fichaje añadido al carrito",
  "pdp.wishlistAddedToast": "Añadido a la cartera",
  "pdp.wishlistRemovedToast": "Quitado de la cartera",
  "pdp.related": "También te puede interesar",
  "pdp.recentlyViewed": "Vistas recientemente",
  "pdp.faqTitle": "Preguntas frecuentes",
  "pdp.authNote": "Todas las piezas pasan por un proceso de autenticación y evaluación de estado antes de entrar al mercado.",

  "shirt.cta.buy_now": "PAGAR TRASPASO",
  "shirt.cta.buy_now_hint": "Comprar ya al precio marcado",
  "shirt.cta.make_offer": "HACER OFERTA",
  "shirt.cta.make_offer_hint": "Pide bajar el precio",
  "shirt.cta.wishlist": "MANDAR UN OJEADOR",
  "shirt.cta.wishlist_hint": "Guardar en wishlist para seguir la pieza",

  "shipping.title": "Envío y garantías",
  "shipping.speed": "Envío 24-48h — España peninsular. Gratis en pedidos superiores a 500 €.",
  "shipping.returns": "Devoluciones 14 días — Reembolso íntegro si no es lo que esperabas.",
  "shipping.authenticity": "Autenticidad garantizada — Verificado por nuestros expertos.",

  "cart.title": "Tu carrito",
  "cart.empty.title": "Tu carrito está vacío",
  "cart.empty.description": "Explora el mapa y ficha camisetas únicas de clubes de todo el mundo.",
  "cart.empty.cta": "Explorar camisetas",
  "cart.itemsCount": "artículos",
  "cart.subtotal": "Subtotal",
  "cart.shipping": "Envío",
  "cart.shippingEstimated": "estimado",
  "cart.total": "Total",
  "cart.payCta": "Pagar el fichaje",
  "cart.wishlistFallback": "Poner en cartera y volver luego",
  "cart.moveToWishlist": "↯ Mover a la cartera",
  "cart.freeShipAt": "Envío gratis al superar {amount}",
  "cart.freeShipRemaining": "Añade {amount} más para envío gratis",
  "cart.freeShipReached": "¡Envío gratis desbloqueado!",
  "cart.coupon.toggle": "¿Tienes un código?",
  "cart.coupon.placeholder": "Código de descuento",
  "cart.coupon.apply": "Aplicar",
  "cart.coupon.invalid": "Código no válido",
  "cart.coupon.applied": "Código aplicado",
  "cart.secureNotice": "Pago seguro mediante Stripe. Cancelación gratuita antes del envío.",

  "checkout.title": "Completar fichaje",
  "checkout.contact": "Contacto",
  "checkout.contact.helper": "Te enviaremos el resumen y el seguimiento a este email.",
  "checkout.shipping": "Dirección de envío",
  "checkout.payment": "Método de pago",
  "checkout.email": "Email",
  "checkout.firstName": "Nombre",
  "checkout.lastName": "Apellidos",
  "checkout.address": "Dirección",
  "checkout.postalCode": "Código postal",
  "checkout.city": "Ciudad",
  "checkout.country": "País",
  "checkout.emailInvalid": "Introduce un email válido",
  "checkout.required": "Este campo es obligatorio",
  "checkout.payCta": "Pagar el fichaje",
  "checkout.processing": "Procesando…",
  "checkout.pmCard": "Tarjeta de crédito/débito",
  "checkout.pmCardDesc": "Procesado de forma segura por Stripe.",
  "checkout.pmBizum": "Bizum",
  "checkout.pmBizumDesc": "Paga desde tu móvil en segundos.",
  "checkout.pmApple": "Apple Pay",
  "checkout.pmGoogle": "Google Pay",
  "checkout.pmPaypal": "PayPal",
  "checkout.legalNotice": "Al pagar aceptas nuestras condiciones de venta y la política de devoluciones de 14 días.",
  "checkout.guestBadge": "Checkout sin cuenta — no necesitas registrarte.",
  "checkout.summaryTitle": "Resumen",
  "checkout.addressHelper": "Empieza a escribir tu dirección para ver sugerencias",
  "checkout.errorGeneric": "No hemos podido procesar el pago. Revisa los datos e inténtalo de nuevo.",

  "success.title": "¡Fichaje completado!",
  "success.subtitle": "Tu camiseta está en camino. Te hemos enviado un email con los detalles.",
  "success.orderNumber": "Nº de pedido",
  "success.nextSteps": "Próximos pasos",
  "success.next1": "Recibirás un email de confirmación en los próximos minutos.",
  "success.next2": "Preparamos y autenticamos el pedido en 24h.",
  "success.next3": "Te enviamos el número de seguimiento cuando salga a reparto.",
  "success.trackOrder": "Hacer seguimiento del pedido",
  "success.keepShopping": "Seguir fichando",
  "success.questionsTitle": "¿Tienes dudas?",
  "success.questionsBody": "Escríbenos a hola@fichaje.com o visita el centro de ayuda.",

  "wishlist.title": "Mi cartera",
  "wishlist.description": "Camisetas guardadas para más tarde. Piezas únicas — si alguien la ficha antes, ya no estará disponible.",
  "wishlist.empty.title": "Tu cartera está vacía",
  "wishlist.empty.description": "Guarda aquí las camisetas que quieres seguir de cerca. Podrás volver a ellas cuando estés listo para fichar.",
  "wishlist.empty.cta": "Explorar camisetas",
  "wishlist.move": "Fichar",

  "browse.title": "Explorar camisetas",
  "browse.subtitle": "Piezas únicas, autenticadas, listas para fichar.",
  "browse.filters": "Filtros",
  "browse.clearFilters": "Limpiar",
  "browse.sort": "Ordenar por",
  "browse.sort.featured": "Destacados",
  "browse.sort.priceAsc": "Precio: menor a mayor",
  "browse.sort.priceDesc": "Precio: mayor a menor",
  "browse.sort.newest": "Más recientes",
  "browse.filter.size": "Talla",
  "browse.filter.type": "Equipación",
  "browse.filter.brand": "Marca",
  "browse.filter.maxPrice": "Precio máximo",
  "browse.noResults.title": "No hemos encontrado camisetas",
  "browse.noResults.description": "Prueba a quitar algún filtro o a subir el precio máximo.",
  "browse.noResults.cta": "Quitar filtros",

  "footer.help": "Ayuda",
  "footer.contact": "Contacto",
  "footer.returns": "Devoluciones",
  "footer.faq": "Preguntas frecuentes",
  "footer.shipping": "Envíos",
  "footer.terms": "Términos",
  "footer.privacy": "Privacidad",
  "footer.tagline": "Camisetas de fútbol vintage originales",
  "footer.needHelp": "¿Necesitas ayuda?",
};

const en: Dictionary = {
  "nav.explore": "Browse",
  "nav.map": "Map",
  "nav.wishlist": "Wishlist",
  "nav.account": "Account",
  "nav.cart": "Cart",
  "nav.search.placeholder": "Search shirts, clubs, players…",
  "nav.search.label": "Search shirts, clubs, players",
  "nav.search.noResults": "No matches — try a different keyword",
  "nav.search.recentHeader": "Recent searches",
  "nav.menu": "Menu",
  "nav.language": "Language",

  "common.back": "Back",
  "common.close": "Close",
  "common.apply": "Apply",
  "common.cancel": "Cancel",
  "common.continueShopping": "Keep shopping",
  "common.viewCart": "View cart",
  "common.loading": "Loading…",
  "common.free": "Free",
  "common.vatIncluded": "VAT included",
  "common.uniquePiece": "Unique piece",
  "common.results": "results",
  "common.result": "result",
  "common.remove": "Remove",
  "common.required": "required",

  "pdp.addToCart": "Sign it",
  "pdp.inCart": "In your cart",
  "pdp.soldOut": "Signed",
  "pdp.addToWishlist": "Save to wishlist",
  "pdp.inWishlist": "In your wishlist",
  "pdp.size": "Size",
  "pdp.type": "Type",
  "pdp.stock": "Stock",
  "pdp.stockAvailable": "1 in stock",
  "pdp.stockSold": "Sold out",
  "pdp.fit": "Fit",
  "pdp.fit.slim": "Slim",
  "pdp.fit.regular": "Regular",
  "pdp.fit.oversized": "Oversized",
  "pdp.fitInfo": "Measured on body. Vintage shirts usually run one size looser than modern fits.",
  "pdp.materials": "Materials",
  "pdp.materialsBody": "100% polyester. Original era fabric, retaining the authentic weight and texture of the manufacturing year.",
  "pdp.care": "Care",
  "pdp.careBody": "Hand wash or cold cycle (30°C). Do not iron over the crests or numbers. Dry in the shade.",
  "pdp.story": "Story",
  "pdp.conditionTitle": "Condition",
  "pdp.conditionSubtitle": "Assessed by our specialists before going on sale. Every shirt is a unique, unrepeatable piece.",
  "pdp.statGeneral": "Overall",
  "pdp.statBrightness": "Brightness",
  "pdp.statColor": "Colour integrity",
  "pdp.statFeatures": "Features",
  "pdp.zoomHint": "Tap image to zoom",
  "pdp.galleryLabel": "Product images",
  "pdp.imageIndex": "Image {current} of {total}",
  "pdp.addedToast": "Signing added to cart",
  "pdp.wishlistAddedToast": "Saved to wishlist",
  "pdp.wishlistRemovedToast": "Removed from wishlist",
  "pdp.related": "You might also like",
  "pdp.recentlyViewed": "Recently viewed",
  "pdp.faqTitle": "Frequently asked",
  "pdp.authNote": "Every piece goes through authentication and condition assessment before hitting the marketplace.",

  "shirt.cta.buy_now": "BUY NOW",
  "shirt.cta.buy_now_hint": "Buy now at list price",
  "shirt.cta.make_offer": "MAKE AN OFFER",
  "shirt.cta.make_offer_hint": "Request a lower price",
  "shirt.cta.wishlist": "SEND A SCOUT",
  "shirt.cta.wishlist_hint": "Save to wishlist to track this piece",

  "shipping.title": "Shipping & guarantees",
  "shipping.speed": "24–48h shipping within mainland Spain. Free on orders over €500.",
  "shipping.returns": "14-day returns — full refund if it isn't what you expected.",
  "shipping.authenticity": "Authenticity guaranteed — verified by our specialists.",

  "cart.title": "Your cart",
  "cart.empty.title": "Your cart is empty",
  "cart.empty.description": "Browse the map and sign unique shirts from clubs around the world.",
  "cart.empty.cta": "Browse shirts",
  "cart.itemsCount": "items",
  "cart.subtotal": "Subtotal",
  "cart.shipping": "Shipping",
  "cart.shippingEstimated": "estimated",
  "cart.total": "Total",
  "cart.payCta": "Pay & sign",
  "cart.wishlistFallback": "Save to wishlist and come back later",
  "cart.moveToWishlist": "↯ Move to wishlist",
  "cart.freeShipAt": "Free shipping above {amount}",
  "cart.freeShipRemaining": "Add {amount} more to get free shipping",
  "cart.freeShipReached": "Free shipping unlocked!",
  "cart.coupon.toggle": "Got a code?",
  "cart.coupon.placeholder": "Discount code",
  "cart.coupon.apply": "Apply",
  "cart.coupon.invalid": "Invalid code",
  "cart.coupon.applied": "Code applied",
  "cart.secureNotice": "Secure payment powered by Stripe. Free cancellation before dispatch.",

  "checkout.title": "Complete your signing",
  "checkout.contact": "Contact",
  "checkout.contact.helper": "We'll send the receipt and tracking to this email.",
  "checkout.shipping": "Shipping address",
  "checkout.payment": "Payment method",
  "checkout.email": "Email",
  "checkout.firstName": "First name",
  "checkout.lastName": "Last name",
  "checkout.address": "Address",
  "checkout.postalCode": "Postal code",
  "checkout.city": "City",
  "checkout.country": "Country",
  "checkout.emailInvalid": "Enter a valid email",
  "checkout.required": "This field is required",
  "checkout.payCta": "Pay & sign",
  "checkout.processing": "Processing…",
  "checkout.pmCard": "Credit/debit card",
  "checkout.pmCardDesc": "Securely processed by Stripe.",
  "checkout.pmBizum": "Bizum",
  "checkout.pmBizumDesc": "Pay from your phone in seconds.",
  "checkout.pmApple": "Apple Pay",
  "checkout.pmGoogle": "Google Pay",
  "checkout.pmPaypal": "PayPal",
  "checkout.legalNotice": "By paying you accept our sale terms and the 14-day returns policy.",
  "checkout.guestBadge": "Guest checkout — no account required.",
  "checkout.summaryTitle": "Summary",
  "checkout.addressHelper": "Start typing your address to see suggestions",
  "checkout.errorGeneric": "We couldn't process the payment. Please check your details and try again.",

  "success.title": "Signing complete!",
  "success.subtitle": "Your shirt is on its way. We've emailed you the details.",
  "success.orderNumber": "Order #",
  "success.nextSteps": "What's next",
  "success.next1": "You'll get a confirmation email in the next few minutes.",
  "success.next2": "We authenticate and prepare the parcel within 24h.",
  "success.next3": "We'll send the tracking number as soon as it ships.",
  "success.trackOrder": "Track my order",
  "success.keepShopping": "Keep shopping",
  "success.questionsTitle": "Questions?",
  "success.questionsBody": "Email us at hello@fichaje.com or visit the help centre.",

  "wishlist.title": "My wishlist",
  "wishlist.description": "Shirts saved for later. Unique pieces — if someone signs first, it's gone.",
  "wishlist.empty.title": "Your wishlist is empty",
  "wishlist.empty.description": "Save the shirts you want to keep an eye on here. Come back when you're ready to sign.",
  "wishlist.empty.cta": "Browse shirts",
  "wishlist.move": "Sign it",

  "browse.title": "Browse shirts",
  "browse.subtitle": "Unique, authenticated pieces ready to sign.",
  "browse.filters": "Filters",
  "browse.clearFilters": "Clear",
  "browse.sort": "Sort by",
  "browse.sort.featured": "Featured",
  "browse.sort.priceAsc": "Price: low to high",
  "browse.sort.priceDesc": "Price: high to low",
  "browse.sort.newest": "Newest",
  "browse.filter.size": "Size",
  "browse.filter.type": "Kit",
  "browse.filter.brand": "Brand",
  "browse.filter.maxPrice": "Max price",
  "browse.noResults.title": "No shirts found",
  "browse.noResults.description": "Try removing a filter or raising the max price.",
  "browse.noResults.cta": "Clear filters",

  "footer.help": "Help",
  "footer.contact": "Contact",
  "footer.returns": "Returns",
  "footer.faq": "FAQ",
  "footer.shipping": "Shipping",
  "footer.terms": "Terms",
  "footer.privacy": "Privacy",
  "footer.tagline": "Original vintage football shirts",
  "footer.needHelp": "Need help?",
};

export const dictionaries: Record<Locale, Dictionary> = { es, en };
