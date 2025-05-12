let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const themeToggleButton = document.getElementById("theme-toggle");
const bodyElement = document.body;

themeToggleButton.addEventListener("click", () => {
  bodyElement.classList.toggle("bg-dark");
  bodyElement.classList.toggle("text-light");
  themeToggleButton.classList.toggle("btn-outline-light");
  themeToggleButton.classList.toggle("btn-outline-dark");
  themeToggleButton.textContent = bodyElement.classList.contains("bg-dark") ? "Toggle Light Mode" : "Toggle Dark Mode";
  localStorage.setItem("theme", bodyElement.classList.contains("bg-dark") ? "dark" : "light");
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  const filterStatus = document.getElementById("filter-by-status").value;
  const filterCategory = document.getElementById("filter-by-category").value.trim().toLowerCase();

  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const matchesCategory = filterCategory === "" || task.categories.some(c => c.toLowerCase().includes(filterCategory));
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed);

    if (!matchesCategory || !matchesStatus) return;

    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-start align-items-md-center`;

    const left = document.createElement("div");
    const title = document.createElement("div");
    title.innerHTML = `<strong>${task.text}</strong>`;
    if (task.completed) title.classList.add("text-decoration-line-through", "text-muted");

    const info = document.createElement("small");
    info.innerHTML = `Due: ${task.dueDate || "N/A"} | Priority: ${task.priorityLabel || task.priority} | Categories: ${task.categories.join(", ")}`;
    if (task.recurrence !== "none") {
      info.innerHTML += `<br><strong>Recurrence: ${task.recurrence}</strong>`;
    }

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const timeRemaining = dueDate - new Date();
      if (timeRemaining > 0) {
        const hours = Math.floor(timeRemaining / 3600000);
        const minutes = Math.floor((timeRemaining % 3600000) / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        info.innerHTML += `<br><strong>Time Left: ${hours}h ${minutes}m ${seconds}s</strong>`;
      }
    }

    left.append(title, info);

    const right = document.createElement("div");
    right.className = "d-flex gap-2";

    const completeBtn = document.createElement("button");
    completeBtn.className = `btn btn-sm ${task.completed ? "btn-success" : "btn-outline-success"}`;
    completeBtn.innerHTML = `<i class="bi bi-check-circle"></i> ${task.completed ? "Done" : "Complete"}`;
    completeBtn.onclick = () => toggleComplete(index);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.innerHTML = `<i class="bi bi-trash"></i> Delete`;
    delBtn.onclick = () => deleteTask(index);

    right.append(completeBtn, delBtn);
    li.append(left, right);
    taskList.appendChild(li);
  });

  renderAnalytics();
}

function renderAnalytics() {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const rate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  document.getElementById("completed-count").textContent = completed;
  document.getElementById("pending-count").textContent = pending;
  document.getElementById("completion-rate").textContent = `${rate.toFixed(2)}%`;
}

document.getElementById("add-task-btn").addEventListener("click", () => {
  const text = document.getElementById("task-input").value.trim();
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;
  const categories = document.getElementById("category").value.split(",").map(c => c.trim()).filter(Boolean);
  const priorityLabel = document.getElementById("priority-label").value.trim();
  const priorityColor = document.getElementById("priority-color").value;
  const recurrence = document.getElementById("recurrence").value;
  const attachmentInput = document.getElementById("task-attachment");
  const attachment = attachmentInput.files.length > 0 ? attachmentInput.files[0] : null;
  const reminder = document.getElementById("reminder").checked;

  if (text === "") return alert("Task cannot be empty.");

  let nextDueDate = dueDate;
  if (recurrence !== "none" && dueDate) {
    const d = new Date(dueDate);
    if (recurrence === "daily") d.setDate(d.getDate() + 1);
    if (recurrence === "weekly") d.setDate(d.getDate() + 7);
    if (recurrence === "monthly") d.setMonth(d.getMonth() + 1);
    nextDueDate = d.toISOString().split("T")[0];
  }

  tasks.push({
    text,
    dueDate,
    nextDueDate,
    priority,
    categories,
    reminder,
    priorityLabel,
    priorityColor,
    recurrence,
    attachment,
    completed: false
  });

  saveTasks();
  renderTasks();
});

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  if (tasks[index].completed && tasks[index].recurrence !== "none") {
    let d = new Date(tasks[index].dueDate);
    if (tasks[index].recurrence === "daily") d.setDate(d.getDate() + 1);
    if (tasks[index].recurrence === "weekly") d.setDate(d.getDate() + 7);
    if (tasks[index].recurrence === "monthly") d.setMonth(d.getMonth() + 1);
    tasks[index].dueDate = d.toISOString().split("T")[0];
    tasks[index].nextDueDate = tasks[index].dueDate;
  }
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Sorting
document.getElementById("sort-by-due-date").onclick = () => {
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  renderTasks();
};

document.getElementById("sort-by-priority").onclick = () => {
  tasks.sort((a, b) => a.priority - b.priority);
  renderTasks();
};

document.getElementById("sort-by-status").onclick = () => {
  tasks.sort((a, b) => a.completed - b.completed);
  renderTasks();
};

// Filtering
document.getElementById("filter-by-category").addEventListener("input", renderTasks);
document.getElementById("filter-by-status").addEventListener("change", renderTasks);

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") themeToggleButton.click();
  renderTasks();
});
