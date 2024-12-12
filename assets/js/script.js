const myForm = document.getElementById('myForm');
const userName = document.getElementById('userName');
const userSurname = document.getElementById('userSurname');
const userPhone = document.getElementById('userPhone');
const userEmail = document.getElementById('userEmail');
const btnSendForm = document.getElementById('sendForm');
const btnResetForm = document.getElementById('ResetForm');
const formError = document.getElementById('formError');
const empty = document.getElementById('empty');
const myList = document.getElementById('myList');
const dataURL = 'https://675aa411099e3090dbe565af.mockapi.io/list/UsersList/';

let usersList = [];

class User {
  constructor(_name, _surname, _phone, _email) {
    this.name = _name;
    this.surname = _surname;
    this.phone = _phone;
    this.email = _email;
  }
}

let userMod;

document.addEventListener('load', init());

function init() {
  //   btnSendForm.setAttribute('disabled', 'true');
  readList();
}

async function readList() {
  //   await fetch(dataURL)
  //     .then((response) => {
  //       let data = response.json();
  //       usersList = data;
  //       if (usersList > 0) {
  //         printData();
  //       } else {
  //         empty.innerText = 'Nessun utente presente';
  //         return;
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  try {
    let read = await fetch(dataURL);
    let response = await read.json();
    usersList = response;
    if (usersList.length > 0) {
      printData();
    } else {
      empty.innerText = 'Nessun utente presente';
      return;
    }
  } catch {
    console.log('Errore nel recuper dei dati', error);

    empty.innerText = `Errore nel recupero dei dati: ${error}`;
  }
}

const printData = () => {
  myList.innerText = '';
  empty.innerText = '';
  empty.innerHTML = '';
  usersList.forEach((element) => {
    let newLi = document.createElement('li');
    let btnModify = document.createElement('button');
    btnModify.setAttribute('type', 'button');
    btnModify.classList.add('btn', 'btn-warning', 'ms-3');
    btnModify.setAttribute('onclick', `addItem("${element.id}")`);
    btnModify.innerText = '✏️';
    let btnDelete = document.createElement('button');
    btnDelete.setAttribute('type', 'button');
    btnDelete.classList.add('btn', 'btn-danger', 'mt-3', 'h4');
    btnDelete.setAttribute('onclick', `deleteItem("${element.id}")`);
    btnDelete.innerText = 'X';
    newLi.appendChild(btnModify);
    newLi.appendChild(btnDelete);
    newLi.innerHTML += `${element.name} ${element.surname}, telefono: ${element.phone} - email: ${element.email}`;
    myList.appendChild(newLi);
  });
  myForm.reset();
};

btnSendForm.addEventListener('click', function (e) {
  e.preventDefault();
  if (checkValidity() && !userMod) {
    formError.innerText = '';
    addItem();
  } else if (checkValidity() && userMod) {
    formError.innerText = '';
    modifyItem(userMod.id);
  } else {
    return;
  }
});

const checkValidity = () => {
  let validity = true;

  usersList.forEach((element) => {
    if ((element.email == userEmail.value) & !userMod) {
      formError.innerText = 'Email Già presente';
      validity = false;
      //   btnSendForm.setAttribute('disabled', 'true');
      return validity;
    }
  });
  return validity;
};

const addItem = async (id) => {
  let newUser = new User(
    userName.value,
    userSurname.value,
    userPhone.value,
    userEmail.value
  );
  if (!id) {
    try {
      let response = await fetch(dataURL, {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    } catch (error) {
      console.log(error);
    }
    readList();
    myForm.reset();
  } else {
    printForm(id);
  }
};

const deleteItem = async (id) => {
  try {
    await fetch(dataURL + id, {
      method: 'delete',
    });
  } catch (error) {
    console.log(error);
  }
  readList();
};

const modifyItem = async (id) => {
  userMod.name = userName.value;
  userMod.surname = userSurname.value;
  userMod.phone = userPhone.value;
  userMod.email = userEmail.value;

  try {
    await fetch(dataURL + id, {
      method: 'PUT',
      body: JSON.stringify(userMod),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.log(error);
  }

  readList();
  myForm.reset();
};

function printForm(id) {
  for (let i = 0; i < usersList.length; i++) {
    if (id == usersList[i].id)
      userMod = new User(
        usersList[i].name,
        usersList[i].surname,
        usersList[i].phone,
        usersList[i].email
      );
    userMod.id = usersList[i].id;
  }
  userName.value = userMod.name;
  userSurname.value = userMod.surname;
  userPhone.value = userMod.phone;
  userEmail.value = userMod.email;
}
