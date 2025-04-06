const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config");

const app = express();
// convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

// use EJS as a view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup"); // Ensure you have signup.ejs
});

// ✅ POST Route for Signup Logic
app.post("/signup", async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).send("Username and password are required");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const data = {
            name: req.body.username,
            password: hashedPassword
        };

        // check if the user already exist in the database 
        const existingUser = await collection.findOne({ name: data.name });
        if (existingUser) {
            return res.send("User already exists. Please choose a different username.");
        }
    
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.send("Signup successful");
    } catch (error) {
        console.error(error);
        res.status(500).send("Signup failed");
    }
});

// Login user
// ✅ LOGIN ROUTE
app.post("/login", async (req, res) => {
    try {
        // Check if user exists
        const check = await collection.findOne({ name: req.body.username });
        
        // If user not found
        if (!check) {
            return res.send("Username not found");
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        
        // If password matches
        if (isPasswordMatch) {
            res.render("home");
        } else {
            res.send("Wrong password");
        }
    } catch (error) {
        console.error(error);
        res.send("An error occurred during login");
    }
});


const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});