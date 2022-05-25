using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.LogCommand
{
    public class LogFile : ILogReceiver
    {
        private bool isEnabled = true;

        public void configure(bool enable)
        {
            this.isEnabled = enable;
        }

        public void log(string msg)
        {
            if (isEnabled)
            {
                StreamWriter log;
                FileInfo logFileInfo;

                string logFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Logs", "Log-" + System.DateTime.Today.ToString("dd-MM-yyyy") + "." + "txt");
                logFileInfo = new FileInfo(logFilePath);
                DirectoryInfo logDirInfo = new(logFileInfo.DirectoryName);
                if (!logDirInfo.Exists) logDirInfo.Create();
                FileStream fileStream;
                if (!logFileInfo.Exists)
                {
                    fileStream = logFileInfo.Create();
                }
                else
                {
                    fileStream = new FileStream(logFilePath, FileMode.Append);
                }
                log = new StreamWriter(fileStream);
                log.WriteLine(DateTime.Now.ToString() + " - " + msg);
                log.WriteLine("-------------------------------");
                log.Close();
            }
        }
    }
}
