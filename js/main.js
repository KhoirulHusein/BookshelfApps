document.addEventListener('DOMContentLoaded', function () {
  const submitBook = document.getElementById('inputBook');
  submitBook.addEventListener('submit', function(event) {
    event.preventDefault();
    addBooks();
  });
  if (isStorageExist()){
    loadDataFromStorage();
  }
});

function searchBooksByTitle(title) {
  const filteredBooks = books.filter((book) =>
    book.booksTitle.toLowerCase().includes(title.toLowerCase())
  );
  return filteredBooks;
}

const searchForm = document.getElementById('searchBook');
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const searchInput = document.getElementById('searchBookTitle').value;
  const filteredBooks = searchBooksByTitle(searchInput);
  renderFilteredBooks(filteredBooks);
});

function renderFilteredBooks(filteredBooks) {
  const incompleteBooksContainer = document.getElementById('incompleteBookshelfList');
  const completeBooksContainer = document.getElementById('completeBookshelfList');
  incompleteBooksContainer.innerHTML = '';
  completeBooksContainer.innerHTML = '';

  filteredBooks.forEach((bookItem) => {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBooksContainer.append(bookElement);
    } else {
      incompleteBooksContainer.append(bookElement);
    }
  });
}

function addBooks() {
  const booksTitle = document.getElementById('inputBookTitle').value;
  const booksAuthor = document.getElementById('inputBookAuthor').value;
  const booksYears = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;
  const bookImage = document.getElementById('inputBookImage').value;

  const generatedID = generateId();
  const createObject = generateCreateObject(generatedID, booksTitle, booksAuthor, booksYears, isComplete, bookImage, false);
  books.push(createObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

function generateId() {
  return +new Date();
};

function generateCreateObject(id, booksTitle, booksAuthor, booksYears, isComplete, bookImage) {
  return {
    id,
    booksTitle,
    booksAuthor,
    booksYears,
    isComplete,
    bookImage
  };
};

const books = [];
const RENDER_EVENT = 'RENDER_BOOKS';

  document.addEventListener(RENDER_EVENT, function (isComplete) {
    console.log(books);
    const bookshelfList = isComplete ? 'completeBookshelfList' : 'incompleteBookshelfList';
    const booksContainer = document.getElementById(bookshelfList);
    booksContainer.innerHTML = '';
  
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      booksContainer.append(bookElement);
    }
  });

function makeBook(createObject) {
  const bookItem = document.createElement('article');
  bookItem.classList.add('book_item');

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = 'Judul Buku : ' + createObject.booksTitle;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Penulis : ' + createObject.booksAuthor;

  const bookYear = document.createElement('p');
  bookYear.innerText = 'Tahun : ' + createObject.booksYears;

  const bookImage = document.createElement('img');
  bookImage.src = createObject.bookImage; 
  bookImage.alt = createObject.booksTitle; 
  bookImage.classList.add('book-responsive');

  bookItem.append(bookImage, bookTitle, bookAuthor, bookYear);

  if (createObject.isComplete) {
    const createButton = document.createElement('button');
    createButton.classList.add('green');
    createButton.innerText = 'Belum dibaca';

    createButton.addEventListener('click', function() {
      incompleteBookshelfList(createObject.id);
    });

    function incompleteBookshelfList(bookId) {
      const bookTarget = findBook(bookId);

      if (bookTarget === null) return;
  
      bookTarget.isComplete = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }

    const deleteBookButton = document.createElement('button');
    deleteBookButton.classList.add('red');
    deleteBookButton.innerText = 'Hapus Buku';
      
    deleteBookButton.addEventListener('click', function() {
      removeBookFromAll(createObject.id);
    });
  
    function removeBookFromAll(bookId) {
      const bookTarget = findBookIndex(bookId);
  
      if (bookTarget === null) return;
  
      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }

    bookItem.append(createButton, deleteBookButton);
  } else {
    const createButton = document.createElement('button');
    createButton.classList.add('green');
    createButton.innerText = 'Selesai dibaca'

    createButton.addEventListener('click', function() {
      completeBookshelfList(createObject.id);
    });

    const deleteBookButton = document.createElement('button');
    deleteBookButton.classList.add('red');
    deleteBookButton.innerText = 'Hapus Buku';
    
    deleteBookButton.addEventListener('click', function() {
      removeBookFromAll(createObject.id);
    });
  
    function removeBookFromAll(bookId) {
      const bookTarget = findBookIndex(bookId);
  
      if (bookTarget === null) return;
  
      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }

    bookItem.append(createButton, deleteBookButton);
  }

  function completeBookshelfList(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget === null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  document.addEventListener(RENDER_EVENT, function() {
    const unCompletedReadList = document.getElementById('incompleteBookshelfList');
    unCompletedReadList.innerHTML = '';

    const completedReadList = document.getElementById('completeBookshelfList');
    completedReadList.innerHTML = '';

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) {
        unCompletedReadList.append(bookElement);
      } else {
        completedReadList.append(bookElement);
      }
    }
  }); 

  return bookItem;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const SAVED_EVENT = 'SAVED_BOOKS';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
