import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl } from '../api/config';
import type { Book } from '../types/Book';

interface BookFormValues {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: string;
  price: string;
}

const emptyForm: BookFormValues = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: '',
  price: '',
};

function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState<BookFormValues>(emptyForm);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const isEditing = useMemo(() => editingBookId !== null, [editingBookId]);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(buildApiUrl('/api/Book/AdminBooks'));

      if (!response.ok) {
        throw new Error(`Unable to load admin books: ${response.status}`);
      }

      const data: Book[] = await response.json();
      setBooks(data);
    } catch (fetchError) {
      console.error(fetchError);
      setError('Unable to load books for admin management.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingBookId(null);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const buildBookPayload = (): Book => ({
    bookId: editingBookId ?? 0,
    title: form.title.trim(),
    author: form.author.trim(),
    publisher: form.publisher.trim(),
    isbn: form.isbn.trim(),
    classification: form.classification.trim(),
    category: form.category.trim(),
    pageCount: Number(form.pageCount),
    price: Number(form.price),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = buildBookPayload();
      const url = isEditing
        ? buildApiUrl(`/api/Book/UpdateBook/${editingBookId}`)
        : buildApiUrl('/api/Book/AddBook');

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Unable to save book: ${response.status}`);
      }

      await fetchBooks();
      resetForm();
      setSuccessMessage(isEditing ? 'Book updated successfully.' : 'Book added successfully.');
    } catch (submitError) {
      console.error(submitError);
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError('Unable to save the book.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBookId(book.bookId);
    setForm({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount.toString(),
      price: book.price.toString(),
    });
    setError('');
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (bookId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this book?');
    if (!confirmed) {
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(buildApiUrl(`/api/Book/DeleteBook/${bookId}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Unable to delete book: ${response.status}`);
      }

      if (editingBookId === bookId) {
        resetForm();
      }

      await fetchBooks();
      setSuccessMessage('Book deleted successfully.');
    } catch (deleteError) {
      console.error(deleteError);
      if (deleteError instanceof Error) {
        setError(deleteError.message);
      } else {
        setError('Unable to delete the book.');
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Admin Book Management</h1>
          <p className="text-muted mb-0">Add, update, and delete books from the bookstore database.</p>
        </div>

        <Link to="/books" className="btn btn-outline-secondary">
          Back to Storefront
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">{isEditing ? 'Edit Book' : 'Add New Book'}</h2>

            {isEditing && (
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="title">Title</label>
                <input id="title" name="title" className="form-control" value={form.title} onChange={handleInputChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="author">Author</label>
                <input id="author" name="author" className="form-control" value={form.author} onChange={handleInputChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="publisher">Publisher</label>
                <input id="publisher" name="publisher" className="form-control" value={form.publisher} onChange={handleInputChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="isbn">ISBN</label>
                <input id="isbn" name="isbn" className="form-control" value={form.isbn} onChange={handleInputChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="classification">Classification</label>
                <input id="classification" name="classification" className="form-control" value={form.classification} onChange={handleInputChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="category">Category</label>
                <input id="category" name="category" className="form-control" value={form.category} onChange={handleInputChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="pageCount">Page Count</label>
                <input
                  id="pageCount"
                  name="pageCount"
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.pageCount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="form-control"
                  value={form.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
              </button>

              <button type="button" className="btn btn-outline-secondary" onClick={resetForm} disabled={isSubmitting}>
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">Current Books</h2>
            <span className="text-muted">{books.length} total</span>
          </div>

          {isLoading ? (
            <p className="text-muted mb-0">Loading books...</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.bookId}>
                      <td>
                        <div className="fw-semibold">{book.title}</div>
                        <div className="small text-muted">ISBN: {book.isbn}</div>
                      </td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>${book.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(book)}>
                            Edit
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(book.bookId)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBooksPage;
