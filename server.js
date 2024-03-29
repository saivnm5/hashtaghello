const express = require('express');
//const morgan = require('morgan');
const path = require('path');
const app = express();
const graphqlHTTP = require('express-graphql');
const API = require('./src/app/api');
const AuthAPI = require('./src/actor/auth');
const PublicAPI = require('./src/app/publicApi');
const { metaMiddleware } = require('./middleware');
const config = require('./src/config');

var cors = require('cors');
app.use(cors())

// Logger
//app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serves static assets
app.use(express.static(path.join(__dirname, 'build')));

// Serves GraphQL API
app.use(AuthAPI.authMiddleware);
app.use(metaMiddleware);
app.use('/auth', graphqlHTTP({
  schema: AuthAPI.schema,
  rootValue: AuthAPI.root,
  graphiql: true,
}));
app.use('/get', graphqlHTTP({
  schema: PublicAPI.schema,
  rootValue: PublicAPI.root,
  graphiql: config.DEBUG,
}));
app.use('/api', graphqlHTTP({
  schema: API.schema,
  rootValue: API.root,
  graphiql: config,
}));

// Serves React's build
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});