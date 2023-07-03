/** @jsx element */
import { element, reactive } from './lib'
import { getTodos, setTodos } from './todos'
import { getTimeSince } from './utils'
import trashIcon from './assets/trash.svg'
import './styles/globals.css'

const getRandomPlaceholder = () => {
  const placeholders = ['Walk the dog 🐶', 'Buy milk 🥛', 'Do the dishes 🧼']
  return placeholders[Math.floor(Math.random() * placeholders.length)]
}

function TodoList({ todos, onDelete }) {
  return (
    <ul class="grid gap-2">
      {todos.length === 0 && (
        <div class="p-4 border-2 border-dashed rounded text-sm text-gray-600 text-center">
          <p>Add a todo to see it here.</p>
        </div>
      )}
      {todos.length > 0 &&
        todos.map((todo) => (
          <li class="border py-2 px-4 rounded">
            <div class="flex justify-between items-center">
              <span>{todo.content}</span>
              <button
                aria-label="Delete todo"
                onclick={() => onDelete(todo.id)}
              >
                <img class="w-4 h-4" src={trashIcon} />
              </button>
            </div>
            <p class="text-xs text-gray-600">{getTimeSince(todo.created)}</p>
          </li>
        ))}
    </ul>
  )
}

function App() {
  const content = reactive('')
  const todos = reactive(getTodos())

  todos.subscribe(setTodos)

  const handleAddTodo = (event) => {
    event.preventDefault()

    todos.update((todos) => [
      ...todos,
      {
        id: crypto.randomUUID(),
        content: content.get(),
        created: new Date(),
      },
    ])

    content.set('')
    event.target.reset()
  }

  const handleDeleteTodo = (id) => {
    todos.update((todos) => todos.filter((todo) => todo.id !== id))
  }

  return (
    <div class="w-full h-screen grid place-items-center bg-gradient-to-br from-blue-600 to-indigo-600">
      <main class="shadow-xl w-[24rem] p-8 border rounded-lg flex flex-col bg-white">
        <h1 class="mb-2 text-4xl font-bold tracking-tighter text-center leading-non">
          Todo list
        </h1>
        <p class="mb-4 text-center text-gray-600 tracking-tight">
          Fill in the form to add a todo
        </p>
        <form class="mb-4 flex flex-col gap-4" onsubmit={handleAddTodo}>
          <div class="flex flex-col">
            <label class="mb-1" for="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder={getRandomPlaceholder()}
              class="py-2 px-4 border rounded outline-none transition ease-in-out focus:ring-2 focus:border-transparent focus:ring-blue-600"
              value={content}
              oninput={(e) => content.set(e.target.value)}
            />
          </div>
          <button
            class="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition ease-in-out hover:shadow-lg hover:shadow-blue-600/25"
            type="submit"
          >
            Add todo
          </button>
        </form>
        <h2 class="mb-2 text-2xl font-bold tracking-tighter text-center">
          Todos
        </h2>
        {todos.derive((todos) => (
          <TodoList todos={todos} onDelete={handleDeleteTodo} />
        ))}
      </main>
    </div>
  )
}

document.body.append(App())
