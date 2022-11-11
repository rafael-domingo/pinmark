import fetch from 'node-fetch';

export const google = {
    autoComplete(searchTerm, sessionToken) {       
        try {
            return fetch('/GoogleMaps/autocomplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchTerm: searchTerm,
                    sessionToken: sessionToken
                })
            }).then(response => response.json()).then(data => data)
        } catch(e) {
            console.log(e)
            return;
        }
        
    },

    placeDetails(placeId, sessionToken) {
        try {
            return fetch('/GoogleMaps/placeDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    placeId: placeId,
                    sessionToken: sessionToken
                })
            }).then(response => response.json()).then(data => data)
        } catch(e) {
            console.log(e)
            return;
        }
       
    },

    placeSearch(searchTerm, location) {
        try {
            return fetch('/GoogleMaps/placeSearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchTerm: searchTerm,
                    location: location
                })
            }).then(response => response.json()).then(data => data)
        } catch(e) {
            console.log(e)
            return;
        }

        
    },

    placePhotos(photoId) {
        try {
            return fetch('/GoogleMaps/placePhotos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    photoId: photoId
                })
            }).then(response => response.json()).then(data => data)
        } catch(e) {
            console.log(e)
            return
        }
       
    }
}