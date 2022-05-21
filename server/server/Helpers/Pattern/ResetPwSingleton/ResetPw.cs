using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.ResetPwSingleton
{
    public class ResetPw
    {
        private static volatile ResetPw instance;
        private static readonly object InstanceLoker = new();

        public static List<ResetPwModel> list;
        private ResetPw()
        {
            list = new();
        }
        public static ResetPw GetInstance
        {
            get
            {
                if (instance == null)
                {
                    lock (InstanceLoker)
                    {
                        if (instance == null)
                        {
                            instance = new ResetPw();
                        }
                    }
                }
                return instance;
            }
        }
        public ResetPwModel Get(string token)
        {
            var item = (from r in list
                        where r.token.Equals(token)
                        select r).FirstOrDefault();
            return item;
        }
        public List<ResetPwModel> GetAll()
        {
            return list;
        }
        public void Add(ResetPwModel data)
        {
            list.Add(data);
        }
        public void Remove(string token)
        {
            var item = (from r in list
                        where r.token.Equals(token)
                        select r).FirstOrDefault();
            list.Remove(item);
        }
        public void RemoveDie()
        {
            list.RemoveAll(x => x.createdAt < DateTime.Now.Date.AddHours(-1));
        }
        public void Clear()
        {
            list.Clear();
        }
        public int GetSize()
        {
            return list.Count();
        }
    }
}
