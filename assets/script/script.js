let todoApp = document.querySelector(".todo-app")
let addTodoInput = document.querySelector(".new-todo");
let todoListElement = document.querySelector(".todo-list");

/*
Status
1 => pending
2 => completed
3 => deleted
*/
let editingState = {
  status : 1, // 1:- Not editing 2:- Editing
  todoId : 0 // 0:- none
};
let todos = [
  { 
    id: 1,
    name: "something 1",
    status: 2
  }, { 
    id: 2,
    name: "something 2",
    status: 1
  }
];

let getToDoIndexById = (id) => todos.findIndex((todo) => todo.id === id);

let lastId = () => todos.reduce((acc, value) => Math.max(acc, value.id), 0);

let getActiveTodos = _ => todos.filter((todo) => todo.status === 1);

let getCompletedTodos = _ => todos.filter((todo) => todo.status === 2);

let deleteFromToDo = (id) => {
  let todoIndex = todos.findIndex((todo) => todo.id === id);
  if(todoIndex !== -1){
    todos.splice(todoIndex, 1);
  }
  refreshToDoList();
}

let toggleSelectAll = () => {
  let currentToggleState = todos.reduce((accum, todo) => (todo.status !== 2) ? false : accum , true) 
  if(currentToggleState === true) {
    todos = todos.map((todo) => (todo.status = 1) && todo );
  } else {
    todos = todos.map((todo) => (todo.status = 2) && todo );
  }
  refreshToDoList();
}

let changeStatus = (id) => {
  let todoIndex = todos.findIndex((todo) => todo.id === id);
  if(todoIndex !== -1){
    todos[todoIndex].status = (todos[todoIndex].status === 1) ? 2 : 1;
  }
}

let saveCurrentEditingToDo = () => {
  if(editingState.status === 2) {
    // a todo is currently being Editing
    let todoId = editingState.todoId;
    let todoIndex = getToDoIndexById(todoId);

    let todo = document.querySelector(`li[data-id="${todoId}"] > div`);
    todo.classList.remove("editing");

    let newTodoValue = document.querySelector(`li[data-id="${todoId}"] .input-edit`).value;
    todos[todoIndex].name = newTodoValue;

    editingState = {
      status : 1, // 1:- Not editing 2:- Editing
      todoId : 0 // 0:- none
    };

    refreshToDoList();

  }
}

let editToDo = (id) => {
  saveCurrentEditingToDo(); // Save a todo which is currently being edited


  let todo = document.querySelector(`li[data-id="${id}"] > div`);
  let todoIndex = getToDoIndexById(id);
  console.log(todo)
  todo.classList.add("editing");

  document.querySelector(`li[data-id="${id}"] .input-edit`).value = todos[todoIndex].name;

  editingState.status = 2;
  editingState.todoId = id;
}

let showTodos = (todoListElement, filteredArray) => {
  
  todoListElement.innerHTML = "";
  
  filteredArray.forEach(todo => {
  //   <li data-id="1">
  //   <div class="todo completed">
  //     <label class="check-container">
  //       <input class="completed" type="checkbox">
  //       <span class="checkbox-status"><i class="fas fa-check"></i></span>
  //     </label>
  //     <label class="todo-name">Something</label>
  //     <button class="delete"><i class="fas fa-times"></i></button>
  //     <input class="input-edit" type="text">
  //   </div>
  // </li>
    
    let liElement = document.createElement("li");
    liElement.setAttribute('data-id', todo.id);

    let divElement = document.createElement("div");
    divElement.classList.add("todo");
    
    if(todo.status === 2) {
      divElement.classList.add("completed");
    }
    
    let labelElement1 = document.createElement("label");
    labelElement1.classList.add("check-container");
    
    let checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.classList.add("todo-status");

    if(todo.status === 2) {
      checkboxElement.checked = true;
    }else{
      checkboxElement.checked = false;
    }
    
    let spanElement = document.createElement("span");
    spanElement.classList.add("checkbox-status");
    
    let iElement = document.createElement("i");
    iElement.classList.add("fas");
    iElement.classList.add("fa-check");
    
    spanElement.append(iElement);
    labelElement1.append(checkboxElement, spanElement);
    
    let labelElement2 = document.createElement("label");
    labelElement2.classList.add("todo-name")
    labelElement2.innerText = todo.name;
    
    let deleteButtonElement = document.createElement("button");
    deleteButtonElement.classList.add("delete");
    
    let iElement2 = document.createElement("i");
    iElement2.classList.add("fas");
    iElement2.classList.add("fa-times");

    deleteButtonElement.append(iElement2);

    let editElement = document.createElement("input");
    editElement.type = "text";
    editElement.classList.add("input-edit");

    divElement.append(labelElement1, labelElement2, deleteButtonElement, editElement);
    liElement.append(divElement);

    todoListElement.append(liElement);
  });
  
}

let refreshToDoList = () =>{
  let todoFilter = document.querySelector('input[name="filter-todo"]:checked');
  switch(todoFilter.value) {
    case "all": 
      showTodos(todoListElement, todos);
      break;
    case "active":
      showTodos(todoListElement, getActiveTodos());
      break;
    case "completed":
      showTodos(todoListElement, getCompletedTodos());
      break;  
  }
  let pendingCounter = document.querySelector(".todo-left-count > strong");
  pendingCounter.innerText = getActiveTodos().length;

  let checkAll = document.querySelector(".check-all");
  if(todos.length === 0){
    checkAll.classList.add("hidden");
  }else{
    checkAll.classList.remove("hidden");    
  }

}

let handleClick = (event) =>{
  
  // Check All toggle Listener
  if(event.target.tagName === "INPUT" && event.target.type === "checkbox" && event.target.id === "check-all-todo") {
    if(todos.length !== 0) {
      toggleSelectAll();
    }
  }

  // Toggle todo Status Listener
  if(event.target.tagName === "INPUT" && event.target.type === "checkbox" && event.target.classList.contains("todo-status")) {
    let id = Number(event.target.parentElement.parentElement.parentElement.dataset.id);
    changeStatus(id);
    refreshToDoList();
  }
  
  // Delete a Todo Listener
  if(event.target.tagName === "I"){
    if(event.target.parentElement.tagName === "BUTTON" && event.target.parentElement.classList.contains("delete")) {
      let id = Number(event.target.parentElement.parentElement.parentElement.dataset.id)
      deleteFromToDo(id);
    }
  }

  // Filter Listener
  if(event.target.tagName === "INPUT" && event.target.type === "radio") {
    refreshToDoList();
  }

  // Clear All Completed Listener
  if(event.target.tagName==="A" && event.target.classList.contains("clear-completed")){
    getCompletedTodos().forEach((todo) => deleteFromToDo(todo.id));
    refreshToDoList();
  } 
}

let handleKeyUp = (event) => {
  if(event.keyCode === 13 && event.target.tagName === "INPUT" && event.target.classList.contains("new-todo")){
    let newTodoValue = addTodoInput.value;
    
    if(newTodoValue.trim() !== ""){
      let newTodo = {
        id: lastId() + 1,
        name: newTodoValue,
        status: 1
      }
      todos.push(newTodo);
      refreshToDoList();

      addTodoInput.value = "";
    }

  }

  if(event.keyCode === 13 && event.target.tagName === "INPUT" &&  event.target.classList.contains("input-edit") && editingState.status === 2 && event.target.parentElement.parentElement.dataset.id == editingState.todoId) {
    saveCurrentEditingToDo();
  }
}

let handleDblClick = (event) => {
  console.log(event)
  if(event.target.tagName === "LABEL" && event.target.classList.contains("todo-name")){
    editToDo(Number(event.target.parentElement.parentElement.dataset.id));
    console.log(event.target.parentElement.parentElement.dataset.id);
  }
}

window.addEventListener("click", handleClick);
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("dblclick", handleDblClick);

refreshToDoList();