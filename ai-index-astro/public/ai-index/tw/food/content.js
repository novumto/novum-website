// ================================================================
// content.js — 靜態文字內容與資料
// ================================================================

const HERO = {
  title:    'NOVUM AI Index',
  subtitle: '台灣餐飲 AI 指數',
  ctaText:  '加入我們',
};

const CRAWLERS = [
  { name: 'GPTBot' },
  { name: 'ClaudeBot' },
  { name: 'PerplexityBot' },
  { name: 'Googlebot' },
  { name: 'BingBot' },
  { name: 'DuckDuckBot' },
  { name: 'BraveBot' },
  { name: 'OAI-SearchBot' },
  { name: 'Applebot' },
  { name: 'Amazonbot' },
];

const MODAL_CONTENT = {
  title: 'Hi！歡迎加入 NOVUM AI Index！',
  description: `NOVUM AI Index 致力於建構台灣品牌的 AI 能見度目錄。<br><br>
加入完全免費，登錄後你的品牌資料將出現在目錄中，獲得 AI 爬蟲流量曝光機會。`,

  reportCheckboxText: '同時申請免費「品牌 GEO 基礎檢測」報告',
  reportCheckboxNote: '我們會分析你的品牌網站 AI 能見度，2 個工作天內寄送至你的信箱',

  agreeText: '我已了解並同意 NOVUM AI Index 的資料使用方式：我的品牌資料將顯示於目錄，並用於匿名趨勢分析。若申請報告，我同意 NOVUM 對我提供的網站進行 AI 能見度分析。所有品牌資料、分析數據及報告內容，均不會出售、交換或以任何形式提供給第三方。',
  submitText: '送出申請',

  successTitle: '申請成功！',
  successMessage: `感謝你加入 NOVUM AI Index！<br>你的品牌網站審核中，完成後將會出現在目錄中。`,

  successTitleWithReport: '申請成功！',
  successMessageWithReport: `感謝你加入 NOVUM AI Index！<br>
我們已收到你的申請，<br>
「品牌 GEO 基礎檢測」報告將於 2 個工作天內寄送至你的信箱。<br>
你的品牌資料將同步出現在目錄中。`,

  successClose: '關閉',
};

const INDUSTRY_OPTIONS = [
  '台式料理', '台式小吃', '中式料理', '日式料理', '韓式料理',
  '東南亞料理', '西式料理', '印度料理', '中東料理',
  '餐酒館', '火鍋', '燒肉燒烤', '咖啡廳', '甜點烘焙',
  '飲料手搖', '素食蔬食', '早午餐', '其他餐飲',
];

const FOOTER = {
  copyright: '© 2026 NOVUM',
  links: [
    { text: '使用條款', href: 'https://novum.to/terms.html' },
  ],
};

// ================================================================
// 渲染函式
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderCrawlers();
  renderModal();
  renderFooter();
});

function renderHero() {
  const titleEl = document.getElementById('heroTitle');
  if (titleEl) titleEl.textContent = HERO.title;

  const region   = window.REGION   || '';
  const industry = window.INDUSTRY || '';
  const sub = (region && industry)
    ? `台灣${region}${industry} AI 指數`
    : HERO.subtitle;

  const subEl = document.getElementById('heroSubtitle');
  if (subEl) subEl.textContent = sub;

  const ctaEl = document.getElementById('heroCta');
  if (ctaEl) ctaEl.textContent = HERO.ctaText;
}

async function renderCrawlers() {
  const grid = document.getElementById('crawlerGrid');
  if (!grid) return;

  CRAWLERS.forEach(c => {
    const badge = document.createElement('div');
    badge.className = 'crawler-badge';
    badge.dataset.bot = c.name;
    badge.innerHTML = `
      <span class="dot dot-green"></span>
      ${c.name}
      <span class="visits">—</span>
    `;
    grid.appendChild(badge);
  });

  try {
    const res = await fetch(
      'https://kbdopotmdptyprxsiwdj.supabase.co/rest/v1/crawler_visits?select=bot_name,visit_count,last_seen',
      {
        headers: {
          apikey: 'sb_publishable_9Q-KsUhlMSZbsVKJP4YvKw_GOem8M1G',
          Authorization: 'Bearer sb_publishable_9Q-KsUhlMSZbsVKJP4YvKw_GOem8M1G'
        }
      }
    );
    const data = await res.json();
    data.forEach(row => {
      const badge = grid.querySelector(`[data-bot="${row.bot_name}"]`);
      if (!badge) return;
      badge.querySelector('.visits').textContent =
        row.visit_count.toLocaleString() + ' 次';
    });
  } catch (err) {
    console.error('無法讀取爬蟲數據', err);
  }
}

function renderModal() {
  const titleEl = document.getElementById('modalTitle');
  if (titleEl) titleEl.textContent = MODAL_CONTENT.title;

  const descEl = document.getElementById('modalDesc');
  if (descEl) descEl.innerHTML = MODAL_CONTENT.description;

  const reportLabel = document.getElementById('reportCheckboxLabel');
  if (reportLabel) reportLabel.textContent = MODAL_CONTENT.reportCheckboxText;

  const reportNote = document.getElementById('reportCheckboxNote');
  if (reportNote) reportNote.textContent = MODAL_CONTENT.reportCheckboxNote;

  const agreeEl = document.getElementById('agreeLabel');
  if (agreeEl) agreeEl.textContent = MODAL_CONTENT.agreeText;

  const submitEl = document.getElementById('submitBtn');
  if (submitEl) submitEl.textContent = MODAL_CONTENT.submitText;

  const successTitleEl = document.getElementById('successTitle');
  if (successTitleEl) successTitleEl.textContent = MODAL_CONTENT.successTitle;

  const successMsgEl = document.getElementById('successMessage');
  if (successMsgEl) successMsgEl.innerHTML = MODAL_CONTENT.successMessage;

  const successCloseEl = document.getElementById('successCloseBtn');
  if (successCloseEl) successCloseEl.textContent = MODAL_CONTENT.successClose;

  const industrySelect = document.getElementById('selectIndustry');
  if (industrySelect) {
    const group = document.createElement('optgroup');
    group.label = '餐飲';
    INDUSTRY_OPTIONS.forEach(opt => {
      const o = document.createElement('option');
      o.textContent = opt;
      group.appendChild(o);
    });
    industrySelect.appendChild(group);
  }
}

function renderFooter() {
  if (document.querySelector('.site-footer')) return;

  const footer = document.createElement('footer');
  footer.className = 'site-footer';

  const linksHtml = FOOTER.links
    .map(l => `<a href="${l.href}" target="_blank">${l.text}</a>`)
    .join(' · ');

  footer.innerHTML = `
    <div class="footer-inner">
      <span class="footer-copy">${FOOTER.copyright}</span>
      <span class="footer-links">${linksHtml}</span>
    </div>
  `;

  document.body.appendChild(footer);
}

function renderStoreCard(store) {
  const card = document.createElement('div');
  card.className = 'store-card';
  card.innerHTML = `
    <div class="store-card-top">
      <div class="store-name">${store.name}</div>
    </div>
    <div class="store-meta-list">
      <div class="store-meta-row">
        <span class="meta-label">官網</span>
        <a class="meta-link" href="${store.website}" target="_blank">${store.website.replace('https://','')}</a>
      </div>
      <div class="store-meta-row">
        <span class="meta-label">產業</span>
        <span class="meta-val">${store.industry}</span>
      </div>
      <div class="store-meta-row">
        <span class="meta-label">地區</span>
        <span class="meta-val">${store.city} · ${store.region}</span>
      </div>
    </div>
  `;
  return card;
}