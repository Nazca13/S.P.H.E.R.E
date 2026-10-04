/* ==========================================================================
   S.P.H.E.R.E — GRAPH ENGINE (TIER-1)
   D3.js v7 Force Simulation | Canvas Renderer | HUD Controls | Drawer
   ========================================================================== */

let graphInitialized = false;

function initNetworkGraph() {
    if (graphInitialized) return;
    graphInitialized = true;
    setupSimulation();
    updateHUDStats();
}

let nodes = JSON.parse(JSON.stringify(rawNodes));
let links = JSON.parse(JSON.stringify(rawLinks));

let canvas, ctx, width, height;
let simulation;
let transform = d3.zoomIdentity;
let selectedNode = null;
let hoveredNode = null;
let activeFilter = 'all';
let searchQuery = '';
let showLabels = true;

let chargeForce = -300;
let linkDistance = 100;
let collideRadius = 30;

function initOrResizeCanvas() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    canvas = document.getElementById('graph-canvas');
    width = container.clientWidth;
    height = container.clientHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
}

function setupSimulation() {
    initOrResizeCanvas();

    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(linkDistance))
        .force('charge', d3.forceManyBody().strength(chargeForce))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(d => (d.radius || 18) + collideRadius / 2))
        .on('tick', render);

    // Zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.2, 5])
        .on('zoom', (event) => {
            transform = event.transform;
            render();
        });

    d3.select(canvas)
        .call(zoom)
        .on('dblclick.zoom', null);

    // Drag behavior
    d3.select(canvas).call(
        d3.drag()
            .subject(dragSubject)
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded)
    );

    // Pointer hover & click handlers
    d3.select(canvas)
        .on('mousemove', handleMouseMove)
        .on('click', handleClick);

    window.addEventListener('resize', () => {
        initOrResizeCanvas();
        simulation.force('center', d3.forceCenter(width / 2, height / 2));
        simulation.alpha(0.2).restart();
    });
}

function dragSubject(event) {
    const point = transform.invert([event.x, event.y]);
    return findNodeAt(point[0], point[1]);
}

function dragStarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}

function dragged(event) {
    const point = transform.invert([event.x, event.y]);
    event.subject.fx = point[0];
    event.subject.fy = point[1];
}

function dragEnded(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}

function findNodeAt(x, y) {
    for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (!isNodeVisible(node)) continue;
        const dx = x - node.x;
        const dy = y - node.y;
        const r = node.radius || 18;
        if (dx * dx + dy * dy < r * r) {
            return node;
        }
    }
    return null;
}

function isNodeVisible(node) {
    if (activeFilter !== 'all' && node.type !== activeFilter) return false;
    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return node.name.toLowerCase().includes(q) || node.category.toLowerCase().includes(q);
    }
    return true;
}

function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const point = transform.invert([mouseX, mouseY]);
    const node = findNodeAt(point[0], point[1]);

    if (node !== hoveredNode) {
        hoveredNode = node;
        canvas.style.cursor = node ? 'pointer' : 'grab';
        render();
    }
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const point = transform.invert([mouseX, mouseY]);
    const node = findNodeAt(point[0], point[1]);

    if (node) {
        selectedNode = node;
        openEntityDrawer(node);
    } else {
        selectedNode = null;
        closeEntityDrawer();
    }
    render();
}

function openEntityDrawer(node) {
    const drawer = document.getElementById('entity-drawer');
    const title = document.getElementById('drawer-title');
    const category = document.getElementById('drawer-category');
    const typeBadge = document.getElementById('drawer-type-badge');
    const bio = document.getElementById('drawer-bio');
    const badgeList = document.getElementById('platform-badge-list');
    const statsEl = document.getElementById('drawer-stats');

    if (!drawer) return;

    title.innerText = node.name;
    category.innerText = node.category;
    typeBadge.innerText = node.type.toUpperCase() + ' ENTITY';
    typeBadge.style.color = node.color || '#ec4899';
    bio.innerText = node.bio || 'Entity node mapped in the cross-platform virality monitoring graph.';

    // Metrics
    if (statsEl) {
        const connectedLinks = links.filter(l => l.source.id === node.id || l.target.id === node.id);
        statsEl.innerHTML = `
            <div class="stat-item">
                <span class="stat-val" style="color:${node.color || '#3b82f6'}">${connectedLinks.length}</span>
                <span class="stat-lbl">Links</span>
            </div>
            <div class="stat-item">
                <span class="stat-val" style="color:var(--text-primary)">${node.influence || 'N/A'}</span>
                <span class="stat-lbl">Influence</span>
            </div>
            <div class="stat-item">
                <span class="stat-val" style="color:var(--text-primary)">${node.followers || '—'}</span>
                <span class="stat-lbl">Reach</span>
            </div>
        `;
    }

    badgeList.innerHTML = '';

    if (node.type === 'person' && node.platforms) {
        const platformDefs = [
            { key: 'linkedin',  label: 'LinkedIn',    icon: 'ph-bold ph-linkedin-logo',  color: '#0a66c2', desc: 'Professional Profile' },
            { key: 'tiktok',   label: 'TikTok',      icon: 'ph-bold ph-tiktok-logo',    color: '#69c9d0', desc: 'Short-Form Video' },
            { key: 'instagram', label: 'Instagram',  icon: 'ph-bold ph-instagram-logo', color: '#e1306c', desc: 'Visual Feed & Reels' },
            { key: 'x',        label: 'X (Twitter)', icon: 'ph-bold ph-x-logo',         color: '#c0c8d8', desc: 'Microblogging' },
            { key: 'youtube',  label: 'YouTube',     icon: 'ph-bold ph-youtube-logo',   color: '#ff0000', desc: 'Long-Form Channel' }
        ];

        platformDefs.forEach(p => {
            const hasAccount = node.platforms[p.key] === true;
            const row = document.createElement('div');
            row.className = 'platform-row';
            row.innerHTML = `
                <i class="${p.icon}" style="color:${hasAccount ? p.color : '#3a3f52'}; font-size:20px;"></i>
                <div class="platform-row-info">
                    <div class="platform-row-name" style="color:${hasAccount ? '#e2e8f0' : '#545b72'}">${p.label}</div>
                    <div class="platform-row-desc">${p.desc}</div>
                </div>
                <span class="platform-status ${hasAccount ? 'status-active' : 'status-inactive'}">
                    ${hasAccount ? '<i class="ph ph-check-circle"></i> Active' : '<i class="ph ph-minus-circle"></i> None'}
                </span>
            `;
            badgeList.appendChild(row);
        });
    } else {
        const connectedLinks = links.filter(l => l.source.id === node.id || l.target.id === node.id);
        const row = document.createElement('div');
        row.className = 'platform-row';
        row.innerHTML = `
            <i class="ph-bold ph-share-network" style="color:${node.color || '#3b82f6'}; font-size:20px;"></i>
            <div class="platform-row-info">
                <div class="platform-row-name">Graph Connections</div>
                <div class="platform-row-desc">Direct topology edges</div>
            </div>
            <span class="platform-status status-active">${connectedLinks.length} edges</span>
        `;
        badgeList.appendChild(row);
    }

    drawer.classList.add('open');
}

function closeEntityDrawer() {
    const drawer = document.getElementById('entity-drawer');
    if (drawer) drawer.classList.remove('open');
    selectedNode = null;
    render();
}

function resetGraphView() {
    transform = d3.zoomIdentity;
    if (simulation) simulation.alpha(0.4).restart();
    render();
}

function focusNodeInGraph(nodeId) {
    switchView('view-network-graph');
    setTimeout(() => {
        const targetNode = nodes.find(n => n.id === nodeId);
        if (targetNode) {
            selectedNode = targetNode;
            openEntityDrawer(targetNode);
            if (targetNode.x && targetNode.y) {
                transform = d3.zoomIdentity.translate(width / 2 - targetNode.x * 1.2, height / 2 - targetNode.y * 1.2).scale(1.2);
            }
            if (simulation) simulation.alpha(0.3).restart();
            render();
        }
    }, 100);
}

// Main Render Loop
function render() {
    if (!ctx) return;
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#0a0b0f';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 0.5;
    const gridSize = 50 * transform.k;
    const offsetX = transform.x % gridSize;
    const offsetY = transform.y % gridSize;
    for (let x = offsetX; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // Determine active/connected node set if selected/hovered
    const activeFocusNode = selectedNode || hoveredNode;
    let connectedNodeIds = new Set();
    if (activeFocusNode) {
        connectedNodeIds.add(activeFocusNode.id);
        links.forEach(l => {
            if (l.source.id === activeFocusNode.id) connectedNodeIds.add(l.target.id);
            if (l.target.id === activeFocusNode.id) connectedNodeIds.add(l.source.id);
        });
    }

    // Draw Links (Edges)
    links.forEach(l => {
        if (!isNodeVisible(l.source) || !isNodeVisible(l.target)) return;

        const isConnectedToFocus = activeFocusNode && (l.source.id === activeFocusNode.id || l.target.id === activeFocusNode.id);
        
        ctx.beginPath();
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);

        if (activeFocusNode) {
            ctx.strokeStyle = isConnectedToFocus ? 'rgba(56, 189, 248, 0.8)' : 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = isConnectedToFocus ? 2.5 : 0.8;
        } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1.2;
        }
        ctx.stroke();
    });

    // Draw Nodes
    nodes.forEach(node => {
        if (!isNodeVisible(node)) return;

        const isFocus = activeFocusNode && activeFocusNode.id === node.id;
        const isNeighbor = activeFocusNode && connectedNodeIds.has(node.id);
        const isDimmed = activeFocusNode && !connectedNodeIds.has(node.id);

        const r = node.radius || 18;

        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.2 : 1.0;

        // Node Glow on Hover/Select
        if (isFocus || isNeighbor) {
            ctx.shadowColor = node.color || '#ec4899';
            ctx.shadowBlur = 20;
        }

        // Node Circle Fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = node.color || '#a855f7';
        ctx.fill();

        // Node Border Ring
        ctx.lineWidth = isFocus ? 3.5 : 2;
        ctx.strokeStyle = isFocus ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
        ctx.stroke();

        ctx.restore();

        // Node Labels
        if (showLabels && !isDimmed) {
            ctx.save();
            ctx.globalAlpha = isDimmed ? 0.2 : 1.0;
            ctx.font = `${isFocus ? 'bold 12px' : '11px'} -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';

            let labelText = node.name;
            if (labelText.length > 28 && !isFocus) {
                labelText = labelText.substring(0, 26) + '...';
            }

            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 4;
            ctx.fillText(labelText, node.x, node.y + r + 15);
            ctx.restore();
        }
    });

    ctx.restore();
}

// ── HUD Stats
function updateHUDStats() {
    const nodeEl = document.getElementById('hud-nodes');
    const linkEl = document.getElementById('hud-links');
    const clusterEl = document.getElementById('hud-clusters');
    if (nodeEl) nodeEl.textContent = nodes.length;
    if (linkEl) linkEl.textContent = links.length;
    if (clusterEl) {
        const types = new Set(nodes.map(n => n.type));
        clusterEl.textContent = types.size;
    }
}

// ── Zoom helper (for buttons)
let zoomBehavior;

function setupZoomButtons() {
    const zoomIn = document.getElementById('zoom-in-btn');
    const zoomOut = document.getElementById('zoom-out-btn');
    const fullscreen = document.getElementById('fullscreen-btn');

    const doZoom = (factor) => {
        transform = transform.scale(factor);
        render();
    };

    zoomIn?.addEventListener('click', () => doZoom(1.3));
    zoomOut?.addEventListener('click', () => doZoom(0.77));
    fullscreen?.addEventListener('click', () => {
        const wrapper = document.getElementById('graph-wrapper');
        if (!document.fullscreenElement) {
            wrapper?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
}

// ── Event Listeners ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('drawer-close-btn')?.addEventListener('click', closeEntityDrawer);

    document.getElementById('gear-toggle-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('settings-popover')?.classList.toggle('show');
    });

    document.getElementById('close-popover-btn')?.addEventListener('click', () => {
        document.getElementById('settings-popover')?.classList.remove('show');
    });

    document.addEventListener('click', (e) => {
        const popover = document.getElementById('settings-popover');
        const gearBtn = document.getElementById('gear-toggle-btn');
        if (popover && !popover.contains(e.target) && e.target !== gearBtn) {
            popover.classList.remove('show');
        }
    });

    document.getElementById('slider-charge')?.addEventListener('input', (e) => {
        chargeForce = +e.target.value;
        document.getElementById('val-charge').innerText = chargeForce;
        if (simulation) {
            simulation.force('charge', d3.forceManyBody().strength(chargeForce));
            simulation.alpha(0.3).restart();
        }
    });

    document.getElementById('slider-distance')?.addEventListener('input', (e) => {
        linkDistance = +e.target.value;
        document.getElementById('val-distance').innerText = linkDistance;
        if (simulation) {
            simulation.force('link').distance(linkDistance);
            simulation.alpha(0.3).restart();
        }
    });

    document.getElementById('slider-collide')?.addEventListener('input', (e) => {
        collideRadius = +e.target.value;
        document.getElementById('val-collide').innerText = collideRadius;
        if (simulation) {
            simulation.force('collide').radius(d => (d.radius || 18) + collideRadius / 2);
            simulation.alpha(0.3).restart();
        }
    });

    document.getElementById('check-labels')?.addEventListener('change', (e) => {
        showLabels = e.target.checked;
        render();
    });

    document.getElementById('graph-search-input')?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
    });

    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            activeFilter = this.getAttribute('data-filter');
            render();
        });
    });

    setupZoomButtons();
});
