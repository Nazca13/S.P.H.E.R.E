/* ==========================================================================
   S.P.H.E.R.E — DASHBOARD.JS
   Command Center Charts, Firehose Feed, KOL List, View Switching
   ========================================================================== */

'use strict';

// ── View Switching ──────────────────────────────────────────────────────────

function switchView(viewId) {
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        // Scroll to top
        const scroll = target.querySelector('.content-scroll') || target;
        scroll.scrollTop = 0;
    }

    // Mark nav items that match this view
    document.querySelectorAll(`[data-view="${viewId}"]`).forEach(el => el.classList.add('active'));

    // Lazy init specialized engines
    if (viewId === 'view-command-center') {
        setTimeout(() => initDashboardGlobe(), 60);
    } else if (viewId === 'view-network-graph' && typeof initNetworkGraph === 'function') {
        setTimeout(() => initNetworkGraph(), 60);
    } else if (viewId === 'view-geo-intelligence') {
        setTimeout(() => initGeoMap(), 60);
    } else if (viewId === 'view-sov-matrix') {
        setTimeout(() => initSOVMatrixCharts(), 60);
    } else if (viewId === 'view-report-builder') {
        setTimeout(() => initReportPreviewChart(), 60);
    } else if (viewId === 'view-account-investigation') {
        setTimeout(() => {
            initAccountInvestigation();
            initAccountInvestigationGlobe();
        }, 60);
    } else if (viewId === 'view-data-leak-radar') {
        setTimeout(() => initDataLeakRadar(), 60);
    } else if (viewId === 'view-cctv-surveillance') {
        setTimeout(() => initCCTVMatrix(), 60);
    }
}

function focusNodeInGraph(nodeId) {
    switchView('view-network-graph');
    setTimeout(() => {
        if (typeof selectNodeById === 'function') selectNodeById(nodeId);
    }, 200);
}

// ── Chart.js Global Defaults ─────────────────────────────────────────────────

Chart.defaults.color = '#545b72';
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size = 11;

// ── Predictive Trend Engine Chart ────────────────────────────────────────────

function initTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const trendData = {
        '7d': {
            mentions: [120000, 185000, 162000, 240000, 310000, 285000, 420000],
            sentiment: [42, 45, 38, 52, 44, 48, 61],
        },
        '30d': {
            mentions: Array.from({length: 7}, () => Math.floor(100000 + Math.random() * 300000)),
            sentiment: Array.from({length: 7}, () => Math.floor(30 + Math.random() * 40)),
        },
        '90d': {
            mentions: Array.from({length: 7}, () => Math.floor(200000 + Math.random() * 500000)),
            sentiment: Array.from({length: 7}, () => Math.floor(20 + Math.random() * 50)),
        }
    };

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Mentions Volume',
                    data: trendData['7d'].mentions,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.08)',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y',
                },
                {
                    label: 'Sentiment Score',
                    data: trendData['7d'].sentiment,
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointBackgroundColor: '#10b981',
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderDash: [4, 4],
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        borderRadius: 3,
                        usePointStyle: false,
                        padding: 16,
                        color: '#9099b0',
                        font: { size: 11, weight: '500' }
                    }
                },
                tooltip: {
                    backgroundColor: '#13151b',
                    borderColor: '#252836',
                    borderWidth: 1,
                    titleColor: '#f0f2f7',
                    bodyColor: '#9099b0',
                    padding: 10,
                    callbacks: {
                        label: ctx => ctx.datasetIndex === 0
                            ? ` ${(ctx.raw / 1000).toFixed(0)}K mentions`
                            : ` ${ctx.raw} net score`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: '#1e2230', drawBorder: false },
                    ticks: { color: '#545b72' }
                },
                y: {
                    grid: { color: '#1e2230', drawBorder: false },
                    ticks: {
                        color: '#545b72',
                        callback: v => `${(v/1000).toFixed(0)}K`
                    },
                    position: 'left',
                },
                y1: {
                    grid: { display: false },
                    ticks: {
                        color: '#545b72',
                        callback: v => `${v}`
                    },
                    position: 'right',
                }
            }
        }
    });

    // Trend tab switching
    document.querySelectorAll('[data-trend]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-trend]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const key = btn.dataset.trend;
            chart.data.datasets[0].data = trendData[key].mentions;
            chart.data.datasets[1].data = trendData[key].sentiment;
            chart.update('active');
        });
    });
}

// ── SOV Donut Chart ──────────────────────────────────────────────────────────

function initSOVChart() {
    const ctx = document.getElementById('sovChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['BrandX', 'Kompetitor A', 'Kompetitor B', 'Others'],
            datasets: [{
                data: [42, 28, 18, 12],
                backgroundColor: ['#2563eb', '#f97316', '#8b5cf6', '#3a3f52'],
                borderColor: '#191c24',
                borderWidth: 3,
                hoverBorderColor: '#252836',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '72%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#13151b',
                    borderColor: '#252836',
                    borderWidth: 1,
                    titleColor: '#f0f2f7',
                    bodyColor: '#9099b0',
                    padding: 10,
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${ctx.raw}%`
                    }
                }
            },
            animation: { animateRotate: true, duration: 900, easing: 'easeOutCubic' }
        }
    });
}

// ── Platform Volume Bar ───────────────────────────────────────────────────────

function initPlatformChart() {
    const ctx = document.getElementById('platformChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['X/Twitter', 'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'News'],
            datasets: [{
                label: 'Mentions (K)',
                data: [980, 620, 540, 380, 190, 280],
                backgroundColor: [
                    '#18191d', '#c13584', '#000010', '#ff0000', '#0a66c2', '#8b5cf6'
                ],
                borderColor: [
                    '#3a3f52', '#d1579e', '#333344', '#ff3333', '#1a76d2', '#9b6cf6'
                ],
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#13151b',
                    borderColor: '#252836',
                    borderWidth: 1,
                    titleColor: '#f0f2f7',
                    bodyColor: '#9099b0',
                    padding: 10,
                    callbacks: {
                        label: ctx => ` ${ctx.raw}K mentions`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: '#1e2230' },
                    ticks: { color: '#545b72', callback: v => `${v}K` }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#9099b0', font: { weight: '500' } }
                }
            }
        }
    });
}

// ── Firehose Feed ─────────────────────────────────────────────────────────────

const FEED_DATA = [
    {
        platform: 'x',
        icon: 'ph-bold ph-x-logo',
        author: '@techreviewer_id',
        time: '2m',
        text: 'Udah pake seminggu, aplikasinya smooth banget tapi baterai hp cepet banget abis. Admin tolong diperbaiki dong.',
        tag: 'Complaint', tagClass: 'warn',
        sentiment: 'neg',
    },
    {
        platform: 'ig',
        icon: 'ph-bold ph-instagram-logo',
        author: '@foodievlogger',
        time: '5m',
        text: 'Promo terbarunya luar biasa! Antrian sampai ke jalan raya guys, terbaik memang BrandX ini.',
        tag: 'Positive Spike', tagClass: 'pos',
        sentiment: 'pos',
    },
    {
        platform: 'x',
        icon: 'ph-bold ph-x-logo',
        author: '@user4992',
        time: '12m',
        text: 'Layanan CS nya sangat lambat, udah 3 jam ga ada balasan. Ini serius! #BrandGagal',
        tag: 'Crisis Signal', tagClass: 'neg',
        sentiment: 'neg',
    },
    {
        platform: 'tiktok',
        icon: 'ph-bold ph-tiktok-logo',
        author: '@kol.lifestyle',
        time: '18m',
        text: 'Review jujur produk baru BrandX — unboxing dan first impression gue!',
        tag: 'KOL Mention', tagClass: 'info',
        sentiment: 'neu',
    },
    {
        platform: 'yt',
        icon: 'ph-bold ph-youtube-logo',
        author: 'GadgetReviewIndo',
        time: '31m',
        text: 'Benchmark lengkap: BrandX vs Kompetitor A — mana yang menang di kategori baterai dan performa?',
        tag: 'Competitor Intel', tagClass: 'warn',
        sentiment: 'neu',
    },
    {
        platform: 'li',
        icon: 'ph-bold ph-linkedin-logo',
        author: 'Rina Kusuma · CEO',
        time: '1h',
        text: 'Impressed with BrandX\'s approach to enterprise partnerships. Their B2B strategy is exceptional.',
        tag: 'B2B Signal', tagClass: 'pos',
        sentiment: 'pos',
    },
];

const PLATFORM_COLORS = {
    x: { bg: '#18191d', border: '#2a2b30', cls: 'icon-x' },
    ig: { bg: '#c13584', cls: 'icon-ig' },
    tiktok: { bg: '#000010', cls: 'icon-tiktok' },
    yt: { bg: '#ff0000', cls: 'icon-yt' },
    li: { bg: '#0a66c2', cls: 'icon-li' },
};

const TAG_CLASSES = {
    neg: { bg: 'var(--rose-100)', color: 'var(--rose-500)' },
    pos: { bg: 'var(--emerald-100)', color: 'var(--emerald-500)' },
    warn: { bg: 'var(--amber-100)', color: 'var(--amber-500)' },
    info: { bg: 'var(--blue-100)', color: 'var(--blue-500)' },
    neu: { bg: 'var(--bg-input)', color: 'var(--text-muted)' },
};

function buildFeedItem(item) {
    const p = PLATFORM_COLORS[item.platform] || PLATFORM_COLORS.x;
    const t = TAG_CLASSES[item.tagClass] || TAG_CLASSES.neu;

    return `<div class="feed-item">
        <div class="feed-icon ${p.cls}">
            <i class="${item.icon}"></i>
        </div>
        <div style="flex:1; min-width:0;">
            <div class="feed-meta">
                <span class="feed-author">${item.author}</span>
                <span class="feed-time">${item.time} ago</span>
            </div>
            <p class="feed-text">${item.text}</p>
            <span class="tag" style="background:${t.bg}; color:${t.color};">${item.tag}</span>
        </div>
    </div>`;
}

function initFirehose() {
    const feed = document.getElementById('firehose-feed');
    const fullFeed = document.getElementById('firehose-full-feed');

    const html = FEED_DATA.map(buildFeedItem).join('');

    if (feed) feed.innerHTML = html;
    if (fullFeed) fullFeed.innerHTML = html + html; // More items for full view

    // Simulate live stream — prepend a new item every 8 seconds
    setInterval(() => {
        const random = FEED_DATA[Math.floor(Math.random() * FEED_DATA.length)];
        const clone = { ...random, time: 'just now' };
        const newItem = document.createElement('div');
        newItem.innerHTML = buildFeedItem(clone);
        const firstChild = newItem.firstChild;
        firstChild.style.opacity = '0';
        firstChild.style.transform = 'translateY(-8px)';
        firstChild.style.transition = 'all 0.4s cubic-bezier(0.16,1,0.3,1)';

        if (feed) {
            feed.insertBefore(firstChild.cloneNode(true), feed.firstChild);
            const inserted = feed.firstChild;
            requestAnimationFrame(() => {
                inserted.style.opacity = '0';
                inserted.style.transform = 'translateY(-8px)';
                requestAnimationFrame(() => {
                    inserted.style.opacity = '1';
                    inserted.style.transform = 'translateY(0)';
                });
            });
            // Keep max 8 items
            while (feed.children.length > 8) feed.removeChild(feed.lastChild);
        }
    }, 8000);
}

// ── KOL List ──────────────────────────────────────────────────────────────────

const KOL_DATA = [
    { id: 'arief', name: 'Arief Muhammad', handle: '@ariefmuhammad', score: 98, initials: 'AM', color: '#2563eb', platforms: ['ig', 'tiktok', 'yt'] },
    { id: 'folkative', name: 'Folkative', handle: '@folkative', score: 94, initials: 'FK', color: '#f97316', platforms: ['ig', 'x', 'tiktok'] },
    { id: 'tirta', name: 'Dr. Tirta', handle: '@tirta_cipeng', score: 89, initials: 'DT', color: '#10b981', platforms: ['x', 'ig', 'li'] },
    { id: 'jess', name: 'Jess No Limit', handle: '@jess_nolimit', score: 85, initials: 'JL', color: '#8b5cf6', platforms: ['yt', 'tiktok', 'ig'] },
    { id: 'raditya', name: 'Raditya Dika', handle: '@radityadika', score: 82, initials: 'RD', color: '#ec4899', platforms: ['yt', 'ig', 'x'] },
];

const PLATFORM_DOTS = {
    ig: '#c13584', x: '#9099b0', tiktok: '#69c9d0', yt: '#ff0000', li: '#0a66c2'
};

function initKOLList() {
    const list = document.getElementById('kol-list');
    if (!list) return;

    list.innerHTML = KOL_DATA.map((kol, i) => `
        <div class="kol-item" onclick="focusNodeInGraph('${kol.id}')" title="View in Network Graph">
            <span class="kol-rank">${i + 1}</span>
            <div class="kol-avatar" style="background:${kol.color}; display:flex; align-items:center; justify-content:center; color:#fff; font-size:13px; font-weight:700; border-radius:var(--r-sm);">${kol.initials}</div>
            <div class="kol-info">
                <div class="kol-name">${kol.name}</div>
                <div class="kol-handle">${kol.handle}</div>
            </div>
            <div class="kol-score-wrap">
                <span class="kol-score">${kol.score}</span>
                <div class="kol-platform-dots">
                    ${kol.platforms.map(p => `<div class="kol-dot" style="background:${PLATFORM_DOTS[p] || '#545b72'};"></div>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// ── Nav Click Binding ─────────────────────────────────────────────────────────

function bindNavigation() {
    document.querySelectorAll('[data-view]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            switchView(el.dataset.view);
        });
    });
}

// ── Crisis Banner ─────────────────────────────────────────────────────────────

function bindCrisisBanner() {
    const btn = document.getElementById('handle-crisis-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            btn.textContent = 'Playbook Active';
            btn.style.background = 'var(--emerald-500)';
            btn.disabled = true;
        });
    }
}

// ── Header Button actions ─────────────────────────────────────────────────────

function bindHeaderActions() {
    const notifBtn = document.getElementById('notif-btn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            const badge = notifBtn.querySelector('.badge');
            if (badge) badge.style.display = 'none';
        });
    }
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    bindNavigation();
    bindCrisisBanner();
    bindHeaderActions();
    initTrendChart();
    initSOVChart();
    initPlatformChart();
    initFirehose();
    initKOLList();
    setTimeout(() => {
        initDashboardGlobe();
        initAccountInvestigationGlobe();
    }, 100);
});

// ══════════════════════════════════════════════════════════════════════════
// 1. GEO-INTELLIGENCE SPATIAL MAP ENGINE
// ══════════════════════════════════════════════════════════════════════════

let geoMapInstance = null;
let geoCityChartInstance = null;

const PROVINCE_DATA = [
    { id: 'jkt', name: 'DKI Jakarta', lat: -6.2088, lng: 106.8456, mentions: '840K', netScore: -38, issue: '#BrandGagal CS Outage', status: 'CRISIS ALERT', color: '#f43f5e' },
    { id: 'jabar', name: 'Jawa Barat (Bandung)', lat: -6.9175, lng: 107.6191, mentions: '420K', netScore: +55, issue: 'Flash Sale Unboxing', status: 'POSITIVE', color: '#10b981' },
    { id: 'jatim', name: 'Jawa Timur (Surabaya)', lat: -7.2575, lng: 112.7521, mentions: '380K', netScore: +48, issue: 'Store Queue Trend', status: 'POSITIVE', color: '#10b981' },
    { id: 'sumut', name: 'Sumatera Utara (Medan)', lat: 3.5952, lng: 98.6722, mentions: '290K', netScore: +40, issue: 'B2B Partner Review', status: 'STABLE', color: '#3b82f6' },
    { id: 'bali', name: 'Bali & Denpasar', lat: -8.6705, lng: 115.2126, mentions: '195K', netScore: +72, issue: 'Creator Event Showcase', status: 'HIGH POSITIVE', color: '#10b981' },
    { id: 'sulawesi', name: 'Sulawesi Selatan (Makassar)', lat: -5.1477, lng: 119.4327, mentions: '160K', netScore: +35, issue: 'App Update Reaction', status: 'STABLE', color: '#3b82f6' },
    { id: 'kalimantan', name: 'Kalimantan Timur (IKN)', lat: -1.2379, lng: 116.8529, mentions: '110K', netScore: +65, issue: 'Enterprise Expansion', status: 'GROWTH', color: '#8b5cf6' },
];

function initGeoMap() {
    const container = document.getElementById('geo-leaflet-map');
    if (!container) return;

    if (geoMapInstance) {
        geoMapInstance.invalidateSize();
        return;
    }

    if (typeof L === 'undefined') {
        container.innerHTML = `<div class="empty-state"><i class="ph ph-warning"></i><p>Leaflet map library loading...</p></div>`;
        return;
    }

    // Init map centered on Indonesia
    geoMapInstance = L.map('geo-leaflet-map', {
        center: [-2.5489, 118.0149],
        zoom: 5,
        zoomControl: true,
        attributionControl: false,
    });

    // Dark tiles from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd',
    }).addTo(geoMapInstance);

    // Add markers
    PROVINCE_DATA.forEach(prov => {
        const iconHtml = `<div class="geo-pulse-pin" style="background:${prov.color}; color:${prov.color};"></div>`;
        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-geo-pin',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        const marker = L.marker([prov.lat, prov.lng], { icon: customIcon }).addTo(geoMapInstance);

        const popupContent = `
            <div style="padding:4px; font-family:var(--font);">
                <div style="font-size:14px; font-weight:800; color:var(--text-primary); margin-bottom:2px;">${prov.name}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">Mentions: <strong style="color:var(--text-primary);">${prov.mentions}</strong></div>
                <div style="font-size:11px; display:flex; justify-content:space-between; gap:12px; border-top:1px solid var(--border-subtle); padding-top:6px;">
                    <span>Net Sentiment: <strong style="color:${prov.netScore < 0 ? 'var(--rose-500)' : 'var(--emerald-500)'}">${prov.netScore}</strong></span>
                    <span style="color:${prov.color}; font-weight:700;">${prov.status}</span>
                </div>
            </div>
        `;
        marker.bindPopup(popupContent);
    });

    renderGeoProvinceList();
    initGeoCityChart();
    initGeoLocalFeed();
}

function renderGeoProvinceList() {
    const list = document.getElementById('geo-province-list');
    if (!list) return;

    list.innerHTML = PROVINCE_DATA.map(p => `
        <div class="geo-province-item" onclick="flyToProvince(${p.lat}, ${p.lng})">
            <div>
                <div style="font-size:13px; font-weight:700; color:var(--text-primary);">${p.name}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Top issue: ${p.issue}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:13px; font-weight:800; color:var(--blue-500);">${p.mentions}</div>
                <span class="tag" style="background:${p.netScore < 0 ? 'var(--rose-100)' : 'var(--emerald-100)'}; color:${p.netScore < 0 ? 'var(--rose-500)' : 'var(--emerald-500)'}; font-size:10px; padding:2px 6px;">
                    ${p.netScore > 0 ? '+' : ''}${p.netScore} score
                </span>
            </div>
        </div>
    `).join('');
}

function flyToProvince(lat, lng) {
    if (geoMapInstance) {
        geoMapInstance.flyTo([lat, lng], 8, { duration: 1.2 });
    }
}

function initGeoCityChart() {
    const ctx = document.getElementById('geoCityChart');
    if (!ctx) return;
    if (geoCityChartInstance) return;

    geoCityChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Denpasar', 'Makassar', 'IKN'],
            datasets: [
                {
                    label: 'Positive Vol (K)',
                    data: [320, 260, 240, 180, 150, 110, 80],
                    backgroundColor: '#10b981',
                    borderRadius: 4
                },
                {
                    label: 'Negative Vol (K)',
                    data: [520, 160, 140, 110, 45, 50, 30],
                    backgroundColor: '#f43f5e',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top', labels: { color: '#9099b0', font: { size: 11 } } },
                tooltip: { backgroundColor: '#13151b', borderColor: '#252836', borderWidth: 1 }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#545b72' } },
                y: { grid: { color: '#1e2230' }, ticks: { color: '#545b72', callback: v => `${v}K` } }
            }
        }
    });
}

function initGeoLocalFeed() {
    const feed = document.getElementById('geo-local-feed');
    if (!feed) return;

    feed.innerHTML = `
        <div class="feed-item">
            <div class="feed-icon icon-x"><i class="ph-bold ph-map-pin"></i></div>
            <div style="flex:1;">
                <div class="feed-meta"><span class="feed-author">@jkt_update</span><span class="feed-time">1m ago</span></div>
                <p class="feed-text">[DKI Jakarta] Signal alert: #BrandGagal mention rate reached 450 post/hr in South Jakarta region.</p>
                <span class="tag" style="background:var(--rose-100); color:var(--rose-500);">CRISIS SIGNAL</span>
            </div>
        </div>
        <div class="feed-item">
            <div class="feed-icon icon-ig"><i class="ph-bold ph-map-pin"></i></div>
            <div style="flex:1;">
                <div class="feed-meta"><span class="feed-author">@bandung_creative</span><span class="feed-time">14m ago</span></div>
                <p class="feed-text">[Jawa Barat] Product launch pop-up at Paris Van Java drew 2,000+ visitors. Positive sentiment 88%.</p>
                <span class="tag" style="background:var(--emerald-100); color:var(--emerald-500);">POSITIVE EVENT</span>
            </div>
        </div>
    `;
}

// ══════════════════════════════════════════════════════════════════════════
// 2. SHARE OF VOICE (SOV) MATRIX ENGINE
// ══════════════════════════════════════════════════════════════════════════

let sovTrendChartInstance = null;
let sovRadarChartInstance = null;

function initSOVMatrixCharts() {
    initSOVTrendChart();
    initSOVRadarChart();
}

function initSOVTrendChart() {
    const ctx = document.getElementById('sovTrendChart');
    if (!ctx || sovTrendChartInstance) return;

    sovTrendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sep 28', 'Sep 29', 'Sep 30', 'Oct 1', 'Oct 2', 'Oct 3', 'Oct 4'],
            datasets: [
                { label: 'BrandX (You)', data: [38.2, 39.0, 40.5, 41.0, 39.8, 41.5, 42.4], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3 },
                { label: 'Kompetitor A', data: [31.0, 30.2, 29.1, 28.5, 29.0, 28.0, 27.8], borderColor: '#f97316', fill: false, tension: 0.3 },
                { label: 'Kompetitor B', data: [17.5, 18.0, 17.8, 18.2, 18.5, 18.0, 18.1], borderColor: '#8b5cf6', fill: false, tension: 0.3 },
                { label: 'Kompetitor C', data: [13.3, 12.8, 12.6, 12.3, 12.7, 12.5, 11.7], borderColor: '#545b72', fill: false, tension: 0.3 },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top', labels: { color: '#9099b0' } },
                tooltip: { backgroundColor: '#13151b', borderColor: '#252836', borderWidth: 1, callbacks: { label: c => ` ${c.dataset.label}: ${c.raw}%` } }
            },
            scales: {
                x: { grid: { color: '#1e2230' }, ticks: { color: '#545b72' } },
                y: { grid: { color: '#1e2230' }, ticks: { color: '#545b72', callback: v => `${v}%` } }
            }
        }
    });
}

function initSOVRadarChart() {
    const ctx = document.getElementById('sovRadarChart');
    if (!ctx || sovRadarChartInstance) return;

    sovRadarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['X/Twitter', 'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'News'],
            datasets: [
                { label: 'BrandX', data: [88, 72, 80, 65, 90, 75], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.2)', borderWidth: 2 },
                { label: 'Kompetitor A', data: [60, 85, 70, 78, 62, 70], borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.15)', borderWidth: 1.5 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top', labels: { color: '#9099b0', font: { size: 10 } } } },
            scales: {
                r: {
                    angleLines: { color: '#1e2230' },
                    grid: { color: '#1e2230' },
                    pointLabels: { color: '#9099b0', font: { size: 10, weight: '600' } },
                    ticks: { display: false }
                }
            }
        }
    });
}

// ══════════════════════════════════════════════════════════════════════════
// 3. CRISIS PLAYBOOK ACTIONS & SIMULATION
// ══════════════════════════════════════════════════════════════════════════

function triggerCrisisAction() {
    alert('Crisis Protocol Activated! Escalation alert dispatched to C-Suite, Legal, and PR Ops via Telegram & Email.');
    appendCrisisConsole('[ACTION] Crisis Protocol manually executed by Admin. Emergency contacts notified.');
}

function executeStep2(btn) {
    if (btn) {
        btn.innerHTML = '<i class="ph ph-check"></i> Alert Sent';
        btn.style.background = 'var(--emerald-500)';
    }
    appendCrisisConsole('[STEP 2] Emergency alert re-dispatched to PR & Legal Directors.');
}

function executeStep3() {
    appendCrisisConsole('[STEP 3] AI Clarification Brief Generated:\n"Official Statement: BrandX engineering team has identified and resolved the customer service queuing bug. All support channels are operating normally."');
    alert('Clarification Statement Generated! Copy from console log.');
}

function postCrisisConsoleNote() {
    const input = document.getElementById('crisis-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    const now = new Date().toLocaleTimeString('id-ID');
    appendCrisisConsole(`[${now} WIB] MANUAL NOTE: ${text}`);
    input.value = '';
}

function appendCrisisConsole(text) {
    const consoleEl = document.getElementById('crisis-console');
    if (consoleEl) {
        consoleEl.innerHTML += `\n${text}`;
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }
}

// ══════════════════════════════════════════════════════════════════════════
// 4. REPORT BUILDER STUDIO ENGINE
// ══════════════════════════════════════════════════════════════════════════

let reportPreviewChartInstance = null;

function initReportPreviewChart() {
    const ctx = document.getElementById('reportPreviewChart');
    if (!ctx || reportPreviewChartInstance) return;

    reportPreviewChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                { label: 'Mentions', data: [180, 220, 210, 340, 420, 390, 480], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: '#1e2230' }, ticks: { color: '#545b72' } },
                y: { grid: { color: '#1e2230' }, ticks: { color: '#545b72' } }
            }
        }
    });
}

function updateReportTitle(val) {
    const titleEl = document.getElementById('preview-doc-title');
    if (titleEl) titleEl.textContent = val || 'Strategic Intelligence Briefing';
}

function toggleReportModule(modId, isChecked) {
    const el = document.getElementById(modId);
    if (el) el.style.display = isChecked ? 'block' : 'none';
}

function updateReportPreview() {
    const preset = document.getElementById('report-preset-select')?.value;
    const titleInput = document.getElementById('report-title-input');

    if (preset === 'crisis') {
        if (titleInput) titleInput.value = 'Crisis Incident Audit & Escalation Brief';
        updateReportTitle('Crisis Incident Audit & Escalation Brief');
    } else if (preset === 'sov') {
        if (titleInput) titleInput.value = 'Monthly Competitor Share of Voice Audit';
        updateReportTitle('Monthly Competitor Share of Voice Audit');
    } else if (preset === 'kol') {
        if (titleInput) titleInput.value = 'KOL & Influencer Campaign Performance ROI';
        updateReportTitle('KOL & Influencer Campaign Performance ROI');
    } else {
        if (titleInput) titleInput.value = 'Strategic Intelligence Briefing';
        updateReportTitle('Strategic Intelligence Briefing');
    }

    if (reportPreviewChartInstance) {
        reportPreviewChartInstance.data.datasets[0].data = Array.from({length: 7}, () => Math.floor(150 + Math.random() * 350));
        reportPreviewChartInstance.update();
    }
}

function triggerReportDownload() {
    alert('Generating PDF Document... Downloading "SPHERE_Executive_Report_Indocorp.pdf"');
    window.print();
}

// ══════════════════════════════════════════════════════════════════════════
// 5. SETTINGS & INTEGRATIONS ENGINE
// ══════════════════════════════════════════════════════════════════════════

function saveEnterpriseSettings() {
    alert('Enterprise Settings saved successfully! Configurations synchronized across workspace cluster.');
}

function testApiConn(platform) {
    alert(`[${platform} Firehose API] Connection Test Passed! 200 OK · Latency: 42ms.`);
}

// ══════════════════════════════════════════════════════════════════════════
// 6. ACCOUNT INVESTIGATION & BOT AUDIT ENGINE
// ══════════════════════════════════════════════════════════════════════════

let botGaugeChartInstance = null;
let investigationGraphSim = null;

let invGeoMapInstance = null;

function initAccountInvestigation() {
    initBotGaugeChart();
    renderBehavioralHeatmap();
    initInvestigationGraph();
    initInvGeoMap();
}

function initInvGeoMap() {
    const container = document.getElementById('inv-leaflet-map');
    if (!container) return;

    if (invGeoMapInstance) {
        invGeoMapInstance.invalidateSize();
        return;
    }

    if (typeof L === 'undefined') {
        container.innerHTML = `<div class="empty-state"><i class="ph ph-warning"></i><p>Leaflet map library loading...</p></div>`;
        return;
    }

    // Centered on Indonesia Cluster
    invGeoMapInstance = L.map('inv-leaflet-map', {
        center: [-2.5, 115.0],
        zoom: 5,
        zoomControl: true,
        attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
    }).addTo(invGeoMapInstance);

    // Geolocation Target Points
    const invGeoPoints = [
        { name: 'Central Target Account (@buzz_master_id)', lat: -6.2088, lng: 106.8456, ip: '103.147.36.192', city: 'D.K.I. Jakarta', role: 'Primary Target Node', color: '#f43f5e', primary: true },
        { name: 'Sub-Bot Node (@ring_node_alpha)', lat: -7.2575, lng: 112.7521, ip: '180.252.11.84', city: 'Surabaya, Jatim', role: 'Retweet Ring Node', color: '#ef4444' },
        { name: 'Amplifier Bot (@polit_bot_09)', lat: 3.5952, lng: 98.6722, ip: '114.124.201.12', city: 'Medan, Sumut', role: 'Content Mirroring Bot', color: '#f59e0b' },
        { name: 'Click Farm Relay (@click_farm_bdg)', lat: -6.9175, lng: 107.6191, ip: '182.253.40.99', city: 'Bandung, Jabar', role: 'Automation Server Pool', color: '#8b5cf6' }
    ];

    invGeoPoints.forEach(pt => {
        const iconHtml = `<div class="geo-pulse-pin" style="background:${pt.color}; color:${pt.color}; ${pt.primary ? 'width:18px; height:18px; box-shadow:0 0 12px #f43f5e;' : ''}"></div>`;
        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-inv-geo-pin',
            iconSize: [pt.primary ? 18 : 14, pt.primary ? 18 : 14],
            iconAnchor: [pt.primary ? 9 : 7, pt.primary ? 9 : 7]
        });

        const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(invGeoMapInstance);

        const popup = `
            <div style="padding:6px; font-family:var(--font); min-width:200px;">
                <div style="font-size:10px; font-weight:800; color:${pt.color}; text-transform:uppercase;">${pt.role}</div>
                <div style="font-size:13px; font-weight:800; color:var(--text-primary); margin-top:2px;">${pt.name}</div>
                <div style="font-size:11px; color:var(--blue-500); margin-top:2px;">${pt.city}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:6px; border-top:1px solid var(--border-subtle); padding-top:4px;">
                    <div>IP Proxy: <strong style="color:var(--text-primary);">${pt.ip}</strong></div>
                    <div>Coords: <strong style="color:var(--text-secondary);">${pt.lat.toFixed(4)}°, ${pt.lng.toFixed(4)}°</strong></div>
                </div>
            </div>
        `;
        marker.bindPopup(popup);

        marker.on('click', () => {
            const latEl = document.getElementById('inv-geo-lat');
            const lngEl = document.getElementById('inv-geo-lng');
            const ipEl = document.getElementById('inv-geo-ip');
            if (latEl) latEl.textContent = `${pt.lat.toFixed(4)}° ${pt.lat >= 0 ? 'N' : 'S'}`;
            if (lngEl) lngEl.textContent = `${pt.lng.toFixed(4)}° ${pt.lng >= 0 ? 'E' : 'W'}`;
            if (ipEl) ipEl.textContent = pt.ip;
        });
    });

    // Draw dashed connecting lines from target node to sub-bot nodes
    const primaryPt = invGeoPoints[0];
    invGeoPoints.slice(1).forEach(pt => {
        L.polyline([[primaryPt.lat, primaryPt.lng], [pt.lat, pt.lng]], {
            color: pt.color,
            weight: 2,
            opacity: 0.7,
            dashArray: '6, 6'
        }).addTo(invGeoMapInstance);
    });

    setTimeout(() => {
        if (invGeoMapInstance) invGeoMapInstance.invalidateSize();
    }, 200);
}

let invNodesData = [];
let invLinksData = [];
let activeInspectedNode = null;

function initInvestigationGraph(forceReset = false) {
    const canvas = document.getElementById('investigation-graph-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 420;
    let dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        if (!container || !canvas) return;
        width = container.clientWidth || 800;
        height = container.clientHeight || 420;
        dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform matrix to prevent scale stacking
        ctx.scale(dpr, dpr);
        
        const target = invNodesData.find(n => n.id === 'target');
        if (target) {
            target.fx = width / 2;
            target.fy = height / 2;
        }
        if (investigationGraphSim) {
            investigationGraphSim.force('center', d3.forceCenter(width / 2, height / 2));
            investigationGraphSim.alpha(0.3).restart();
        }
    }

    // If simulation already exists, just resize and wake up simulation!
    if (investigationGraphSim && !forceReset) {
        resizeCanvas();
        investigationGraphSim.alpha(0.5).restart();
        return;
    }

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // 1. Central Target Node (@buzz_master_id)
    const targetNode = {
        id: 'target',
        name: '@buzz_master_id',
        type: 'TARGET_ACCOUNT',
        color: '#f43f5e',
        radius: 26,
        x: width / 2,
        y: height / 2,
        fx: width / 2, // Fixed center
        fy: height / 2,
        detail: 'Primary investigated handle. High Bot Probability (87%). Proxy IP Node in Jakarta.'
    };

    // 2. 6 Radial Forensic Hubs (Cabang Bedah Tuntas)
    const hubs = [
        { id: 'hub_syndicate', name: '1. Buzzer Syndicate Ring', color: '#ef4444', radius: 18, detail: '28 coordinated bot accounts. Retweet sync lag: 0.4 seconds.' },
        { id: 'hub_identity', name: '2. Cross-Platform Footprint', color: '#3b82f6', radius: 18, detail: '5 matching digital profiles across TikTok, IG, Telegram, Reddit.' },
        { id: 'hub_vectors', name: '3. Campaign Attack Target', color: '#f59e0b', radius: 18, detail: 'Target brand: BrandX. Hashtag spam: #BrandGagal (120 post/hr).' },
        { id: 'hub_alias', name: '4. Historical Alias Vault', color: '#8b5cf6', radius: 18, detail: 'Repurposed from quote farm account @galau_quotes_indo.' },
        { id: 'hub_behavior', name: '5. Behavioral Automation', color: '#ec4899', radius: 18, detail: '24/7 continuous posting without human sleep gap (02-05 WIB).' },
        { id: 'hub_deleted', name: '6. Deleted Content Archive', color: '#10b981', radius: 18, detail: '2 deleted posts cached by system before removal. Phishing link flagged.' },
    ];

    // 3. Sub-nodes branching out from hubs
    const leafNodes = [
        // Hub 1 (Syndicate)
        { id: 'leaf_bot1', hub: 'hub_syndicate', name: '@ring_node_alpha', color: '#f87171', radius: 12, detail: 'Sub-bot node executing instant retweets.' },
        { id: 'leaf_bot2', hub: 'hub_syndicate', name: '@polit_bot_09', color: '#f87171', radius: 12, detail: 'Content mirroring bot registered Jan 2026.' },
        
        // Hub 2 (Footprint)
        { id: 'leaf_id1', hub: 'hub_identity', name: 'TikTok: @buzz_master_off', color: '#60a5fa', radius: 12, detail: 'Matching bio link & avatar fingerprint (94% confidence).' },
        { id: 'leaf_id2', hub: 'hub_identity', name: 'Telegram: @buzz_syndicate', color: '#60a5fa', radius: 12, detail: 'Broadcast channel with 1,400 members.' },
        
        // Hub 3 (Attack Vectors)
        { id: 'leaf_v1', hub: 'hub_vectors', name: 'Target: BrandX', color: '#fbbf24', radius: 12, detail: 'Primary target of negative sentiment campaign.' },
        { id: 'leaf_v2', hub: 'hub_vectors', name: '#BrandGagal Tag', color: '#fbbf24', radius: 12, detail: 'Spam hashtag amplified by click farm.' },

        // Hub 4 (Alias)
        { id: 'leaf_a1', hub: 'hub_alias', name: '@galau_quotes_indo', color: '#a78bfa', radius: 12, detail: 'Previous handle used until Sep 2026.' },
        { id: 'leaf_a2', hub: 'hub_alias', name: '@kpop_giveaway_store', color: '#a78bfa', radius: 12, detail: 'Original account creation handle in 2025.' },

        // Hub 5 (Behavior)
        { id: 'leaf_b1', hub: 'hub_behavior', name: 'StyleGAN AI Avatar', color: '#f472b6', radius: 12, detail: 'Synthetic face fingerprint matched by AI vision classifier.' },

        // Hub 6 (Deleted)
        { id: 'leaf_d1', hub: 'hub_deleted', name: 'Cached Post #8819', color: '#34d399', radius: 12, detail: 'Deleted tweet calling for regulator audit.' },
    ];

    invNodesData = [targetNode, ...hubs, ...leafNodes];

    invLinksData = [
        ...hubs.map(h => ({ source: 'target', target: h.id, value: 3, label: 'FORENSIC VECTOR' })),
        ...leafNodes.map(l => ({ source: l.hub, target: l.id, value: 1.5, label: 'SUB-BRANCH' }))
    ];

    if (investigationGraphSim) investigationGraphSim.stop();
    if (typeof d3 === 'undefined') return;

    investigationGraphSim = d3.forceSimulation(invNodesData)
        .force('link', d3.forceLink(invLinksData).id(d => d.id).distance(d => d.source.id === 'target' ? 120 : 55))
        .force('charge', d3.forceManyBody().strength(-240))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(d => d.radius + 12))
        .alphaDecay(0.015)
        .alphaTarget(0.005) // Keep slight pulse physics active
        .on('tick', renderInvestigationCanvas);

    window.removeEventListener('resize', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);

    // Mouse drag & hover interaction setup
    let draggedNode = null;
    let hoveredNode = null;
    const tooltip = document.getElementById('inv-tooltip');

    canvas.onmousemove = (evt) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = evt.clientX - rect.left;
        const mouseY = evt.clientY - rect.top;

        if (draggedNode) {
            draggedNode.fx = mouseX;
            draggedNode.fy = mouseY;
            investigationGraphSim.alphaTarget(0.3).restart();
            return;
        }

        const found = invNodesData.find(n => {
            const dx = n.x - mouseX;
            const dy = n.y - mouseY;
            return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
        });

        if (found) {
            hoveredNode = found;
            canvas.style.cursor = 'pointer';
            if (tooltip) {
                tooltip.style.display = 'block';
                tooltip.style.left = (mouseX + 16) + 'px';
                tooltip.style.top = (mouseY - 10) + 'px';
                document.getElementById('tt-title').textContent = found.name;
                document.getElementById('tt-type').textContent = found.type || 'Forensic Branch';
                document.getElementById('tt-desc').textContent = found.detail || 'Forensic analysis vector';
            }
        } else {
            hoveredNode = null;
            canvas.style.cursor = 'grab';
            if (tooltip) tooltip.style.display = 'none';
        }
    };

    canvas.onmousedown = (evt) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = evt.clientX - rect.left;
        const mouseY = evt.clientY - rect.top;

        const found = invNodesData.find(n => {
            const dx = n.x - mouseX;
            const dy = n.y - mouseY;
            return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
        });

        if (found) {
            draggedNode = found;
            if (found.id !== 'target') {
                found.fx = mouseX;
                found.fy = mouseY;
            }
            activeInspectedNode = found;
            updateNodeInspector(found);
        }
    };

    window.addEventListener('mouseup', () => {
        if (draggedNode) {
            if (draggedNode.id !== 'target') {
                draggedNode.fx = null;
                draggedNode.fy = null;
            }
            draggedNode = null;
            investigationGraphSim.alphaTarget(0.005);
        }
    });

    let pulseRadius = 0;
    function renderInvestigationCanvas() {
        // Enforce boundary bounds on every frame to prevent clipping
        invNodesData.forEach(d => {
            if (d.id !== 'target') {
                d.x = Math.max(d.radius + 50, Math.min(width - d.radius - 50, d.x));
                d.y = Math.max(d.radius + 40, Math.min(height - d.radius - 40, d.y));
            }
        });

        ctx.clearRect(0, 0, width, height);

        // 1. Links
        invLinksData.forEach(l => {
            ctx.beginPath();
            ctx.moveTo(l.source.x, l.source.y);
            ctx.lineTo(l.target.x, l.target.y);
            const isConnectedToHovered = hoveredNode && (l.source.id === hoveredNode.id || l.target.id === hoveredNode.id);
            if (l.source.id === 'target') {
                ctx.strokeStyle = isConnectedToHovered ? 'rgba(244, 63, 94, 0.95)' : 'rgba(244, 63, 94, 0.55)';
                ctx.lineWidth = isConnectedToHovered ? 3.5 : 2.5;
                ctx.setLineDash([6, 4]);
            } else {
                ctx.strokeStyle = isConnectedToHovered ? 'rgba(59, 130, 246, 0.8)' : 'rgba(144, 153, 176, 0.25)';
                ctx.lineWidth = isConnectedToHovered ? 2.5 : 1.2;
                ctx.setLineDash([]);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        });

        // 2. Pulsing Aura around Central Target Node
        pulseRadius = (pulseRadius + 0.3) % 28;
        const tNode = invNodesData[0];
        if (tNode) {
            ctx.beginPath();
            ctx.arc(tNode.x, tNode.y, tNode.radius + pulseRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(244, 63, 94, ${1 - pulseRadius / 28})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // 3. Nodes & Labels
        invNodesData.forEach(n => {
            const isHovered = hoveredNode && hoveredNode.id === n.id;
            const isSelected = activeInspectedNode && activeInspectedNode.id === n.id;

            // Draw Node Circle
            ctx.beginPath();
            ctx.arc(n.x, n.y, isHovered ? n.radius + 3 : n.radius, 0, 2 * Math.PI);
            ctx.fillStyle = n.color;
            ctx.fill();
            ctx.strokeStyle = isSelected || isHovered ? '#ffffff' : '#08090d';
            ctx.lineWidth = isSelected || isHovered ? 4 : 2.5;
            ctx.stroke();

            // Label Text Pill Background
            const text = n.name;
            const font = n.id === 'target' ? '800 13px Inter, sans-serif' : '600 10px Inter, sans-serif';
            ctx.font = font;
            const textWidth = ctx.measureText(text).width;
            const textHeight = n.id === 'target' ? 16 : 14;
            const textY = n.y + n.radius + (isHovered ? 17 : 14);

            ctx.fillStyle = n.id === 'target' ? 'rgba(244, 63, 94, 0.95)' : 'rgba(19, 21, 27, 0.90)';
            ctx.beginPath();
            ctx.roundRect(n.x - textWidth / 2 - 6, textY - 10, textWidth + 12, textHeight, 4);
            ctx.fill();
            ctx.strokeStyle = n.id === 'target' || isHovered ? '#ffffff' : 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Text Label
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, n.x, textY - 2);
        });
    }
}

function updateNodeInspector(node) {
    const drawer = document.getElementById('inv-inspector-drawer');
    if (!drawer) return;

    drawer.classList.add('active');
    document.getElementById('insp-name').textContent = node.name;
    document.getElementById('insp-sub').textContent = `Classification: ${node.type || 'Forensic Branch'}`;
    document.getElementById('insp-detail').textContent = node.detail || 'Deep forensic vector dissecting account activity.';
    document.getElementById('insp-badge').textContent = node.id === 'target' ? 'TARGET NODE' : 'FORENSIC VECTOR';
}

function closeInvInspector() {
    const drawer = document.getElementById('inv-inspector-drawer');
    if (drawer) drawer.classList.remove('active');
}

function initBotGaugeChart() {
    const ctx = document.getElementById('botScoreGaugeChart');
    if (!ctx || botGaugeChartInstance) return;

    botGaugeChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Bot Score', 'Authentic Score'],
            datasets: [{
                data: [87, 13],
                backgroundColor: ['#f43f5e', '#1e2230'],
                borderColor: '#191c24',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '80%',
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });
}

function renderBehavioralHeatmap() {
    const grid = document.getElementById('behavioral-heatmap-grid');
    if (!grid) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Generate 7 rows x 24 cols matrix
    let html = '';
    days.forEach((day, dIdx) => {
        html += `<div class="heatmap-row"><span class="heatmap-day-label">${day}</span>`;
        for (let hour = 0; hour < 24; hour++) {
            // Unnatural 24/7 automation pattern (active late night 01:00-05:00)
            let levelClass = '';
            const rand = Math.random();
            if (hour >= 1 && hour <= 5) {
                // High activity during human sleep hours -> bot flag!
                levelClass = rand > 0.3 ? 'l4' : 'l3';
            } else if (rand > 0.6) {
                levelClass = 'l3';
            } else if (rand > 0.3) {
                levelClass = 'l2';
            } else {
                levelClass = 'l1';
            }
            html += `<div class="heatmap-cell ${levelClass}" title="${day} ${hour.toString().padStart(2,'0')}:00 WIB — ${levelClass === 'l4' ? '140' : '45'} posts/hr"></div>`;
        }
        html += `</div>`;
    });

    grid.innerHTML = html;
}

function runAccountAudit() {
    const input = document.getElementById('target-handle-input');
    const handle = input ? input.value.trim() : '@buzz_master_id';
    
    const displayHandle = document.getElementById('target-handle-display');
    const displayName = document.getElementById('target-name-display');

    if (displayName) displayName.textContent = handle.replace('@', '').toUpperCase() + ' AUDIT';
    if (displayHandle) displayHandle.textContent = `${handle} · Analyzed just now · IP Proxy Node Detected`;

    alert(`Deep Account Audit completed for ${handle}! 87% Bot Probability confirmed.`);
}

/* ==========================================================================
   COBE 3D WEBGL GLOBE ENGINES (Command Center & Account Investigation)
   ========================================================================== */

let dashboardGlobeInstance = null;
let dashGlobePhi = 0;
let dashGlobeTheta = 0.2;
let dashPointerInteracting = null;
let dashPointerMovement = { x: 0, y: 0 };
let dashIsAutoSpinning = true;

const DASH_GLOBE_MARKERS = [
    { location: [-6.2088, 106.8456], size: 0.08, id: 'jkt', name: 'DKI Jakarta', stats: 'Active Accounts: 342,100 · Volume: 840K/day' },
    { location: [35.6762, 139.6503], size: 0.06, id: 'tky', name: 'Tokyo', stats: 'Active Accounts: 198,400 · Volume: 520K/day' },
    { location: [51.5074, -0.1278], size: 0.06, id: 'lon', name: 'London', stats: 'Active Accounts: 145,200 · Volume: 410K/day' },
    { location: [40.7128, -74.0060], size: 0.07, id: 'nyc', name: 'New York', stats: 'Active Accounts: 210,000 · Volume: 680K/day' },
    { location: [37.7749, -122.4194], size: 0.06, id: 'sf', name: 'San Francisco', stats: 'Active Accounts: 165,800 · Volume: 490K/day' },
    { location: [-33.8688, 151.2093], size: 0.05, id: 'syd', name: 'Sydney', stats: 'Active Accounts: 88,300 · Volume: 230K/day' },
];

function initDashboardGlobe() {
    const canvas = document.getElementById('dashboard-globe-canvas');
    if (!canvas || typeof createGlobe === 'undefined') return;

    if (dashboardGlobeInstance) {
        dashboardGlobeInstance.destroy();
        dashboardGlobeInstance = null;
    }

    const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : { width: 800, height: 480 };
    const width = Math.max(500, (rect.width || 800)) * 2;
    const height = Math.max(400, (rect.height || 480)) * 2;

    try {
        dashboardGlobeInstance = createGlobe(canvas, {
            devicePixelRatio: 2,
            width: width,
            height: height,
            phi: dashGlobePhi,
            theta: dashGlobeTheta,
            dark: 1,
            diffuse: 1.3,
            mapSamples: 24000,
            mapBrightness: 7,
            baseColor: [0.03, 0.03, 0.05],
            markerColor: [1, 1, 1],
            glowColor: [0.25, 0.3, 0.45],
            markers: DASH_GLOBE_MARKERS.map(m => ({ location: m.location, size: 0.07, id: m.id })),
            arcs: [
                { from: [-6.2088, 106.8456], to: [35.6762, 139.6503] },
                { from: [-6.2088, 106.8456], to: [51.5074, -0.1278] },
                { from: [-6.2088, 106.8456], to: [40.7128, -74.0060] },
                { from: [-6.2088, 106.8456], to: [-33.8688, 151.2093] },
                { from: [-6.2088, 106.8456], to: [37.7749, -122.4194] },
            ],
            arcColor: [0.22, 0.74, 0.97],
            arcWidth: 0.7,
            arcHeight: 0.38,
            onRender: (state) => {
                if (dashIsAutoSpinning && dashPointerInteracting === null) {
                    dashGlobePhi += 0.0035;
                }
                state.phi = dashGlobePhi + dashPointerMovement.x;
                state.theta = dashGlobeTheta + dashPointerMovement.y;
            }
        });
    } catch(err) {
        console.warn('COBE Dashboard Globe init error:', err);
    }

    // Pointer drag physics
    canvas.onpointerdown = (e) => {
        dashPointerInteracting = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
    };

    window.addEventListener('pointermove', (e) => {
        if (dashPointerInteracting !== null) {
            const deltaX = (e.clientX - dashPointerInteracting.x) / 180;
            const deltaY = (e.clientY - dashPointerInteracting.y) / 180;
            dashPointerMovement.x = deltaX;
            dashPointerMovement.y = Math.max(-0.5, Math.min(0.5, deltaY));
        }
    });

    window.addEventListener('pointerup', () => {
        if (dashPointerInteracting !== null) {
            dashGlobePhi += dashPointerMovement.x;
            dashGlobeTheta += dashPointerMovement.y;
            dashPointerMovement = { x: 0, y: 0 };
            dashPointerInteracting = null;
            if (canvas) canvas.style.cursor = 'grab';
        }
    });
}

function focusGlobeCity(cityId) {
    dashIsAutoSpinning = false;
    const targetMap = {
        'jkt': { phi: -1.85, theta: 0.1, accounts: '342,100 Accounts', volume: '840,000 posts/day', name: 'DKI Jakarta, Indonesia' },
        'tky': { phi: -2.4, theta: 0.3, accounts: '198,400 Accounts', volume: '520,000 posts/day', name: 'Tokyo, Japan' },
        'lon': { phi: 0.0, theta: 0.5, accounts: '145,200 Accounts', volume: '410,000 posts/day', name: 'London, UK' },
        'nyc': { phi: 1.2, theta: 0.4, accounts: '210,000 Accounts', volume: '680,000 posts/day', name: 'New York, USA' },
        'sf':  { phi: 2.1, theta: 0.4, accounts: '165,800 Accounts', volume: '490,000 posts/day', name: 'San Francisco, USA' },
    };
    if (targetMap[cityId]) {
        dashGlobePhi = targetMap[cityId].phi;
        dashGlobeTheta = targetMap[cityId].theta;
        
        const titleEl = document.getElementById('dash-globe-city-title');
        const accEl = document.getElementById('dash-hero-accounts');
        const volEl = document.getElementById('dash-hero-volume');
        
        if (titleEl) titleEl.textContent = targetMap[cityId].name;
        if (accEl) accEl.textContent = targetMap[cityId].accounts;
        if (volEl) volEl.textContent = targetMap[cityId].volume;
    }
}

function toggleDashboardGlobeSpin() {
    dashIsAutoSpinning = !dashIsAutoSpinning;
}


// ── Account Investigation 3D Proxy Arc Globe ───────────────────────────

let invGlobeInstance = null;
let invGlobePhi = -1.85; // Default center on Jakarta
let invGlobeTheta = 0.15;
let invPointerInteracting = null;
let invPointerMovement = { x: 0, y: 0 };
let invIsAutoSpinning = true;

const INV_GLOBE_NODES = [
    { id: 'jkt', name: 'DKI Jakarta (Central Target Node)', location: [-6.2088, 106.8456], ip: '103.147.36.192', primary: true, size: 0.09 },
    { id: 'sub', name: 'Surabaya Sub-Bot Node', location: [-7.2575, 112.7521], ip: '180.252.11.84', size: 0.05 },
    { id: 'med', name: 'Medan Bot Relay', location: [3.5952, 98.6722], ip: '114.124.201.12', size: 0.05 },
    { id: 'bdg', name: 'Bandung Click Farm Pool', location: [-6.9175, 107.6191], ip: '182.253.40.99', size: 0.05 },
    { id: 'sf', name: 'San Francisco US Proxy Relay', location: [37.7749, -122.4194], ip: '104.28.14.88', size: 0.06 },
    { id: 'tky', name: 'Tokyo Fast-Flux Server', location: [35.6762, 139.6503], ip: '133.242.18.90', size: 0.06 },
];

function initAccountInvestigationGlobe() {
    const canvas = document.getElementById('inv-globe-canvas');
    if (!canvas || typeof createGlobe === 'undefined') return;

    if (invGlobeInstance) {
        invGlobeInstance.destroy();
        invGlobeInstance = null;
    }

    const rect = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : { width: 550, height: 340 };
    const width = Math.max(300, (rect.width || 550)) * 2;
    const height = Math.max(250, (rect.height || 340)) * 2;

    try {
        invGlobeInstance = createGlobe(canvas, {
            devicePixelRatio: 2,
            width: width,
            height: height,
            phi: invGlobePhi,
            theta: invGlobeTheta,
            dark: 1,
            diffuse: 1.25,
            mapSamples: 18000,
            mapBrightness: 6.5,
            baseColor: [0.03, 0.03, 0.05],
            markerColor: [1, 0.25, 0.35],
            glowColor: [0.2, 0.25, 0.35],
            markers: INV_GLOBE_NODES.map(n => ({ location: n.location, size: n.size, id: n.id })),
            arcs: [
                { from: [-6.2088, 106.8456], to: [-7.2575, 112.7521] },
                { from: [-6.2088, 106.8456], to: [3.5952, 98.6722] },
                { from: [-6.2088, 106.8456], to: [-6.9175, 107.6191] },
                { from: [-6.2088, 106.8456], to: [37.7749, -122.4194] },
                { from: [-6.2088, 106.8456], to: [35.6762, 139.6503] },
            ],
            arcColor: [0.22, 0.74, 0.97],
            arcWidth: 0.6,
            arcHeight: 0.38,
            onRender: (state) => {
                if (invIsAutoSpinning && invPointerInteracting === null) {
                    invGlobePhi += 0.003;
                }
                state.phi = invGlobePhi + invPointerMovement.x;
                state.theta = invGlobeTheta + invPointerMovement.y;
            }
        });
    } catch(err) {
        console.warn('COBE Acc Inves Globe init error:', err);
    }

    canvas.onpointerdown = (e) => {
        invPointerInteracting = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
    };

    window.addEventListener('pointermove', (e) => {
        if (invPointerInteracting !== null) {
            const deltaX = (e.clientX - invPointerInteracting.x) / 180;
            const deltaY = (e.clientY - invPointerInteracting.y) / 180;
            invPointerMovement.x = deltaX;
            invPointerMovement.y = Math.max(-0.5, Math.min(0.5, deltaY));
        }
    });

    window.addEventListener('pointerup', () => {
        if (invPointerInteracting !== null) {
            invGlobePhi += invPointerMovement.x;
            invGlobeTheta += invPointerMovement.y;
            invPointerMovement = { x: 0, y: 0 };
            invPointerInteracting = null;
            if (canvas) canvas.style.cursor = 'grab';
        }
    });
}

function focusInvGlobeTarget(targetId) {
    invIsAutoSpinning = false;
    if (targetId === 'jkt') {
        invGlobePhi = -1.85;
        invGlobeTheta = 0.1;
        updateInvTelemetryHUD(-6.2088, 106.8456, '103.147.36.192');
    } else if (targetId === 'sf') {
        invGlobePhi = 2.1;
        invGlobeTheta = 0.4;
        updateInvTelemetryHUD(37.7749, -122.4194, '104.28.14.88');
    }
}

function updateInvTelemetryHUD(lat, lng, ip) {
    const latEl = document.getElementById('inv-geo-lat');
    const lngEl = document.getElementById('inv-geo-lng');
    const ipEl = document.getElementById('inv-geo-ip');
    if (latEl) latEl.textContent = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
    if (lngEl) lngEl.textContent = `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`;
    if (ipEl) ipEl.textContent = ip;
}

function toggleInvGlobeSpin() {
    invIsAutoSpinning = !invIsAutoSpinning;
}

// Global listener for COBE readiness event
window.addEventListener('cobe-ready', () => {
    initDashboardGlobe();
    initAccountInvestigationGlobe();
});

/* ==========================================================================
   DATA LEAK RADAR & DARK WEB INTELLIGENCE (FBI/MI6 GRADE OSINT SUITE)
   ========================================================================== */

let leakTypeChartInstance = null;
let leakFirehoseInterval = null;

const LEAK_DATASET = [
    {
        id: 'L-9842',
        identity: 'ciso@enterprise-corp.co.id',
        hash: 'sk_live_98f92a11b7e4... (Stripe Secret Key)',
        source: 'BreachForums v2 (Auction)',
        riskScore: 98,
        riskLevel: 'CRITICAL',
        status: 'Exposed',
        date: '2026-10-04 18:42 WIB',
        domain: 'enterprise-corp.co.id'
    },
    {
        id: 'L-9841',
        identity: 'admin.db@gov.id',
        hash: 'SHA256: 8f9b2... (PostgreSQL Superuser Pass)',
        source: 'RaidForums Leak Dump #409',
        riskScore: 94,
        riskLevel: 'CRITICAL',
        status: 'Exposed',
        date: '2026-10-04 18:15 WIB',
        domain: 'gov.id'
    },
    {
        id: 'L-9840',
        identity: 'dev-aws-root@company-x.com',
        hash: 'AKIAIOSFODNN7EXAMPLE (AWS Master Access)',
        source: 'GitHub Public Gist Stealer Log',
        riskScore: 91,
        riskLevel: 'CRITICAL',
        status: 'Quarantined',
        date: '2026-10-04 17:50 WIB',
        domain: 'company-x.com'
    },
    {
        id: 'L-9839',
        identity: 'director.fin@bank-sentral.id',
        hash: 'NIK 31740928017... + Passport Scan PDF',
        source: 'Tor Onion Market "X-Leaks"',
        riskScore: 88,
        riskLevel: 'HIGH',
        status: 'Under Watch',
        date: '2026-10-04 16:30 WIB',
        domain: 'bank-sentral.id'
    },
    {
        id: 'L-9838',
        identity: 'lead-sec@telecom-indo.com',
        hash: 'eyJhbGciOiJIUzI1Ni... (JWT Admin Token)',
        source: 'Redline Stealer Log Pack 2026',
        riskScore: 82,
        riskLevel: 'HIGH',
        status: 'Revoked',
        date: '2026-10-04 15:10 WIB',
        domain: 'telecom-indo.com'
    },
    {
        id: 'L-9837',
        identity: 'devops-ci@company-x.com',
        hash: 'ghp_9841Nkasd... (GitHub Personal Token)',
        source: 'Pastebin Intercept Bot',
        riskScore: 76,
        riskLevel: 'MEDIUM',
        status: 'Revoked',
        date: '2026-10-04 14:05 WIB',
        domain: 'company-x.com'
    },
    {
        id: 'L-9836',
        identity: 'support@brand-official.co.id',
        hash: '$2a$12$e8F... (Bcrypt Password Hash)',
        source: 'Exploit.in Darknet Board',
        riskScore: 72,
        riskLevel: 'MEDIUM',
        status: 'Under Watch',
        date: '2026-10-04 12:44 WIB',
        domain: 'brand-official.co.id'
    }
];

function initDataLeakRadar() {
    renderLeakRecordsTable(LEAK_DATASET);
    initLeakTypeChart();
    startLeakFirehoseFeed();
}

function renderLeakRecordsTable(records) {
    const tbody = document.getElementById('leak-records-tbody');
    const countEl = document.getElementById('leak-results-count');
    if (!tbody) return;

    if (countEl) {
        countEl.textContent = `Showing ${records.length} of 14,890 matched records`;
    }

    if (!records || records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#71717a; padding:24px;">No breach records found matching query.</td></tr>`;
        return;
    }

    let html = '';
    records.forEach(r => {
        let badgeStyle = 'background:rgba(239, 68, 68, 0.15); color:#ef4444; border:1px solid #ef4444;';
        if (r.riskLevel === 'HIGH') {
            badgeStyle = 'background:rgba(245, 158, 11, 0.15); color:#f59e0b; border:1px solid #f59e0b;';
        } else if (r.riskLevel === 'MEDIUM') {
            badgeStyle = 'background:rgba(56, 189, 248, 0.15); color:#38bdf8; border:1px solid #38bdf8;';
        }

        html += `
        <tr style="border-bottom: 1px solid #18181b;">
            <td>
                <div style="font-weight:700; color:#ffffff;">${r.identity}</div>
                <div style="font-size:10px; color:#71717a;">${r.date}</div>
            </td>
            <td>
                <div style="font-family:monospace; color:#38bdf8; font-size:11px;">${r.hash}</div>
                <div style="font-size:10px; color:#a1a1aa;">ID: ${r.id}</div>
            </td>
            <td>
                <div style="color:#e4e4e7; font-size:11px;">${r.source}</div>
                <div style="font-size:10px; color:#10b981;"><i class="ph ph-shield-check"></i> Darknet Indexer Verified</div>
            </td>
            <td>
                <span class="tag" style="${badgeStyle} font-weight:800; font-size:10px;">
                    ${r.riskLevel} (${r.riskScore})
                </span>
            </td>
            <td>
                <div style="display:flex; gap:6px;">
                    <button class="btn-ghost" style="padding:4px 8px; font-size:10px; border-color:#ef4444; color:#ef4444;" onclick="alert('Auto-Revoke command sent to Identity Provider for ${r.identity}')"><i class="ph ph-key"></i> Revoke</button>
                    <button class="btn-ghost" style="padding:4px 8px; font-size:10px;" onclick="alert('Quarantine Rule dispatched to Cloudflare WAF & Gatekeeper!')"><i class="ph ph-shield-warning"></i> Block</button>
                </div>
            </td>
        </tr>
        `;
    });

    tbody.innerHTML = html;
}

function initLeakTypeChart() {
    const ctx = document.getElementById('leakTypeChart');
    if (!ctx || leakTypeChartInstance) return;

    leakTypeChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Corporate Passwords', 'API Keys & Secrets', 'Executive PII / Passports', 'Customer DB Scans'],
            datasets: [{
                data: [45, 25, 18, 12],
                backgroundColor: ['#ef4444', '#f59e0b', '#38bdf8', '#10b981'],
                borderColor: '#000000',
                borderWidth: 3,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

function startLeakFirehoseFeed() {
    const feed = document.getElementById('leak-firehose-feed');
    if (!feed) return;

    if (leakFirehoseInterval) clearInterval(leakFirehoseInterval);

    const MOCK_FIREHOSE_ITEMS = [
        { title: 'TOR INTERCEPT #9401', desc: 'Matched AWS Secret Access Key: AKIA94... in Stealer Log Pack (Raccoon v2)', sub: 'Vector: Telegram Channel @DarkLogs_Indo · Target: company-x.com', onion: 'xk29a...onion', color: '#ef4444' },
        { title: 'PASTEBIN SNIFFER #9402', desc: 'Exposed SQL Database Connection String (MySQL root:P@ssw0rd2026)', sub: 'Vector: Pastebin Dump #901 · Target: db.gov.id', onion: 'pastebin.com/raw/901', color: '#f59e0b' },
        { title: 'BREACHFORUMS AUCTION #9403', desc: 'Executive NIK 3174... & E-KTP Scans put up for auction (2.4 BTC reserve)', sub: 'Vector: BreachForums v2 Thread #4910 · Target: bank-sentral.id', onion: 'bf2onion...onion', color: '#ef4444' },
        { title: 'DARKNET MARKET RECON #9404', desc: 'Corporate Email Credential Pair (admin@telecom-indo.com:Hash$92)', sub: 'Vector: Genesis Market Bot Log · Target: telecom-indo.com', onion: 'genmark...onion', color: '#38bdf8' },
        { title: 'AUTO-TAKEDOWN ACK #9405', desc: 'Stripe Secret Key sk_live_89f... auto-revoked via API Hook', sub: 'Status: SLA < 2 mins · Provider: Stripe API Takedown Bot', onion: 'Internal Gateway', color: '#10b981' }
    ];

    // Populate initial items
    let initialHtml = '';
    MOCK_FIREHOSE_ITEMS.slice(0, 4).forEach(item => {
        initialHtml += createLeakFeedItemHtml(item);
    });
    feed.innerHTML = initialHtml;

    // Stream new items periodically
    let feedIndex = 0;
    leakFirehoseInterval = setInterval(() => {
        const item = MOCK_FIREHOSE_ITEMS[feedIndex % MOCK_FIREHOSE_ITEMS.length];
        feedIndex++;

        const itemEl = document.createElement('div');
        itemEl.innerHTML = createLeakFeedItemHtml(item);
        const child = itemEl.firstElementChild;
        child.style.opacity = '0';
        child.style.transform = 'translateY(-10px)';
        child.style.transition = 'all 0.4s ease';

        feed.insertBefore(child, feed.firstChild);

        setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
        }, 30);

        if (feed.children.length > 12) {
            feed.removeChild(feed.lastChild);
        }
    }, 4000);
}

function createLeakFeedItemHtml(item) {
    return `
    <div class="feed-item" style="border-left: 3px solid ${item.color}; background: #0a0a0c; margin-bottom: 8px; padding: 10px 14px; border-radius: 4px; border-top:1px solid #1f1f24; border-right:1px solid #1f1f24; border-bottom:1px solid #1f1f24;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-size:11px; font-weight:800; color:${item.color};"><i class="ph ph-warning-circle"></i> ${item.title}</span>
            <span style="font-size:10px; color:#71717a;">Just now · Node: ${item.onion}</span>
        </div>
        <div style="font-size:12px; color:#ffffff; font-family:monospace; margin-bottom:2px;">${item.desc}</div>
        <div style="font-size:11px; color:#a1a1aa;">${item.sub}</div>
    </div>
    `;
}

function executeLeakSearch() {
    const input = document.getElementById('leak-search-input');
    const query = input ? input.value.trim().toLowerCase() : '';

    if (!query) {
        renderLeakRecordsTable(LEAK_DATASET);
        return;
    }

    const filtered = LEAK_DATASET.filter(r => 
        r.identity.toLowerCase().includes(query) ||
        r.hash.toLowerCase().includes(query) ||
        r.domain.toLowerCase().includes(query) ||
        r.source.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query)
    );

    renderLeakRecordsTable(filtered);
}

function triggerLeakScan() {
    alert('Deep Dark Web OSINT Scan launched across 142 Tor Nodes, BreachForums v2, Telegram Channels, and Pastebin Sniffers!\n\nScan completed in 1.4 seconds. 0 new critical leaks detected.');
}

function revokeLeakedKeys() {
    const credsEl = document.getElementById('kpi-leak-creds');
    const keysEl = document.getElementById('kpi-leak-keys');
    if (credsEl) credsEl.textContent = '0 Active';
    if (keysEl) keysEl.textContent = '0 Keys Exposed';
    
    alert('Auto-Revoke Protocol executed!\n\n- 48 AWS & Stripe Secret Keys Revoked via API Hooks.\n- 1,240 Passwords forced reset via Enterprise IdP.\n- Quarantine rules active on Gatekeeper WAF.');
}

/* ==========================================================================
   TARGET CCTV RECONNAISSANCE & PERIMETER MATRIX ENGINE
   ========================================================================== */

let cctvAnimFrameId = null;
let cctvOCRInterval = null;
const cctvThermalState = {
    'cctv-canvas-1': false,
    'cctv-canvas-2': false,
    'cctv-canvas-3': true,
    'cctv-canvas-4': false,
    'cctv-canvas-5': false,
    'cctv-canvas-6': false
};

const cctvTileConfigs = [
    { id: 'cctv-canvas-1', title: 'CAM 01 · HQ Main Lobby', targetLocked: true, boxType: 'FACE_TARGET', speed: 0.8 },
    { id: 'cctv-canvas-2', title: 'CAM 02 · Sudirman Flyover', targetLocked: true, boxType: 'VEHICLE_PLATE', speed: 1.4 },
    { id: 'cctv-canvas-3', title: 'CAM 03 · Monas Gate 1', targetLocked: false, boxType: 'THERMAL_GRID', speed: 0.6 },
    { id: 'cctv-canvas-4', title: 'CAM 04 · SCBD Tower 2', targetLocked: false, boxType: 'PEDESTRIAN_MULTI', speed: 0.9 },
    { id: 'cctv-canvas-5', title: 'CAM 05 · Kuningan Underpass', targetLocked: false, boxType: 'RADAR_TRAFFIC', speed: 1.8 },
    { id: 'cctv-canvas-6', title: 'CAM 06 · Airport T3 Gate 4', targetLocked: false, boxType: 'PERIMETER_SCAN', speed: 0.7 }
];

function initCCTVMatrix() {
    startCCTVRenderLoop();
    startCCTVPlateStream();
}

function startCCTVRenderLoop() {
    if (cctvAnimFrameId) cancelAnimationFrame(cctvAnimFrameId);

    let frameCount = 0;

    function renderFrame() {
        frameCount++;

        cctvTileConfigs.forEach((cfg, idx) => {
            const canvas = document.getElementById(cfg.id);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;

            const isThermal = cctvThermalState[cfg.id];

            // 1. Latar Belakang Digital Video Feed
            if (isThermal) {
                ctx.fillStyle = '#021814';
                ctx.fillRect(0, 0, w, h);
            } else {
                ctx.fillStyle = '#05070a';
                ctx.fillRect(0, 0, w, h);
            }

            // 2. Tech Grid Lines & Scanlines
            ctx.strokeStyle = isThermal ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.08)';
            ctx.lineWidth = 1;

            // Vertical Grid
            for (let x = 0; x < w; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            // Horizontal Grid
            for (let y = 0; y < h; y += 30) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Moving Scanline
            const scanY = (frameCount * 2.5) % h;
            ctx.strokeStyle = isThermal ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.25)';
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(w, scanY);
            ctx.stroke();

            // 3. Dynamic Bounding Box & Target Overlay Animation
            const time = frameCount * 0.04 * cfg.speed;

            if (cfg.boxType === 'VEHICLE_PLATE') {
                const bx = w * 0.35 + Math.sin(time) * 35;
                const by = h * 0.35 + Math.cos(time * 0.7) * 20;
                const bw = 140;
                const bh = 80;

                ctx.fillStyle = isThermal ? 'rgba(16, 185, 129, 0.35)' : 'rgba(30, 41, 59, 0.9)';
                ctx.beginPath();
                ctx.roundRect(bx, by, bw, bh, 6);
                ctx.fill();

                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.strokeRect(bx - 6, by - 6, bw + 12, bh + 12);

                drawReticleCorners(ctx, bx - 6, by - 6, bw + 12, bh + 12, '#ef4444');

                ctx.fillStyle = '#ef4444';
                ctx.fillRect(bx - 6, by - 26, 140, 18);
                ctx.fillStyle = '#ffffff';
                ctx.font = '800 10px monospace';
                ctx.fillText('TARGET: B 1092 RFS', bx - 2, by - 13);

            } else if (cfg.boxType === 'FACE_TARGET') {
                const fx = w * 0.45 + Math.sin(time * 0.8) * 15;
                const fy = h * 0.25 + Math.cos(time * 0.5) * 10;

                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2;
                ctx.strokeRect(fx, fy, 55, 65);
                drawReticleCorners(ctx, fx, fy, 55, 65, '#38bdf8');

                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(fx + 15, fy + 22, 5, 5);
                ctx.fillRect(fx + 35, fy + 22, 5, 5);
                ctx.fillRect(fx + 25, fy + 38, 5, 5);

                ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
                ctx.fillRect(fx, fy + 68, 85, 16);
                ctx.fillStyle = '#000000';
                ctx.font = '800 9px monospace';
                ctx.fillText('FACE ID: 99.4%', fx + 4, fy + 79);

            } else if (cfg.boxType === 'THERMAL_GRID') {
                const tx = w * 0.5 + Math.sin(time) * 40;
                const ty = h * 0.5 + Math.cos(time) * 20;

                const grad = ctx.createRadialGradient(tx, ty, 5, tx, ty, 50);
                grad.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
                grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.6)');
                grad.addColorStop(1, 'rgba(16, 185, 129, 0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(tx, ty, 50, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#10b981';
                ctx.setLineDash([4, 4]);
                ctx.strokeRect(tx - 40, ty - 40, 80, 80);
                ctx.setLineDash([]);

            } else {
                const gx = w * 0.2 + (Math.sin(time) + 1) * w * 0.3;
                const gy = h * 0.4 + Math.cos(time * 1.2) * 15;

                ctx.strokeStyle = 'rgba(255,255,255,0.4)';
                ctx.lineWidth = 1;
                ctx.strokeRect(gx, gy, 40, 50);
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.font = '9px monospace';
                ctx.fillText('OBJ #' + Math.floor(gx), gx, gy - 4);
            }

            // 4. Camera HUD Crosshair
            ctx.strokeStyle = isThermal ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(w / 2 - 15, h / 2);
            ctx.lineTo(w / 2 + 15, h / 2);
            ctx.moveTo(w / 2, h / 2 - 15);
            ctx.lineTo(w / 2, h / 2 + 15);
            ctx.stroke();

            // 5. Update Clock Ticker DOM
            const clockEl = document.querySelector(`.cctv-clock-${idx + 1}`);
            if (clockEl) {
                const now = new Date();
                clockEl.textContent = now.toTimeString().split(' ')[0] + ' WIB';
            }
        });

        cctvAnimFrameId = requestAnimationFrame(renderFrame);
    }

    renderFrame();
}

function drawReticleCorners(ctx, x, y, w, h, color) {
    const len = 10;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.beginPath(); ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + h - len); ctx.lineTo(x, y + h); ctx.lineTo(x + len, y + h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w - len, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - len); ctx.stroke();
}

function startCCTVPlateStream() {
    const streamContainer = document.getElementById('cctv-ocr-stream');
    if (!streamContainer) return;

    if (cctvOCRInterval) clearInterval(cctvOCRInterval);

    const MOCK_PLATES = [
        { plate: 'B 1092 RFS', type: 'TARGET MATCH', conf: '99.4%', status: 'ALERT', color: '#ef4444', location: 'CAM-02 Sudirman' },
        { plate: 'B 4910 SJK', type: 'CIVIL VEHICLE', conf: '98.1%', status: 'PASS', color: '#10b981', location: 'CAM-05 Kuningan' },
        { plate: 'B 8821 WXY', type: 'TAXI CAB', conf: '97.6%', status: 'PASS', color: '#71717a', location: 'CAM-01 HQ Lobby' },
        { plate: 'B 1940 PQR', type: 'CARGO TRUCK', conf: '96.8%', status: 'PASS', color: '#71717a', location: 'CAM-03 Monas' },
        { plate: 'B 1092 RFS', type: 'TARGET MATCH', conf: '99.4%', status: 'RE-LOCKED', color: '#ef4444', location: 'CAM-02 Sudirman' }
    ];

    let html = '';
    MOCK_PLATES.slice(0, 4).forEach(item => {
        html += createPlateLogHtml(item);
    });
    streamContainer.innerHTML = html;

    let pIdx = 0;
    cctvOCRInterval = setInterval(() => {
        const item = MOCK_PLATES[pIdx % MOCK_PLATES.length];
        pIdx++;

        const div = document.createElement('div');
        div.innerHTML = createPlateLogHtml(item);
        const child = div.firstElementChild;
        child.style.opacity = '0';
        child.style.transform = 'translateX(-10px)';
        child.style.transition = 'all 0.3s ease';

        streamContainer.insertBefore(child, streamContainer.firstChild);

        setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateX(0)';
        }, 20);

        if (streamContainer.children.length > 8) {
            streamContainer.removeChild(streamContainer.lastChild);
        }
    }, 2800);
}

function createPlateLogHtml(item) {
    return `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:#0a0a0c; border:1px solid #1f1f24; border-radius:4px; border-left:3px solid ${item.color};">
        <div>
            <strong style="color:${item.color}; font-family:monospace; font-size:12px;">${item.plate}</strong>
            <span style="font-size:10px; color:#a1a1aa; margin-left:6px;">${item.location}</span>
        </div>
        <div style="font-size:10px; font-weight:800; color:${item.color};">
            ${item.conf} Match
        </div>
    </div>
    `;
}

function toggleCamThermal(canvasId) {
    cctvThermalState[canvasId] = !cctvThermalState[canvasId];
}

function toggleAllCCTVThermal() {
    const keys = Object.keys(cctvThermalState);
    const anyOff = keys.some(k => !cctvThermalState[k]);
    keys.forEach(k => {
        cctvThermalState[k] = anyOff;
    });
    alert(`Thermal IR Vision Mode ${anyOff ? 'ACTIVATED' : 'DEACTIVATED'} across all 6 camera channels!`);
}

function triggerCCTVAIRecog() {
    alert('AI Facial Biometric Scan dispatched across all active camera matrix channels!\n\nSubject #TS-0921 locked on CAM-02 Sudirman Flyover with 99.4% confidence.');
}

function controlPTZ(action) {
    alert(`PTZ Control Command [${action}] dispatched to CAM-02 PTZ Servo Head!\nCamera viewport re-aligned to tracking vector.`);
}

function focusCameraTile(tileId) {
    const tile = document.getElementById(tileId);
    if (tile) {
        tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
        tile.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.8)';
        setTimeout(() => {
            tile.style.boxShadow = 'none';
        }, 3000);
    }
}

// ── Cinematic Splash Screen Handler ──────────────────────────────────────────

function dismissSplash() {
    const splash = document.getElementById('sphere-splash');
    if (splash) {
        splash.classList.add('splash-exit');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 700);
    }
}







