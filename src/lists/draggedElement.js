class DraggedElement {
  constructor(element, clientX, clientY) {
    this.element = element;
    this.clientRect = element.getBoundingClientRect();
    this.offsetX = clientX - this.clientRect.left;
    this.offsetY = clientY - this.clientRect.top;

    this.element.classList.add('dragged');
    this.element.style.height = `calc(${this.clientRect.height}px - 1.3rem)`;
    this.element.style.width = `calc(${this.clientRect.width}px - 1.2rem)`;
  }

  move(e) {
    this.element.style.left = `${e.clientX - this.offsetX}px`;
    this.element.style.top = `${e.clientY - this.offsetY}px`;
  }

  clearProperties() {
    this.element.classList.remove('dragged');
    this.element.style.removeProperty('top');
    this.element.style.removeProperty('left');
    this.element.style.removeProperty('height');
    this.element.style.removeProperty('width');
  }
}

export default DraggedElement;
