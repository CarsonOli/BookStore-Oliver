using BooksNMore.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BooksNMore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _context;
        public BookController(BookDbContext temp) => _context = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, [FromQuery] List<string>? bookCategories = null)
        {
            var query = _context.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(x => bookCategories.Contains(x.Category));
            }

            var totalBooks = query.Count();

            var book = query.Skip((pageNum-1) * pageSize).Take(pageSize).ToList();

            var someObject = new
            {
                TotalBooks = totalBooks,
                Books = book
            };

            return Ok(someObject);
        }

        [HttpGet("GetCategories")]
        public IActionResult GetCategories ()
        {
            var categories = _context.Books.Select(x => x.Category).Distinct().ToList();
            return Ok(categories);
        }
    }
}
