function getTime() {
    let date = new Date();
    let hh = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();

    hh = (hh < 10) ? "0" + hh : hh;
    mm = (mm < 10) ? "0" + mm : mm;
    ss = (ss < 10) ? "0" + ss : ss;

    let time = hh + " : " + mm + " : " + ss;

    return time;
}

function currentTime() {
    const clock = document.getElementById('clock');

    let time = getTime();
    clock.innerText = time;

    setTimeout(() => {
        currentTime()
    }, 1000)
}

currentTime();

const dateDiv = document.getElementById('date');

function getDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day = (day < 10) ? "0" + day : day;
    month = (month < 10) ? "0" + month : month;

    let today = `${day} - ${month} - ${year}`;
    dateDiv.innerText = today;

    setTimeout(() => {
        getDate()
    }, 1000)
}

getDate();

const todo = document.getElementById('todo');
const todos = document.getElementById('todos');
const maxTodos = 6;
let currentTodos = 0;
let todoList = [];

function handleDelete() {
    let ul = this.parentElement.parentElement;
    let li = ul.firstElementChild;
    let index = todoList.findIndex((item) => item.todo === li.innerText);

    todoList.splice(index, 1);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    ul.remove();
    currentTodos--;

    if(currentTodos < maxTodos) {
        todo.disabled = false;
    }
    toggleNoTodosMsg();
}

function handleEdit() {
    let ul = this.parentElement.parentElement;
    let li = ul.querySelector('li');
    let index = todoList.findIndex((item) => item.todo === li.innerText);

    li.classList.add('hide');
    let liDiv = ul.querySelector('.li-div');

    let input = document.createElement('input');
    input.value = li.innerText;
    input.id = 'edit-todo';
    liDiv.appendChild(input);
    input.focus();

    let editBtn = ul.querySelector('button');
    editBtn.disabled = true;
    editBtn.id = 'disabled';

    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            let editTodo = input.value;

            if(editTodo === null) {
                return
            }

            if(editTodo.trim() === '') {
                alert('Todo cannot be empty');
                return
            }

            if(editTodo.length > 40) {
                alert('Todo should be less than 40 characters');
                return
            }

            todoList[index].todo = editTodo;
            localStorage.setItem('todoList', JSON.stringify(todoList));
            li.innerText = editTodo;

            li.classList.remove('hide');
            input.remove();

            editBtn.disabled = false;
            editBtn.id = '';
        } else if(e.key === 'Escape') {
            li.classList.remove('hide');
            input.remove();
            editBtn.disabled = false;
            editBtn.id = '';
        }
    })
}

todo.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        if(e.target.value.trim() === '') {
            return
        }
        if(e.target.value.length > 40) {
            alert('Todo should be less than 40 characters');
            return
        }
        
        if(currentTodos < maxTodos) {
            let myTodo = {
                todo: e.target.value,
                completed: false
            }
            todoList.push(myTodo);
            localStorage.setItem('todoList', JSON.stringify(todoList));

            let ul = document.createElement('ul');
            let li = document.createElement('li');
            let liDiv = document.createElement('div');
            let btnDiv = document.createElement('div');
            let editBtn = document.createElement('button');
            let deleteBtn = document.createElement('button');
            let checkbox = document.createElement('i');
            checkbox.addEventListener('click', handleCheckbox)

            li.innerText = myTodo.todo;
            btnDiv.className = 'btn-group';
            liDiv.className = 'li-div';
            checkbox.className = 'fa-regular fa-square';
            checkbox.id = 'checkbox';
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

            editBtn.addEventListener('click', handleEdit)
            deleteBtn.addEventListener('click', handleDelete)

            btnDiv.appendChild(editBtn);
            btnDiv.appendChild(deleteBtn);
            liDiv.appendChild(checkbox);
            liDiv.appendChild(li);
            ul.appendChild(liDiv);
            ul.appendChild(btnDiv);
            todos.appendChild(ul);

            todo.value = '';
            currentTodos++;

            if(currentTodos === maxTodos) {
                todo.disabled = true;
            }
            toggleNoTodosMsg();
        }
    }
})

const getitem = localStorage.getItem('todoList')

function toggleNoTodosMsg() {
    let noTodosMsg = document.getElementById('no-todos-msg');
    if(currentTodos > 0) {
        noTodosMsg.classList.add('hide');
    } else {
        noTodosMsg.classList.remove('hide');
    }
}

function checkTimeToRemoveTodos() {
    let time = getTime();

    if(time === '00 : 00 : 00') {
        localStorage.removeItem('todoList');
        todoList = [];
        todos.innerHTML = `<input type="text" id="todo" placeholder="My todos are...">`;
        todo.disabled = false;
        currentTodos = 0;
    }
    checkAllTodos();
}
setInterval(checkTimeToRemoveTodos, 1000);

if(getitem) {
    todoList = JSON.parse(getitem);
    currentTodos = todoList.length;
    toggleNoTodosMsg();

    todoList.forEach((item) => {
        let ul = document.createElement('ul');
        let li = document.createElement('li');
        let liDiv = document.createElement('div');
        let btnDiv = document.createElement('div');
        let editBtn = document.createElement('button');
        let deleteBtn = document.createElement('button');
        let checkbox = document.createElement('i');
        checkbox.addEventListener('click', handleCheckbox)
        
        li.innerText = item.todo;
        btnDiv.className = 'btn-group';
        liDiv.className = 'li-div';

        if(item.completed) {
            li.style.textDecoration = 'line-through';
            checkbox.className = 'fa-solid fa-check-square';
            editBtn.id = 'disabled';
            editBtn.disabled = true;
        } else {
            li.style.textDecoration = 'none';
            checkbox.className = 'fa-regular fa-square';
            editBtn.id = '';
            editBtn.disabled = false;
        }

        checkbox.id = 'checkbox';
        editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

        editBtn.addEventListener('click', handleEdit)
        deleteBtn.addEventListener('click', handleDelete)

        btnDiv.appendChild(editBtn);
        btnDiv.appendChild(deleteBtn);
        liDiv.appendChild(checkbox);
        liDiv.appendChild(li);
        ul.appendChild(liDiv);
        ul.appendChild(btnDiv);
        todos.appendChild(ul);
    })

    if(currentTodos === maxTodos) {
        todo.disabled = true;
    }
}

function handleCheckbox() {
    let icon = this;
    let ul = icon.parentElement.parentElement;
    let editBtn = ul.getElementsByClassName('btn-group')[0].firstElementChild;
    let li = ul.querySelector('li');
    let index = todoList.findIndex((item) => item.todo === li.innerText);

    if(icon.classList.contains('fa-square')) {
        todoList[index].completed = true;
        localStorage.setItem('todoList', JSON.stringify(todoList));
        icon.classList = 'fa-solid fa-check-square';
        li.style.textDecoration = 'line-through';
        editBtn.id = 'disabled';
        editBtn.disabled = true;
    } else {
        todoList[index].completed = false;
        localStorage.setItem('todoList', JSON.stringify(todoList));
        icon.classList = 'fa-regular fa-square';
        li.style.textDecoration = 'none';
        editBtn.id = '';
        editBtn.disabled = false;
    }
}

function checkAllTodos() {
    if(todoList.length === 0) {
        confettiBtn.className = 'hide';
    }
    else if (todoList.every(todo => todo.completed)) {
        confettiBtn.className = '';
    } else {
        confettiBtn.className = 'hide';
    }
}

let time = document.getElementById('time')

let focusSession = document.getElementById('focus-session');
let countdown = document.getElementById('countdown');
let pause = document.getElementById('pause');
let reset = document.getElementById('reset');

const focusBtn = document.getElementsByClassName('focus-btn')[0];
const breakBtn = document.getElementsByClassName('break-btn')[0];

let sessionState = 'focus';

function updateLocalStorage() {
    localStorage.setItem('pomodoroState', JSON.stringify({
        sessionState: sessionState
    }))
}

window.onload = () => {
    let pomodoroState = JSON.parse(localStorage.getItem('pomodoroState'));
    
    if(pomodoroState.sessionState === 'break') {
        breakBtn.id = 'active-btn';
        focusBtn.id = '';
        time.innerHTML = 5;
        sessionState = 'break';
    }
}

breakBtn.addEventListener('click', () => {
    breakBtn.id = 'active-btn';
    focusBtn.id = '';
    time.innerHTML = 5;
    sessionState = 'break';
    updateLocalStorage();
})

focusBtn.addEventListener('click', () => {
    breakBtn.id = '';
    focusBtn.id = 'active-btn';
    time.innerHTML = 25;
    sessionState = 'focus';
    updateLocalStorage();
})

function resetTimer() {
    clearInterval(focusInterval);
    if(sessionState === 'focus') {
        focusTime = 25 * 60;
    } else {
        focusTime = 5 * 60;
    }
    updateTimer(focusTime);
    pause.id = 'pause';
    pause.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    toggleHide();
}

function updateTimer(time) {
    let mins = Math.floor(time / 60);
    let secs = time % 60;

    mins = (mins < 10) ? "0" + mins : mins;
    secs = (secs < 10) ? "0" + secs : secs;
    countdown.innerText = `${mins}:${secs}`;
}

function togglePause() {
    reset.classList.toggle('hide');
    if(countdown.classList[0] === 'focus') {
        clearInterval(focusInterval);

        if(pause.id === 'pause') {
            pause.id = 'play';
            pause.innerHTML = `<i class="fa-solid fa-play"></i>`;
        } else {
            focusInterval = setInterval(() => {
                focusTime--;
                updateTimer(focusTime);

                if(focusTime === 0) {
                    clearInterval(focusInterval);
                    updateTimer(parseInt(time.innerText) * 60);
                    if(sessionState === 'focus') {
                        focusTime = 25 * 60;
                    } else {
                        focusTime = 5 * 60;
                    }
                    toggleHide();
                    notificationSound.play();
                }
            }, 1000)
            pause.id = 'pause';
            pause.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        }
    }
}

let timeSection = document.getElementsByClassName('time-section')[0];
let countdownSection = document.getElementsByClassName('countdown-section')[0];

function toggleHide() {
    timeSection.classList.toggle('hide');
    countdownSection.classList.toggle('hide');
}

let focusTime, focusInterval;
const notificationSound = document.getElementById('notificationSound')

focusSession.addEventListener('click', () => {
    reset.classList.add('hide');
    toggleHide();

    if(sessionState === 'focus') {
        focusTime = 25 * 60;
    } else {
        focusTime = 5 * 60;
    }
    updateTimer(focusTime);

    reset.addEventListener('click', resetTimer);
    pause.addEventListener('click', togglePause);

    focusInterval = setInterval(() => {
        countdown.classList.add('focus');
        focusTime--;
        updateTimer(focusTime);

        if(focusTime === 0) {
            clearInterval(focusInterval);
            updateTimer(parseInt(time.innerText) * 60);
            if(sessionState === 'focus') {
                focusTime = 25 * 60;
            } else {
                focusTime = 5 * 60;
            }
            toggleHide();
            notificationSound.play();
        }
    }, 1000);
})

const confettiBtn = document.getElementById('confetti-btn');
confettiBtn.addEventListener('click', () => {
    confettiBtn.disabled = true;

    setTimeout(() => {
        confettiBtn.disabled = false;
    }, 4000);

    var count = 200;
    var defaults = {
    origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
    confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
    });
    }

    fire(0.25, {
    spread: 26,
    startVelocity: 55,
    });
    fire(0.2, {
    spread: 60,
    });
    fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
    });
    fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
    });
    fire(0.1, {
    spread: 120,
    startVelocity: 45,
    });
})