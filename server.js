const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express()
var cors = require('cors')
app.use(cors())

// Logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serves static assets
app.use(express.static(path.join(__dirname, 'build')));

// Serves REST API
const apiRouter = require('./src/apiRoutes');
app.use('/api', apiRouter);

// Serves React's build
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});