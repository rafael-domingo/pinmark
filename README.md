# pinmark

This is a web app that allows you to save places you've been to and create trip itineraries that you can share with friends.

Each place you save is called a 'Pinmark' -- a play on the word 'pin' and 'bookmark'. The intent is to allow you to keep a running list of places you've been to so you can remember where you've been. It also gives you the chance to curate a list of recommendations based on the places you've saved (in the form of 'Trips') that you can send to your friends.

Each Pinmark gives basic metadata and links to Google Maps if you need directions. The search functionality and location metadata utilizes the Google Maps Places API.

Authentication and user data is handled using the Firebase Authenticaion and Firebase Firestore API.

# Project Status

This project is currently in alpha with the bare minimum features shipped and limited testing performed. This project was intended to serve as a platform to learn React, Bootstrap, Express.js, Firebase/Firestore, and Google Maps APIs.

Please submit an issue if you encounter any problems while using the application. Pull requests are welcomed but reviews will happen as time allows.

Bug fixes and new features will ship as time allows.

# Screenshots

<p float="left">
<img src="/pinmark-app/src/assets/SignIn.png" width="200" height="400"/>
<img src="/pinmark-app/src/assets/UserHome.png" width="200" height="400"/>
<img src="/pinmark-app/src/assets/PinmarkDetail.png" width="200" height="400"/>
<img src="/pinmark-app/src/assets/Location.png" width="200" height="400"/>
</p>

# Installation and Setup Instructions

## Installation:

`npm install`

## To start server:

`node server.js`

## To start app:

`cd pinmark-app`
<br>
`npm start`

# Tech Stack

## Front-end

- [React](https://create-react-app.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/en/main)
- [Lottie Files](https://lottiefiles.com/)
- [MD Bootstrap](https://mdbootstrap.com/docs/react/)

## Back-end

- [Express.js](https://expressjs.com/)
- [Firebase/Firestore](https://firebase.google.com/)

## Hosting

- [Heroku](https://dashboard.heroku.com/)

# Personal Comments

This was a personal project that filled a personal need to keep track of places I've been to. Before this, I used to keep track of all of my locations in my Notes app which made it cumbersome to maintain and update. I thought this was a good project to practice React concepts and reading through documentation of external APIs.

## Things I'm proud of

- The general look and feel of the app is playful yet functional.
- The intended functionality of the app was achieved; the app is stable enough for me to use for my personal use.
- The 'Sharing Trip' function was my first attempt at a social function in a web app and it performed as intended during testing.

## Things that could be improved

- The current authentication workflow utilizes the `signInWithPopup` Firebase function which runs into quirks on mobile devices because it requires the user to enable pop-ups. I would rather use the `signInWithRedirect` function if I had more time since this doesn't require a pop-up. However, because of the redirect, any authentication errors need to be handled using session cache (since the React App resets upon redirect), which I decided to forego in order to ship an MVP.
- The dropdown to add a Pinmark to a trip needs a better UI in the event the user has a long list of trips at a particular location.
- The general structure of the React App is very clunky; components and supporting functions were created on-the-go rather than planned in advance.
- When searching for Pinmarks from a city's page, the Search function should localize to that city; currently the user needs to type the city name in the Search component to localize the results.
- The use of state and props likely doesn't adhere to best practices; ditto for the naming conventions for state variables.
- The way the 'Sharing Trip' functionality works currently exposes all trips shared on the platform from all users; if I had more time, I would refactor the component to only expose trips that involve the authenticated user.
- I used a package `react-div-100vh` to get around the '100vh' issue on mobile browsers; I would've like to fix this issue with better CSS styling.
