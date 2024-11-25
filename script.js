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
    if (taskCount >= 5) {
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
    resetButton.textContent = 'Resetar';
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

    listItem.appendChild(actionButtons);
    taskList.appendChild(listItem);
    taskCount++;  // Incrementa o contador de tarefas
}

function startTimer(task, taskTime, startStopButton) {
    interval = setInterval(() => {
        if (task.time > 0) {
            task.time--;
            taskTime.textContent = formatTime(task.time);
        } else {
            clearInterval(interval);
            taskTime.textContent = 'Tempo Esgotado';
            startStopButton.textContent = 'Começar'; // Reinicia o botão
        }
    }, 1000);
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
