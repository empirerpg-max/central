const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec";

// ESTA FUNÇÃO RODA AUTOMATICAMENTE EM TODAS AS PÁGINAS
window.onload = () => {
    buildMenu();
    // Identifica qual página carregar pelos parâmetros da URL ou ID do app
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const p = params.get('p');
    
    if (document.getElementById('sp-list')) loadRealTime(); // Se for index
    else if (tab) initChart(tab, params.get('style'));      // Se for charts
    else if (p) initMonthly(p);                            // Se for monthly
    else loadHOFList();                                    // Se for artists
};

function buildMenu() {
    const navMenu = document.getElementById('menu-nav');
    if(!navMenu) return;
    navMenu.innerHTML = `
    <a href="index.html" class="menu-item">Início</a>
    <div class="menu-item" onclick="window.location.href='artists.html'">🌟 Artists</div>
    <div class="menu-item">Hot 100
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a>
        </div>
    </div>
    <div class="menu-item" style="color:var(--spotify)">Spotify
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Global Charts</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Monthly Artists</a>
        </div>
    </div>
    <div class="menu-item" style="color:var(--apple)">Apple Music
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Global Charts</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Monthly Artists</a>
        </div>
    </div>
    <div class="menu-item" style="color:var(--youtube)">YouTube
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn">Global Charts</a>
            <a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn">Monthly Artists</a>
        </div>
    </div>
    <div class="menu-item">Albums
        <div class="submenu">
            <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a>
            <a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">Albums by Style</a>
        </div>
    </div>
    <a href="charts.html?tab=DIGITAL SALES" class="menu-item">Sales</a>`;
}

// === LISTAGEM ARTISTAS (5 POR LINHA) ===
async function loadHOFList() {
    const app = document.getElementById('app');
    if(!app) return;
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let h = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; font-weight:800; letter-spacing:6px; margin-bottom:40px;">DIRECTORY</h2><div class="hof-grid">`;
        list.forEach(a => {
            const meta = a.country ? `${a.country} • ${a.style}` : a.style;
            h += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')">
                <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${a.name}</h3>
                <p class="hof-meta">${meta}</p>
            </div>`;
        });
        app.innerHTML = h + `</div>`;
    } catch(e) { app.innerHTML = "Erro ao carregar artistas."; }
}

// (Mantenha as funções de loadHOFProfile, initChart e loadRealTime como estavam no modelo de vidro que você aprovou)
