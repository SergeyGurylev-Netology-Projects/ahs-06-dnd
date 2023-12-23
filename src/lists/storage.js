export function saveLists(lists) {
  const listsData = [];

  lists.listItems.forEach(ul => {
    const items = [];
    Array.from(ul.getElementsByTagName('li')).forEach(li => {
      items.push(li.textContent);
    });
    listsData.push(items);
  });

  localStorage.setItem('listsData', JSON.stringify(listsData));
}

export function loadLists(lists) {
  const json = localStorage.getItem('listsData');

  let listsData;

  try {
    listsData = JSON.parse(json);
  } catch (error) {
    console.log(error);
  }

  if (listsData) {
    lists.listItems.forEach((ul, index) => {
      const listItems = listsData[index];
      if (listItems) {
        listItems.forEach(li => {
          const listItem = document.createElement('li');
          listItem.classList.add('list-item');
          listItem.textContent = li;
          ul.appendChild(listItem);
        });
      }
    });
  }
}
