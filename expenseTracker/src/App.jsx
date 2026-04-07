import { useState, useEffect } from 'react'
import './App.css'
import ExpenseForm from './components/expenseForm'
import ExpenseList from './components/expenseList'

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses")
    return saved ? JSON.parse(saved) : [];
  })

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  },[expenses])

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense])
  }

  const deleteExpense = (id) => {
  setExpenses((prev) => prev.filter((item) => item.id !== id))
}

  return (
    <div className="app-container">
      <h1>Expense Tracker</h1>
      <ExpenseForm onAddExpense={addExpense} />
      <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
    </div>
    
  )
}

export default App
