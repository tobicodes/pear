import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';

const app = express();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// Use body-parser middleware to parse JSON payloads
app.use(bodyParser.json());

nextApp.prepare().then(() => {
  // Message Sending
  app.get("/custom-route", (req, res) => {
    res.send("Custom Route!!")
  })

  // Handle API routes
  app.all("/api/*", (req, res) => {
    return nextHandler(req, res);
  });
	
  app.get("*", nextHandler)
  app.post('*', nextHandler)

  app.listen(port, err => {
    if (err) throw err
    console.log(`Listening on port ${port}`)
  })
})
