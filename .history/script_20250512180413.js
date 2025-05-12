let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Theme Toggle
document.getElementById("theme-toggle").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});
 // Dark mode toggle functionality using Bootstrap's utility classes
    const themeToggleButton = document.getElementById('theme-toggle');
    const bodyElement = document.body;

    themeToggleButton.addEventListener('click', () => {
      // Toggle dark mode class on the body element
      bodyElement.classList.toggle('bg-dark');
      bodyElement.classList.toggle('text-light');
      themeToggleButton.classList.toggle('btn-outline-light');
      themeToggleButton.classList.toggle('btn-outline-dark');
      themeToggleButton.textContent = bodyElement.classList.contains('bg-dark') ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    });

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks and analytics

  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center`;

    const left = document.createElement("div");
    left.className = "me-md-3";

    const taskTitle = document.createElement("div");
    taskTitle.innerHTML = `<strong>${task.text}</strong>`;
    if (task.completed) {
      taskTitle.classList.add("task-completed");
    }

    const details = document.createElement("small");
    details.className = "text-muted";
    details.innerHTML = `Due: ${task.dueDate || "N/A"} | Priority: ${task.priorityLabel || task.priority} | Categories: ${task.categories.join(", ")}`;

    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const timeRemaining = dueDate - new Date();
      if (timeRemaining > 0) {
        const hours = Math.floor(timeRemaining / 3600000);
        const minutes = Math.floor((timeRemaining % 3600000) / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);
        details.innerHTML += `<br><strong>Time Remaining: ${hours}h ${minutes}m ${seconds}s</strong>`;
      }
    }

    if (task.recurrence !== "none") {
      details.innerHTML += `<br><strong>Recurrence: ${task.recurrence}</strong>`;
    }

    left.append(taskTitle, details);

    const right = document.createElement("div");
    right.className = "mt-2 mt-md-0 d-flex gap-2";

    const completeBtn = document.createElement("button");
    completeBtn.className = `btn btn-sm ${task.completed ? "btn-success" : "btn-outline-success"}`;
    completeBtn.textContent = task.completed ? "Done" : "Complete";
    completeBtn.onclick = () => toggleComplete(index);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-outline-danger";
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(index);

    right.append(completeBtn, delBtn);

    li.append(left, right);
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
  const categories = categoryInput.value.split(",").map(category => category.trim()).filter(Boolean);
  const reminder = reminderInput.checked;
  const priorityLabel = priorityLabelInput.value.trim();
  const priorityColor = priorityColorInput.value;
  const recurrence = recurrenceInput.value;
  const attachment = attachmentInput.files.length > 0 ? attachmentInput.files[0] : null;

  if (taskText === "") {
    alert("Task text cannot be empty.");
    return;
  }

  let nextDueDate = dueDate; // Initialize nextDueDate with the current due date.

  // Calculate the next due date based on recurrence (daily, weekly, monthly)
  if (recurrence === "daily") {
    nextDueDate = new Date(dueDate);
    nextDueDate.setDate(nextDueDate.getDate() + 1); // Add 1 day
    nextDueDate = nextDueDate.toISOString().split("T")[0]; // Format the date
  } else if (recurrence === "weekly") {
    nextDueDate = new Date(dueDate);
    nextDueDate.setDate(nextDueDate.getDate() + 7); // Add 7 days
    nextDueDate = nextDueDate.toISOString().split("T")[0]; // Format the date
  } else if (recurrence === "monthly") {
    nextDueDate = new Date(dueDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1); // Add 1 month
    nextDueDate = nextDueDate.toISOString().split("T")[0]; // Format the date
  }

  tasks.push({
    text: taskText,
    dueDate: dueDate,
    nextDueDate: nextDueDate, // Store next due date
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

// Toggle Task Completion and Reschedule If Recurring
function toggleComplete(index) {
  const task = tasks[index];
  task.completed = !task.completed;

  // If the task is completed and has recurrence, update the due date
  if (task.completed && task.recurrence !== "none") {
    let newDueDate = new Date(task.dueDate);
    
    if (task.recurrence === "daily") {
      newDueDate.setDate(newDueDate.getDate() + 1);
    } else if (task.recurrence === "weekly") {
      newDueDate.setDate(newDueDate.getDate() + 7);
    } else if (task.recurrence === "monthly") {
      newDueDate.setMonth(newDueDate.getMonth() + 1);
    }

    task.dueDate = newDueDate.toISOString().split("T")[0];
    task.nextDueDate = task.dueDate;  // Update the next due date
  }

  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Load Tasks on Page Load
document.addEventListener('DOMContentLoaded', renderTasks);
