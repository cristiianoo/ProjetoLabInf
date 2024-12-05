const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

// Modais
const addTimerModal = new bootstrap.Modal(document.getElementById('addTimerModal'));
const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));

// Inputs do modal
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const editTaskNameInput = document.getElementById('editTaskNameInput');
const editHoursInput = document.getElementById('editHoursInput');
const editMinutesInput = document.getElementById('editMinutesInput');
const editSecondsInput = document.getElementById('editSecondsInput');

// Botões do modal
const confirmAddTimerButton = document.getElementById('confirmAddTimerButton');
const confirmEditTaskButton = document.getElementById('confirmEditTaskButton');
const resetTimerButton = document.getElementById('resetTimerButton');
const deleteTaskButton = document.getElementById('deleteTaskButton');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');

// Contador de tarefas
let taskCount = 0;

// Variáveis globais para edição e tempo esgotado
let currentTask = null;
let interval;

// Adicionar tarefa
addTaskButton.addEventListener('click', () => {
    if (taskCount >= 10) {
        alert('O limite de 5 tarefas foi atingido.');
        return;
    }

    if (!taskInput.value.trim()) return;
    currentTask = { name: taskInput.value.trim() };
    addTimerModal.show();
});

// Confirmar tempo ao adicionar
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
    currentTask.initialTime = timeLimit; // Armazena o tempo inicial para reset
    addTask(currentTask);
    taskInput.value = '';
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
    addTimerModal.hide();
});

function addTask(task) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.classList.add('d-flex');
    listItem.classList.add('justify-content-between');
    listItem.classList.add('align-items-center');

    // Exibe o nome da tarefa
    const taskName = document.createElement('span');
    taskName.textContent = task.name;
    listItem.appendChild(taskName);

    // Exibe o tempo restante formatado
    const taskTime = document.createElement('span');
    taskTime.textContent = formatTime(task.time);
    listItem.appendChild(taskTime);

    // Adiciona botões para editar, resetar e controlar o timer
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('btn-group');

    // Botão Começar/Parar
    const startStopButton = document.createElement('button');
    startStopButton.classList.add('btn');
    startStopButton.classList.add('btn-success');
    startStopButton.textContent = 'Começar';
    startStopButton.addEventListener('click', () => {
        if (task.time > 0) {
            if (startStopButton.textContent === 'Começar') {
                startTimer(task, taskTime, startStopButton);
                startStopButton.textContent = 'Parar';
            } else {
                clearInterval(interval);
                startStopButton.textContent = 'Começar';
            }
        }
    });
    actionButtons.appendChild(startStopButton);

    // Botão Editar
    const editButton = document.createElement('button');
    editButton.classList.add('btn');
    editButton.classList.add('btn-warning');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => {
        editTask(task, taskTime);
    });
    actionButtons.appendChild(editButton);
    
    // Botão Resetar
    const resetButton = document.createElement('button');
    resetButton.classList.add('btn');
    resetButton.classList.add('btn-info');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => {
        resetTask(task, taskTime);
    });
    actionButtons.appendChild(resetButton);
    
    // Botão Eliminar
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-danger');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => {
        confirmDeleteModal.show();
        confirmDeleteButton.addEventListener('click', () => {
            taskList.removeChild(listItem);
            confirmDeleteModal.hide();
        });
    });
    actionButtons.appendChild(deleteButton);

    listItem.appendChild(actionButtons);
    taskList.appendChild(listItem);
    taskCount++;  // Incrementa o contador de tarefas
}

function startTimer(task, taskTime, startStopButton, progressBar) {
    interval = setInterval(() => {
        if (task.time > 0) {
            task.time--;
            taskTime.textContent = formatTime(task.time);

            // Atualiza a barra de progresso
            const progressPercent = Math.max(0, (task.time / task.initialTime) * 100);
            progressBar.style.width = `${progressPercent}%`;
            progressBar.textContent = `${Math.round(progressPercent)}%`;
        } else {
            clearInterval(interval);
            taskTime.textContent = 'Tempo Esgotado';
            startStopButton.textContent = 'Começar';
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';
        }
    }, 1000);
}

function addTask(task) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'd-flex', 'flex-column');

    // Exibe o nome da tarefa
    const taskHeader = document.createElement('div');
    taskHeader.classList.add('d-flex', 'justify-content-between', 'align-items-center');
    const taskName = document.createElement('span');
    taskName.textContent = task.name;
    const taskTime = document.createElement('span');
    taskTime.textContent = formatTime(task.time);
    taskHeader.appendChild(taskName);
    taskHeader.appendChild(taskTime);
    listItem.appendChild(taskHeader);

    // Barra de progresso
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress', 'my-2');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.setAttribute('role', 'progressbar');
    progressBar.style.width = '100%'; // Começa com 100%
    progressBar.textContent = '100%';
    progressBarContainer.appendChild(progressBar);
    listItem.appendChild(progressBarContainer);

    // Botões de ação
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('btn-group', 'justify-content-end');

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

    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-warning');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => editTask(task, taskTime));
    actionButtons.appendChild(editButton);

    const resetButton = document.createElement('button');
    resetButton.classList.add('btn', 'btn-info');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => {
        resetTask(task, taskTime);
        progressBar.style.width = '100%';
        progressBar.textContent = '100%';
    });
    actionButtons.appendChild(resetButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => {
        confirmDeleteModal.show();
        confirmDeleteButton.addEventListener('click', () => {
            taskList.removeChild(listItem);
            confirmDeleteModal.hide();
        });
    });
    actionButtons.appendChild(deleteButton);

    listItem.appendChild(actionButtons);
    taskList.appendChild(listItem);
    taskCount++;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Função para editar tarefa
function editTask(task, taskTime) {
    editTaskNameInput.value = task.name;
    editHoursInput.value = Math.floor(task.time / 3600);
    editMinutesInput.value = Math.floor((task.time % 3600) / 60);
    editSecondsInput.value = task.time % 60;
    
    currentTask = task; // Define a tarefa a ser editada
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
        editTaskModal.hide();
    });
}

// Função para resetar tarefa
function resetTask(task, taskTime) {
    task.time = task.initialTime; // Reseta o tempo para o valor inicial
    taskTime.textContent = formatTime(task.time);
}