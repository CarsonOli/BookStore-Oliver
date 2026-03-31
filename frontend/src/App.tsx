import BooksPage from "./pages/BooksPage"
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PurchasePage from "./pages/PurchasePage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";

function App() {
  

  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/purchase/:title/:bookId/:price" element={<PurchasePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  )
}

export default App
