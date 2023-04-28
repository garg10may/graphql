var { graphql, buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
// test
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  }
};

graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
} );

// { data: { hello: 'Hello world!' } }
