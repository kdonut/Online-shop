const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {
    const MongoDBStore = mongoDbStore(expressSession);

    const store = new MongoDBStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'online-shop',
        collection: 'session'
    });

    return store;
}

function createSessionConfig(){
    return {
        secret :'super-secret',
        resave : false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
           maxAge: 2 * 24 * 60 * 600 *1000,
       }
    }
}

module.exports = createSessionConfig;
  