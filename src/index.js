const express = require('express');
const signupRouter = require("./routes/signup.js");
const signinRouter = require("./routes/signin.js");
const authMiddleware = require("./middleware/auth.js"); // <-- new middleware

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// mount routers
app.use("/signup", signupRouter);
app.use("/signin", signinRouter);

// Public route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Protected route
app.get("/profile", authMiddleware, (req, res) => {
  res.send(`Welcome user with ID: ${req.userId}`);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
