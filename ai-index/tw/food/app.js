// ================================================================
// app.js — 互動邏輯 + Supabase 資料庫連線
// ================================================================

// ── Supabase 設定 ──
const SUPABASE_URL = 'https://kbdopotmdptyprxsiwdj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9Q-KsUhlMSZbsVKJP4YvKw_GOem8M1G';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 地區對應縣市 ──
const cityMap = {
  '北部': ['台北市', '新北市', '基隆市', '桃園市', '新竹市', '新竹縣', '宜蘭縣'],
  '中部': ['苗栗縣', '台中市', '彰化縣', '南投縣', '雲林縣'],
  '南部': ['嘉義市', '嘉義縣', '台南市', '高雄市', '屏東縣'],
  '花東': ['花蓮縣', '台東縣'],
  '離島': ['澎湖縣', '金門縣', '連江縣（馬祖）'],
};

// ================================================================
// 頁面載入：從資料庫讀取店家
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadStores();

  const reportCheckbox = document.getElementById('requestReport');
  if (reportCheckbox) {
    reportCheckbox.addEventListener('change', toggleEmailField);
  }
});

function toggleEmailField() {
  const checked    = document.getElementById('requestReport').checked;
  const emailNote  = document.getElementById('emailRequiredNote');
  const emailInput = document.getElementById('inputEmail');

  if (emailNote) {
    emailNote.style.opacity = checked ? '1' : '0.4';
    emailNote.textContent   = checked ? '（申請報告必填）' : '（選填）';
  }
  if (emailInput) {
    emailInput.placeholder = checked ? '請輸入電子信箱' : '選填';
  }
}

async function loadStores() {
  const grid    = document.getElementById('storeGrid');
  const loading = document.getElementById('storeLoading');
  if (!grid) return;

  let query = db.from('stores').select('*');
  if (window.REGION)   query = query.eq('region', window.REGION);
  if (window.INDUSTRY) query = query.eq('industry_type', window.INDUSTRY);
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (loading) loading.remove();

  if (error) {
    grid.innerHTML = '<p style="opacity:0.5;font-size:0.88rem;">資料讀取失敗，請稍後再試。</p>';
    return;
  }
  if (!data || data.length === 0) {
    grid.innerHTML = '<p style="opacity:0.5;font-size:0.88rem;">目前尚無收錄店家，成為第一個加入的店家吧！</p>';
    return;
  }
  data.forEach(store => grid.appendChild(renderStoreCard(store)));
}

// ================================================================
// 表單送出
// ================================================================

async function submitForm() {
  const name     = document.getElementById('inputName').value.trim();
  const website  = document.getElementById('inputWebsite').value.trim();
  const email    = document.getElementById('inputEmail').value.trim();
  const industry = document.getElementById('selectIndustry').value;
  const region   = document.getElementById('selectRegion').value;
  const city     = document.getElementById('selectCity').value;
  const agreed   = document.getElementById('agree').checked;

  const reportCheckbox = document.getElementById('requestReport');
  const requestReport  = reportCheckbox ? reportCheckbox.checked : false;

  let hasError = false;

  function markError(el) {
    el.style.borderColor = 'var(--text)';
    el.style.outline = '1.5px solid var(--text)';
    setTimeout(() => { el.style.borderColor = ''; el.style.outline = ''; }, 1800);
  }

  if (!name)    { markError(document.getElementById('inputName'));    hasError = true; }
  if (!website) { markError(document.getElementById('inputWebsite')); hasError = true; }
  if (requestReport && !email) {
    markError(document.getElementById('inputEmail'));
    hasError = true;
  }
  if (!industry) { markError(document.getElementById('selectIndustry')); hasError = true; }
  if (!region)   { markError(document.getElementById('selectRegion'));   hasError = true; }
  if (!city)     { markError(document.getElementById('selectCity'));     hasError = true; }

  if (!agreed) {
    const group = document.getElementById('agree').closest('.form-group');
    group.style.outline = '1.5px solid var(--text)';
    group.style.borderRadius = '6px';
    group.style.padding = '6px';
    setTimeout(() => { group.style.outline = ''; group.style.padding = ''; }, 1800);
    hasError = true;
  }

  if (hasError) return;

  const btn = document.getElementById('submitBtn');
  btn.textContent = '送出中⋯';
  btn.disabled = true;

  const industryTypeMap = {
    '台式料理':'餐飲', '台式小吃':'餐飲', '中式料理':'餐飲',
    '日式料理':'餐飲', '韓式料理':'餐飲', '東南亞料理':'餐飲',
    '西式料理':'餐飲', '印度料理':'餐飲', '中東料理':'餐飲',
    '餐酒館':'餐飲',  '火鍋':'餐飲',    '燒肉燒烤':'餐飲',
    '咖啡廳':'餐飲',  '甜點烘焙':'餐飲', '飲料手搖':'餐飲',
    '素食蔬食':'餐飲', '早午餐':'餐飲',  '其他餐飲':'餐飲',
  };
  const industry_type = industryTypeMap[industry] || '';

  const { error } = await db.from('stores').insert({
    name, website,
    email: email || null,
    industry, industry_type,
    region, city, agreed,
    request_report: requestReport,
  });

  if (error) {
    btn.textContent = '送出失敗，請再試一次';
    btn.disabled = false;
    return;
  }

  document.querySelectorAll('.modal .form-group, .modal > p, .modal > h2, #submitBtn')
    .forEach(el => el.style.display = 'none');

  if (requestReport) {
    document.getElementById('successTitle').textContent   = MODAL_CONTENT.successTitleWithReport;
    document.getElementById('successMessage').innerHTML   = MODAL_CONTENT.successMessageWithReport;
  }

  document.getElementById('successScreen').style.display = 'block';

  document.getElementById('storeGrid').innerHTML =
    '<p id="storeLoading" style="opacity:0.5;font-size:0.88rem;">載入中⋯</p>';
  loadStores();
}

// ================================================================
// Modal 互動
// ================================================================

function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';

  document.getElementById('successScreen').style.display = 'none';
  document.querySelectorAll('.modal .form-group, .modal > p, .modal > h2, #submitBtn')
    .forEach(el => el.style.display = '');

  const btn = document.getElementById('submitBtn');
  btn.textContent = MODAL_CONTENT.submitText;
  btn.disabled = false;

  document.getElementById('successTitle').textContent   = MODAL_CONTENT.successTitle;
  document.getElementById('successMessage').innerHTML   = MODAL_CONTENT.successMessage;

  toggleEmailField();
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function filterCity() {
  const region     = document.getElementById('selectRegion').value;
  const citySelect = document.getElementById('selectCity');
  citySelect.innerHTML = '';

  if (!region) {
    citySelect.innerHTML = '<option value="">請先選擇地區</option>';
    return;
  }

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '請選擇縣市';
  citySelect.appendChild(placeholder);

  cityMap[region].forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });
}
