const URLS = {
    RT: "https://script.google.com/macros/s/AKfycbwUWZeRnVwj8L-fevoSzueT762-7opozpait4iIVYwmy41PpuMsghLZu7Q3lBPA-rs/exec",
    BASE: "https://script.google.com/macros/s/AKfycbyF4KYgfbsZWNOq2Adg3NZ6OxOk0VBo1uUKxuKtERmEe96Q26ZfsJxefpAyt-o9MCoPFQ/exec",
    ALBUMS: "https://script.google.com/macros/s/AKfycbySeD6QTgzCyUqU1GXgpnhiAQohtvtC3oaZAlksdWIZEDHVA_8FwPNGQhOYiLaqqirR/exec",
    COUNTRIES: "https://script.google.com/macros/s/AKfycbw4nlszeN807h0EHlmRYyeN9nFKvTi7_tqC-EOCSmG467sTzbzQXrOGjlF4z02DT17H/exec",
    MONTHLY: "https://script.google.com/macros/s/AKfycbzO_dXWJbFgKkUSCvU91F6DIGsBBFCjBHUYxkEwlPms1Mo2dNFbxem0LQ74pZoftg2x_Q/exec"
};

function buildMenu() {
    document.querySelector('nav').innerHTML = `
    <a href="index.html" class="menu-item">Real Time</a>
    <div class="menu-item">Billboard Hot 100
        <div class="submenu">
            <a href="charts.html?type=BASE&tab=BILLBOARD HOT 100" class="sub-btn">Hot 100</a>
            <a href="charts.html?type=BASE&tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a>
        </div>
    </div>
    <div class="menu-item">Spotify
        <div class="submenu">
            <a href="charts.html?type=BASE&tab=SPOTIFY" class="sub-btn">Spotify Global</a>
            <a href="countries.html?type=COUNTRIES&tab=SPOTIFY COUNTRIES" class="sub-btn">Spotify by Country</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Spotify Artists</a>
        </div>
    </div>
    <div class="menu-item">YouTube
        <div class="submenu">
            <a href="charts.html?type=BASE&tab=YOUTUBE" class="sub-btn">YouTube Global</a>
            <a href="countries.html?type=COUNTRIES&tab=YOUTUBE COUNTRIES" class="sub-btn">YouTube by Country</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn">YouTube Artists</a>
        </div>
    </div>
    <div class="menu-item">Billboard 200
        <div class="submenu">
            <a href="charts.html?type=ALBUMS" class="sub-btn">Billboard 200</a>
            <a href="charts.html?type=ALBUMS&style=true" class="sub-btn">B200 by Style</a>
        </div>
    </div>`;
}

// Funções de Carregamento
async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const d = await fetch(URLS.RT).then(r => r.json());
    const row = (l, c) => l.map(i => `<div class="chart-row" style="grid-template-columns:30px 45px 1fr 90px; background:transparent;"><div style="color:#444;">${i.p}</div><img src="${i.c}" style="width:40px; height:40px;"><div class="info-box"><b>${i.t}</b></div><div style="text-align:right; color:${c}; font-weight:900;">${i.s}</div></div>`).join('');
    app.innerHTML = `<div class="rt-grid"><div class="rt-col"><div class="rt-head" style="background:var(--sp); color:black;">Spotify</div>${row(d.spotify, 'var(--sp)')}</div><div class="rt-col"><div class="rt-head" style="background:#fff; color:var(--am);">Apple</div>${row(d.apple, 'var(--am)')}</div><div class="rt-col"><div class="rt-head" style="background:var(--yt); color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div></div>`;
}

async function initChart(type, tab, hasStyle) {
    const area = document.getElementById('app');
    area.innerHTML = '<div class="skeleton"></div>'.repeat(10);
    const f = await fetch(`${URLS[type]}?action=filters&tab=${tab}`).then(r => r.json());
    area.innerHTML = `<div class="filters" style="display:flex; gap:10px; justify-content:center; margin-bottom:30px;"><select id="dateS" onchange="renderChart('${type}', '${tab}', ${hasStyle})">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>${hasStyle ? `<select id="styleS" onchange="renderChart('${type}', '${tab}', true)"><option value="">Estilos</option>${f.styles.map(s => `<option value="${s}">${s}</option>`).join('')}</select>` : ''}</div><div id="chart-list"></div>`;
    renderChart(type, tab, hasStyle);
}

async function renderChart(type, tab, hasStyle) {
    const list = document.getElementById('chart-list');
    list.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const date = document.getElementById('dateS').value;
    const style = hasStyle ? document.getElementById('styleS').value : "";
    const res = await fetch(`${URLS[type]}?tab=${tab}&date=${date}&style=${style}`).then(r => r.json());
    list.innerHTML = res.map(i => {
        let stC = ""; let stI = i.st;
        if(i.st.includes("NEW")) stC = "new";
        else if(i.st.includes("↑") || i.st.includes("subiu")) { stC = "up"; stI = `↑${i.q}`; }
        else if(i.st.includes("↓") || i.st.includes("desceu")) { stC = "down"; stI = `↓${i.q}`; }
        return `<div class="chart-row"><div class="rank">${i.pos}</div><div class="status ${stC}">${stI}</div><img src="${i.capa}"><div class="info-box"><b>${i.tit}</b><br><small style="color:#888;">${i.art}</small></div><div class="stats-box"><b>${i.val}</b><small>TOTAL: ${i.tot || '0'}</small></div></div>`;
    }).join('');
}
