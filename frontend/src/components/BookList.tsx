import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({selectedCategories}: {selectedCategories: string[]}) {

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {

            const categoryParams = selectedCategories.map((cat) => `bookCategories=${encodeURIComponent(cat)}`).join('&')
            const response = await fetch(`https://localhost:5000/api/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`);
            const data = await response.json();
            setBooks(data.books);
            setTotalItems(data.totalBooks);
            setTotalPages(Math.ceil(totalItems / pageSize))
        };

        fetchBooks();
    }, [pageSize, pageNum, totalItems, selectedCategories]);

    return (
        <>
            <br />
            {books.map((b) => (
                <div id="bookCard" className="card" key={b.bookId}>
                    <h3 className="card-title">{b.title}</h3>
                    <div className="card-body">
                        <ul className="list-unstyled">
                            <li><strong>Author: </strong>{b.author}</li>
                            <li><strong>Category: </strong>{b.category}</li>
                            <li><strong>Classification: </strong>{b.classification}</li>
                            <li><strong>Publisher: </strong>{b.publisher}</li>
                            <li><strong>ISBN: </strong>{b.isbn}</li>
                            <li><strong>Page Count: </strong>{b.pageCount}</li>
                            <li><strong>Price: $</strong>{b.price}</li>
                        </ul>

                        <button className="btn btn-success" onClick={() => navigate(`/purchase/${b.title}/${b.bookId}/${b.price}`)}>Add to Cart</button>
                    </div>
                </div>
            ))}
            <div>
                <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>Previous</button>

                {[...Array(totalPages)].map((_, index) => (
                    <button key={index + 1} onClick={() => setPageNum(index + 1)} disabled={pageNum === (index + 1)}>{index + 1}</button>
                ))}

                <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>
            </div>
            <br />
            <label>
                Results per page:
                <select value={pageSize} onChange={(p) => {
                                            setPageSize(Number(p.target.value));
                                            setPageNum(1)}}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>
        </>
    );
}

export default BookList;