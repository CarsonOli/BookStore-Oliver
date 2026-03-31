import { useState } from 'react';
import BookList from '../components/BookList';
import CartOffcanvas from '../components/CartOffcanvas';
import CartSummary from '../components/CartSummary';
import CategoryFilter from '../components/CategoryFilter';
import WelcomeBand from '../components/WelcomeBand';

function BooksPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('title');
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  return (
    <div className="container py-4">
      <WelcomeBand />

      <div className="row g-4">
        <div className="col-lg-3">
          <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>

        <div className="col-lg-9">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h2 className="h4 mb-1">Available Books</h2>
                <p className="text-muted mb-0">Use the controls below to filter by category and sort by title.</p>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
                <div>
                  <label className="form-label mb-1" htmlFor="sortBy">Sort books</label>
                  <select
                    id="sortBy"
                    className="form-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="title">Title (A-Z)</option>
                    <option value="title_desc">Title (Z-A)</option>
                  </select>
                </div>

                <div className="pt-sm-4">
                  <CartSummary onOpenCart={() => setCartOpen(true)} />
                </div>
              </div>
            </div>
          </div>

          <BookList
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onOpenCart={() => setCartOpen(true)}
          />
        </div>
      </div>

      <CartOffcanvas isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default BooksPage;
