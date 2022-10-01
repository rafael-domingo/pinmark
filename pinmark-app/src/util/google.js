import fetch from 'node-fetch';

export const Google = {
    autoComplete(searchTerm, sessionToken) {        
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
    },

    placeDetails(placeId, sessionToken) {
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
    },

    placeSearch(searchTerm, location) {
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
    }
}