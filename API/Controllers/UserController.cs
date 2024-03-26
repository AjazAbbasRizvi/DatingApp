using System.Security.Claims;
using API.Dtos;
using API.EntitiesorModels;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")] // /api/User

    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        private readonly IPhotoService _photoService;
        public UserController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }


        [HttpGet]

        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var currentUser = await _userRepository.GetUserByUsernameAsync(username);
            userParams.CurrentUsername = currentUser.UserName;

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = currentUser.Gender == "male" ? "female" : "male";
            }

            var users = await _userRepository.GetUserAsync(userParams);
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));

            // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            return Ok(users);
        }

        [HttpGet]
        [Route("{username}")] // api/User/username

        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);

            return _mapper.Map<MemberDto>(user);
        }

        [HttpPut]

        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
            {
                return NotFound();
            }
            else
            {
                _mapper.Map(memberUpdateDto, user);
            }

            if (await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }
            else
            {
                return BadRequest("failed to update User");
            }
        }

        [HttpPost]
        [Route("add-photo")]

        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
            {
                return NotFound();
            }

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                // return _mapper.Map<PhotoDto>(photo);
                return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }
            else
            {
                return BadRequest("Problem Uploading Photos");
            }


        }

        [HttpPut]
        [Route("set-main-photo/{photoId}")]

        public async Task<ActionResult> setMainPhoto(int photoId)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null)
            {
                return NotFound();
            }

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null)
            {
                return NotFound();
            }

            if (photo.IsMain)
            {
                return BadRequest("This is your main photo already");
            }

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null)
            {
                currentMain.IsMain = false;
            }
            photo.IsMain = true;

            if (await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }

            else
            {
                return BadRequest("Problem Setting Up the Photo");
            }
        }

        [HttpDelete]
        [Route("delete-photo/{photoId}")]

        public async Task<ActionResult> DeletePhoto(int photoId)
        {

            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null)
            {
                return NotFound();
            }

            if (photo.IsMain)
            {
                return BadRequest("Unable to delete main Photo");
            }

            if (photo.PublicId == null)
            {
                return BadRequest("Problem Deleting the Photo please try again later");
            }
            else
            {
                var result = await _photoService.DeletePhoto(photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            user.Photos.Remove(photo);

            if (await _userRepository.SaveAllAsync())
            {
                return Ok();
            }

            return BadRequest("Unable to delete the photo");
        }


    }
}