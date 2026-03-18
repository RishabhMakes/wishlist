# Wishlist — Agent Instructions

This is a static wishlist tracker site. No build step, no framework, no backend.
All data is in `js/data.js`. The site is deployed via GitHub Pages.

---

## Project Structure

```
index.html          — single-page app entry point
css/style.css       — all styles
js/data.js          — wishlist data array (THE file to edit when adding items)
js/app.js           — rendering and filter logic (rarely needs changes)
images/             — local item images (transparent background preferred)
CLAUDE.md           — this file
```

**Development branch:** `claude/wishlist-tracker-app-41Ymq`
**Push command:** `git push -u origin claude/wishlist-tracker-app-41Ymq`

---

## Data Schema

Every item in `wishlistItems` (in `js/data.js`) follows this structure:

```js
{
  id: 7,                          // integer, unique — increment from current max id
  name: "Product Name",           // string, required — display name of the item
  manufacturer: "Brand Name",     // string, optional — maker/brand (e.g. "Sony", "Lodge")
  image: "images/filename.png",   // string, required — local path (see Image Rules below)
  link: "https://...",            // string, optional — product page URL
  price: 299.00,                  // number, required — rough price as a number
  currency: "USD",                // string, required — one of: "USD", "INR", "EUR", "JPY"
  category: "electronics",        // string, required — see Category Conventions below
  owned: false                    // boolean, required — true = already own it, false = want it
}
```

### Currency Rules
- Allowed values: `"USD"`, `"INR"`, `"EUR"`, `"JPY"`
- JPY renders with no decimal places (handled automatically in `app.js`)
- Default to `"USD"` if currency is ambiguous

### Category Conventions
- Lowercase, singular noun
- Derive from the product type, not the brand
- Common values: `"electronics"`, `"kitchen"`, `"fitness"`, `"books"`, `"clothing"`, `"home"`, `"gaming"`, `"travel"`, `"beauty"`, `"tools"`
- Invent a new category only if none of the above fit; keep it lowercase and singular

### Image Rules
- Store images in `images/` directory
- Filename: slugified item name, e.g. `sony-wh1000xm5.png`
- Prefer transparent background (PNG or SVG) so the object is the visual focus
- If no real image is available, create a simple SVG placeholder (see existing SVGs for reference)
- Supported formats: `.png`, `.jpg`, `.svg`, `.webp`

### ID Assignment
- Find the current maximum `id` in `wishlistItems`
- Set the new item's `id` to `max + 1`

---

## How to Add an Item

1. Gather item info (see extraction guides below)
2. Download or create an image, save to `images/<slug>.png`
3. Open `js/data.js` and append a new object to `wishlistItems`:
   ```js
   {
     id: <max_id + 1>,
     name: "...",
     manufacturer: "...",
     image: "images/<slug>.png",
     link: "https://...",
     price: 0.00,
     currency: "USD",
     category: "...",
     owned: false
   }
   ```
4. Commit: `git add js/data.js images/<slug>.png && git commit -m "Add <item name> to wishlist"`
5. Push: `git push -u origin claude/wishlist-tracker-app-41Ymq`

---

## Extracting Info from a URL

1. Fetch the URL with the WebFetch tool
2. Look for:
   - **Name:** `<title>`, `og:title`, `h1`, or the main product heading
   - **Price:** `og:price:amount`, `product:price:amount`, `itemprop="price"`, or visible price text
   - **Currency:** `og:price:currency`, `product:price:currency`, or infer from price format (₹ = INR, € = EUR, ¥ = JPY, $ = USD)
   - **Manufacturer:** `og:brand`, `itemprop="brand"`, `itemprop="manufacturer"`, or brand name in the page title/URL
   - **Image:** `og:image` — download it and save locally; or create a placeholder if the image has a complex background
   - **Link:** use the canonical URL or the URL provided
3. Infer category from product type
4. If price is missing or ambiguous, set a best-guess value and note it in the commit message

## Extracting Info from a Screenshot

1. Read all visible text in the screenshot
2. Extract:
   - **Name:** large/prominent product name text
   - **Price:** any price-formatted text (look for currency symbols, decimal patterns)
   - **Manufacturer/Brand:** logo text, brand name in product title, or "by <brand>" patterns
   - **Category:** infer from the product type visible in the image
3. For the image: use the product photo visible in the screenshot if it has a clean/transparent background; otherwise create a simple SVG placeholder
4. If the screenshot contains a URL (in browser address bar or watermark), fetch it for additional details
5. If any field is genuinely ambiguous, ask the user to confirm before committing

## Extracting Info from a Tweet

1. Read tweet text for product name, price, and brand mentions
2. If the tweet contains a URL, fetch it for full product details (treat as URL extraction above)
3. If the tweet has an embedded image, use it as the product image if background is clean
4. Price in tweets is often mentioned as "$X" or "₹X" — parse accordingly
5. If the tweet is just sharing a product without a price, set a realistic estimate based on the product type and note it as an estimate in the commit message

---

## Marking an Item as Owned

Change `owned: false` to `owned: true` for the relevant item in `js/data.js`.

## Removing an Item

Delete the entire object from the `wishlistItems` array in `js/data.js`.

## Updating a Price

Edit the `price` (and `currency` if needed) field directly in `js/data.js`.
