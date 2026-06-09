const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, res) => {
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher,
    pageCount, readPage, finished, reading,
    insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.find((book) => book.id === id);

  if (isSuccess) {
    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
};

const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;

  let result = books;

  if (name !== undefined) {
    result = result.filter((b) =>
      b.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading !== undefined) {
    result = result.filter((b) => b.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    result = result.filter((b) => b.finished === (finished === '1'));
  }

  return res.status(200).json({
    status: 'success',
    data: {
      books: result.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });
};

const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;

  const book = books.find((b) => b.id === bookId);

  if (book) {
    return res.status(200).json({
      status: 'success',
      data: { book },
    });
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
};

const editBookByIdHandler = (req, res) => {
  const { bookId } = req.params;

  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  books[index] = {
    ...books[index],
    name, year, author, summary, publisher,
    pageCount, readPage, reading, finished, updatedAt,
  };

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params;

  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(index, 1);

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
