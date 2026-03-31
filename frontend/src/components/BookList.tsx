import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { useCart } from '../context/CartContext';

function BookList({
  selectedCategory,
  sortBy,
  onOpenCart,
}: {
  selectedCategory: string;
  sortBy: string;
  onOpenCart: () => void;
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [cartError, setCartError] = useState<string>('');
  const { addToCart } = useCart();

  useEffect(() => {
    setPageNum(1);
  }, [selectedCategory, sortBy, pageSize]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          pageSize: pageSize.toString(),
          pageNum: pageNum.toString(),
          sortBy,
        });

        if (selectedCategory !== 'All') {
          params.append('bookCategories', selectedCategory);
        }

        const response = await fetch(`https://localhost:5000/api/Book/AllBooks?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Book request failed: ${response.status}`);
        }

        const data = await response.json();

        const sortedBooks = [...data.books];

        if (sortBy === 'title_asc') {
          sortedBooks.sort((a: Book, b: Book) => a.title.localeCompare(b.title));
        } else if (sortBy === 'title_desc') {
          sortedBooks.sort((a: Book, b: Book) => b.title.localeCompare(a.title));
        }

        setBooks(sortedBooks);
        setTotalPages(Math.max(1, Math.ceil(data.totalBooks / pageSize)));
      } catch (fetchError) {
        console.error(fetchError);
        setError('Unable to load books right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [pageNum, pageSize, selectedCategory, sortBy]);

  const handleAddToCart = async (bookId: number) => {
    setCartError('');

    try {
      await addToCart(bookId, 1);
      onOpenCart();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setCartError(error.message);
      } else {
        setCartError('Unable to add this book to the cart.');
      }
    }
  };

  return (
    <>
      {isLoading && <p className="text-muted">Loading books...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {cartError && <div className="alert alert-danger">{cartError}</div>}

      <div className="row g-3">
        {books.map((b) => (
          <div className="col-lg-6" key={b.bookId}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="h5 card-title mb-0">{b.title}</h3>
                  <span className="badge text-bg-primary ms-2">${b.price.toFixed(2)}</span>
                </div>

                <ul className="list-unstyled small mb-4">
                  <li><strong>Author:</strong> {b.author}</li>
                  <li><strong>Category:</strong> {b.category}</li>
                  <li><strong>Classification:</strong> {b.classification}</li>
                  <li><strong>Publisher:</strong> {b.publisher}</li>
                  <li><strong>ISBN:</strong> {b.isbn}</li>
                  <li><strong>Page Count:</strong> {b.pageCount}</li>
                </ul>

                <button className="btn btn-success mt-auto" onClick={() => handleAddToCart(b.bookId)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
        <div className="btn-group" role="group" aria-label="Pagination">
          <button className="btn btn-outline-secondary" disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`btn ${pageNum === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPageNum(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button className="btn btn-outline-secondary" disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>
            Next
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0" htmlFor="pageSize">Results per page</label>
          <select
            id="pageSize"
            className="form-select"
            style={{ width: 'auto' }}
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default BookList;