//using HarmonyLib;
using src;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.Loader;
using System.Text.RegularExpressions;

public class StartupHook
{
    public static void Initialize()
    {
        Console.WriteLine("Test...");
        AssemblyLoadContext.Default.Resolving += SharedHostPolicy.SharedAssemblyResolver.LoadAssemblyFromSharedLocation;
        var harmony = new Harmony("com.github");
        Console.WriteLine("Prefix & Postfix Example");
        harmony.Patch(
            original: AccessTools.Method(typeof(File), nameof(File.ReadAllBytes), new Type[]
            {
                typeof(string)
            }),
            prefix: new HarmonyMethod(AccessTools.Method(typeof(StartupHook), nameof(BeforeWriteFile))),
            postfix: new HarmonyMethod(AccessTools.Method(typeof(StartupHook), nameof(AfterWriteFile)))
        );
    }
    private static void BeforeWriteFile(ref string path, out Stopwatch __state)
    {
        // 宣告自訂狀態變數給 Postfix 使用
        __state = Stopwatch.StartNew();
        Console.WriteLine("ReadAllBytes -> {0}", path);
        var reg = new Regex("(main-.*?)\\.js");
        if (path.Contains("main.js"))
        {
            path = path.Replace("main.js", "main.original.js");
        }
        else if (reg.IsMatch(path))
        {
            var m = reg.Match(path);
            var name = m.Groups[1].Value;
            path = path.Replace($"{name}.js", $"{name}.original.js");
        }

        // 示範竄改參數，要修改的參數宣告加上 ref
        //var dir = Path.GetDirectoryName(path);
        //if (dir == "d:\\")
        //{
        //    Directory.CreateDirectory("d:\\temp");
        //    path = Path.Combine("d:\\temp", Path.GetFileName(path));
        //}
    }

    static void AfterWriteFile(string path, Stopwatch __state)
    {
        __state.Stop();
        Console.WriteLine($"File.ReadAllBytes took {__state.ElapsedTicks:n0} ticks");
    }
}

namespace SharedHostPolicy
{
    class SharedAssemblyResolver
    {
        public static Assembly LoadAssemblyFromSharedLocation(AssemblyLoadContext context, AssemblyName assemblyName)
        {
            var target = AppDomain.CurrentDomain.GetAssemblies().FirstOrDefault(e => e.FullName == assemblyName.FullName);
            if (target != null)
            {
                return target;
            }
            string sharedAssemblyPath = Path.Combine(HarmonyData.AssemblyDirectory, assemblyName.Name ?? ""); // find assemblyName in shared location...
            if (sharedAssemblyPath != null)
                return AssemblyLoadContext.Default.LoadFromAssemblyPath(sharedAssemblyPath);
            throw new DllNotFoundException(assemblyName.Name);
        }
    }
}