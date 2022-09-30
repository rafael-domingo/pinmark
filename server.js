const express = require('express');
const port = process.env.PORT || 5000;
const path = require('path');
const app = express();

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'pinmark-app/build')));

app.get('/ping', function (req, res) {
    return res.send('pong');
});

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
  })

app.listen(port, () => console.log(`Server started on ${port}`));
