const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/rixiapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected locally"))
.catch(err => console.error("MongoDB connection error:", err));
