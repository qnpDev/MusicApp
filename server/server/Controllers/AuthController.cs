using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using server.Helpers;
using server.Helpers.Pattern.ResetPwSingleton;
using server.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mail;
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
                             select s).FirstOrDefault();
                var checkEmail = (from s in context.Users
                                  where s.Email == signupUser.email
                                  select s).FirstOrDefault();
                if (check != null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Username already exists!"
                    });
                } else if(checkEmail != null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Email already exists!"
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
                        Avatar = "default-avatar-music.jpg",
                        LocalAvatar = 1,
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
            public int id { get; set; }
        }

        [HttpPost("signout")]
        //[Authorize]
        public IActionResult SignOut([FromBody] SignOutModel rf)
        {
            //int id = User.Identity.GetId();
            int id = rf.id;
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
                jwtTokenHandler.ValidateToken(rf.token, tokenParameter, out SecurityToken securityToken);
                var jwtToken = (JwtSecurityToken)securityToken;
                int rid = Int16.Parse(jwtToken.Claims.First(claim => claim.Type == ClaimTypeHelper.Id).Value);

                using (var context = new MusicContext())
                {
                    var checkToken = (from r in context.RefreshTokens
                                      where r.UserId == rid
                                         && r.Token == rf.token
                                      select r).FirstOrDefault();
                    if(checkToken == null)
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "invalid!",
                        });
                    }

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

        public class ResetModel
        {
            public string email { get; set; }
            public string url { get; set; }
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetModel rm)
        {
            if (rm.email.Trim().Length == 0)
            {
                return Ok(new
                {
                    success = false,
                    message = "Enter email!",
                });
            }
            string resetToken = "";
            using (var db = new MusicContext())
            {
                var check = (from r in db.Users
                         where r.Email == rm.email
                         select r).FirstOrDefault();
                if (check == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "This email have no account!",
                    });
                }
                resetToken = GenerateResetToken(check.Id);
            }

            string url = rm.url + "/" + resetToken;

            System.Net.Mail.MailMessage mail = new();
            mail.To.Add(rm.email);
            mail.From = new MailAddress("qnptesting@gmail.com", "qnp Music App", System.Text.Encoding.UTF8);
            mail.Subject = "qnp Music App | Reset Password";
            mail.SubjectEncoding = System.Text.Encoding.UTF8;
            mail.Body = "<h1 style=\"text-align: center;\">qnp Music App</h1>"
                             + "<p style=\"text-align: center;\"> Bạn đã yêu cầu đặt mật khẩu </p>"
                             + "<p> Mã yêu cầu: <b>"+ resetToken.Substring(resetToken.Length - 6) +"</b></p>"
                             + "<p> Địa chỉ đặt lại: <b><a href=\"" + url + "\">click here</a></b></p>"
                             + "<p> Hoặc truy cập: <b>" + url + "</b></p>"
                             + "<small>Link chỉ có thời hạn trong vòng 5 phút và chỉ sử dụng một lần. Vui lòng truy cập vào link trên để đặt lại mật khẩu</small>"
                             ;
            mail.BodyEncoding = System.Text.Encoding.UTF8;
            mail.IsBodyHtml = true;
            mail.Priority = MailPriority.High;

            SmtpClient client = new();
            client.Credentials = new System.Net.NetworkCredential("qnptesting@gmail.com", "Quinguyen201");
            client.Port = 587;
            client.Host = "smtp.gmail.com";
            client.EnableSsl = true;

            try
            {
                client.Send(mail);
                ResetPw dataList = ResetPw.GetInstance;
                dataList.Add(new ResetPwModel()
                {
                    token = resetToken,
                    createdAt = DateTime.Now
                });
                dataList.RemoveDie();
                return Ok(new
                {
                    success = true,
                    message = "Send successful!"
                });
            }
            catch (Exception)
            {
                return Ok(new
                {
                    success = false,
                    message = "Can not send mail!"
                });
            }
        }

        [HttpGet("reset-password/verify")]
        public IActionResult ResetPasswordVerify(string token)
        {
            if(token.Trim().Length == 0)
            {
                return Ok(new
                {
                    success = false,
                    message = "Invalid token"
                });
            }
            ResetPw dataList = ResetPw.GetInstance;
            var check = dataList.Get(token);
            if (check == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Invalid token"
                });
            }

            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var symmetric = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:ResetTokenKey"]));
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
                jwtTokenHandler.ValidateToken(token, tokenParameter, out SecurityToken securityToken);
                var jwtToken = (JwtSecurityToken)securityToken;
                var uid = jwtToken.Claims.First(claim => claim.Type == ClaimTypeHelper.Id).Value;

                if(uid == null || uid  == "")
                {
                    return Ok(new
                    {
                        success = false,
                        message = "invalid Token!"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Verified!"
                    });
                }

            }
            catch
            {
                return Ok(new
                {
                    success = false,
                    message = "invalid Token!"
                });
            }
        }

        public class ResetChangeModel
        {
            public string token { get; set; }
            public string password { get; set; }
        }
        [HttpPost("reset-password/change")]
        public IActionResult ResetPasswordChange([FromBody] ResetChangeModel rm)
        {
            if (rm.token.Trim().Length == 0 || rm.password.Trim().Length == 0)
            {
                return Ok(new
                {
                    success = false,
                    message = "Invalid token or password"
                });
            }


            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var symmetric = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:ResetTokenKey"]));
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
                jwtTokenHandler.ValidateToken(rm.token, tokenParameter, out SecurityToken securityToken);
                var jwtToken = (JwtSecurityToken)securityToken;
                int uid = Int16.Parse(jwtToken.Claims.First(claim => claim.Type == ClaimTypeHelper.Id).Value);

                using (var context = new MusicContext())
                {
                    var check = (from u in context.Users
                                 where u.Id == uid
                                 select u).FirstOrDefault();
                    if (check == null)
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "invalid User!",
                        });
                    }
                    else
                    {
                        check.Password = encrypt(rm.password);
                        if(context.SaveChanges() > 0)
                        {
                            ResetPw dataList = ResetPw.GetInstance;
                            dataList.Remove(rm.token);
                            return Ok(new
                            {
                                success = true,
                                message = "Reset successful!"
                            });
                        }
                        else
                        {
                            return Ok(new
                            {
                                success = false,
                                message = "Reset false!"
                            });
                        }
                        
                    }
                }

            }
            catch
            {
                return Ok(new
                {
                    success = false,
                    message = "invalid Token!"
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

        private string GenerateResetToken(int id)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["AppSettings:ResetTokenKey"]));

            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypeHelper.Id, id.ToString()),
                }),
                Expires = DateTime.UtcNow.AddMinutes(5),
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
