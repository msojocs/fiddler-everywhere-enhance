using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace src
{
    public static class AccessTools
    {/// <summary>Shortcut for <see cref="BindingFlags"/> to simplify the use of reflections and make it work for any access level</summary>
     ///
        public static readonly BindingFlags all = BindingFlags.Public // This should a be const, but changing from static (readonly) to const breaks binary compatibility.
            | BindingFlags.NonPublic
            | BindingFlags.Instance
            | BindingFlags.Static
            | BindingFlags.GetField
            | BindingFlags.SetField
            | BindingFlags.GetProperty
            | BindingFlags.SetProperty;

        public static MethodInfo Method(Type type, string name, Type[]? parameters = null, Type[]? generics = null)
        {
            var method = HarmonyData.AccessToolsType.GetMethod("Method", new Type[]
            {
                typeof(Type),
                typeof(string),
                typeof(Type[]),
                typeof(Type[]),
            });
            if (method == null)
            {
                throw new Exception("Failed to get 'Method' of AccessTools.");
            }
            var result = method.Invoke(null, new object?[] {
                type,
                name,
                parameters,
                generics,
            });
            if (result == null )
            {
                throw new Exception("Failed to call 'Method' of AccessTools.");
            }
            return (MethodInfo)result;
        }
    }
}
