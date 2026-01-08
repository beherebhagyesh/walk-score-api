export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const lat = query.lat || '28.36722';
    const lon = query.lon || '-81.28028';
    const address = query.address || 'Lake Nona South, Orlando, FL';

    const apiKey = config.walkscoreApiKey;

    // Debug: Log if API key is present (don't log the actual key for security)
    console.log('[WalkScore API] Key present:', !!apiKey, 'Key length:', apiKey?.length || 0);

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.error('[WalkScore API] No valid API key configured');
        return {
            status: 1,
            walkscore: 45,
            description: 'Car-Dependent',
            bike: { score: 52, description: 'Bikeable' },
            transit: { score: 28, description: 'Minimal Transit' },
            updated: new Date().toISOString().split('T')[0],
            ws_link: 'https://www.walkscore.com/score/lake-nona-south-orlando-fl',
            _demo: true,
            _message: 'Demo data - Add NUXT_WALKSCORE_API_KEY to .env.local for live data'
        };
    }

    try {
        const url = `https://api.walkscore.com/score?format=json&address=${encodeURIComponent(address)}&lat=${lat}&lon=${lon}&transit=1&bike=1&wsapikey=${apiKey}`;

        console.log('[WalkScore API] Fetching from Walk Score API...');

        const response = await $fetch(url);

        console.log('[WalkScore API] Response status:', response.status);

        // Check for API errors
        if (response.status === 40) {
            console.error('[WalkScore API] Invalid API key');
            return {
                status: 1,
                walkscore: 45,
                description: 'Car-Dependent',
                bike: { score: 52, description: 'Bikeable' },
                transit: { score: 28, description: 'Minimal Transit' },
                updated: new Date().toISOString().split('T')[0],
                ws_link: 'https://www.walkscore.com/score/lake-nona-south-orlando-fl',
                _demo: true,
                _error: 'Invalid API key - check your NUXT_WALKSCORE_API_KEY'
            };
        }

        return response;
    } catch (error) {
        console.error('[WalkScore API] Error:', error);
        // Return demo data on error
        return {
            status: 1,
            walkscore: 45,
            description: 'Car-Dependent',
            bike: { score: 52, description: 'Bikeable' },
            transit: { score: 28, description: 'Minimal Transit' },
            updated: new Date().toISOString().split('T')[0],
            ws_link: 'https://www.walkscore.com/score/lake-nona-south-orlando-fl',
            _demo: true,
            _error: 'API connection failed'
        };
    }
});
