(function () {
  var config = window.NAV_CONFIG || {};
  var logoColor   = config.logoColor   || '#02031F';
  var overlayBg   = config.overlayBg   || '#02031F';
  var menuText    = config.menuText    || '#F0EDE4';
  var activePage  = config.activePage  || '';

  var pages = [
    { label: '首頁',            href: '/',                                              cls: '',   key: 'home'     },
    { label: 'NOVUM AI Index',  href: 'https://novum.to/ai-index/tw/food/index.html',  cls: 'en', key: 'ai-index' },
    { label: '關於我們',         href: '/about',                                         cls: '',   key: 'about'    },
    { label: 'FAQ',             href: '/faq',                                           cls: 'en', key: 'faq'      },
    { label: 'Blog',            href: '/blog',                                          cls: 'en', key: 'blog'     }
  ];

  var items = pages.map(function (p) {
    var color = (p.key === activePage) ? '#FFE234' : menuText;
    return '<a href="' + p.href + '" class="nv-item' + (p.cls ? ' ' + p.cls : '') + '" style="color:' + color + '">' + p.label + '</a>';
  }).join('');

  var html =
    '<div id="nvOverlay" class="nv-overlay" style="background:' + overlayBg + '">' +
      '<button class="nv-close" onclick="document.getElementById(\'nvOverlay\').classList.remove(\'open\')">✕</button>' +
      items +
    '</div>' +
    '<nav class="nv-bar">' +
      '<a href="/" class="nv-logo" style="color:' + logoColor + '">NOVUM</a>' +
      '<button class="nv-burger" onclick="document.getElementById(\'nvOverlay\').classList.add(\'open\')">' +
        '<span style="background:' + logoColor + '"></span>' +
        '<span style="background:' + logoColor + '"></span>' +
        '<span style="background:' + logoColor + '"></span>' +
      '</button>' +
    '</nav>';

  var style = document.createElement('style');
  style.textContent = [
    '.nv-overlay{display:none;position:fixed;inset:0;z-index:100;padding:24px 40px;flex-direction:column;justify-content:center;}',
    '.nv-overlay.open{display:flex;}',
    '.nv-close{align-self:flex-end;margin-bottom:16px;cursor:pointer;font-size:32px;color:#3DB86A;background:none;border:none;line-height:1;}',
    '.nv-item{font-family:"Noto Sans TC",sans-serif;font-weight:900;font-size:clamp(40px,7vw,80px);line-height:0.95;letter-spacing:-0.03em;transition:color 0.2s;padding:8px 0;text-decoration:none;display:block;}',
    '.nv-item.en{font-family:"Roboto Slab",serif;font-size:clamp(34px,6vw,68px);}',
    '.nv-item:hover{color:#FFE234 !important;}',
    '.nv-bar{padding:20px 48px;display:flex;justify-content:space-between;align-items:center;}',
    '.nv-logo{font-family:"Roboto Slab",serif;font-size:18px;font-weight:700;letter-spacing:0.08em;text-decoration:none;}',
    '.nv-burger{cursor:pointer;display:flex;flex-direction:column;gap:5px;padding:4px;background:none;border:none;}',
    '.nv-burger span{display:block;width:24px;height:2px;border-radius:2px;}',
    '@media(max-width:640px){.nv-bar{padding:16px 20px;}.nv-overlay{padding:24px 20px;}}',
    '.nv-footer{padding:48px 48px 32px;display:flex;justify-content:center;gap:24px;align-items:center;font-size:13px;opacity:0.55;}',
    '.nv-footer a{color:inherit;text-decoration:none;transition:opacity 0.2s;}',
    '.nv-footer a:hover{opacity:0.7;}',
    '@media(max-width:640px){.nv-footer{padding:32px 20px 24px;font-size:12px;gap:16px;}}'
  ].join('');

  // Footer HTML
  var footerHtml =
    '<footer class="nv-footer" style="color:' + logoColor + '">' +
      '<span>© 2026 NOVUM</span>' +
      '<a href="/terms.html">使用條款</a>' +
    '</footer>';

  document.head.appendChild(style);
  document.body.insertAdjacentHTML('afterbegin', html);
  document.body.insertAdjacentHTML('beforeend', footerHtml);
})();
