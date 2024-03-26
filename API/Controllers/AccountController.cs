using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Dtos;
using API.EntitiesorModels;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DataContex _dbcontext;

        private readonly ITokenService _tokenService;

        private readonly IMapper _mapper;

        public AccountController(DataContex contex, ITokenService tokenService, IMapper mapper)
        {
            _dbcontext = contex;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("register")]

        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (await UserExist(registerDto.UserName))
            {
                return BadRequest("Oops Username is Taken! Please choose another Username");
            }

            var user = _mapper.Map<AppUser>(registerDto);

            using var hmac = new HMACSHA512();

            user.UserName = registerDto.UserName.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;


            _dbcontext.Users.Add(user);
            await _dbcontext.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        private async Task<bool> UserExist(string username)
        {
            return await _dbcontext.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
        }

        [HttpPost]
        [Route("login")]

        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _dbcontext.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.UserName == loginDto.UserName.ToLower());

            if (user == null)
            {
                return Unauthorized("Invalid User Name");
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computeHash.Length; i++)
            {
                if (computeHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("Incorrect Password");
                }
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }
    }
}