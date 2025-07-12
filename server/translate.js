"use strict";var l=require("electron"),g=process;process.once("loaded",()=>{let c=e=>{l.ipcRenderer?.send("preload-script-error",e?.message)};try{window.global=window,global.process=g,window.ipc=l.ipcRenderer}catch(e){c(e)}try{let e=window.process.argv.find(t=>t.startsWith("--fiddler-zoom-factor="));e&&l.webFrame.setZoomFactor(parseFloat(e.substring(22)))}catch(e){c(e)}try{let e=document.cookie}catch{return}if(document.cookie||(document.cookie="FiddlerTestCookie=true; path=/"),!document.cookie){let e="__fiddler_file_cookies__";try{let t=new Date().getTime(),o=JSON.parse(localStorage.getItem(e)||"[]");for(let r=o.length-1;r>=0;r--){let i=o[r]?.key||"";if(!i.startsWith("_g")&&i!=="ssid")o.splice(r,1);else{let s=o[r]?.cookie?.indexOf("xpires=")+7;if(s!==6&&s<o[r].cookie.length){let n=o[r].cookie.indexOf(";",s+1),a=o[r].cookie.substring(s,n===-1?void 0:n);a&&new Date(a).getTime()<t&&o.splice(r,1)}}}localStorage.setItem(e,JSON.stringify(o))}catch(t){c(t)}document.__defineGetter__("cookie",()=>{let t=[];try{t=JSON.parse(localStorage.getItem(e)||"[]")}catch(o){c(o)}return t?t.map(o=>o.key+"="+o.value).join("; "):""}),document.__defineSetter__("cookie",t=>{let r=(t.indexOf(";")?t.substring(0,t.indexOf(";")):t).trim().split("=");if(r.length!==2)return;let i=r[0].trim(),s=r[1].trim();if(i?.startsWith("WZRK_"))return;let n=[];try{n=JSON.parse(localStorage.getItem(e)||"[]")}catch(d){c(d)}let a=n.findIndex(d=>d&&d.key===i);a!==-1?n[a]={key:i,value:s,cookie:t}:n.push({key:i,value:s,cookie:t}),localStorage.setItem(e,JSON.stringify(n))})}});
(async () => {
  console.info("-------Translation----------");
  const i18n = {
    // #region 标题栏
    "Report an Issue": {
      condition: (node) =>
        node?.parentNode?.className === "button__text ng-star-inserted" || node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'github',
      en: "Report an Issue",
      zhCn: "报告问题",
    },
    Feedback: {
      condition: (node) =>
        node?.parentNode?.className === "button__text ng-star-inserted",
      en: "Feedback",
      zhCn: "反馈",
    },
    "Contact Support": {
      condition: (node) =>
        node?.parentNode?.className === "button__text ng-star-inserted",
      en: "Contact Support",
      zhCn: "联系支持",
    },
    Help: {
      condition: (node) =>
        node?.nodeName?.toLowerCase() === "fdl-button" ||
        node?.nodeName?.toLowerCase() === "button",
      en: "Help",
      zhCn: "帮助",
    },
    // #endregion 标题栏
    // #region 设置 - HTTPS
    Settings: {
      condition: (node) =>
        node?.parentNode?.parentNode?.className ===
        "k-window-title k-dialog-title ng-star-inserted",
      en: "Settings",
      zhCn: "设置",
    },
    Reset: {
      condition: (node) => node?.parentNode?.nodeName === "A",
      en: "Reset",
      zhCn: "重置",
    },
    Remove: {
      condition: (node) => node?.parentNode?.nodeName === "A",
      en: "Remove",
      zhCn: "移除",
    },
    // #endregion 设置 - HTTPS
    // #region Home
    "Buy Now": {
      condition: (node) =>
        node?.parentNode?.className === "button__text ng-star-inserted" || node?.parentNode?.className === "ng-star-inserted",
      en: "Buy Now",
      zhCn: "立即购买",
    },
    "Capture and Inspect Traffic": {
      condition: (node) => node?.parentNode?.nodeName === "H2",
      en: "Capture and Inspect Traffic",
      zhCn: "捕获和检查流量",
    },
    "Set System Proxy": {
      condition: (node) =>
        node?.parentNode?.className === "card__label ng-star-inserted",
      en: "Set System Proxy",
      zhCn: "设置系统代理",
    },
    "Open Clean Browser": {
      condition: (node) =>
        node?.parentNode?.className === "card__label ng-star-inserted",
      en: "Open Clean Browser",
      zhCn: "打开纯净浏览器",
    },
    "Open Terminal": {
      condition: (node) =>
        node?.parentNode?.className === "card__label ng-star-inserted",
      en: "Open Terminal",
      zhCn: "打开终端",
    },
    "Connect Remote Devices": {
      condition: (node) =>
        node?.parentNode?.className === "card__label ng-star-inserted",
      en: "Connect Remote Devices",
      zhCn: "连接远程设备",
    },
    "Modify and Filter Traffic": {
      condition: (node) => node?.parentNode?.nodeName === "H2",
      en: "Modify and Filter Traffic",
      zhCn: "修改和过滤流量",
    },
    "Create Rules": {
      condition: (node) =>
        node?.parentNode?.className === "card__label ng-star-inserted",
      en: "Create Rules",
      zhCn: "创建规则",
    },
    "Create Filters": {
      condition: (node) =>
        node?.parentNode?.className === "card__label ng-star-inserted",
      en: "Create Filters",
      zhCn: "创建过滤器",
    },
    // H2
    "API Testing": {
      condition: (node) => node?.parentNode?.nodeName === "H2",
      en: "API Testing",
      zhCn: "API 测试",
    },
    "Compose API Requests": {
      condition: (node) =>
        node?.parentNode?.className === "card__label ng-star-inserted",
      en: "Compose API Requests",
      zhCn: "构建API请求",
    },
    // H2
    "Import from Fiddler Classic": {
      condition: (node) => node?.parentNode?.nodeName === "H2",
      en: "Import from Fiddler Classic",
      zhCn: "从Fiddler Classic导入",
    },
    "Import Fiddler Classic Settings": {
      condition: (node) =>
        node?.parentNode?.className === "card__label ng-star-inserted",
      en: "Import Fiddler Classic Settings",
      zhCn: "导入Fiddler Classic设置",
    },
    // #endregion Home
    // #region Traffic - Left Panel
    Snapshots: {
      condition: (node) =>
        node?.parentNode?.parentNode?.className === "panel-title",
      en: "Snapshots",
      zhCn: "快照",
    },
    "Shared with Me": {
      condition: (node) =>
        node?.parentNode?.nextElementSibling?.querySelector(
          'fdl-button[data-button-icon="trash"]'
        ).attributes.hidden,
      en: "Shared with Me",
      zhCn: "与我共享",
    },
    "My Snapshots": {
      condition: (node) =>
        node?.parentNode?.nextElementSibling?.querySelector(
          'fdl-button[data-button-icon="trash"]'
        ).attributes.hidden,
      en: "My Snapshots",
      zhCn: "我的快照",
    },
    // 根据Trash区分人员创建还是默认的
    AutoSaved: {
      condition: (node) =>
        node?.parentNode?.nextElementSibling?.querySelector(
          'fdl-button[data-button-icon="trash"]'
        ).attributes.hidden,
      en: "AutoSaved",
      zhCn: "自动保存",
    },
    // #endregion Traffic - Left Panel

    // #region Traffic - Middle Panel
    "Live Traffic": {
      condition: (node) =>
        node?.parentNode?.parentNode?.className === "k-tab ng-star-inserted" || node?.parentNode?.parentNode?.className === 'k-window-title k-dialog-title ng-star-inserted',
      en: "Live Traffic",
      zhCn: "实时流量",
    },
    Filters: {
      condition: (node) =>
        node?.parentNode?.className === "button__text ng-star-inserted" || node?.parentNode?.parentNode?.className === 'k-window-title k-dialog-title ng-star-inserted',
      en: "Filters",
      zhCn: "过滤器",
    },
    ' Saved Filters ': {
      condition: (node) =>
        node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'filters',
      en: " Saved Filters ",
      zhCn: " 已保存的过滤器 ",
    },
    ' Clear ': {
      condition: (node) =>
        node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'filter-slash',
      en: " Clear ",
      zhCn: " 清除 ",
    },
    "System Proxy": {
      condition: (node) =>
        node?.parentNode?.className === "k-label k-label-on-right ng-star-inserted",
      en: "System Proxy",
      zhCn: "系统代理",
    },
    Browser: {
      condition: (node) =>
        node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'chromium',
      en: "Browser",
      zhCn: "浏览器",
    },
    Terminal: {
      condition: (node) =>
        node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'rectangle-terminal',
      en: "Terminal",
      zhCn: "终端",
    },
    ' Save ': {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'floppy-disk',
      en: "Save ",
      zhCn: "保存",
    },
    ' AutoSave ': {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'autosave',
      en: "AutoSave ",
      zhCn: "自动保存",
    },
    ' Share ': {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'share',
      en: "Share ",
      zhCn: "分享",
    },
    ' Columns ': {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'table-columns',
      en: "Columns ",
      zhCn: "显示列",
    },
    // #endregion Traffic - Middle Panel
    // #region Traffic - Right Panel
    Overview: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'chart-bar',
      en: "Overview",
      zhCn: "概览",
    },
    Inspectors: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'eye',
      en: "Inspectors",
      zhCn: "检查器",
    },
    Rules: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'bolt',
      en: "Rules",
      zhCn: "规则",
    },
    'Session Details': {
      condition: (node) => node?.parentNode?.className === 'ng-star-inserted',
      en: "Session Details",
      zhCn: "会话详情",
    },
    'Protocol: ': {
      condition: (node) => node?.nextElementSibling?.nodeName === 'STRONG',
      en: "Protocol: ",
      zhCn: "协议: ",
    },
    'Session State: ': {
      condition: (node) => node?.nextElementSibling?.nodeName === 'STRONG',
      en: "Session State: ",
      zhCn: "会话状态: ",
    },
    'Session ID: ': {
      condition: (node) => node?.nextElementSibling?.nodeName === 'STRONG',
      en: "Session ID: ",
      zhCn: "会话ID: ",
    },
    'Add Rule': {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'plus',
      en: "Add Rule",
      zhCn: "添加规则",
    },
    'Add Group': {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'folder',
      en: "Add Group",
      zhCn: "添加组",
    },
    Promote: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'arrow-up',
      en: "Promote",
      zhCn: "提升",
    },
    Demote: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'arrow-down',
      en: "Demote",
      zhCn: "降级",
    },
    Duplicate: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'clone',
      en: "Duplicate",
      zhCn: "复制",
    },
    Delete: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'trash',
      en: "Delete",
      zhCn: "删除",
    },
    // #endregion Traffic - Right Panel
    // #region Composer - Left Panel
    'Requests': {
      condition: (node) => node?.parentNode?.className === '',
      en: "Requests",
      zhCn: "请求",
    },
    // #endregion Composer - Left Panel
    // #region Composer - Middle Panel
    Composer: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'api-regular',
      en: "Composer",
      zhCn: "构建器",
    },
    Execute: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'paper-plane',
      en: "Execute",
      zhCn: "执行",
    },
    Save: {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'floppy-disk',
      en: "Save",
      zhCn: "保存",
    },
    'Show autogenerated headers': {
      condition: (node) => node?.parentNode?.className === 'k-label ng-star-inserted',
      en: "Show autogenerated headers",
      zhCn: "显示自动生成的头部",
    },
    ' Key ': {
      condition: (node) => node?.parentNode?.className === 'grid__resizer-hold ng-star-inserted',
      en: " Key ",
      zhCn: " 名称 ",
    },
    ' Value ': {
      condition: (node) => node?.parentNode?.className === 'grid__resizer-hold ng-star-inserted',
      en: " Value ",
      zhCn: " 值 ",
    },
    ' Description ': {
      condition: (node) => node?.parentNode?.className === 'grid__resizer-hold ng-star-inserted',
      en: " Description ",
      zhCn: " 描述 ",
    },
    'Description': {
      condition: (node) => node?.parentNode?.className === 'ng-star-inserted',
      en: "Description",
      zhCn: "描述",
    },
    // #endregion Composer - Middle Panel
    // #region Composer - Right Panel
    'Response': {
      condition: (node) => {
        if (node?.parentNode?.className === 'inspector-type-text') {
          // 样式修正
          node.parentNode.style.whiteSpace = 'nowrap'
          return true;
        }
        return false
      },
      en: "Response",
      zhCn: "响应",
    },
    Preview: {
      condition: (node) => node?.parentNode?.className === 'ng-star-inserted',
      en: "Preview",
      zhCn: "预览",
    },
    // #endregion Composer - Right Panel
    // #region Filters
    'Name': {
      condition: (node) => node?.parentNode?.parentNode?.className === 'k-label ng-star-inserted',
      en: "Name",
      zhCn: "名称",
    },
    'Name ': {
      condition: (node) => node?.parentNode?.parentNode?.className === 'k-label ng-star-inserted',
      en: "Name ",
      zhCn: "名称 ",
    },
    'Enter a name to save as a new filter': {
      condition: (node) => node?.nodeName === 'INPUT' && node?.placeholder === 'Enter a name to save as a new filter',
      en: "Enter a name to save as a new filter",
      zhCn: "输入名称以保存为新过滤器",
    },
    'Save the current filter': {
      condition: (node) => true,
      en: "Save the current filter",
      zhCn: "保存当前过滤器",
    },
    'Duplicate the current filter': {
      condition: (node) => node?.nodeName === 'BUTTON' && node?.attributes?.title?.value === 'Duplicate the current filter',
      en: "Duplicate the current filter",
      zhCn: "复制当前过滤器",
    },
    'Revert Changes': {
      condition: (node) => true,
      en: "Revert Changes",
      zhCn: "撤销更改",
    },
    'Delete this filter forever?': {
      condition: (node) => node?.parentNode?.parentNode?.className === 'toolbar__confirmation ng-star-inserted',
      en: "Delete this filter forever?",
      zhCn: "永久删除此过滤器？",
    },
    'Clear all conditions?': {
      condition: (node) => node?.parentNode?.parentNode?.className === 'toolbar__confirmation ng-star-inserted',
      en: "Clear all conditions?",
      zhCn: "清除所有条件？",
    },
    'Filter name': {
      condition: (node) => node?.nodeName === 'INPUT' && node?.placeholder === 'Filter name',
      en: "Filter name",
      zhCn: "过滤器名称",
    },
    'Name is required!': {
      condition: (node) => true,
      en: "Name is required!",
      zhCn: "名称是必填项！",
    },
    'Yes': {
      condition: (node) => node?.parentNode?.className === 'button__text ng-star-inserted',
      en: "Yes",
      zhCn: "是",
    },
    'No': {
      condition: (node) => node?.parentNode?.className === 'button__text ng-star-inserted',
      en: "No",
      zhCn: "否",
    },
    'Clear All Conditions': {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'trash',
      en: "Clear All Conditions",
      zhCn: "清除所有条件",
    },
    'Add Condition': {
      condition: (node) => node?.parentNode?.previousElementSibling?.attributes?.['data-icon']?.value === 'plus',
      en: "Add Condition",
      zhCn: "添加条件",
    },
    Contains: {
      condition: (node) => node?.parentNode?.className === 'k-input-value-text'
      || node?.parentNode?.className === 'k-list-item-text ng-star-inserted',
      en: "Contains",
      zhCn: "包含",
    },
    'Does not contain': {
      condition: (node) => node?.parentNode?.className === 'k-input-value-text'
      || node?.parentNode?.className === 'k-list-item-text ng-star-inserted',
      en: "Does not contain",
      zhCn: "不包含",
    },
    'Is equal to': {
      condition: (node) => node?.parentNode?.className === 'k-input-value-text'
      || node?.parentNode?.className === 'k-list-item-text ng-star-inserted',
      en: "Is equal to",
      zhCn: "等于",
    },
    'Is not equal to': {
      condition: (node) => node?.parentNode?.className === 'k-input-value-text'
      || node?.parentNode?.className === 'k-list-item-text ng-star-inserted',
      en: "Is not equal to",
      zhCn: "不等于",
    },
    'Starts with': {
      condition: (node) => node?.parentNode?.className === 'k-input-value-text'
      || node?.parentNode?.className === 'k-list-item-text ng-star-inserted',
      en: "Starts with",
      zhCn: "以...开头",
    },
    'Ends with': {
      condition: (node) => node?.parentNode?.className === 'k-input-value-text'
      || node?.parentNode?.className === 'k-list-item-text ng-star-inserted',
      en: "Ends with",
      zhCn: "以...结尾",
    },
    'Is empty': {
      condition: (node) => node?.parentNode?.className === 'k-input-value-text'
      || node?.parentNode?.className === 'k-list-item-text ng-star-inserted',
      en: "Is empty",
      zhCn: "为空",
    },
    'Is not empty': {
      condition: (node) => node?.parentNode?.className === 'k-input-value-text'
      || node?.parentNode?.className === 'k-list-item-text ng-star-inserted',
      en: "Is not empty",
      zhCn: "不为空",
    },
    'Regular expression': {
      condition: (node) => node?.parentNode?.className === 'k-input-value-text'
      || node?.parentNode?.className === 'k-list-item-text ng-star-inserted',
      en: "Regular expression",
      zhCn: "正则表达式",
    },
    'Close': {
      condition: (node) => node?.parentNode?.className === 'k-button-text',
      en: "Close",
      zhCn: "关闭",
    },
    ' Apply ': {
      condition: (node) => node?.parentNode?.className === 'k-button-text',
      en: " Apply ",
      zhCn: " 应用 ",
    },
    // #region Filters
  };
  const regExpI18n = [
    {
      regExp: /Timings \((.*?)\)/,
      en: ($0, $1) => `Timings (${$1})`,
      zhCn: ($0, $1) => `时序 (${$1})`,
    },
    {
      regExp: / (\d+) selected /,
      en: ($0, $1) => ` ${$1} selected `,
      zhCn: ($0, $1) => ` ${$1} 选中 `,
    }
  ];
  // TODO: 用于切换语言时更新
  const node2keyword = new Map();
  let lang = "zhCn";
  window.switchLanguage = async (newLang) => {
    if (newLang === lang) return;
    console.info("switchLanguage", newLang);
    lang = newLang;
    for (const [node, keyword] of node2keyword.entries()) {
      if (i18n[keyword]) {
        const translation = i18n[keyword][lang] || keyword;
        if (node.nodeType === Node.TEXT_NODE) {
          node.nodeValue = translation;
        } else if (node.nodeName === "INPUT" && node.placeholder) {
          node.placeholder = translation;
        } else if (node.attributes && node.attributes.title) {
          node.attributes.title.nodeValue = translation;
        } else if (node.dataset && node.dataset.placeholder) {
          node.dataset.placeholder = translation;
        }
      }
    }
  };

  const checkCondition = (node, condition) => {
    if (typeof condition === "function") {
      return condition(node);
    }
    return true;
  };
  const translateRegExp = (text) => {
    for (const item of regExpI18n) {
      if (item.regExp.test(text)) {
        return text.replace(item.regExp, item[lang]);
      }
    }
    return text;
  };
  /** @param {Node} node */
  const translate = (node) => {
    // console.info('translate', node, node.nodeType, node.nodeName, node.nodeValue)
    if (node.attributes && node.attributes.title) {
      // 处理title属性
      const title = node.attributes.title;
      const translation = i18n[title.nodeValue];
      if (translation && checkCondition(node, translation.condition)) {
        node2keyword.set(title, title.nodeValue);
        title.nodeValue = translation[lang] || title.nodeValue;
      }
    }
    if (node?.dataset?.placeholder) {
      // 处理data-placeholder属性
      const translation = i18n[node.dataset.placeholder];
      if (translation && checkCondition(node, translation.condition)) {
        node2keyword.set(node, node.dataset.placeholder);
        node.dataset.placeholder =
          translation[lang] || node.dataset.placeholder;
      }
    }
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.nodeValue) return undefined;
      if (!i18n[node.nodeValue]) {
        // 正则处理
        const translatedText = translateRegExp(node.nodeValue);
        if (translatedText !== node.nodeValue) {
          node2keyword.set(node, node.nodeValue);
          node.nodeValue = translatedText;
        }
        return;
      }
      if (!checkCondition(node, i18n[node.nodeValue].condition)) return;
      node2keyword.set(node, node.nodeValue);
      node.nodeValue = i18n[node.nodeValue][lang] || node.nodeValue;
    } else if (node.nodeName === "INPUT") {
      // 处理input元素的placeholder
      if (
        node.placeholder &&
        i18n[node.placeholder] &&
        checkCondition(node, i18n[node.placeholder].condition)
      ) {
        node2keyword.set(node, node.placeholder);
        node.placeholder = i18n[node.placeholder][lang] || node.placeholder;
      }
    }
  };

  const observer = new MutationObserver((mutations) => {
    // console.info('[load]: MutationObserver', mutations);
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            translate(node);
            // 递归处理子节点
            const walker = document.createTreeWalker(
              node,
              NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
            );
            while (walker.nextNode()) {
              translate(walker.currentNode);
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            translate(node);
          }
        });
      } else if (mutation.type === "attributes") {
        // 处理属性变化
        translate(mutation.target);
      } else if (mutation.type === "characterData") {
        // 处理文本节点内容变化
        translate(mutation.target);
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
