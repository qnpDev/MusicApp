using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using server.Helpers;
using server.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IConfiguration config;

        public AuthController(IConfiguration config)
        {
            this.config = config;
        }

        public class SigninUserModel
        {
            public string username { get; set; }
            public string password { get; set; }
        }

        [HttpPost("signin")]
        public IActionResult Login([FromBody] SigninUserModel signinUser)
        {
            if(signinUser.username == null || signinUser.password == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Invalid Username or password!"
                });
            }
            using (var context = new MusicContext())
            {
                var check = (from u in context.Users
                             where u.Username == signinUser.username
                                 && u.Password == encrypt(signinUser.password)
                             select u).FirstOrDefault();
                if(check == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Username or password incorrect!"
                    });
                }
                else
                {
                    string refreshToken = GenerateRefreshToken(check.Id, check.Roles);
                    context.RefreshTokens.Add(new Models.RefreshToken()
                    {   
                        UserId = check.Id,
                        Token = refreshToken,
                        ExpiredAt = DateTime.UtcNow.AddDays(30),
                    });
                    context.SaveChanges();

                    return Ok(new
                    {
                        success = true,
                        message = "Authenticate success",
                        token = GenerateToken(check.Id, check.Roles),
                        refreshToken,
                        userId = check.Id,
                        userAvatar = check.Avatar,
                        userLocalAvatar = check.LocalAvatar,
                        userRole = check.Roles,
                    });
                }
            }
        }

        public class RefreshTokenModel
        {
            public string refreshToken { get; set; }
        }

        [HttpPost("refreshToken")]
        public IActionResult RefreshToken([FromBody] RefreshTokenModel rf)
        {
            if (rf.refreshToken == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Invalid refreshtoken"
                });
            }


            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var symmetric = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:RefreshTokenKey"]));
            var tokenParameter = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                //tự cấp token
                ValidateIssuer = false,
                ValidateAudience = false,

                //ký vào token
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = symmetric,
                ClockSkew = TimeSpan.Zero,

            };

            try
            {
                jwtTokenHandler.ValidateToken(rf.refreshToken, tokenParameter, out SecurityToken securityToken);
                var jwtToken = (JwtSecurityToken)securityToken;
                int rid = Int16.Parse(jwtToken.Claims.First(claim => claim.Type == ClaimTypeHelper.Id).Value);

                MusicContext context = new MusicContext();
                var checku = (from r in context.Users
                         where r.Id == rid
                         select r).FirstOrDefault();
                if(checku == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "invalid user!"
                    });
                }
                int rroles = checku.Roles;
                //int rroles = Int16.Parse(jwtToken.Claims.First(claim => claim.Type == "role").Value);
                //System.Diagnostics.Debug.WriteLine("rid " + rid);

                    var check = (from u in context.RefreshTokens
                                where u.UserId == rid && u.Token == rf.refreshToken
                                select u).FirstOrDefault();
                    if(check == null)
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "invalid refreshToken!"
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = true,
                            accessToken = GenerateToken(rid, rroles)
                        });
                    }
                
            }
            catch
            {
                return Ok(new
                {
                    success = false,
                    message = "invalid refreshToken!"
                });
            }
            
        }

        public class SignupUserModel
        {
            public string username { get; set; }
            public string password { get; set; }
            public string name { get; set; }
            public string email { get; set; }
        }

        [HttpPost("signup")]
        public IActionResult SignUp([FromBody] SignupUserModel signupUser)
        {
            using (var context = new MusicContext())
            {
                var check = (from s in context.Users
                             where s.Username == signupUser.username
                             select s).Count();
                if (check > 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Username already exists!"
                    });
                }
                else
                {
                    context.Users.Add(new Models.User()
                    {
                        Username = signupUser.username,
                        Password = encrypt(signupUser.password),
                        Roles = 0,
                        Name = signupUser.name,
                        Email = signupUser.email,
                    });
                    context.SaveChanges();

                    var user = (from u in context.Users
                                where u.Username == signupUser.username && u.Password == encrypt(signupUser.password)
                                select u).FirstOrDefault();

                    string refreshToken = GenerateRefreshToken(user.Id, user.Roles);
                    context.RefreshTokens.Add(new Models.RefreshToken()
                    {
                        UserId = user.Id,
                        Token = refreshToken,
                        ExpiredAt = DateTime.UtcNow.AddDays(30),
                    });
                    context.SaveChanges();

                    return Ok(new
                    {
                        success = true,
                        message = "Signup success!",
                        token = GenerateToken(user.Id, user.Roles),
                        refreshToken,
                        userId = user.Id,
                        userAvatar = user.Avatar,
                        userLocalAvatar = user.LocalAvatar,
                        userRole = user.Roles,
                    });
                }
            }
        }

        public class SignOutModel
        {
            public string refreshToken { get; set; }
        }

        [HttpPost("signout")]
        [Authorize]
        public IActionResult SignOut([FromBody] SignOutModel rf)
        {
            int id = User.Identity.GetId();
            using(var context = new MusicContext())
            {
                var check = (from u in context.RefreshTokens
                             where u.UserId == id && u.Token == rf.refreshToken
                             select u).FirstOrDefault();
                context.RefreshTokens.Remove(check);
                context.SaveChanges();
                return Ok(new
                {
                    success = true,
                    message = "Logout success!"
                });
            }
        }
        public class AuthVerifyModel
        {
            public string token { set; get; }
        }
        [HttpPost("verify")]
        //[Authorize]
        public IActionResult VerifiUser([FromBody] AuthVerifyModel rf)
        {
            if (rf.token == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Invalid token"
                });
            }


            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var symmetric = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:TokenKey"]));
            var tokenParameter = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                //tự cấp token
                ValidateIssuer = false,
                ValidateAudience = false,

                //ký vào token
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = symmetric,
                ClockSkew = TimeSpan.Zero,

            };

            try
            {
                jwtTokenHandler.ValidateToken(rf.token, tokenParameter, out SecurityToken securityToken);
                var jwtToken = (JwtSecurityToken)securityToken;
                int rid = Int16.Parse(jwtToken.Claims.First(claim => claim.Type == ClaimTypeHelper.Id).Value);

                using (var context = new MusicContext())
                {
                    var check = (from u in context.Users
                                 where u.Id == rid
                                 select u).FirstOrDefault();
                    if (check == null)
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "invalid!",
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = true,
                            userId = check.Id,
                            userAvatar = check.Avatar,
                            userRole = check.Roles,
                            userLocalAvatar = check.LocalAvatar,
                        });
                    }
                }

            }
            catch
            {
                return Ok(new
                {
                    success = false,
                    message = "invalid!"
                });
            }
        }


            private string GenerateToken(int id, int roles)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:TokenKey"]));

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypeHelper.Id, id.ToString()),
                    new Claim("role", roles.ToString()),
                    new Claim(ClaimTypes.Role, roles.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(5),
                SigningCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256)
            };
            var token = jwtTokenHandler.CreateToken(tokenDescription);

            return jwtTokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken(int id, int roles)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:RefreshTokenKey"]));

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypeHelper.Id, id.ToString()),
                    new Claim("role", roles.ToString()),
                    new Claim(ClaimTypes.Role, roles.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256)
            };
            var token = jwtTokenHandler.CreateToken(tokenDescription);

            return jwtTokenHandler.WriteToken(token);
        }

        private string encrypt(string original)
        {
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();

            byte[] bHash = md5.ComputeHash(Encoding.UTF8.GetBytes(original));

            StringBuilder sbHash = new StringBuilder();

            foreach (byte b in bHash)
            {
                sbHash.Append(String.Format("{0:x2}", b));
            }

            return sbHash.ToString();
        }
    }
}
