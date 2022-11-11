const express = require('express');
const port = process.env.PORT || 8080;
const cors = require('cors');
const path = require('path');
const app = express();
const googleMaps = require('./GoogleMaps');

app.use(cors());
app.use(express.json()); // allows for incoming requests with JSON payloads -- based on body-parser

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'pinmark-app/build')));

app.use('/GoogleMaps', googleMaps);

// Anything that doesn't match the above, send back index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + '/pinmark-app/build/index.html'))
  })

app.listen(port, () => console.log(`Server started on ${port}`));
