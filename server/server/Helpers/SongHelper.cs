using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace server.Helpers
{
    public class SongHelper
    {
        public static string ConvertTag(string s)
        {
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = s.Normalize(NormalizationForm.FormD);
            string temp2 = regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
            return temp2.Replace(" ", "-");
        }

        public static string ConvertSongFileName(string s)
        {
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = s.Normalize(NormalizationForm.FormD);
            string temp2 = regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
            return temp2.Replace(" ", "-");
        }
        public static string ConvertSongFile(string s)
        {
            string name = s.Split(".")[0].Trim();
            string extent = s.Split(".")[^1];
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = name.Normalize(NormalizationForm.FormD);
            string temp2 = regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
            return temp2.Replace(" ", "") + "-" + DateTimeOffset.UtcNow.ToUnixTimeSeconds() + "." + extent;
        }
    }
}
