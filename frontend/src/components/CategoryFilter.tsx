import { useEffect, useState } from 'react';
import './CategoryFilter.css';

function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:5000/api/Book/GetCategories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body category-filter">
        <h5 className="card-title">Book Categories</h5>

        <div className="category-list">
          <div className="category-item">
            <input
              type="radio"
              id="all-categories"
              name="book-category"
              value="All"
              checked={selectedCategory === 'All'}
              onChange={(event) => setSelectedCategory(event.target.value)}
            />
            <label htmlFor="all-categories">All Categories</label>
          </div>

          {categories.map((category) => (
            <div key={category} className="category-item">
              <input
                type="radio"
                id={category}
                name="book-category"
                value={category}
                checked={selectedCategory === category}
                onChange={(event) => setSelectedCategory(event.target.value)}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryFilter;
