const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

// Modals
const addTimerModal = new bootstrap.Modal(document.getElementById('addTimerModal'));
const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
const duplicateTaskModal = new bootstrap.Modal(document.getElementById('duplicateTaskModal'));
const taskLimitModal = new bootstrap.Modal(document.getElementById('taskLimitModal'));

// Inputs from modals
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const editTaskNameInput = document.getElementById('editTaskNameInput');
const editHoursInput = document.getElementById('editHoursInput');
const editMinutesInput = document.getElementById('editMinutesInput');
const editSecondsInput = document.getElementById('editSecondsInput');

// Modal buttons
const confirmAddTimerButton = document.getElementById('confirmAddTimerButton');
const confirmEditTaskButton = document.getElementById('confirmEditTaskButton');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');

// Global variables
let taskCount = 0;
let currentTask = null;
let interval;
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize tasks from localStorage
function loadTasks() {
    tasks.forEach((task) => addTaskToDOM(task));
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
addTaskButton.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    if (!taskName) return;

    // Verificar se a tarefa já existe
    const isDuplicate = tasks.some(task => task.name.toLowerCase() === taskName.toLowerCase());
    if (isDuplicate) {
        duplicateTaskModal.show(); // Exibe o modal se for duplicada
        return;
    }

    // Verificar se o número de tarefas já atingiu o limite de 10
    if (tasks.length >= 10) {
        taskLimitModal.show(); // Exibe o modal de limite de tarefas
        return;
    }

    // Continue com a criação da tarefa
    currentTask = { name: taskName };
    addTimerModal.show();
});

// Confirm timer and add task
confirmAddTimerButton.addEventListener('click', () => {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;

    const timeLimit = hours * 3600 + minutes * 60 + seconds;
    if (timeLimit <= 0) {
        alert('Tempo inválido. Defina pelo menos 1 segundo.');
        return;
    }

    currentTask.time = timeLimit;
    currentTask.initialTime = timeLimit; // Store the initial time for reset
    addTaskToDOM(currentTask);
    tasks.push(currentTask);
    saveTasks();

    taskInput.value = '';
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
    addTimerModal.hide();
});

function addTaskToDOM(task) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'flex-column');

    // Task header with name and time
    const taskHeader = document.createElement('div');
    taskHeader.classList.add('d-flex', 'justify-content-between', 'align-items-center');

    const taskName = document.createElement('span');
    taskName.textContent = task.name;

    const taskTime = document.createElement('span');
    taskTime.textContent = formatTime(task.time);

    taskHeader.appendChild(taskName);
    taskHeader.appendChild(taskTime);
    listItem.appendChild(taskHeader);

    // Progress bar
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress', 'my-2');

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.setAttribute('role', 'progressbar');
    progressBar.style.width = '100%';
    progressBar.textContent = '0%';

    progressBarContainer.appendChild(progressBar);
    listItem.appendChild(progressBarContainer);

    // Action buttons
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('btn-group', 'justify-content-end');

    // Start/Stop button
    const startStopButton = document.createElement('button');
    startStopButton.classList.add('btn', 'btn-success');
    startStopButton.textContent = 'Começar';
    startStopButton.addEventListener('click', () => {
        if (task.time > 0) {
            if (startStopButton.textContent === 'Começar') {
                startTimer(task, taskTime, startStopButton, progressBar);
                startStopButton.textContent = 'Parar';
            } else {
                clearInterval(interval);
                startStopButton.textContent = 'Começar';
            }
        }
    });
    actionButtons.appendChild(startStopButton);

    // Edit button
    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-warning');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => editTask(task, taskTime));
    actionButtons.appendChild(editButton);

    // Reset button
    const resetButton = document.createElement('button');
    resetButton.classList.add('btn', 'btn-info');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => {
        resetTask(task, taskTime);
        progressBar.style.width = '100%';
        progressBar.textContent = '0%';
    });
    actionButtons.appendChild(resetButton);

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => {
        confirmDeleteModal.show();
        confirmDeleteButton.addEventListener('click', () => {
            taskList.removeChild(listItem);
            tasks = tasks.filter((t) => t !== task);
            saveTasks();
            confirmDeleteModal.hide();
        }, { once: true });
    });
    actionButtons.appendChild(deleteButton);

    listItem.appendChild(actionButtons);
    taskList.appendChild(listItem);
    taskCount++;
}

function startTimer(task, taskTime, startStopButton, progressBar) {
    // Inicia o intervalo do timer
    interval = setInterval(() => {
        if (task.time > 0) {
            task.time--; // Reduz o tempo a cada segundo
            taskTime.textContent = formatTime(task.time);

            // Atualiza a barra de progresso da esquerda para a direita, partindo de 0%
            const progressPercent = Math.min(100, ((task.initialTime - task.time) / task.initialTime) * 100);

            // Atualiza visualmente a barra de progresso
            progressBar.style.width = `${progressPercent}%`;
            progressBar.innerHTML = `<div style="color: black; position: absolute; width: 100%; text-align: center;">${Math.round(progressPercent)}%</div>`;
        } else {
            clearInterval(interval); // Para o intervalo quando o tempo chega a 0
            taskTime.textContent = 'Tempo Esgotado';
            startStopButton.textContent = 'Começar';
            progressBar.style.width = '100%';
            progressBar.innerHTML = `<div style="color: black; position: absolute; width: 100%; text-align: center;">100%</div>`;
        }
    }, 1000);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function editTask(task, taskTime) {
    editTaskNameInput.value = task.name;
    editHoursInput.value = Math.floor(task.time / 3600);
    editMinutesInput.value = Math.floor((task.time % 3600) / 60);
    editSecondsInput.value = task.time % 60;

    currentTask = task;
    editTaskModal.show();

    confirmEditTaskButton.addEventListener('click', () => {
        const name = editTaskNameInput.value.trim();
        const hours = parseInt(editHoursInput.value) || 0;
        const minutes = parseInt(editMinutesInput.value) || 0;
        const seconds = parseInt(editSecondsInput.value) || 0;

        const newTime = hours * 3600 + minutes * 60 + seconds;
        task.name = name;
        task.time = newTime;
        task.initialTime = newTime;

        taskTime.textContent = formatTime(task.time);
        saveTasks();
        editTaskModal.hide();
    }, { once: true });
}

function resetTask(task, taskTime) {
    task.time = task.initialTime;
    taskTime.textContent = formatTime(task.time);
    saveTasks();
}

// Load tasks on page load
loadTasks();
