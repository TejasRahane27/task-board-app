using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Api.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required] 
        public int ProjectId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;
          public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public string Priority { get; set; } = "Low";
        public string Status { get; set; } = "Todo";

        public DateTime? DueDate { get; set; }

        public Project? Project { get; set; }
        public List<Comment>? Comments { get; set; }
    }
}