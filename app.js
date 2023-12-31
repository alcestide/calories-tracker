const StorageControl = (function(){

  return {
    storeItem: function(item){
      let items;

      if(localStorage.getItem('items') === null){
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();


const ItemControl = (function(){
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data = {
    items: StorageControl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories){
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id){
      const ids = data.items.map(function(item){
        return item.id;
      });

      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;

      data.items.forEach(function(item){
        total += item.calories;
      });

      data.totalCalories = total;
      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }
})();

const Controls = (function(){
  const Selectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      document.querySelector(Selectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name:document.querySelector(Selectors.itemNameInput).value,
        calories:document.querySelector(Selectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      document.querySelector(Selectors.itemList).style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      document.querySelector(Selectors.itemList).insertAdjacentElement('beforeend', li)
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(Selectors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(Selectors.itemNameInput).value = '';
      document.querySelector(Selectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(Selectors.itemNameInput).value = ItemControl.getCurrentItem().name;
      document.querySelector(Selectors.itemCaloriesInput).value = ItemControl.getCurrentItem().calories;
      Controls.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(Selectors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(Selectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(Selectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      Controls.clearInput();
      document.querySelector(Selectors.updateBtn).style.display = 'none';
      document.querySelector(Selectors.deleteBtn).style.display = 'none';
      document.querySelector(Selectors.backBtn).style.display = 'none';
      document.querySelector(Selectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
      document.querySelector(Selectors.updateBtn).style.display = 'inline';
      document.querySelector(Selectors.deleteBtn).style.display = 'inline';
      document.querySelector(Selectors.backBtn).style.display = 'inline';
      document.querySelector(Selectors.addBtn).style.display = 'none';
    },
    getSelectors: function(){
      return Selectors;
    }
  }
})();



const App = (function(ItemControl, StorageControl, Controls){
  const loadEventListeners = function(){
    const Selectors = Controls.getSelectors();

    document.querySelector(Selectors.addBtn).addEventListener('click', itemAddSubmit);

    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    document.querySelector(Selectors.itemList).addEventListener('click', itemEditClick);
    document.querySelector(Selectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    document.querySelector(Selectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
     document.querySelector(Selectors.backBtn).addEventListener('click', Controls.clearEditState);
    document.querySelector(Selectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  const itemAddSubmit = function(e){
    const input = Controls.getItemInput();
    if(input.name !== '' && input.calories !== ''){
      const newItem = ItemControl.addItem(input.name, input.calories);
      Controls.addListItem(newItem);
      const totalCalories = ItemControl.getTotalCalories();
      Controls.showTotalCalories(totalCalories);
      StorageControl.storeItem(newItem);
      Controls.clearInput();
    }
    e.preventDefault();
  }

  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      const itemToEdit = ItemControl.getItemById(id);
      ItemControl.setCurrentItem(itemToEdit);
      Controls.addItemToForm();
    }

    e.preventDefault();
  }

  const itemUpdateSubmit = function(e){
    const input = Controls.getItemInput();

    const updatedItem = ItemControl.updateItem(input.name, input.calories);

    Controls.updateListItem(updatedItem);
     const totalCalories = ItemControl.getTotalCalories();
     Controls.showTotalCalories(totalCalories);
     StorageControl.updateItemStorage(updatedItem);
     Controls.clearEditState();
    e.preventDefault();
  }

  const itemDeleteSubmit = function(e){
    const currentItem = ItemControl.getCurrentItem();
    ItemControl.deleteItem(clientInformation);
    Controls.deleteListItem(currentItem.id);
    const totalCalories = ItemControl.getTotalCalories();
    Controls.showTotalCalories(totalCalories);
    StorageControl.deleteItemFromStorage(currentItem.id);
    Controls.clearEditState();
    e.preventDefault();
  }


  const clearAllItemsClick = function(){
    ItemControl.clearAllItems();
    const totalCalories = ItemControl.getTotalCalories();
    Controls.showTotalCalories(totalCalories);
    Controls.removeItems();
    StorageControl.clearItemsFromStorage();
    Controls.hideList();

  }

  return {
    init: function(){
      Controls.clearEditState();
      const items = ItemControl.getItems();
      if(items.length === 0){
        Controls.hideList();
      } else {
        Controls.populateItemList(items);
      }

      const totalCalories = ItemControl.getTotalCalories();
      Controls.showTotalCalories(totalCalories);

      loadEventListeners();
    }
  }

})(ItemControl, StorageControl, Controls);

App.init();
