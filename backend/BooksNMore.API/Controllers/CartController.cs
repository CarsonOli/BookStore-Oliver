using BooksNMore.API.Data;
using BooksNMore.API.Extensions;
using BooksNMore.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BooksNMore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private const string CartSessionKey = "bookstore_cart";
        private readonly BookDbContext _context;

        public CartController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCart()
        {
            var cart = GetCartItems();
            return Ok(BuildResponse(cart));
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            if (request.ItemQuantity <= 0)
            {
                return BadRequest("Quantity must be at least 1.");
            }

            var book = await _context.Books
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.BookId == request.BookId);

            if (book == null)
            {
                return NotFound("Book not found.");
            }

            var cart = GetCartItems();
            var existingItem = cart.FirstOrDefault(x => x.BookId == request.BookId);

            if (existingItem == null)
            {
                cart.Add(new CartItemDto
                {
                    BookId = book.BookId,
                    Title = book.Title,
                    Price = (decimal)book.Price,
                    ItemQuantity = request.ItemQuantity
                });
            }
            else
            {
                existingItem.ItemQuantity += request.ItemQuantity;
            }

            SaveCartItems(cart);
            return Ok(BuildResponse(cart));
        }

        [HttpPost("UpdateQuantity")]
        public IActionResult UpdateQuantity([FromBody] UpdateCartItemRequest request)
        {
            var cart = GetCartItems();
            var existingItem = cart.FirstOrDefault(x => x.BookId == request.BookId);

            if (existingItem == null)
            {
                return NotFound("Cart item not found.");
            }

            if (request.ItemQuantity <= 0)
            {
                cart.Remove(existingItem);
            }
            else
            {
                existingItem.ItemQuantity = request.ItemQuantity;
            }

            SaveCartItems(cart);
            return Ok(BuildResponse(cart));
        }

        [HttpPost("Remove/{bookId}")]
        public IActionResult RemoveFromCart(int bookId)
        {
            var cart = GetCartItems();
            var existingItem = cart.FirstOrDefault(x => x.BookId == bookId);

            if (existingItem != null)
            {
                cart.Remove(existingItem);
                SaveCartItems(cart);
            }

            return Ok(BuildResponse(cart));
        }

        [HttpPost("Clear")]
        public IActionResult ClearCart()
        {
            HttpContext.Session.Remove(CartSessionKey);
            return Ok(BuildResponse(new List<CartItemDto>()));
        }

        private List<CartItemDto> GetCartItems()
        {
            return HttpContext.Session.GetObject<List<CartItemDto>>(CartSessionKey) ?? new List<CartItemDto>();
        }

        private void SaveCartItems(List<CartItemDto> cart)
        {
            HttpContext.Session.SetObject(CartSessionKey, cart);
        }

        private static CartResponseDto BuildResponse(List<CartItemDto> cart)
        {
            return new CartResponseDto
            {
                Items = cart
                    .Select(x => new CartItemDto
                    {
                        BookId = x.BookId,
                        Title = x.Title,
                        Price = x.Price,
                        ItemQuantity = x.ItemQuantity
                    })
                    .ToList(),
                ItemCount = cart.Sum(x => x.ItemQuantity),
                TotalAmount = cart.Sum(x => x.LineTotal)
            };
        }
    }
}
