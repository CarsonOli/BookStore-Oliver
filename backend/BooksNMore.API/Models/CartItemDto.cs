namespace BooksNMore.API.Models
{
    public class CartItemDto
    {
        public int BookId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int ItemQuantity { get; set; }
        public decimal LineTotal => Price * ItemQuantity;
    }
}
