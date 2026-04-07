
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'

interface Todo {
  id: number
  title: string
  completed: boolean
  userId: number
}

function App() {
  const [newTodo, setNewTodo] = useState('')
  const queryClient = useQueryClient()

  const {data, isLoading, error} = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  })

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setNewTodo('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      addTodoMutation.mutate({ title: newTodo, completed: false, userId: 1 })
    }
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error fetching data</p>

  return (
    <>
      <h1>Todos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          disabled={addTodoMutation.isPending}
        />
        <button type="submit" disabled={addTodoMutation.isPending}>
          {addTodoMutation.isPending ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
      {addTodoMutation.isError && <p>Error adding todo</p>}
      <ul>
        {data?.map((todo: Todo) => (
          <li key={todo.id}>{todo.title} - {todo.completed ? 'Done' : 'Pending'}</li>
        ))}
      </ul>
    </>
  )
}

const getTodos = async (): Promise<Todo[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  const response = await fetch('https://jsonplaceholder.typicode.com/todos')
  return await response.json()
}

const addTodo = async (newTodo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    body: JSON.stringify(newTodo),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  return await response.json()
}

export default App
