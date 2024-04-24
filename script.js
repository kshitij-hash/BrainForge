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
        }
    }
})

const getitem = localStorage.getItem('todoList')

function checkTimeToRemoveTodos() {
    let time = getTime();

    if(time === '00 : 00 : 00') {
        localStorage.removeItem('todoList');
        todoList = [];
        todos.innerHTML = `<input type="text" id="todo" placeholder="My todos are...">`;
        todo.disabled = false;
        currentTodos = 0;
    }
}
setInterval(checkTimeToRemoveTodos, 1000);


if(getitem) {
    todoList = JSON.parse(getitem);
    currentTodos = todoList.length;

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

let arrowUp = document.getElementById('increase')
let arrowDown = document.getElementById('decrease')
let time = document.getElementById('time')
let breakMsg = document.getElementById('break-msg')

function breakMessageUpdate(breaks) {
    if(breaks === 0) {
        breakMsg.innerText = `You'll have no breaks.`
    } else if(breaks === 1) {
        breakMsg.innerText = `You'll have ${breaks} break.`
    } else {
        breakMsg.innerText = `You'll have ${breaks} breaks.`
    }
}

function breakCalculator(time) {
    if(time <= 25) {
        breakMessageUpdate(0);
    } else if(time > 25 && time <= 50) {
        breakMessageUpdate(1);
    } else if(time > 50 && time <= 95) {
        breakMessageUpdate(2);
    } else {
        breakMessageUpdate(3);
    }
}

arrowUp.addEventListener('click', () => {
    if(time.innerText >= 110) {
        return
    }
    if(time.innerText < 50) {
        time.innerText = parseInt(time.innerText) + 5;
    } else {
        time.innerText = parseInt(time.innerText) + 15;
    }
    breakCalculator(time.innerText)
    countdown.innerText = `${time.innerText}:00`
})

arrowDown.addEventListener('click', () => {
    if(time.innerText <= 10) {
        return
    }
    if(time.innerText > 50) {
        time.innerText = parseInt(time.innerText) - 15;
    } else {
        time.innerText = parseInt(time.innerText) - 5;
    }
    breakCalculator(time.innerText)
    countdown.innerText = `${time.innerText}:00`
})

let focusSession = document.getElementById('focus-session');
let countdown = document.getElementById('countdown');
let pause = document.getElementById('pause');
let reset = document.getElementById('reset');

let focusInterval, focusTime, breakTime;

function resetTimer() {
    clearInterval(focusInterval);
    countdown.innerText = Math.ceil(focusTime / 60) + ":00";
    focusTime = parseInt(time.innerText) * 60;
    breakTime = 5 * 60;
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
    clearInterval(focusInterval);

    if(pause.id === 'pause') {
        pause.id = 'play';
        pause.innerHTML = `<i class="fa-solid fa-play"></i>`;
    } else {
        focusInterval = setInterval(() => {
            focusTime--;
            updateTimer(focusTime);
        }, 1000)
        pause.id = 'pause';
        pause.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    }
}

let timeSection = document.getElementsByClassName('time-section')[0];
let countdownSection = document.getElementsByClassName('countdown-section')[0];

function toggleHide() {
    timeSection.classList.toggle('hide');
    countdownSection.classList.toggle('hide');
}

focusSession.addEventListener('click', () => {
    reset.classList.add('hide');
    toggleHide();

    focusTime = parseInt(time.innerText) * 60;
    breakTime = 5 * 60;

    reset.addEventListener('click', resetTimer);
    pause.addEventListener('click', togglePause);

    focusInterval = setInterval(() => {
        focusTime--;
        updateTimer(focusTime);
    }, 1000);
})

const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const symbolChars = '~!@#$%^&*()_+{}[].,:;|';

const passwordDisplay = document.getElementById('passwordDisplay');
const generateButton = document.getElementById('generateButton');
const copyButton = document.getElementById('copyButton');
const lowercaseCheckbox = document.getElementById('lowercaseCheckbox');
const uppercaseCheckbox = document.getElementById('uppercaseCheckbox');
const numbersCheckbox = document.getElementById('numbersCheckbox');
const symbolsCheckbox = document.getElementById('symbolsCheckbox');
const passLength = document.getElementById('length');

passLength.addEventListener('change', () => {
    if(parseInt(passLength.value) < 8) {
        passLength.value = 8;
    } else if(parseInt(passLength.value) > 14) {
        passLength.value = 14;
    }
})

generateButton.addEventListener('click', generatePassword);
copyButton.addEventListener('click', copyPassword);

function generatePassword() {
    let chars = '';
    if (lowercaseCheckbox.checked) chars += lowercaseChars;
    if (uppercaseCheckbox.checked) chars += uppercaseChars;
    if (numbersCheckbox.checked) chars += numberChars;
    if (symbolsCheckbox.checked) chars += symbolChars;

    let password = '';
    const length = parseInt(passLength.value);
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    passwordDisplay.value = password;
}

function copyPassword() {
    copyButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    setTimeout(() => {
        copyButton.innerHTML = '<i class="fa-solid fa-copy"></i>';
    }, 5000);
    passwordDisplay.select();
    document.execCommand('copy');
}

let pgMsg = document.getElementById('pg-msg');

pgMsg.addEventListener('click', () => {
    generatePassword();
    let icon = pgMsg.firstElementChild;
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');

    let pgContent = pgMsg.nextElementSibling;
    pgContent.classList.toggle('hide');
})

const confettiBtn = document.getElementById('confetti-btn');
confettiBtn.addEventListener('click', () => {
    console.log('clicked')
})