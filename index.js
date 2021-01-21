const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const flash = require("connect-flash");

const validateMiddleware = require("./middleware/validateMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");
const authMiddleware = require("./middleware/authMiddleware");

const homeController = require("./controllers/home");

const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const newPostController = require("./controllers/newPost");
const deletePostController = require("./controllers/deletePost");

const newUserController = require("./controllers/newUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");

let port = process.env.PORT;
const app = new express();

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

global.loggedIn = null;

const app = new express();

if (port == null || port == "") {
  port = 4000;
}
app.listen(port, () => {
  console.log("App listening...");
});

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/posts/store", validateMiddleware);
app.use(
  expressSession({
    secret: process.env.EXPRESS_SECRET,
  })
);
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});
app.use(flash());


app.get("/", homeController);
app.get("/post/:id", getPostController);
app.get("/posts/new", authMiddleware, newPostController);
app.post("/posts/store", authMiddleware, storePostController);
app.delete("/posts/delete", authMiddleware, deletePostController);
app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);
app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);
app.post(
  "/users/register",
  redirectIfAuthenticatedMiddleware,
  storeUserController
);
app.post(
  "/users/login",
  redirectIfAuthenticatedMiddleware,
  loginUserController
);

app.get("/auth/logout", logoutController);
app.use((req, res) => res.render("notfound"));
