const express = require('express');
const expressGraphQL = require('express-graphql');
const { GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull } = require('graphql');
const app = express();

books= [
  { id: 1, name: 'The Fellowship of the Ring' , authorId: 4 },
  { id: 2, name: 'The Two Towers' , authorId: 4 },
  { id: 3, name: 'The Return of the King' , authorId: 4 },
  { id: 4, name: 'Harry Potter and the Sorcerer\'s Stone' , authorId: 1 },
  { id: 5, name: 'Harry Potter and the Chamber of Secrets' , authorId: 1 },
  { id: 6, name: 'Harry Potter and the Prisoner of Azkaban' , authorId: 1 },
  { id: 7, name: 'Harry Potter and the Goblet of Fire' , authorId: 1 },
  { id: 8, name: 'Harry Potter and the Order of the Phoenix' , authorId: 1 },
  { id: 9, name: 'Harry Potter and the Half-Blood Prince' , authorId: 1 },
  { id: 10, name: 'Harry Potter and the Deathly Hallows' , authorId: 1 },
  { id: 11, name: 'The Hobbit' , authorId: 2 },
  { id: 12, name: 'The Fellowship of the Ring' , authorId: 2 },
  { id: 13, name: 'The Two Towers' , authorId: 2 },
  { id: 14, name: 'The Return of the King' , authorId: 2 },
  { id: 15, name: 'The Hobbit' , authorId: 3 },
  { id: 16, name: 'The Fellowship of the Ring' , authorId: 3 },
  { id: 17, name: 'The Two Towers' , authorId: 3 },
  { id: 18, name: 'The Return of the King' , authorId: 3 }
];

authors = [
  { id: 1, name: 'J.K. Rowling' },
  { id: 2, name: 'J.R.R. Tolkien' },
  { id: 3, name: 'Tolkien' },
  { id: 4, name: 'J.R.R.' }
];

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an author of a book',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books : {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id);
      } 
    }
  })
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author : {
      type: AuthorType,
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a book',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId };
        books.push(book);
        return book;
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add an author',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name };
        authors.push(author);
        return author;
      }
    }
  })
});


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books
    },
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors
    }
  })
});


// const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'HelloWorld',
//     fields: () => ({
//       message: {
//         type: GraphQLString,
//         resolve: () => 'Hello World'
//       }
//     })
//   })
// });

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});


app.use('/graphql', expressGraphQL.graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Listening');
});