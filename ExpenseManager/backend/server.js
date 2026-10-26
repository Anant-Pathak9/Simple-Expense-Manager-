const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Expense Schema
const Expense = mongoose.model("Expense", new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0.01 }
}));

// POST: Add Expense
app.post("/api/expenses", async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET: Display Expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month && year) {
      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      };
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log("Server started");
});
