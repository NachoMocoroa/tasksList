var tasksList = (function() {
  var self = this,
    module = {

      noTasksDiv  : document.querySelector('.js-no-tasks'),
      tasksDiv    : document.querySelector('.js-tasks'),
      form        : document.querySelector('#task-form'),
      taskList    : document.querySelector('.collection'),
      clearBtn    : document.querySelector('.clear-tasks'),
      filter      : document.querySelector('#filter'),
      taskInput   : document.querySelector('#task'),

      filterTasks: function(e) {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll('.collection-item').forEach(function(task){
          const item = task.firstChild.textContent;
          if(item.toLowerCase().indexOf(text) != -1){
            task.style.display = 'block';
          } else {
            task.style.display = 'none';
          }
        });
      },
      clearTasksFromLocalStorage: function() {
        localStorage.clear();
      },
      clearTasks: function() {
        while(module.taskList.firstChild) {
          module.taskList.removeChild(module.taskList.firstChild);
        }
        module.noTasksDiv.style.display = 'block';
        module.tasksDiv.style.display = 'none';
        module.clearTasksFromLocalStorage();
      },
      removeTaskFromLocalStorage: function(taskItem) {
        let tasks = module.returnTasks();
        tasks.forEach(function(task, index){
          if(taskItem.textContent === task){
            tasks.splice(index, 1);
          }
        });
        if (tasks.length === 0) {
          module.clearTasks();
        } else {
          localStorage.setItem('tasks', JSON.stringify(tasks));
        }
      },
      removeTask: function(e) {
        if(e.target.parentElement.classList.contains('delete-item')) {
          if(confirm('Are You Sure?')) {
            e.target.parentElement.parentElement.remove();
            module.removeTaskFromLocalStorage(e.target.parentElement.parentElement);
          }
        }
      },
      storeTaskInLocalStorage: function(task) {
        let tasks = module.returnTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      },
      addTask: function(e) {
        if(module.taskInput.value === '') {
          alert('Add a task');
        } else {
          if (module.tasksDiv.style.display === 'none') {
            module.noTasksDiv.style.display = 'none';
            module.tasksDiv.style.display = 'block';
          }
          module.createTask(module.taskInput.value);
          module.storeTaskInLocalStorage(module.taskInput.value);
          module.taskInput.value = '';
        }
        e.preventDefault();
      },
      createTask: function(task) {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.appendChild(document.createTextNode(task));
        const link = document.createElement('a');
        link.className = 'delete-item secondary-content';
        link.innerHTML = '<i class="fa fa-remove"></i>';
        li.appendChild(link);
        module.taskList.appendChild(li);
      },
      getTasks: function() {
        let tasks = module.returnTasks();
        if (tasks.length > 0 && module.tasksDiv.style.display === 'none') {
          module.noTasksDiv.style.display = 'none';
          module.tasksDiv.style.display = 'block';
        }
        if (tasks.length > 0) {
          tasks.forEach(function(task){
            module.createTask(task);
          });
        }
      },
      returnTasks: function() {
        let t;
        if(localStorage.getItem('tasks') === null){
          t = [];
        } else {
          t = JSON.parse(localStorage.getItem('tasks'));
        }
        return t;
      },
      addListeners: function() {
        module.form.addEventListener('submit', module.addTask);
        module.taskList.addEventListener('click', module.removeTask);
        module.clearBtn.addEventListener('click', module.clearTasks);
        module.filter.addEventListener('keyup', module.filterTasks);
      },
      initUI: function() {
        module.tasksDiv.style.display = 'none';
        module.addListeners();
        module.getTasks();
      },
      init: function() {
        module.initUI();
        console.log('- tasksList initialized');
      }
  };
  return {
      init: module.init
  };
})();

document.addEventListener('DOMContentLoaded', tasksList.init());