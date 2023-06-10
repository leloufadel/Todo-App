import './style.css';
import TaskList from './modules/tasksMethods.js';
import {
  taskList, addForm, clearList,
} from './modules/domElements.js';

const apptodolist = new TaskList();

window.addEventListener('DOMContentLoaded', () => {
  apptodolist.loadedTasks();
});

// Add task event listener
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  apptodolist.createTasklist(e.target.taskDescp.value);
  e.target.taskDescp.value = '';
});
// Toggle edit function
taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-task-btn')) {
    apptodolist.modifyTask(e.target);
    e.target.classList.toggle('dsp-none');
    e.target.nextSibling.classList.toggle('dsp-none');
  } else if (e.target.classList.contains('delete-task-btn')) {
    apptodolist.deleteTask(e.target.parentElement);
  }
});

// Task checkbox change event

taskList.addEventListener('change', (e) => {
  if (e.target.tagName === 'INPUT') {
    e.target.nextSibling.classList.toggle('stk-tru');
    apptodolist.updateTaskStat(Number(e.target.parentElement.getAttribute('data-index')));
  }
});

// Clear list event listener

clearList.addEventListener('click', () => {
  apptodolist.clearDoneTask();
});
