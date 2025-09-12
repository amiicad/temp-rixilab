const express = require("express");

const url = "https://render-hosting-se2b.onrender.com";

const interval = 30000;

function reloadWebsite() {

  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite,interval);


setInterval(reloadWebsite, interval);
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
require('dotenv').config();
const flash = require('connect-flash');
require("./db"); // Mongoose connection
const User = require("./models/User");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  secret: "secretKey",
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
// Make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  next();
});


// Role-based middleware
const authRole = require('./middleware/authRole');

// --- Routes ---

const homeRoute = require('./routes/homeRoute');
// app.get("/", homeRoute);

// Register first superAdmin
app.get("/register-superAdmin", (req, res) => res.render("register"));

const registerSuperAdminRouter = require('./routes/registerSuperAdminRoute');
app.use('/', registerSuperAdminRouter); // now POST /register-superAdmin works




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

const verifyCertificateRouter = require('./routes/verifyCertificateRouter');
app.get("/certificate", (req, res) => res.render("certificate"));
app.post('/verify-certificate', verifyCertificateRouter);

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

// Delete Project
const deleteProjectRouter = require('./routes/deleteProjectRouter');
app.post('/delete-project/:id', deleteProjectRouter);

// View specific intern (admin only)
const viewInternRouter = require('./routes/viewInternRoute');
app.get('/admin/intern/:internId', viewInternRouter);

// Approve/Reject Submission
const projectStatusRouter = require('./routes/projectStatusRoute');
app.use('/admin', projectStatusRouter);
  


// Email placeholders
const confirmationMailRouter = require('./routes/confirmationMailRoute');
const completionMailRouter = require('./routes/completionMailRoute');
const offerLetterMailRouter = require('./routes/offerLetterMailRoute');

app.use('/', confirmationMailRouter);
app.use('/', completionMailRouter);
app.use('/', offerLetterMailRouter);

// --- Update/Delete Intern ---

const deleteUserRouter = require('./routes/deleteUser');
app.post('/delete-user/:id', deleteUserRouter);

// Update user (post form)
const updateUserRouter = require('./routes/updateUserRoute');
app.post('/update-user/:id', updateUserRouter);


// Notice Route
const noticeRoute = require('./routes/noticeRoute');
app.use('/superAdmin', noticeRoute);

const deleteNoticeRoute = require('./routes/deleteNoticeRoute');
app.use('/superAdmin', deleteNoticeRoute);



// --- Intern Routes ---

const internRouter = require('./routes/internRoute');
app.get('/intern', internRouter);

const viewAdminRouter = require('./routes/viewAdminRoute');
app.get('/superAdmin/admin/:adminId', viewAdminRouter);


app.listen(3000, () => console.log("Server running at http://localhost:3000"));
