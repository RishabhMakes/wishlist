var currencySymbols = { USD: "$", INR: "₹", EUR: "€", JPY: "¥" };

function formatPrice(price, currency) {
  var symbol = currencySymbols[currency] || currency + " ";
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

      var name = document.createElement("span");
      name.className = "card-name";
      name.textContent = item.name;
      info.appendChild(name);

      var price = document.createElement("span");
      price.className = "card-price";
      price.textContent = formatPrice(item.price, item.currency || "USD");
      info.appendChild(price);

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
