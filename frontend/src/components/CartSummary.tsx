import { useCart } from '../context/CartContext';

function CartSummary({ onOpenCart }: { onOpenCart: () => void }) {
  const { itemCount, totalAmount } = useCart();

  return (
    <button type="button" className="btn btn-outline-dark position-relative" onClick={onOpenCart}>
      Cart Summary
      <span className="badge text-bg-primary ms-2">{itemCount}</span>
      <span className="ms-3">${totalAmount.toFixed(2)}</span>
    </button>
  );
}

export default CartSummary;
