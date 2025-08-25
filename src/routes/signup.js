const express = require("express");
const bcrypt = require("bcryptjs");
const collection = require("../config");

const signupRouter = express.Router();

// Browser test route
signupRouter.get("/", (req, res) => {
    res.send(`
      <h1>Signup Page</h1>
      <form action="/signup" method="POST">
        <input type="text" name="username" placeholder="Enter username" required />
        <br><br>
        <input type="email" name="email" placeholder="Enter email" required />
        <br><br>
        <input type="password" name="password" placeholder="Enter password" required />
        <br><br>
        <button type="submit">Signup</button>
      </form>
    `);
  });
  

// Signup POST
signupRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const existingUser = await collection.findOne({ name: username });
    if (existingUser) {
      return res.send("User already exists. Please choose a different username.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new collection({ name: username, password: hashedPassword });
    await newUser.save();

    res.send("Signup successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Signup failed");
  }
});

module.exports = signupRouter;
