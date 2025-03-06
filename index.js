document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("todo-form")
    const input = document.getElementById("todo-input")
    const todoList = document.getElementById("todo-list")
    const message = document.getElementById("message")
    let todos = []
  
    // Load todos from localStorage when the page loads
    loadTodos()
  
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        message.innerHTML = ""
        if (input.value === "") {
            giveMessage("error", "Please enter a todo")
            return
        }
        const task = input.value.trim()
        
        const newTodo = {
            id: Date.now(),
            text: task,
            completed: false,
        }
        todos.push(newTodo)
        saveTodos()
        addTodoToDOM(newTodo)
        input.value = ""
        giveMessage("success", "Todo item Created Successfully.")
    })
  
    function addTodoToDOM(todo) {
        const listItem = document.createElement("li")
        listItem.classList.add("todo-item")
        if (todo.completed) {
            listItem.classList.add("completed")
        }
        listItem.dataset.id = todo.id
        listItem.innerHTML = `
                <span class="todo-text" ondblclick="taskCompleted(this)">${todo.text}</span>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editTask(this)">✏️</button>
                    <button class="delete-btn" onclick="deleteTask(this)">🗑️</button>
                </div>
            `
        todoList.appendChild(listItem)
    }
  
    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos))
    }
  

    function loadTodos() {
        const storedTodos = localStorage.getItem("todos")
        if (storedTodos) {
            todos = JSON.parse(storedTodos)
            todos.forEach((todo) => {
                addTodoToDOM(todo)
            })
        }
    }
  
    window.deleteTask = (e) => {
        const listItem = e.closest("li")
        const id = Number.parseInt(listItem.dataset.id)
        todos = todos.filter((todo) => todo.id !== id)
        saveTodos()
        // Remove from DOM
        listItem.remove()
        giveMessage("success", "Todo deleted successfully.")
    }
  
    window.editTask = (e) => {
        const listItem = e.closest("li")
        const todoText = listItem.querySelector(".todo-text")
        const currentText = todoText.textContent
        todoText.outerHTML = `<input type="text" class="edit-input" value="${currentText}">`
        e.textContent = "💾"
        e.onclick = function () {
            saveTask(this)
        }
    }
  
    window.saveTask = (e) => {
        const listItem = e.closest("li")
        const id = Number.parseInt(listItem.dataset.id)
        const editInput = listItem.querySelector(".edit-input")
        if (editInput.value === "") {
            giveMessage("error", "Please enter a todo")
            return
        }
        const newText = editInput.value.trim()
    
        // Update in array
        const todoIndex = todos.findIndex((todo) => todo.id === id)
        if (todoIndex !== -1) {
            todos[todoIndex].text = newText
            saveTodos()
        }
        editInput.outerHTML = `<span class="todo-text" ondblclick="taskCompleted(this)">${newText}</span>`
        e.textContent = "✏️"
        e.onclick = function () {
            editTask(this)
        }
    
        giveMessage("success", "Todo updated successfully.")
    }
  
    window.giveMessage = (type, text) => {
      message.innerHTML = `<p class="message ${type}">${text}</p>`
      setTimeout(() => {
        message.innerHTML = ""
      }, 3000)
    }
  
    window.taskCompleted = (e) => {
        const listItem = e.closest("li")
        const id = Number.parseInt(listItem.dataset.id)
        const todoIndex = todos.findIndex((todo) => todo.id === id)
        if (todoIndex !== -1) {
            todos[todoIndex].completed = !todos[todoIndex].completed
            saveTodos()
        }
        listItem.classList.toggle("completed")
    }
  })
  
  