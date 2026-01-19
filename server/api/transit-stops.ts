export default defineCachedEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const lat = query.lat || '28.36722';
    const lon = query.lon || '-81.28028';

    const apiKey = config.walkscoreApiKey;

    // ONLY fallback to demo if the API key is completely missing
    if (!apiKey) {
        return {
            stops: getDemoStops(),
            _demo: true
        };
    }

    try {
        const url = `https://transit.walkscore.com/transit/search/stops/?lat=${lat}&lon=${lon}&wsapikey=${apiKey}`;
        const response = await $fetch(url);
        const stops = parseTransitStops(response, parseFloat(lat as string), parseFloat(lon as string));

        // If API key is present but no stops found, return empty array (NOT demo data)
        return {
            stops,
            _count: stops.length
        };
    } catch (error) {
        // Safe empty return on error if key is present
        return {
            stops: [],
            _error: 'Failed to fetch'
        };
    }
}, {
    maxAge: 3600, // 1 hour cache
    name: 'transit-stops',
    getKey: (event) => {
        const query = getQuery(event);
        return `${query.lat}-${query.lon}`;
    }
});

// Parse Walk Score transit API response
function parseTransitStops(response: any, originLat: number, originLon: number) {
    const stops: any[] = [];

    if (Array.isArray(response)) {
        response.forEach((stop: any) => {
            const stopLat = stop.lat;
            const stopLon = stop.lon;
            const distance = calculateDistance(originLat, originLon, stopLat, stopLon);

            let routeName = 'Transit Stop';

            if (typeof stop.name === 'string') {
                routeName = stop.name;
            }
            else if (Array.isArray(stop.name) && stop.name.length > 0) {
                const route = stop.name[0];
                routeName = route.long_name || route.short_name || route.name || 'Bus Route';
            }
            else if (stop.route_summary) {
                routeName = stop.route_summary;
            }

            stops.push({
                name: routeName,
                distance: distance.toFixed(2),
                lat: stopLat,
                lon: stopLon
            });
        });
    }

    return stops
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        .slice(0, 6);
}

// Calculate distance between two coordinates in miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Demo data for when API is unavailable
function getDemoStops() {
    return [
        { name: 'HSC Health Sciences Campus', distance: '0.00' },
        { name: '612 NARCOOSSEE RD', distance: '0.21' },
        { name: '418 FLORIDA MALL/MEADOW WOODS', distance: '0.22' },
        { name: '407 KISSIMMEE/MEDICAL CITY', distance: '0.23' },
        { name: 'LAKE NONA TOWN CENTER', distance: '0.31' },
        { name: 'LAUREATE PARK', distance: '0.42' }
    ];
}
