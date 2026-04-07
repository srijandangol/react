
import ExpenseItem from './ExpenseItem'

function ExpenseList({ expenses, onDeleteExpense }) {
  if (expenses.length === 0) {
    return <p className='no-expense'>No expenses added yet.</p>
  }
  return (
    <div className="expense-list">
        {
          expenses.map((item) => (
            <ExpenseItem key={item.id} item={item} onDelete={onDeleteExpense} />
          ))
        }
    </div>
  )
}

export default ExpenseList