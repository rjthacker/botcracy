import { config } from "dotenv";
import mongoose from "mongoose";

config({ path: `.env.${process.env.NODE_ENV}` });

mongoose.connect(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
});
