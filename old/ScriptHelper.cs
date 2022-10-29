// Fiddler.WebUi.Helpers.ScriptHelper
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using Fiddler.WebUi.Constants;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

internal class ScriptHelper
{
	internal static bool TryOpenClientMainScript(out string error)
	{
		error = string.Empty;
		try
		{
			// ClientApp/dist
			string appDir = Path.Combine(Directory.GetParent(Assembly.GetExecutingAssembly().Location)?.FullName, "ClientApp", "dist");
			// ClientApp/dist/index.html
			string mainIndexPath = Path.Combine(appDir, "index.html");
			if (!File.Exists(mainIndexPath))
			{
				error = "Missing root app file!";
				return false;
			}
			// ClientApp/dist/index.html
			byte[] content = File.ReadAllBytes(mainIndexPath);
			using (SHA512 sHA = SHA512.Create())
			{
				string result2 = Convert.ToHexString(sHA.ComputeHash(content));
				string clientIndexBytes = MainFilesConstants.clientIndexBytes;
				if (clientIndexBytes == null || !clientIndexBytes.Equals(result2, StringComparison.OrdinalIgnoreCase))
				{
					error = "Missing root app file!";
					return false;
				}
			}
			string runtimesStr = string.Empty;
			string contentStr = Encoding.UTF8.GetString(content);
			for (int i = 0; i < MainFilesConstants.clientFileNames.Length; i++)
			{
				string file = MainFilesConstants.clientFileNames[i];
				string bytes = MainFilesConstants.clientFileBytes[i];
				string startIdx = "script src=\"" + file;
				if (file == "svg-fonts")
				{
					contentStr = runtimesStr;
					startIdx = "\"" + file;
				}
				int mainIdx = contentStr.IndexOf(startIdx);
				if (mainIdx == -1)
				{
					error = "Missing " + file + " app file!";
					return false;
				}
				string mainScriptPath = contentStr.Substring(mainIdx + startIdx.Length, contentStr.IndexOf(".js", mainIdx) - mainIdx - startIdx.Length);
				mainScriptPath = Path.Combine(appDir, file + mainScriptPath + ".js");
				content = File.ReadAllBytes(mainScriptPath);
				using (SHA512 sha = SHA512.Create())
				{
					string result = Convert.ToHexString(sha.ComputeHash(content));
					if (bytes == null || !bytes.Equals(result, StringComparison.OrdinalIgnoreCase))
					{
						error = "Missing " + file + " app file!";
						return false;
					}
				}
				if (file == "runtime")
				{
					runtimesStr = Encoding.UTF8.GetString(content);
				}
			}
		}
		catch (Exception)
		{
			error = "Error opening the app!";
			return false;
		}
		return true;
	}

	internal static bool TryOpenElectronMainScript(out string error)
	{
		string errorTemplatePrefix = "Error while {0} application";
		string errorTemplateSuffix = " port! Contact";
		error = string.Empty;
		try
		{
			DirectoryInfo appDir = Directory.GetParent(Assembly.GetExecutingAssembly().Location)?.Parent;
			FileInfo[] packageJsonScripts = appDir?.Parent.GetFiles("package.json");
			string packageJson = ((packageJsonScripts != null && packageJsonScripts.Length != 0) ? packageJsonScripts[0].FullName : string.Empty);
			if (string.IsNullOrEmpty(packageJson))
			{
				error = string.Format(errorTemplatePrefix, "starting") + errorTemplateSuffix + " Support";
				return false;
			}
			string mainScriptPath = string.Empty;
			using (StreamReader jsonFile = File.OpenText(packageJson))
			{
				using JsonTextReader jsonReader = new JsonTextReader(jsonFile);
				JObject token = (JObject)JToken.ReadFrom(jsonReader);
				JToken main = token.Children().First((JToken c) => (c as JProperty)?.Name?.ToLower() == "main");
				mainScriptPath = (main as JProperty).Value.ToString();
				mainScriptPath = mainScriptPath.Replace('/', Path.DirectorySeparatorChar);
			}
			mainScriptPath = Path.Combine(appDir.Parent!.FullName, mainScriptPath);
			// app/out/main.js
			byte[] content = File.ReadAllBytes(mainScriptPath);
			using SHA512 sha = SHA512.Create();
			string result = Convert.ToHexString(sha.ComputeHash(content));
			string electronMainBytes = MainFilesConstants.electronMainBytes;
			if (electronMainBytes == null || !electronMainBytes.Equals(result, StringComparison.OrdinalIgnoreCase))
			{
				error = string.Format(errorTemplatePrefix, "calculating") + errorTemplateSuffix + " Support";
				return false;
			}
		}
		catch (Exception)
		{
			error = string.Format(errorTemplatePrefix, "trying to calculate") + errorTemplateSuffix + " Support";
			return false;
		}
		return true;
	}
}
