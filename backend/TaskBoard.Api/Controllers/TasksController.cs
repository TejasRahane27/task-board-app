using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.Models;

namespace TaskBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpGet]
        public async Task<ActionResult> GetTasks(
            int? projectId,
            string? search,
            int page = 1,
            int pageSize = 5)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 5;

            var query = _context.Tasks.AsQueryable();

      
            if (projectId.HasValue)
            {
                query = query.Where(t => t.ProjectId == projectId.Value);
            }

          
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();
                query = query.Where(t => t.Title.Contains(search));
            }

            var totalCount = await query.CountAsync();

            var tasks = await query
                .OrderByDescending(t => t.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    t.Priority,
                    t.Status,
                    t.DueDate,
                    t.ProjectId
                })
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                data = tasks
            });
        }

      
        [HttpGet("{id}")]
        public async Task<ActionResult> GetTask(int id)
        {
            var task = await _context.Tasks
                .Where(t => t.Id == id)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    t.Priority,
                    t.Status,
                    t.DueDate,
                    t.ProjectId
                })
                .FirstOrDefaultAsync();

            if (task == null)
                return NotFound(new { message = "Task not found" });

            return Ok(task);
        }

     
        [HttpPost]
        public async Task<ActionResult> CreateTask(TaskItem task)
        {
            if (string.IsNullOrWhiteSpace(task.Title))
                return BadRequest(new { title = "This field is required" });

            if (string.IsNullOrWhiteSpace(task.Description))
                return BadRequest(new { description = "This field is required" });

            task.CreatedAt = DateTime.UtcNow;
            task.UpdatedAt = DateTime.UtcNow;

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskItem updatedTask)
        {
            var existing = await _context.Tasks.FindAsync(id);

            if (existing == null)
                return NotFound(new { message = "Task not found" });

            if (string.IsNullOrWhiteSpace(updatedTask.Title))
                return BadRequest(new { title = "This field is required" });

            existing.Title = updatedTask.Title;
            existing.Description = updatedTask.Description;
            existing.Priority = updatedTask.Priority;
            existing.Status = updatedTask.Status;
            existing.DueDate = updatedTask.DueDate;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound(new { message = "Task not found" });

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}