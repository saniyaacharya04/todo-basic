let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

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
    li.className = `list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center`;

    const left = document.createElement("div");
    left.className = "me-md-3";

    const taskTitle = document.createElement("div");
    taskTitle.innerHTML = `<strong>${task.text}</strong>`;
    if (task.completed) {
      taskTitle.classList.add("text-decoration-line-through", "text-muted");
    }

    const details = document.createElement("small");
    details.className = "text-muted";
    details.innerHTML = `Due: ${task.dueDate || "N/A"} | Priority: ${task.priority}`;

    left.append(taskTitle, details);

    const right = document.createElement("div");
    right.className = "mt-2 mt-md-0 d-flex gap-2";

    const completeBtn = document.createElement("button");
    completeBtn.className = `btn btn-sm ${task.completed ? "btn-success" : "btn-outline-success"}`;
    completeBtn.textContent = task.completed ? "Done" : "Complete";
    completeBtn.onclick = () => toggleComplete(index);

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-secondary";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(index);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(index);

    right.append(completeBtn, editBtn, delBtn);

    li.append(left, right);
    taskList.appendChild(li);
  });
}

function addTask() {
  const taskInput = document.getElementById("task-input");
  const dueInput = document.getElementById("due-date");
  const priorityInput = document.getElementById("priority");

  const taskText = taskInput.value.trim();
  const dueDate = dueInput.value;
  const priority = priorityInput.value;

  if (taskText === "") return;

  tasks.push({
    text: taskText,
    dueDate,
    priority,
    completed: false
  });

  taskInput.value = "";
  dueInput.value = "";
  priorityInput.value = "Medium";

  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function setFilter(newFilter) {
  filter = newFilter;
  renderTasks();
}

function toggleDarkMode() {
  document.body.classList.toggle("bg-dark");
  document.body.classList.toggle("text-light");

  const card = document.querySelector(".card");
  if (card) {
    card.classList.toggle("bg-secondary");
    card.classList.toggle("text-white");
  }

  document.querySelectorAll("input, select").forEach(el => {
    el.classList.toggle("bg-dark");
    el.classList.toggle("text-white");
    el.classList.toggle("border-light");
  });

  document.querySelectorAll(".list-group-item").forEach(item => {
    item.classList.toggle("bg-dark");
    item.classList.toggle("text-white");
  });
}

document.addEventListener("DOMContentLoaded", renderTasks);
// Render the task list based on filter and sorting
function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  // Sorting tasks by priority or due date
  const sortedTasks = tasks.sort((a, b) => {
    if (filter === "priority") {
      const priorityOrder = { "Low": 1, "Medium": 2, "High": 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (filter === "dueDate" && a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center`;

    const left = document.createElement("div");
    left.className = "me-md-3";

    const taskTitle = document.createElement("div");
    taskTitle.innerHTML = `<strong>${task.text}</strong>`;
    if (task.completed) {
      taskTitle.classList.add("text-decoration-line-through", "text-muted");
    }

    const details = document.createElement("small");
    details.className = "text-muted";
    details.innerHTML = `Due: ${task.dueDate || "N/A"} | Priority: ${task.priority}`;

    left.append(taskTitle, details);

    const right = document.createElement("div");
    right.className = "mt-2 mt-md-0 d-flex gap-2";

    const completeBtn = document.createElement("button");
    completeBtn.className = `btn btn-sm ${task.completed ? "btn-success" : "btn-outline-success"}`;
    completeBtn.textContent = task.completed ? "Done" : "Complete";
    completeBtn.onclick = () => toggleComplete(index);

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-secondary";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(index);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(index);

    right.append(completeBtn, editBtn, delBtn);

    li.append(left, right);

    // Highlight overdue tasks in red
    if (task.dueDate && new Date(task.dueDate) < new Date() && !task.completed) {
      li.classList.add("bg-danger", "text-white");
    }

    taskList.appendChild(li);
  });
}
