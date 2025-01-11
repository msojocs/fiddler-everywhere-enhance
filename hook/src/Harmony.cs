using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace src
{
    public class Harmony
    {
        private readonly object _instance;
        public Harmony(string id)
        {
            var harmony = Activator.CreateInstance(HarmonyData.HarmonyType, id);
            if (harmony == null)
            {
                throw new Exception("Failed to create Harmony instance.");
            }
            _instance = harmony;
        }
        public MethodInfo Patch(MethodBase original, HarmonyMethod? prefix = null, HarmonyMethod? postfix = null, HarmonyMethod? transpiler = null, HarmonyMethod? finalizer = null)
        {
            var patch = HarmonyData.HarmonyType.GetMethod("Patch");
            if (patch == null)
            {
                throw new Exception("Failed to get method<Patch>");
            }
            var ps = new List<object?>();
            ps.Add(original);
            ps.Add(prefix?.Instance);
            ps.Add(postfix?.Instance);
            ps.Add(transpiler?.Instance);
            ps.Add(finalizer?.Instance);
            //var h = (HarmonyLib.Harmony)_instance;
            //h.Patch(original, (HarmonyLib.HarmonyMethod)prefix?.Instance, (HarmonyLib.HarmonyMethod)postfix?.Instance, null, null);
            var info = patch.Invoke(_instance, ps.ToArray());
            if (info == null)
            {
                throw new Exception("Failed to invoke method<Patch>");
            }
            return (MethodInfo)info;
        }
        
    }
}
