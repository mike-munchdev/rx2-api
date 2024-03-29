if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('apollo-server-express');
const context = require('./server/utils/context');
const helmet = require('helmet');
const Bugsnag = require('@bugsnag/js');
const BugsnagPluginExpress = require('@bugsnag/plugin-express');
Bugsnag.start({
  apiKey: process.env.BUG_SNAG_API_KEY,
  plugins: [BugsnagPluginExpress],
});

const middleware = Bugsnag.getPlugin('express');
const {
  validateToken,
  findCustomerByToken,
} = require('./server/utils/authentication');

// Provide schemas for apollo server
const typeDefs = require('./server/schemas/index');

// Provide resolver functions for your schema fields
const resolvers = require('./server/resolvers/index');
const { importDrugs } = require('./server/utils/importDrugs');

(async () => {
  // initialize server
  const app = express();
  app.use(helmet());

  // This must be the first piece of middleware in the stack.
  // It can only capture errors in downstream middleware
  app.use(middleware.requestHandler);

  /* all other middleware and application routes go here */

  // This handles any errors that Express catches. This needs to go before other
  // error handlers. Bugsnag will call the `next` error handler if it exists.
  app.use(middleware.errorHandler);

  const allowedOrigin = process.env.CORS_URL
    ? process.env.CORS_URL.split(',')
    : [''];

  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));

  const playground = process.env.GRAPHQL_PLAYGROUND_ENABLED === 'true';
  const introspection = process.env.GRAPHQL_INTROSPECTION_ENABLED === 'true';

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection,
    playground,
    context,
    formatError: (err) => {
      Bugsnag.notify(err);
      return err;
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        try {
          let token;
          if (connectionParams['x-auth']) {
            token = connectionParams['x-auth'];
          } else {
            token = connectionParams['headers']
              ? connectionParams['headers']['x-auth']
              : null;
          }
          if (token) {
            if (token === process.env.PASSTHROUGH_TOKEN)
              return { isAdmin: true };
            const decoded = await validateToken(token, process.env.JWT_SECRET);

            const user = await findCustomerByToken(decoded);

            return { user, isAdmin: false };
          } else {
            return {};
          }
          // throw new Error('Missing auth token!');
        } catch (e) {
          Bugsnag.notify(e);
          throw e;
        }
      },
    },
  });

  server.applyMiddleware({
    app,
    cors: false,
  });

  const httpServer = http.createServer(app);

  server.installSubscriptionHandlers(httpServer);
  const ipaddr = process.env.IP || 'localhost';
  const PORT = Number(process.env.PORT) || 4001;

  httpServer.listen({ port: PORT }, async () => {
    console.log(
      `🚀 GraphQL Server ready at http://${ipaddr}:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 GraphQL Subscriptions ready at ws://${ipaddr}:${PORT}${server.subscriptionsPath}`
    );

    (async () => {
      // await importDrugs();
    })();
  });
})();
