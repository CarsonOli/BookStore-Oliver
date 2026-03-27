using BooksNMore.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BooksNMore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _context;
        public BookController(BookDbContext temp) => _context = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1)
        {
            var book = _context.Books.Skip((pageNum-1) * pageSize).Take(pageSize).ToList();

            var totalBooks = _context.Books.Count();

            var someObject = new
            {
                TotalBooks = totalBooks,
                Books = book
            };

            return Ok(someObject);
        }
    }
}
