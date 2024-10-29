const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the router for handling routes
app.use('/', indexRouter);

// Endpoint to receive a URL and consume it
app.post('/consume-url', async (req, res) => {
  const { url } = req.body;
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).send('Error consuming the URL');
  }
});

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
