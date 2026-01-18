using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskAssistantAPI.Models;

namespace TaskAssistantAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class ApplicationUserController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public ApplicationUserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId); // Gets user from the ClaimsPrincipal
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var response = user.Adapt<Resources.UserInfo>();
            return Ok(response);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("register")]
        [ProducesResponseType<string>(StatusCodes.Status201Created)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status400BadRequest)]
        [ProducesResponseType<ObjectResult>(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] Resources.UserInfo value)
        {
            if (!ModelState.IsValid)
            {
                return Problem("Invalid User resource request", statusCode: StatusCodes.Status400BadRequest);
            }
            try
            {
                var newUser = value.Adapt<ApplicationUser>();
                var result = await _userManager.CreateAsync(newUser, value.Password);
                if (result.Succeeded)
                {
                    return Ok("Registration successful");
                }
                else
                    return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                return Problem("Problem creating new user", statusCode: StatusCodes.Status500InternalServerError);
            }
        }
    }
}
