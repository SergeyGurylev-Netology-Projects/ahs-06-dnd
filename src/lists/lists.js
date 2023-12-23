import markup_newcard from './markup_newcard';
import DraggedElement from './draggedElement';
import BelowElement from './belowElement';
import {loadLists, saveLists} from './storage';

export default class Lists {
  constructor() {
    this.container = document.getElementById('trello');;
    this.listItems = Array.from(this.container.getElementsByClassName('list-items'));
    this.activeAddCardBtn = undefined;
    this.newCardElement = undefined;
    this.draggedElement = undefined;
    this.belowElement = undefined;
  }

  bindToDOM() {
    this.onAddCardClick = this.onAddCardClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onListItemClick = this.onListItemClick.bind(this);
    this.onListItemMouseDown = this.onListItemMouseDown.bind(this);
    this.onListItemMouseMove = this.onListItemMouseMove.bind(this);

    Array.from(this.container.getElementsByClassName('list')).forEach(el => {
      el.querySelector('.add-card-btn').addEventListener('click', this.onAddCardClick);
      el.addEventListener('click', this.onListItemClick);
      el.addEventListener('mousedown', this.onListItemMouseDown);
    });
  }

  saveLists(e) {
    saveLists(this);
  }

  loadLists(e) {
    loadLists(this);
  }

  closeNewCardForm() {
    this.newCardElement.removeEventListener('submit', this.onNewCardSubmit.bind(this));
    this.newCardElement.removeEventListener('reset', this.onNewCardReset.bind(this));

    this.activeAddCardBtn.classList.remove('hidden');
    this.newCardElement.remove();
  }

  onAddCardClick(e) {
    if (this.newCardElement) this.closeNewCardForm();

    this.newCardElement = document.createElement('form');
    this.newCardElement.classList.add('list-new-card');
    this.newCardElement.innerHTML = markup_newcard;

    e.target.closest('.list').appendChild(this.newCardElement);
    e.target.classList.add('hidden');

    this.activeAddCardBtn = e.target;

    this.newCardElement.addEventListener('submit', this.onNewCardSubmit.bind(this));
    this.newCardElement.addEventListener('reset', this.onNewCardReset.bind(this));

    this.newCardElement.querySelector('.list-new-card--control').focus();
  }

  onNewCardSubmit(e) {
    e.preventDefault();

    const listItem = document.createElement('li');
    listItem.classList.add('list-item');
    listItem.textContent = this.newCardElement.querySelector('.list-new-card--control').value;
    e.target.closest('.list').querySelector('.list-items').appendChild(listItem);

    this.closeNewCardForm();
  }

  onNewCardReset(e) {
    e.preventDefault();
    this.closeNewCardForm();
  }

  onListItemClick(e) {
    if (e.target.tagName === 'LI' && this.isMouseOnCloseButton(e)) e.target.remove();
  }

  onListItemMouseDown(e) {
    e.preventDefault();

    if (e.target.tagName !== 'LI' || this.isMouseOnCloseButton(e)) return;

    this.draggedElement = new DraggedElement(e.target, e.clientX, e.clientY);

    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mouseover', this.onMouseOver);
    this.draggedElement.element.addEventListener('mousemove', this.onListItemMouseMove);
  }

  onListItemMouseMove(e) {
    this.draggedElement.move(e);

    this.draggedElement.element.hidden = true;
    let belowElement = document.elementFromPoint(e.clientX, e.clientY);
    this.draggedElement.element.hidden = false;

    this.formatBelowElement(belowElement, e);
  }

  onMouseUp(e) {
    if (!this.draggedElement) return;

    if (this.belowElement) {
      if (this.belowElement.isListItem) {
        if (this.belowElement.element.style.marginBottom) {
          this.belowElement.element.closest('.list-items').insertBefore(this.draggedElement.element, this.belowElement.element);
          this.belowElement.element.closest('.list-items').insertBefore(this.belowElement.element, this.draggedElement.element);
        } else {
          this.belowElement.element.closest('.list-items').insertBefore(this.draggedElement.element, this.belowElement.element);
        }
      } else if (this.belowElement.isListTitle) {
        this.belowElement.element.closest('.list').querySelector('.list-items').insertAdjacentElement('afterbegin', this.draggedElement.element);
      }
    }

    this.draggedElement.clearProperties();

    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mouseover', this.onMouseOver);
    this.draggedElement.element.removeEventListener('mousemove', this.onListItemMouseMove);

    this.draggedElement = undefined;

    if (this.belowElement) {
      this.belowElement.clearProperties();
      this.belowElement = undefined;
    }
  }

  onMouseOver(e) {
    this.draggedElement.move(e);
  }

  isMouseOnCloseButton(e) {
    const { right, top } = e.target.getBoundingClientRect();

    return e.clientX >= right - 20 && e.clientX < right && e.clientY > top && e.clientY <= top + 20;
  }

  formatBelowElement(belowElement, e) {
    if (belowElement.classList.contains('list-items')) return;

    if (this.belowElement) this.belowElement.clearProperties();

    if (belowElement.classList.contains('list-item') || belowElement.classList.contains('list-title')) {
      this.belowElement = new BelowElement(belowElement);
    } else {
      this.belowElement = undefined;
    }

    if (this.belowElement) this.belowElement.setProperties(this.draggedElement, e);
  }
}
