"use strict";var l=require("electron"),g=process;process.once("loaded",()=>{let c=e=>{l.ipcRenderer?.send("preload-script-error",e?.message)};try{window.global=window,global.process=g,window.ipc=l.ipcRenderer}catch(e){c(e)}try{let e=window.process.argv.find(t=>t.startsWith("--fiddler-zoom-factor="));e&&l.webFrame.setZoomFactor(parseFloat(e.substring(22)))}catch(e){c(e)}try{let e=document.cookie}catch{return}if(document.cookie||(document.cookie="FiddlerTestCookie=true; path=/"),!document.cookie){let e="__fiddler_file_cookies__";try{let t=new Date().getTime(),o=JSON.parse(localStorage.getItem(e)||"[]");for(let r=o.length-1;r>=0;r--){let i=o[r]?.key||"";if(!i.startsWith("_g")&&i!=="ssid")o.splice(r,1);else{let s=o[r]?.cookie?.indexOf("xpires=")+7;if(s!==6&&s<o[r].cookie.length){let n=o[r].cookie.indexOf(";",s+1),a=o[r].cookie.substring(s,n===-1?void 0:n);a&&new Date(a).getTime()<t&&o.splice(r,1)}}}localStorage.setItem(e,JSON.stringify(o))}catch(t){c(t)}document.__defineGetter__("cookie",()=>{let t=[];try{t=JSON.parse(localStorage.getItem(e)||"[]")}catch(o){c(o)}return t?t.map(o=>o.key+"="+o.value).join("; "):""}),document.__defineSetter__("cookie",t=>{let r=(t.indexOf(";")?t.substring(0,t.indexOf(";")):t).trim().split("=");if(r.length!==2)return;let i=r[0].trim(),s=r[1].trim();if(i?.startsWith("WZRK_"))return;let n=[];try{n=JSON.parse(localStorage.getItem(e)||"[]")}catch(d){c(d)}let a=n.findIndex(d=>d&&d.key===i);a!==-1?n[a]={key:i,value:s,cookie:t}:n.push({key:i,value:s,cookie:t}),localStorage.setItem(e,JSON.stringify(n))})}});
(async () => {
  log.info('-------Translation----------')
  const i18n = {
    '搜索你感兴趣的视频': {
      en: 'Search for videos you are interested in',
      zhCn: '搜索你感兴趣的视频'
    },
    '推荐': {
      condition: node => node.parentNode && node.parentNode.classList.contains('vui_tabs--nav-text'),
      en: 'Recommand',
      zhCn: '推荐'
    },
    '直播': {
      condition: node => node.parentNode && node.parentNode.classList.contains('vui_tabs--nav-text'),
      en: 'Live'
    },
    '热门': {
      condition: node => node.parentNode && node.parentNode.classList.contains('vui_tabs--nav-text'),
      en: 'Popular'
    },
    '追番': {
      condition: node => node.parentNode && node.parentNode.classList.contains('vui_tabs--nav-text'),
      en: 'Anime',
    },
    '影视': {
      condition: node => node.parentNode && node.parentNode.classList.contains('vui_tabs--nav-text'),
      en: 'Movie',
    },
    '首页': {
      condition: node => node.parentNode && node.parentNode.className === 'b_text text3',
      en: 'Home'
    },
    '精选': {
      condition: node => node.parentNode && node.parentNode.className === 'b_text text3',
      en: 'Featured'
    },
    '动态': {
      condition: node => node.parentNode && node.parentNode.className === 'b_text text3',
      en: 'Activity'
    },
    '我的': {
      condition: node => node.parentNode && node.parentNode.className === 'b_text text3',
      en: 'Mine'
    },
    '空间': {
      condition: node => node.className === 'settings-item pb_xs',
      en: 'Space'
    },
    '投稿': {
      condition: node => node.className === 'settings-item',
      en: 'Submission',
    },
    '主题': {
      condition: node => node.className === 'settings-item theme',
      en: 'Theme',
    },
    '设置': {
      condition: node => node.className === 'settings-item' || node?.parentNode?.classList?.contains('vui_tabs--nav-text'),
      en: 'Settings',
    },
    '消息（X）': {
      en: 'Message (X)'
    },
    '顶部 ': {
      condition: node => node?.parentNode?.className === 'vui_button vui_button--active-shrink p_relative',
      en: 'Top '
    },
    // #region 动态
    '综合': {
      condition: node => node?.parentNode?.className === 'vui_tabs--nav-text',
      en: 'All'
    },
    '视频': {
      condition: node => node?.parentNode?.className === 'vui_tabs--nav-text',
      en: 'Video'
    },
    '全部动态': {
      condition: node => node?.parentNode?.className === 'up_list--item--title',
      en: 'All Activity'
    },
    // #endregion 动态
    // #region 我的
    '历史记录': {
      condition: node => node?.parentNode?.className === 'vui_tabs--nav-text',
      en: 'History'
    },
    '离线缓存': {
      condition: node => node?.parentNode?.className === 'vui_tabs--nav-text',
      en: 'Download'
    },
    '我的收藏': {
      condition: node => node?.parentNode?.className === 'vui_tabs--nav-text',
      en: 'Collection'
    },
    '稍后再看': {
      condition: node => node?.parentNode?.className === 'vui_tabs--nav-text',
      en: 'Watch Later'
    },
    // #endregion 我的
    // #region 发布视频 - step1
    '发布视频': {
      condition: node => node?.parentNode?.className === 'head-title',
      en: 'Post Video',
      zhCn: '发布视频'
    },
    '上传视频': {
      condition: node => node?.parentNode?.className === 'upload-btn no-events',
      en: 'Upload Video',
      zhCn: '上传视频'
    },
    '视频大小': {
      condition: node => node?.parentNode?.className === 'title',
      en: 'Video Size',
    },
    '视频格式': {
      condition: node => node?.parentNode?.className === 'title',
      en: 'Video Format',
    },
    '视频码率': {
      condition: node => node?.parentNode?.className === 'title',
      en: 'Video Bitrate'
    },
    '禁止发布的视频内容': {
      condition: node => node?.parentNode?.className === 'title',
      en: 'Prohibited video content'
    },
    '拖拽到此处也可上传': {
      condition: node => node?.parentNode?.className === 'upload-text no-events',
      en: 'Drag here to upload'
    },
    '当前审核队列': {
      en: 'Current review queue'
    },
    '快速 ': {
      en: 'Quick ',
      zhCn: '快速 '
    },
    '继续': {
      en: 'Continue',
    },
    '不用了': {
      en: 'No need',
    },
    // #endregion 发布视频 - step1
    // #region 发布视频 - step2
    '批量操作': {
      en: 'Batch Operations',
      zhCn: '批量操作'
    },
    '基本设置': {
      en: 'Basic Settings',
    },
    '一键填写 ': {
      en: 'Fill in one click ',
    },
    '封面': {
      en: 'Cover',
      zhCn: '封面'
    },
    ' 上传封面 ': {
      en: ' Upload Cover ',
      zhCn: ' 上传封面 '
    },
    '标题': {
      en: 'Title',
      zhCn: '标题'
    },
    // TODO: 待修正
    '请输入稿件标题': {
      en: 'Please enter the submission title',
      zhCn: '请输入稿件标题'
    },
    '类型': {
      en: 'Type',
      zhCn: '类型'
    },
    '自制': {
      en: 'Original',
      zhCn: '自制'
    },
    '转载': {
      en: 'Repost',
      zhCn: '转载'
    },
    '标签': {
      en: 'Tags',
      zhCn: '标签'
    },
    '按回车键Enter创建标签': {
      en: 'Press Enter to create a tag',
      zhCn: '按回车键Enter创建标签'
    },
    '推荐标签：': {
      en: 'Recommended Tags: ',
      zhCn: '推荐标签：'
    },
    '参与话题：': {
      en: 'Participate in Topics: ',
      zhCn: '参与话题：'
    },
    '简介': {
      en: 'Description',
      zhCn: '简介'
    },
    '填写更全面的相关信息，让更多的人能找到你的视频吧': {
      en: 'Fill in more comprehensive information so that more people can find your video',
      zhCn: '填写更全面的相关信息，让更多的人能找到你的视频吧'
    },
    '定时发布': {
      en: 'Scheduled Publish',
      zhCn: '定时发布'
    },
    '加入合集': {
      en: 'Join Collection',
      zhCn: '加入合集'
    },
    '二创设置': {
      en: 'Secondary Creation Settings',
      zhCn: '二创设置'
    },
    '允许二创': {
      en: 'Allow Secondary Creation',
      zhCn: '允许二创'
    },
    '商业推广': {
      en: 'Commercial Promotion',
      zhCn: '商业推广'
    },
    '增加商业推广信息': {
      en: 'Add Commercial Promotion Information',
      zhCn: '增加商业推广信息'
    },
    '更多设置 ': {
      en: 'More Settings ',
      zhCn: '更多设置 '
    },
    '添加水印': {
      en: 'Add Watermark',
    },
    ' 开启 ': {
      en: ' Enable ',
    },
    '仅对此次上传的视频生效': {
      en: 'Only effective for this upload',
    },
    '可见范围': {
      en: 'Visibility Range',
    },
    '公开可见': {
      en: 'Public',
    },
    '仅自己可见': {
      en: 'Private',
    },
    '将不支持分享、商业推广和充电设置': {
      en: 'Sharing, commercial promotion, and charging settings will not be supported',
    },
    '声明与权益': {
      en: 'Declaration and Rights',
    },
    ' 创作者声明 ': {
      en: ' Creator Declaration ',
    },
    '视频元素': {
      en: 'Video Elements',
      zhCn: '视频元素'
    },
    ' 卡片配置 ': {
      en: ' Card Configuration ',
    },
    ' 字幕设置 ': {
      en: ' Subtitle Settings ',
    },
    '上传字幕': {
      en: 'Upload Subtitle',
    },
    '互动管理': {
      en: 'Interaction Management',
    },
    '粉丝动态': {
      en: 'Fan Activity',
    },
    '存草稿': {
      en: 'Save Draft',
      zhCn: '存草稿'
    },
    '立即投稿': {
      en: 'Submit Now',
      zhCn: '立即投稿'
    },
    // #endregion 发布视频 - step2
    // #region 发布视频 - step3
    '稿件投递成功': {
      en: 'Submission Successful',
      zhCn: '稿件投递成功'
    },
    ' 查看稿件 ': {
      en: ' View Submission ',
      zhCn: ' 查看稿件 '
    },
    ' 再投一个 ': {
      en: ' Submit Another ',
      zhCn: ' 再投一个 '
    },
    // #endregion 发布视频 - step3
  }
  const regExpI18n = [
    {
      regExp: /	本地浏览器存在(\d+)个未提交的视频/,
      condition: node => node.parentNode && node.parentNode.className === 'content content-un-upload',
      en: ($0, $1) => `There are ${$1} videos not submitted in the local browser`,
    },
    {
      regExp: /还可以添加(\d+)个标签/,
      condition: node => node.parentNode && node.parentNode.className === 'tag-last-wrp',
      en: ($0, $1) => `You can add ${$1} more tags`,
    },
  ]
  // TODO: 用于切换语言时更新
  const node2keyword = new Map()
  let lang = await window.requestBackground('getStorage', {key: 'lang'}) || 'en'
  window.switchLanguage = async (newLang) => {
    if (newLang === lang) return
    log.info('switchLanguage', newLang)
    lang = newLang
    for (const [node, keyword] of node2keyword.entries()) {
      if (i18n[keyword]) {
        const translation = i18n[keyword][lang] || keyword
        if (node.nodeType === Node.TEXT_NODE) {
          node.nodeValue = translation
        } else if (node.nodeName === 'INPUT' && node.placeholder) {
          node.placeholder = translation
        } else if (node.attributes && node.attributes.title) {
          node.attributes.title.nodeValue = translation
        } else if (node.dataset && node.dataset.placeholder) {
          node.dataset.placeholder = translation
        }
      }
    }
  }

  const checkCondition = (node, condition) => {
    if (typeof condition === 'function') {
      return condition(node)
    }
    return true;
  }
  const translateRegExp = (text) => {
    for (const item of regExpI18n) {
      if (item.regExp.test(text)) {
        return text.replace(item.regExp, item[lang])
      }
    }
    return text
  }
  /** @param {Node} node */
  const translate = (node) => {
    if (node.attributes && node.attributes.title) {
      // 处理title属性
      const title = node.attributes.title
      const translation = i18n[title.nodeValue]
      if (translation && checkCondition(node, translation.condition)) {
        node2keyword.set(title, title.nodeValue)
        title.nodeValue = translation[lang] || title.nodeValue
      }
    }
    if (node?.dataset?.placeholder) {
      // 处理data-placeholder属性
      const translation = i18n[node.dataset.placeholder]
      if (translation && checkCondition(node, translation.condition)) {
        node2keyword.set(node, node.dataset.placeholder)
        node.dataset.placeholder = translation[lang] || node.dataset.placeholder
      }
    }
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.nodeValue) return undefined
      if (!i18n[node.nodeValue]) {
        // 正则处理
        const translatedText = translateRegExp(node.nodeValue)
        if (translatedText !== node.nodeValue) {
          node2keyword.set(node, node.nodeValue)
          node.nodeValue = translatedText
        }
        return
      }
      if (!checkCondition(node, i18n[node.nodeValue].condition)) return
      node2keyword.set(node, node.nodeValue)
      node.nodeValue = i18n[node.nodeValue][lang] || node.nodeValue
    }
    else if (node.nodeName === 'INPUT') {
      // 处理input元素的placeholder
      if (node.placeholder && i18n[node.placeholder] && checkCondition(node, i18n[node.placeholder].condition)) {
        node2keyword.set(node, node.placeholder)
        node.placeholder = i18n[node.placeholder][lang] || node.placeholder
      }
    }
  }

  const observer = new MutationObserver((mutations) => {
    // log.info('[load]: MutationObserver', mutations);
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            translate(node);
            // 递归处理子节点
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
            while (walker.nextNode()) {
              translate(walker.currentNode);
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            translate(node);
          }
        });
      } else if (mutation.type === 'attributes') {
        // 处理属性变化
        translate(mutation.target);
      }
    });
  });
  if (!document.body) return
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });
})()