namespace TaskAssistantAPI.Resources
{
    public record Task (int Id, string Title, string Description, DateOnly DueDate, int Priority, string Category, string Status);

    public record UserInfo (string FirstName, string LastName, string UserName, string Email, string Password);

}
