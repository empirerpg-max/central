// ATENÇÃO: COLOQUE A SUA API DO GOOGLE AQUI
const API = "URL_DA_TUA_API_DO_GOOGLE_SCRIPT"; 

function buildMenu() {
    const navMenu = document.getElementById('menu-nav');
    if(!navMenu) return;

    navMenu.innerHTML = `
    <a href="index.html" class="menu-item">Início / Real Time</a>
    <a href="artists.html" class="menu-item" style="color: #d4af37;">🌟 ARTISTS</a>
    <div class="menu-item">Billboard Hot 100 Charts
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Music Style</a>
        </div>
    </div>
    <div class="menu-item">Spotify Charts
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Spotify Global</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">Spotify by Country</a>
            <a href="charts.html?tab=SPOTIFY&style=true" class="sub-btn">Spotify by Style</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Spotify Artists</a>
        </div>
    </div>
    <div class="menu-item">Apple Music Charts
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Apple Music Global</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">Apple Music by Country</a>
            <a href="charts.html?tab=APPLE MUSIC&style=true" class="sub-btn">Apple Music by Style</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Apple Music Artists</a>
        </div>
    </div>
    <div class="menu-item">YouTube Charts
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn">YouTube Global</a>
            <a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">YouTube by Country</a>
            <a href="charts.html?tab=YOUTUBE&style=true" class="sub-btn">YouTube by Style</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn">YouTube Artists</a>
        </div>
    </div>
    <a href="charts.html?tab=DIGITAL SALES" class="menu-item">Digital Sales</a>
    <div class="menu-item">Billboard 200 Charts
        <div class="submenu">
            <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a>
            <a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">Billboard 200 by Music Style</a>
        </div>
    </div>`;
}

// === FUNÇÕES DO HALL OF FAME (PÁGINA DO ARTISTA) ===

async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    document.body.className = 'theme-digital'; 
    
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; font-family:'Figtree'; font-weight:900; font-size:32px; margin-bottom:30px; color:#fff; letter-spacing:2px;">ARTISTS DIRECTORY</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:20px;">`;

        list.forEach(a => {
            html += `<div onclick="loadHOFProfile('${a.name}')" style="background:#111; border:1px solid #333; border-radius:12px; padding:20px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='#d4af37'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#333'; this.style.transform='translateY(0)';">
                <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:2px solid #d4af37; box-shadow:0 5px 15px rgba(0,0,0,0.5);">
                <h3 style="margin:0; font-size:18px; color:#fff; font-family:'Figtree'; font-weight:900; text-transform:uppercase;">${a.name}</h3>
                <p style="margin:5px 0 0 0; font-size:11px; color:#888; font-weight:700; letter-spacing:1px;">${a.country} • ${a.style}</p>
            </div>`;
        });
        html += `</div>`;
        app.innerHTML = html;
    } catch(e) { app.innerHTML = `<p style="text-align:center; color:red;">Erro ao carregar diretório.</p>`; }
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:400px;"></div>';
    
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());

        const renderList = (list, color) => {
            if(!list || list.length === 0) return `<p style="color:#444; font-size:13px; padding:10px;">Sem dados registrados.</p>`;
            return list.map((i, idx) => `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 5px; border-bottom:1px solid #1a1a1a;">
                    <div style="display:flex; align-items:center; gap:12px; min-width:0;">
                        <span style="color:#444; font-weight:900; font-size:14px; width:20px;">${idx+1}</span>
                        <span style="color:#fff; font-size:14px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${i.t}</span>
                    </div>
                    <span style="color:${color}; font-weight:900; font-size:12px; margin-left:10px;">${i.v}</span>
                </div>`).join('');
        };

        const renderRuns = (list) => {
            if(!list || list.length === 0) return `<p style="color:#444; font-size:13px;">Nenhuma entrada na Hot 100.</p>`;
            return list.map(i => `
                <div style="background:#161616; border:1px solid #222; border-radius:8px; padding:15px; margin-bottom:12px; border-left:4px solid #d4af37;">
                    <b style="color:#fff; font-size:14px; display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">${i.t}</b>
                    <div style="color:#d4af37; font-size:13px; font-weight:700; font-family:monospace; letter-spacing:2px; overflow-x:auto; white-space:nowrap; padding-bottom:5px;">
                        ${i.v}
                    </div>
                </div>`).join('');
        };

        app.innerHTML = `
            <button onclick="loadHOFList()" style="background:transparent; border:none; color:#d4af37; cursor:pointer; font-weight:900; margin-bottom:25px; font-size:12px; letter-spacing:2px; text-transform:uppercase;">← BACK TO DIRECTORY</button>

            <div style="display:flex; align-items:center; gap:40px; background:linear-gradient(135deg, #111 0%, #050505 100%); padding:50px; border-radius:24px; border:1px solid rgba(212,175,55,0.2); margin-bottom:40px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <img src="${a.img}" onerror="this.src='https://via.placeholder.com/200'" style="width:180px; height:180px; border-radius:50%; object-fit:cover; border:5px solid #d4af37; box-shadow:0 10px 40px rgba(0,0,0,0.8);">
                <div>
                    <h1 style="font-family:'Figtree', sans-serif; font-size:60px; font-weight:900; margin:0 0 10px 0; text-transform:uppercase; color:#fff; letter-spacing:-2px; line-height:1;">${a.name}</h1>
                    <div style="display:flex; gap:12px;">
                        <span style="background:rgba(212,175,55,0.1); padding:8px 18px; border-radius:30px; font-size:12px; font-weight:800; color:#d4af37; border:1px solid rgba(212,175,55,0.3); text-transform:uppercase; letter-spacing:1px;">🌎 ${a.country}</span>
                        <span style="background:rgba(255,255,255,0.05); padding:8px 18px; border-radius:30px; font-size:12px; font-weight:800; color:#aaa; border:1px solid rgba(255,255,255,0.1); text-transform:uppercase; letter-spacing:1px;">🎵 ${a.style}</span>
                    </div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:20px; margin-bottom:50px;">
                <div style="background:#111; padding:25px; border-radius:16px; text-align:center; border:1px solid rgba(212,175,55,0.15); box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
                    <div style="font-family:'Figtree'; font-size:42px; font-weight:900; color:#d4af37; margin-bottom:5px; line-height:1;">${a.n1_hot100}</div>
                    <div style="font-size:10px; color:#666; text-transform:uppercase; font-weight:800; letter-spacing:2px;">#1 Hot 100</div>
                </div>
                <div style="background:#111; padding:25px; border-radius:16px; text-align:center; border:1px solid rgba(29,185,84,0.15);">
                    <div style="font-family:'Figtree'; font-size:42px; font-weight:900; color:#1DB954; margin-bottom:5px; line-height:1;">${a.n1_spotify}</div>
                    <div style="font-size:10px; color:#666; text-transform:uppercase; font-weight:800; letter-spacing:2px;">#1 Spotify</div>
                </div>
                <div style="background:#111; padding:25px; border-radius:16px; text-align:center; border:1px solid rgba(255,0,0,0.15);">
                    <div style="font-family:'Figtree'; font-size:42px; font-weight:900; color:#ff0000; margin-bottom:5px; line-height:1;">${a.n1_youtube}</div>
                    <div style="font-size:10px; color:#666; text-transform:uppercase; font-weight:800; letter-spacing:2px;">#1 YouTube</div>
                </div>
                <div style="background:#111; padding:25px; border-radius:16px; text-align:center; border:1px solid rgba(212,175,55,0.15);">
                    <div style="font-family:'Figtree'; font-size:42px; font-weight:900; color:#d4af37; margin-bottom:5px; line-height:1;">${a.n1_bb200}</div>
                    <div style="font-size:10px; color:#666; text-transform:uppercase; font-weight:800; letter-spacing:2px;">#1 BB 200</div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:40px; margin-bottom:60px;">
                <div>
                    <h2 style="font-family:'Figtree'; font-size:22px; font-weight:900; border-bottom:2px solid #ff0000; padding-bottom:12px; margin-bottom:20px; color:#fff; text-transform:uppercase; letter-spacing:1px;">YouTube Highlights</h2>
                    <div style="background:#0a0a0a; border:1px solid #1a1a1a; border-radius:16px; padding:15px; margin-bottom:35px;">${renderList(a.yt, '#ff0000')}</div>
                    
                    <h2 style="font-family:'Figtree'; font-size:22px; font-weight:900; border-bottom:2px solid #d4af37; padding-bottom:12px; margin-bottom:20px; color:#fff; text-transform:uppercase; letter-spacing:1px;">Top Albums</h2>
                    <div style="background:#0a0a0a; border:1px solid #1a1a1a; border-radius:16px; padding:15px;">${renderList(a.alb, '#d4af37')}</div>
                </div>
                
                <div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:35px;">
                        <div>
                            <h2 style="font-family:'Figtree'; font-size:16px; font-weight:900; border-bottom:2px solid #1DB954; padding-bottom:10px; margin-bottom:15px; color:#fff; text-transform:uppercase;">Spotify</h2>
                            <div style="background:#0a0a0a; border:1px solid #1a1a1a; border-radius:16px; padding:10px;">${renderList(a.sp, '#1DB954')}</div>
                        </div>
                        <div>
                            <h2 style="font-family:'Figtree'; font-size:16px; font-weight:900; border-bottom:2px solid #FA243C; padding-bottom:10px; margin-bottom:15px; color:#fff; text-transform:uppercase;">Apple</h2>
                            <div style="background:#0a0a0a; border:1px solid #1a1a1a; border-radius:16px; padding:10px;">${renderList(a.am, '#FA243C')}</div>
                        </div>
                    </div>

                    <h2 style="font-family:'Figtree'; font-size:22px; font-weight:900; border-bottom:2px solid #d4af37; padding-bottom:12px; margin-bottom:20px; color:#fff; text-transform:uppercase; letter-spacing:1px;">Hot 100 History</h2>
                    <div style="max-height: 450px; overflow-y: auto; padding-right: 8px;">
                        ${renderRuns(a.runs)}
                    </div>
                </div>
            </div>`;
    } catch(e) { app.innerHTML = `<p style="text-align:center; color:red; padding:50px;">Ocorreu um erro ao carregar o perfil.</p>`; }
}

// === FUNÇÕES ANTIGAS (SPOTIFY, APPLE, YOUTUBE, REALTIME) MANTIDAS IGUAIS ===

async function loadRealTime() {
    const app = document.getElementById('app');
    if(!app) return;
    document.body.classList.add('theme-spotify'); 
    app.innerHTML = '<div class="skeleton"></div>'.repeat(6);
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, color) => l.map(i => `
            <div class="chart-row" style="grid-template-columns:30px 45px 1fr 85px; background:transparent; border-bottom:1px solid #222; padding: 12px 15px;">
                <div class="rank" style="font-size:16px; color:#aaa; text-align:center; font-weight:900;">${i.p}</div>
                <img src="${i.c}" onerror="this.src='https://via.placeholder.com/150'" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
                <div class="info-box" style="padding-left:10px; min-width: 0;">
                    <b style="font-size:12px; color:#fff; white-space:normal; word-wrap:break-word; line-height:1.3; display:block;">${i.t}</b>
                </div>
                <div style="text-align:right; color:${color}; font-weight:900; font-size:13px;">${i.s}</div>
            </div>`).join('');
            
        app.innerHTML = `<div class="rt-grid">
            <div class="rt-col"><div class="rt-head" style="background:#1DB954; color:#000;">Spotify</div>${row(d.spotify, '#1DB954')}</div>
            <div class="rt-col"><div class="rt-head" style="background:#fff; color:#FA243C;">Apple</div>${row(d.apple, '#FA243C')}</div>
            <div class="rt-col"><div class="rt-head" style="background:#FF0000; color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div>
        </div>`;
    } catch (e) { app.innerHTML = `<p style="text-align:center; color:red;">Erro de conexão.</p>`; }
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    if(!app) return;
    applyTheme(tab);
    app.innerHTML = '<div class="skeleton"></div>'.repeat(8);
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        let headerHTML = `<h2 style="text-align:center; font-weight:900; text-transform:uppercase; margin-bottom:20px;">${tab}</h2>`;
        if (tab.toUpperCase().includes('YOUTUBE')) {
            headerHTML = `<div style="display:flex; justify-content:center; align-items:center; font-weight:900; font-size:20px; margin-bottom:20px;"><span style="background:#ff0000; color:#fff; padding:2px 6px; border-radius:4px; margin-right:8px; font-size:14px;">▶</span> YouTube ${hasStyle ? 'Styles' : 'Music'}</div>`;
        }
        app.innerHTML = `
            ${headerHTML}
            <div class="filters">
                <select id="dateS" onchange="renderChart('${tab}', ${hasStyle})">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
                ${hasStyle ? `<select id="styleS" onchange="renderChart('${tab}', true)"><option value="">TODOS OS ESTILOS</option>${f.styles.map(s => `<option value="${s}">${s}</option>`).join('')}</select>` : ''}
            </div><div id="chart-area"></div>`;
        renderChart(tab, hasStyle);
    } catch(e) { app.innerHTML = `<p style="text-align:center;">Erro ao carregar os filtros.</p>`; }
}

async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    if(!area) return;
    area.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const date = document.getElementById('dateS').value;
    const style = hasStyle ? document.getElementById('styleS').value : "";
    try {
        const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}&style=${style}`).then(r => r.json());
        area.innerHTML = res.map((i, index) => {
            if (tab.toUpperCase().includes('YOUTUBE')) {
                let rankNumber = hasStyle && style === "" ? (index + 1) : i.pos;
                return `
                <div class="yt-row">
                    <div class="yt-rank">${rankNumber}</div>
                    <img src="${i.capa}" class="yt-thumb" onerror="this.src='https://via.placeholder.com/150'">
                    <div class="yt-info">
                        <div class="yt-title">${i.tit}</div>
                        <div class="yt-artist">${i.art}</div>
                    </div>
                    <div class="yt-stats">
                        <div class="yt-now">${i.val} VIEWS</div>
                        <div class="yt-total">Acumulado: ${i.tot || 0}</div>
                    </div>
                </div>`;
            } else {
                let stClass = "neutral"; let stIcon = "-";
                if(i.st && i.st.toUpperCase().includes("NEW")) { stClass = "new"; stIcon = "NEW"; }
                else if(i.st && (i.st.includes("↑") || i.st.toLowerCase().includes("subiu"))) { stClass = "up"; stIcon = `▲<br><span style="font-size:10px;">${i.q || ''}</span>`; }
                else if(i.st && (i.st.includes("↓") || i.st.toLowerCase().includes("desceu"))) { stClass = "down"; stIcon = `▼<br><span style="font-size:10px;">${i.q || ''}</span>`; }
                return `<div class="chart-row"><div class="rank">${i.pos}</div><div class="status ${stClass}">${stIcon}</div><img src="${i.capa}" onerror="this.src='https://via.placeholder.com/150'"><div class="info-box"><b>${i.tit}</b><span>${i.art}</span></div><div class="stats-box">${getStatsText(i.val, i.tot, tab)}</div></div>`;
            }
        }).join('');
    } catch(e) { area.innerHTML = `<p style="text-align:center;">Erro ao carregar a lista.</p>`; }
}

async function initCountry(tab) {
    const app = document.getElementById('app');
    if(!app) return;
    applyTheme(tab);
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        let headerHTML = `<h2 style="text-align:center; font-weight:900; text-transform:uppercase; margin-bottom:20px;">${tab}</h2>`;
        if (tab.toUpperCase().includes('YOUTUBE')) { headerHTML = `<div style="display:flex; justify-content:center; align-items:center; font-weight:900; font-size:20px; margin-bottom:20px;"><span style="background:#ff0000; color:#fff; padding:2px 6px; border-radius:4px; margin-right:8px; font-size:14px;">▶</span> YouTube Countries</div>`; }
        app.innerHTML = `${headerHTML}<div class="filters"><select id="countryS" onchange="renderCountry('${tab}')">${f.countries.map(c => `<option value="${c}">${c}</option>`).join('')}</select><select id="dateS" onchange="renderCountry('${tab}')">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select></div><div id="chart-area"></div>`;
        renderCountry(tab);
    } catch(e) { app.innerHTML = `<p style="text-align:center;">Erro ao carregar países.</p>`; }
}

async function renderCountry(tab) {
    const area = document.getElementById('chart-area');
    if(!area) return;
    const c = document.getElementById('countryS').value;
    const d = document.getElementById('dateS').value;
    try {
        const res = await fetch(`${API}?action=getChart&tab=${tab}&country=${c}&date=${d}`).then(r => r.json());
        area.innerHTML = res.map(i => {
            if (tab.toUpperCase().includes('YOUTUBE')) {
                return `<div class="yt-row" style="grid-template-columns: 50px 80px 1fr 140px;"><div class="yt-rank">${i.pos}</div><img src="${i.capa}" class="yt-thumb" onerror="this.src='https://via.placeholder.com/150'"><div class="yt-info"><div class="yt-title">${i.tit}</div><div class="yt-artist">${i.art}</div></div><div class="yt-stats"><div class="yt-now">${i.val} VIEWS</div></div></div>`;
            }
            return `<div class="chart-row" style="grid-template-columns: 50px 70px 1fr 130px;"><div class="rank">${i.pos}</div><img src="${i.capa}" onerror="this.src='https://via.placeholder.com/150'"><div class="info-box"><b>${i.tit}</b><span>${i.art}</span></div><div class="stats-box"><b>${i.val}</b><small>STREAMS/VIEWS</small></div></div>`;
        }).join('');
    } catch(e) { area.innerHTML = `<p style="text-align:center;">Erro ao carregar dados do país.</p>`; }
}

async function initMonthly(p) {
    const app = document.getElementById('app');
    if(!app) return;
    applyTheme(p);
    app.innerHTML = '<div id="monthly-filters" class="filters"></div><div id="profile-area"></div>';
    try {
        const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
        document.getElementById('monthly-filters').innerHTML = `<select id="yS" onchange="upM('${p}')">${years.map(y => `<option value="${y}">${y}</option>`).join('')}</select><select id="mS" onchange="upA('${p}')"></select><select id="aS" onchange="renderM('${p}')"></select>`;
        upM(p);
    } catch(e) { app.innerHTML = `<p style="text-align:center;">Erro ao iniciar painel mensal.</p>`; }
}

async function upM(p) {
    const y = document.getElementById('yS').value;
    const m = await fetch(`${API}?action=getMonthlyDates&year=${y}`).then(r => r.json());
    document.getElementById('mS').innerHTML = m.map(x => `<option value="${x}">${x}</option>`).join('');
    upA(p);
}

async function upA(p) {
    const y = document.getElementById('yS').value;
    const m = document.getElementById('mS').value;
    const a = await fetch(`${API}?action=getArtists&platform=${p}&month=${m}&year=${y}`).then(r => r.json());
    document.getElementById('aS').innerHTML = a.map(x => `<option value="${x}">${x}</option>`).join('');
    renderM(p);
}

async function renderM(p) {
    const profile = document.getElementById('profile-area');
    if(!profile) return;
    profile.innerHTML = '<div class="skeleton" style="height:300px;"></div>';
    const y = document.getElementById('yS').value;
    const m = document.getElementById('mS').value;
    const a = document.getElementById('aS').value;
    try {
        const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
        const art = data[0];
        if (p.toUpperCase().includes('YOUTUBE')) {
            profile.innerHTML = `<div class="channel-header"><div class="yt-banner" style="background-image: url('${art.capa}');"></div><div class="channel-meta"><img src="${art.capa}" class="avatar" onerror="this.src='https://via.placeholder.com/120'"><div><h2 class="c-name">${a}</h2><div class="c-stats">${art.ov} visualizações mensais</div>${art.rank !== '-' ? `<span style="background:#ff0000; color:#fff; padding:2px 6px; border-radius:4px; font-size:12px; margin-top:5px; display:inline-block;">TOP ${art.rank}</span>` : ''}</div></div></div><div class="main-grid"><div><div class="section-label">Vídeos Populares</div>${art.m.map(mus => `<div class="v-item"><img src="${mus.c}" class="v-thumb" onerror="this.src='https://via.placeholder.com/180x101'"><div><div style="font-weight:700; font-size:16px; color:#fff;">${mus.t}</div><div style="color:#aaa; font-size:13px; margin-top:5px;">${mus.s} views</div></div></div>`).join('')}</div><div><div class="section-label">Informações</div><div class="about-content">${art.bio}</div></div></div>`;
        } else if (p.toUpperCase().includes('SPOTIFY')) {
            profile.innerHTML = `<div class="sp-banner" style="background-image: url('${art.capa}');"><div class="sp-banner-content"><h1 class="sp-artist-name">${a}</h1><p class="sp-listeners">${art.ov} ouvintes mensais</p></div></div><div class="sp-action-bar"><button class="sp-play-btn"><svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor"><path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path></svg></button><button class="sp-follow-btn">Seguindo</button><span class="sp-dots">•••</span></div><div class="sp-main-grid"><div><h2 class="sp-section-title">Populares</h2>${art.m.map((mus, idx) => `<div class="sp-song-row"><div class="sp-song-rank">${idx+1}</div><img src="${mus.c}" onerror="this.src='https://via.placeholder.com/150'"><div style="min-width:0;"><div class="sp-song-title">${mus.t}</div></div><div class="sp-song-streams">${mus.s}</div></div>`).join('')}</div><div><h2 class="sp-section-title">Sobre o artista</h2><div class="sp-about-card">${art.rank !== '-' ? `<div style="color:#1DB954; font-weight:700; font-size:18px; margin-bottom:15px;">#${art.rank} no mundo</div>` : ''}${art.bio}</div></div></div>`;
        } else if (p.toUpperCase().includes('APPLE')) {
            profile.innerHTML = `<div class="am-hero" style="background-image: url('${art.capa}');"><div class="am-hero-content"><div class="am-play-icon"><svg height="18" width="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg></div><h1 class="am-artist-name">${a}</h1></div></div><div class="am-main-grid"><div><h2 class="am-section-title">Sobre</h2><div class="am-about-card"><b>${art.ov} ouvintes mensais</b>${art.rank !== '-' ? `<span style="color:#fa243c; font-weight:600; font-size:12px; margin-bottom:10px; display:block;">TOP ${art.rank} MENSAL</span>` : ''}<p style="margin-top: 10px;">${art.bio}</p></div></div><div><h2 class="am-section-title">Top Songs <span>Ver tudo &gt;</span></h2>${art.m.map(mus => `<div class="am-song-row"><img src="${mus.c}" onerror="this.src='https://via.placeholder.com/150'"><div style="min-width:0;"><span class="am-song-title">${mus.t}</span></div><div class="am-song-streams">${mus.s} reproduções</div></div>`).join('')}</div></div>`;
        } else {
            profile.innerHTML = `<div style="text-align:center; padding: 40px; margin-bottom:30px; border-bottom:1px solid var(--border-dark);"><img src="${art.capa}" style="width:200px; height:200px; border-radius:50%; object-fit:cover; margin-bottom:20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"><h2 style="font-size:45px; margin:0; font-weight:900;">${a}</h2><p style="font-size:20px; font-weight:700;">${art.ov} OUVINTES MENSAIS</p>${art.rank !== '-' ? `<span class="status new" style="padding:6px 12px; font-size:12px;">TOP ${art.rank} MENSAL</span>` : ''}</div><div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:40px;"><div><h3 style="padding-bottom:10px;">Top Músicas</h3>${art.m.map((mus, idx) => `<div class="chart-row" style="grid-template-columns:30px 50px 1fr 100px; padding:10px 0;"><div class="rank" style="font-size:16px;">${idx+1}</div><img src="${mus.c}" onerror="this.src='https://via.placeholder.com/150'"><div class="info-box"><b>${mus.t}</b></div><div class="stats-box"><b style="font-size:14px;">${mus.s}</b></div></div>`).join('')}</div><div><h3 style="padding-bottom:10px;">Sobre o Artista</h3><p style="line-height:1.6; font-size:14px;">${art.bio}</p></div></div>`;
        }
    } catch(e) { profile.innerHTML = `<p style="text-align:center;">Erro ao carregar o artista.</p>`; }
}

function applyTheme(tab) { const body = document.body; body.className = ''; if (!tab) return; const t = tab.toUpperCase(); if(t.includes('SPOTIFY')) body.classList.add('theme-spotify'); else if(t.includes('APPLE')) body.classList.add('theme-apple'); else if(t.includes('YOUTUBE')) body.classList.add('theme-youtube'); else if(t.includes('DIGITAL SALES')) body.classList.add('theme-digital'); else if(t.includes('BILLBOARD') || t.includes('ÁLBUNS')) body.classList.add('theme-billboard'); else body.classList.add('theme-spotify'); }
function getStatsText(val, total, tab) { const t = tab.toUpperCase(); if(t.includes('BILLBOARD HOT 100')) return `<b>${val} PTS</b><small></small>`; if(t.includes('ÁLBUNS')) return `<b>${val} UNIDADES</b><small>Total: ${total || 0}</small>`; if(t.includes('APPLE') || t.includes('SPOTIFY')) return `<b>${val}</b><small>Total: ${total || 0}</small>`; if(t.includes('DIGITAL SALES')) return `<b>${val}</b><small>Total: ${total || 0}</small>`; return `<b>${val}</b><small>Total: ${total || 0}</small>`; }
