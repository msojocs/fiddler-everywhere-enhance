using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using Fiddler.WebUi.Constants;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Fiddler.WebUi.Helpers
{
	// Token: 0x020000FA RID: 250
	public class ElectronMainHelper
	{
		// Token: 0x0600084C RID: 2124 RVA: 0x0001880C File Offset: 0x00016A0C
		internal static bool TryOpenMainScript(out string error)
		{
			string errorTemplatePrefix = "Error while {0} application";
			string errorTemplateSuffix = " port! Contact";
			error = string.Empty;
			try
			{
				DirectoryInfo parent = Directory.GetParent(Assembly.GetExecutingAssembly().Location);
				DirectoryInfo appDir = (parent != null) ? parent.Parent : null;
                // 获取 package.json 文件
				FileInfo[] packageJsonScripts = (appDir != null) ? appDir.Parent.GetFiles("package.json") : null;
                // 获取第一个 package.json
				string packageJson = (packageJsonScripts != null && packageJsonScripts.Length != 0) ? packageJsonScripts[0].FullName : string.Empty;
				// 是否空
                if (string.IsNullOrEmpty(packageJson))
				{
					error = string.Format(errorTemplatePrefix, "starting") + errorTemplateSuffix + " Support";
					return false;
				}
				string mainScriptPath = string.Empty;
				using (StreamReader jsonFile = File.OpenText(packageJson))
				{
					using (JsonTextReader jsonReader = new JsonTextReader(jsonFile))
					{
						JObject token = (JObject)JToken.ReadFrom(jsonReader);
						JToken main = token.Children().First(delegate(JToken c)
						{
							JProperty jproperty = c as JProperty;
							string a;
							if (jproperty == null)
							{
								a = null;
							}
							else
							{
								string name = jproperty.Name;
								a = ((name != null) ? name.ToLower() : null);
							}
                            // 获取 key 为 main
							return a == "main";
						});
						mainScriptPath = (main as JProperty).Value.ToString();
						mainScriptPath = mainScriptPath.Replace('/', Path.DirectorySeparatorChar);
					}
				}
                // 拼接全路径
				mainScriptPath = Path.Combine(appDir.Parent.FullName, mainScriptPath);
                // 读取内容
				byte[] content = File.ReadAllBytes(mainScriptPath);
				using (SHA512 sha = SHA512.Create())
				{
					string result = Convert.ToHexString(sha.ComputeHash(content));
                    // 63f8ebd84f364a540712b8bab72ff4f9a577e7edb01bbfbd01606c5356b9baa85ee1f2810f56eb05550f34aaf289af987995900aa3bea5a1dcb35e2e12f9eb53
					string mainBytes = ElectronMainConstants.mainBytes;
					if (mainBytes == null || !mainBytes.Equals(result, StringComparison.OrdinalIgnoreCase))
					{
                        // 报错点
						error = string.Format(errorTemplatePrefix, "calculating") + errorTemplateSuffix + " Support";
						// il line: 135843
						return false;
					}
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
}
