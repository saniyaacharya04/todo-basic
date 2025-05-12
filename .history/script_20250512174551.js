let tasks = [];

// Theme toggle logic
const toggleButton = document.getElementById("theme-toggle");
toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleButton.textContent = document.body.classList.contains("dark-mode") ? "Switch to Light Mode" : "Switch to Dark Mode";
});

// Add task
document.getElementById("add-task").addEventListener("click", addTask);

function addTask() {
    const taskInput = document.getElementById("task-input");
    const noteInput = document.getElementById("task-notes");
    const dueInput = document.getElementById("due-date");
    const priorityInput = document.getElementById("priority");
    const categoryInput = document.getElementById("category");

    const taskText = taskInput.value.trim();
    const taskNotes = noteInput.value.trim();
    const dueDate = dueInput.value;
    const priority = priorityInput.value;
    const categories = categoryInput.value.split(",").map(category => category.trim()).filter(Boolean);

    // Task Text Validation
    if (taskText === "") {
        alert("Task text cannot be empty.");
        return;
    }

    tasks.push({
        text: taskText,
        notes: taskNotes,
        dueDate,
        priority,
        categories,
        completed: false
    });

    taskInput.value = "";
    noteInput.value = "";
    dueInput.value = "";
    priorityInput.value = "Medium";
    categoryInput.value = ""; // Reset category input

    saveTasks();
    renderTasks();
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
        tasks = savedTasks;
    }
}

// Render tasks
function renderTasks() {
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
            taskTitle.classList.add("text-decoration-line-through", "text-muted");
        }

        const taskNotes = task.notes ? `<small class="text-muted">Notes: ${task.notes}</small>` : "";
        const details = document.createElement("small");
        details.className = "text-muted";
        details.innerHTML = `Due: ${task.dueDate || "N/A"} | Priority: ${task.priority} | Categories: ${task.categories.join(", ")} ${taskNotes}`;

        left.append(taskTitle, details);

        const priorityClass = task.priority.toLowerCase();

        const right = document.createElement("div");
        right.className = "mt-2 mt-md-0 d-flex gap-2";

        const completeBtn = document.createElement("button");
        completeBtn.className = `btn btn-sm ${task.completed ? "btn-success" : "btn-outline-success"}`;
        completeBtn.textContent = task.completed ? "Done" : "Complete";
        completeBtn.onclick = () => toggleComplete(index);

        const editBtn = document.createElement("button");
        editBtn.className = `btn btn-sm btn-${priorityClass}`;
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editTask(index);

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-sm btn-outline-danger";
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteTask(index);

        right.append(completeBtn, editBtn, delBtn);

        li.style.backgroundColor = getPriorityColor(task.priority);
        li.append(left, right);
        taskList.appendChild(li);
    });

    updateCategoryFilter();
}

// Helper function to get color based on priority
function getPriorityColor(priority) {
    switch (priority) {
        case "Critical":
            return "#FFCCCC"; // Red
        case "High":
            return "#FFEB99"; // Orange
        case "Medium":
            return "#A8D8FF"; // Blue
        case "Low":
            return "#D0F8C0"; // Green
        default:
            return "#FFFFFF"; // Default white
    }
}

// Helper function to get the countdown time left
function getCountdown(deadline) {
    const now = new Date();
    const timeLeft = deadline - now;
    if (timeLeft <= 0) return "Expired";
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
}

// Toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Edit task
function editTask(index) {
    const task = tasks[index];
    document.getElementById("task-input").value = task.text;
    document.getElementById("task-notes").value = task.notes;
    document.getElementById("due-date").value = task.dueDate;
    document.getElementById("priority").value = task.priority;
    document.getElementById("category").value = task.categories.join(", ");
    deleteTask(index);
}

// Update category filter (not implemented yet)
function updateCategoryFilter() {
    // Logic to filter tasks by categories
}

// Load tasks on page load
window.onload = function () {
    loadTasks();
    renderTasks();
};
