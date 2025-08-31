const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('dotenv').config({ path: '../.env' });

const createRouter = require('./routes/router');
const generateApi = require("./database/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ride-request-app', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));


init();

async function init()
{
  const api = await generateApi();

  const router = createRouter(api);
  app.use(`/api`, router);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
  });

// Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}