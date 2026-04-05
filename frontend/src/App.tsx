import './App.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BooksPage from './pages/BooksPage';
import AdminBooksPage from './pages/AdminBooksPage';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/adminbooks" element={<AdminBooksPage />} />
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;