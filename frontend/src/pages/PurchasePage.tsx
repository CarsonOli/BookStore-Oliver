import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import type { CartItem } from "../types/CartItem";

function PurchasePage() {
    const navigate = useNavigate();
    const {title, bookId, price} = useParams();
    const {addToCart} = useCart();
    const [itemQuantity, setItemQuantity] = useState<number>(0);

    const handleAddToCart = () => {
        const newItem: CartItem = {
            bookId: Number(bookId), 
            title: title || 'No Title Found', 
            price: Number(price) || 0, 
            itemQuantity}
            addToCart(newItem);
            navigate('/cart');
    }

    return (
        <>
            <WelcomeBand />
            <h2>Purchase of {title}</h2>
            <div>
                <input type="number" placeholder="Enter Quantity" value={itemQuantity} onChange={(x) => setItemQuantity(Number(x.target.value))}/>
                <button onClick={handleAddToCart}>Add to Cart</button>
            </div>

            <button onClick={() => navigate('/books')}>Go Back</button>
        </>
    );
}

export default PurchasePage;