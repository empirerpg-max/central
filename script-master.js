// ⚠️ SUBSTITUA PELO SEU LINK /exec DO APPS SCRIPT
const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec";

function buildMenu() {
    const nav = document.querySelector('nav');
    nav.innerHTML = `
    <a href="index.html" class="menu-item">Real Time</a>
    <div class="menu-item">Billboard
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a>
            <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a>
            <a href="charts.html?tab=DIGITAL SALES" class="sub-btn">Digital Sales</a>
        </div>
    </div>
    <div class="menu-item">Spotify
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Global Chart</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Monthly Listeners</a>
        </div>
    </div>
    <div class="menu-item">Apple
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Global Chart</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Monthly Listeners</a>
        </div>
    </div>
    <div class="menu-item">YouTube
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn">Global Chart</a>
            <a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn">Monthly Listeners</a>
        </div>
    </div>`;
}

async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(6);
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `<div class="rt-row"><div style="color:#555;font-weight:900;">${i.p}</div><img src="${i.c}" onerror="this.src='https://via.placeholder.com/40'"><div style="padding:0 15px;font-weight:700;">${i.t}</div><div style="text-align:right;font-weight:900;color:${c}">${i.s}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid">
            <div class="rt-col"><div class="rt-head" style="background:var(--sp);color:black;">SPOTIFY</div>${row(d.spotify, 'var(--sp)')}</div>
            <div class="rt-col"><div class="rt-head" style="background:#fff;color:var(--am);">APPLE MUSIC</div>${row(d.apple, 'var(--am)')}</div>
            <div class="rt-col"><div class="rt-head" style="background:var(--yt);color:#fff;">YOUTUBE</div>${row(d.youtube, '#fff')}</div>
        </div>`;
    } catch (e) { app.innerHTML = `<p class="error">Falha ao sincronizar: ${e.message}</p>`; }
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(8);
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    app.innerHTML = `<div class="filters">
        <select id="dateS" onchange="renderChart('${tab}', ${hasStyle})">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
        ${hasStyle ? `<select id="styleS" onchange="renderChart('${tab}', true)"><option value="">Estilos</option>${f.styles.map(s => `<option value="${s}">${s}</option>`).join('')}</select>` : ''}
    </div><div id="chart-area"></div>`;
    renderChart(tab, hasStyle);
}

async function renderChart(tab, hasStyle) {
    const d = document.getElementById('dateS').value;
    const s = hasStyle ? document.getElementById('styleS').value : "";
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${d}&style=${s}`).then(r => r.json());
    document.getElementById('chart-area').innerHTML = res.map(i => `<div class="chart-row"><div class="rank">#${i.pos}</div><img src="${i.capa}"><div><b>${i.tit}</b><br><small style="color:#888;">${i.art}</small></div><div style="text-align:right;"><b>${i.val}</b><br><small style="color:var(--empire);">TOTAL: ${i.tot}</small></div></div>`).join('');
}

async function initCountry(tab) {
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    document.getElementById('app').innerHTML = `<div class="filters">
        <select id="countryS" onchange="renderCountry('${tab}')">${f.countries.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
        <select id="dateS" onchange="renderCountry('${tab}')">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
    </div><div id="chart-area"></div>`;
    renderCountry(tab);
}

async function renderCountry(tab) {
    const c = document.getElementById('countryS').value;
    const d = document.getElementById('dateS').value;
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${d}&country=${c}`).then(r => r.json());
    document.getElementById('chart-area').innerHTML = res.length ? res.map(i => `<div class="chart-row"><div class="rank">#${i.pos}</div><img src="${i.capa}"><div><b>${i.tit}</b><br><small style="color:#888;">${i.art}</small></div><div style="text-align:right; font-weight:900; color:var(--sp);">${i.val}</div></div>`).join('') : `<p style="text-align:center; padding:50px;">Sem dados disponíveis.</p>`;
}
