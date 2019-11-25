/* Объявление классов */

class Card {

  like(event) {
    if (event.target.classList.contains('place-card__like-icon')) {
      event.target.classList.toggle('place-card__like-icon_liked');
    }
  }
  remove(event) {
    const card = event.target.closest('.place-card');

    if (event.target.classList.contains('place-card__delete-icon')) {
      document.querySelector('.places-list').removeChild(card);
    }
  }
  create(card) {
    const cardElement = document.createElement('div');
    const cardImageElement = document.createElement('div');
    const cardDeleteElement = document.createElement('button');
    const cardDescrElement = document.createElement('div');
    const cardTitleElement = document.createElement('h3');
    const cardLikeContainer = document.createElement('div');
    const cardLikeElement = document.createElement('button');
    const cardCounterElement = document.createElement('p');

    cardElement.classList.add('place-card');
    cardImageElement.classList.add('place-card__image');
    cardImageElement.setAttribute('style', `background-image:url(${card.link})`);
    cardDeleteElement.classList.add('place-card__delete-icon');
    cardDescrElement.classList.add('place-card__description');
    cardTitleElement.classList.add('place-card__name');
    cardTitleElement.textContent = card.name;
    cardLikeContainer.classList.add('place-card__like-container')
    cardLikeElement.classList.add('place-card__like-icon');
    cardCounterElement.classList.add('place-card__like-counter');

    cardImageElement.appendChild(cardDeleteElement);
    cardDescrElement.appendChild(cardTitleElement);
    cardDescrElement.appendChild(cardLikeContainer);
    cardLikeContainer.appendChild(cardLikeElement);
    cardLikeContainer.appendChild(cardCounterElement);
    cardElement.appendChild(cardImageElement);
    cardElement.appendChild(cardDescrElement);
    document.querySelector('.places-list').appendChild(cardElement);
    return cardElement;
  }

  addEventListeners() {
    document.querySelector('.places-list').addEventListener('click', this.like);
    document.querySelector('.places-list').addEventListener('click', this.remove);
  }
}

class CardList {

  addCards() {
    api.getInitialCards()
      .then((cards) => {
        this.render(cards);
        const like = cards.map(card => card.likes.length);
        const cardCounter = document.querySelectorAll('.place-card__like-counter');

        for (let i = 0; i < cardCounter.length; i++) {
          cardCounter[i].textContent = like[i];
        }
      });
  }

  render(arr) {
    for (let i = 0; i < arr.length; i++) {
      card.create(arr[i]);
    }
    card.addEventListeners();
  }
}

class Popup {
  open(event) {

    if (event.target.classList.contains('place-card__image')) {
      document.querySelector('.image-popup').classList.add('popup_is-opened');
      document.querySelector('.image-popup__image').setAttribute('src', event.target.style.backgroundImage.slice(5, -2));
    }

    if (event.target.classList.contains('user-info__button')) {
      document.querySelector('.place-popup').classList.add('popup_is-opened');
    }

    if (event.target.classList.contains('user-info__edit-button')) {
      document.querySelector('.profile-popup').classList.add('popup_is-opened');
      //Автоматическое заполнение полей формы при открытии
      userInfo.elements.userName.value = document.querySelector('.user-info__name').textContent;
      userInfo.elements.userJob.value = document.querySelector('.user-info__job').textContent;
    }
  }
  close() {
    const popUpParent = document.querySelector('.root');

    popUpParent.addEventListener('click', function (event) {
      if (event.target.classList.contains('popup__close')) {
        event.target.closest('.popup').classList.remove('popup_is-opened');
      }
      if (event.target.classList.contains('popup__button')) {
        event.target.closest('.popup').classList.remove('popup_is-opened');
      }
    });
  }
}

class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  getUserData(funcRender) {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: this.headers
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .then((result) => {
        funcRender(result);
        return result;
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: this.headers
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  patchUserData(name, about, funcRender) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this.headers,

      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .then((result) => {
        funcRender(result);
        return result;
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  postNewCard(name, link, funcRender) {
    return fetch(`${this.baseUrl}/cards`, {
      method: 'POST',
      headers: this.headers,

      body: JSON.stringify({
        name: name,
        link: link
      })
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res.status);
      })
      .then((result) => {
        funcRender(result);
        return result;
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }
}

/* Переменные */

const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort5',
  headers: {
    authorization: '22c01199-6204-4cda-8461-b80d7daa40e5',
    'Content-Type': 'application/json'
  }
});
const cardList = new CardList();
const card = new Card();

const formsContainer = document.querySelector('.user-info');

const cross = document.querySelectorAll('.popup__close');
const imageCross = document.querySelectorAll('.image-popup__close');

const cardsContainer = document.querySelector('.places-list');

const placeForm = document.forms.new;

const userInfoForm = document.forms.userInfo;
const submitButton = document.querySelectorAll('.popup__button');
const userName = document.querySelector('#name');
const userJob = document.querySelector('#job');
const placeName = document.forms.new.elements.name;
const placeUrl = document.forms.new.elements.link;

/* Объявление функций */

//Активная/Неактивная кнопка submit для формы
function submitReset() {

  let submitButtonActive = true;

  for (const element of this.elements) {

    if (element.name.length === 0) {
      continue;
    }

    if (submitButtonActive) {
      submitButtonActive = element.checkValidity();
    }
  }

  const button = this.querySelector('button');

  if (!submitButtonActive) {
    button.classList.add('button_disabled');
    button.setAttribute('disabled', true);
  } else {
    button.classList.remove('button_disabled');
    button.removeAttribute('disabled');
  }
}
// Валидация
function handleValidation(event) {
  resetError(event.target);
  validate(event.target);
}

function validate(element) {
  const errorElement = document.querySelector(`#error-${element.id}`);

  if (blankField(element)) {
    const errorBlank = 'Это обязательное поле';
    errorElement.textContent = errorBlank;
    activateError(element);
    return false;

  } else if (fieldLength(element)) {
    const errorLength = 'Должно быть от 2 до 30 символов';
    errorElement.textContent = errorLength;
    activateError(element);
    return false;

  } else if (!element.checkValidity()) {
    errorElement.textContent = (element.validationMessage);
    activateError(element);
    return false;
  }
  return true;
}

function activateError(element) {
  element.parentNode.classList.add('popup__input-container_invalid');
}

function resetError(element) {
  element.parentNode.classList.remove('popup__input-container_invalid');
  element.textContent = '';
}

function blankField(element) {
  return (element.value === '');
}

function fieldLength(element) {
  return (element.value.length === 1);
}

function renderUserData(data) {
  document.querySelector('.user-info__name').textContent = `${data.name}`;
  document.querySelector('.user-info__job').textContent = `${data.about}`;
  document.querySelector('.user-info__photo').setAttribute('style', `background-image:url(${data.avatar})`);
}

/* Слушатели событий */

formsContainer.addEventListener('click', function () {
  const container = new Popup(document.querySelector('.user-info'));
  container.open(event);
  container.close();
  submitReset.call(userInfoForm);
  submitReset.call(placeForm);
});

cardsContainer.addEventListener('click', function () {
  const container = new Popup(document.querySelector('.places-list'));
  container.open(event);
  container.close();
});

userInfoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  api.patchUserData(userName.value, userJob.value, renderUserData);
  document.forms.userInfo.reset();
})

userInfoForm.addEventListener('input', submitReset);

placeForm.addEventListener('input', submitReset);

placeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  api.postNewCard(placeName.value, placeUrl.value, card.create);
});

userName.addEventListener('input', handleValidation);

userJob.addEventListener('input', handleValidation);

/* Вызов функций */

api.getUserData(renderUserData);
cardList.addCards();