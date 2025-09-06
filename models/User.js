const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  domain: { type: String },
  college: { type: String },
  duration: { type: Number },
  branch: { type: String },
  course : { type: String },
  university: { type: String },
  year_sem: { type: String },
  intern_id: { type: String, unique: true ,sparse: true },
  phone: { type: String , unique: true ,required: true },
  role: { type: String,default: "intern" },
  emp_id: { type: String, unique: true ,sparse: true },
  designation: { type: String },
  batch_no:{ type: String},
  certificate_id: { type: String, unique: true ,sparse: true },
projectAssigned: [
    {
      projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      },
      week: Number,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
