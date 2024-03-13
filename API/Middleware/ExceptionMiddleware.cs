using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware
{

    public class ExceptionMiddleware
    {

        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        //RequestDeligate is used to tell framework to which mmiddleware we have to go to next once this one is done;
        // ILogger it is used to log the error

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        // InvokeAsync is a  Methods that is  used to tell framework that this a method inside a middleware 

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                //in this part we are in the try block if no error occurs the _next pass the request to the next middleware
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                if (_env.IsDevelopment())
                {
                    var response = new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString());
                    var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                    var json = JsonSerializer.Serialize(response, options);
                    await context.Response.WriteAsync(json);
                }
                else
                {
                    var response = new ApiException(context.Response.StatusCode, ex.Message, "Internal Sever Error");
                    var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                    var json = JsonSerializer.Serialize(response, options);
                    await context.Response.WriteAsync(json);
                }
            }
        }


    }
}