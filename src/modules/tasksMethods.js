import { taskList } from './domElements.js';
import tasksData from './tasksData.js';

export default class TaskList {
  constructor() {
    this.data = Array.from(tasksData);
  }

  loadedTasks() {
    let liH = '';
    this.data.forEach((e) => {
      liH += `<li class="tasks" data-index=${e.index}><input type="checkbox" ${e.completed ? 'checked' : ''} value="${e.description}"><p class="task-description ${e.completed ? 'stk-tru' : ''}">${e.description}</p><i class="fa fa-ellipsis-v edit-task-btn"></i><i class="fa fa-trash delete-task-btn dsp-none"></i></li>`;
    });
    taskList.innerHTML = liH;
  }

  createTasklist(descp) {
    const liH = `<li class="tasks" data-index=${this.data.length ? this.data.at(-1).index + 1 : 1}><input type="checkbox" value="${descp}"><p class="task-description">${descp}</p><i class="fa fa-ellipsis-v edit-task-btn"></i><i class="fa fa-trash delete-task-btn dsp-none"></i></li>`;
    taskList.insertAdjacentHTML('beforeend', liH);
    this.data.push(
      {
        description: descp,
        completed: false,
        index: this.data.length ? this.data.at(-1).index + 1 : 1,
      },
    );
    const tmp = JSON.stringify(this.data);
    localStorage.setItem('todoTasks', tmp);
  }

  modifyTask(tar) {
    const parentElem = tar.parentElement;
    const taskDescription = parentElem.querySelector('.task-description');

    parentElem.style.background = 'palegoldenrod';
    taskDescription.setAttribute('contenteditable', true);
    taskDescription.focus();

    const copyData = this.data;

    function taskDescptive(e) {
      // Toggling delete icon
      function toggleD(e) {
        if (e.target !== tar.nextSibling) {
          tar.classList.toggle('dsp-none');
          tar.nextSibling.classList.toggle('dsp-none');
        }
        document.removeEventListener('click', toggleD);
      }

      document.addEventListener('click', toggleD);

      e.target.removeAttribute('contenteditable');
      parentElem.style.background = 'white';

      // Editing description in array
      const indexNombre = Number(parentElem.getAttribute('data-index'));

      for (let i = 0; i < copyData.length; i += 1) {
        if (copyData[i].index === indexNombre) {
          copyData[i].description = taskDescription.textContent;
        }
      }

      // Updating value for checkbox
      parentElem.querySelector('input').value = taskDescription.textContent;

      // Updating local storage
      const tmp = JSON.stringify(copyData);
      localStorage.setItem('todoTasks', tmp);

      taskDescription.removeEventListener('focusout', taskDescptive);
    }

    taskDescription.addEventListener('focusout', taskDescptive);
  }

  deleteTask(par) {
    const indexNombre = Number(par.getAttribute('data-index'));

    par.remove();

    // Deleting task from array
    if (this.data.at(-1).index === indexNombre) {
      this.data.pop();
    } else {
      for (let i = 0; i < this.data.length; i += 1) {
        if (this.data[i].index === indexNombre) {
          for (let j = i; j < this.data.length - 1; j += 1) {
            this.data[j] = this.data[j + 1];
            this.data[j].index -= 1;
          }
          this.data.pop();
        }
      }
    }

    // Displaying updated data
    this.loadedTasks();

    // Updating local storage
    const tmp = JSON.stringify(this.data);
    localStorage.setItem('todoTasks', tmp);
  }

  // Update tasks complete status
  updateTaskStat(ind) {
    for (let i = 0; i < this.data.length; i += 1) {
      if (this.data[i].index === ind) {
        this.data[i].completed = !this.data[i].completed;
        break;
      }
    }
    const tmp = JSON.stringify(this.data);
    localStorage.setItem('todoTasks', tmp);
  }

  // Clear completed task from the list
  clearDoneTask() {
    this.data = this.data.filter((e) => !e.completed);

    // Updating index of data array
    for (let i = 0; i < this.data.length; i += 1) {
      this.data[i].index = i + 1;
    }

    // Updating local storage
    const tmp = JSON.stringify(this.data);
    localStorage.setItem('todoTasks', tmp);

    // Updating user interface
    this.loadedTasks();
  }
}