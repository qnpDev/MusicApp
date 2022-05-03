using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteStrategy
{
    public class DeleteFile
    {
        private IDelete idelete;
        public DeleteFile(IDelete idelete)
        {
            this.idelete = idelete;
        }
        public void Delete(string fileName)
        {
            this.idelete.Delete(fileName);
        }
    }
}
