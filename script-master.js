const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec";

function buildMenu() {
    const nav = document.querySelector('nav');
    nav.innerHTML = `
    <a href="index.html" class="menu-item">Real Time</a>
    <div class="menu-item">Billboard
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a>
            <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a>
            <a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">B200 by Style</a>
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
    </div>`;
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(10);
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    app.innerHTML = `
        <div class="filters">
            <select id="dateS" onchange="renderChart('${tab}', ${hasStyle})">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
            ${hasStyle ? `<select id="styleS" onchange="renderChart('${tab}', true)"><option value="">Estilos</option>${f.styles.map(s => `<option value="${s}">${s}</option>`).join('')}</select>` : ''}
        </div><div id="chart-area"></div>`;
    renderChart(tab, hasStyle);
}

async function renderChart(tab, hasStyle) {
    const date = document.getElementById('dateS').value;
    const style = hasStyle ? document.getElementById('styleS').value : "";
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}&style=${style}`).then(r => r.json());
    
    document.getElementById('chart-area').innerHTML = res.map(i => {
        let stClass = ""; let stIcon = i.st;
        if(i.st.includes("NEW")) stClass = "new";
        else if(i.st.includes("↑") || i.st.includes("subiu")) { stClass = "up"; stIcon = `↑${i.q}`; }
        else if(i.st.includes("↓") || i.st.includes("desceu")) { stClass = "down"; stIcon = `↓${i.q}`; }

        return `
            <div class="chart-row">
                <div class="rank">${i.pos}</div>
                <div class="status ${stClass}">${stIcon}</div>
                <img src="${i.capa}">
                <div class="info-box"><b>${i.tit}</b><span>${i.art}</span></div>
                <div class="stats-box"><b>${i.val}</b><small>Total: ${i.tot}</small></div>
            </div>`;
    }).join('');
}

async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const d = await fetch(API + "?action=getRealTime").then(r => r.json());
    const row = (l, c) => l.map(i => `<div class="chart-row" style="grid-template-columns:30px 45px 1fr 90px; background:transparent;"><div style="color:#444;">${i.p}</div><img src="${i.c}" style="width:40px; height:40px;"><div class="info-box"><b>${i.t}</b></div><div style="text-align:right; color:${c}; font-weight:900;">${i.s}</div></div>`).join('');
    app.innerHTML = `<div class="rt-grid">
        <div class="rt-col"><div class="rt-head" style="background:var(--sp); color:black;">Spotify</div>${row(d.spotify, 'var(--sp)')}</div>
        <div class="rt-col"><div class="rt-head" style="background:#fff; color:var(--am);">Apple</div>${row(d.apple, 'var(--am)')}</div>
        <div class="rt-col"><div class="rt-head" style="background:var(--yt); color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div>
    </div>`;
}
