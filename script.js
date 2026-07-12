// ==========================
// Select Elements
// ==========================

const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const dueDate = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskContainer = document.getElementById("taskContainer");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const taskCount = document.getElementById("taskCount");
const searchTask = document.getElementById("searchTask");
const filterTask = document.getElementById("filterTask");
const sortTask = document.getElementById("sortTask");
// ==========================
// Tasks Array
// ==========================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editTaskId = null;

// ==========================
// Add Task Button Event
// ==========================

addTaskBtn.addEventListener("click", addTask);
searchTask.addEventListener("input", renderTasks);
filterTask.addEventListener("change", renderTasks);
sortTask.addEventListener("change", renderTasks);

// ==========================
// Add Task Function
// ==========================

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {

        id: Date.now(),

        text: taskText,

        priority: priority.value,

        category: category.value,

        dueDate: dueDate.value,

        completed: false

    };

    if (editTaskId === null) {

    tasks.push(task);

} else {

    tasks = tasks.map(function(item) {

        if (item.id === editTaskId) {

            return {
                ...task,
                id: editTaskId,
                completed: item.completed
            };

        }

        return item;

    });

    editTaskId = null;

    addTaskBtn.textContent = "+ Add Task";

}

renderTasks();

updateStats();

taskInput.value = "";

priority.value = "High";

category.value = "Work";

dueDate.value = "";

taskInput.focus();

console.log(tasks);

}
// ==========================
// Render Tasks
// ==========================

function renderTasks() {

    taskContainer.innerHTML = "";

    const searchValue = searchTask.value.toLowerCase();

    let filteredTasks = tasks.filter(function(task){

    return task.text.toLowerCase().includes(searchValue);

});

if(filterTask.value === "active"){

    filteredTasks = filteredTasks.filter(function(task){

        return !task.completed;

    });

}

if(filterTask.value === "completed"){

    filteredTasks = filteredTasks.filter(function(task){

        return task.completed;

    });

}
// Sort by Date
if (sortTask.value === "date") {

    filteredTasks.sort(function(a, b) {

        return new Date(a.dueDate) - new Date(b.dueDate);

    });

}

// Sort by Priority
if (sortTask.value === "priority") {

    const priorityOrder = {

        High: 1,
        Medium: 2,
        Low: 3

    };

    filteredTasks.sort(function(a, b) {

        return priorityOrder[a.priority] - priorityOrder[b.priority];

    });

}

// Sort Alphabetically
if (sortTask.value === "alphabet") {

    filteredTasks.sort(function(a, b) {

        return a.text.localeCompare(b.text);

    });

}
filteredTasks.forEach(function(task){

            taskContainer.innerHTML += `

                <div class="task-card ${task.completed ? 'completed' : ''}">

                    <input
                        type="checkbox"
                        class="complete-checkbox"
                        ${task.completed ? "checked" : ""}
                        onchange="toggleTask(${task.id})"
                    >

                    <h3>${task.text}</h3>

                    <p>🔥 ${task.priority}</p>

                    <p>📂 ${task.category}</p>

                    <p>📅 ${task.dueDate}</p>

                    <button onclick="editTask(${task.id})" class="edit-btn">
                        ✏️ Edit
                    </button>

                    <button onclick="deleteTask(${task.id})" class="delete-btn">
                        🗑 Delete
                    </button>

                </div>

            `;

        });

}
// ==========================
// Update Statistics
// ==========================

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const remaining = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    remainingTasks.textContent = remaining;

    taskCount.textContent = `${total} Tasks`;

    // Progress Percentage
    const progress = total === 0 ? 0 : (completed / total) * 100;

    progressFill.style.width = progress + "%";

    progressText.textContent = Math.round(progress) + "%";
}
// ==========================
// Toggle Complete
// ==========================

function toggleTask(id){

    tasks = tasks.map(function(task){

        if(task.id === id){

            task.completed = !task.completed;

        }

        return task;

    });
saveTasks();
    renderTasks();

    updateStats();

}
// ==========================
// Delete Task
// ==========================

function deleteTask(id){

    tasks = tasks.filter(function(task){

        return task.id !== id;

    });
saveTasks();
    renderTasks();

    updateStats();

}
// ==========================
// Edit Task
// ==========================

function editTask(id){

    const task = tasks.find(function(task){

        return task.id === id;

    });

    taskInput.value = task.text;

    priority.value = task.priority;

    category.value = task.category;

    dueDate.value = task.dueDate;

    editTaskId = id;

    addTaskBtn.textContent = "💾 Update Task";

}
// ==========================
// Save Tasks
// ==========================

function saveTasks(){

    localStorage.setItem("tasks", JSON.stringify(tasks));

}
renderTasks();

updateStats();