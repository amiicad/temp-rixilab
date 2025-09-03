const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  domain: { type: String },
  college: { type: String },
  duration: { type: String },
  branch: { type: String },
  course : { type: String },
  university: { type: String },
  year_sem: { type: String },
  intern_id: { type: String },
  phone: { type: String },
  role: { type: String,default: "intern" },
  emp_id: { type: String, unique: true ,sparse: true },
  batch_no:{ type: String}
});

module.exports = mongoose.model("User", userSchema);
