const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const collection = require("../config");

const signinRouter = express.Router();

// For browser GET request
// For browser GET request (Signin form)
signinRouter.get("/", (req, res) => {
    res.send(`
      <h1>Signin Page</h1>
      <form action="/signin" method="POST">
        <input type="text" name="username" placeholder="Enter username" required />
        <br><br>
        <input type="password" name="password" placeholder="Enter password" required />
        <br><br>
        <button type="submit">Signin</button>
      </form>
    `);
  });
  

// Actual signin POST
signinRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = await collection.findOne({ name: username });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, "secretkey", { expiresIn: "1h" });

    res.json({ message: "Signin successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Signin failed");
  }
});

module.exports = signinRouter;
