/**
 * afterquiet — Serverless Cloud Relay & Sync API
 * Deployed automatically on Vercel as /api/sync
 * Provides multi-device persistence relay for Orders, Inventory, and Products
 */

let memoryStore = {
  orders: null,
  products: null,
  settings: null,
  lastUpdated: new Date().toISOString()
};

export default async function handler(req, res) {
  // Enable CORS for cross-origin storefront / admin requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { key } = req.query;

  // Health / Ping check
  if (key === 'ping') {
    return res.status(200).json({ status: 'ok', time: Date.now(), relay: 'afterquiet_edge_v1' });
  }

  try {
    // If Upstash / KV environment variables are present, forward to KV
    const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (req.method === 'GET') {
      if (kvUrl && kvToken && key) {
        const fetchRes = await fetch(`${kvUrl}/get/aq_${key}`, {
          headers: { Authorization: `Bearer ${kvToken}` }
        });
        const data = await fetchRes.json();
        const parsed = data.result ? JSON.parse(data.result) : null;
        return res.status(200).json(parsed);
      }

      if (key && memoryStore[key]) {
        return res.status(200).json(memoryStore[key]);
      }
      return res.status(200).json(memoryStore);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (kvUrl && kvToken && key) {
        await fetch(`${kvUrl}/set/aq_${key}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(JSON.stringify(payload))
        });
        return res.status(200).json({ success: true, stored: 'kv', timestamp: Date.now() });
      }

      if (key) {
        memoryStore[key] = payload;
      } else if (payload && typeof payload === 'object') {
        memoryStore = { ...memoryStore, ...payload };
      }
      memoryStore.lastUpdated = new Date().toISOString();

      return res.status(200).json({ success: true, stored: 'memory', timestamp: Date.now() });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Relay error:', error);
    return res.status(500).json({ error: error.message });
  }
}
