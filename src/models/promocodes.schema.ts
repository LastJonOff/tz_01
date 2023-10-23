import mongoose from "mongoose";

const promocodesSchema = new mongoose.Schema({
  name: String,
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
});

const PromocodesModel = mongoose.model("Promocodes", promocodesSchema);

export default PromocodesModel;
