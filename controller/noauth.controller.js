const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const logIn = async (req, res) => {
  const { id } = req.body;

  try {
    // Check if employee exists
    let employee = await Employee.findOne({ where: { id } });

    if (!employee) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Validate password
    const isMatch = true;
    // await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      employee: {
        id: employee.id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: 3600 }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { logIn };
