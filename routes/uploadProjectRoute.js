const express = require('express');
const router = express.Router();
const path = require("path");
const Project = require("../models/Project");
const authRole = require('../middleware/authRole');
const multer = require("multer");
const upload = multer({ storage: multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
}) });
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

router.post("/upload-project", authRole("admin"), upload.single("projectFile"), async (req, res) => {
  const { title, description, domain } = req.body;
  const project = new Project({
    title,
    description,
    domain,
    file: req.file ? req.file.filename : null
  });
  await project.save();
  res.redirect("/admin");
});

module.exports = router;