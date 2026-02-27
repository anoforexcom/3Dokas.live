export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { REPLICATE_API_TOKEN } = process.env;
    if (!REPLICATE_API_TOKEN) {
        res.status(500).json({ error: 'Server Config Error: REPLICATE_API_TOKEN is missing' });
        return;
    }

    try {
        let url = '';
        let options = {
            headers: {
                'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': '3dokas.live-Proxy'
            }
        };

        if (req.method === 'POST') {
            // Create Prediction
            options.method = 'POST';

            let body = req.body;

            // Dynamic Version Resolution
            if (body.model && !body.version) {
                console.log(`Resolving latest version for model: ${body.model}`);
                const versionUrl = `https://api.replicate.com/v1/models/${body.model}/versions`;
                const versionRes = await fetch(versionUrl, {
                    headers: options.headers
                });

                if (!versionRes.ok) {
                    const errorText = await versionRes.text();
                    res.status(versionRes.status).json({ error: `Failed to resolve model version: ${errorText}` });
                    return;
                }

                const versions = await versionRes.json();
                if (versions.results && versions.results.length > 0) {
                    body.version = versions.results[0].id;
                    console.log(`Resolved ${body.model} to version: ${body.version}`);
                } else {
                    res.status(404).json({ error: `No versions found for model ${body.model}` });
                    return;
                }
            }

            if (body.model) {
                delete body.model;
            }

            url = 'https://api.replicate.com/v1/predictions';
            options.body = JSON.stringify(body);
        } else if (req.method === 'GET') {
            // Check Status
            const { id } = req.query;
            if (!id) {
                res.status(400).json({ error: 'Missing prediction ID' });
                return;
            }
            url = `https://api.replicate.com/v1/predictions/${id}`;
            options.method = 'GET';
        } else {
            res.status(405).json({ error: 'Method not allowed' });
            return;
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).json({ error: errorText, details: 'Upstream Error' });
            return;
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error("API Proxy Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
