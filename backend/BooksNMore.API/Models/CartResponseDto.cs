namespace BooksNMore.API.Models
{
    public class CartResponseDto
    {
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public int ItemCount { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
