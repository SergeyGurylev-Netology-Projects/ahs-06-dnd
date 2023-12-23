import Lists from '../lists/lists';
import '../lists/lists.css';

const lists = new Lists();
lists.bindToDOM();

window.addEventListener('beforeunload', e => lists.saveLists(e));

document.addEventListener('DOMContentLoaded', e => lists.loadLists(e));
