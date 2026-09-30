require('dotenv').config();

const { connectDb } = require('./config/db');
const app = require('./app');

const port = process.env.PORT || 5000;

function startServer() {
  connectDb()
    .then(() => {
    app.listen(port, () => {
      console.log(`MarketSignal API running on port ${port}`);
    });
  })
  .catch(() => {
      console.error('MongoDB unavailable. Retrying connection in 5 seconds.');
      setTimeout(startServer, 5000);
    });
}

startServer();