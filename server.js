const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true // development
}));

app.listen(4000, () => {
    console.log('Server Running on Port 4000');
});