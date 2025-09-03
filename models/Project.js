const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  domain: { type: String, required: true },
  submissions: [
    {
      internId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      file: String,
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
    }
  ]
});

module.exports = mongoose.model("Project", projectSchema);
