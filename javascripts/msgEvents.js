const AI = require('./AI.js');
const data = require('./data');
const printMessages = require('./dom.js').printMessages;
const editButton = document.getElementsByClassName('edit-button');
const grabInput = document.getElementById('input');
const clearMessagesBtn = document.getElementById('clearMessagesBtn');
let messageToEdit = [];

const timeStamp = () => {
  return new Date().toLocaleString();
};
const addSubmitEvent = () => {
  grabInput.addEventListener('keypress', submitMessage);
};
const addClearMessageEvent = () => {
  clearMessagesBtn.addEventListener('click', clearMessages);
};

const goshDarnDark = () => {

  const isChecked = document.getElementById('dark-theme').children[0].checked;
  const backgroundChange = document.getElementById('body-background');
  const daNavBar = document.getElementById('da-navbar');
  const labels = document.getElementsByTagName('label');
  const wells = document.getElementsByClassName('well');

  if (isChecked === true) {
    console.log('THIS IS HAPPENING');
    console.log('body: ', backgroundChange);
    backgroundChange.classList.remove('cheesy');
    backgroundChange.classList.add('stormy');
    daNavBar.classList.add('dark');
    for (let i = 0; i < labels.length; i++) {
      labels[i].classList.add('dark');
    }
    for (let j = 0; j < wells.length; j++) {
      wells[j].classList.add('dark');
    }
  } else if (isChecked === false) {
    console.log('FALSE IS HAPPENING');
    backgroundChange.classList.remove('stormy');
    backgroundChange.classList.add('cheesy');
    daNavBar.classList.remove('dark');
    for (let i = 0; i < labels.length; i++) {
      labels[i].classList.remove('dark');
    }
    for (let j = 0; j < wells.length; j++) {
      wells[j].classList.remove('dark');
    }
  }
};

const buildAlert = (alertDiv) => {
  let alertString = '';
  alertString += `<div class="alert alert-danger fade in" role="alert">`;
  alertString +=  `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
  alertString +=  `<span aria-hidden="true">&times;</span>`;
  alertString +=  `</button>`;
  alertString +=  `<strong>Woops!</strong> Looks like you still need to choose a user`;
  alertString += `</div>`;
  alertDiv.innerHTML = alertString;
};

const showAlert = () => {
  const alertDiv = document.getElementById('alert-div');
  if (alertDiv) {
    buildAlert(alertDiv);
  } else {
    const alertBox = document.createElement('div');
    alertBox.setAttribute('id', 'alert-div');
    const input = document.getElementById('input');
    buildAlert(alertBox);
    input.parentNode.appendChild(alertBox);
  }
};

const submitMessage = (e) => {
  const message = grabInput.value;
  const messageArray = data.getMessages();
  const userName = document.getElementById('selected-user')
    .previousElementSibling;
  if (e.keyCode === 13 && message && messageToEdit.id) {
    messageArray.forEach((item) => {
      if (item.id === messageToEdit.id) {
        item.message = message;
        item.timestamp = timeStamp();
      }
    });
    data.setMessages(messageArray);
    messageToEdit = [];
    grabInput.value = '';
    printMessages(messageArray);
    AI.grumpy(message);
    addEditEvent();
    addDeleteEvent();
  } else if (e.keyCode === 13 && message && (messageToEdit.id !== true) && userName.querySelector('.selected')) {
    const user = data.findUserByName(userName.querySelector('.selected')
      .querySelector('.text').innerHTML).id;
    const newMsg = new Message (user, message);
    data.addMessage(newMsg);
    grabInput.value = '';
    printMessages(messageArray);
    addEditEvent();
    addDeleteEvent();
    AI.grumpy(message);
  } else if (e.keyCode === 13 && message) {
    showAlert();
  }
  goshDarnDark();
};

const Message = (() => {
  let firstId = 6;
  return function Message (id, message) {
    this.id = 'item' + firstId++;
    this.userId = id;
    this.message = message;
    this.timestamp = timeStamp();
  };
})();

const clearMessages = (e) => {
  data.setMessages([]);
  printMessages([]);
  disableClearMessageBtn(e);
};

const disableClearMessageBtn = (e) => {
  if (data.getMessages().length === 0) {
    clearMessagesBtn.disabled = true;
    unableClearMessageBtn(e);
  }
};

const unableClearMessageBtn = (e) => {
  grabInput.addEventListener('input', () => {
    console.log('unable');
    clearMessagesBtn.disabled = false;
    submitMessage(e);
    if (grabInput.value === '') {
      disableClearMessageBtn(e);
    };
  });
};

const addDeleteEvent = () => {
  const deleteButtons = document.getElementsByClassName('delete-btn');
  const deleteBtnArray = Array.from(deleteButtons);
  deleteBtnArray.forEach(btn => {
    btn.addEventListener('click', removeMessage);
  });
};

const removeMessage = (e) => {
  const messageId = e.target.parentNode.parentNode.id;
  const selectedMessage = data.findMessage(messageId);
  data.deleteMessage(selectedMessage);
  const newMessageArray = data.getMessages();
  printMessages(newMessageArray);
  addEditEvent();
  addDeleteEvent();
  goshDarnDark();
};

const addEditEvent = () => {
  for (let i = 0; i < editButton.length; i++) {
    editButton[i].addEventListener('click', editMessage);
  };
};

const editMessage = (e) => {
  const messageId = e.target.parentNode.parentNode.id;
  messageToEdit = data.findMessage(messageId);
  grabInput.value = messageToEdit.message;
  grabInput.focus();
};

module.exports = {
  addSubmitEvent,
  addEditEvent,
  timeStamp,
  addDeleteEvent,
  addClearMessageEvent,
  Message,
};
