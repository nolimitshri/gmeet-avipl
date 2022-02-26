const mongoose = require('mongoose');

const meetSchema = new mongoose.Schema({
    link: {
        type: String,
    },
    date: {
        type: Date
    }
});

const Meet = mongoose.model("Meet", meetSchema);

module.exports = Meet;