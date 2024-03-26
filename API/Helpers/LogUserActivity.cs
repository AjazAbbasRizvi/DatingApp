using System.Security.Claims;
using API.Interfaces;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Action Filters => Action filters help us to do some action before or after the execution of an api request, 
            // and we do these actions with the help of HttpContext provided by "context" and with the help of context 
            //we get the user details and also help us to get access to our services so that we can do the required actions.

            var resultContext = await next();

            // next => next provides us the option to do the action before api execution or after api execution
            // we want to do anaction after api execution then we call next() first and then action otherwise vice-versa

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated)
            {
                return;
            }

            var userId = resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
            var user = await repo.GetUserByIdAsync(int.Parse(userId));
            user.LastActive = DateTime.UtcNow;
            await repo.SaveAllAsync();

        }
    }
}