const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

require("./db"); // Mongoose connection
const User = require("./models/User");
const Project = require("./models/Project");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  secret: "internship_secret_key",
  resave: false,
  saveUninitialized: false
}));

// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Role-based middleware
const authRole = require('./middleware/authRole');

// --- Routes ---

const homeRoute = require('./routes/homeRoute');
// app.get("/", homeRoute);

// Register first superAdmin
app.get("/register-superAdmin", (req, res) => res.render("register"));

const registerSuperAdminRouter = require('./routes/registerSuperAdminRoute');
app.post('/register-superAdmin', registerSuperAdminRouter);



// Register first admin
app.get("/register-admin", (req, res) => res.render("register"));
app.post("/register-admin", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new User({ name, email, password: hashedPassword, role: "admin" });
  await admin.save();
  req.session.user = admin._id;
  req.session.role = "admin";
  res.redirect("/admin");
});

// Login page
app.get("/login", (req, res) => res.render("login"));

const loginRouter = require('./routes/loginRoute');
app.post('/login', loginRouter);

// Logout
const logoutRouter = require('./routes/logoutRoute');

// serve index
app.get("/", homeRoute);

// mount logout router
app.use("/", logoutRouter);   // ✅ attaches /logout route



app.get("/internship", (req, res) => {
  res.render("internship");
});

// --- Admin Routes ---

const adminRoute = require('./routes/adminRoute');
app.get('/admin', adminRoute);

// Superadmin dashboard

const superAdminRoute = require('./routes/superAdminRoute');
app.get('/superAdmin', superAdminRoute);

// Create Interns
const createInternRouter = require('./routes/createInternRoute');
app.post('/create-user', createInternRouter);

// Create Admin
const createAdminRouter = require('./routes/createAdminRoute');
app.post('/create-admin', createAdminRouter);

// Upload Project
const uploadProjectRouter = require('./routes/uploadProjectRoute');
app.post('/admin/projects', uploadProjectRouter); 

// Update Project
const updateProjectRouter = require('./routes/updateProjectRoute');
app.post('/admin/project/update/:id', updateProjectRouter);

// View specific intern (admin only)
const viewInternRouter = require('./routes/viewInternRoute');
app.get('/admin/intern/:internId', viewInternRouter);

// Approve/Reject Submission
const projectSubmissionRouter = require('./routes/projectSubmissionRoute');
app.post('/submission/:projectId/:internId', projectSubmissionRouter);


// Email placeholders
app.post("/send-email", authRole("admin"), async (req, res) => {
  let internIds = req.body.internIds;
  if (!internIds) return res.redirect("/admin");
  if (!Array.isArray(internIds)) internIds = [internIds];
  console.log("Send email to:", internIds); // Placeholder
  res.redirect("/admin");
});

// --- Update/Delete Intern ---

// Delete user
app.post("/delete-user/:id", authRole("superAdmin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/superAdmin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete user");
  }
});

// Update user (post form)
const updateUserRouter = require('./routes/updateUserRoute');
app.post('/update-user/:id', updateUserRouter);



// --- Intern Routes ---

const internRouter = require('./routes/internRoute');
app.get('/intern', internRouter);

const viewAdminRouter = require('./routes/viewAdminRoute');
app.get('/superAdmin/admin/:adminId', viewAdminRouter);

// Intern Submit Project
app.post("/intern/submit/:projectId", authRole("intern"), upload.single("projectFile"), async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  project.submissions.push({
    internId: req.session.user,
    file: req.file.filename,
    status: "pending"
  });
  await project.save();
  res.redirect("/intern");
});

// Intern download project file (domain restricted)
app.get("/intern/download/:filename", authRole("intern"), async (req, res) => {
  const intern = await User.findById(req.session.user);
  const project = await Project.findOne({ file: req.params.filename, domain: intern.domain });
  if (!project) return res.status(403).send("Access Denied");

  const file = path.join(__dirname, "uploads", req.params.filename);
  res.download(file);
});

// Admin download file
app.get("/download/:filename", authRole("admin"), (req, res) => {
  const file = path.join(__dirname, "uploads", req.params.filename);
  res.download(file);
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
