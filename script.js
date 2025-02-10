const API_URL = "http://localhost:3000/todos";

let state = {
    todos: [],
    filter: 'all'
};

document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todoList');
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodo');
    const removeDoneBtn = document.getElementById('removeDone');
    const filters = document.getElementsByName('filter');

    // Показываем загрузку
    setTimeout(() => {
        document.getElementById("preloader").style.display = "none";
    }, 1000);

    fetchTodos();

    // ✅ Добавляем обработчик Enter для ввода задачи
    todoInput.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            addTodo();
        }
    });

    addTodoBtn.addEventListener('click', addTodo);
    removeDoneBtn.addEventListener('click', async () => {
        await deleteCompletedTodos();
    });

    // Фильтр задач
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            state.filter = filter.value;
            render();
        });
    });
});

// Загрузка задач с сервера
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch todos");
        state.todos = await response.json();
        render();
    } catch (error) {
        console.error(error);
    }
}

// Отображение задач
function render() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    const filteredTodos = state.todos.filter(todo => {
        if (state.filter === 'open') return !todo.done;
        if (state.filter === 'done') return todo.done;
        return true;
    });

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.classList.add('todo-item', 'fade-in');
        if (todo.done) li.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;

        checkbox.addEventListener('change', async () => {
            li.classList.add('fade-out');
            setTimeout(async () => {
                await updateTodoOnServer(todo.id, { done: checkbox.checked });
            }, 300);
        });

        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(todo.description));
        todoList.appendChild(li);
    });
}

// Добавление задачи
async function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const description = todoInput.value.trim();
    if (!description) return;

    if (state.todos.some(todo => todo.description.toLowerCase() === description.toLowerCase())) {
        alert('This task already exists!');
        return;
    }

    const newTodo = { description, done: false };
    await addTodoToServer(newTodo);
    todoInput.value = '';
}

// Запросы к серверу
async function addTodoToServer(todo) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo)
        });
        if (!response.ok) throw new Error("Failed to add todo");
        fetchTodos();
    } catch (error) {
        console.error(error);
    }
}

async function updateTodoOnServer(id, data) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        fetchTodos();
    } catch (error) {
        console.error(error);
    }
}

async function deleteCompletedTodos() {
    try {
        const completedTodos = state.todos.filter(todo => todo.done);
        for (const todo of completedTodos) {
            await fetch(`${API_URL}/${todo.id}`, { method: "DELETE" });
        }
        fetchTodos();
    } catch (error) {
        console.error(error);
    }
}
