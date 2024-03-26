using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.EntitiesorModels;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {

        // there are multiple types of to encrypt and decrypt the 
        //data but advantage of SymmetricSecurityKey that one key is used both for encryption and decryption

        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public string CreateToken(AppUser appUser)
        {

            //claims are information which a user claim

            var claims = new List<Claim>{
                new Claim(JwtRegisteredClaimNames.NameId, appUser.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, appUser.UserName)
            };

            // Key Encription

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            //Descripting the content of the token

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            // Handling the Token 

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}