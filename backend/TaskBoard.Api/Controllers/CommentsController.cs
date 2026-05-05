using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.Models;

namespace TaskBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("task/{taskId}")]
        public async Task<IActionResult> GetComments(int taskId)
        {
            var comments = await _context.Comments
                .Where(c => c.TaskId == taskId)
                .ToListAsync();

            return Ok(comments);
        }


        [HttpPost]
        public async Task<IActionResult> AddComment(Comment comment)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(comment);
        }
    }
}