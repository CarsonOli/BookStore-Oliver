using BooksNMore.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BooksNMore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BookController(BookDbContext temp) => _context = temp;

        [HttpGet("AllBooks")]
        public async Task<IActionResult> GetBooks(
            int pageSize = 10,
            int pageNum = 1,
            [FromQuery] List<string>? bookCategories = null,
            string sortBy = "default")
        {
            if (pageSize <= 0)
            {
                pageSize = 10;
            }

            if (pageNum <= 0)
            {
                pageNum = 1;
            }

            IQueryable<Book> query = _context.Books.AsNoTracking();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(x => bookCategories.Contains(x.Category));
            }

            query = sortBy.ToLowerInvariant() switch
            {
                "title_asc" => query.OrderBy(x => x.Title),
                "title_desc" => query.OrderByDescending(x => x.Title),
                _ => query
            };

            var totalBooks = await query.CountAsync();

            var books = await query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalBooks = totalBooks,
                Books = books
            });
        }

        [HttpGet("GetCategories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Books
                .AsNoTracking()
                .Select(x => x.Category)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync();

            return Ok(categories);
        }
    }
}