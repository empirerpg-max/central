// MANTÉM A TUA API QUE ESTÁ A FUNCIONAR AQUI:
const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

// MENU FIEL AO ARQUIVO "EMPIRE OFICIAL"
function buildMenu() {
    document.querySelector('nav').innerHTML = `
    <a href="index.html" class="menu-item">Início / Real Time</a>
    
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

// O NOVO RENDERIZADOR (ASPETO DE FERRAMENTA REAL)
async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    area.innerHTML = '<div class="skeleton"></div>'.repeat(10); // Mostra o loading
    
    const date = document.getElementById('dateS').value;
    const style = hasStyle ? document.getElementById('styleS').value : "";
    
    // Procura os dados na tua API (que já sabemos que funciona)
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}&style=${style}`).then(r => r.json());
    
    // Desenha as ferramentas
    area.innerHTML = res.map(i => {
        let stClass = "neutral"; 
        let stIcon = "-";
        
        // Verifica se os dados do teu sheets dizem NEW, ↑ ou ↓
        if(i.st && i.st.toUpperCase().includes("NEW")) { 
            stClass = "new"; 
            stIcon = "NEW"; 
        }
        else if(i.st && (i.st.includes("↑") || i.st.toLowerCase().includes("subiu"))) { 
            stClass = "up"; 
            stIcon = `↑<br><span style="font-size:10px;">${i.q || ''}</span>`; 
        }
        else if(i.st && (i.st.includes("↓") || i.st.toLowerCase().includes("desceu"))) { 
            stClass = "down"; 
            stIcon = `↓<br><span style="font-size:10px;">${i.q || ''}</span>`; 
        }

        return `
        <div class="chart-row">
            <div class="rank">${i.pos}</div>
            <div class="status ${stClass}">${stIcon}</div>
            <img src="${i.capa}" onerror="this.src='https://via.placeholder.com/150'">
            <div class="info-box">
                <b>${i.tit}</b>
                <span>${i.art}</span>
            </div>
            <div class="stats-box">
                <b>${i.val}</b>
                <small>TOTAL: ${i.tot || 0}</small>
            </div>
        </div>`;
    }).join('');
}

// As outras funções (loadRealTime, initChart, initCountry, initMonthly, renderCountry, renderM) 
// mantêm a mesma lógica de ligação que já tinhas, apenas precisas de garantir que usam as novas classes CSS.
// (Se precisares que eu reescreva também a renderM ou renderCountry com o novo design, avisa!)
