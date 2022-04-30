using System;
using System.Security.Claims;
using System.Security.Principal;

namespace server.Helpers
{
    public static class IdentityHelper
    {
        public static int GetRole(this IIdentity identity)
        {
            if (identity is null)
            {
                throw new ArgumentNullException(nameof(identity));
            }

            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimTypes.Role);

            if (claim == null)
                return 0;

            return Int16.Parse(claim.Value);
        }
        public static int GetId(this IIdentity identity)
        {
            if (identity is null)
            {
                throw new ArgumentNullException(nameof(identity));
            }

            ClaimsIdentity claimsIdentity = identity as ClaimsIdentity;
            Claim claim = claimsIdentity?.FindFirst(ClaimTypeHelper.Id);

            if (claim == null)
                return -1;
            return Int16.Parse(claim.Value);
        }
        
    }
}
