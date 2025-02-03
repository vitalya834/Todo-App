
let state = {
  todos: [], // array
  filter: 'all' //  (all, open, done)
};

//  id
let nextId = 1;
///  dom 
document.addEventListener('DOMContentLoaded', () => {
  const todoList = document.getElementById('todoList');
  const todoInput = document.getElementById('todoInput');
  const addTodoBtn = document.getElementById('addTodo');
  const removeDoneBtn = document.getElementById('removeDone');
  const filters = document.getElementsByName('filter');

  // neu todo aufgabe  
  addTodoBtn.addEventListener('click', () => {
      const description = todoInput.value.trim();
      if (!description) return; // wenn leeer  dann   ---- macht nicht 

      //   check dubl 
      if (state.todos.some(todo => todo.description.toLowerCase() === description.toLowerCase())) {
          alert('This task already exists!');
          return;
      }

      // add in array massiv
      state.todos.push({ id: nextId++, description, done: false });
      saveState(); // spachen 
      render(); // inefeisssss
      todoInput.value = ''; // clean 
  });

  // del  fertich 
  removeDoneBtn.addEventListener('click', () => {
      state.todos = state.todos.filter(todo => !todo.done);
      saveState();
      render();
  });

  // Фfilter
  filters.forEach(filter => {
      filter.addEventListener('change', () => {
          state.filter = filter.value;
          render();
      });
  });

  //  localStorage
  loadState();
  render();
});

function render() {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = ''; // clean 

  // Применяем фильтр
  const filteredTodos = state.todos.filter(todo => {
      if (state.filter === 'open') return !todo.done;
      if (state.filter === 'done') return todo.done;
      return true;
  });

  // htm l
  filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.done;

      // status 
      checkbox.addEventListener('change', () => {
          todo.done = checkbox.checked;
          saveState();
          render();
      });

      // -- --------
      if (todo.done) {
          li.classList.add('completed');
      } else {
          li.classList.remove('completed');
      }

      li.textContent = todo.description;
      li.prepend(checkbox);
      todoList.appendChild(li);
  });
}


//status
function saveState() {
  localStorage.setItem('todos', JSON.stringify(state.todos));
}

// her aus localStorage
function loadState() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
      state.todos = JSON.parse(savedTodos);
      nextId = Math.max(1, ...state.todos.map(todo => todo.id)) + 1;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const easterEgg = document.getElementById('easterEgg');

  easterEgg.addEventListener('click', () => {
      // Добавляем класс с анимацией
      easterEgg.classList.add('animated');

      // Через 1 секунду скрываем элемент
      setTimeout(() => {
          easterEgg.classList.add('hidden');
          alert('You found the Easter Egg! 🎉');
      }, 1000);
  });
});
