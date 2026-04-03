const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec";

function buildMenu() {
    const nav = document.querySelector('nav');
    nav.innerHTML = `
    <a href="index.html" class="menu-item">Real Time</a>
    <div class="menu-item">Billboard Hot 100
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a>
        </div>
    </div>
    <div class="menu-item">Spotify
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Spotify Global</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Spotify Artists</a>
        </div>
    </div>
    <div class="menu-item">Apple Music
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Apple Global</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Apple Artists</a>
        </div>
    </div>
    <div class="menu-item">YouTube
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn">YouTube Global</a>
            <a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn">YouTube Artists</a>
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

async function renderChart(tab, hasStyle) {
    const app = document.getElementById('app');
    const area = document.getElementById('chart-area');
    area.innerHTML = '<div class="skeleton"></div>'.repeat(10);

    const date = document.getElementById('dateS').value;
    const style = hasStyle ? document.getElementById('styleS').value : "";
    
    try {
        const response = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}&style=${style}`);
        const res = await response.json();
        
        area.innerHTML = res.map(i => {
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
    } catch (e) { area.innerHTML = `<p style="text-align:center;">Erro ao carregar dados.</p>`; }
}
// Outras funções (initChart, initCountry, loadRealTime) seguem a mesma lógica de carregamento via API.
