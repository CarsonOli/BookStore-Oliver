namespace BooksNMore.API.Models
{
    public class AddToCartRequest
    {
        public int BookId { get; set; }
        public int ItemQuantity { get; set; } = 1;
    }
}
