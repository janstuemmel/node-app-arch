const mongoose = require('mongoose');
const app = require('./src');

mongoose.connect('mongodb://db/app');

app.listen(1337);
