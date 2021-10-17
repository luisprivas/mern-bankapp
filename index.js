import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import schema from './graphql/schema.js';
import userResolvers from './graphql/user.js';
import isAuth from './middleware/isAuth.js';

import path from 'path';
const __dirname = path.resolve();

dotenv.config({ path: './config.env' });

const app = express();

app.use(cors());

app.use(express.json());

app.use(isAuth);

const rootResolver = {
  ...userResolvers,
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true,
  })
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API running...');
  });
}

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
