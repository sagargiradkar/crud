const express = require('express');
const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/crud-operation';
const user = require('./models.js');

const app = express();

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to the database');
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });

app.use(express.json());

app.listen(9000, () => {
  console.log("App is running on port 9000");
});

// Get only one user by id
app.get('/:id', async (req, res) => {
  try {
    const oneUser = await user.findById(req.params.id);
    res.json(oneUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update user by id
app.put('/:id', async (req, res) => {
  try {
    const oneUser = await user.findById(req.params.id);

    // Check if user exists
    if (!oneUser) {
      return res.status(404).json({ message: "User not found" });
    }

    oneUser.name = req.body.name;
    oneUser.age = req.body.age;
    oneUser.email = req.body.email;
    oneUser.password = req.body.password;

    const updatedUser = await oneUser.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete user by id
app.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await user.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.send("Record deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Get all users
app.get('/', async (req, res) => {
  try {
    const allUsers = await user.find();
    if (allUsers.length === 0) {
      return res.status(404).send("No users found");
    }
    res.json(allUsers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Signup
app.post('/SignUp', async (req, res) => {
  try {
    // Check if user already exists with the provided email
    const existingUser = await user.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Create a new user object
    const newUser = new user({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      age: req.body.age
    });

    // Save the new user
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const dbUser = await user.findOne({ name: req.body.name });
    if (!dbUser) {
      res.status(404).send("User not found");
      return;
    }

    if (dbUser.password === req.body.password) {
      res.send('Login Successful');
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});
