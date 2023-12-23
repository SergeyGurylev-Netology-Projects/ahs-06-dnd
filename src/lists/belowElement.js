
class BelowElement {
  constructor(element) {
    this.element = element;
    this.clientRect = element.getBoundingClientRect();

    this.isListItem = element.classList.contains('list-item');
    this.isListTitle = element.classList.contains('list-title');
  }

  setProperties(draggedElement, e) {
    this.element.classList.add('below');
    const paddingHeight = draggedElement.clientRect.height;

    if (this.element.classList.contains('list-title')) {
      this.element.style.marginBottom = this.clientRect.height + 'px';
    } else {
      if (e.clientY > this.clientRect.top + this.clientRect.height / 2) {
        this.element.style.marginBottom = paddingHeight + 'px';
      } else {
        this.element.style.marginTop = paddingHeight + 'px';
      }
    }
  }

  clearProperties() {
    this.element.classList.remove('below');
    this.element.style.removeProperty('margin-top')
    this.element.style.removeProperty('margin-bottom');
  }
}

export default BelowElement;