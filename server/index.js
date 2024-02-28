const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const routes = require('./routes/index');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({credentials: true, origin: "http://localhost:3001"}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
