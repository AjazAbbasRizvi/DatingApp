using API.Data;
using API.EntitiesorModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/User

    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly DataContex _dbcontex;
        public UserController(DataContex contex)
        {
            _dbcontex = contex;
        }

        [AllowAnonymous]
        [HttpGet]

        public async Task<ActionResult<IEnumerable<AppUser>>> GetUSer()
        {
            var user = await _dbcontex.Users.ToListAsync();
            return Ok(user);
        }

        [HttpGet]
        [Route("{id}")] // api/User/id

        public async Task<ActionResult<AppUser>> GetUSerById(int id)
        {
            return await _dbcontex.Users.FindAsync(id);
        }


    }
}