// LINK /exec DO APPS SCRIPT
const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyF8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZXEWjGEiYe/exec";

function buildMenu() {
    const nav = document.querySelector('nav');
    nav.innerHTML = `
    <a href="index.html" class="menu-item">Início</a>
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
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Global</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Artists</a>
        </div>
    </div>
    <div class="menu-item">Apple
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
    </div>`;
}

async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(6);
    try {
        const response = await fetch(API + "?action=getRealTime", { cache: "no-store" });
        const d = await response.json();
        const row = (l, c) => l.map(i => `<div class="rt-row"><div style="color:#555;font-weight:900;">${i.p}</div><img src="${i.c}"><div style="padding:0 15px;font-weight:700;font-size:13px;">${i.t}</div><div style="text-align:right;font-weight:900;color:${c}">${i.s}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid">
            <div class="rt-col"><div class="rt-head" style="background:var(--sp);color:black;">Spotify</div>${row(d.spotify, 'var(--sp)')}</div>
            <div class="rt-col"><div class="rt-head" style="background:#fff;color:var(--am);">Apple Music</div>${row(d.apple, 'var(--am)')}</div>
            <div class="rt-col"><div class="rt-head" style="background:var(--yt);color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div>
        </div>`;
    } catch (e) { app.innerHTML = `<p style="text-align:center; padding:50px;">Erro ao conectar com o Império. Tente atualizar a página.</p>`; }
}
