import axios from "axios";

export default function SearchRoutes(app) {
    //Get lat/lng from zip code using Nominatim
    async function getCoordinates(zip) {
        try {
            const url = "https://nominatim.openstreetmap.org/search";
            const response = await axios.get(url, {
                params: {
                q: `${zip}, USA`,
                format: "json",
                limit: 1
            },
                headers: {
                    "User-Agent": "ChalkTalkk/1.0"
                }
            });
            const data = response.data[0];
            if (!data) {
                // Couldn't get coordinates for inputed zip, return empty for no results
                console.error("No data found for ZIP:", zip);
                return [];
            }
            return { lat: data.lat, lon: data.lon };
        } catch (err) {
            console.error("Error in getCoordinates:", err.message);
            throw err;
        }
    }

    //Use Overpass API to get nearby climbing gyms from the previously found coordinates
    async function getNearbyClimbingGyms(lat, lon, num) {
        try {
            const response = await axios.get(`https://overpass-api.de/api/interpreter?data=[out:json];node[sport=climbing](around:10000,${lat},${lon});out skel qt ${num};`);

            //Get nodes of all gyms found
            const nodes = response.data.elements;
            const gyms = await Promise.all(nodes.map(async (node) => {
                //Go through each gym to extract info
                const gymResponse = await axios.get(`https://overpass-api.de/api/interpreter?data=[out:json];node(${node.id});out tags;`);
                const gymData = gymResponse.data.elements[0];

                const address = {
                    number: gymData.tags['addr:housenumber'] || '',
                    street: gymData.tags['addr:street'] || '',
                    city: gymData.tags['addr:city'] || '',
                    postcode: gymData.tags['addr:postcode'] || ''
                };
                return {
                    id: node.id,
                    lat: node.lat,
                    lon: node.lon,
                    name: gymData.tags.name,
                    sport: gymData.tags.sport,
                    address: address,
                    website: gymData.tags.website || 'No website available'
                };
            }));
            return gyms;
        } catch (err) {
            console.error("Error in Overpass API call:", err.message);
            throw err;
        }
    }

    // Get nearby climbing gyms
    app.get('/api/search/:zip/:num', async (req, res) => {
        const zip = req.params.zip;
        const num = req.params.num;

        try {
            //Get coords
            const { lat, lon } = await getCoordinates(zip);

            //Plug coords into Overpass
            const gyms = await getNearbyClimbingGyms(lat, lon, num);
            res.json(gyms);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get climbing gyms' });
        }
    });
}