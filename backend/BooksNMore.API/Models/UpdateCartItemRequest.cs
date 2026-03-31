namespace BooksNMore.API.Models
{
    public class UpdateCartItemRequest
    {
        public int BookId { get; set; }
        public int ItemQuantity { get; set; }
    }
}
