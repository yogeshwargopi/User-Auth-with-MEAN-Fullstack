const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const db = require("./db");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const salt = 10;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "P@ssw0rd#1S3cr3tK3y", // Change this to a random secret key
    resave: false,
    saveUninitialized: true,
  })
);

/*app.post("/signup", (req, res) => {
  const psql =
    "INSERT INTO users(firstname, lastname, email, age, password)VALUES ($1, $2, $3, $4, $5) RETURNING *";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "error for hassing pasword" });
    const values = [req.body.firstname, "hiii", req.body.email, "20", hash];
    console.log("SQL Query:", psql);
    console.log(values);
    db.query(psql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ Error: "Inserting data error in server" });
      }
      if (result) {
        const name = "arun";
        const token = jwt.sign({ name }, "P@ssw0rd#1S3cr3tK3y");
        return res.json({ status: "Success", token: token });
      }
    });
  });
});*/

app.post("/signup", (req, res) => {
  const checkEmailQuery = "SELECT * FROM users WHERE email = $1";
  const insertUserQuery =
    "INSERT INTO users(firstname, lastname, email, age, password) VALUES ($1, $2, $3, $4, $5) RETURNING *";

  // First, check if the email already exists
  db.query(checkEmailQuery, [req.body.email], (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ Error: "Error checking email existence in server" });
    }
    if (data.rows.length > 0) {
      // If email exists, return an error
      return res.json({ Error: "Email already exists" });
    } else {
      // If email doesn't exist, proceed with user creation
      bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password" });
        const values = [
          req.body.firstname,
          "unname",
          req.body.email,
          "20",
          hash,
        ];
        console.log("SQL Query:", insertUserQuery);
        console.log(values);
        db.query(insertUserQuery, values, (err, result) => {
          if (err) {
            console.error(err);
            return res.json({ Error: "Inserting data error in server" });
          }
          if (result) {
            const name = req.body.firstname;
            const token = jwt.sign({ name }, "P@ssw0rd#1S3cr3tK3y");
            return res.json({ status: "Success", token: token });
          }
        });
      });
    }
  });
});

app.post("/login", (req, res) => {
  const psql = "SELECT * FROM users WHERE email = $1";

  db.query(psql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login error in server" });
    if (data && data.rows && data.rows.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data.rows[0].password,
        (err, response) => {
          console.log(response);
          if (err) return res.json({ Error: "Password compare error" });
          if (response) {
            const name = data.rows[0].firstname;
            //const name = req.body.email;
            const token = jwt.sign({ name }, "P@ssw0rd#1S3cr3tK3y");
            return res.json({ status: "Success", token: token });
          } else {
            return res.json({ Error: "Wrong Password" });
          }
        }
      );
    } else {
      return res.json({ Error: "No email existed" });
    }
  });
});

//user page api

const verifyUser = (req, res, next) => {
  const token = req.headers.authorization;
  //console.log(token); // Get token from request headers

  if (!token) {
    return res.json({ Message: "We need token Please provide it." });
  } else {
    jwt.verify(token, "P@ssw0rd#1S3cr3tK3y", (err, decoded) => {
      if (err) {
        console.log("error");
        return res.json({ Message: "Authentication error" }); //Forbidden
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/user", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log("server is on PORT" + PORT));
