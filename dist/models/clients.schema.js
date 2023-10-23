"use strict";
const clientsSchema = mongoose.Schema({
    name: String,
});
module.exports = mongoose.model("Clients", clientsSchema);
