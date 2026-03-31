import { useState } from "react";
import BookList from "../components/BookList";
import CategoryFilter from "../components/CategoryFilter";
import WelcomeBand from "../components/WelcomeBand";
import CartSummary from "../components/CartSummary";

function BooksPage () {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    return (
        <div className='container mt-4'>
            <CartSummary />
            <WelcomeBand />
            <div className='row'>
                <div className='col-md-3'>
                <CategoryFilter setSelectedCategories={setSelectedCategories} selectedCategories={selectedCategories}/>
                </div>
                <div className='col-md-9'>
                <BookList selectedCategories={selectedCategories}/>
                </div>
            </div>
        </div>
    );
}

export default BooksPage;