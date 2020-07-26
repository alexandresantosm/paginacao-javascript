const dataItem = Array
  .from({ length: 100 })
  .map((_, index) => `Item ${(index + 1)}`);

const itemPerPage = 5;
const state = {
  page: 1,
  itemPerPage,
  totalPages: Math.ceil(dataItem.length / itemPerPage),
  maxVisibleButtons: 5
};

const html = {
  get(element) {
    return document.querySelector(element);
  }
}
 
const controls = {
  next() {
    state.page++;

    const lastPage = state.page > state.totalPages;
    if (lastPage) {
      state.page--;
    }
  },
  prev() {
    state.page--;

    if (state.page < 1) {
      state.page++;
    }
  },
  goTo(page) {
    if (page < 1) {
      page = 1;
    }

    state.page = Number(page);

    if (page > state.totalPages) {
      state.page = state.totalPages;
    }
  },
  createListeners() {
    html.get('.first').addEventListener('click', () => {
      controls.goTo(1);
      update();
    });
    html.get('.last').addEventListener('click', () => {
      controls.goTo(state.totalPages);
      update();
    });
    html.get('.next').addEventListener('click', () => {
      controls.next();
      update();
    });
    html.get('.prev').addEventListener('click', () => {
      controls.prev();
      update();
    });
  }
};

const list = {
  create(item) {
    const div = document.createElement('div');
    div.classList.add('item');
    div.innerHTML = item;

    html.get('.list').appendChild(div);
  },
  update() {
    html.get('.list').innerHTML = "";

    const pageActive = state.page - 1;
    const pageStart = pageActive * state.itemPerPage;
    const pageEnd = pageStart + state.itemPerPage;
    const paginatedItems = dataItem.slice(pageStart, pageEnd);

    paginatedItems.forEach(list.create);
  }
};

const buttons = {
  element: html.get('.pagination .numbers'),
  create(numberPage) {
    const button = document.createElement('div');

    button.innerHTML = numberPage;

    if (state.page === numberPage) {
      button.classList.add('active');
    }
    
    button.addEventListener('click', (event) => {
      const page = event.target.innerText;

      controls.goTo(page);
      update();
    });

    buttons.element.appendChild(button);
  },
  update() {
    buttons.element.innerHTML = "";
    const { maxButtonLeft, maxButtonRight } = buttons.calculateMaxButtonsVisible();
    
    for(let page = maxButtonLeft; page <= maxButtonRight; page++) {
      buttons.create(page);
    }
  },
  calculateMaxButtonsVisible() {
    const { page, totalPages, maxVisibleButtons } = state;
    let maxButtonLeft = (page - Math.floor(maxVisibleButtons / 2));
    let maxButtonRight = (page + Math.floor(maxVisibleButtons / 2));
    
    if (maxButtonLeft < 1) {
      maxButtonLeft = 1;
      maxButtonRight = maxVisibleButtons;
    }

    if (maxButtonRight > totalPages) {
      maxButtonLeft = totalPages - (maxVisibleButtons - 1);
      maxButtonRight = totalPages;

      if (maxButtonLeft < 1) {
        maxButtonLeft = 1;
      }
    }
    
    return { maxButtonLeft, maxButtonRight };
  }
}

function update() {
  list.update();
  buttons.update();
}

function init() {
  update();
  controls.createListeners();
}

init();