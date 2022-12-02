const mongoose = require("mongoose");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

mongoose.connect(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
});
