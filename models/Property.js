import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipcode: { type: String },
    },
    beds: {
      type: Number,
      required: true,
    },
    baths: {
      type: Number,
      required: true,
    },
    square_feet: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    rates: {
      nightly: { type: Number },
      weekly: { type: Number },
      monthly: { type: Number },
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    currency: {
      type: String,
      enum: ["₦", "$", "€", "£", "CAD"],
      default: "$",
    },
    isForSale: {
      type: Boolean,
      required: true,
    },
    seller_info: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    images: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Property = models.Property || model("Property", PropertySchema);

export default Property;
