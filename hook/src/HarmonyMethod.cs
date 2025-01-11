using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace src
{
    public class HarmonyMethod
    {
        private readonly object _instance;
        private readonly MethodInfo _method;
        public HarmonyMethod(MethodInfo methodInfo)
        {
            _method = methodInfo;
            var m = Activator.CreateInstance(HarmonyData.HarmonyMethodType, methodInfo);
            if (m == null)
            {
                throw new ArgumentException("Failed to create HarmonyMethod instance.");
            }
            _instance = m;
        }
        public object Instance
        {
            get
            {
                return _instance;
            }
        }
    }
}
