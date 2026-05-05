using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;

namespace TaskBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        
        public async Task<IActionResult> GetDashboard()
        
        {
           var totalProjects = await _context.Projects.CountAsync(); 
           
            var totalTasks = await _context.Tasks.CountAsync();

            var todo = await _context.Tasks.CountAsync(t => t.Status == "Todo");
            var inProgress = await _context.Tasks.CountAsync(t => t.Status == "InProgress");
            var done = await _context.Tasks.CountAsync(t => t.Status == "Done");

            var overdue = await _context.Tasks
                .CountAsync(t => t.DueDate != null && t.DueDate < DateTime.Now && t.Status != "Done");

            var upcoming = await _context.Tasks
                .Where(t => t.DueDate != null && t.DueDate >= DateTime.Now)
                .OrderBy(t => t.DueDate)
                .Take(5)
                .ToListAsync();

            return Ok(new
            {
                   totalProjects = totalProjects, 
                totalTasks,
                tasksByStatus = new
                {
                    todo,
                    inProgress,
                    done
                },
                overdueCount = overdue,
                upcomingTasks = upcoming
            });
        }
    }
}