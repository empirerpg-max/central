const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec";

function buildMenu() {
    document.querySelector('nav').innerHTML = `
    <a href="index.html" class="menu-item">Real Time</a>
    <div class="menu-item">Billboard Hot 100
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a>
        </div>
    </div>
    <div class="menu-item">Spotify
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Global</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Artists</a>
        </div>
    </div>
    <div class="menu-item">Apple Music
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Global</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Artists</a>
        </div>
    </div>
    <div class="menu-item">YouTube
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn">Global</a>
            <a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn">Artists</a>
        </div>
    </div>
    <a href="charts.html?tab=DIGITAL SALES" class="menu-item">Digital Sales</a>
    <div class="menu-item">Billboard 200
        <div class="submenu">
            <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a>
            <a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">B200 by Style</a>
        </div>
    </div>`;
}

// Funções globais de Renderização (Hot 100, Álbuns, Países)
async function initChart(tab, hasStyle) {
    const area = document.getElementById('app');
    area.innerHTML = '<div class="skeleton"></div>'.repeat(10);
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    area.innerHTML = `
        <div class="filters" style="display:flex; gap:10px; justify-content:center; margin-bottom:30px;">
            <select id="dateS" onchange="renderChart('${tab}', ${hasStyle})" style="padding:10px; border-radius:20px; background:#111; color:#fff;">
                ${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}
            </select>
            ${hasStyle ? `<select id="styleS" onchange="renderChart('${tab}', true)" style="padding:10px; border-radius:20px; background:#111; color:#fff;">
                <option value="">Estilos</option>${f.styles.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>` : ''}
        </div><div id="chart-list"></div>`;
    renderChart(tab, hasStyle);
}

async function renderChart(tab, hasStyle) {
    const list = document.getElementById('chart-list');
    list.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const d = document.getElementById('dateS').value;
    const s = hasStyle ? document.getElementById('styleS').value : "";
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${d}&style=${s}`).then(r => r.json());
    
    list.innerHTML = res.map(i => {
        let stC = ""; let stI = i.st;
        if(i.st.includes("NEW")) stC = "new";
        else if(i.st.includes("↑") || i.st.includes("subiu")) { stC = "up"; stI = `↑${i.q}`; }
        else if(i.st.includes("↓") || i.st.includes("desceu")) { stC = "down"; stI = `↓${i.q}`; }
        return `<div class="chart-row">
            <div class="rank" style="font-size:24px; font-weight:900;">${i.pos}</div>
            <div class="status ${stC}">${stI}</div>
            <img src="${i.capa}">
            <div style="padding-left:15px;"><b>${i.tit}</b><br><span style="color:#888; font-size:13px;">${i.art}</span></div>
            <div style="text-align:right;"><b style="color:var(--empire); font-size:16px;">${i.val}</b><br><small style="font-size:10px; color:#555; text-transform:uppercase;">TOTAL: ${i.tot}</small></div>
        </div>`;
    }).join('');
}
