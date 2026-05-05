using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Api.Models;

public class Project
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = "";

    [Required]
    public string Description { get; set; } = "";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
     public DateTime UpdatedAt { get; set; }

    public List<TaskItem> Tasks { get; set; } = new(); 
}