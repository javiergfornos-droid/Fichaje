# Fichaje Mundial

Tienda e-commerce de camisetas de fútbol vintage con estética arcade años 90.

## Concepto general

El sitio se divide en dos secciones con estéticas visuales distintas pero complementarias:

1. **Fichaje** (clubes) — estética **PC Fútbol 5.0 (1996)**, interfaz tipo Football Manager.
2. **World Hype** (selecciones) — estética **Super Sidekicks / Tecmo** (arcade Neo Geo 1993).

La marca paraguas que engloba ambas secciones es **"Fichaje Mundial"**.

> **Regla de marca:** "Fichaje Mundial" es un nombre propio y **NO se traduce jamás**, ni al inglés ni a ningún otro idioma.

## Idiomas e internacionalización

- Español (idioma por defecto) e inglés, con toggle en el header.
- **Sección Fichaje:** totalmente bilingüe (ES/EN).
- **Sección World Hype:** **SIEMPRE en inglés**, como decisión narrativa — son arcades americanos de 1993, la estética exige texto en inglés.
- Traducciones concretas de términos del dominio:
  - "Fichaje" (ES) → **"Transfer"** (EN) — nombre del modo.
  - "Pon en Cartera" (ES) → **"Scout"** (EN) — botón wishlist.

## Stack técnico

| Área | Tecnología |
|---|---|
| Framework | Next.js 15 + TypeScript + Tailwind |
| Base de datos | Supabase (schema en `/supabase/schema.sql`, ya actualizado a v2) |
| Storage de fotos | Supabase Storage |
| Mapas | `react-simple-maps` + dataset `world-atlas` |
| Banderas | librería `flag-icons` (clases CSS) |
| Deploy | Vercel desde GitHub |
| Fuentes | Press Start 2P (arcade), VT323 (mono), Oswald (UI), Bebas Neue (marca) |

## Decisiones de producto ya tomadas

- **Sistema de ofertas** con descuento **máximo -25%** (un trigger de DB ya enforza este tope).
- Aviso estilo **"Director Deportivo"** cuando la oferta del usuario sea demasiado baja.
- **Checkout guest permitido** — no es obligatorio registrarse para comprar.
- **Perfiles públicos opcionales** (estilo Letterboxd) — ya existen en la DB, pero **sin prominencia en la UI hasta nueva orden**.
- **Tres pasarelas de pago futuras:** Stripe + PayPal + Redsys Sabadell.
- **5 fotos por camiseta** con slots fijos: `front_full`, `front_close`, `back_full`, `back_close`, `label`.
- **4 stats estilo Football Manager** por camiseta: `stat_condition`, `stat_color`, `stat_integrity`, `stat_iconicity`.
- **Defaults de stats:** 88 / 85 / 90 / 75.

## Campos privados y seguridad

- `purchase_cost_cents` **NUNCA se expone al frontend**.
- El frontend lee siempre desde la vista **`public_shirts`**, que omite este campo y cualquier otro sensible.

## Estructura de rutas (planificada)

| Ruta | Propósito |
|---|---|
| `/` | Landing arcade: máquina recreativa con dos juegos (Fichaje / World Hype) |
| `/fichaje` | Mapa de Europa/Sudamérica estilo PC Fútbol |
| `/fichaje/pais/:id` | Panel de clubes del país |
| `/fichaje/club/:id` | Plantilla con camisetas del club |
| `/fichaje/camiseta/:id` | Ficha detalle tipo jugador |
| `/world-hype` | Mapa de Norteamérica con ciudades del Mundial 2026 |
| `/world-hype/ciudad/:id` | Popup con países asociados a la ciudad |
| `/world-hype/pais/:id` | Camisetas de la selección |

## Reglas absolutas — qué NO hacer JAMÁS

- ❌ **No dibujar paths SVG de países a mano.** Usar siempre `react-simple-maps` + `world-atlas`.
- ❌ **No usar emojis 🇪🇸 como banderas.** Usar siempre clases CSS de `flag-icons`.
- ❌ **No hardcodear strings visibles** en componentes una vez implementado i18n — todo texto debe pasar por `t('namespace:clave')`.
- ❌ **No exponer `purchase_cost_cents`** al frontend bajo ninguna circunstancia.
- ❌ **No traducir "Fichaje Mundial"** — es nombre propio.
- ❌ **No traducir los strings de la sección World Hype** — son en inglés siempre por decisión narrativa.
- ❌ **No inventar assets bitmap.** Si hace falta un PNG, se genera aparte.

## Workflow de trabajo

- Rama de trabajo actual: **`refactor-fichaje-mundial`**.
- Después de cada prompt grande, se hace `git commit`.
- **No mergear a la rama principal** hasta que todo funcione.
