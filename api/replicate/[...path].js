export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
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

    const { REPLICATE_API_TOKEN } = process.env;

    if (!REPLICATE_API_TOKEN) {
        console.error('REPLICATE_API_TOKEN is not set');
        res.status(500).json({ error: 'Server misconfiguration: API Token missing' });
        return;
    }

    // Vercel catch-all route: /api/replicate/[...path]
    // The query parameter 'path' will hold the segments: ['predictions'] or ['predictions', '123']
    const { path } = req.query;
    const pathStr = Array.isArray(path) ? path.join('/') : path;

    if (!pathStr) {
        res.status(400).json({ error: 'Invalid API path: No endpoint specified' });
        return;
    }

    const targetUrl = `https://api.replicate.com/v1/${pathStr}`;

    try {
        const options = {
            method: req.method,
            headers: {
                'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
                'Prefer': 'wait',
                // Forward user agent potentially or custom app id
                'User-Agent': '3dokas.live-Vercel-Proxy/1.0'
            },
        };

        if (req.method === 'POST' && req.body) {
            options.body = JSON.stringify(req.body);
        }

        const response = await fetch(targetUrl, options);

        // Forward the status code and response
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Replicate API Error (${response.status}):`, errorText);
            res.status(response.status).json({ error: errorText, details: 'Proxy upstream error' });
            return;
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error("Proxy Internal Error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
