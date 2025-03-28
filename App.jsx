import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

const bookSlice = createSlice({
  name: 'books',
  initialState: [
    { id: 1, title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi', description: 'A science fiction novel', rating: 4.8 },
    { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fiction', description: 'A fantasy novel', rating: 4.9 }
  ],
  reducers: {
    addBook: (state, action) => {
      state.push(action.payload);
    }
  }
});

const store = configureStore({ reducer: { books: bookSlice.reducer } });

function Home() {
  const categories = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography'];
  const books = useSelector(state => state.books);
  return (
    <div>
      <h1>Welcome to the Online Library</h1>
      <h2>Book Categories</h2>
      <ul>
        {categories.map(category => <li key={category}><Link to={`/books/${category}`}>{category}</Link></li>)}
      </ul>
      <h2>Popular Books</h2>
      <ul>
        {books.slice(0, 3).map(book => (
          <li key={book.id}><Link to={`/book/${book.id}`}>{book.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}

function BrowseBooks() {
  const { category } = useParams();
  const books = useSelector(state => state.books);
  const [search, setSearch] = React.useState('');

  const filteredBooks = books.filter(book =>
    book.category === category &&
    (book.title.toLowerCase().includes(search.toLowerCase()) ||
     book.author.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <h1>Books in {category}</h1>
      <input type="text" placeholder="Search by title or author" value={search} onChange={e => setSearch(e.target.value)} />
      <ul>
        {filteredBooks.map(book => (
          <li key={book.id}><Link to={`/book/${book.id}`}>{book.title}</Link></li>
        ))}
      </ul>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

function BookDetails() {
  const { id } = useParams();
  const book = useSelector(state => state.books.find(b => b.id === parseInt(id)));
  const navigate = useNavigate();

  if (!book) return <p>Book not found</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Description: {book.description}</p>
      <p>Rating: {book.rating}</p>
      <button onClick={() => navigate(-1)}>Back to Browse</button>
    </div>
  );
}

function AddBook() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ title: '', author: '', category: '', description: '', rating: '' });

  const handleSubmit = e => {
    e.preventDefault();
    if (Object.values(form).some(value => !value)) {
      alert('Please fill all fields');
      return;
    }
    dispatch(bookSlice.actions.addBook({ ...form, id: Date.now(), rating: parseFloat(form.rating) }));
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Author" onChange={e => setForm({ ...form, author: e.target.value })} />
      <input placeholder="Category" onChange={e => setForm({ ...form, category: e.target.value })} />
      <input placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
      <input type="number" placeholder="Rating" onChange={e => setForm({ ...form, rating: e.target.value })} />
      <button type="submit">Add Book</button>
    </form>
  );
}

function NotFound() {
  return <h1>404 - Page Not Found. <Link to="/">Go Home</Link></h1>;
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <nav>
          <Link to="/">Home</Link> | <Link to="/add-book">Add Book</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/:category" element={<BrowseBooks />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
