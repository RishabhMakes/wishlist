# Wishlist

A simple, static wishlist tracker. Clean white design with item images as the focus.

## Adding Items

Edit `js/data.js` and add an entry to the `wishlistItems` array:

```js
{
  id: 7,
  name: "Item Name",
  image: "https://example.com/image.jpg",  // or "images/photo.jpg" for local images
  price: 29.99,
  category: "electronics",
  owned: false
}
```

## Local Images

Place image files in the `images/` directory and reference them as `"images/filename.jpg"`.

## Deploy

Push to GitHub and enable GitHub Pages from repository settings (serve from the main branch root).
