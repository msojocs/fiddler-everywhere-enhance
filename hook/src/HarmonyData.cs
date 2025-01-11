using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace src
{
    public static class HarmonyData
    {
        private static Assembly? _harmonyAssemble;
        private static Type? _harmonyType;
        private static Type? _harmonyMethodType;
        private static Type? _accessToolsType;
        private static Assembly HarmonyAssembly
        {
            get
            {
                var file = Path.Combine(AssemblyDirectory, "0Harmony.dll");
                var harmonyAssemby = Assembly.LoadFile(file);
                //var harmonyAssemby = Assembly.Load("0Harmony");
                _harmonyAssemble = harmonyAssemby;
                return harmonyAssemby;
            }
        }
        public static Type HarmonyType
        {
            get
            {
                if (_harmonyType == null)
                {
                    

                    var type = HarmonyAssembly.GetType("HarmonyLib.Harmony");
                    if (type == null)
                    {
                        Console.WriteLine("Get harmonyType failed!");
                        throw new FileNotFoundException("Failed to load Harmony.");
                    }
                    _harmonyType = type;
                }
                return _harmonyType;
            }
        }
        public static Type HarmonyMethodType
        {
            get
            {
                if (_harmonyMethodType == null)
                {

                    var type = HarmonyAssembly.GetType("HarmonyLib.HarmonyMethod");
                    if (type == null)
                    {
                        Console.WriteLine("Get harmonyType failed!");
                        throw new FileNotFoundException("Failed to load Harmony.");
                    }
                    _harmonyMethodType = type;
                }
                return _harmonyMethodType;
            }
        }
        public static Type AccessToolsType
        {
            get
            {
                if (_accessToolsType == null)
                {
                    var file = Path.Combine(AssemblyDirectory, "0Harmony.dll");
                    var harmonyAssemby = Assembly.LoadFile(file);
                    _harmonyAssemble = harmonyAssemby;

                    var type = harmonyAssemby.GetType("HarmonyLib.AccessTools");
                    if (type == null)
                    {
                        Console.WriteLine("Get harmonyType failed!");
                        throw new FileNotFoundException("Failed to load Harmony.");
                    }
                    _accessToolsType = type;
                }
                return _accessToolsType;
            }
        }
        public static string AssemblyDirectory
        {
            get
            {
                string codeBase = Assembly.GetExecutingAssembly().Location;
                Console.WriteLine("code base: {0}", codeBase);
                //UriBuilder uri = new UriBuilder(codeBase);
                //string path = Uri.UnescapeDataString(uri.Path);
                var p = Path.GetDirectoryName(codeBase);
                if (p == null)
                {
                    throw new ArgumentNullException("Failed to get location.");
                }
                return p;
            }
        }
    }
}
