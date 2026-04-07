import { useRef, useState } from "react";

function ExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const descriptionRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return alert("Please fill in all fields");

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
    };
    onAddExpense(newExpense);
    setDescription("");
    setAmount("");
    descriptionRef.current.focus();
  };

  return (
    <form className='expense-form' onSubmit={handleSubmit}>
      <input
        type='text'
        id='description'
        name='description'
        placeholder='Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        ref={descriptionRef}
      />

      <input
        type='number'
        id='amount'
        name='amount'
        placeholder='Amount'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type='submit'>Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
