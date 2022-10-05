require('dotenv').config();
const { Client } = require("@googlemaps/google-maps-services-js");
const express = require('express');
const router = express.Router();
const api_key = process.env.GOOGLE_MAPS_API_KEY;
const client = new Client({});

router.post('/autocomplete', async (req, res) => {
    console.log('hello')
    console.log(req.body)
    const searchTerm = req.body.searchTerm;
    const sessionToken = req.body.sessionToken;
    client.placeAutocomplete({
        params: {
            input: searchTerm,
            key: api_key,
            sessiontoken: sessionToken,
            types: '(cities)'
        }
    }).then(response => {        
        
        res.json(response.data);
    }).catch(e => {
        console.log(e);
    })
})

router.post('/placeDetails', async (req, res) => {
    const placeId = req.body.placeId;
    const sessionToken = req.body.sessionToken;
    client.placeDetails({
        params: {
            place_id: placeId,
            key: api_key,
            sessiontoken: sessionToken
        }
    }).then(response => {
        res.json(response.data);
    }).catch(e => {
        console.log(e);
    })
})

router.post('/placeSearch', async (req, res) => {
    const searchTerm = req.body.searchTerm;
    // const location = req.body.location;
    client.findPlaceFromText({
        params: {
            input: searchTerm,
            inputtype: 'textquery',
            key: api_key,
            fields: 'name,icon,photo,place_id,formatted_address,business_status,icon',
            // locationbias: `circle:1000@${location.lat},${location.lng}`
        }
    }).then(response => {
        res.json(response.data);
    }).catch(e => {
        console.log(e);
    })
})

router.post('/placePhotos', async(req, res) => {
    const photoId = req.body.photoId;
    client.placePhoto({
        params: {
            photoreference: photoId,
            key: api_key,
            maxwidth: 500 // required to specify either maxwidth or maxheight for API request to go through
            
        }
    }).then(response => {
       res.json(response.data.toString('base64')) // photo response is a buffer, need to convert to base64 to use in React App
    }).catch(e => {
        console.log(e);
    })
})

module.exports = router;




