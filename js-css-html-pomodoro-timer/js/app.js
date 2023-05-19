const taskContainer = document.querySelector('.task-container');
const submitButton = document.querySelector('.submit-button');
const timeLeftDispaly = document.querySelector('#time-left');
const sliderFill = document.querySelector('.fill');

const startCount = 25 * 60;
let timeLeft = startCount;
let timerId;

let tasks = [
  {
    name: 'Practice CSS Animations',
    priority: 1,
  },
  {
    name: 'Dev Community Work',
    priority: 4,
  },
  {
    name: 'Algorithm Studies',
    priority: 3,
  },
];

// Sort by priority
const decendingTasks = tasks.sort(
  (taskA, taskB) => taskA.priority - taskB.priority
);

function convertToMin(secondsLeft) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft - minutes * 60;
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function handleClick(button) {
  switch (button.textContent) {
    case 'ACTIVE':
      button.textContent = 'PAUSED';
      clearInterval(timerId);
      break;
    case 'PAUSED':
      button.textContent = 'ACTIVE';
      countDown(button);
      break;
    default:
      const allButtons = document.querySelectorAll('.controller-button');
      allButtons.forEach(button => {
        button.textContent = 'START';
        button.classList.remove('active-button');
        clearInterval(timerId);
        timeLeft = startCount;
        timeLeftDispaly.textContent = convertToMin(timeLeft);
      });
      button.textContent = 'ACTIVE';
      button.classList.add('active-button');
      countDown(button);
      break;
  }
}

function countDown(button) {
  timerId = setInterval(() => {
    timeLeft--;
    timeLeftDispaly.textContent = convertToMin(timeLeft);
    sliderFill.style.width = (timeLeft / startCount) * 100 + '%';
    if (timeLeft <= 0) {
      clearInterval(timerId);
      delete decendingTasks[button.id];
      button.parentNode.remove();
      timeLeft = startCount;
      timeLeftDispaly.textContent = convertToMin(timeLeft);
    }
  }, 1000);
}

function render() {
  decendingTasks.forEach((task, index) => {
    const taskBlock = document.createElement('div');
    const deleteIcon = document.createElement('p');
    const taskTitle = document.createElement('p');
    const controller = document.createElement('button');

    taskBlock.classList.add('task-block');
    deleteIcon.classList.add('delete-icon');
    taskTitle.classList.add('task-title');
    controller.classList.add('controller-button');

    deleteIcon.textContent = '✖';
    taskTitle.textContent = task.name;
    controller.textContent = 'START';

    controller.setAttribute('id', index);

    deleteIcon.addEventListener('click', deleteTask);
    controller.addEventListener('click', () => handleClick(controller));

    taskBlock.append(deleteIcon, taskTitle, controller);
    taskContainer.append(taskBlock);
  });
}

render();

function deleteTask(e) {
  e.target.parentNode.remove();
  delete decendingTasks[e.target.parentNode.lastChild.id];
}

function addTask() {
  const inputElement = document.querySelector('input');
  const value = inputElement.value;
  if (value) {
    taskContainer.innerHTML = '';
    tasks.push({
      name: value,
      priority: tasks.length,
    });
    render();
    inputElement.value = '';
  }
}

submitButton.addEventListener('click', addTask);
