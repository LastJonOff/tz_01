import mongoose from "mongoose";

const clientsSchema = new mongoose.Schema({
  name: String,
});

const ClientsModel = mongoose.model("Clients", clientsSchema);

export default ClientsModel;
