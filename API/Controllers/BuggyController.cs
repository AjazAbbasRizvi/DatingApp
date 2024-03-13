using API.Data;
using API.EntitiesorModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BuggyController : ControllerBase
    {
        private readonly DataContex _dbcontext;

        public BuggyController(DataContex contex)
        {
            _dbcontext = contex;
        }

        [Authorize]
        [HttpGet]
        [Route("auth")]

        public ActionResult<string> GetSecret()
        {
            return "secret key";
        }


        [HttpGet]
        [Route("not-found")]

        public ActionResult<AppUser> GetNotFound()
        {

            var thing = _dbcontext.Users.Find(-1);
            if (thing == null)
            {
                return NotFound();
            }

            return thing;
        }

        [HttpGet]
        [Route("server-error")]

        public ActionResult<string> GetServerError()
        {
            var thing = _dbcontext.Users.Find(-1);
            var thingToReturn = thing.ToString();
            return thingToReturn;
        }


        [HttpGet]
        [Route("bad-request")]

        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("This is a bad request");
        }
    }
}