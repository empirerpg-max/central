// URLs dos Motores (Substitua pelos seus links /exec)
const URLS = {
    RT: "https://script.google.com/macros/s/AKfycbwUWZeRnVwj8L-fevoSzueT762-7opozpait4iIVYwmy41PpuMsghLZu7Q3lBPA-rs/exec",
    BASE: "https://script.google.com/macros/s/AKfycbyF4KYgfbsZWNOq2Adg3NZ6OxOk0VBo1uUKxuKtERmEe96Q26ZfsJxefpAyt-o9MCoPFQ/exec",
    ALBUMS: "https://script.google.com/macros/s/AKfycbySeD6QTgzCyUqU1GXgpnhiAQohtvtC3oaZAlksdWIZEDHVA_8FwPNGQhOYiLaqqirR/exec",
    COUNTRIES: "https://script.google.com/macros/s/AKfycbw4nlszeN807h0EHlmRYyeN9nFKvTi7_tqC-EOCSmG467sTzbzQXrOGjlF4z02DT17H/exec",
    MONTHLY: "https://script.google.com/macros/s/AKfycbzO_dXWJbFgKkUSCvU91F6DIGsBBFCjBHUYxkEwlPms1Mo2dNFbxem0LQ74pZoftg2x_Q/exec"
};

// ... (Função buildMenu e loadRealTime que já te enviei)

async function initCountry(type, tab) {
    const area = document.getElementById('app');
    area.innerHTML = '<div class="skeleton"></div>'.repeat(10);
    const f = await fetch(`${URLS[type]}?action=filters&tab=${tab}`).then(r => r.json());
    
    area.innerHTML = `
        <div class="filters" style="display:flex; gap:10px; justify-content:center; margin-bottom:30px;">
            <select id="countryS" onchange="renderCountry('${type}', '${tab}')">${f.countries.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
            <select id="dateS" onchange="renderCountry('${type}', '${tab}')">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
        </div><div id="chart-list"></div>`;
    renderCountry(type, tab);
}

async function renderCountry(type, tab) {
    const list = document.getElementById('chart-list');
    const c = document.getElementById('countryS').value;
    const d = document.getElementById('dateS').value;
    const res = await fetch(`${URLS[type]}?tab=${tab}&country=${c}&date=${d}`).then(r => r.json());
    
    list.innerHTML = res.map(i => `
        <div class="chart-row">
            <div class="rank">${i.pos}</div>
            <div class="status up">↑</div>
            <img src="${i.capa}">
            <div class="info-box"><b>${i.tit}</b><span>${i.art}</span></div>
            <div class="stats-box"><b>${i.val}</b></div>
        </div>`).join('');
}

// LÓGICA DE OUVIDES MENSAIS (MENSAL)
async function initMonthly(p) {
    const filterArea = document.getElementById('monthly-filters');
    const years = await fetch(`${URLS.MONTHLY}?action=years`).then(r => r.json());
    
    filterArea.innerHTML = `
        <select id="yS" onchange="updateMonths('${p}')">${years.map(y => `<option value="${y}">${y}</option>`).join('')}</select>
        <select id="mS" onchange="updateArtists('${p}')"></select>
        <select id="aS" onchange="renderMonthly('${p}')"></select>`;
    updateMonths(p);
}

async function updateMonths(p) {
    const y = document.getElementById('yS').value;
    const months = await fetch(`${URLS.MONTHLY}?action=dates&year=${y}`).then(r => r.json());
    document.getElementById('mS').innerHTML = months.map(m => `<option value="${m}">${m}</option>`).join('');
    updateArtists(p);
}

async function updateArtists(p) {
    const y = document.getElementById('yS').value;
    const m = document.getElementById('mS').value;
    const artists = await fetch(`${URLS.MONTHLY}?action=artists&platform=${p}&month=${m}&year=${y}`).then(r => r.json());
    document.getElementById('aS').innerHTML = artists.map(a => `<option value="${a}">${a}</option>`).join('');
    renderMonthly(p);
}

async function renderMonthly(p) {
    const y = document.getElementById('yS').value;
    const m = document.getElementById('mS').value;
    const a = document.getElementById('aS').value;
    const profile = document.getElementById('profile-area');
    profile.innerHTML = '<div class="skeleton" style="height:300px;"></div>';
    
    const data = await fetch(`${URLS.MONTHLY}?platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
    const art = data[0];

    profile.innerHTML = `
        <div class="banner" style="background-image:url('${art.capa}')">
            <div class="banner-content">
                ${art.rank !== '-' ? `<span class="status new" style="padding:5px 10px;">TOP ${art.rank} MENSAL</span>` : ''}
                <h2 class="art-name" style="font-size:60px; margin:10px 0;">${a}</h2>
                <p style="font-weight:900; color:var(--empire); font-size:20px;">${art.ov} OUVINTES MENSAIS</p>
            </div>
        </div>
        <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:40px; margin-top:40px;">
            <div>
                <h3>Músicas Mais Ouvidas</h3>
                ${art.m.map((mus, idx) => `
                    <div class="chart-row" style="background:transparent; border-radius:0; border-bottom:1px solid #222;">
                        <div class="rank" style="font-size:18px;">${idx+1}</div>
                        <img src="${mus.c}" style="width:45px; height:45px;">
                        <div class="info-box"><b>${mus.t}</b></div>
                        <div class="stats-box"><b>${mus.s}</b></div>
                    </div>`).join('')}
            </div>
            <div>
                <h3>Sobre o Artista</h3>
                <p style="color:#888; line-height:1.6; font-size:14px;">${art.bio}</p>
            </div>
        </div>`;
}
