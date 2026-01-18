using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using System.Security.Claims;
using TaskAssistantAPI.Models;

namespace TaskAssistantAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private TaskAssistantDbContext _context;

        public TaskController(TaskAssistantDbContext context)
        {
            _context = context;
        }

        // GET: api/<TaskController>
        [HttpGet]
        [ProducesResponseType<IEnumerable<Resources.Task>>(StatusCodes.Status200OK)]
        public async Task<IActionResult> Get()
        {
            var response = _context.Tasks.ProjectToType<Resources.Task>().AsAsyncEnumerable();
            return Ok(response);
        }

        // GET api/<TaskController>/5
        [HttpGet("{id}")]
        [ProducesResponseType<Resources.Task>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            var response = task.Adapt<Resources.Task>();
            return Ok(response);
        }

        // GET api/<TaskController>/5
        [HttpGet("UserTasks")]
        [ProducesResponseType<IList<Resources.Task>>(StatusCodes.Status200OK)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<Resources.Task>>> GetUserTasks()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Problem("Problem getting user task", statusCode: StatusCodes.Status500InternalServerError);
            }

            var query = await _context.Tasks.Where(t => t.ApplicationUserId == userId).ToListAsync();
            var response = query.Adapt<List<Resources.Task>>();

            return Ok(response);
        }

        // POST api/<TaskController>
        [HttpPost]
        [ProducesResponseType<Resources.Task>(StatusCodes.Status201Created)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status400BadRequest)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Post([FromBody] Resources.Task value)
        {
            if (!ModelState.IsValid)
            {
                return Problem("Invalid task resource request", statusCode: StatusCodes.Status400BadRequest);
            }
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    throw new ArgumentNullException(nameof(userId));

                var task = value.Adapt<Models.Task>();
                task.ApplicationUserId = userId;

                await _context.Tasks.AddAsync(task);
                await _context.SaveChangesAsync();

                var response = task.Adapt<Resources.Task>();

                return CreatedAtAction(nameof(Get), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                return Problem("Problem persisting task resource", statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        // PUT api/<TaskController>/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType<Resources.Task>(StatusCodes.Status204NoContent)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status400BadRequest)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Put(int id, [FromBody] Resources.Task value)
        {
            if (!ModelState.IsValid)
            {
                return Problem("Invalid task resource request", statusCode: StatusCodes.Status400BadRequest);
            }
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    throw new ArgumentNullException(nameof(userId));

                var task = value.Adapt<Models.Task>();
                task.Id = id;
                task.ApplicationUserId = userId;

                _context.Entry<Models.Task>(task).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();

            }
            catch (DbUpdateConcurrencyException dbEx)
            {
                var task = _context.Tasks.Find(id);
                if (task == null)
                {
                    return NotFound();
                }
                else
                {
                    return Problem("DBUpdateConcurrencyException occured", statusCode: StatusCodes.Status500InternalServerError);
                }
            }
            catch (Exception ex)
            {
                return Problem("Problem persisting task resource", statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        // PATCH api/<TaskController>/5
        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType<Resources.Task>(StatusCodes.Status204NoContent)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status400BadRequest)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Patch(int id, [FromBody] JsonPatchDocument<Resources.Task> value)
        {
            if (!ModelState.IsValid)
            {
                return Problem("Invalid task resource request", statusCode: StatusCodes.Status400BadRequest);
            }
            try
            {
                var dbTask = await _context.Tasks.FindAsync(id);
                if (dbTask == null)
                {
                    return NotFound();
                }

                var task = dbTask.Adapt<Resources.Task>();
                //apply the patch changes
                value.ApplyTo(task, ModelState);

                var patchedTask = task.Adapt<Models.Task>();
                _context.Entry<Models.Task>(dbTask).CurrentValues.SetValues(patchedTask);

                await _context.SaveChangesAsync();
                return NoContent();

            }
            catch (Exception ex)
            {
                return Problem("Problem persisting task resource", statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        // DELETE api/<TaskController>/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType<Resources.Task>(StatusCodes.Status204NoContent)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete(int id)
        {
            var dbEmployee = await _context.Tasks.FindAsync(id);
            if (dbEmployee == null)
            {
                return NotFound();
            }

            try
            {
                _context.Tasks.Remove(dbEmployee);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return Problem("Problem deleting task resource", statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        
    }
}
