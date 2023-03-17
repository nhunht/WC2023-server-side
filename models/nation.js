const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nationSchema = new Schema({
    ensign: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// create index for name field
nationSchema.index({ name: 'text' });

var Nations = mongoose.model('nations', nationSchema);

module.exports = Nations;
