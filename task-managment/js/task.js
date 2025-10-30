let tasks = getTasks();
let currentFilter = 'all';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    updateStats();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Add task form
    document.getElementById('taskForm').addEventListener('submit', addTask);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });
    
    // Search functionality
    document.getElementById('searchTask').addEventListener('input', function(e) {
        renderTasks(e.target.value);
    });
}

// Add new task
function addTask(e) {
    e.preventDefault();
    
    const task = {
        id: generateId(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        date: document.getElementById('taskDate').value,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks(tasks);
    renderTasks();
    updateStats();
    
    // Reset form
    document.getElementById('taskForm').reset();
    alert('Task added successfully!');
}

// Render tasks to DOM
function renderTasks(searchTerm = '') {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    let filteredTasks = tasks;
    
    // Apply status filter
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === currentFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<p style="text-align:center; color:#666;">No tasks found</p>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskCard = `
            <div class="task-card">
                <div class="task-header">
                    <h4 class="task-title">${task.title}</h4>
                    <div class="task-badges">
                        <span class="badge ${task.priority}">${task.priority}</span>
                        <span class="badge ${task.status}">${task.status}</span>
                    </div>
                </div>
                <p class="task-description">${task.description || 'No description'}</p>
                <div class="task-footer">
                    <span class="task-date"><i class="far fa-calendar"></i> ${task.date}</span>
                    <div class="task-actions">
                        <button class="btn-edit" onclick="editTask('${task.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="deleteTask('${task.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        tasksList.innerHTML += taskCard;
    });
}

// Update statistics
function updateStats() {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('pendingTasks').textContent = 
        tasks.filter(t => t.status === 'pending').length;
    document.getElementById('inProgressTasks').textContent = 
        tasks.filter(t => t.status === 'in-progress').length;
    document.getElementById('completedTasks').textContent = 
        tasks.filter(t => t.status === 'completed').length;
}

// Delete task
// Delete task; pass skipConfirm=true to remove without prompting (used when loading for edit)
function deleteTask(id, skipConfirm = false) {
    if (skipConfirm || confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        renderTasks();
        updateStats();
    }
}

// Edit task (simplified version - you can enhance this)
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskDate').value = task.date;
        
        // Delete old task and add updated one
        // remove the task silently when preparing an edit (no confirmation)
        deleteTask(id, true);
        
        alert('Task loaded for editing. Make changes and click Add Task.');
    }
}
