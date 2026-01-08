export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    const lat = query.lat || '28.36722';
    const lon = query.lon || '-81.28028';

    const apiKey = config.walkscoreApiKey;

    if (!apiKey) {
        console.error('[Transit API] No API key configured');
        return {
            stops: getDemoStops(),
            _demo: true
        };
    }

    try {
        // Fetch nearby transit stops using Walk Score Transit API
        const url = `https://transit.walkscore.com/transit/search/stops/?lat=${lat}&lon=${lon}&wsapikey=${apiKey}`;

        console.log('[Transit API] Fetching transit stops...');

        const response = await $fetch(url);

        console.log('[Transit API] Response received, parsing...');

        // Parse the response into a consistent format
        const stops = parseTransitStops(response, parseFloat(lat as string), parseFloat(lon as string));

        if (stops.length === 0) {
            return {
                stops: getDemoStops(),
                _demo: true,
                _message: 'No stops found, showing demo data'
            };
        }

        return { stops };
    } catch (error) {
        console.error('[Transit API] Error:', error);
        return {
            stops: getDemoStops(),
            _demo: true
        };
    }
});

// Parse Walk Score transit API response
function parseTransitStops(response: any, originLat: number, originLon: number) {
    const stops: any[] = [];

    // The API returns an array of stops
    if (Array.isArray(response)) {
        response.forEach((stop: any) => {
            // The stop has lat/lon and routes info
            const stopLat = stop.lat;
            const stopLon = stop.lon;
            const distance = calculateDistance(originLat, originLon, stopLat, stopLon);

            // Extract route name - could be in different formats
            let routeName = 'Transit Stop';

            // If name is a string
            if (typeof stop.name === 'string') {
                routeName = stop.name;
            }
            // If name is an array of route objects
            else if (Array.isArray(stop.name) && stop.name.length > 0) {
                const route = stop.name[0];
                routeName = route.long_name || route.short_name || route.name || 'Bus Route';
            }
            // Try route_summary
            else if (stop.route_summary) {
                routeName = stop.route_summary;
            }

            stops.push({
                name: routeName,
                distance: distance.toFixed(1),
                lat: stopLat,
                lon: stopLon
            });
        });
    }

    // Sort by distance and take top 6
    return stops
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        .slice(0, 6);
}

// Calculate distance between two coordinates in miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
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
        { name: 'HSC Health Sciences Campus', distance: '0.0' },
        { name: '612 NARCOOSSEE RD', distance: '0.2' },
        { name: '418 FLORIDA MALL/MEADOW WOODS', distance: '0.2' },
        { name: '407 KISSIMMEE/MEDICAL CITY', distance: '0.2' },
        { name: 'LAKE NONA TOWN CENTER', distance: '0.3' },
        { name: 'LAUREATE PARK', distance: '0.4' }
    ];
}
