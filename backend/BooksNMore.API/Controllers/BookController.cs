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

        [HttpGet("AdminBooks")]
        public async Task<IActionResult> GetAdminBooks()
        {
            var books = await _context.Books
                .AsNoTracking()
                .OrderBy(x => x.Title)
                .ToListAsync();

            return Ok(books);
        }

        [HttpPost("AddBook")]
        public async Task<IActionResult> AddBook([FromBody] Book book)
        {
            var validationError = ValidateBook(book);

            if (validationError != null)
            {
                return BadRequest(validationError);
            }

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(book);
        }

        [HttpPut("UpdateBook/{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book updatedBook)
        {
            if (id != updatedBook.BookId)
            {
                return BadRequest("Book ID mismatch.");
            }

            var validationError = ValidateBook(updatedBook);

            if (validationError != null)
            {
                return BadRequest(validationError);
            }

            var existingBook = await _context.Books.FindAsync(id);

            if (existingBook == null)
            {
                return NotFound("Book not found.");
            }

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            await _context.SaveChangesAsync();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound("Book not found.");
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book deleted successfully." });
        }

        private static string? ValidateBook(Book book)
        {
            if (string.IsNullOrWhiteSpace(book.Title))
            {
                return "Title is required.";
            }

            if (string.IsNullOrWhiteSpace(book.Author))
            {
                return "Author is required.";
            }

            if (string.IsNullOrWhiteSpace(book.Publisher))
            {
                return "Publisher is required.";
            }

            if (string.IsNullOrWhiteSpace(book.ISBN))
            {
                return "ISBN is required.";
            }

            if (string.IsNullOrWhiteSpace(book.Classification))
            {
                return "Classification is required.";
            }

            if (string.IsNullOrWhiteSpace(book.Category))
            {
                return "Category is required.";
            }

            if (book.PageCount <= 0)
            {
                return "Page count must be greater than zero.";
            }

            if (book.Price <= 0)
            {
                return "Price must be greater than zero.";
            }

            return null;
        }
    }
}