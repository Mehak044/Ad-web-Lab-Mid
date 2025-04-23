const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Search books by author
router.get('/search', async (req, res) => {
  try {
    const author = req.query.author || '';
    const books = await Book.find({ author: { $regex: author, $options: 'i' } });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Search error' });
  }
});

// Add new book
router.post('/', async (req, res) => {
  const { title, author, price } = req.body;
  try {
    const book = new Book({ title, author, price });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  const { title, author, price } = req.body;
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, price },
      { new: true }
    );
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;
