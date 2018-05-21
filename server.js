const app = require('./src');
const db = require('./src/db');

// import models to init database
const models = require('./src/model');

// init database
db.sync({ force: true });

app.listen(1337);
