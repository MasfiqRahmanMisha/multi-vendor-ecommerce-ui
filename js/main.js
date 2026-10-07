/* =========================================================
   MULTI-VENDOR E-COMMERCE UI
   File: js/main.js
   Frontend only — No Backend
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initGlobal();
  initNavigation();
  initMobileSidebar();
  initNotifications();
  initLogoutModals();

  initCart();
  initCheckout();

  initSellerOrders();
  initSellerAnalytics();
  initSellerEarnings();
  initAddProduct();

  initAdminProducts();
  initAdminOrders();
  initAdminModals();

  initCommonModals();
  initTabs();
  initSearchAndFilters();
  initCharts();
  initCounters();
});


/* =========================================================
   GLOBAL
========================================================= */

function initGlobal() {
  updateCartCount();

  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  document.querySelectorAll(".js-back").forEach((button) => {
    button.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "../index.html";
      }
    });
  });
}


/* =========================================================
   NAVIGATION
========================================================= */

function initNavigation() {
  document.querySelectorAll("[data-href]").forEach((element) => {
    element.addEventListener("click", () => {
      const url = element.dataset.href;
      if (url) window.location.href = url;
    });
  });

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (
        !href ||
        href === "#" ||
        href.startsWith("javascript:") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      const target = link.getAttribute("target");

      if (target === "_blank") return;
    });
  });

  document.querySelectorAll(".logout-link").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal("logoutModal");
    });
  });
}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function initMobileSidebar() {
  const toggle = document.getElementById("mobileSidebarToggle");
  const sidebar = document.getElementById("dashboardSidebar");
  const overlay = document.getElementById("dashboardSidebarOverlay");

  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");

    if (overlay) {
      overlay.classList.toggle("is-visible");
    }

    document.body.classList.toggle("sidebar-open");
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("is-open");
      overlay.classList.remove("is-visible");
      document.body.classList.remove("sidebar-open");
    });
  }

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("is-open");

      if (overlay) {
        overlay.classList.remove("is-visible");
      }

      document.body.classList.remove("sidebar-open");
    });
  });
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function initNotifications() {
  const notificationButtons = [
    document.getElementById("notificationBtn"),
    document.getElementById("adminNotificationBtn")
  ].filter(Boolean);

  const panel = document.getElementById("notificationPanel");
  const closeButton = document.getElementById("closeNotificationPanel");

  if (!panel) return;

  notificationButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      panel.classList.toggle("is-open");
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      panel.classList.remove("is-open");
    });
  }

  document.addEventListener("click", (event) => {
    if (
      panel.classList.contains("is-open") &&
      !panel.contains(event.target) &&
      !notificationButtons.some((button) => button.contains(event.target))
    ) {
      panel.classList.remove("is-open");
    }
  });
}


/* =========================================================
   LOGOUT
========================================================= */

function initLogoutModals() {
  const cancelLogout = document.getElementById("cancelLogout");
  const confirmLogout = document.getElementById("confirmLogout");

  if (cancelLogout) {
    cancelLogout.addEventListener("click", () => {
      closeModal("logoutModal");
    });
  }

  if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("cart");

      closeModal("logoutModal");

      setTimeout(() => {
        window.location.href = "../login.html";
      }, 150);
    });
  }

  document.querySelectorAll("#sellerLogoutBtn, #adminLogoutBtn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openModal("logoutModal");
    });
  });
}


/* =========================================================
   MODAL HELPERS
========================================================= */

function openModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.add("is-open");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.classList.remove("is-open");

  if (!document.querySelector(".modal.is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function initCommonModals() {
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.dataset.closeModal;
      closeModal(modalId);
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("is-open");

        if (!document.querySelector(".modal.is-open")) {
          document.body.classList.remove("modal-open");
        }
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const openModals = document.querySelectorAll(".modal.is-open");

    openModals.forEach((modal) => {
      modal.classList.remove("is-open");
    });

    document.body.classList.remove("modal-open");
  });
}


/* =========================================================
   CART
========================================================= */

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();

  const count = cart.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  document.querySelectorAll("#cartCount, [data-cart-count]").forEach((element) => {
    element.textContent = count;
  });
}

function addToCart(product) {
  const cart = getCart();

  const existing = cart.find((item) => {
    return String(item.id) === String(product.id);
  });

  if (existing) {
    existing.quantity = Number(existing.quantity || 1) + Number(product.quantity || 1);
  } else {
    cart.push({
      ...product,
      quantity: Number(product.quantity || 1)
    });
  }

  saveCart(cart);
  showToast("Product added to cart.");
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => {
    return String(item.id) !== String(productId);
  });

  saveCart(cart);
  renderCart();
}

function changeCartQuantity(productId, quantity) {
  const cart = getCart();

  const item = cart.find((product) => {
    return String(product.id) === String(productId);
  });

  if (!item) return;

  item.quantity = Math.max(1, Number(quantity) || 1);

  saveCart(cart);
  renderCart();
}

function calculateCartSubtotal(cart) {
  return cart.reduce((total, item) => {
    return total + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const emptyState = document.getElementById("cartEmptyState");
  const content = document.getElementById("cartContent");

  if (!container) return;

  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = "";

    if (emptyState) emptyState.hidden = false;
    if (content) content.hidden = true;

    updateCartTotals();
    return;
  }

  if (emptyState) emptyState.hidden = true;
  if (content) content.hidden = false;

  container.innerHTML = cart.map((item) => {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 1);

    return `
      <div class="cart-item" data-cart-item="${escapeHTML(item.id)}">
        <div class="cart-item-media">
          <img src="${escapeHTML(item.image || "")}" alt="${escapeHTML(item.name || "Product")}">
        </div>

        <div class="cart-item-info">
          <h3>${escapeHTML(item.name || "Product")}</h3>
          <p>${escapeHTML(item.vendor || "Marketplace Seller")}</p>
          <strong>$${formatMoney(price)}</strong>
        </div>

        <div class="cart-item-actions">
          <div class="quantity-control">
            <button type="button" data-cart-minus="${escapeHTML(item.id)}">−</button>
            <span>${quantity}</span>
            <button type="button" data-cart-plus="${escapeHTML(item.id)}">+</button>
          </div>

          <button
            type="button"
            class="cart-remove-btn"
            data-cart-remove="${escapeHTML(item.id)}"
          >
            Remove
          </button>
        </div>

        <div class="cart-item-total">
          $${formatMoney(price * quantity)}
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll("[data-cart-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.cartRemove);
    });
  });

  container.querySelectorAll("[data-cart-minus]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.cartMinus;
      const item = getCart().find((product) => String(product.id) === String(id));

      if (item) {
        changeCartQuantity(id, Number(item.quantity || 1) - 1);
      }
    });
  });

  container.querySelectorAll("[data-cart-plus]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.cartPlus;
      const item = getCart().find((product) => String(product.id) === String(id));

      if (item) {
        changeCartQuantity(id, Number(item.quantity || 1) + 1);
      }
    });
  });

  updateCartTotals();
}

function updateCartTotals() {
  const cart = getCart();
  const subtotal = calculateCartSubtotal(cart);

  const shipping = cart.length ? (subtotal >= 50 ? 0 : 5) : 0;

  let discount = Number(localStorage.getItem("cartDiscount") || 0);

  if (!cart.length) {
    discount = 0;
    localStorage.removeItem("cartDiscount");
  }

  const total = Math.max(0, subtotal + shipping - discount);

  setText("cartItemCount", cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0));
  setText("cartSubtotal", `$${formatMoney(subtotal)}`);
  setText("cartShipping", shipping === 0 ? "Free" : `$${formatMoney(shipping)}`);
  setText("cartDiscount", `-$${formatMoney(discount)}`);
  setText("cartTotal", `$${formatMoney(total)}`);
}

function initCart() {
  if (!document.getElementById("cartItems")) return;

  renderCart();

  const clearButton = document.getElementById("clearCartBtn");

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (!getCart().length) return;

      localStorage.removeItem("cart");
      localStorage.removeItem("cartDiscount");

      renderCart();
      updateCartCount();

      showToast("Cart cleared.");
    });
  }

  const couponButton = document.getElementById("applyCouponBtn");
  const couponInput = document.getElementById("couponInput");
  const couponMessage = document.getElementById("couponMessage");

  if (couponButton && couponInput) {
    couponButton.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();

      if (!code) {
        showCouponMessage("Enter a coupon code.", false);
        return;
      }

      const subtotal = calculateCartSubtotal(getCart());

      if (code === "SAVE10") {
        const discount = subtotal * 0.10;

        localStorage.setItem("cartDiscount", discount.toFixed(2));

        showCouponMessage("10% discount applied.", true);
        updateCartTotals();
      } else if (code === "WELCOME20") {
        const discount = Math.min(subtotal * 0.20, 20);

        localStorage.setItem("cartDiscount", discount.toFixed(2));

        showCouponMessage("Welcome discount applied.", true);
        updateCartTotals();
      } else {
        localStorage.removeItem("cartDiscount");
        showCouponMessage("Invalid coupon code.", false);
        updateCartTotals();
      }
    });
  }

  const checkoutButton = document.getElementById("checkoutBtn");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (!getCart().length) {
        showToast("Your cart is empty.");
        return;
      }

      window.location.href = "checkout.html";
    });
  }
}

function showCouponMessage(message, success) {
  const element = document.getElementById("couponMessage");

  if (!element) return;

  element.textContent = message;
  element.classList.toggle("success", success);
  element.classList.toggle("error", !success);
}


/* =========================================================
   CHECKOUT
========================================================= */

function initCheckout() {
  const form = document.getElementById("checkoutForm");

  if (!form && !document.getElementById("checkoutItems")) return;

  renderCheckoutSummary();

  const deliveryInputs = document.querySelectorAll('input[name="delivery"]');
  const paymentInputs = document.querySelectorAll('input[name="payment"]');

  deliveryInputs.forEach((input) => {
    input.addEventListener("change", renderCheckoutSummary);
  });

  paymentInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const onlineArea = document.getElementById("onlinePaymentArea");

      if (!onlineArea) return;

      onlineArea.hidden = input.value !== "online";
    });
  });

  if (form) {
    form.addEventListener("submit", handleCheckoutSubmit);
  }

  const mobileButton = document.getElementById("mobilePlaceOrderBtn");

  if (mobileButton) {
    mobileButton.addEventListener("click", () => {
      if (form) form.requestSubmit();
    });
  }

  const closeSuccess = document.getElementById("closeSuccessModal");
  const successClose = document.getElementById("successCloseBtn");

  [closeSuccess, successClose].filter(Boolean).forEach((button) => {
    button.addEventListener("click", () => {
      closeModal("orderSuccessModal");
      window.location.href = "index.html";
    });
  });
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkoutItems");

  if (!container) return;

  const cart = getCart();
  const subtotal = calculateCartSubtotal(cart);

  let shipping = subtotal >= 50 ? 0 : 5;

  const selectedDelivery = document.querySelector('input[name="delivery"]:checked');

  if (selectedDelivery) {
    if (selectedDelivery.value === "express") {
      shipping = 10;
    }

    if (selectedDelivery.value === "standard") {
      shipping = subtotal >= 50 ? 0 : 5;
    }
  }

  const discount = Number(localStorage.getItem("cartDiscount") || 0);
  const total = Math.max(0, subtotal + shipping - discount);

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
  } else {
    container.innerHTML = cart.map((item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 1);

      return `
        <div class="checkout-item">
          <div class="checkout-item-image">
            <img src="${escapeHTML(item.image || "")}" alt="${escapeHTML(item.name || "Product")}">
          </div>

          <div class="checkout-item-info">
            <strong>${escapeHTML(item.name || "Product")}</strong>
            <span>Qty: ${quantity}</span>
          </div>

          <strong>$${formatMoney(price * quantity)}</strong>
        </div>
      `;
    }).join("");
  }

  setText("checkoutSubtotal", `$${formatMoney(subtotal)}`);
  setText("checkoutShipping", shipping === 0 ? "Free" : `$${formatMoney(shipping)}`);

  const discountRow = document.getElementById("checkoutDiscountRow");

  if (discountRow) {
    discountRow.hidden = discount <= 0;
  }

  setText("checkoutDiscount", `-$${formatMoney(discount)}`);
  setText("checkoutTotal", `$${formatMoney(total)}`);
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const cart = getCart();

  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  const terms = document.getElementById("checkoutTerms");

  if (terms && !terms.checked) {
    showToast("Please accept the terms and conditions.");
    return;
  }

  const orderNumber =
    "ORD-" +
    Math.floor(100000 + Math.random() * 900000);

  setText("successOrderNumber", orderNumber);

  localStorage.removeItem("cart");
  localStorage.removeItem("cartDiscount");

  updateCartCount();

  openModal("orderSuccessModal");
}


/* =========================================================
   SELLER ORDERS
========================================================= */

function initSellerOrders() {
  const tableBody = document.querySelector("#ordersTableBody");

  if (!tableBody) return;

  const tabs = document.querySelectorAll("[data-order-tab]");
  const searchInput = document.getElementById("orderSearch");

  function filterOrders() {
    const activeTab =
      document.querySelector("[data-order-tab].active")?.dataset.orderTab ||
      "all";

    const search =
      searchInput?.value.trim().toLowerCase() || "";

    tableBody.querySelectorAll("tr").forEach((row) => {
      const status = row.dataset.status || "";
      const text = row.textContent.toLowerCase();

      const matchesTab =
        activeTab === "all" || status === activeTab;

      const matchesSearch =
        !search || text.includes(search);

      row.style.display =
        matchesTab && matchesSearch ? "" : "none";
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      filterOrders();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterOrders);
  }

  document.querySelectorAll("[data-order]").forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.dataset.order;

      const row = [...tableBody.querySelectorAll("tr")].find((item) => {
        return item.dataset.order === orderId;
      });

      if (!row) return;

      const cells = row.querySelectorAll("td");

      setText("orderModalId", orderId);
      setText("orderModalCustomer", cells[1]?.textContent.trim() || "Customer");
      setText("orderModalProduct", cells[2]?.textContent.trim() || "Product");
      setText("orderModalAmount", cells[3]?.textContent.trim() || "$0");
      setText("orderModalDate", cells[4]?.textContent.trim() || "-");
      setText("orderModalStatus", cells[5]?.textContent.trim() || "-");

      openModal("orderDetailsModal");
    });
  });
}


/* =========================================================
   SELLER ANALYTICS
========================================================= */

function initSellerAnalytics() {
  const range = document.getElementById("analyticsRange");
  const exportButton = document.getElementById("exportAnalyticsBtn");

  if (range) {
    range.addEventListener("change", () => {
      showToast(`Analytics updated for ${range.value}.`);
      animateChart("analyticsRevenueChart");
    });
  }

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      downloadCSV(
        "analytics-report.csv",
        [
          ["Metric", "Value"],
          ["Total Revenue", "48920"],
          ["Net Earnings", "39120"],
          ["Orders", "1284"],
          ["Conversion Rate", "4.82%"]
        ]
      );
    });
  }
}


/* =========================================================
   SELLER EARNINGS
========================================================= */

function initSellerEarnings() {
  const range = document.getElementById("earningsRange");
  const downloadButton = document.getElementById("downloadEarningsBtn");
  const withdrawButton = document.getElementById("withdrawBtn");

  if (range) {
    range.addEventListener("change", () => {
      showToast(`Earnings updated for ${range.value}.`);
      animateChart("earningsChart");
    });
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", () => {
      downloadCSV(
        "earnings-statement.csv",
        [
          ["Description", "Amount"],
          ["Product Sales", "48920"],
          ["Shipping", "2140"],
          ["Discounts", "-1820"],
          ["Refunds", "-840"],
          ["Platform Fees", "-9280"],
          ["Net Earnings", "39120"]
        ]
      );
    });
  }

  if (withdrawButton) {
    withdrawButton.addEventListener("click", () => {
      const balance = 8420.50;

      if (balance <= 0) {
        showToast("No available balance.");
        return;
      }

      showToast("Withdrawal request submitted.");
    });
  }
}


/* =========================================================
   ADD PRODUCT
========================================================= */

function initAddProduct() {
  const form = document.getElementById("addProductForm");

  if (!form) return;

  const description = document.getElementById("productDescription");
  const descriptionCount = document.getElementById("descriptionCount");

  if (description && descriptionCount) {
    const updateDescriptionCount = () => {
      descriptionCount.textContent = description.value.length;
    };

    description.addEventListener("input", updateDescriptionCount);
    updateDescriptionCount();
  }

  const seoDescription = document.getElementById("seoDescription");
  const seoDescriptionCount = document.getElementById("seoDescriptionCount");

  if (seoDescription && seoDescriptionCount) {
    const updateSEOCount = () => {
      seoDescriptionCount.textContent = seoDescription.value.length;
    };

    seoDescription.addEventListener("input", updateSEOCount);
    updateSEOCount();
  }

  const imageInput = document.getElementById("productImages");
  const imagePreview = document.getElementById("productImagePreview");

  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", () => {
      imagePreview.innerHTML = "";

      [...imageInput.files].forEach((file) => {
        if (!file.type.startsWith("image/")) return;

        const reader = new FileReader();

        reader.onload = (event) => {
          const image = document.createElement("img");
          image.src = event.target.result;
          image.alt = file.name;
          imagePreview.appendChild(image);
        };

        reader.readAsDataURL(file);
      });
    });
  }

  const productName = document.getElementById("productName");
  const previewName = document.getElementById("previewProductName");

  if (productName && previewName) {
    productName.addEventListener("input", () => {
      previewName.textContent =
        productName.value || "Product Name";
    });
  }

  const productPrice = document.getElementById("productPrice");
  const previewPrice = document.getElementById("previewProductPrice");

  if (productPrice && previewPrice) {
    productPrice.addEventListener("input", () => {
      previewPrice.textContent =
        `$${formatMoney(productPrice.value || 0)}`;
    });
  }

  const comparePrice = document.getElementById("comparePrice");
  const previewComparePrice = document.getElementById("previewComparePrice");

  if (comparePrice && previewComparePrice) {
    comparePrice.addEventListener("input", () => {
      previewComparePrice.textContent =
        comparePrice.value
          ? `$${formatMoney(comparePrice.value)}`
          : "";
    });
  }

  const status = document.getElementById("productStatus");
  const publishButton = document.getElementById("publishProductBtn");
  const draftButton = document.getElementById("saveDraftBtn");

  if (publishButton) {
    publishButton.addEventListener("click", () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      showToast("Product published successfully.");
    });
  }

  if (draftButton) {
    draftButton.addEventListener("click", () => {
      showToast("Product saved as draft.");
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (status && status.value === "draft") {
      showToast("Product saved as draft.");
    } else {
      showToast("Product published successfully.");
    }
  });

  initProductOptions();
}

function initProductOptions() {
  const addButton = document.getElementById("addOptionBtn");
  const list = document.getElementById("productOptionsList");

  if (!addButton || !list) return;

  addButton.addEventListener("click", () => {
    const option = document.createElement("div");

    option.className = "product-option-row";

    option.innerHTML = `
      <input
        type="text"
        class="form-control"
        placeholder="Option name"
      >

      <input
        type="text"
        class="form-control"
        placeholder="Option value"
      >

      <button type="button" class="icon-btn remove-option" aria-label="Remove option">
        ×
      </button>
    `;

    list.appendChild(option);

    option.querySelector(".remove-option").addEventListener("click", () => {
      option.remove();
    });
  });
}


/* =========================================================
   ADMIN PRODUCTS
========================================================= */

function initAdminProducts() {
  const tableBody = document.getElementById("productTableBody");

  if (!tableBody) return;

  const search = document.getElementById("productSearch");
  const statusFilter = document.getElementById("productStatusFilter");
  const categoryFilter = document.getElementById("productCategoryFilter");
  const sortFilter = document.getElementById("productSortFilter");

  function filterProducts() {
    const searchValue =
      search?.value.trim().toLowerCase() || "";

    const statusValue =
      statusFilter?.value || "all";

    const categoryValue =
      categoryFilter?.value || "all";

    tableBody.querySelectorAll("tr").forEach((row) => {
      const text = row.textContent.toLowerCase();

      const rowStatus =
        row.dataset.status || "";

      const rowCategory =
        row.dataset.category || "";

      const matchesSearch =
        !searchValue || text.includes(searchValue);

      const matchesStatus =
        statusValue === "all" ||
        rowStatus === statusValue;

      const matchesCategory =
        categoryValue === "all" ||
        rowCategory === categoryValue;

      row.style.display =
        matchesSearch &&
        matchesStatus &&
        matchesCategory
          ? ""
          : "none";
    });
  }

  [search, statusFilter, categoryFilter, sortFilter]
    .filter(Boolean)
    .forEach((element) => {
      element.addEventListener("input", filterProducts);
      element.addEventListener("change", filterProducts);
    });

  document.querySelectorAll("[data-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.product;

      const row = [...tableBody.querySelectorAll("tr")].find((item) => {
        return item.dataset.product === productId;
      });

      if (!row) return;

      const cells = row.querySelectorAll("td");

      const image =
        row.querySelector("img")?.src || "";

      const productName =
        cells[1]?.textContent.trim() || "Product";

      setImage("productModalImage", image);
      setText("productModalName", productName);
      setText("productModalSku", cells[2]?.textContent.trim() || "-");
      setText("productModalPrice", cells[3]?.textContent.trim() || "$0");
      setText("productModalStock", cells[4]?.textContent.trim() || "0");
      setText("productModalVendor", cells[5]?.textContent.trim() || "-");
      setText("productModalCategory", cells[6]?.textContent.trim() || "-");
      setText("productModalStatus", cells[7]?.textContent.trim() || "-");

      openModal("productDetailsModal");
    });
  });

  const exportButton = document.getElementById("exportProductsBtn");

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      downloadCSV(
        "products.csv",
        [
          ["Product", "SKU", "Price", "Stock", "Vendor", "Category", "Status"],
          ["Premium Headphones", "HP-001", "129", "42", "SoundLab", "Electronics", "Active"],
          ["Classic Watch", "WT-002", "89", "18", "TimeCraft", "Fashion", "Active"],
          ["Leather Bag", "BG-003", "149", "27", "Urban Carry", "Fashion", "Active"]
        ]
      );
    });
  }

  const addProductButton =
    document.getElementById("addProductAdminBtn");

  if (addProductButton) {
    addProductButton.addEventListener("click", () => {
      openModal("addProductAdminModal");
    });
  }

  const addProductForm =
    document.getElementById("adminAddProductForm");

  if (addProductForm) {
    addProductForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!addProductForm.checkValidity()) {
        addProductForm.reportValidity();
        return;
      }

      closeModal("addProductAdminModal");
      addProductForm.reset();

      showToast("Product added successfully.");
    });
  }

  const filterButton =
    document.getElementById("productFilterBtn");

  if (filterButton) {
    filterButton.addEventListener("click", () => {
      filterProducts();
      showToast("Product filters applied.");
    });
  }
}


/* =========================================================
   ADMIN ORDERS
========================================================= */

function initAdminOrders() {
  const tableBody =
    document.getElementById("adminOrdersTableBody");

  if (!tableBody) return;

  const search =
    document.getElementById("adminOrderSearch");

  const status =
    document.getElementById("adminOrderStatusFilter");

  const vendor =
    document.getElementById("adminOrderVendorFilter");

  const date =
    document.getElementById("adminOrderDateFilter");

  function filterOrders() {
    const searchValue =
      search?.value.trim().toLowerCase() || "";

    const statusValue =
      status?.value || "all";

    const vendorValue =
      vendor?.value || "all";

    const dateValue =
      date?.value || "all";

    tableBody.querySelectorAll("tr").forEach((row) => {
      const text = row.textContent.toLowerCase();

      const rowStatus =
        row.dataset.status || "";

      const rowVendor =
        row.dataset.vendor || "";

      const rowDate =
        row.dataset.date || "";

      const matchesSearch =
        !searchValue || text.includes(searchValue);

      const matchesStatus =
        statusValue === "all" ||
        rowStatus === statusValue;

      const matchesVendor =
        vendorValue === "all" ||
        rowVendor === vendorValue;

      const matchesDate =
        dateValue === "all" ||
        rowDate === dateValue;

      row.style.display =
        matchesSearch &&
        matchesStatus &&
        matchesVendor &&
        matchesDate
          ? ""
          : "none";
    });
  }

  [search, status, vendor, date]
    .filter(Boolean)
    .forEach((element) => {
      element.addEventListener("input", filterOrders);
      element.addEventListener("change", filterOrders);
    });

  document.querySelectorAll("[data-admin-order]").forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.dataset.adminOrder;

      const row = [...tableBody.querySelectorAll("tr")].find((item) => {
        return item.dataset.order === orderId;
      });

      if (!row) return;

      const cells = row.querySelectorAll("td");

      setText("adminOrderModalId", orderId);
      setText("adminOrderModalCustomer", cells[1]?.textContent.trim() || "-");
      setText("adminOrderModalVendor", cells[2]?.textContent.trim() || "-");
      setText("adminOrderModalProduct", cells[3]?.textContent.trim() || "-");
      setText("adminOrderModalAmount", cells[4]?.textContent.trim() || "-");
      setText("adminOrderModalDate", cells[5]?.textContent.trim() || "-");
      setText("adminOrderModalStatus", cells[6]?.textContent.trim() || "-");

      openModal("adminOrderDetailsModal");
    });
  });

  const exportButton =
    document.getElementById("exportAdminOrdersBtn");

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      downloadCSV(
        "admin-orders.csv",
        [
          ["Order ID", "Customer", "Vendor", "Product", "Amount", "Date", "Status"],
          ["#ORD-10482", "Michael Carter", "SoundLab", "Premium Headphones", "129", "2026-10-01", "Delivered"],
          ["#ORD-10481", "Emma Wilson", "Urban Carry", "Leather Bag", "149", "2026-10-01", "Processing"],
          ["#ORD-10480", "Daniel Smith", "TimeCraft", "Classic Watch", "89", "2026-09-30", "Shipped"]
        ]
      );
    });
  }
}


/* =========================================================
   ADMIN MODALS
========================================================= */

function initAdminModals() {
  const productCloseButtons = [
    document.getElementById("closeProductDetails"),
    document.getElementById("closeProductDetailsBottom")
  ].filter(Boolean);

  productCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeModal("productDetailsModal");
    });
  });

  const addProductClose =
    document.getElementById("closeAddProductAdmin");

  if (addProductClose) {
    addProductClose.addEventListener("click", () => {
      closeModal("addProductAdminModal");
    });
  }

  const cancelAddProduct =
    document.getElementById("cancelAddProductAdmin");

  if (cancelAddProduct) {
    cancelAddProduct.addEventListener("click", () => {
      closeModal("addProductAdminModal");
    });
  }

  const orderCloseButtons = [
    document.getElementById("closeAdminOrderDetails"),
    document.getElementById("closeAdminOrderDetailsBottom")
  ].filter(Boolean);

  orderCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeModal("adminOrderDetailsModal");
    });
  });

  const manageProductButton =
    document.getElementById("manageProductBtn");

  if (manageProductButton) {
    manageProductButton.addEventListener("click", () => {
      closeModal("productDetailsModal");
      showToast("Product management mode opened.");
    });
  }
}


/* =========================================================
   TABS
========================================================= */

function initTabs() {
  document.querySelectorAll("[data-tab-group]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-tab]");
    const contents = group.querySelectorAll("[data-tab-content]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;

        buttons.forEach((item) => {
          item.classList.toggle(
            "active",
            item === button
          );
        });

        contents.forEach((content) => {
          content.classList.toggle(
            "active",
            content.dataset.tabContent === target
          );
        });
      });
    });
  });
}


/* =========================================================
   SEARCH + FILTERS
========================================================= */

function initSearchAndFilters() {
  document.querySelectorAll("[data-filter-target]").forEach((input) => {
    const targetSelector = input.dataset.filterTarget;
    const target = document.querySelector(targetSelector);

    if (!target) return;

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();

      target.querySelectorAll(
        "[data-searchable], tr, .product-card, .category-card"
      ).forEach((item) => {
        const text = item.textContent.toLowerCase();

        item.style.display =
          !query || text.includes(query)
            ? ""
            : "none";
      });
    });
  });
}


/* =========================================================
   CHARTS
========================================================= */

function initCharts() {
  document.querySelectorAll("svg[data-chart]").forEach((chart) => {
    animateSVGChart(chart);
  });

  const charts = [
    "analyticsRevenueChart",
    "earningsChart"
  ];

  charts.forEach((id) => {
    animateChart(id);
  });
}

function animateChart(id) {
  const chart = document.getElementById(id);

  if (!chart) return;

  animateSVGChart(chart);
}

function animateSVGChart(chart) {
  const paths = chart.querySelectorAll("path, polyline");

  paths.forEach((path) => {
    try {
      const length = path.getTotalLength();

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      requestAnimationFrame(() => {
        path.style.transition = "stroke-dashoffset 1.2s ease";
        path.style.strokeDashoffset = "0";
      });
    } catch (error) {
      // Ignore SVG elements without measurable paths.
    }
  });
}


/* =========================================================
   COUNTERS
========================================================= */

function initCounters() {
  document.querySelectorAll("[data-count]").forEach((element) => {
    const target = Number(element.dataset.count);

    if (!Number.isFinite(target)) return;

    animateNumber(element, target);
  });
}

function animateNumber(element, target) {
  const duration = 900;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min(
      (currentTime - startTime) / duration,
      1
    );

    const eased =
      1 - Math.pow(1 - progress, 3);

    const value = Math.round(target * eased);

    element.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}


/* =========================================================
   UTILITY
========================================================= */

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function setImage(id, src) {
  const element = document.getElementById(id);

  if (!element || !src) return;

  element.src = src;
}

function formatMoney(value) {
  const number = Number(value) || 0;

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
  let container = document.getElementById("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";

    document.body.appendChild(container);
  }

  const toast = document.createElement("div");

  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast-icon">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20 6 9 17l-5-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2800);
}


/* =========================================================
   CSV EXPORT
========================================================= */

function downloadCSV(filename, rows) {
  const csv = rows
    .map((row) => {
      return row
        .map((cell) => {
          const value = String(cell ?? "");
          return `"${value.replace(/"/g, '""')}"`;
        })
        .join(",");
    })
    .join("\n");

  const blob = new Blob(
    [csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showToast("File exported successfully.");
}


/* =========================================================
   DEMO PRODUCT CART BUTTONS
========================================================= */

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-to-cart]");

  if (!button) return;

  const product = {
    id:
      button.dataset.productId ||
      Date.now(),

    name:
      button.dataset.productName ||
      "Product",

    price:
      Number(button.dataset.productPrice || 0),

    image:
      button.dataset.productImage ||
      "",

    vendor:
      button.dataset.productVendor ||
      "Marketplace Seller",

    quantity: 1
  };

  addToCart(product);
});


/* =========================================================
   QUANTITY INPUTS
========================================================= */

document.addEventListener("click", (event) => {
  const minus = event.target.closest("[data-quantity-minus]");
  const plus = event.target.closest("[data-quantity-plus]");

  if (minus || plus) {
    const button = minus || plus;
    const targetId = button.dataset.quantityMinus ||
      button.dataset.quantityPlus;

    const input = document.getElementById(targetId);

    if (!input) return;

    let value = Number(input.value) || 1;

    if (minus) {
      value = Math.max(
        Number(input.min || 1),
        value - 1
      );
    }

    if (plus) {
      value = Math.min(
        Number(input.max || 999),
        value + 1
      );
    }

    input.value = value;

    input.dispatchEvent(
      new Event("change", { bubbles: true })
    );
  }
});


/* =========================================================
   PRODUCT IMAGE PREVIEW
========================================================= */

document.addEventListener("change", (event) => {
  const input = event.target;

  if (!input.matches("[data-image-preview]")) return;

  const targetSelector =
    input.dataset.imagePreview;

  const preview =
    document.querySelector(targetSelector);

  if (!preview) return;

  const file = input.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) return;

  const reader = new FileReader();

  reader.onload = (readerEvent) => {
    preview.src = readerEvent.target.result;
  };

  reader.readAsDataURL(file);
});


/* =========================================================
   PRICE FORMATTERS
========================================================= */

document.addEventListener("input", (event) => {
  const input = event.target;

  if (!input.matches("[data-price-input]")) return;

  const value = input.value.replace(/[^\d.]/g, "");

  input.value = value;
});


/* =========================================================
   ACTIVE NAV ITEM
========================================================= */

(function markActiveNavigation() {
  const currentPath =
    window.location.pathname.split("/").pop() ||
    "index.html";

  document.querySelectorAll(".sidebar-nav a").forEach((link) => {
    const href =
      link.getAttribute("href") || "";

    const linkPath =
      href.split("/").pop();

    if (
      linkPath &&
      linkPath === currentPath
    ) {
      link.classList.add("active");
    }
  });
})();


/* =========================================================
   SIMPLE AUTO SLIDER
========================================================= */

(function initAutoSlider() {
  const sliders =
    document.querySelectorAll("[data-auto-slider]");

  sliders.forEach((slider) => {
    const slides =
      slider.querySelectorAll(
        "[data-slide]"
      );

    if (slides.length < 2) return;

    let current = 0;

    slides.forEach((slide, index) => {
      slide.classList.toggle(
        "active",
        index === 0
      );
    });

    setInterval(() => {
      slides[current].classList.remove("active");

      current =
        (current + 1) % slides.length;

      slides[current].classList.add("active");
    }, 5000);
  });
})();


/* =========================================================
   WINDOW GLOBALS
========================================================= */

window.ShopUI = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  changeCartQuantity,
  updateCartCount,
  showToast,
  openModal,
  closeModal,
  formatMoney
};
