import { getToken } from './auth.js';
import { apiRequest } from './api.js';
import { showToast } from './toast.js';

/**
 * Global Interactive Status Badge Manager
 * Handles mouse click, touch, and keyboard (Enter/Space) on all status badges.
 */
export function initBadgeInteractivity() {
  // Global event delegation for all badge clicks
  document.body.addEventListener('click', handleBadgeClick);
  document.body.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('badge')) {
      e.preventDefault();
      handleBadgeClick(e);
    }
  });

  ensureBadgeModalContainer();
}

function createRipple(e, badge) {
  const circle = document.createElement('span');
  const diameter = Math.max(badge.clientWidth, badge.clientHeight);
  const radius = diameter / 2;

  const rect = badge.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${(e.clientX || rect.left + radius) - rect.left - radius}px`;
  circle.style.top = `${(e.clientY || rect.top + radius) - rect.top - radius}px`;
  circle.classList.add('ripple');

  const existingRipple = badge.getElementsByClassName('ripple')[0];
  if (existingRipple) {
    existingRipple.remove();
  }

  badge.appendChild(circle);
}

function handleBadgeClick(e) {
  const badge = e.target.closest('.badge');
  if (!badge) return;

  createRipple(e, badge);

  const text = badge.textContent.trim().toUpperCase();
  const dataRegion = badge.dataset.region || badge.getAttribute('data-region') || 'Zaporizhzhia Nuclear Perimeter';

  if (text.includes('BREACH')) {
    openBreachModal(dataRegion, badge);
  } else if (text.includes('CLEAR')) {
    openClearModal(dataRegion, badge);
  } else if (text.includes('YES (FLAGGED)') || text.includes('FLAGGED')) {
    openFlaggedModal(dataRegion, badge);
  } else if (text.includes('CRITICAL') || text.includes('HIGH')) {
    openBreachModal(dataRegion, badge);
  } else if (text.includes('MEDIUM') || text.includes('LOW') || text.includes('VERIFIED')) {
    openClearModal(dataRegion, badge);
  }
}

function ensureBadgeModalContainer() {
  if (document.getElementById('badge-interactive-modal')) return;

  const modalHtml = `
    <div class="modal-overlay" id="badge-interactive-modal" style="z-index: 2000;">
      <div class="modal-container" style="max-width: 650px;">
        <div class="modal-header">
          <h3 id="badge-modal-title"><i class="fas fa-shield-halved text-cyan"></i> Status Badge Intelligence Details</h3>
          <button class="close-modal" id="close-badge-modal">&times;</button>
        </div>
        <div id="badge-modal-body" style="font-size: 13px;"></div>
        <div class="modal-footer" id="badge-modal-footer" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end; gap: 12px;"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  document.getElementById('close-badge-modal').addEventListener('click', () => {
    document.getElementById('badge-interactive-modal').classList.remove('active');
  });
}

function openBreachModal(region, badge) {
  const modal = document.getElementById('badge-interactive-modal');
  const title = document.getElementById('badge-modal-title');
  const body = document.getElementById('badge-modal-body');
  const footer = document.getElementById('badge-modal-footer');

  title.innerHTML = `<i class="fas fa-triangle-exclamation text-red glow-text-red"></i> BREACH INCIDENT DETAILS: ${region}`;

  body.innerHTML = `
    <div style="padding: 14px; background: rgba(255, 0, 85, 0.1); border: 1px solid var(--accent-red); border-radius: 8px; margin-bottom: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="color: #fff; font-size: 15px;">Demilitarized Zone Violation Flagged</strong>
        <span class="badge badge-critical">CRITICAL RISK (92%)</span>
      </div>
      <p style="color: var(--text-muted); font-size: 12px; margin: 0;">Heavy artillery impacts and armored vehicle movements detected breaching exclusion perimeter.</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <div><strong>Target Sector:</strong> ${region}</div>
      <div><strong>Timestamp:</strong> ${new Date().toLocaleString()}</div>
      <div><strong>Status:</strong> Active Breach Logged</div>
      <div><strong>AI Radar Match:</strong> 94.2% Confidence</div>
    </div>

    <div style="margin-bottom: 16px;">
      <strong style="display:block; margin-bottom:6px;">Satellite Synthetic Aperture Radar Evidence:</strong>
      <img src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; border: 1px solid var(--accent-red);">
    </div>
  `;

  footer.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('badge-interactive-modal').classList.remove('active')">Close</button>
    <button class="btn btn-primary" id="btn-badge-full-details"><i class="fas fa-microchip"></i> View Full Details</button>
  `;

  modal.classList.add('active');

  document.getElementById('btn-badge-full-details').addEventListener('click', async () => {
    modal.classList.remove('active');
    const countryName = region.split(' ')[0];
    window.location.href = `/map.html?country=${encodeURIComponent(countryName)}`;
  });
}

function openClearModal(region, badge) {
  const modal = document.getElementById('badge-interactive-modal');
  const title = document.getElementById('badge-modal-title');
  const body = document.getElementById('badge-modal-body');
  const footer = document.getElementById('badge-modal-footer');

  title.innerHTML = `<i class="fas fa-shield-check text-green"></i> COMPLIANCE STATUS: ${region}`;

  body.innerHTML = `
    <div style="padding: 14px; background: rgba(0, 230, 118, 0.1); border: 1px solid var(--accent-green); border-radius: 8px; margin-bottom: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="color: #fff; font-size: 15px;">NO VIOLATION DETECTED</strong>
        <span class="badge badge-low">STATUS: CLEAR</span>
      </div>
      <p style="color: var(--text-muted); font-size: 12px; margin: 0;">Continuous orbital satellite radar monitoring confirms zero demilitarized buffer zone incursions.</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <div><strong>Target Sector:</strong> ${region}</div>
      <div><strong>Last Scan Time:</strong> ${new Date().toLocaleString()}</div>
      <div><strong>Monitoring Protocol:</strong> 24/7 Active Orbital Swarm</div>
      <div><strong>Safety Rating:</strong> 98.4% Compliant</div>
    </div>
  `;

  footer.innerHTML = `
    <button class="btn btn-primary" onclick="document.getElementById('badge-interactive-modal').classList.remove('active')">Close Panel</button>
  `;

  modal.classList.add('active');
}

function openFlaggedModal(region, badge) {
  const modal = document.getElementById('badge-interactive-modal');
  const title = document.getElementById('badge-modal-title');
  const body = document.getElementById('badge-modal-body');
  const footer = document.getElementById('badge-modal-footer');

  title.innerHTML = `<i class="fas fa-radiation text-red glow-text-red"></i> BUFFER ZONE BREACH REPORT: ${region}`;

  body.innerHTML = `
    <div style="padding: 14px; background: rgba(255, 0, 85, 0.15); border: 1px solid var(--accent-red); border-radius: 8px; margin-bottom: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="color: #fff; font-size: 15px;">YES (FLAGGED) — Buffer Zone Incursion</strong>
        <span class="badge badge-critical">CONFIDENCE: 94.2%</span>
      </div>
      <p style="color: var(--text-muted); font-size: 12px; margin: 0;">Military hardware detected inside 3km exclusion safety ring surrounding nuclear infrastructure.</p>
    </div>

    <div style="margin-bottom: 14px;">
      <strong>AI Threat Analysis:</strong>
      <p style="color: var(--text-muted); font-size: 12px; background: rgba(255,255,255,0.04); padding: 10px; border-radius: 6px; margin-top: 4px;">
        Object detection algorithm classified 6 heavy armored tanks, 4 mobile artillery batteries, and 2 field fortification sectors within the non-combat perimeter.
      </p>
    </div>

    <div style="margin-bottom: 14px;">
      <strong>Recommended Tactical Actions:</strong>
      <ul style="color: var(--text-muted); font-size: 12px; margin-top: 4px; padding-left: 20px;">
        <li>• Issue formal notification to UN Security Council Observation Desk</li>
        <li>• Increase synthetic aperture radar satellite revisit frequency to 15-minute intervals</li>
        <li>• Dispatch field observer verification team</li>
      </ul>
    </div>
  `;

  footer.innerHTML = `
    <button class="btn btn-secondary" onclick="document.getElementById('badge-interactive-modal').classList.remove('active')">Dismiss</button>
    <button class="btn btn-danger" id="btn-badge-download-pdf"><i class="fas fa-file-pdf"></i> Download PDF Report</button>
  `;

  modal.classList.add('active');

  document.getElementById('btn-badge-download-pdf').addEventListener('click', () => {
    const token = getToken();
    window.open(`/api/v1/reports/rep_001/download?token=${token}`, '_blank');
    showToast('Streaming PDF Report for Buffer Zone Breach', 'success');
  });
}
