export function getTodos() {
  const todos = localStorage.getItem('@app:todos')

  if (!todos) {
    return []
  }

  return JSON.parse(todos)
}

export function setTodos(todos) {
  localStorage.setItem('@app:todos', JSON.stringify(todos))
}
