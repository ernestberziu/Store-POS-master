const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://eberziu1:Ernest2000@marketolci.vjpdm8h.mongodb.net/olci', { useNewUrlParser: true })
    .then(() => console.error('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));;

module.exports = mongoose