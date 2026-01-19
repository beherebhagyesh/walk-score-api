export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const lat = query.lat || '28.36722';
    const lon = query.lon || '-81.28028';
    const address = query.address || 'Lake Nona South, Orlando, FL';

    const apiKey = config.walkscoreApiKey;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return {
            status: 1,
            walkscore: 45,
            description: 'Car-Dependent',
            bike: { score: 52, description: 'Bikeable' },
            transit: { score: 28, description: 'Minimal Transit' },
            updated: new Date().toISOString().split('T')[0],
            ws_link: 'https://www.walkscore.com/score/lake-nona-south-orlando-fl',
            _demo: true
        };
    }

    try {
        const url = `https://api.walkscore.com/score?format=json&address=${encodeURIComponent(address as string)}&lat=${lat}&lon=${lon}&transit=1&bike=1&wsapikey=${apiKey}`;
        const response = await $fetch(url);

        if (response.status === 40) {
            return {
                status: 1,
                walkscore: 45,
                description: 'Car-Dependent',
                bike: { score: 52, description: 'Bikeable' },
                transit: { score: 28, description: 'Minimal Transit' },
                updated: new Date().toISOString().split('T')[0],
                ws_link: 'https://www.walkscore.com/score/lake-nona-south-orlando-fl',
                _demo: true,
                _error: 'Invalid API key'
            };
        }

        return response;
    } catch (error) {
        return {
            status: 1,
            walkscore: 45,
            description: 'Car-Dependent',
            bike: { score: 52, description: 'Bikeable' },
            transit: { score: 28, description: 'Minimal Transit' },
            updated: new Date().toISOString().split('T')[0],
            ws_link: 'https://www.walkscore.com/score/lake-nona-south-orlando-fl',
            _demo: true
        };
    }
}, {
    maxAge: 3600, // 1 hour cache
    name: 'walkscore',
    getKey: (event) => {
        const query = getQuery(event);
        return `${query.lat}-${query.lon}-${query.address}`;
    }
});
