import { useCart } from '../context/CartContext';

function CartOffcanvas({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <>
      <div
        className={`offcanvas offcanvas-end${isOpen ? ' show' : ''}`}
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
        tabIndex={-1}
        aria-labelledby="shoppingCartLabel"
      >
        <div className="offcanvas-header">
          <h5 id="shoppingCartLabel" className="offcanvas-title">Shopping Cart</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          {cart.length === 0 ? (
            <div className="alert alert-info">Your cart is empty.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.bookId}>
                      <td>{item.title}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td style={{ minWidth: '110px' }}>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={item.itemQuantity}
                          onChange={(event) => updateQuantity(item.bookId, Number(event.target.value))}
                        />
                      </td>
                      <td>${item.lineTotal.toFixed(2)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.bookId)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-auto border-top pt-3">
            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-outline-secondary" onClick={onClose}>
                Continue Shopping
              </button>
              <button className="btn btn-outline-danger" onClick={() => clearCart()}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && <div className="offcanvas-backdrop fade show" onClick={onClose}></div>}
    </>
  );
}

export default CartOffcanvas;
