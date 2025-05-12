let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render the task list based on filter
function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center`;

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.style.cursor = "pointer";
    if (task.completed) {
      taskText.classList.add("text-decoration-line-through", "text-muted");
    }
    taskText.onclick = () => toggleComplete(index);

    const btnGroup = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-secondary me-2";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(index);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(index);

    btnGroup.append(editBtn, delBtn);
    li.append(taskText, btnGroup);
    taskList.appendChild(li);
  });
}

// Add new task
function addTask() {
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();
  if (taskText === "") return;

  tasks.push({ text: taskText, completed: false });
  input.value = "";
  saveTasks();
  renderTasks();
}

// Toggle task completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Edit a task
function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Set filter (all / active / completed)
function setFilter(newFilter) {
  filter = newFilter;
  renderTasks();
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("bg-dark");
  document.body.classList.toggle("text-light");

  const card = document.querySelector(".card");
  if (card) {
    card.classList.toggle("bg-secondary");
    card.classList.toggle("text-white");
  }

  const inputs = document.querySelectorAll("input, .form-control");
  inputs.forEach(input => {
    input.classList.toggle("bg-dark");
    input.classList.toggle("text-white");
    input.classList.toggle("border-light");
  });

  const items = document.querySelectorAll(".list-group-item");
  items.forEach(item => {
    item.classList.toggle("bg-dark");
    item.classList.toggle("text-white");
  });
}

document.addEventListener("DOMContentLoaded", renderTasks);
