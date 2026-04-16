// ================================================================
// nav.js — 統一導覽列，所有頁面共用
// 只改這一個檔案就能更新全站 nav
//
// 各頁面可設定的 window 變數：
//   window.SHOW_BACK  = true        顯示返回按鈕
//   window.NAV_THEME  = 'dark'      深色主題（card 頁）
//                     = 'gray'      灰色主題（faq 頁）
//                     = 'green'     綠色主題（about 頁）
//                     （不設定）    預設黃色主題
// ================================================================

(function () {

  const THEME     = window.NAV_THEME || 'light';
  const SHOW_BACK = !!window.SHOW_BACK;

  const MENU_LINKS = [
    { text: 'NOVUM',   href: 'https://novum.to' },
    { text: '關於我們', href: '/ai-index/tw/about' },
    { text: 'FAQ',     href: '/ai-index/tw/faq' },
    { text: '產品',    href: '/ai-index/tw/card' },
  ];

  // 各主題的 nav bar 顏色
  const themeMap = {
    light: {
      bg:     'var(--bg, #fade3c)',
      text:   '#02031f',
      border: 'rgba(2,3,31,0.12)',
      dim:    'rgba(2,3,31,0.4)',
    },
    gray: {
      bg:     '#939da7',
      text:   '#02031f',
      border: 'rgba(2,3,31,0.12)',
      dim:    'rgba(2,3,31,0.4)',
    },
    dark: {
      bg:     'rgba(14,42,26,0.96)',
      text:   '#f4f6fc',
      border: 'rgba(255,255,255,0.08)',
      dim:    'rgba(244,246,252,0.45)',
    },
    green: {
      bg:     'rgba(61,184,106,0.97)',
      text:   '#0e2a1a',
      border: 'rgba(14,42,26,0.15)',
      dim:    'rgba(14,42,26,0.45)',
    },
  };

  const t = themeMap[THEME] || themeMap.light;

  /* ── CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    body { padding-top: 56px; }

    #sn-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 900;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      background: ${t.bg};
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid ${t.border};
    }

    .sn-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sn-brand {
      font-family: 'Roboto Slab', serif;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: ${t.text};
      text-decoration: none;
      user-select: none;
    }

    .sn-back {
      font-size: 1rem;
      color: ${t.dim};
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-family: inherit;
      line-height: 1;
      transition: opacity 0.2s;
    }
    .sn-back:hover { opacity: 0.7; }

    .sn-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .sn-toggle span {
      display: block;
      width: 22px;
      height: 2px;
      border-radius: 2px;
      background: ${t.text};
      transition: 0.3s;
    }

    /* ── overlay（固定深綠，所有主題一致）── */
    #sn-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 980;
      background: #082014;
      flex-direction: column;
      padding: 1.5rem 2rem 2rem;
    }
    #sn-overlay.open { display: flex; }

    .sn-ov-top {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1.5rem;
    }
    .sn-ov-close {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(244,246,252,0.55);
      font-size: 1.6rem;
      line-height: 1;
      padding: 4px;
      transition: opacity 0.2s;
    }
    .sn-ov-close:hover { opacity: 0.8; }

    .sn-ov-links {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .sn-ov-links a {
      font-family: 'Roboto Slab', serif;
      font-size: clamp(3rem, 10vw, 5rem);
      font-weight: 900;
      line-height: 0.95;
      text-decoration: none;
      color: #3DB86A;
      letter-spacing: -0.02em;
      transition: color 0.15s;
    }
    .sn-ov-links a:hover { color: #f4f6fc; }
    .sn-ov-links a.sn-active { color: #FFE234; }

    @media (max-width: 640px) {
      #sn-bar { padding: 0 1.2rem; }
    }
  `;
  document.head.appendChild(style);

  /* ── Nav Bar ── */
  const bar = document.createElement('nav');
  bar.id = 'sn-bar';
  bar.innerHTML = `
    <div class="sn-left">
      ${SHOW_BACK ? `<button class="sn-back" onclick="snBack()">←</button>` : ''}
      <a class="sn-brand" href="/ai-index/tw/food">NOVUM AI Index</a>
    </div>
    <button class="sn-toggle" aria-label="開啟選單" onclick="snOpen()">
      <span></span><span></span><span></span>
    </button>
  `;
  document.body.insertBefore(bar, document.body.firstChild);

  /* ── Overlay ── */
  const currentPath = location.pathname.replace(/\/$/, '');

  const linksHtml = MENU_LINKS.map(l => {
    const lPath = new URL(l.href, location.origin).pathname.replace(/\/$/, '');
    const active = currentPath === lPath ? ' sn-active' : '';
    return `<a href="${l.href}"${active ? ' class="sn-active"' : ''}>${l.text}</a>`;
  }).join('');

  const overlay = document.createElement('div');
  overlay.id = 'sn-overlay';
  overlay.innerHTML = `
    <div class="sn-ov-top">
      <button class="sn-ov-close" aria-label="關閉選單" onclick="snClose()">✕</button>
    </div>
    <nav class="sn-ov-links">${linksHtml}</nav>
  `;
  document.body.appendChild(overlay);

  /* ── 函式：掛在 window 上讓 HTML onclick 可用 ── */
  window.snOpen = function () {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.snClose = function () {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // 智慧返回：從站內來就 history.back()，從站外來就回目錄首頁
  window.snBack = function () {
    if (document.referrer && document.referrer.includes('novum.to')) {
      history.back();
    } else {
      location.href = '/ai-index/tw/food';
    }
  };

})();
