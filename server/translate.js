"use strict";var l=require("electron"),g=process;process.once("loaded",()=>{let c=e=>{l.ipcRenderer?.send("preload-script-error",e?.message)};try{window.global=window,global.process=g,window.ipc=l.ipcRenderer}catch(e){c(e)}try{let e=window.process.argv.find(t=>t.startsWith("--fiddler-zoom-factor="));e&&l.webFrame.setZoomFactor(parseFloat(e.substring(22)))}catch(e){c(e)}try{let e=document.cookie}catch{return}if(document.cookie||(document.cookie="FiddlerTestCookie=true; path=/"),!document.cookie){let e="__fiddler_file_cookies__";try{let t=new Date().getTime(),o=JSON.parse(localStorage.getItem(e)||"[]");for(let r=o.length-1;r>=0;r--){let i=o[r]?.key||"";if(!i.startsWith("_g")&&i!=="ssid")o.splice(r,1);else{let s=o[r]?.cookie?.indexOf("xpires=")+7;if(s!==6&&s<o[r].cookie.length){let n=o[r].cookie.indexOf(";",s+1),a=o[r].cookie.substring(s,n===-1?void 0:n);a&&new Date(a).getTime()<t&&o.splice(r,1)}}}localStorage.setItem(e,JSON.stringify(o))}catch(t){c(t)}document.__defineGetter__("cookie",()=>{let t=[];try{t=JSON.parse(localStorage.getItem(e)||"[]")}catch(o){c(o)}return t?t.map(o=>o.key+"="+o.value).join("; "):""}),document.__defineSetter__("cookie",t=>{let r=(t.indexOf(";")?t.substring(0,t.indexOf(";")):t).trim().split("=");if(r.length!==2)return;let i=r[0].trim(),s=r[1].trim();if(i?.startsWith("WZRK_"))return;let n=[];try{n=JSON.parse(localStorage.getItem(e)||"[]")}catch(d){c(d)}let a=n.findIndex(d=>d&&d.key===i);a!==-1?n[a]={key:i,value:s,cookie:t}:n.push({key:i,value:s,cookie:t}),localStorage.setItem(e,JSON.stringify(n))})}});
(async () => {
  console.info("-------Translation----------");
  const i18n = {
    // #region 标题栏
    "Report an Issue": {
      condition: (node) =>
        node?.parentNode?.className === "button__text ng-star-inserted",
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
        node?.parentNode?.className === "button__text ng-star-inserted",
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
        node?.parentNode?.parentNode?.className === "k-tab ng-star-inserted",
      en: "Live Traffic",
      zhCn: "实时流量",
    },
    Filters: {
      condition: (node) =>
        node?.parentNode?.className === "button__text ng-star-inserted",
      en: "Filters",
      zhCn: "过滤器",
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
    // #endregion Traffic - Right Panel
  };
  const regExpI18n = [
    {
      regExp: /Timings \((.*?)\)/,
      en: ($0, $1) => `Timings (${$1})`,
      zhCn: ($0, $1) => `时序 (${$1})`,
    },
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
      }
    });
  });
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