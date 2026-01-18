using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TaskAssistantAPI.Models
{
    public class TaskAssistantDbContext : IdentityDbContext<ApplicationUser>
    {
        public TaskAssistantDbContext() { }

        public TaskAssistantDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure foreign-key relationship
            builder.Entity<Task>()
            .HasOne(o => o.User)
            .WithMany(u => u.Tasks)
            .HasForeignKey(o => o.ApplicationUserId);
        }
        public DbSet<Task> Tasks { get; set; }
    }
}
