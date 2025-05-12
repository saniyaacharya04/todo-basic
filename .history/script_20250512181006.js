let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Theme Toggle
document.getElementById("theme-toggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks and analytics
function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear the list before rendering new tasks

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center border-0 p-3 rounded-3`;

    // Task container
    const taskContainer = document.createElement("div");
    taskContainer.className = `d-flex justify-content-between align-items-center w-100`;

    // Left section - Task details
    const taskDetails = document.createElement("div");
    taskDetails.className = "d-flex flex-column";

    // Task title
    const taskTitle = document.createElement("div");
    taskTitle.className = "fs-5 fw-bold";
    taskTitle.innerHTML = `${task.text}`;
    if (task.completed) {
      taskTitle.classList.add("text-decoration-line-through", "text-muted");
    }

    // Task due date and other details
    const taskInfo = document.createElement("small");
    taskInfo.className = "text-muted";
    taskInfo.innerHTML = `Due: ${task.dueDate || "N/A"} | Priority: ${task.priorityLabel || task.priority} | Categories: ${task.categories.join(", ")}`;

    if (task.recurrence !== "none") {
      taskInfo.innerHTML += `<br><strong>Recurrence: ${task.recurrence}</strong>`;
    }

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const timeRemaining = dueDate - new Date();
      if (timeRemaining > 0) {
        const hours = Math.floor(timeRemaining / 3600000);
        const minutes = Math.floor((timeRemaining % 3600000) / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        taskInfo.innerHTML += `<br><strong>Time Remaining: ${hours}h ${minutes}m ${seconds}s</strong>`;
      }
    }

    taskDetails.append(taskTitle, taskInfo);

    // Right section - Action buttons
    const actionBtns = document.createElement("div");
    actionBtns.className = "d-flex gap-2";

    const completeBtn = document.createElement("button");
    completeBtn.className = `btn btn-sm ${task.completed ? "btn-success" : "btn-outline-success"}`;
    completeBtn.innerHTML = task.completed ? `<i class="bi bi-check-circle"></i> Done` : `<i class="bi bi-check-circle"></i> Complete`;
    completeBtn.onclick = () => toggleComplete(index);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.innerHTML = `<i class="bi bi-trash"></i> Delete`;
    delBtn.onclick = () => deleteTask(index);

    actionBtns.append(completeBtn, delBtn);

    // Append left and right sections to the task container
    taskContainer.append(taskDetails, actionBtns);

    // Append task container to the list item
    li.append(taskContainer);

    // Append the list item to the task list
    taskList.appendChild(li);
  });

  renderAnalytics();
}

// Render Analytics
function renderAnalytics() {
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  document.getElementById("completed-count").textContent = completedTasks;
  document.getElementById("pending-count").textContent = pendingTasks;
  document.getElementById("completion-rate").textContent = `${completionRate.toFixed(2)}%`;
}

// Add Task
document.getElementById("add-task-btn").addEventListener("click", () => {
  const taskInput = document.getElementById("task-input");
  const dueInput = document.getElementById("due-date");
  const priorityInput = document.getElementById("priority");
  const categoryInput = document.getElementById("category");
  const reminderInput = document.getElementById("reminder");
  const priorityLabelInput = document.getElementById("priority-label");
  const priorityColorInput = document.getElementById("priority-color");
  const recurrenceInput = document.getElementById("recurrence");
  const attachmentInput = document.getElementById("task-attachment");

  const taskText = taskInput.value.trim();
  const dueDate = dueInput.value;
  const priority = priorityInput.value;
  const categories = category
Input.value.split(",").map(category => category.trim());
const reminder = reminderInput.checked;
const priorityLabel = priorityLabelInput.value;
const priorityColor = priorityColorInput.value;
const recurrence = recurrenceInput.value;
const attachment = attachmentInput.files.length > 0 ? attachmentInput.files[0] : null;

if (taskText === "") return alert("Task description cannot be empty.");

const newTask = {
text: taskText,
dueDate: dueDate,
priority,
categories,
reminder,
priorityLabel,
priorityColor,
recurrence,
completed: false,
attachment,
};

tasks.push(newTask);
saveTasks();
renderTasks();

// Reset input fields
taskInput.value = "";
dueInput.value = "";
categoryInput.value = "";
reminderInput.checked = false;
priorityLabelInput.value = "";
priorityColorInput.value = "#ff0000";
recurrenceInput.value = "none";
attachmentInput.value = "";
});

// Toggle Complete Task
function toggleComplete(index) {
tasks[index].completed = !tasks[index].completed;
saveTasks();
renderTasks();
}

// Delete Task
function deleteTask(index) {
tasks.splice(index, 1);
saveTasks();
renderTasks();
}

// Initial Render
renderTasks();
