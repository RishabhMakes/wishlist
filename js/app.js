var currencySymbols = { USD: "$", INR: "₹", EUR: "€", JPY: "¥" };

function formatPrice(price, currency) {
  var symbol = currencySymbols[currency] || currency + " ";

  var thresholds = currency === "INR"
    ? [{ d: 1e7, s: "Cr" }, { d: 1e5, s: "L" }, { d: 1e3, s: "K" }]
    : [{ d: 1e9, s: "B" }, { d: 1e6, s: "M" }, { d: 1e3, s: "K" }];

  for (var i = 0; i < thresholds.length; i++) {
    if (price >= thresholds[i].d) {
      var val = (price / thresholds[i].d).toFixed(1).replace(/\.0$/, "");
      return symbol + val + thresholds[i].s;
    }
  }

  var decimals = currency === "JPY" ? 0 : 2;
  return symbol + price.toFixed(decimals);
}

document.addEventListener("DOMContentLoaded", function () {
  var statusFilter = "all";
  var categoryFilter = "all";

  var grid = document.getElementById("item-grid");
  var emptyMsg = document.getElementById("empty-msg");
  var categoryFiltersEl = document.getElementById("category-filters");
  var statusFiltersEl = document.getElementById("status-filters");

  function getCategories() {
    var cats = [];
    for (var i = 0; i < wishlistItems.length; i++) {
      if (cats.indexOf(wishlistItems[i].category) === -1) {
        cats.push(wishlistItems[i].category);
      }
    }
    return cats.sort();
  }

  function buildCategoryFilters() {
    var cats = getCategories();

    var allBtn = document.createElement("button");
    allBtn.className = "filter-btn active";
    allBtn.dataset.filter = "category";
    allBtn.dataset.value = "all";
    allBtn.textContent = "All Types";
    categoryFiltersEl.appendChild(allBtn);

    for (var i = 0; i < cats.length; i++) {
      var btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.dataset.filter = "category";
      btn.dataset.value = cats[i];
      btn.textContent = cats[i].charAt(0).toUpperCase() + cats[i].slice(1);
      categoryFiltersEl.appendChild(btn);
    }
  }

  function getFilteredItems() {
    var items = [];
    for (var i = 0; i < wishlistItems.length; i++) {
      var item = wishlistItems[i];
      var statusMatch =
        statusFilter === "all" ||
        (statusFilter === "owned" && item.owned) ||
        (statusFilter === "wanted" && !item.owned);
      var categoryMatch =
        categoryFilter === "all" || item.category === categoryFilter;
      if (statusMatch && categoryMatch) {
        items.push(item);
      }
    }
    return items;
  }

  function renderCards(items) {
    grid.innerHTML = "";

    if (items.length === 0) {
      emptyMsg.classList.add("visible");
      return;
    }
    emptyMsg.classList.remove("visible");

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var card = document.createElement("div");
      card.className = "card" + (item.owned ? " owned" : "");

      var imgWrap = document.createElement("div");
      imgWrap.className = "card-image";

      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;
      img.loading = "lazy";
      imgWrap.appendChild(img);
      card.appendChild(imgWrap);

      var info = document.createElement("div");
      info.className = "card-info";

      var nameWrap = document.createElement("div");
      nameWrap.className = "card-name-wrap";

      if (item.manufacturer) {
        var mfr = document.createElement("span");
        mfr.className = "card-manufacturer";
        mfr.textContent = item.manufacturer;
        nameWrap.appendChild(mfr);
      }

      var name = document.createElement("span");
      name.className = "card-name";
      name.textContent = item.name;
      nameWrap.appendChild(name);

      info.appendChild(nameWrap);

      var priceWrap = document.createElement("div");
      priceWrap.className = "card-price-wrap";

      var price = document.createElement("span");
      price.className = "card-price";
      price.textContent = formatPrice(item.price, item.currency || "USD");
      priceWrap.appendChild(price);

      if (item.link) {
        var link = document.createElement("a");
        link.className = "card-link";
        link.href = item.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "↗";
        link.title = "View product";
        priceWrap.appendChild(link);
      }

      info.appendChild(priceWrap);

      card.appendChild(info);

      if (item.owned) {
        var badge = document.createElement("span");
        badge.className = "owned-badge";
        badge.textContent = "Owned";
        card.appendChild(badge);
      }

      grid.appendChild(card);
    }
  }

  function setActiveButton(group, value) {
    var buttons = group.querySelectorAll(".filter-btn");
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].dataset.value === value) {
        buttons[i].classList.add("active");
      } else {
        buttons[i].classList.remove("active");
      }
    }
  }

  document.getElementById("filters").addEventListener("click", function (e) {
    var btn = e.target;
    if (!btn.classList.contains("filter-btn")) return;

    if (btn.dataset.filter === "status") {
      statusFilter = btn.dataset.value;
      setActiveButton(statusFiltersEl, statusFilter);
    } else if (btn.dataset.filter === "category") {
      categoryFilter = btn.dataset.value;
      setActiveButton(categoryFiltersEl, categoryFilter);
    }

    renderCards(getFilteredItems());
  });

  buildCategoryFilters();
  renderCards(getFilteredItems());
});
