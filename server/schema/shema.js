const graphql = require("graphql");
const _ = require("lodash");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;
// dummy data
var books = [
  { name: "book 1", genre: "genre 1", id: "1", authorId: "1" },
  { name: "book 1.1", genre: "genre 1", id: "2", authorId: "1" },
  { name: "book 1.2", genre: "genre 1", id: "3", authorId: "1" },
  { name: "book 1.3", genre: "genre 1", id: "4", authorId: "1" },
  { name: "book 2", genre: "genre 2", id: "2", authorId: "2" },
  { name: "book 3", genre: "genre 3", id: "3", authorId: "3" },
];
var authors = [
  { name: "author 1", age: "30", id: "1" },
  { name: "author 2", age: "40", id: "2" },
  { name: "author 3", age: "50", id: "3" },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, {
          authorId: parent.id,
        });
      },
    },
  }),
});

const RootQuerry = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        args.id;
        // code to get data from db / other source
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuerry,
});
