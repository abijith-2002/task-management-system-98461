import React, { useEffect, useMemo, useReducer, useState } from 'react';
import './App.css';

// Types
/**
 * @typedef {Object} Todo
 * @property {string} id
 * @property {string} title
 * @property {boolean} completed
 * @property {number} createdAt
 * @property {number} updatedAt
 */

// Utilities
const uuid = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

// Local storage keys
const STORAGE_KEY = 'oceanpro_todos';
const STORAGE_THEME = 'oceanpro_theme';

// Reducer for todos
function todosReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload ?? [];
    case 'ADD': {
      const now = Date.now();
      const newTodo = {
        id: uuid(),
        title: action.title.trim(),
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      return [newTodo, ...state];
    }
    case 'TOGGLE': {
      return state.map(t =>
        t.id === action.id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t
      );
    }
    case 'EDIT': {
      const title = action.title.trim();
      if (!title) return state;
      return state.map(t =>
        t.id === action.id ? { ...t, title, updatedAt: Date.now() } : t
      );
    }
    case 'DELETE': {
      return state.filter(t => t.id !== action.id);
    }
    case 'CLEAR_COMPLETED': {
      return state.filter(t => !t.completed);
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
function App() {
  /** Theme handling */
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_THEME);
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME, theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  /** Todos state with reducer + localStorage persistence */
  const [todos, dispatch] = useReducer(todosReducer, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          dispatch({ type: 'INIT', payload: parsed });
        }
      }
    } catch {
      // ignore bad data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  /** Derived statistics */
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);

  /** Input form state */
  const [input, setInput] = useState('');
  const canAdd = input.trim().length > 0;

  const handleAdd = (e) => {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    dispatch({ type: 'ADD', title });
    setInput('');
  };

  return (
    <div className="ocean-app">
      <header className="ocean-header">
        <div className="ocean-header-inner">
          <div className="brand">
            <div className="logo-badge" aria-hidden>✓</div>
            <div className="brand-text">
              <h1 className="title">Ocean Tasks</h1>
              <p className="subtitle">Focus, track, and complete with clarity</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="btn theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </header>

      <main className="ocean-main">
        <section className="composer-card">
          <form onSubmit={handleAdd} className="todo-form" aria-label="Add a new task">
            <div className="input-wrap">
              <input
                className="input"
                type="text"
                placeholder="Add a new task... (e.g., Prepare project brief)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Task title"
              />
              <button className="btn primary" type="submit" disabled={!canAdd}>
                Add Task
              </button>
            </div>
            <div className="meta">
              <span className="stat">
                <span className="dot ocean" />
                {stats.active} active
              </span>
              <span className="stat">
                <span className="dot amber" />
                {stats.completed} completed
              </span>
              <span className="stat">
                <span className="dot slate" />
                {stats.total} total
              </span>
              <button
                type="button"
                className="btn text danger"
                onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
                disabled={stats.completed === 0}
                aria-disabled={stats.completed === 0}
              >
                Clear completed
              </button>
            </div>
          </form>
        </section>

        <section className="list-card" aria-label="Task list">
          {todos.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🌊</div>
              <p className="empty-text">Your task ocean is calm. Add your first task to make waves.</p>
            </div>
          ) : (
            <ul className="todo-list" role="list">
              {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="ocean-footer">
        <p>
          Built with the Ocean Professional theme • Smooth gradients, subtle shadows, and focus on clarity
        </p>
      </footer>
    </div>
  );
}

/**
 * A single todo item with inline editing and controls.
 * @param {{todo: Todo, dispatch: React.Dispatch<any>}} props
 */
function TodoItem({ todo, dispatch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  useEffect(() => {
    setDraft(todo.title);
  }, [todo.title]);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.title) {
      dispatch({ type: 'EDIT', id: todo.id, title: trimmed });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setDraft(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <li className={`todo ${todo.completed ? 'completed' : ''}`} data-id={todo.id}>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
          aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
        />
        <span className="checkmark" />
      </label>

      <div className="content">
        {isEditing ? (
          <input
            className="edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Edit task title"
          />
        ) : (
          <span
            className="title"
            onDoubleClick={() => setIsEditing(true)}
            title="Double click to edit"
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="actions">
        {!isEditing && (
          <button
            className="icon-btn"
            title="Edit"
            aria-label="Edit task"
            onClick={() => setIsEditing(true)}
          >
            ✏️
          </button>
        )}
        <button
          className="icon-btn danger"
          title="Delete"
          aria-label="Delete task"
          onClick={() => dispatch({ type: 'DELETE', id: todo.id })}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

export default App;
