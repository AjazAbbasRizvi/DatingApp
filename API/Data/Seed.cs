using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.EntitiesorModels;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public static  class Seed
    {
        public static async Task SeedUsers( DataContex context)
        {
            if (await context.Users.AnyAsync())
            {   
                return;
            }

            else
            {
                var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

                var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

                var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

                foreach (var user in users)
                {
                    using var hmac = new HMACSHA512();

                    user.UserName = user.UserName.ToLower();
                    user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Password"));
                    user.PasswordSalt = hmac.Key;

                    context.Users.Add(user);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}