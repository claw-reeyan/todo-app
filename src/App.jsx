import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    setTodos([...todos, {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }])
    setInputValue('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeTodosCount = todos.filter(t => !t.completed).length
  const completedTodosCount = todos.filter(t => t.completed).length

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>✅ Todo List</h1>
          <p className="subtitle">Stay organized, get things done</p>
        </header>

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          <button type="submit" className="add-btn">
            Add
          </button>
        </form>

        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({todos.length})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({activeTodosCount})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedTodosCount})
          </button>
        </div>

        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li className="empty-state">
              {filter === 'all' 
                ? "No todos yet. Add one above!" 
                : filter === 'active' 
                  ? "No active todos. You're all caught up!"
                  : "No completed todos yet."}
            </li>
          ) : (
            filteredTodos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{todo.text}</span>
                </label>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                  title="Delete"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>

        {completedTodosCount > 0 && (
          <div className="footer-actions">
            <button onClick={clearCompleted} className="clear-btn">
              Clear completed ({completedTodosCount})
            </button>
          </div>
        )}

        <footer className="app-footer">
          <p>Double-click to edit • Local storage saves your todos</p>
        </footer>
      </div>
    </div>
  )
}

export default App