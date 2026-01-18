namespace TaskAssistantAPI.Models
{
    public class Task
    {

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateOnly DueDate { get; set; }
        public int Priority {  get; set; }
        public string Category { get; set; }
        public string Status { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser User { get; set; }

    }
}
