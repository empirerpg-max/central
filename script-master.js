// ATENÇÃO: USE SEMPRE O LINK /exec MAIS RECENTE DO SEU APPS SCRIPT
const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyF8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec";

function buildMenu() {
    const nav = document.querySelector('nav');
    nav.innerHTML = `
    <a href="index.html" class="menu-item">Início</a>
    <a href="index.html" class="menu-item">Real Time</a>
    
    <div class="menu-item">Billboard Hot 100
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Music Style</a>
        </div>
    </div>

    <div class="menu-item">Spotify
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Spotify Global</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">Spotify by Country</a>
            <a href="charts.html?tab=SPOTIFY&style=true" class="sub-btn">Spotify by Style</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Spotify Artists</a>
        </div>
    </div>

    <div class="menu-item">Apple Music
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Apple Music Global</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">Apple Music by Country</a>
            <a href="charts.html?tab=APPLE MUSIC&style=true" class="sub-btn">Apple Music by Style</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Apple Music Artists</a>
        </div>
    </div>

    <div class="menu-item">YouTube
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn">YouTube Global</a>
            <a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">YouTube by Country</a>
            <a href="charts.html?tab=YOUTUBE&style=true" class="sub-btn">YouTube by Style</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn">YouTube Artists</a>
        </div>
    </div>

    <a href="charts.html?tab=DIGITAL SALES" class="menu-item">Digital Sales</a>

    <div class="menu-item">Billboard 200
        <div class="submenu">
            <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a>
            <a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">B200 by Music Style</a>
        </div>
    </div>`;
}

async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<p style="text-align:center; padding:50px; color:#888;">Sincronizando Real Time...</p>';
    
    try {
        const response = await fetch(API + "?action=getRealTime");
        const d = await response.json();
        
        const render = (list, color) => list.map(i => `
            <div class="rt-row">
                <div class="pos">${i.p}</div>
                <img src="${i.c}">
                <div class="info">${i.t}</div>
                <div class="val" style="color:${color}">${i.s}</div>
            </div>`).join('');

        app.innerHTML = `
            <div class="rt-grid">
                <div class="rt-col">
                    <div class="rt-head" style="background:var(--sp); color:black;">Spotify</div>
                    ${render(d.spotify, 'var(--sp)')}
                </div>
                <div class="rt-col">
                    <div class="rt-head" style="background:#fff; color:var(--am);">Apple Music</div>
                    ${render(d.apple, 'var(--am)')}
                </div>
                <div class="rt-col">
                    <div class="rt-head" style="background:var(--yt); color:#fff;">YouTube</div>
                    ${render(d.youtube, '#fff')}
                </div>
            </div>`;
    } catch (e) {
        app.innerHTML = '<p style="color:red; text-align:center;">Erro ao carregar dados. Verifique a implantação do Apps Script.</p>';
    }
}
