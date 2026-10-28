/**
 * afterquiet — Independent Commerce Operating Engine
 * Unified persistent data layer for Storefront & Admin
 * Featuring Centralized Multi-Device Persistence, Stock Reservation Lifecycle, & Cryptographic Security
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
    CART: 'aq_cart',
    COLLECTIONS: 'aq_collections',
    CATEGORIES: 'aq_categories',
    PRODUCT_TYPES: 'aq_product_types',
    CLOUD_META: 'aq_cloud_sync_meta'
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
    adminPinHash: 'd82c3598202da92e4c62402f115ac8da0d32cb8aec3b3959cd1e025a89913ad6', // salted SHA-256 for '1234'
    adminSalt: 'afterquiet_sec_2026',
    sessionTimeoutMinutes: 30,
    cloudDb: {
      enabled: true,
      provider: 'rest',
      endpoint: '/api/sync',
      authSecret: '',
      pollIntervalMs: 20000
    }
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
      reserved: 0,
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
      reserved: 0,
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
      reserved: 0,
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
      reserved: 0,
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
      reserved: 0,
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
      reserved: 0,
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
      reserved: 0,
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
      reserved: 0,
      tag: "tote",
      graphic: "archive\ntote.",
      description: "heavyweight 16oz unbleached organic cotton canvas tote bag. reinforced box-x stitching on handles.",
      status: "active",
      createdAt: "2026-10-24T11:00:00Z"
    }
  ];

  const DEFAULT_DISCOUNTS = [
    { code: 'QUIET10', type: 'percentage', value: 10, minSpend: 10000, active: true },
    { code: 'FIRST5K', type: 'fixed', value: 5000, minSpend: 25000, active: true }
  ];

  const DEFAULT_COLLECTIONS = [
    {
      id: "col_vol01",
      title: "vol. 01 — too soft for this world",
      slug: "vol-01",
      volumeTag: "vol. 01",
      description: "exploring vulnerability, sensitivity, and emotional honesty in an aggressive world.",
      image: "",
      status: "published",
      sortOrder: "manual",
      createdAt: "2026-10-20T08:00:00Z"
    },
    {
      id: "col_vol02",
      title: "vol. 02 — fragile archives",
      slug: "vol-02",
      volumeTag: "vol. 02",
      description: "centered on identity, memory, and the unspoken thoughts people carry internally.",
      image: "",
      status: "published",
      sortOrder: "manual",
      createdAt: "2026-10-22T08:00:00Z"
    },
    {
      id: "col_pins",
      title: "Pins & Badges",
      slug: "pins-badges",
      volumeTag: "accessories",
      description: "hard enamel die-cast metal pins, antique die-struck badges, and quiet resistance buttons.",
      image: "",
      status: "published",
      sortOrder: "manual",
      createdAt: "2026-10-23T08:00:00Z"
    },
    {
      id: "col_totes",
      title: "Canvas Totes",
      slug: "canvas-totes",
      volumeTag: "totes",
      description: "heavyweight 16oz organic cotton canvas tote bags with reinforced stitching.",
      image: "",
      status: "published",
      sortOrder: "manual",
      createdAt: "2026-10-24T08:00:00Z"
    },
    {
      id: "col_all",
      title: "All Catalogue (Flat 5K)",
      slug: "all-catalogue",
      volumeTag: "all",
      description: "complete independent objects archive. every piece flat Rp 5.000.",
      image: "",
      status: "published",
      sortOrder: "manual",
      createdAt: "2026-10-24T08:00:00Z"
    }
  ];

  const DEFAULT_CATEGORIES = [
    { id: "cat_pins_badges", name: "Pins & Badges", slug: "accessories", description: "Enamel pins, metal badges, and wearable objects" },
    { id: "cat_stickers_tags", name: "Stickers & Tags", slug: "stickers", description: "Weatherproof vinyl stickers and motel tags" },
    { id: "cat_totes_bags", name: "Totes & Bags", slug: "totes", description: "Canvas bags and everyday carriers" },
    { id: "cat_apparel", name: "Apparel & Wear", slug: "apparel", description: "Future wearable culture and graphic garments" }
  ];

  const DEFAULT_PRODUCT_TYPES = [
    "hard enamel • black nickel finish • 32mm",
    "die-struck metal • antique silver • 38mm",
    "screenprinted weatherproof matte vinyl",
    "solid metal motel tag • gunmetal plated",
    "stamped iron • archival antique finish",
    "raw metal stamped pin • archival card",
    "matte laminated button • 44mm pinback",
    "16oz raw organic cotton • ecru archive"
  ];

  const DEFAULT_CUSTOMERS = [
    { id: 'CUST-001', name: 'Rian Adhitama', phone: '081298765432', city: 'Jakarta Selatan', orderCount: 1, totalSpend: 15000, lastOrder: '2026-10-27T14:30:00Z' },
    { id: 'CUST-002', name: 'Nadia S.', phone: '085712345678', city: 'Bandung', orderCount: 1, totalSpend: 15000, lastOrder: '2026-10-28T08:15:00Z' }
  ];

  const DEFAULT_ORDERS = [
    {
      id: 'AQ-1082',
      customer: { name: 'Rian Adhitama', phone: '081298765432', city: 'Jakarta Selatan', address: 'Jl. Senopati No. 42, Kebayoran Baru' },
      items: [
        { id: 'pin_restless', title: 'restless mind enamel pin', price: 5000, qty: 2, total: 10000 },
        { id: 'sticker_pack', title: 'silence isn\'t peace sticker', price: 5000, qty: 1, total: 5000 }
      ],
      subtotal: 15000,
      discount: 0,
      total: 15000,
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      lifecycleStatus: 'completed',
      paidAt: '2026-10-27T14:35:00Z',
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
      lifecycleStatus: 'paid',
      paidAt: '2026-10-28T08:20:00Z',
      courier: 'SiCepat Regular',
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

  // ================= CRYPTOGRAPHIC SECURITY MODULE =================
  async function computeSha256(text) {
    try {
      if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      console.warn('SubtleCrypto error, falling back:', e);
    }
    // Fallback deterministic hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return 'fb_' + Math.abs(hash);
  }

  // ================= CENTRALIZED CLOUD PERSISTENCE ADAPTER =================
  const CloudSync = {
    status: 'idle', // 'idle' | 'connected' | 'syncing' | 'offline' | 'error'
    lastSyncTime: null,
    pollTimer: null,
    bus: null,
    offlineQueue: [],

    init() {
      // 1. Cross-tab BroadcastChannel for real-time bus
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          this.bus = new BroadcastChannel('afterquiet_commerce_bus');
          this.bus.onmessage = (event) => {
            if (event.data && event.data.type === 'STORE_UPDATED') {
              window.dispatchEvent(new CustomEvent('aq_store_updated', { detail: event.data }));
            }
          };
        }
      } catch (e) {
        console.warn('BroadcastChannel not available:', e);
      }

      // 2. Auto-drain queue when connection restores
      if (typeof window !== 'undefined') {
        window.addEventListener('online', () => {
          this.drainOfflineQueue();
          this.syncAll();
        });
      }

      // 3. Schedule polling loop
      this.schedulePolling();
    },

    broadcastLocalChange(key) {
      if (this.bus) {
        try {
          this.bus.postMessage({ type: 'STORE_UPDATED', key, timestamp: Date.now() });
        } catch (e) {}
      }
    },

    getConfig() {
      const settings = Engine.getSettings();
      return settings.cloudDb || DEFAULT_SETTINGS.cloudDb;
    },

    buildTargetUrl(cfg, key) {
      const cleanUrl = (cfg.endpoint || '').replace(/\/+$/, '');
      if (cfg.provider === 'firebase') {
        return `${cleanUrl}/afterquiet/${key}.json${cfg.authSecret ? `?auth=${encodeURIComponent(cfg.authSecret)}` : ''}`;
      }
      if (cleanUrl.includes('?') || cleanUrl.includes('api/sync')) {
        const sep = cleanUrl.includes('?') ? '&' : '?';
        return `${cleanUrl}${sep}key=${encodeURIComponent(key)}`;
      }
      return `${cleanUrl}/${encodeURIComponent(key)}`;
    },

    queueOfflinePush(key, data) {
      this.offlineQueue = this.offlineQueue.filter(item => item.key !== key);
      this.offlineQueue.push({ key, data, queuedAt: Date.now() });
    },

    async drainOfflineQueue() {
      if (!this.offlineQueue || this.offlineQueue.length === 0) return;
      const pending = [...this.offlineQueue];
      this.offlineQueue = [];
      for (const item of pending) {
        try {
          await this.push(item.key, item.data);
        } catch (e) {
          this.offlineQueue.push(item);
        }
      }
    },

    async testConnection(customConfig = null) {
      const cfg = customConfig || this.getConfig();
      if (!cfg || !cfg.endpoint) {
        return { success: false, message: 'Cloud database endpoint URL is empty.' };
      }
      try {
        const cleanUrl = cfg.endpoint.replace(/\/+$/, '');
        let targetUrl = '';
        if (cfg.provider === 'firebase') {
          targetUrl = `${cleanUrl}/afterquiet/ping.json${cfg.authSecret ? `?auth=${encodeURIComponent(cfg.authSecret)}` : ''}`;
        } else if (cleanUrl.includes('api/sync')) {
          targetUrl = `${cleanUrl}?key=ping`;
        } else {
          targetUrl = `${cleanUrl}/ping`;
        }

        const start = Date.now();
        const res = await fetch(targetUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const latency = Date.now() - start;

        if (res.ok) {
          return { success: true, latency, message: `Connected successfully (${latency}ms latency).` };
        } else {
          return { success: false, message: `Cloud returned HTTP ${res.status}: ${res.statusText}` };
        }
      } catch (err) {
        return { success: false, message: `Network error connecting to cloud: ${err.message}` };
      }
    },

    async push(key, data) {
      this.broadcastLocalChange(key);
      const cfg = this.getConfig();
      if (!cfg || !cfg.enabled || !cfg.endpoint) return;

      try {
        this.status = 'syncing';
        window.dispatchEvent(new CustomEvent('aq_cloud_status', { detail: { status: 'syncing' } }));

        const targetUrl = this.buildTargetUrl(cfg, key);

        const headers = { 'Content-Type': 'application/json' };
        if (typeof sessionStorage !== 'undefined') {
          const token = sessionStorage.getItem('aq_admin_session_token');
          if (token && Engine.isAdminAuthenticated()) {
            headers['x-admin-token'] = token;
          }
        }

        const res = await fetch(targetUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 409 && errData.rejected) {
            console.warn('Order rejected by server due to stock depletion:', errData.error);
            window.dispatchEvent(new CustomEvent('aq_order_rejected', { detail: errData }));
            return { success: false, rejected: true, error: errData.error };
          }
          throw new Error(`Sync failed with HTTP ${res.status}: ${errData.error || res.statusText}`);
        }

        this.status = 'connected';
        this.lastSyncTime = new Date().toISOString();
        window.dispatchEvent(new CustomEvent('aq_cloud_status', { detail: { status: 'connected', lastSync: this.lastSyncTime } }));
        return await res.json().catch(() => ({ success: true }));
      } catch (err) {
        console.warn('Cloud sync push deferred to offline queue:', err.message);
        this.status = 'offline';
        this.queueOfflinePush(key, data);
        window.dispatchEvent(new CustomEvent('aq_cloud_status', { detail: { status: 'offline', error: err.message } }));
        return null;
      }
    },

    async pull(key) {
      const cfg = this.getConfig();
      if (!cfg || !cfg.enabled || !cfg.endpoint) return null;

      try {
        const targetUrl = this.buildTargetUrl(cfg, key);
        const headers = { 'Content-Type': 'application/json' };
        if (typeof sessionStorage !== 'undefined') {
          const token = sessionStorage.getItem('aq_admin_session_token');
          if (token && Engine.isAdminAuthenticated()) {
            headers['x-admin-token'] = token;
          }
        }

        const res = await fetch(targetUrl, { headers });
        if (!res.ok) return null;
        const remoteData = await res.json();
        if (remoteData === null || remoteData === undefined) return null;

        this.mergeCollection(key, remoteData);
        return remoteData;
      } catch (err) {
        console.warn(`Cloud pull failed for ${key}:`, err);
        return null;
      }
    },

    mergeCollection(key, remote) {
      const local = getJson(key, null);
      if (!local) {
        setJson(key, remote);
        window.dispatchEvent(new CustomEvent('aq_store_updated', { detail: { key, source: 'remote' } }));
        return;
      }

      let updated = false;

      if (key === STORAGE_KEYS.ORDERS) {
        const map = new Map();
        local.forEach(o => map.set(o.id, o));
        const remoteList = Array.isArray(remote) ? remote : Object.values(remote);
        remoteList.forEach(ro => {
          if (!ro || !ro.id) return;
          if (!map.has(ro.id)) {
            map.set(ro.id, ro);
            updated = true;
          } else {
            const lo = map.get(ro.id);
            const rTime = new Date(ro.updatedAt || ro.paidAt || ro.createdAt || 0).getTime();
            const lTime = new Date(lo.updatedAt || lo.paidAt || lo.createdAt || 0).getTime();
            if (rTime > lTime) {
              map.set(ro.id, ro);
              updated = true;
            }
          }
        });
        if (updated) {
          const merged = Array.from(map.values()).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
          setJson(key, merged);
        }
      } else if (key === STORAGE_KEYS.PRODUCTS) {
        const map = new Map();
        local.forEach(p => map.set(p.id, p));
        const remoteList = Array.isArray(remote) ? remote : Object.values(remote);
        remoteList.forEach(rp => {
          if (!rp || !rp.id) return;
          if (!map.has(rp.id)) {
            map.set(rp.id, rp);
            updated = true;
          } else {
            const lp = map.get(rp.id);
            const rTime = new Date(rp.updatedAt || rp.createdAt || 0).getTime();
            const lTime = new Date(lp.updatedAt || lp.createdAt || 0).getTime();
            if (rTime > lTime) {
              const activeReserved = Math.max(Number(lp.reserved || 0), Number(rp.reserved || 0));
              map.set(rp.id, { ...rp, reserved: activeReserved });
              updated = true;
            }
          }
        });
        if (updated) {
          setJson(key, Array.from(map.values()));
        }
      } else if (key === STORAGE_KEYS.COLLECTIONS) {
        const map = new Map();
        local.forEach(c => map.set(c.slug || c.id, c));
        const remoteList = Array.isArray(remote) ? remote : Object.values(remote);
        remoteList.forEach(rc => {
          if (!rc || (!rc.slug && !rc.id)) return;
          const k = rc.slug || rc.id;
          if (!map.has(k)) {
            map.set(k, rc);
            updated = true;
          } else {
            const lc = map.get(k);
            const rTime = new Date(rc.updatedAt || 0).getTime();
            const lTime = new Date(lc.updatedAt || 0).getTime();
            if (rTime > lTime) {
              map.set(k, rc);
              updated = true;
            }
          }
        });
        if (updated) {
          setJson(key, Array.from(map.values()));
        }
      } else if (key === STORAGE_KEYS.CATEGORIES) {
        const remoteList = Array.isArray(remote) ? remote : Object.values(remote);
        const set = new Set([...local, ...remoteList.filter(Boolean)]);
        if (set.size !== local.length) {
          setJson(key, Array.from(set));
          updated = true;
        }
      }

      if (updated) {
        window.dispatchEvent(new CustomEvent('aq_store_updated', { detail: { key, source: 'remote' } }));
      }
    },

    async syncAll() {
      const cfg = this.getConfig();
      if (!cfg || !cfg.enabled || !cfg.endpoint) return;

      this.status = 'syncing';
      window.dispatchEvent(new CustomEvent('aq_cloud_status', { detail: { status: 'syncing' } }));
      try {
        await Promise.all([
          this.pull(STORAGE_KEYS.ORDERS),
          this.pull(STORAGE_KEYS.PRODUCTS),
          this.pull(STORAGE_KEYS.COLLECTIONS),
          this.pull(STORAGE_KEYS.CATEGORIES),
          this.pull(STORAGE_KEYS.SETTINGS)
        ]);
        this.status = 'connected';
        this.lastSyncTime = new Date().toISOString();
        window.dispatchEvent(new CustomEvent('aq_cloud_status', { detail: { status: 'connected', lastSync: this.lastSyncTime } }));
      } catch (err) {
        this.status = 'offline';
        window.dispatchEvent(new CustomEvent('aq_cloud_status', { detail: { status: 'offline' } }));
      }
    },

    schedulePolling() {
      if (typeof clearInterval !== 'undefined') clearInterval(this.pollTimer);
      const cfg = this.getConfig();
      const interval = (cfg && cfg.pollIntervalMs) || 20000;
      if (typeof setInterval !== 'undefined') {
        this.pollTimer = setInterval(() => {
          this.drainOfflineQueue();
          this.syncAll();
          Engine.checkExpiredReservations();
        }, interval);
      }
    }
  };

  // ================= DATABASE INITIALIZER =================
  function initDatabase() {
    let settings = getJson(STORAGE_KEYS.SETTINGS, null);
    if (!settings) {
      setJson(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    } else {
      // Migrate plain text PIN to secure salt hash if found
      if (settings.adminPin && !settings.adminPinHash) {
        computeSha256((settings.adminSalt || DEFAULT_SETTINGS.adminSalt) + settings.adminPin).then(hash => {
          settings.adminPinHash = hash;
          delete settings.adminPin;
          setJson(STORAGE_KEYS.SETTINGS, settings);
        });
      }
      if (!settings.cloudDb || !settings.cloudDb.endpoint) {
        settings.cloudDb = DEFAULT_SETTINGS.cloudDb;
        setJson(STORAGE_KEYS.SETTINGS, settings);
      }
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
    if (!localStorage.getItem(STORAGE_KEYS.COLLECTIONS)) {
      setJson(STORAGE_KEYS.COLLECTIONS, DEFAULT_COLLECTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      setJson(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCT_TYPES)) {
      setJson(STORAGE_KEYS.PRODUCT_TYPES, DEFAULT_PRODUCT_TYPES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY_LOGS)) {
      setJson(STORAGE_KEYS.INVENTORY_LOGS, [
        { timestamp: '2026-10-20T08:00:00Z', sku: 'AQ-PIN-01', delta: 45, reason: 'Initial inventory intake' },
        { timestamp: '2026-10-20T08:05:00Z', sku: 'AQ-BDG-01', delta: 60, reason: 'Initial inventory intake' }
      ]);
    }

    // Clean up expired reservations on initialization
    Engine.checkExpiredReservations();
    // Initialize CloudSync
    CloudSync.init();
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
    CloudSync,

    // SETTINGS
    getSettings() {
      return getJson(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    },
    saveSettings(newSettings) {
      const current = this.getSettings();
      const updated = { ...current, ...newSettings, updatedAt: new Date().toISOString() };
      setJson(STORAGE_KEYS.SETTINGS, updated);
      CloudSync.push(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    },

    // PRODUCTS & INVENTORY LIFECYCLE
    getAvailableStock(p) {
      if (!p) return 0;
      const physical = Number(p.stock !== undefined ? p.stock : 50);
      const reserved = Number(p.reserved || 0);
      return Math.max(0, physical - reserved);
    },

    getProducts(includeDrafts = true) {
      const list = getJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      const enriched = list.map(p => ({
        ...p,
        reserved: Number(p.reserved || 0),
        availableStock: this.getAvailableStock(p)
      }));
      if (includeDrafts) return enriched;
      return enriched.filter(p => p.status === 'active');
    },

    getProductById(id) {
      const list = this.getProducts(true);
      return list.find(p => p.id === id || p.handle === id) || null;
    },

    saveProduct(productData) {
      const list = getJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      if (productData.id) {
        const index = list.findIndex(p => p.id === productData.id);
        if (index !== -1) {
          const oldStock = Number(list[index].stock || 0);
          const newStock = Number(productData.stock || 0);
          if (oldStock !== newStock) {
            this.logInventoryAdjustment(productData.sku || productData.id, newStock - oldStock, 'Manual stock update');
          }
          list[index] = {
            ...list[index],
            ...productData,
            reserved: list[index].reserved !== undefined ? list[index].reserved : 0,
            updatedAt: new Date().toISOString()
          };
        } else {
          list.unshift({ ...productData, reserved: 0, createdAt: new Date().toISOString() });
        }
      } else {
        const newId = 'aq_' + Date.now().toString(36);
        const newProduct = {
          ...productData,
          id: newId,
          sku: productData.sku || ('AQ-' + Math.floor(1000 + Math.random() * 9000)),
          reserved: 0,
          createdAt: new Date().toISOString()
        };
        list.unshift(newProduct);
        this.logInventoryAdjustment(newProduct.sku, Number(newProduct.stock || 0), 'Initial intake');
      }
      setJson(STORAGE_KEYS.PRODUCTS, list);
      CloudSync.push(STORAGE_KEYS.PRODUCTS, list);
      return list;
    },

    deleteProduct(id) {
      const list = getJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS).filter(p => p.id !== id);
      setJson(STORAGE_KEYS.PRODUCTS, list);
      CloudSync.push(STORAGE_KEYS.PRODUCTS, list);
      return list;
    },

    adjustStock(idOrSku, delta, reason = 'Adjustment') {
      const list = getJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      const item = list.find(p => p.id === idOrSku || p.sku === idOrSku);
      if (!item) return false;

      const previousStock = Number(item.stock || 0);
      const newStock = Math.max(0, previousStock + Number(delta));
      item.stock = newStock;
      item.updatedAt = new Date().toISOString();
      this.logInventoryAdjustment(item.sku || item.id, delta, reason, previousStock, newStock);
      setJson(STORAGE_KEYS.PRODUCTS, list);
      CloudSync.push(STORAGE_KEYS.PRODUCTS, list);
      return item;
    },

    logInventoryAdjustment(sku, delta, reason, previousStock = null, newStock = null) {
      const logs = getJson(STORAGE_KEYS.INVENTORY_LOGS, []);
      logs.unshift({
        timestamp: new Date().toISOString(),
        sku,
        previousStock: previousStock !== null ? Number(previousStock) : undefined,
        delta: Number(delta),
        newStock: newStock !== null ? Number(newStock) : undefined,
        reason
      });
      if (logs.length > 200) logs.pop();
      setJson(STORAGE_KEYS.INVENTORY_LOGS, logs);
      CloudSync.push(STORAGE_KEYS.INVENTORY_LOGS, logs);
    },

    getInventoryLogs() {
      return getJson(STORAGE_KEYS.INVENTORY_LOGS, []);
    },

    // ================= STRICT ORDER LIFECYCLE & RESERVATION =================
    getOrders() {
      return getJson(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
    },

    getOrderById(id) {
      const list = this.getOrders();
      return list.find(o => o.id === id) || null;
    },

    /**
     * Accurate financial accounting:
     * Only verified paid orders contribute to Total Revenue and AOV.
     */
    calculateFinancials(customOrders = null) {
      const orders = customOrders || this.getOrders();
      const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
      const unpaidOrders = orders.filter(o => o.paymentStatus === 'unpaid');
      const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const pendingRevenue = unpaidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const aov = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;
      return { totalRevenue, pendingRevenue, aov, paidCount: paidOrders.length, unpaidCount: unpaidOrders.length };
    },

    /**
     * Creates an order with strict stock reservation.
     * Physical stock is NOT permanently deducted until payment is confirmed.
     * Instead, items are held in 'reserved' status with a 24-hour expiration.
     */
    createOrder({ customer, items, subtotal, discount = 0, total, notes = '', courier = 'Standard Courier' }) {
      // 1. Validate available stock for each line item
      const products = getJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      for (const item of items) {
        const prod = products.find(p => p.id === item.id);
        const available = prod ? this.getAvailableStock(prod) : 0;
        if (item.qty > available) {
          throw new Error(`Insufficient available stock for ${item.title}. Only ${available} units available.`);
        }
      }

      // 2. Lock reserved stock for each item
      items.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod) {
          prod.reserved = Number(prod.reserved || 0) + Number(item.qty);
          prod.updatedAt = new Date().toISOString();
        }
      });
      setJson(STORAGE_KEYS.PRODUCTS, products);

      // 3. Initialize order with idempotency & offline guard
      const orders = this.getOrders();
      const orderId = 'AQ-' + Math.floor(1000 + Math.random() * 9000);
      const reservationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24-hour hold
      const isOffline = (typeof navigator !== 'undefined' && !navigator.onLine);
      const idempotencyKey = 'idem_' + orderId;

      const newOrder = {
        id: orderId,
        idempotencyKey,
        isOfflinePending: isOffline,
        customer,
        items,
        subtotal,
        discount,
        total,
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'unfulfilled',
        lifecycleStatus: isOffline ? 'offline_pending_confirmation' : 'awaiting_payment',
        reservedExpiresAt: reservationExpiry,
        courier,
        trackingNumber: '',
        notes,
        createdAt: new Date().toISOString()
      };

      this.logInventoryAdjustment('HOLD', 0, `Stock reservation: ${items.map(i => `${i.title} (${i.qty}x)`).join(', ')} held for ${orderId} (${isOffline ? 'offline pending' : 'awaiting payment'})`);

      orders.unshift(newOrder);
      setJson(STORAGE_KEYS.ORDERS, orders);

      // Push to Centralized Cloud: Admin syncs full state, public buyer posts discrete order
      if (this.isAdminAuthenticated()) {
        CloudSync.push(STORAGE_KEYS.ORDERS, orders);
        CloudSync.push(STORAGE_KEYS.PRODUCTS, products);
      } else {
        CloudSync.push(STORAGE_KEYS.ORDERS, { action: 'create_order', order: newOrder, idempotencyKey });
      }

      return newOrder;
    },

    /**
     * Verifies payment receipt from WhatsApp/Bank/QRIS.
     * Permanently decrements physical stock and clears reservation.
     * Only orders confirmed via this method count towards Total Sales and AOV.
     */
    confirmOrderPayment(orderId) {
      const orders = this.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order) return null;
      if (order.paymentStatus === 'paid') return order; // already confirmed

      const products = getJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);

      // Permanently decrement physical stock & release reservation hold
      order.items.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod) {
          prod.stock = Math.max(0, Number(prod.stock || 0) - Number(item.qty));
          prod.reserved = Math.max(0, Number(prod.reserved || 0) - Number(item.qty));
          prod.updatedAt = new Date().toISOString();
          this.logInventoryAdjustment(prod.sku || prod.id, -item.qty, `Payment verified for ${orderId}: permanent stock deduction`);
        }
      });

      order.paymentStatus = 'paid';
      order.lifecycleStatus = 'paid';
      order.paidAt = new Date().toISOString();
      order.updatedAt = new Date().toISOString();

      // Upsert customer verified spend only now
      this.upsertCustomer(order.customer, order.total);

      setJson(STORAGE_KEYS.PRODUCTS, products);
      setJson(STORAGE_KEYS.ORDERS, orders);

      CloudSync.push(STORAGE_KEYS.PRODUCTS, products);
      CloudSync.push(STORAGE_KEYS.ORDERS, orders);

      return order;
    },

    /**
     * Cancels an order.
     * If order was unpaid, releases reserved stock back into available pool.
     * If order was paid, restocks physical units back onto shelf.
     */
    cancelOrder(orderId, reason = 'Cancelled by store operator') {
      const orders = this.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order || order.paymentStatus === 'cancelled' || order.paymentStatus === 'expired') return null;

      const products = getJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);

      if (order.paymentStatus === 'unpaid') {
        // Release reservation hold
        order.items.forEach(item => {
          const prod = products.find(p => p.id === item.id);
          if (prod) {
            prod.reserved = Math.max(0, Number(prod.reserved || 0) - Number(item.qty));
            prod.updatedAt = new Date().toISOString();
            this.logInventoryAdjustment(prod.sku || prod.id, 0, `Unpaid order ${orderId} cancelled: ${item.qty} reserved units released back to catalogue`);
          }
        });
        order.paymentStatus = 'cancelled';
        order.fulfillmentStatus = 'cancelled';
        order.lifecycleStatus = 'cancelled';
      } else if (order.paymentStatus === 'paid') {
        // Restock physical inventory
        order.items.forEach(item => {
          const prod = products.find(p => p.id === item.id);
          if (prod) {
            prod.stock = Number(prod.stock || 0) + Number(item.qty);
            prod.updatedAt = new Date().toISOString();
            this.logInventoryAdjustment(prod.sku || prod.id, item.qty, `Paid order ${orderId} refunded: ${item.qty} units restocked to shelf`);
          }
        });
        order.paymentStatus = 'refunded';
        order.fulfillmentStatus = 'cancelled';
        order.lifecycleStatus = 'refunded';
      }

      order.notes = (order.notes ? order.notes + ' | ' : '') + 'Cancelled: ' + reason;
      order.updatedAt = new Date().toISOString();

      setJson(STORAGE_KEYS.PRODUCTS, products);
      setJson(STORAGE_KEYS.ORDERS, orders);

      CloudSync.push(STORAGE_KEYS.PRODUCTS, products);
      CloudSync.push(STORAGE_KEYS.ORDERS, orders);

      return order;
    },

    updateOrderStatus(orderId, { paymentStatus, fulfillmentStatus, trackingNumber, courier }) {
      if (paymentStatus === 'paid') {
        return this.confirmOrderPayment(orderId);
      }
      if (paymentStatus === 'cancelled') {
        return this.cancelOrder(orderId, 'Operator cancellation');
      }

      const orders = this.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order) return null;

      if (fulfillmentStatus !== undefined) order.fulfillmentStatus = fulfillmentStatus;
      if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
      if (courier !== undefined) order.courier = courier;
      order.updatedAt = new Date().toISOString();

      setJson(STORAGE_KEYS.ORDERS, orders);
      CloudSync.push(STORAGE_KEYS.ORDERS, orders);
      return order;
    },

    /**
     * Checks for unpaid orders that exceeded the 24-hour reservation window.
     * Automatically releases reserved units and marks order as expired.
     */
    checkExpiredReservations() {
      const orders = getJson(STORAGE_KEYS.ORDERS, DEFAULT_ORDERS);
      const now = new Date();
      let expiredCount = 0;
      const products = getJson(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
      let productsModified = false;

      orders.forEach(o => {
        if (o.paymentStatus === 'unpaid' && o.reservedExpiresAt && new Date(o.reservedExpiresAt) < now) {
          o.items.forEach(item => {
            const prod = products.find(p => p.id === item.id);
            if (prod) {
              prod.reserved = Math.max(0, Number(prod.reserved || 0) - Number(item.qty));
              prod.updatedAt = now.toISOString();
              productsModified = true;
            }
          });
          o.paymentStatus = 'expired';
          o.fulfillmentStatus = 'cancelled';
          o.lifecycleStatus = 'expired';
          o.notes = (o.notes ? o.notes + ' | ' : '') + 'Reservation auto-expired after 24h.';
          o.updatedAt = now.toISOString();
          expiredCount++;
        }
      });

      if (expiredCount > 0) {
        if (productsModified) setJson(STORAGE_KEYS.PRODUCTS, products);
        setJson(STORAGE_KEYS.ORDERS, orders);
        this.logInventoryAdjustment('EXPIRE', 0, `${expiredCount} unpaid orders expired: reserved units released`);
        CloudSync.push(STORAGE_KEYS.PRODUCTS, products);
        CloudSync.push(STORAGE_KEYS.ORDERS, orders);
      }

      return expiredCount;
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

    // ================= COLLECTIONS (SHOPIFY-GRADE ARCHITECTURE) =================
    getCollections() {
      return getJson(STORAGE_KEYS.COLLECTIONS, DEFAULT_COLLECTIONS);
    },
    getCollectionById(id) {
      const list = this.getCollections();
      return list.find(c => c.id === id || c.slug === id) || null;
    },
    saveCollection(colData) {
      const list = this.getCollections();
      let baseSlug = (colData.slug || colData.title || 'collection')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-|-$/g, '') || 'collection';
      
      let finalSlug = baseSlug;
      let counter = 1;
      while (list.some(c => c.slug === finalSlug && c.id !== colData.id)) {
        finalSlug = `${baseSlug}-${counter++}`;
      }

      const cleanObj = {
        title: colData.title,
        slug: finalSlug,
        volumeTag: colData.volumeTag || finalSlug,
        description: colData.description || '',
        image: colData.image || '',
        status: colData.status || 'published',
        sortOrder: colData.sortOrder || 'manual'
      };

      if (colData.id) {
        const idx = list.findIndex(c => c.id === colData.id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...cleanObj, id: colData.id, updatedAt: new Date().toISOString() };
        } else {
          list.unshift({ ...cleanObj, id: colData.id, createdAt: new Date().toISOString() });
        }
      } else {
        const newId = 'col_' + Date.now().toString(36);
        list.push({
          ...cleanObj,
          id: newId,
          createdAt: new Date().toISOString()
        });
      }
      setJson(STORAGE_KEYS.COLLECTIONS, list);
      CloudSync.push(STORAGE_KEYS.COLLECTIONS, list);
      return list;
    },
    deleteCollection(id) {
      const list = this.getCollections().filter(c => c.id !== id);
      setJson(STORAGE_KEYS.COLLECTIONS, list);
      CloudSync.push(STORAGE_KEYS.COLLECTIONS, list);
      return list;
    },

    // ================= CATEGORIES MANAGEMENT =================
    getCategories() {
      return getJson(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    },
    saveCategory(catData) {
      const list = this.getCategories();
      if (catData.id) {
        const idx = list.findIndex(c => c.id === catData.id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...catData };
        } else {
          list.push(catData);
        }
      } else {
        const newId = 'cat_' + Date.now().toString(36);
        const slug = catData.slug || (catData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        list.push({ ...catData, id: newId, slug });
      }
      setJson(STORAGE_KEYS.CATEGORIES, list);
      CloudSync.push(STORAGE_KEYS.CATEGORIES, list);
      return list;
    },
    deleteCategory(id) {
      const list = this.getCategories().filter(c => c.id !== id);
      setJson(STORAGE_KEYS.CATEGORIES, list);
      CloudSync.push(STORAGE_KEYS.CATEGORIES, list);
      return list;
    },

    // ================= PRODUCT TYPES & SPECS =================
    getProductTypes() {
      return getJson(STORAGE_KEYS.PRODUCT_TYPES, DEFAULT_PRODUCT_TYPES);
    },
    saveProductType(typeStr) {
      if (!typeStr || !typeStr.trim()) return;
      const clean = typeStr.trim();
      const list = this.getProductTypes();
      if (!list.includes(clean)) {
        list.unshift(clean);
        setJson(STORAGE_KEYS.PRODUCT_TYPES, list);
      }
      return list;
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

      const availableStock = this.getAvailableStock(product);
      if (availableStock <= 0) {
        this.showToast(`Sorry, ${product.title} is currently sold out.`);
        return cart;
      }

      const existing = cart.find(item => item.id === productId);
      if (existing) {
        if (existing.qty + qty > availableStock) {
          existing.qty = availableStock;
          this.showToast(`Maximum available stock reached (${availableStock} units).`);
        } else {
          existing.qty += qty;
        }
      } else {
        const safeQty = Math.min(qty, availableStock);
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price || 5000,
          kind: product.kind || '',
          graphic: product.graphic || product.title,
          image: product.image || '',
          qty: safeQty
        });
      }

      setJson(STORAGE_KEYS.CART, cart);
      this.syncCartBadge();
      this.showToast(`Added ${product.title} to bag`);
      return cart;
    },
    updateCartQty(productId, qty) {
      let cart = this.getCart();
      const product = this.getProductById(productId);
      const availableStock = product ? this.getAvailableStock(product) : 999;

      if (qty <= 0) {
        cart = cart.filter(item => item.id !== productId);
      } else {
        const target = cart.find(item => item.id === productId);
        if (target) {
          target.qty = Math.min(qty, availableStock);
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
    },
    getCartTotals(discountCode = null) {
      const cart = this.getCart();
      const count = cart.reduce((sum, item) => sum + item.qty, 0);
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      let discountDeduction = 0;
      let appliedDiscount = null;

      if (discountCode) {
        const valRes = this.validateDiscount(discountCode, subtotal);
        if (valRes.valid) {
          discountDeduction = valRes.deduction;
          appliedDiscount = valRes.discount;
        }
      }

      const total = Math.max(0, subtotal - discountDeduction);
      return { count, subtotal, discountDeduction, appliedDiscount, total };
    },
    syncCartBadge() {
      const totals = this.getCartTotals();
      const count = totals.count || 0;

      // 1. Update all explicit bag counter spans (e.g. <span id="bagCounter">0</span>)
      document.querySelectorAll('#bagCounter, .bag-counter, .bagCounter, [data-bag-counter]').forEach(el => {
        el.textContent = count;
        el.style.display = 'inline-block';
        el.style.transition = 'transform 0.18s ease';
        el.style.transform = 'scale(1.25)';
        setTimeout(() => {
          el.style.transform = 'scale(1)';
        }, 180);
      });

      // 2. Update any nav cart badge chips
      document.querySelectorAll('#navCartCount, .nav-cart-count, #cartCount, .cart-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline-block' : 'none';
      });

      // 3. Update any cart buttons directly if they contain a span or text like "bag (X)"
      document.querySelectorAll('#openBagBtn, .btn-cart, .open-bag-btn').forEach(btn => {
        const span = btn.querySelector('#bagCounter, .bag-counter, span');
        if (span) {
          span.textContent = count;
        } else if (btn.innerHTML.includes('bag (')) {
          btn.innerHTML = `bag (<span id="bagCounter">${count}</span>)`;
        }
      });

      // 4. Dispatch event for other listeners
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('aq_cart_badge_updated', { detail: { count, totals } }));
      }
    },

    // CSV IMPORT / EXPORT (POLARIS COMPATIBLE)
    exportProductsCSV() {
      const products = this.getProducts(true);
      const headers = ['id', 'sku', 'title', 'category', 'volume', 'price', 'compareAtPrice', 'costPerItem', 'stock', 'reserved', 'kind', 'tag', 'status', 'description', 'seoTitle', 'seoDescription', 'handle', 'image'];
      const rows = products.map(p => [
        p.id,
        p.sku || '',
        `"${(p.title || '').replace(/"/g, '""')}"`,
        p.category || 'accessories',
        p.volume || 'vol. 01',
        p.price || 5000,
        p.compareAtPrice || '',
        p.costPerItem || '',
        p.stock !== undefined ? p.stock : 50,
        p.reserved || 0,
        `"${(p.kind || '').replace(/"/g, '""')}"`,
        p.tag || 'item',
        p.status || 'active',
        `"${(p.description || '').replace(/"/g, '""')}"`,
        `"${(p.seoTitle || '').replace(/"/g, '""')}"`,
        `"${(p.seoDescription || '').replace(/"/g, '""')}"`,
        p.handle || '',
        `"${(p.image || '').replace(/"/g, '""')}"`
      ].join(','));

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const a = document.createElement('a');
      a.setAttribute('href', encodedUri);
      a.setAttribute('download', `afterquiet_products_${new Date().toISOString().slice(0, 10)}.csv`);
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

      // Record formal order into engine with stock reservation
      let formalOrder = null;
      try {
        formalOrder = this.createOrder({
          customer: customerData,
          items: itemsList,
          subtotal: totals.subtotal,
          discount: totals.discountDeduction,
          total: totals.total,
          courier,
          notes: customerData.notes || 'Order placed via storefront'
        });
      } catch (err) {
        alert(err.message);
        return null;
      }

      // Clear shopping bag after successful placement
      this.clearCart();

      // Build WhatsApp pre-filled text
      const cleanWa = (settings.waNumber || '6285708500546').replace(/[^0-9]/g, '');
      let text = `Halo afterquiet,\nSaya ingin melakukan pemesanan resmi:\n\n`;
      text += `*ORDER REF:* ${formalOrder.id}\n`;
      if (formalOrder.isOfflinePending) {
        text += `*STATUS:* Menunggu Konfirmasi Stok (Dibuat Saat Offline)\n`;
        text += `*CATATAN KHUSUS:* Pesanan dibuat saat perangkat offline. Ketersediaan stok akan diverifikasi secara otomatis oleh sistem afterquiet.\n`;
      } else {
        text += `*STATUS:* Menunggu Pembayaran & Konfirmasi Admin\n`;
        text += `*CATATAN KHUSUS:* Nomor order ini merupakan reservasi sementara (berlaku 24 jam). Pesanan akan diproses & dikirim setelah pembayaran diverifikasi oleh Admin afterquiet.\n`;
      }
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
        text += `\n*SUBTOTAL PRODUK:* ${formatRupiah(totals.subtotal)}\n`;
        text += `*DISCOUNT:* -${formatRupiah(totals.discountDeduction)} (${totals.appliedDiscount.code})\n`;
      }
      text += `\n*ESTIMATED TOTAL (EXCL. SHIPPING):* ${formatRupiah(totals.total)}\n`;
      text += `*SHIPPING:* Confirmed via WhatsApp\n\n`;
      text += `Mohon info ongkos kirim dan rincian rekening transfer bank/QRIS untuk menyelesaikan pesanan ini. Terima kasih!`;

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

    // ================= SECURE AUTH & SESSION MANAGEMENT =================
    async verifyAdminPin(enteredPin) {
      const lockoutUntil = Number(sessionStorage.getItem('aq_pin_lockout_until') || 0);
      if (Date.now() < lockoutUntil) {
        const remainingSec = Math.ceil((lockoutUntil - Date.now()) / 1000);
        return { success: false, locked: true, remainingSec, message: `Access temporarily locked. Try again in ${remainingSec}s.` };
      }

      const settings = this.getSettings();
      const salt = settings.adminSalt || DEFAULT_SETTINGS.adminSalt;
      const hashedEntered = await computeSha256(salt + enteredPin);

      if (hashedEntered === (settings.adminPinHash || DEFAULT_SETTINGS.adminPinHash)) {
        sessionStorage.removeItem('aq_pin_fail_count');
        sessionStorage.removeItem('aq_pin_lockout_until');

        const sessionToken = 'aq_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        const timeoutMs = (settings.sessionTimeoutMinutes || 30) * 60 * 1000;
        sessionStorage.setItem('aq_admin_session_token', sessionToken);
        sessionStorage.setItem('aq_admin_session_expires', String(Date.now() + timeoutMs));
        sessionStorage.setItem('aq_admin_auth', '1');

        return { success: true };
      } else {
        let fails = Number(sessionStorage.getItem('aq_pin_fail_count') || 0) + 1;
        sessionStorage.setItem('aq_pin_fail_count', String(fails));

        if (fails >= 5) {
          sessionStorage.setItem('aq_pin_lockout_until', String(Date.now() + 60000)); // 60s lockout
          return { success: false, locked: true, remainingSec: 60, message: 'Too many failed attempts. Locked for 60 seconds.' };
        }
        return { success: false, locked: false, remainingAttempts: 5 - fails, message: `Incorrect PIN. ${5 - fails} attempts remaining.` };
      }
    },

    async changeAdminPin(currentPin, newPin) {
      const verifyRes = await this.verifyAdminPin(currentPin);
      if (!verifyRes.success) {
        return { success: false, message: 'Current PIN is incorrect.' };
      }
      if (!newPin || newPin.length < 4) {
        return { success: false, message: 'New PIN must be at least 4 digits.' };
      }

      const settings = this.getSettings();
      const salt = settings.adminSalt || DEFAULT_SETTINGS.adminSalt;
      const newHash = await computeSha256(salt + newPin);
      this.saveSettings({ adminPinHash: newHash });

      return { success: true, message: 'Admin PIN updated successfully.' };
    },

    isAdminAuthenticated() {
      const auth = sessionStorage.getItem('aq_admin_auth') === '1';
      const expires = Number(sessionStorage.getItem('aq_admin_session_expires') || 0);
      if (auth && expires > Date.now()) {
        return true;
      }
      return false;
    },

    refreshAdminSession() {
      if (this.isAdminAuthenticated()) {
        const settings = this.getSettings();
        const timeoutMs = (settings.sessionTimeoutMinutes || 30) * 60 * 1000;
        sessionStorage.setItem('aq_admin_session_expires', String(Date.now() + timeoutMs));
      }
    },

    lockAdminSession() {
      sessionStorage.removeItem('aq_admin_auth');
      sessionStorage.removeItem('aq_admin_session_token');
      sessionStorage.removeItem('aq_admin_session_expires');
      location.reload();
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
        this.showToast('Order recorded & stock reserved! Redirecting to WhatsApp...');
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
              <div style="width:48px; height:48px; background:#171717; color:#F1EFE9; display:flex; align-items:center; justify-content:center; text-align:center; font-family:'IBM Plex Mono',monospace; font-size:9px; padding:2px; line-height:1.1; border-radius:2px; flex-shrink:0; overflow:hidden;">
                ${item.image ? `<img src="${item.image}" alt="" style="width:100%; height:100%; object-fit:cover;">` : (item.graphic || item.title).slice(0, 16)}
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
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#85827D; margin-bottom:5px;">
              <span>subtotal produk (${totals.count} items)</span>
              <span style="font-family:'IBM Plex Mono',monospace;">${formatRupiah(totals.subtotal)}</span>
            </div>
            ${totals.discountDeduction > 0 ? `
              <div style="display:flex; justify-content:space-between; font-size:12px; color:#843B40; margin-bottom:5px;">
                <span>discount (${totals.appliedDiscount ? totals.appliedDiscount.code : ''})</span>
                <span style="font-family:'IBM Plex Mono',monospace;">-${formatRupiah(totals.discountDeduction)}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#85827D; margin-bottom:10px;">
              <span>shipping</span>
              <span style="font-family:'IBM Plex Mono',monospace; color:#171717;">confirmed via whatsapp</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:13px; font-weight:700; color:#171717; margin-bottom:18px; border-top:1px dashed #C9C6BE; padding-top:8px;">
              <span>estimated total (excl. shipping):</span>
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
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#85827D; margin-bottom:5px;">
              <span>subtotal produk (${totals.count} items)</span>
              <span style="font-family:'IBM Plex Mono',monospace;">${formatRupiah(totals.subtotal)}</span>
            </div>
            ${totals.discountDeduction > 0 ? `
              <div style="display:flex; justify-content:space-between; font-size:12px; color:#843B40; margin-bottom:5px;">
                <span>discount (${totals.appliedDiscount ? totals.appliedDiscount.code : ''})</span>
                <span style="font-family:'IBM Plex Mono',monospace;">-${formatRupiah(totals.discountDeduction)}</span>
              </div>
            ` : ''}
            <div style="display:flex; justify-content:space-between; font-size:12px; color:#85827D; margin-bottom:10px;">
              <span>shipping</span>
              <span style="font-family:'IBM Plex Mono',monospace; color:#171717;">confirmed via whatsapp</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:13px; font-weight:700; color:#171717; margin-bottom:14px; border-top:1px dashed #C9C6BE; padding-top:8px;">
              <span>estimated total (excl. shipping):</span>
              <span style="font-family:'IBM Plex Mono',monospace; font-size:22px; color:#171717;">${formatRupiah(totals.total)}</span>
            </div>
            <button onclick="AfterquietStore.submitStoreCheckout()" style="width:100%; background:#171717; color:#F1EFE9; border:none; padding:16px; font-size:13px; font-weight:700; letter-spacing:0.04em; text-transform:lowercase; border-radius:2px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.15s;">
              <span>place order via whatsapp</span>
              <span>↗</span>
            </button>
            <p style="font-size:11px; color:#85827D; text-align:center; margin-top:10px; font-family:'IBM Plex Mono',monospace;">
              order ref & 24h stock reservation held automatically
            </p>
          </div>
        `;
      }
    },

    mountCartDrawer() {
      if (document.getElementById('aqCartOverlay')) return;
      if (window.location.pathname.includes('admin')) return;

      
      // Inject responsive styling for mobile drawer & form inputs
      if (!document.getElementById('aqCartMobileStyles')) {
        const style = document.createElement('style');
        style.id = 'aqCartMobileStyles';
        style.textContent = `
          @media (max-width: 480px) {
            #aqCartPanel {
              max-width: 100vw !important;
              padding: 20px 16px 28px !important;
            }
            #aqCustName, #aqCustPhone, #aqCustAddress, #aqCustCity, #aqCourierSelect, #aqOrderNotes, #aqDiscountInput {
              font-size: 16px !important; /* Prevents auto-zoom on iOS Safari */
            }
          }
        `;
        document.head.appendChild(style);
      }

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
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        Engine.mountCartDrawer();
        Engine.syncCartBadge();
      });
    } else {
      Engine.mountCartDrawer();
      Engine.syncCartBadge();
    }
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
