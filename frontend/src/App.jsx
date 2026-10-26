
import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000/api/expenses";

function App() {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  async function getExpenses() {
    try {
      const res = await fetch(`${API}?month=${month}&year=${year}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setExpenses(data);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  }

  useEffect(() => {
    getExpenses();
  }, [month, year]);

  async function addExpense(e) {
    e.preventDefault();

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, date, amount: Number(amount) })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");

      setDescription("");
      setDate("");
      setAmount("");
      setMessage("Expense added successfully!");
      getExpenses();
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="app">
      <h1>Expense Manager</h1>

      <section className="card">
        <h2>Add Expense</h2>

        <form onSubmit={addExpense}>
          <label>Description</label>
          <input value={description} onChange={e => setDescription(e.target.value)} required />

          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

          <label>Amount</label>
          <input type="number" min="0.01" step="0.01" value={amount}
            onChange={e => setAmount(e.target.value)} required />

          <button type="submit">Add Expense</button>
        </form>

        <p>{message}</p>
      </section>

      <section className="card">
        <h2>Monthly Expenses</h2>

        <label>Month</label>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2000, i).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </select>

        <label>Year</label>
        <input type="number" value={year}
          onChange={e => setYear(Number(e.target.value))} />

        <h3>Total: ₹{total.toFixed(2)}</h3>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Date</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length ? expenses.map(e => (
              <tr key={e._id}>
                <td>{e.description}</td>
                <td>{new Date(e.date).toLocaleDateString("en-IN", { timeZone: "UTC" })}</td>
                <td>{e.amount.toFixed(2)}</td>
              </tr>
            )) : (
              <tr><td colSpan="3">No expenses found</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
