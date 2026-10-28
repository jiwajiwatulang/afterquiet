/**
 * afterquiet — Independent Commerce Operating Engine
 * Unified persistent data layer for Storefront & Admin
 */

(function(window) {
  'use strict';

  const STORAGE_KEYS = {
    PRODUCTS: 'aq_products',
    ORDERS: 'aq_orders',
    INVENTORY_LOGS: 'aq_inventory_logs',
    CUSTOMERS: 'aq_customers',
    DISCOUNTS: 'aq_discounts',
    SETTINGS: 'aq_settings',
    CART: 'aq_cart'
  };

  const DEFAULT_SETTINGS = {
    storeName: 'afterquiet',
    tagline: 'wear what you can\'t always say.',
    announcement: 'all items flat 5k • independent accessories & visual culture',
    currency: 'Rp',
    waNumber: '6285708500546',
    instagram: 'afterquiet_____',
    email: 'studio@afterquiet.com',
    shippingCourierPresets: ['J&T Express', 'SiCepat Regular', 'JNE Regular', 'Instant Courier (GoSend/Grab)'],
    accentColor: '#843B40',
    adminPin: '1234'
  };

  const DEFAULT_PRODUCTS = [
    {
      id: "pin_restless",
      sku: "AQ-PIN-01",
      title: "restless mind enamel pin",
      category: "accessories",
      volume: "vol. 01",
      kind: "hard enamel • black nickel finish • 32mm",
      price: 5000,
      stock: 45,
      tag: "pin",
      graphic: "restless\nmind.",
      description: "a small reminder of thoughts that refuse to stay quiet. die-cast hard enamel with black nickel plating and dual rubber clutches.",
      status: "active",
      createdAt: "2026-10-20T08:00:00Z"
    },
    {
      id: "badge_soft",
      sku: "AQ-BDG-01",
      title: "too soft for this world badge",
      category: "accessories",
      volume: "vol. 01",
      kind: "die-struck metal • antique silver • 38mm",
      price: 5000,
      stock: 60,
      tag: "badge",
      graphic: "too soft\nfor this world",
      description: "exploring vulnerability, sensitivity, and the courage to remain emotionally honest in an aggressive world.",
      status: "active",
      createdAt: "2026-10-20T08:05:00Z"
    },
    {
      id: "sticker_pack",
      sku: "AQ-STK-01",
      title: "silence isn't peace sticker",
      category: "accessories",
      volume: "vol. 01",
      kind: "screenprinted weatherproof matte vinyl",
      price: 5000,
      stock: 120,
      tag: "sticker",
      graphic: "silence isn't\nalways peace.",
      description: "heavy-duty screenprinted outdoor matte vinyl sticker. uv protected, waterproof, and scratch resistant.",
      status: "active",
      createdAt: "2026-10-20T08:10:00Z"
    },
    {
      id: "keychain_honesty",
      sku: "AQ-TAG-01",
      title: "emotional honesty tag",
      category: "accessories",
      volume: "vol. 01",
      kind: "solid metal motel tag • gunmetal plated",
      price: 5000,
      stock: 35,
      tag: "tag",
      graphic: "emotional\nhonesty",
      description: "classic hotel motel key tag silhouette rendered in solid zinc alloy with deep engraved lettering.",
      status: "active",
      createdAt: "2026-10-20T08:15:00Z"
    },
    {
      id: "pin_fragile",
      sku: "AQ-PIN-02",
      title: "fragile archives enamel pin",
      category: "accessories",
      volume: "vol. 02",
      kind: "stamped iron • archival antique finish",
      price: 5000,
      stock: 40,
      tag: "pin",
      graphic: "fragile\narchives.",
      description: "centered on identity, memory, and the things people carry internally without speaking out loud.",
      status: "active",
      createdAt: "2026-10-22T09:00:00Z"
    },
    {
      id: "pin_unsaid",
      sku: "AQ-PIN-03",
      title: "easier to wear than explain pin",
      category: "accessories",
      volume: "vol. 02",
      kind: "raw metal stamped pin • archival card",
      price: 5000,
      stock: 55,
      tag: "pin",
      graphic: "easier to wear\nthan explain.",
      description: "some things are simply easier to wear than to explain. high contrast relief typography.",
      status: "active",
      createdAt: "2026-10-22T09:05:00Z"
    },
    {
      id: "badge_resistance",
      sku: "AQ-BDG-02",
      title: "creative resistance button badge",
      category: "accessories",
      volume: "vol. 02",
      kind: "matte laminated button • 44mm pinback",
      price: 5000,
      stock: 80,
      tag: "badge",
      graphic: "creative\nresistance",
      description: "art and design can question social expectations and challenge familiar comfortable ideas.",
      status: "active",
      createdAt: "2026-10-22T09:10:00Z"
    },
    {
      id: "tote_archive",
      sku: "AQ-TOT-01",
      title: "archive canvas tote bag",
      category: "totes",
      volume: "vol. 01",
      kind: "16oz raw organic cotton • ecru archive",
      price: 5000,
      stock: 25,
      tag: "tote",
      graphic: "archive\ntote.",
      description: "heavyweight 16oz unbleached organic cotton canvas tote bag. reinforced box-x stitching on handles.",
      status: "active",
      createdAt: "2026-10-20T08:20:00Z"
    },
    {
      id: "tote_black",
      sku: "AQ-TOT-02",
      title: "utility black canvas tote",
      category: "totes",
      volume: "vol. 02",
      kind: "washed heavyweight canvas • reinforced webbing",
      price: 5000,
      stock: 30,
      tag: "tote",
      graphic: "utility\nblack.",
      description: "deep washed black cotton canvas with military-spec nylon webbing strap and front attachment bar for pins.",
      status: "active",
      createdAt: "2026-10-22T09:15:00Z"
    },
    {
      id: "bag_tactical",
      sku: "AQ-BAG-01",
      title: "restless tactical mini carrier",
      category: "bags",
      volume: "vol. 01",
      kind: "water-resistant nylon • adjustable utility strap",
      price: 5000,
      stock: 20,
      tag: "bag",
      graphic: "tactical\ncarrier.",
      description: "compact everyday crossbody carrier engineered for essentials, featuring cordura nylon and ykk zippers.",
      status: "active",
      createdAt: "2026-10-20T08:25:00Z"
    }
  ];

  const DEFAULT_DISCOUNTS = [
    { code: 'QUIET10', type: 'percentage', value: 10, minSpend: 15000, active: true },
    { code: 'AFTER5K', type: 'fixed', value: 5000, minSpend: 20000, active: true }
  ];

  const DEFAULT_CUSTOMERS = [
    { id: 'CUST-001', name: 'Rian Pratama', phone: '081298765432', city: 'Jakarta Selatan', orderCount: 2, totalSpend: 25000, lastOrder: '2026-10-27T14:30:00Z' },
    { id: 'CUST-002', name: 'Nadia S.', phone: '085712345678', city: 'Bandung', orderCount: 1, totalSpend: 15000, lastOrder: '2026-10-28T08:15:00Z' }
  ];

  const DEFAULT_ORDERS = [
    {
      id: 'AQ-1082',
      customer: { name: 'Rian Pratama', phone: '081298765432', city: 'Jakarta Selatan', address: 'Kebayoran Baru, Jakarta Selatan' },
      items: [
        { id: 'pin_restless', title: 'restless mind enamel pin', price: 5000, qty: 2, total: 10000 },
        { id: 'sticker_pack', title: 'silence isn\'t peace sticker', price: 5000, qty: 1, total: 5000 }
      ],
      subtotal: 15000,
      discount: 0,
      total: 15000,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      courier: 'J&T Express',
      trackingNumber: 'JT892019281',
      notes: 'Please pack in protective sleeve',
      createdAt: '2026-10-27T14:30:00Z'
    },
    {
      id: 'AQ-1083',
      customer: { name: 'Nadia S.', phone: '085712345678', city: 'Bandung', address: 'Dago, Coblong, Bandung' },
      items: [
        { id: 'badge_soft', title: 'too soft for this world badge', price: 5000, qty: 1, total: 5000 },
        { id: 'tote_archive', title: 'archive canvas tote bag', price: 5000, qty: 1, total: 5000 },
        { id: 'keychain_honesty', title: 'emotional honesty tag', price: 5000, qty: 1, total: 5000 }
      ],
      subtotal: 15000,
      discount: 0,
      total: 15000,
      paymentStatus: 'paid',
      fulfillmentStatus: 'unfulfilled',
      courier: 'SiCepat',
      trackingNumber: '',
      notes: 'Custom placement studio order',
      createdAt: '2026-10-28T08:15:00Z'
    }
  ];

  // ================= STORAGE INITIALIZER =================
  function getJson(key, defaultVal) {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultVal;
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Storage read failed for', key, e);
      return defaultVal;
    }
  }

  function setJson(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      window.dispatchEvent(new CustomEvent('aq_store_updated', { detail: { key, val } }));
    } catch (e) {
      console.error('Storage write failed for', key, e);
    }
  }

  function initDatabase() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      setJson(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      setJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DISCOUNTS)) {
      setJson(STORAGE_KEYS.DISCOUNTS, DEFAULT_DISCOUNTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      setJson(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      setJson(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      setJson(STORAGE_KEYS.CART, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY_LOGS)) {
      setJson(STORAGE_KEYS.INVENTORY_LOGS, [
        { timestamp: '2026-10-20T08:00:00Z', sku: 'AQ-PIN-01', delta: 45, reason: 'Initial inventory intake' },
        { timestamp: '2026-10-20T08:05:00Z', sku: 'AQ-BDG-01', delta: 60, reason: 'Initial inventory intake' }
      ]);
    }
  }

  // ================= FORMATTERS =================
  function formatRupiah(amount) {
    return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
  }

  function formatDate(isoStr) {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoStr;
    }
  }

  // ================= COMMERCE ENGINE API =================
  const Engine = {
    init: initDatabase,
    formatRupiah,
    formatDate,

    // SETTINGS
    getSettings() {
      return getJson(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    },
    saveSettings(newSettings) {
      const current = this.getSettings();
      const updated = { ...current, ...newSettings };
      setJson(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    },

    // PRODUCTS & INVENTORY
    getProducts(includeDrafts = true) {
      const list = getJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      if (includeDrafts) return list;
      return list.filter(p => p.status === 'active');
    },
    getProductById(id) {
      const list = this.getProducts(true);
      return list.find(p => p.id === id) || null;
    },
    saveProduct(productData) {
      const list = this.getProducts(true);
      if (productData.id) {
        const index = list.findIndex(p => p.id === productData.id);
        if (index !== -1) {
          const oldStock = Number(list[index].stock || 0);
          const newStock = Number(productData.stock || 0);
          if (oldStock !== newStock) {
            this.logInventoryAdjustment(productData.sku || productData.id, newStock - oldStock, 'Manual stock update');
          }
          list[index] = { ...list[index], ...productData, updatedAt: new Date().toISOString() };
        } else {
          list.unshift({ ...productData, createdAt: new Date().toISOString() });
        }
      } else {
        const newId = 'aq_' + Date.now().toString(36);
        const newProduct = {
          ...productData,
          id: newId,
          sku: productData.sku || ('AQ-' + Math.floor(1000 + Math.random() * 9000)),
          createdAt: new Date().toISOString()
        };
        list.unshift(newProduct);
        this.logInventoryAdjustment(newProduct.sku, Number(newProduct.stock || 0), 'Initial intake');
      }
      setJson(STORAGE_KEYS.PRODUCTS, list);
      return list;
    },
    deleteProduct(id) {
      const list = this.getProducts(true).filter(p => p.id !== id);
      setJson(STORAGE_KEYS.PRODUCTS, list);
      return list;
    },
    adjustStock(idOrSku, delta, reason = 'Adjustment') {
      const list = this.getProducts(true);
      const item = list.find(p => p.id === idOrSku || p.sku === idOrSku);
      if (!item) return false;

      item.stock = Math.max(0, Number(item.stock || 0) + Number(delta));
      this.logInventoryAdjustment(item.sku || item.id, delta, reason);
      setJson(STORAGE_KEYS.PRODUCTS, list);
      return item;
    },
    logInventoryAdjustment(sku, delta, reason) {
      const logs = getJson(STORAGE_KEYS.INVENTORY_LOGS, []);
      logs.unshift({
        timestamp: new Date().toISOString(),
        sku,
        delta: Number(delta),
        reason
      });
      if (logs.length > 200) logs.pop();
      setJson(STORAGE_KEYS.INVENTORY_LOGS, logs);
    },
    getInventoryLogs() {
      return getJson(STORAGE_KEYS.INVENTORY_LOGS, []);
    },

    // ORDERS LIFECYCLE
    getOrders() {
      return getJson(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    },
    getOrderById(id) {
      const list = this.getOrders();
      return list.find(o => o.id === id) || null;
    },
    createOrder({ customer, items, subtotal, discount = 0, total, notes = '', courier = 'Standard Courier' }) {
      const orders = this.getOrders();
      const orderId = 'AQ-' + Math.floor(1000 + Math.random() * 9000);
      const newOrder = {
        id: orderId,
        customer,
        items,
        subtotal,
        discount,
        total,
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'unfulfilled',
        courier,
        trackingNumber: '',
        notes,
        createdAt: new Date().toISOString()
      };

      // Automatically deduct inventory stock & log
      items.forEach(item => {
        this.adjustStock(item.id, -item.qty, `Order placement ${orderId}`);
      });

      // Upsert Customer
      this.upsertCustomer(customer, total);

      orders.unshift(newOrder);
      setJson(STORAGE_KEYS.ORDERS, orders);
      return newOrder;
    },
    updateOrderStatus(orderId, { paymentStatus, fulfillmentStatus, trackingNumber, courier }) {
      const orders = this.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order) return null;

      if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;
      if (fulfillmentStatus !== undefined) order.fulfillmentStatus = fulfillmentStatus;
      if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
      if (courier !== undefined) order.courier = courier;
      order.updatedAt = new Date().toISOString();

      setJson(STORAGE_KEYS.ORDERS, orders);
      return order;
    },
    cancelOrder(orderId, reason = 'Customer cancellation') {
      const orders = this.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order || order.fulfillmentStatus === 'cancelled') return null;

      // Restore stock
      order.items.forEach(item => {
        this.adjustStock(item.id, item.qty, `Order cancellation refund ${orderId}`);
      });

      order.fulfillmentStatus = 'cancelled';
      order.paymentStatus = 'refunded';
      order.notes = (order.notes ? order.notes + ' | ' : '') + 'Cancelled: ' + reason;
      order.updatedAt = new Date().toISOString();

      setJson(STORAGE_KEYS.ORDERS, orders);
      return order;
    },

    // CUSTOMERS
    getCustomers() {
      return getJson(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    },
    upsertCustomer(customerData, spendAmount) {
      if (!customerData || !customerData.phone) return;
      const customers = this.getCustomers();
      const cleanPhone = customerData.phone.replace(/[^0-9]/g, '');
      const existing = customers.find(c => (c.phone || '').replace(/[^0-9]/g, '') === cleanPhone);

      if (existing) {
        existing.name = customerData.name || existing.name;
        existing.city = customerData.city || existing.city;
        existing.orderCount = (existing.orderCount || 0) + 1;
        existing.totalSpend = (existing.totalSpend || 0) + Number(spendAmount || 0);
        existing.lastOrder = new Date().toISOString();
      } else {
        customers.unshift({
          id: 'CUST-' + Math.floor(100 + Math.random() * 900),
          name: customerData.name || 'Anonymous Customer',
          phone: customerData.phone,
          city: customerData.city || 'Indonesia',
          orderCount: 1,
          totalSpend: Number(spendAmount || 0),
          lastOrder: new Date().toISOString()
        });
      }
      setJson(STORAGE_KEYS.CUSTOMERS, customers);
    },

    // DISCOUNTS
    getDiscounts() {
      return getJson(STORAGE_KEYS.DISCOUNTS, DEFAULT_DISCOUNTS);
    },
    saveDiscount(discountObj) {
      const list = this.getDiscounts();
      const code = discountObj.code.toUpperCase().trim();
      const index = list.findIndex(d => d.code === code);
      if (index !== -1) {
        list[index] = { ...list[index], ...discountObj, code };
      } else {
        list.unshift({ ...discountObj, code });
      }
      setJson(STORAGE_KEYS.DISCOUNTS, list);
      return list;
    },
    deleteDiscount(code) {
      const list = this.getDiscounts().filter(d => d.code !== code.toUpperCase().trim());
      setJson(STORAGE_KEYS.DISCOUNTS, list);
      return list;
    },
    validateDiscount(code, subtotal) {
      const list = this.getDiscounts();
      const target = list.find(d => d.code === (code || '').toUpperCase().trim() && d.active);
      if (!target) return { valid: false, message: 'Invalid or inactive discount code' };
      if (subtotal < (target.minSpend || 0)) {
        return { valid: false, message: `Minimum spend for ${target.code} is ${formatRupiah(target.minSpend)}` };
      }
      const deduction = target.type === 'percentage' 
        ? Math.round(subtotal * (target.value / 100))
        : target.value;
      return { valid: true, discount: target, deduction: Math.min(deduction, subtotal) };
    },

    // CART (PERSISTENT & REACTIVE)
    getCart() {
      return getJson(STORAGE_KEYS.CART, []);
    },
    addToCart(productId, qty = 1) {
      const cart = this.getCart();
      const product = this.getProductById(productId);
      if (!product || product.status !== 'active') return cart;

      const currentStock = Number(product.stock !== undefined ? product.stock : 50);
      if (currentStock <= 0) {
        this.showToast(`Sorry, ${product.title} is currently sold out.`);
        return cart;
      }

      const existing = cart.find(item => item.id === productId);
      if (existing) {
        if (existing.qty + qty > currentStock) {
          existing.qty = currentStock;
          this.showToast(`Maximum available stock reached (${currentStock} units).`);
        } else {
          existing.qty += qty;
        }
      } else {
        const safeQty = Math.min(qty, currentStock);
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price || 5000,
          kind: product.kind || '',
          graphic: product.graphic || product.title,
          qty: safeQty
        });
      }
      setJson(STORAGE_KEYS.CART, cart);
      this.syncCartBadge();
      this.renderCartDrawerUI();
      this.showToast(`Added "${product.title}" to bag`);
      return cart;
    },
    updateCartQty(productId, qty) {
      let cart = this.getCart();
      const product = this.getProductById(productId);
      const maxStock = product ? Number(product.stock !== undefined ? product.stock : 999) : 999;

      if (qty <= 0) {
        cart = cart.filter(item => item.id !== productId);
      } else {
        const item = cart.find(i => i.id === productId);
        if (item) {
          item.qty = Math.min(qty, maxStock);
          if (qty > maxStock) {
            this.showToast(`Stock limit reached (${maxStock} units).`);
          }
        }
      }
      setJson(STORAGE_KEYS.CART, cart);
      this.syncCartBadge();
      this.renderCartDrawerUI();
      return cart;
    },
    removeFromCart(productId) {
      return this.updateCartQty(productId, 0);
    },
    clearCart() {
      setJson(STORAGE_KEYS.CART, []);
      this.syncCartBadge();
      this.renderCartDrawerUI();
      return [];
    },
    getCartTotals(discountCode = null) {
      const cart = this.getCart();
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      let deduction = 0;
      let appliedDiscount = null;

      if (discountCode) {
        const res = this.validateDiscount(discountCode, subtotal);
        if (res.valid) {
          deduction = res.deduction;
          appliedDiscount = res.discount;
        }
      }

      return {
        count: cart.reduce((sum, item) => sum + item.qty, 0),
        subtotal,
        discountDeduction: deduction,
        appliedDiscount,
        total: Math.max(0, subtotal - deduction)
      };
    },
    syncCartBadge() {
      const totals = this.getCartTotals();
      document.querySelectorAll('#bagCounter, .bag-count-indicator').forEach(el => {
        el.innerText = totals.count;
      });
    },

    // CSV IMPORT & EXPORT
    exportProductsCSV() {
      const list = this.getProducts(true);
      const headers = ['id', 'sku', 'title', 'category', 'volume', 'price', 'stock', 'kind', 'tag', 'status', 'description'];
      const rows = [headers.join(',')];

      list.forEach(p => {
        const row = [
          `"${p.id || ''}"`,
          `"${p.sku || ''}"`,
          `"${(p.title || '').replace(/"/g, '""')}"`,
          `"${p.category || 'accessories'}"`,
          `"${p.volume || 'vol. 01'}"`,
          p.price || 5000,
          p.stock !== undefined ? p.stock : 50,
          `"${(p.kind || '').replace(/"/g, '""')}"`,
          `"${p.tag || 'item'}"`,
          `"${p.status || 'active'}"`,
          `"${(p.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ];
        rows.push(row.join(','));
      });

      const blob = new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `afterquiet_products_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    // WHATSAPP CHECKOUT BUILDER
    buildWhatsAppOrderUrl(customerData, courier = 'Standard Courier', discountCode = null) {
      const settings = this.getSettings();
      const cart = this.getCart();
      if (cart.length === 0) return null;

      const totals = this.getCartTotals(discountCode);
      const itemsList = cart.map(i => ({
        id: i.id,
        title: i.title,
        price: i.price,
        qty: i.qty,
        total: i.price * i.qty
      }));

      // Record formal order into engine!
      const formalOrder = this.createOrder({
        customer: customerData,
        items: itemsList,
        subtotal: totals.subtotal,
        discount: totals.discountDeduction,
        total: totals.total,
        courier,
        notes: customerData.notes || 'Order placed via storefront'
      });

      // Clear shopping bag after successful placement
      this.clearCart();

      // Build WhatsApp pre-filled text
      const cleanWa = (settings.waNumber || '6285708500546').replace(/[^0-9]/g, '');
      let text = `Halo afterquiet,\nSaya ingin melakukan pemesanan resmi:\n\n`;
      text += `*ORDER REF:* ${formalOrder.id}\n`;
      text += `*NAMA:* ${customerData.name}\n`;
      text += `*NO. WHATSAPP:* ${customerData.phone}\n`;
      text += `*ALAMAT:* ${customerData.address}, ${customerData.city}\n`;
      text += `*KURIR:* ${courier}\n`;
      if (customerData.notes) text += `*CATATAN:* ${customerData.notes}\n`;
      text += `\n*ITEMS PESANAN:*\n`;

      itemsList.forEach(item => {
        text += `• ${item.title} (${item.qty}x) — ${formatRupiah(item.total)}\n`;
      });

      if (totals.discountDeduction > 0) {
        text += `\n*SUBTOTAL:* ${formatRupiah(totals.subtotal)}\n`;
        text += `*DISCOUNT:* -${formatRupiah(totals.discountDeduction)} (${totals.appliedDiscount.code})\n`;
      }
      text += `\n*TOTAL PEMBAYARAN:* ${formatRupiah(totals.total)}\n\n`;
      text += `Mohon konfirmasi ketersediaan stok & rincian rekening transfer bank/QRIS. Terima kasih.`;

      return `https://wa.me/${cleanWa}?text=${encodeURIComponent(text)}`;
    },

    // TOAST NOTIFICATION
    showToast(msg) {
      let toast = document.getElementById('aqGlobalToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'aqGlobalToast';
        toast.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:#171717; color:#F1EFE9; padding:12px 24px; border-radius:4px; font-size:12px; font-family:"Inter",sans-serif; font-weight:500; z-index:99999; box-shadow:0 8px 24px rgba(0,0,0,0.3); pointer-events:none; opacity:0; transition:opacity 0.25s, transform 0.25s; text-align:center; max-width:90vw;';
        document.body.appendChild(toast);
      }
      toast.innerText = msg;
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
      clearTimeout(window.__aqToastTimer);
      window.__aqToastTimer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
      }, 3000);
    },

    // ================= UNIVERSAL SLIDE-OVER CART & CHECKOUT UI =================
    activeDiscountCode: null,
    isCheckoutFormVisible: false,

    openBag() {
      const overlay = document.getElementById('aqCartOverlay');
      const panel = document.getElementById('aqCartPanel');
      if (!overlay || !panel) {
        this.mountCartDrawer();
        return this.openBag();
      }
      this.renderCartDrawerUI();
      overlay.style.display = 'block';
      setTimeout(() => {
        overlay.style.opacity = '1';
        panel.style.transform = 'translateX(0)';
      }, 10);
      document.body.style.overflow = 'hidden';
    },

    closeBag() {
      const overlay = document.getElementById('aqCartOverlay');
      const panel = document.getElementById('aqCartPanel');
      if (overlay && panel) {
        panel.style.transform = 'translateX(100%)';
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
          document.body.style.overflow = '';
        }, 300);
      }
      this.isCheckoutFormVisible = false;
    },

    toggleCheckoutView(show) {
      this.isCheckoutFormVisible = show;
      this.renderCartDrawerUI();
    },

    applyDiscountFromInput() {
      const input = document.getElementById('aqDiscountInput');
      if (!input) return;
      const code = input.value.trim().toUpperCase();
      if (!code) return;

      const totals = this.getCartTotals();
      const res = this.validateDiscount(code, totals.subtotal);
      if (res.valid) {
        this.activeDiscountCode = code;
        this.showToast(`Coupon ${code} applied: -${formatRupiah(res.deduction)}`);
      } else {
        alert(res.message);
      }
      this.renderCartDrawerUI();
    },

    removeAppliedDiscount() {
      this.activeDiscountCode = null;
      this.renderCartDrawerUI();
    },

    submitStoreCheckout() {
      const name = (document.getElementById('aqCustName') ? document.getElementById('aqCustName').value : '').trim();
      const phone = (document.getElementById('aqCustPhone') ? document.getElementById('aqCustPhone').value : '').trim();
      const address = (document.getElementById('aqCustAddress') ? document.getElementById('aqCustAddress').value : '').trim();
      const city = (document.getElementById('aqCustCity') ? document.getElementById('aqCustCity').value : '').trim();
      const courier = (document.getElementById('aqCourierSelect') ? document.getElementById('aqCourierSelect').value : 'J&T Express');
      const notes = (document.getElementById('aqOrderNotes') ? document.getElementById('aqOrderNotes').value : '').trim();

      if (!name) {
        alert('Please enter your recipient name.');
        document.getElementById('aqCustName').focus();
        return;
      }
      if (!phone || phone.length < 9) {
        alert('Please enter a valid WhatsApp phone number.');
        document.getElementById('aqCustPhone').focus();
        return;
      }
      if (!address) {
        alert('Please enter your full delivery address.');
        document.getElementById('aqCustAddress').focus();
        return;
      }
      if (!city) {
        alert('Please enter your destination city / district.');
        document.getElementById('aqCustCity').focus();
        return;
      }

      const waUrl = this.buildWhatsAppOrderUrl(
        { name, phone, address, city, notes },
        courier,
        this.activeDiscountCode
      );

      if (waUrl) {
        this.showToast('Order recorded! Redirecting to WhatsApp...');
        this.closeBag();
        window.open(waUrl, '_blank');
      }
    },

    renderCartDrawerUI() {
      const bodyContainer = document.getElementById('aqCartBodyContainer');
      const footContainer = document.getElementById('aqCartFootContainer');
      const countHeader = document.getElementById('aqCartItemCount');
      if (!bodyContainer || !footContainer) return;

      const cart = this.getCart();
      const totals = this.getCartTotals(this.activeDiscountCode);

      if (countHeader) countHeader.innerText = `(${totals.count} piece${totals.count === 1 ? '' : 's'})`;

      if (cart.length === 0) {
        this.isCheckoutFormVisible = false;
        bodyContainer.innerHTML = `
          <div style="text-align:center; padding:70px 20px; color:#85827D;">
            <div style="font-family:'Space Grotesk',sans-serif; font-size:20px; font-weight:700; color:#171717; margin-bottom:8px;">your bag is empty</div>
            <p style="font-size:13px; line-height:1.6; margin-bottom:24px;">all pieces flat 5k • wear what you can't always say</p>
            <a href="/allcollection" onclick="AfterquietStore.closeBag()" style="display:inline-block; background:#171717; color:#F1EFE9; font-size:12px; font-weight:600; padding:12px 24px; border-radius:2px; text-decoration:none;">explore catalogue →</a>
          </div>
        `;
        footContainer.innerHTML = '';
        return;
      }

      if (!this.isCheckoutFormVisible) {
        // VIEW 1: ITEMS IN BAG
        let itemsHtml = '<div style="display:flex; flex-direction:column; gap:16px;">';
        cart.forEach(item => {
          const lineTotal = item.price * item.qty;
          itemsHtml += `
            <div style="display:flex; gap:14px; padding:14px; background:#FFFFFF; border:1px solid #E2DFD7; border-radius:3px; align-items:center;">
              <div style="width:48px; height:48px; background:#171717; color:#F1EFE9; display:flex; align-items:center; justify-content:center; text-align:center; font-family:'IBM Plex Mono',monospace; font-size:9px; padding:4px; line-height:1.1; border-radius:2px; flex-shrink:0;">
                ${(item.graphic || item.title).slice(0, 16)}
              </div>
              <div style="flex:1; min-width:0;">
                <div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:13px; color:#171717; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.title}</div>
                <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:#85827D; margin-top:2px;">${formatRupiah(item.price)} each</div>
                <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
                  <div style="display:inline-flex; align-items:center; border:1px solid #171717; border-radius:2px; background:#F1EFE9;">
                    <button onclick="AfterquietStore.updateCartQty('${item.id}', ${item.qty - 1})" style="border:none; background:none; padding:2px 8px; font-size:13px; font-weight:700; cursor:pointer;">-</button>
                    <span style="font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:600; padding:0 6px;">${item.qty}</span>
                    <button onclick="AfterquietStore.updateCartQty('${item.id}', ${item.qty + 1})" style="border:none; background:none; padding:2px 8px; font-size:13px; font-weight:700; cursor:pointer;">+</button>
                  </div>
                  <button onclick="AfterquietStore.removeFromCart('${item.id}')" style="background:none; border:none; color:#843B40; font-size:11px; text-decoration:underline; cursor:pointer;">remove</button>
                </div>
              </div>
              <div style="text-align:right; font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:13px; color:#171717;">
                ${formatRupiah(lineTotal)}
              </div>
            </div>
          `;
        });
        itemsHtml += '</div>';

        // Coupon input section
        itemsHtml += `
          <div style="margin-top:24px; padding:16px; background:#F1EFE9; border:1px dashed #C9C6BE; border-radius:3px;">
            <div style="font-size:11px; font-family:'IBM Plex Mono',monospace; font-weight:600; text-transform:uppercase; color:#85827D; margin-bottom:8px;">coupon / promo code</div>
            ${this.activeDiscountCode ? `
              <div style="display:flex; justify-content:space-between; align-items:center; background:#171717; color:#F1EFE9; padding:8px 12px; border-radius:3px; font-size:12px;">
                <span>Applied: <strong>${this.activeDiscountCode}</strong> (-${formatRupiah(totals.discountDeduction)})</span>
                <button onclick="AfterquietStore.removeAppliedDiscount()" style="background:none; border:none; color:#D89599; cursor:pointer; font-size:14px; font-weight:bold;">✕</button>
              </div>
            ` : `
              <div style="display:flex; gap:8px;">
                <input id="aqDiscountInput" type="text" placeholder="e.g. QUIET10" style="flex:1; padding:8px 10px; border:1px solid #171717; background:white; font-family:'IBM Plex Mono',monospace; font-size:12px; text-transform:uppercase; border-radius:2px;">
                <button onclick="AfterquietStore.applyDiscountFromInput()" style="background:#171717; color:#F1EFE9; border:none; padding:8px 16px; font-size:11px; font-weight:600; border-radius:2px; cursor:pointer;">apply</button>
              </div>
            `}
          </div>
        `;
        bodyContainer.innerHTML = itemsHtml;

        // Footer with totals and Proceed to Express Checkout button
        footContainer.innerHTML = `
          <div style="border-top:1px solid #171717; padding-top:16px;">
            <div style="display:flex; justify-content:space-between; font-size:13px; color:#85827D; margin-bottom:6px;">
              <span>subtotal (${totals.count} items)</span>
              <span style="font-family:'IBM Plex Mono',monospace;">${formatRupiah(totals.subtotal)}</span>
            </div>
            ${totals.discountDeduction > 0 ? `
              <div style="display:flex; justify-content:space-between; font-size:13px; color:#843B40; margin-bottom:6px;">
                <span>discount (${totals.appliedDiscount ? totals.appliedDiscount.code : ''})</span>
                <span style="font-family:'IBM Plex Mono',monospace;">-${formatRupiah(totals.discountDeduction)}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:15px; font-weight:700; color:#171717; margin-bottom:18px;">
              <span>total</span>
              <span style="font-family:'IBM Plex Mono',monospace; font-size:22px;">${formatRupiah(totals.total)}</span>
            </div>
            <button onclick="AfterquietStore.toggleCheckoutView(true)" style="width:100%; background:#171717; color:#F1EFE9; border:none; padding:15px; font-size:13px; font-weight:700; letter-spacing:0.04em; text-transform:lowercase; border-radius:2px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.15s;">
              <span>proceed to checkout</span>
              <span>→</span>
            </button>
          </div>
        `;
      } else {
        // VIEW 2: EXPRESS CHECKOUT FORM
        const settings = this.getSettings();
        const couriers = settings.shippingCourierPresets || ['J&T Express', 'SiCepat Regular', 'JNE Regular', 'Instant Courier'];

        bodyContainer.innerHTML = `
          <div>
            <button onclick="AfterquietStore.toggleCheckoutView(false)" style="background:none; border:none; font-size:12px; font-weight:600; color:#85827D; cursor:pointer; margin-bottom:16px; display:inline-flex; align-items:center; gap:4px;">
              ← back to items
            </button>
            <div style="font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; margin-bottom:4px;">shipping & contact details</div>
            <p style="font-size:12px; color:#85827D; margin-bottom:18px;">enter your details for automated fulfillment and order routing.</p>

            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <label style="display:block; font-size:11px; font-weight:600; text-transform:uppercase; font-family:'IBM Plex Mono',monospace; margin-bottom:4px;">full name *</label>
                <input id="aqCustName" type="text" placeholder="e.g. Alex Pratama" style="width:100%; padding:10px 12px; border:1px solid #171717; background:white; font-size:13px; border-radius:2px; box-sizing:border-box;">
              </div>
              <div>
                <label style="display:block; font-size:11px; font-weight:600; text-transform:uppercase; font-family:'IBM Plex Mono',monospace; margin-bottom:4px;">whatsapp phone number *</label>
                <input id="aqCustPhone" type="tel" placeholder="e.g. 081234567890" style="width:100%; padding:10px 12px; border:1px solid #171717; background:white; font-size:13px; font-family:'IBM Plex Mono',monospace; border-radius:2px; box-sizing:border-box;">
              </div>
              <div>
                <label style="display:block; font-size:11px; font-weight:600; text-transform:uppercase; font-family:'IBM Plex Mono',monospace; margin-bottom:4px;">shipping address *</label>
                <textarea id="aqCustAddress" rows="2" placeholder="Street, building/apt, RT/RW, subdistrict" style="width:100%; padding:10px 12px; border:1px solid #171717; background:white; font-size:13px; border-radius:2px; box-sizing:border-box; font-family:inherit;"></textarea>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <div>
                  <label style="display:block; font-size:11px; font-weight:600; text-transform:uppercase; font-family:'IBM Plex Mono',monospace; margin-bottom:4px;">city / district *</label>
                  <input id="aqCustCity" type="text" placeholder="e.g. Jakarta Selatan" style="width:100%; padding:10px 12px; border:1px solid #171717; background:white; font-size:13px; border-radius:2px; box-sizing:border-box;">
                </div>
                <div>
                  <label style="display:block; font-size:11px; font-weight:600; text-transform:uppercase; font-family:'IBM Plex Mono',monospace; margin-bottom:4px;">courier</label>
                  <select id="aqCourierSelect" style="width:100%; padding:10px 12px; border:1px solid #171717; background:white; font-size:12px; border-radius:2px; box-sizing:border-box;">
                    ${couriers.map(c => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div>
                <label style="display:block; font-size:11px; font-weight:600; text-transform:uppercase; font-family:'IBM Plex Mono',monospace; margin-bottom:4px;">order notes (optional)</label>
                <input id="aqOrderNotes" type="text" placeholder="e.g. handle with extra care" style="width:100%; padding:10px 12px; border:1px solid #171717; background:white; font-size:13px; border-radius:2px; box-sizing:border-box;">
              </div>
            </div>
          </div>
        `;

        footContainer.innerHTML = `
          <div style="border-top:1px solid #171717; padding-top:16px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:14px; font-weight:700; color:#171717; margin-bottom:14px;">
              <span>total payable (${totals.count} items):</span>
              <span style="font-family:'IBM Plex Mono',monospace; font-size:22px; color:#171717;">${formatRupiah(totals.total)}</span>
            </div>
            <button onclick="AfterquietStore.submitStoreCheckout()" style="width:100%; background:#171717; color:#F1EFE9; border:none; padding:16px; font-size:13px; font-weight:700; letter-spacing:0.04em; text-transform:lowercase; border-radius:2px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.15s;">
              <span>place order via whatsapp</span>
              <span>↗</span>
            </button>
            <p style="font-size:11px; color:#85827D; text-align:center; margin-top:10px; font-family:'IBM Plex Mono',monospace;">
              order ref & inventory reserved automatically
            </p>
          </div>
        `;
      }
    },

    mountCartDrawer() {
      if (document.getElementById('aqCartOverlay')) return;
      if (window.location.pathname.includes('admin')) return;

      const overlay = document.createElement('div');
      overlay.id = 'aqCartOverlay';
      overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); z-index:99990; display:none; opacity:0; transition:opacity 0.25s ease;';

      const panel = document.createElement('div');
      panel.id = 'aqCartPanel';
      panel.style.cssText = 'position:fixed; top:0; right:0; bottom:0; width:100%; max-width:440px; background:#FAF9F6; border-left:1.5px solid #171717; z-index:99991; display:flex; flex-direction:column; justify-content:space-between; padding:28px 24px; box-sizing:border-box; transform:translateX(100%); transition:transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); box-shadow:-10px 0 30px rgba(0,0,0,0.15);';

      panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:18px; border-bottom:1.5px solid #171717;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="/assets/profile.jpg" alt="logo" style="width:28px; height:28px; border-radius:50%; border:1.5px solid #171717;">
            <span style="font-family:'Space Grotesk',sans-serif; font-size:18px; font-weight:700; letter-spacing:-0.03em;">shopping bag</span>
            <span id="aqCartItemCount" style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#85827D;">(0)</span>
          </div>
          <button onclick="AfterquietStore.closeBag()" aria-label="Close bag" style="background:none; border:none; font-size:26px; line-height:1; cursor:pointer; color:#171717; padding:4px;">×</button>
        </div>

        <div id="aqCartBodyContainer" style="flex:1; overflow-y:auto; padding:20px 0; overscroll-behavior:contain;"></div>

        <div id="aqCartFootContainer"></div>
      `;

      overlay.appendChild(panel);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeBag();
      });
      document.body.appendChild(overlay);

      // Bind all bag trigger buttons across the site
      document.querySelectorAll('#openBagBtn, .open-bag-btn, .btn-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openBag();
        });
      });

      this.syncCartBadge();
    }
  };

  // Run initial setup
  Engine.init();

  // DOM ready hook
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      Engine.mountCartDrawer();
      Engine.syncCartBadge();
    });
  } else {
    Engine.mountCartDrawer();
    Engine.syncCartBadge();
  }

  // Cross-tab Synchronization
  window.addEventListener('storage', (e) => {
    if (Object.values(STORAGE_KEYS).includes(e.key)) {
      Engine.syncCartBadge();
      Engine.renderCartDrawerUI();
      window.dispatchEvent(new CustomEvent('aq_store_updated', { detail: { key: e.key } }));
    }
  });

  window.AfterquietStore = Engine;

})(window);
