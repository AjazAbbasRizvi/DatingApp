using API.Dtos;
using API.EntitiesorModels;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<bool> SaveAllAsync();
        Task<PagedList<MemberDto>> GetUserAsync(UserParams userParams);
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
    }
}