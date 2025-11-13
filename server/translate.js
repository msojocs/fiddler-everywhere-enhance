"use strict";var l=require("electron"),g=process;process.once("loaded",()=>{let c=e=>{l.ipcRenderer?.send("preload-script-error",e?.message)};try{window.global=window,global.process=g,window.ipc=l.ipcRenderer}catch(e){c(e)}try{let e=window.process.argv.find(t=>t.startsWith("--fiddler-zoom-factor="));e&&l.webFrame.setZoomFactor(parseFloat(e.substring(22)))}catch(e){c(e)}try{let e=document.cookie}catch{return}if(document.cookie||(document.cookie="FiddlerTestCookie=true; path=/"),!document.cookie){let e="__fiddler_file_cookies__";try{let t=new Date().getTime(),o=JSON.parse(localStorage.getItem(e)||"[]");for(let r=o.length-1;r>=0;r--){let i=o[r]?.key||"";if(!i.startsWith("_g")&&i!=="ssid")o.splice(r,1);else{let s=o[r]?.cookie?.indexOf("xpires=")+7;if(s!==6&&s<o[r].cookie.length){let n=o[r].cookie.indexOf(";",s+1),a=o[r].cookie.substring(s,n===-1?void 0:n);a&&new Date(a).getTime()<t&&o.splice(r,1)}}}localStorage.setItem(e,JSON.stringify(o))}catch(t){c(t)}document.__defineGetter__("cookie",()=>{let t=[];try{t=JSON.parse(localStorage.getItem(e)||"[]")}catch(o){c(o)}return t?t.map(o=>o.key+"="+o.value).join("; "):""}),document.__defineSetter__("cookie",t=>{let r=(t.indexOf(";")?t.substring(0,t.indexOf(";")):t).trim().split("=");if(r.length!==2)return;let i=r[0].trim(),s=r[1].trim();if(i?.startsWith("WZRK_"))return;let n=[];try{n=JSON.parse(localStorage.getItem(e)||"[]")}catch(d){c(d)}let a=n.findIndex(d=>d&&d.key===i);a!==-1?n[a]={key:i,value:s,cookie:t}:n.push({key:i,value:s,cookie:t}),localStorage.setItem(e,JSON.stringify(n))})}});
(async () => {
  console.info("-------Translation----------");
  // 用于切换语言时更新
  const node2keyword = new Map();
  let lang = "zhCn";
  const trnaslationData = {
    zhCn: {
      simple: {
        '(Chrome or Edge by default) and route its traffic through Fiddler.': '(默认情况下为Chrome或Edge)并通过Fiddler路由其流量。',
        'a new, clean independent Chromium-based instance': '一个新的、纯净的独立基于Chromium的实例',
        'Additional Settings': '附加设置',
        'Are you sure you want to clear all sessions from the Live Traffic grid? This will also': '您确定要清除实时流量网格中的所有会话吗？这也将从列表中',
        'remove any opened sessions': '删除所有打开的会话',
        'from the list.': '。',
        'Automatically send data to help us improve the product': '自动发送数据以帮助我们改进产品',
        'Automatically detect path to Google Chrome or Microsoft Edge': '自动检测到Google Chrome或Microsoft Edge的路径',
        'Active Traffic Sources': '活动流量来源',
        'Add File': '添加文件',
        'Add New Rule': '添加新规则',
        'Add to Snapshot': '添加到快照',
        'Add to Compare Group': '添加到比较组',
        'Add to Group 1': '添加到组 1',
        'Add to Group 2': '添加到组 2',
        'Add a .proto file from your local system. The .proto file will override the Server Reflection.': '从本地系统添加 .proto 文件。 .proto 文件将覆盖服务器反射。',
        'Allow remote devices to connect': '允许远程设备连接',
        'All Folders': '所有文件夹',
        'All timestamps are in local time. Timestamps and durations marked with * are Fiddler-specific. For more information, check the': '所有时间戳均为本地时间。带有 * 标记的时间戳和持续时间是Fiddler特定的。欲了解更多信息，请查看',
        'all these conditions': '所有这些条件',
        'any of these conditions': '这些条件中的任何一个',
        'any number of times': '任意次数',
        'Appearance': '外观',
        'Apply filters on captured traffic to narrow down the sessions that you need to see and work with.': '对捕获的流量应用过滤器，以缩小您需要查看和处理的会话范围。',
        'Are you sure you want to delete this requests folder? All saved requests inside this folder will be deleted. Move them to other folders to preserve them.': '您确定要删除此请求文件夹吗？该文件夹内的所有已保存请求都将被删除。将它们移动到其他文件夹以保留它们。',
        'Are you sure you want to delete this request?': '您确定要删除此请求吗？',
        'At least one option must be selected to capture traffic.': '必须选择至少一个选项才能捕获流量。',
        'Browse': '浏览',
        'Browsers': '浏览器',
        'Browser data': '浏览器数据',
        'Bypass Fiddler for URLs that start with:': '绕过以...开头的URL的Fiddler代理:',
        'Bypass': '绕过',
        'Cancel': '取消',
        'Capture all network traffic from your computer by setting Fiddler as your system proxy temporarily (some applications may not respect this setting).': '通过将Fiddler临时设置为系统代理，捕获计算机上的所有网络流量（某些应用程序可能不遵守此设置）。',
        'Capture network traffic from remote devices such as iOS or Android devices, or remote computers.': '捕获来自远程设备（如iOS或Android设备）或远程计算机的网络流量。',
        'Certificate valid': '证书有效',
        'Changes here modify the cookie header.': '此处的更改会修改cookie头。',
        'Changes here modify the URL query parameters.': '此处的更改会修改URL查询参数。',
        'Child Requests': '子请求',
        'Choose a folder to save the request': '选择一个文件夹来保存请求',
        'Clean Browser': '纯净浏览器',
        'Clear': '清除',
        'Clear All': '全部清除',
        'Clear All Sessions': '清除所有会话',
        'Client IP': '客户端IP',
        'Click on two sessions below to view difference': '点击下面的两个会话以查看差异',
        'Compact': '紧凑',
        'Compare': '比较',
        'Compare Sessions': '比较会话',
        'Copy': '复制',
        'Comment': '注释',
        'Columns': '列',
        'Could not detect browser path. Please set it manually.': '无法检测到浏览器路径。请手动设置。',
        'Composer enables you to create a new HTTP/S request from scratch and precisely define each parameter.': '构建器使您能够从头开始创建新的HTTP/S请求，并精确定义每个参数。',
        'Copy all content to clipboard': '将所有内容复制到剪贴板',
        'Create a Request': '创建请求',
        'Create New Folder': '创建新文件夹',
        'documentation': '文档',
        'Decode gRPC traffic via Server Reflection.': '通过服务器反射解码gRPC流量。',
        'Decode via .proto file.': '通过 .proto 文件解码。',
        'Default': '默认',
        'Default terminal:': '默认终端:',
        'Delete Your Fiddler Account': '删除您的Fiddler账户',
        'Delete Requests Folder': '删除请求文件夹',
        'Delete Request': '删除请求',
        'Dark': '深色',
        'Do not show again': '不再显示',
        'Duplicate Requests': '复制请求',
        'Edit': '编辑',
        'Edit in Composer': '在构建器中编辑',
        'Enable': '启用',
        'Enable HTTP/2 support': '启用HTTP/2支持',
        'Enable Automatic Authentication': '启用自动身份验证',
        'Enable Streaming mode': '启用流模式',
        'Enable the System Proxy': '启用系统代理',
        'Enter a comment to associate with the selected Sessions': '输入与所选会话关联的注释',
        'Execute to get response': '执行以获取响应',
        'Export': '导出',
        'Find out more in': '了解更多信息请访问',
        'Fiddler CA Certificate': 'Fiddler CA 证书',
        'Fiddler listens on port': 'Fiddler 监听端口',
        'Fiddler will automatically detect Server Reflection if available and decode gRPC messages.': '如果可用，Fiddler将自动检测服务器反射并解码gRPC消息。',
        'Filter Traffic': '过滤流量',
        'Filter individual columns or use the Filters dialog to create a precise filter with multiple conditions.': '过滤单个列或使用“过滤器”对话框创建具有多个条件的精确过滤器。',
        'Follow redirects automatically': '自动跟随重定向',
        'For more information, check the': '欲了解更多信息，请查看',
        'Give your request a name': '为您的请求命名',
        'How it Works?': '它是如何工作的？',
        'However, there may be situations where the proxy is not removed successfully, which could result in the loss of internet connection.': '但是，可能会出现代理未成功移除的情况，这可能会导致互联网连接丢失。',
        'If this happens, go to Settings and search for “proxy”. Go to Manual Proxy Setup, press “Edit” and disable the proxy.': '如果发生这种情况，请转到“设置”并搜索“代理”。转到“手动代理设置”，按“编辑”并禁用代理。',
        'If this is not your intention, look at the': '如果这不是您的本意，请查看',
        'additional options in the dropdown menu.': '下拉菜单中的其他选项。',
        'Import': '导入',
        'In the following tabs, you\'ll be able to choose which settings you want to import from Fiddler Classic to Fiddler Everywhere.': '在以下选项卡中，您可以选择要从Fiddler Classic导入到Fiddler Everywhere的设置。',
        'Keep it ON after app restart': '应用重启后保持开启',
        'Keep in mind that:': '请记住:',
        'Everything you like to import should be': '您喜欢导入的所有内容都应标有',
        'marked with a check.': '复选标记。',
        'Learn more': '了解更多',
        'Light': '浅色',
        'Mark': '标记',
        'matches in the current tab': '当前标签页中有 0 个匹配项',
        'Manually create HTTP/S requests to test APIs.': '手动创建HTTP/S请求以测试API。',
        'Manually choose path to browser': '手动选择浏览器路径',
        'Method': '方法',
        'Modify, block, redirect, and customize requests and responses, to simulate conditions for advanced debugging.': '修改、阻止、重定向和自定义请求和响应，以模拟高级调试条件。',
        'MCP Output Sanitization is Enabled': '已启用 MCP 输出清理',
        'MCP Output Sanitization is Disabled': '已禁用 MCP 输出清理',
        'Next': '下一步',
        'Network Capture': '网络捕获',
        'No proxy': '无代理',
        'No sessions to display.': '无会话显示。',
        'No rules to display.': '没有可显示的规则。',
        'none of these conditions': '这些条件都不',
        'Note that this is just a brief overview of how to work with Filters. There are many additional settings and features you can use to customize your Filters and get the most out of the tool.': '请注意，这只是如何使用过滤器的简要概述。您可以使用许多其他设置和功能来自定义您的过滤器并充分利用该工具。',
        'Note that this is just a brief overview of how to work with Composer. There are many additional settings and features you can use.': '请注意，这只是如何使用构建器的简要概述。您可以使用许多其他设置和功能。',
        'On Save': '保存时',
        'On Export': '导出时',
        'On MCP Output': '在 MCP 输出时',
        'Open': '打开',
        'Open Browser': '打开浏览器',
        'Open Filters Dialog': '打开过滤器对话框',
        'Opened Port': '已打开端口',
        'OK': '确定',
        'Parent Request': '父请求',
        'Persist data in a specific directory': '将数据保存在特定目录中',
        'Please, select session(s) to display detailed information.': '请选择会话以显示详细信息。',
        'Please, select one or more sessions to inspect or compare.': '请选择一个或多个会话进行检查或比较。',
        'Please select the device you want to connect to Fiddler Everywhere': '请选择要连接到 Fiddler Everywhere 的设备',
        'Please wait...': '请稍候...',
        'Protocol': '协议',
        'Protocol:': '协议：',
        'Quickly capture network traffic from a clean independent automatically configured Chromium browser.': '快速捕获来自纯净独立自动配置的Chromium浏览器的网络流量。',
        'Quickly capture network traffic in a clean, automatically configured terminal.': '快速捕获来自纯净自动配置终端的网络流量。',
        'Redirects': '重定向',
        'Refresh': '刷新',
        'Replay': '重放',
        'Request': '请求',
        'Request Details': '请求详情',
        'Request Headers': '请求头',
        'Request Body': '请求体',
        'Requests folder deleted.': '请求文件夹已删除。',
        'Request deleted': '请求已删除',
        'Response Headers': '响应头',
        'Response Body': '响应体',
        'Response Details': '响应详情',
        'Remote IP': '远程IP',
        'Remote Device': '远程设备',
        'Resume Paused Sessions': '恢复已暂停的会话',
        'Reuse Filters': '重用过滤器',
        'Reverse Proxy': '反向代理',
        'Sanitization': '清理',
        'Saved Filters': '已保存的过滤器',
        'Save Request': '保存请求',
        'Save As ...': '另存为...',
        'Save a Request': '保存请求',
        'Save and organize your request in collections for future reuse and collaboration with the team.': '保存并组织您的请求以供将来重用和与团队协作。',
        'Save and reuse previously created filters for better productivity.': '保存并重用以前创建的过滤器以提高生产力。',
        'Set manual proxy configuration:': '设置手动代理配置:',
        'Set Comment': '设置注释',
        'Select': '选择',
        'Select a session from the list to view difference here': '从列表中选择一个会话以在此处查看差异',
        'Session State:': '会话状态:',
        'Session ID:': '会话ID:',
        'Select browser (supported for Chromium based browsers)': '选择浏览器（支持基于Chromium的浏览器）',
        'Selection of the body': '选择正文的格式也',
        'Settings > HTTPS > Ignore server certificate errors': '设置 > HTTPS > 忽略服务器证书错误',
        'Snapshots folder deleted.': '快照文件夹已删除。',
        'specific number of times': '特定次数',
        'Start Capturing': '开始捕获',
        'Status': '状态',
        'Stop processing more rules': '停止处理更多规则',
        'System': '系统',
        'System proxy is disabled': '系统代理已禁用',
        'System proxy is enabled': '系统代理已启用',
        'format will also change': '会更改自动生成的',
        'the auto-generated': 'content-type头。',
        'content-type header.': ' ',
        'Sessions list length:': '会话列表长度:',
        'The Server Reflection might not work in cases where it\'s using TLS, due to certificate errors.': '在使用TLS的情况下，当证书错误时，服务器反射可能无法正常工作。',
        'This option will launch': '此选项将启动',
        'This operation changes the proxy settings for your active network connection. When you': '此操作会更改您活动网络连接的代理设置。当您在主界面中',
        'switch off the toggle': '关闭开关',
        'in the main interface or close the application,': '或关闭应用程序时，',
        'the proxy is removed': '代理将被移除',
        '.': '。',
        'TLS Version': 'TLS 版本',
        'To use a different Chromium-based browser (e.g., Opera, Brave, Vivaldi, etc.), update the default browser path in the Browsers tab within Settings.': '要使用不同的基于Chromium的浏览器（例如Opera、Brave、Vivaldi等），请在“设置”中的“浏览器”选项卡中更新默认浏览器路径。',
        'Troubleshooting page': '故障排除页面',
        'Trust CA Certificate. Enable HTTPS': '信任CA证书。启用HTTPS',
        'Trust CA Certificate in the User Store': '在用户存储中信任CA证书',
        'Trust CA Certificate in the Machine Store': '在机器存储中信任CA证书',
        'Use system proxy (recommended)': '使用系统代理（推荐）',
        'Using Fiddler CA Certificate': '正在使用Fiddler CA证书',
        'What are Rules?': '规则是什么？',
        'What will happen when the system proxy is enabled?': '启用系统代理时会发生什么？',
        'What will happen when a terminal is opened?': '打开终端时会发生什么？',
        'What will happen when a clean browser is opened?': '打开纯净浏览器时会发生什么？',
        'What happens when the system proxy is enabled?': '启用系统代理时会发生什么？',
        'You can now easily import your settings, filters and AutoResponder rules from Fiddler Classic.': '您现在可以轻松地从Fiddler Classic导入您的设置、过滤器和自动响应规则。',
        'You can use a request from captured traffic and edit each parameter before reissuing it.': '您可以使用从捕获的流量中获取的请求，并在重新发出请求之前编辑每个参数。',
        'You can import new settings from Fiddler Classic at any time by starting this wizard.': '您可以随时通过启动此向导从Fiddler Classic导入新设置。',
        'You can ignore the certificate errors in': '您可以在以下位置忽略证书错误',
        'Keep all sessions in the list': '将所有会话保留在列表中',
        'Keep only last': '仅保留最后',
        'sessions': '个会话',
        'Tables density': '表格密度',
        'Trial expires in': '试用期还剩',
        'Theme': '主题',
        'Use clean instance': '使用纯净实例',
        'When to sanitize': '何时清理',
        'Report an Issue': '报告问题',
        'Traffic Sources:': '流量来源:',
        'Feedback': '反馈',
        'Contact Support': '联系支持',
        'Background:': '背景：',
        'Text Color:': '文字颜色:',
        'Sample Text': '示例文本',
        'Connections': '连接',
        'MCP Server': 'MCP 服务器',
        'Listens on port': '监听端口',
        'Server URL': '服务器URL',
        'API Key': 'API密钥',
        'Generate': '生成',
        'Configuration': '配置',
        'Gateway': '网关',
        'Rule Name': '规则名称',
        'Conditions': '条件',
        'Actions': '操作',
        'Add Action': '添加操作',
        'Sessions will be matched on Request.': '会话将根据请求进行匹配。',
        'Privacy': '隐私',
        'Help': '帮助',
        'Settings': '设置',
        'Unsubscribe from Emails': '取消订阅电子邮件',
        'Actual Size': '实际大小',
        'Zoom In': '放大',
        'Zoom Out': '缩小',
        'Tools': '工具',
        'Certificate': '证书',
        'AutoSave': '自动保存',
        'Decode value': '解码值',
        'Advanced Replay': '高级重放',
        'Release Notes': '发行说明',
        'Check for Updates': '检查更新',
        'Forums': '论坛',
        'Documentation': '文档',
        'About': '关于',
        'Privacy Center': '隐私中心',
        'Keyboard Shortcuts': '键盘快捷键',
        'Open Application Logs Folder': '打开应用日志文件夹',
        'Trust CA Certificate': '信任CA证书',
        'in the User Store': '在用户存储中',
        'in the Machine Store': '在机器存储中',
        'Export CA Certificate': '导出CA证书',
        'Reset CA Certificate': '重置CA证书',
        'Remove CA Certificate': '移除CA证书',
        'Capture HTTPS traffic': '捕获HTTPS流量',
        'Checking this option will mark': '选中此选项将标记当前',
        'the action as final, meaning': '操作为最终操作，意味',
        'any actions or rules that follow': '着后续的任何操作或规',
        'will not be executed.': '则将不会被执行。',
        'Ignore Server Certificate Errors (Unsafe)': '忽略服务器证书错误（不安全）',
        'Ignore server certificate errors (unsafe)': '忽略服务器证书错误（不安全）',
        'View': '视图',
        'Select Previous Tab': '选择上一个标签页',
        'Select Next Tab': '选择下一个标签页',
        'Fiddler port is opened for remote': 'Fiddler端口已打开以供远程',
        'devices to connect.': '设备连接。',
        'Strikeout': '删除线',
        'Red': '红色',
        'Blue': '蓝色',
        'Copper': '铜色',
        'Green': '绿色',
        'Orange': '橙色',
        'Purple': '紫色',
        'Unmark': '取消标记',
        'Reset': '重置',
        'Remove': '移除',
        'Buy Now': '立即购买',
        'Capture and Inspect Traffic': '捕获和检查流量',
        'Set System Proxy': '设置系统代理',
        'Open Clean Browser': '打开纯净浏览器',
        'Open Terminal': '打开终端',
        'Connect Remote Devices': '连接远程设备',
        'Modify and Filter Traffic': '修改和过滤流量',
        'Create Rules': '创建规则',
        'Create Filters': '创建过滤器',
        'API Testing': 'API 测试',
        'Compose API Requests': '构建API请求',
        'Import from Fiddler Classic': '从Fiddler Classic导入',
        'Import Fiddler Classic Settings': '导入Fiddler Classic设置',
        'Rules Disabled': '规则已禁用',
        'There are no rules enabled.': '没有启用的规则。',
        'No Active Breakpoints': '没有活动断点',
        'There are no active breakpoints': '当前时刻没有活动的',
        'at the moment.': '断点。',
        'Disabled': '已禁用',
        'To enable the option,': '要启用该选项，',
        'click here': '请点击此处',
        'General': '常规',
        'Select folder': '选择文件夹',
        'Advanced Settings': '高级设置',
        'Save headers only': '仅保存头部',
        'Apply filters when saving snapshots': '保存快照时应用过滤器',
        'Do not clear the grid': '不要清除网格',
        'Automatically save a snapshot and clear the grid every': '自动保存一个快照并清除网格，间隔时间为',
        'min': '分钟', // 自动保存的设置界面
        'The sessions will be saved in': '会话将保存在快照中，',
        'the snapshot without the body.': '不包含正文。',
        'Only the sessions currently': '只有在当前网格中可',
        'visible in the grid will be saved': '见的会话将被保存在',
        'in the snapshot. Filtered-out': '快照中。被过滤的会',
        'sessions will not be included.': '话将不会被包含。保存',
        'When a snapshot is saved, the': '快照时，网格将保持完整。',
        'grid will remain intact. The next': '下一个自动保存的快照将',
        'autosaved snapshot will only': '只包含新捕获的流量。',
        'include newly captured traffic': ' ',
        'by ID.': ' ',
        'AutoSave allows a maximum duration': '自动保存允许的最长时间为',
        'of': ' ',
        '720 minutes': '720分钟',
        '. To change it, you': '。要更改它，您必',
        'must first disable AutoSave, adjust': '须先禁用自动保存，调整时',
        'the time, and then re-enable it.': '间，然后重新启用它。',
        'Manage Account': '管理账户',
        'Manage Subscription': '管理订阅',
        'Login Verified': '登录已验证',
        'You have access to the Fiddler servers and': '您可以访问Fiddler服务器并且',
        'are successfully logged in.': '已成功登录。',
        'Machine IPs:': '机器IP：',
        'Sign Out': '登出',
        'Snapshots': '快照',
        'Shared with Me': '与我共享',
        'My Snapshots': '我的快照',
        'AutoSaved': '自动保存',
        'Live Traffic': '实时流量',
        'Filters': '过滤器',
        'System Proxy': '系统代理',
        'Browser': '浏览器',
        'Terminal': '终端',
        'Overview': '概览',
        'Inspectors': '检查器',
        'Rules': '规则',
        'Session Details': '会话详情',
        'Protocol: ': '协议: ',
        'Session State: ': '会话状态: ',
        'Session ID: ': '会话ID: ',
        'Add Rule': '添加规则',
        'Add Group': '添加组',
        'Promote': '提升',
        'Demote': '降级',
        'Duplicate': '复制',
        'Delete': '删除',
        'Requests': '请求',
        'Composer': '构建器',
        'The match state determines when': '匹配状态决定会话中',
        'in the session your rule actions are': '您的规则操作何时执',
        'executed.': '行。',
        'Execute': '执行',
        'Save': '保存',
        'Show autogenerated headers': '显示自动生成的头部',
        'Key': '名称',
        'Value': '值',
        'Description': '描述',
        'Response': '响应',
        'Preview': '预览',
        'Name': '名称',
        'Rename': '重命名',
        'New Folder': '新建文件夹',
        'Share': '分享',
        'Duplicate Collection': '复制集合',
        'Enter a name to save as a new filter': '输入名称以保存为新过滤器',
        'Save the current filter': '保存当前过滤器',
        'Duplicate the current filter': '复制当前过滤器',
        'Revert Changes': '撤销更改',
        'Delete this filter forever?': '永久删除此过滤器？',
        'Clear all conditions?': '清除所有条件？',
        'Filter name': '过滤器名称',
        'Name is required!': '名称是必填项！',
        'Yes': '是',
        'No': '否',
        'Clear All Conditions': '清除所有条件',
        'Add Condition': '添加条件',
        'Contains': '包含',
        'Does not contain': '不包含',
        'Is equal to': '等于',
        'Is not equal to': '不等于',
        'Starts with': '以...开头',
        'Ends with': '以...结尾',
        'Is empty': '为空',
        'Is not empty': '不为空',
        'Regular expression': '正则表达式',
        'Close': '关闭',
        'Apply': '应用',
        'Reset Zoom': '重置缩放',
      },
      regexp: {
        'Timings \\((.*?)\\)': '时序 ({0})',
        'Sizes \\((.*?)\\)': '大小 ({0})',
        ' (\\d+) selected ': ' {0} 选中 ',
        '(\\d+) days!': '{0} 天！',
        'Hi (.*?)! You are logged in now.': '您好 {0}！您已登录。',
        '(\\d+) days remaining': '剩余 {0} 天',
        'Add (.*?) to Bypass List': '将 {0} 添加到绕过列表',
        'Certificate Details: (.*?)': '证书详情: {0}',
        'Overall \\((.*?)\\)': '整体 ({0})',
        'Request \\((.*?)\\)': '请求 ({0})',
        'Response \\((.*?)\\)': '响应 ({0})',
        'Request: (.*?)': '请求：{0}',
        'Response: (.*?)': '响应：{0}',
        '(\\d+) matches in the current tab': '当前标签页中有 {0} 个匹配项',
        'Zoom: (\\d+)%': '缩放: {0}%',
      }
    }
  }
  let currentDict = trnaslationData[lang]

  class ReplaceText extends Text {
    constructor(data) {
      super(data)
    }
    get nodeValue() {
      return super.nodeValue
    }
    set nodeValue(value) {
      super.nodeValue = value
      // 白名单翻译
      if (this.parentElement?.className === 'ng-star-inserted'
        || this.parentElement?.className === 'k-button-text'
        || this.parentElement?.className === 'k-text-ellipsis'
        || this.parentElement?.previousElementSibling?.dataset?.icon === 'autosave'
        || (this.parentElement?.tagName === 'STRONG' && value === 'All Folders') // 保存请求时，显示的当前文件夹名称
        || this.parentElement?.nextElementSibling?.attributes?.name?.value === 'circle-question' // 帮助提示
        || value?.includes('matches in the current tab') // Rule匹配数
        || this.parentElement?.className === 'k-input-value-text' // Rule条件匹配中选择框的当前选中项文字
      ) {
        translate(this);
      }
    }
  }
  /**
   *  TODO: 改成是否全英文判断
   * @param {*} str 
   * @returns 
   */
  const containsFullChinese = (str) => {
    // 匹配大多数汉字、繁体中文和部分中文标点
    const fullChineseRegex = /[\u4e00-\u9FFF\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\uff01\u3010\u3011\uffe5]/;
    return fullChineseRegex.test(str);
  }
  const isSkipEle = (ele) => {
    // 忽略image
    if (ele.nodeName === "IMG") return true;
    // 忽略path
    if (ele.nodeName === "path") return true;
    // 忽略svg
    if (ele.nodeName === "svg") return true;
    // 忽略br
    if (ele.nodeName === "BR") return true;
    // 忽略source
    if (ele.nodeName === "SOURCE") return true;
    // 忽略rect
    if (ele.nodeName === "rect") return true;
    // 忽略circle
    if (ele.nodeName === "circle") return true;
    // 忽略script
    if (ele.nodeName === "SCRIPT") return true;
    if (
      ele.nodeType === Node.ELEMENT_NODE && ele instanceof HTMLElement &&
      (ele.className.includes("rule-title") // 规则列表
        || ele?.parentElement?.parentElement?.parentElement?.parentElement?.classList?.contains('filter-list') // 过滤器列表
      )
    )
      return true;
    if (ele?.className?.includes('item-label')) {
      if (!ele?.nextElementSibling) {
        // 保存请求时选择文件夹名称，忽略
        return true
      }
      const btn = ele?.nextElementSibling?.querySelector('[data-button-icon="trash"]')
      if (btn && !btn.hidden) {
        return true
      }
    }
    if (ele.nodeType === Node.ELEMENT_NODE && ele instanceof HTMLElement && ele.className.includes('toolbar__menu-item')) {
      if (ele.parentNode.parentElement.id && ele.parentElement.parentElement.firstElementChild.nextElementSibling.className.includes('k-separator')) {
        return true;
      }
    }
    if (
      ele.textContent && 
      (
        /^\d+:\d+$/.test(ele.textContent)
        || /^\d+\.\d+\.\d+$/.test(ele.textContent)
        || /^\d+ \/ \d+$/.test(ele.textContent)
        || /^(\d+)$/.test(ele.textContent)
      )
    ) return true
  }
  const getSingleNode = (node) => {
    // element get
    // console.info('getSingleNode:', node);
    const eles = [node];
    const result = [];
    while (eles.length > 0) {
      const ele = eles.pop();
      if (!ele) continue;
      if (isSkipEle(ele)) continue;
      if (ele.hasChildNodes()) {
        for (let i = 0; i < ele.childNodes.length; i++) {
          const child = ele.childNodes[i];
          if (isSkipEle(child)) continue;
          eles.push(child);
          if (child instanceof HTMLElement) {
            const title = child.attributes.getNamedItem("title");
            if (title && title.textContent && title.textContent.length > 0) {
              result.push(title);
            }
            const placeholder = child.attributes.getNamedItem("placeholder");
            if (placeholder && placeholder.textContent && placeholder.textContent.length > 0) {
              result.push(placeholder);
            }
          }
        }
        continue;
      }
      // 单元素节点
      if (!ele.textContent || ele.textContent.length === 0) continue;
  
      if (!isNaN(Number(ele.textContent))) continue
      
      result.push(ele);
    } // end while
    return result;
  };
  /** @param {Node} node */
  const translate = (node) => {
    if (!node.textContent) return false
    // log.info('translate:', node.textContent);
    if (!currentDict) return false
    const key = node.textContent.trim()
    const langText = currentDict.simple[key]
    if (!langText) {
      for (const [reg, text] of Object.entries(currentDict.regexp)) {
        const regExp = new RegExp(reg, 'g')
        if (regExp.test(node.textContent)) {
          node.textContent = node.textContent.replace(regExp, (_ss, ...args) => {
            let t = text
            for (let i = 0; i < args.length; i++) {
              t = t.replace(`{${i}}`, args[i])
            }
            // log.info('reg translation:', t)
            return t
          })
          // log.info('reg trnslation result:', node.textContent)
          return true
        }
      }
      return false
    }
    // 使用replace，因为trim会把换行空格移除掉
    node.textContent = node.textContent.replace(key, langText)
    return true
  };
  window.switchLanguage = async (newLang) => {
    if (newLang === lang) return;
    document.body.setAttribute('lang', newLang)
    currentDict = trnaslationData[newLang]
    console.info("switchLanguage -> ", newLang);
    lang = newLang;
    for (const [node, keyword] of node2keyword.entries()) {
      const r = translate(node)
      if (!r) {
        node.textContent = keyword
      }
    }
  };

  {
    // 用于动态的“展开/收起”
    // 这些元素直接更新nodeValue，不会触发Observer
    document.createTextNode = (data) => {
      return new ReplaceText(data)
    }
  };
  const observer = new MutationObserver((mutations) => {
    // console.info('[load]: MutationObserver', mutations);
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          // console.info('added node:', node);
          if (node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement) {
            // console.info('element text:', node.textContent);
            const list = getSingleNode(node)
            // console.info('list:', node, node.outerHTML, list, mutations)
            for (const item of list) {
              if (!item.textContent) continue
              if (!node2keyword.has(item)) {
                node2keyword.set(item, item.textContent);
              } else if (!containsFullChinese(item.textContent) && node2keyword.get(item) !== item.textContent) {
                node2keyword.set(item, item.textContent);
              }
              translate(item);
            }
          } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && node instanceof ShadowRoot) {
            const list = getSingleNode(node)
            // console.info('list:', list)
            for (const item of list) {
              if (!item.textContent) continue
              if (!node2keyword.has(item)) {
                node2keyword.set(item, item.textContent);
              } else if (!containsFullChinese(item.textContent) && node2keyword.get(item) !== item.textContent) {
                node2keyword.set(item, item.textContent);
              }
              translate(item);
            }
            // 设置part，使css生效
            for (let i=0; i < node.childNodes.length; i++) {
              const child = node.childNodes[i]
              if (!child) continue
              if (child.nodeType === Node.ELEMENT_NODE && child instanceof HTMLElement && child.id) {
                child.setAttribute('part', child.id)
              }
            }
            // 每层都设置part导出
            node.host?.setAttribute('exportparts', 'options')
          } else if (node.nodeType === Node.TEXT_NODE) {
            // console.info('text node:', node);
            if (node.nodeValue.includes('Zoom:')) {
              translate(node);
            }
          }
        });
      }
    });
  });
  document.addEventListener('keyup', async (e) => {
    // Ctrl + T
    if (e.ctrlKey && (e.key === 't' || e.key === 'T')) {
      console.info('按下 Ctrl + T 键')
      document.getElementById('languageChangePanel')?.remove()
      // const lang = await window.requestBackground('getStorage', {key: 'lang'}) || 'zh_CN'
      const languageChangePanel = document.createElement('div')
      languageChangePanel.id = 'languageChangePanel'
      languageChangePanel.style.position = 'fixed'
      languageChangePanel.style.bottom = '10px'
      languageChangePanel.style.left = '10px'
      languageChangePanel.style.backgroundColor = 'white'
      languageChangePanel.style.padding = '10px'
      languageChangePanel.style.border = '1px solid black'
      languageChangePanel.style.zIndex = '10000'
      languageChangePanel.innerHTML = `
        <h3>Language:</h3>
        <select id="languageSelect">
          <option value="zhCn" ${lang === 'zhCn' ? 'selected' : ''}>简体中文</option>
          <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
        </select>
        <button id="languageChangeButton">OK</button>
        <button id="closeLanguageChangePanel">X</button>
      `
      document.body.appendChild(languageChangePanel)
      languageChangePanel.querySelector('#languageChangeButton').addEventListener('click', async () => {
        const selectedLanguage = languageChangePanel.querySelector('#languageSelect').value
        console.info('选择的语言:', selectedLanguage)
        // await window.requestBackground('setStorage', {key: 'lang', value: selectedLanguage})
        // window.biliBridgePc.callNativeSync('config/changeLanguage', selectedLanguage)
        switchLanguage(selectedLanguage)
        console.info('切换语言成功:', selectedLanguage)
      })
      languageChangePanel.querySelector('#closeLanguageChangePanel').addEventListener('click', () => {
        document.body.removeChild(languageChangePanel)
      })
    }
  })
  if (!document.body) {
    console.warn(
      "MutationObserver: document.body is not ready yet, waiting for it to be available."
    );
    document.addEventListener("DOMContentLoaded", () => {
      console.info(
        "MutationObserver: document.body is now ready, starting to observe."
      );
      document.body.setAttribute('lang', lang)
      document.head.insertAdjacentHTML('beforeend', `
        <style>
          /* 中文样式调整 */
          [lang="zhCn"] #requestInspectorsPane .inspector-type-text, [lang="zhCn"] #responseInspectorsPane .inspector-type-text {
            width: 9%;
          }
      `)
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: true,
      });
    });
    return;
  }
  console.info(
    "MutationObserver: document.body is ready, starting to observe."
  );
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });
})();
