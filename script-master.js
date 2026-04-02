const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec";

function buildMenu() {
    const nav = document.getElementById('menu-central');
    nav.innerHTML = `
    <a href="index.html" class="menu-item">Real Time</a>
    <div class="menu-item">Billboard
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Hot 100</a>
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
    <div class="menu-item">Apple Music
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Global</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Artists</a>
        </div>
    </div>`;
}

async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const d = await fetch(API + "?action=getRealTime").then(r => r.json());
    const row = (l, c) => l.map(i => `<div class="rt-row" style="display:grid; grid-template-columns:30px 40px 1fr 90px; align-items:center; padding:10px; border-bottom:1px solid #222;"><div style="color:#555;">${i.p}</div><img src="${i.c}" style="width:35px;height:35px;border-radius:4px;"><div style="padding-left:10px;font-weight:700;font-size:12px;">${i.t}</div><div style="text-align:right;font-weight:900;color:${c}">${i.s}</div></div>`).join('');
    app.innerHTML = `<div class="rt-grid">
        <div class="rt-col"><div class="rt-head" style="background:var(--sp);color:black;">SPOTIFY</div>${row(d.spotify, 'var(--sp)')}</div>
        <div class="rt-col"><div class="rt-head" style="background:#fff;color:var(--am);">APPLE</div>${row(d.apple, 'var(--am)')}</div>
        <div class="rt-col"><div class="rt-head" style="background:var(--yt);color:#fff;">YOUTUBE</div>${row(d.youtube, '#fff')}</div>
    </div>`;
}
