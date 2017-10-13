var { buildSchema } = require('graphql');;

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = {
  hello: () => {
    return 'Hello world!';
  },
};

module.exports = {
    schema: schema,
    root: root
};