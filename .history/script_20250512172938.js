let tasks = [];

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center todo-item ${task.completed ? "completed" : ""}`;

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.style.cursor = "pointer";
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

function addTask() {
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();
  if (taskText === "") return;

  tasks.push({ text: taskText, completed: false });
  input.value = "";
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}
