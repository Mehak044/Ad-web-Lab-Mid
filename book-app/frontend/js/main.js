const bookList = document.getElementById('book-list');
const searchInput = document.getElementById('search');

// Fetch and display books
async function fetchBooks(query = '') {
  const url = query
    ? `http://localhost:5000/api/books/search?author=${encodeURIComponent(query)}`
    : 'http://localhost:5000/api/books';

  const response = await fetch(url);
  const books = await response.json();

  bookList.innerHTML = '';
  books.forEach(book => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <span>${book.title} by ${book.author} - $${book.price}</span>
      <div>
        <button class="btn btn-sm btn-warning me-2" onclick="openEditModal('${book._id}', '${book.title}', '${book.author}', ${book.price})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBook('${book._id}')">Delete</button>
      </div>
    `;
    bookList.appendChild(li);
  });
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    fetchBooks(searchInput.value);
  });
}

window.onload = () => {
  fetchBooks();
};

// Delete book
async function deleteBook(id) {
  if (confirm('Are you sure you want to delete this book?')) {
    const response = await fetch(`http://localhost:5000/api/books/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Book deleted');
      fetchBooks();
    } else {
      alert('Failed to delete book');
    }
  }
}

// Open modal with book data
function openEditModal(id, title, author, price) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-author').value = author;
  document.getElementById('edit-price').value = price;

  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  editModal.show();
}

// Save updated book
async function saveEdit() {
  const id = document.getElementById('edit-id').value;
  const title = document.getElementById('edit-title').value;
  const author = document.getElementById('edit-author').value;
  const price = document.getElementById('edit-price').value;

  const response = await fetch(`http://localhost:5000/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author, price })
  });

  if (response.ok) {
    alert('Book updated');
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    fetchBooks();
  } else {
    alert('Failed to update book');
  }
}
