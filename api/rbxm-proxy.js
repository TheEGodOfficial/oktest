const { URL } = require('url');
const axios = require('axios');

export default async (req, res) => {
  try {
    // Validate URL
    const assetUrl = req.query.url;
    if (!assetUrl) return res.status(400).json({ error: 'Missing Roblox URL' });
    
    // Verify Roblox domain
    const parsedUrl = new URL(assetUrl);
    if (!parsedUrl.hostname.includes('roblox.com')) {
      return res.status(400).json({ error: 'Invalid Roblox asset URL' });
    }

    // Set file headers
    const filename = req.query.filename || 'model.rbxm';
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // For Discord webhooks, we always proxy the file
    const response = await axios.get(assetUrl, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Roblox-Discord-Proxy/1.0' }
    });
    
    res.setHeader('Content-Type', 'application/octet-stream');
    return res.send(response.data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to process asset' });
  }
};
