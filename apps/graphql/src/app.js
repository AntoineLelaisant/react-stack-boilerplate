import express from 'express';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import winston from 'winston';
import schema from './schema';

const pingHandler = () => (req, res, next) => res.status(200).end();

const errorHandler = logger => (err, req, res, next) => {
  logger.error(`An error happened during a request: ${err.message}`);

  if (!res.headersSent) {
    response.status(500);
  }

  response.end();
};

const connectToMongo = (logger, host, port) => {
  mongoose.connect(`mongodb://${host}:${port}/packages`);
  mongoose.connection.once('open', () => logger.info('Connected to database.'));
};

const graphqlHandler = () => graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'production' ? false : true,
});

const run = () => {
  const app = express();
  const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.simple(),
    transports: [ new winston.transports.Console() ],
  });

  process.on('unhandledPromiseRejection', (reason, p) => {
    logger.error(`A promise rejection has been unhandled: ${reason}, at: ${p}`);
  });

  app.disable('x-powered-by');
  app.use(cors());
  app.use(morgan('combined'));
  app.use('/graphql', graphqlHandler());
  app.use('/_ping', pingHandler());
  app.use(errorHandler(logger));

  connectToMongo(logger, process.env.MONGO_HOST, process.env.MONGO_PORT);

  const httpPort = process.env.GRAPHQL_PORT || 80;
  app.listen(httpPort, () => logger.info(`Listening on port ${httpPort}...`));
};

run();
