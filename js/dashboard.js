/* ==========================================================================
   PULSEHQ — DASHBOARD.JS
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
    if (viewId === 'view-network-graph' && typeof initNetworkGraph === 'function') {
        setTimeout(() => initNetworkGraph(), 60);
    } else if (viewId === 'view-geo-intelligence') {
        setTimeout(() => initGeoMap(), 60);
    } else if (viewId === 'view-sov-matrix') {
        setTimeout(() => initSOVMatrixCharts(), 60);
    } else if (viewId === 'view-report-builder') {
        setTimeout(() => initReportPreviewChart(), 60);
    } else if (viewId === 'view-account-investigation') {
        setTimeout(() => initAccountInvestigation(), 60);
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
    alert('Generating PDF Document... Downloading "PulseHQ_Executive_Report_Indocorp.pdf"');
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

function initAccountInvestigation() {
    initBotGaugeChart();
    renderBehavioralHeatmap();
    initInvestigationGraph();
}

let invNodesData = [];
let invLinksData = [];
let activeInspectedNode = null;

function initInvestigationGraph() {
    const canvas = document.getElementById('investigation-graph-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 600;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // 1. Central Target Node (@buzz_master_id)
    const targetNode = {
        id: 'target',
        name: '@buzz_master_id',
        type: 'TARGET_ACCOUNT',
        color: '#f43f5e',
        radius: 36,
        x: width / 2,
        y: height / 2,
        fx: width / 2, // Fixed center
        fy: height / 2,
        detail: 'Primary investigated handle. High Bot Probability (87%). Proxy IP Node in Jakarta.'
    };

    // 2. 6 Radial Forensic Hubs (Cabang Bedah Tuntas)
    const hubs = [
        { id: 'hub_syndicate', name: '1. Buzzer Syndicate Ring', color: '#ef4444', radius: 24, detail: '28 coordinated bot accounts. Retweet sync lag: 0.4 seconds.' },
        { id: 'hub_identity', name: '2. Cross-Platform Footprint', color: '#3b82f6', radius: 24, detail: '5 matching digital profiles across TikTok, IG, Telegram, Reddit.' },
        { id: 'hub_vectors', name: '3. Campaign Attack Target', color: '#f59e0b', radius: 24, detail: 'Target brand: BrandX. Hashtag spam: #BrandGagal (120 post/hr).' },
        { id: 'hub_alias', name: '4. Historical Alias Vault', color: '#8b5cf6', radius: 24, detail: 'Repurposed from quote farm account @galau_quotes_indo.' },
        { id: 'hub_behavior', name: '5. Behavioral Automation', color: '#ec4899', radius: 24, detail: '24/7 continuous posting without human sleep gap (02-05 WIB).' },
        { id: 'hub_deleted', name: '6. Deleted Content Archive', color: '#10b981', radius: 24, detail: '2 deleted posts cached by system before removal. Phishing link flagged.' },
    ];

    // 3. Sub-nodes branching out from hubs
    const leafNodes = [
        // Hub 1 (Syndicate)
        { id: 'leaf_bot1', hub: 'hub_syndicate', name: '@ring_node_alpha', color: '#f87171', radius: 15, detail: 'Sub-bot node executing instant retweets.' },
        { id: 'leaf_bot2', hub: 'hub_syndicate', name: '@polit_bot_09', color: '#f87171', radius: 15, detail: 'Content mirroring bot registered Jan 2026.' },
        
        // Hub 2 (Footprint)
        { id: 'leaf_id1', hub: 'hub_identity', name: 'TikTok: @buzz_master_off', color: '#60a5fa', radius: 15, detail: 'Matching bio link & avatar fingerprint (94% confidence).' },
        { id: 'leaf_id2', hub: 'hub_identity', name: 'Telegram: @buzz_syndicate', color: '#60a5fa', radius: 15, detail: 'Broadcast channel with 1,400 members.' },
        
        // Hub 3 (Attack Vectors)
        { id: 'leaf_v1', hub: 'hub_vectors', name: 'Target: BrandX', color: '#fbbf24', radius: 15, detail: 'Primary target of negative sentiment campaign.' },
        { id: 'leaf_v2', hub: 'hub_vectors', name: '#BrandGagal Tag', color: '#fbbf24', radius: 15, detail: 'Spam hashtag amplified by click farm.' },

        // Hub 4 (Alias)
        { id: 'leaf_a1', hub: 'hub_alias', name: '@galau_quotes_indo', color: '#a78bfa', radius: 15, detail: 'Previous handle used until Sep 2026.' },
        { id: 'leaf_a2', hub: 'hub_alias', name: '@kpop_giveaway_store', color: '#a78bfa', radius: 15, detail: 'Original account creation handle in 2025.' },

        // Hub 5 (Behavior)
        { id: 'leaf_b1', hub: 'hub_behavior', name: 'StyleGAN AI Avatar', color: '#f472b6', radius: 15, detail: 'Synthetic face fingerprint matched by AI vision classifier.' },

        // Hub 6 (Deleted)
        { id: 'leaf_d1', hub: 'hub_deleted', name: 'Cached Post #8819', color: '#34d399', radius: 15, detail: 'Deleted tweet calling for regulator audit.' },
    ];

    invNodesData = [targetNode, ...hubs, ...leafNodes];

    invLinksData = [
        ...hubs.map(h => ({ source: 'target', target: h.id, value: 3, label: 'FORENSIC VECTOR' })),
        ...leafNodes.map(l => ({ source: l.hub, target: l.id, value: 1.5, label: 'SUB-BRANCH' }))
    ];

    if (investigationGraphSim) investigationGraphSim.stop();
    if (typeof d3 === 'undefined') return;

    investigationGraphSim = d3.forceSimulation(invNodesData)
        .force('link', d3.forceLink(invLinksData).id(d => d.id).distance(d => d.source.id === 'target' ? 165 : 75))
        .force('charge', d3.forceManyBody().strength(-350))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(d => d.radius + 18))
        .on('tick', renderInvestigationCanvas);

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

    window.onmouseup = () => {
        if (draggedNode) {
            if (draggedNode.id !== 'target') {
                draggedNode.fx = null;
                draggedNode.fy = null;
            }
            draggedNode = null;
            investigationGraphSim.alphaTarget(0);
        }
    };

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



