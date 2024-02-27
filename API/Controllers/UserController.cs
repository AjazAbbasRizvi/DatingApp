using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.EntitiesorModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/User
    public class UserController : ControllerBase
    {
        private readonly DataContex _dbcontex;
        public UserController(DataContex contex)
        {
            _dbcontex = contex;
        }

        [HttpGet]

        public async Task <ActionResult<IEnumerable<AppUser>>> GetUSer()
        {
            var user = await _dbcontex.Users.ToListAsync();
            return Ok(user);
        }

        [HttpGet]
        [Route("{id}")] // api/User/id

        public async Task<ActionResult<AppUser>> GetUSerById(int id){
            return await _dbcontex.Users.FindAsync(id);
        }


    }
}