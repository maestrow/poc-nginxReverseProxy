import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

// Error Handlers

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: err.message });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render("error", { error: err });
}

// Middleware

async function validateCookies(req, res, next) {
  const user = req.signedCookies.user;
  if (!user) {
    res.redirect("/login");
  } else {
    next();
  }
}

app.use(cors());
app.use(cookieParser("OoijwfeJ9"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// Login

app.get("/login", (req, res, next) => {
  try {
    const params = req.query;
    console.log(params);
    if (params.user && params.password) {
      if (params.user == "admin" && params.password == "admin") {
        res.cookie("user", "admin", { signed: true });
        res.status(200).send("Welcome, Admin!");
      } else {
        res.status(401).send("Wrong username or password");
      }
    } else {
      res.status(200).send("Provide credentials");
    }
  } catch (err) {
    next(err);
  }
});

app.get("/logout", (req, res, next) => {
  res.clearCookie('user');
  res.redirect('/');
})

// Main page

app.get("/", (req, res, next) => {
  try {
    res.json({
      path: "/",
      method: "GET",
    });
  } catch (err) {
    next(err);
  }
});

// Data

app.post("/data", validateCookies, (req, res, next) => {
  try {
    console.log("Cookies: ", req.cookies);
    const post = req.body;
    res.json({
      path: "/data",
      method: "POST",
      data: post,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/data", validateCookies, (req, res, next) => {
  try {
    console.log("Cookies: ", req.cookies);
    const params = req.query;
    res.json({
      path: "/data",
      method: "GET",
      data: params,
    });
  } catch (err) {
    next(err);
  }
});


// Server

function handle(signal) {
  console.log(`Received ${signal}`);
  process.exit();
}

process.on("SIGINT", handle);
process.on("SIGTERM", handle);
process.on("SIGBREAK", handle);

app.listen(port, () => console.log(`Listening on port ${port}!`));
