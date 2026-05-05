using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskBoard.Api.Data;
using TaskBoard.Api.Models;

namespace TaskBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult> GetProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.Tasks)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,

                    todoCount = p.Tasks.Count(t => t.Status == "Todo"),
                    inProgressCount = p.Tasks.Count(t => t.Status == "InProgress"),
                    doneCount = p.Tasks.Count(t => t.Status == "Done")
                })
                .ToListAsync();

            return Ok(projects);
        }

       
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound(new { message = "Project not found" });

            return Ok(project);
        }

        
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            if (string.IsNullOrWhiteSpace(project.Name))
                return BadRequest(new { name = "Project name is required" });

            project.CreatedAt = DateTime.UtcNow;
            project.UpdatedAt = DateTime.UtcNow;

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

       
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, Project updatedProject)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                return NotFound(new { message = "Project not found" });

            if (string.IsNullOrWhiteSpace(updatedProject.Name))
                return BadRequest(new { name = "Project name is required" });

            project.Name = updatedProject.Name;
            project.Description = updatedProject.Description;
            project.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ================= DELETE PROJECT =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
                return NotFound(new { message = "Project not found" });

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}