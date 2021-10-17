import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    login(email: String!, password: String!): UserResult!
  },
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    balance: Float!
  },
  type AuthData {
    userId: ID!
    name: String!
    balance: Float!
    token: String!
    tokenExpiration: Int!
  },
  type InvalidCredentials {
    message: String!
  },
  union UserResult = AuthData | InvalidCredentials,
  input userInput {
    name: String!
    email: String!
    password: String!
  },
  type Mutation {
    createUser(input: userInput!): User
    deposit(amount: Float!): Float!
    withdraw(amount: Float!): Float!
  }
`);

export default schema;
