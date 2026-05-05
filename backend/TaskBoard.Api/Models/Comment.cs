using System.ComponentModel.DataAnnotations;
using TaskBoard.Api.Models;

public class Comment
{
    public int Id { get; set; }

    [Required]
    public string Author { get; set; } = string.Empty;

    [Required]
    public string Body { get; set; } = string.Empty;

    public int TaskId { get; set; }

    public TaskItem? Task { get; set; }
}