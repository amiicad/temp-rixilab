const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },

  // Domain restriction
  domain: { type: String, required: true },

  // Batch restriction
  batch_no: { type: String, required: true },

  // Links
  downloadLink: { type: String },  // resources
  uploadLink: { type: String },    // Google Form or manual upload link

  // Week handling (always single week now)
  week: { type: Number, required: true }, // 1–8

  // Admin who created the project
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // use "User" if Admins are stored in User collection
    required: true,
  },

  // Submissions tracking
  submissions: [
    {
      internId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      file: String, // optional if not using Google Form
      submittedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
