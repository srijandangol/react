import React from 'react'

function ExpenseItem({item, onDelete}) {
  return (
    <div className="expense-item">
      <span>{item.description}</span>
      <span>${item.amount}</span>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  )
}

export default ExpenseItem