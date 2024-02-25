// models/Product.js
import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images:[{type:String}],
  category:{type:mongoose.Types.ObjectId,ref:'Category'},
  properties:{type:Object},
},{
  timestamps:true,
}
);




const Product = mongoose.models.Products || mongoose.model("Products",productSchema);

export default Product;
