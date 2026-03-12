/* ================================================================
   FLOW PARK RESIDENCE — SPA Presentation Controller
   Navigation · Animations · Amenities · Master Plan · Unit Explorer
================================================================ */

'use strict';

/* ── STATE ──────────────────────────────────────────────────── */
const TOTAL_SLIDES = 15;
let currentSlide = 0;
let isAnimating  = false;
let touchStartX  = 0;
let touchStartY  = 0;
let touchStartT  = 0;


/* ================================================================
   AMENITIES DATA
================================================================ */
const AMENITIES = [
  {
    name: 'Swimming Pool',
    img: 'publication-web-resources/image/weibian9417_A_serene_morning_park_scene_dewy_grass_lawn_lush_gr_283c310b-fb64-4a22-967f-672334db6b1a.png',
    desc: 'A stunning swimming pool designed for relaxation and recreation, surrounded by lush greenery and premium landscaping.'
  },
  {
    name: "Kids' Play Area",
    img: 'publication-web-resources/image/ewsdymkjv45_There_are_several_children_playing_happily_in_a_hug_d08cfcf5-45f5-483a-99c0-5333f0350883_Topaz_Bloom_2x_scale.png',
    desc: "A dedicated safe and vibrant playground for children, designed with modern equipment and secure, soft-surface zones."
  },
  {
    name: 'Spa & Wellness',
    img: 'publication-web-resources/image/hellofernando_japanese_luxury_spa_interior_wide_angle_indoor_po_8aa1fdd4-1e2f-4044-bade-28fdcdcbff8e.png',
    desc: 'A premium spa and wellness center offering a full range of treatments in a serene, minimalist environment.'
  },
  {
    name: 'Commercial Mall',
    img: 'publication-web-resources/image/neurobober_A_wide-angle_high-key_photograph_of_a_shopping_mall__16b9b635-070c-4f9d-b9fd-c1820f4fbf10_Topaz_Bloom_2x_scale.png',
    desc: 'An integrated commercial hub featuring retail, dining, and services — all within the community.'
  },
  {
    name: 'Running Track',
    img: 'publication-web-resources/image/hsac_cr3_A_wide_scenic_view_of_an_outdoor_running_track_leading_1c07c8b0-0a8f-42e5-b49e-70a136a60832.png',
    desc: 'A scenic outdoor running and walking track weaving through the green landscape of Flow Park.'
  },
  {
    name: 'Sports Stadium',
    img: 'publication-web-resources/image/dreweu._General_view_pop_group_concert_in_a_stadium_in_the_fore_3ee70339-5fde-4888-a435-0bc56e30246c.png',
    desc: 'A multi-purpose stadium and sports area for community events, sports activities, and outdoor entertainment.'
  },
  {
    name: 'Smart Gate',
    img: 'publication-web-resources/image/yassin_httpss.mj.runlSjs5Ikpf18_A_row_of_modern_electric_vehi_ce2712af-901e-47b3-9b28-c861ac8c2db7_1.png',
    desc: 'State-of-the-art smart entry gates with EV charging stations and intelligent access control for residents.'
  },
  {
    name: 'Green River',
    img: 'publication-web-resources/image/leyang0401_An_isolated_green_leaf_floats_in_the_air_with_a_blur_7f1741a9-19d0-4d29-9429-ab4694f8466b.png',
    desc: 'A continuous green river and landscaped spine running through the project, providing fresh air and natural beauty.'
  },
  {
    name: 'Massage & Relaxation',
    img: 'publication-web-resources/image/zoe_a_beautiful_woman_is_lying_on_her_back_for_a_massage_with_w_d79ff7fb-e45b-435e-992d-fbeeab93d60b.png',
    desc: 'Dedicated relaxation and massage facilities within the wellness center for ultimate rest and rejuvenation.'
  },
  {
    name: 'Architecture',
    img: 'publication-web-resources/image/architecture_concept.png',
    desc: 'Modern architectural language blending height, function, and green experience through stepped forms and natural light.'
  }
];


/* ================================================================
   UNIT TYPES DATA
================================================================ */
const BUILDING_TYPES = [
  {
    id: 'typeA',
    name: 'Building Type A',
    desc: 'Ground + 5 Floors',
    img: 'publication-web-resources/image/hyperllama_98270_Ultra-reaalistic_8K_render_of_a_modern_high-ris_836d5a1f-b1fb-4076-9504-04b8635b3eff_(1).png',
    floors: ['Ground', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor'],
    units: [
      { name: 'Unit A1', area: 75, type: '1 Bedroom', img: 'publication-web-resources/image/R01.png' },
      { name: 'Unit A2', area: 95, type: '2 Bedroom', img: 'publication-web-resources/image/R03.png' },
      { name: 'Unit A3', area: 110, type: '2 Bedroom+', img: 'publication-web-resources/image/R01.png' }
    ]
  },
  {
    id: 'typeB',
    name: 'Building Type B',
    desc: 'Ground + 5 Floors',
    img: 'publication-web-resources/image/R01.png',
    floors: ['Ground', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor'],
    units: [
      { name: 'Unit B1', area: 80, type: '1 Bedroom', img: 'publication-web-resources/image/R03.png' },
      { name: 'Unit B2', area: 120, type: '2 Bedroom', img: 'publication-web-resources/image/R01.png' }
    ]
  },
  {
    id: 'typeC',
    name: 'Building Type C',
    desc: 'Ground + 5 Floors',
    img: 'publication-web-resources/image/R03.png',
    floors: ['Ground', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor'],
    units: [
      { name: 'Unit C1', area: 90, type: '2 Bedroom', img: 'publication-web-resources/image/R01.png' },
      { name: 'Unit C2', area: 130, type: '3 Bedroom', img: 'publication-web-resources/image/R03.png' }
    ]
  }
];
let selectedBuilding = null;
let selectedFloor    = 0;
let currentUnitsStep = 1;


/* ================================================================
   INIT
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildAmenitiesGrid();
  buildBuildingGrid();
  initCalculator(); // from calculator.js

  goToSlide(0, true);
  updateNavArrows();
  updateCounter();
  updateProgressBar();

  // Touch
  const pres = document.getElementById('presentation');
  pres.addEventListener('touchstart', onTouchStart, { passive: true });
  pres.addEventListener('touchend',   onTouchEnd,   { passive: true });

  // Keyboard
  document.addEventListener('keydown', onKeyDown);

  // Stagger partner logo animations
  staggerPartnerLogos();
});


/* ================================================================
   NAVIGATION
================================================================ */
function goToSlide(index, instant) {
  if (isAnimating || index < 0 || index >= TOTAL_SLIDES) return;
  if (index === currentSlide && !instant) return;

  isAnimating = true;

  const slides = document.querySelectorAll('.slide');
  const current = slides[currentSlide];
  const next    = slides[index];

  if (!instant) {
    const dir = index > currentSlide ? 1 : -1;
    current.style.transform = `translateX(${-60 * dir}px)`;
    current.style.opacity   = '0';
    current.style.pointerEvents = 'none';

    setTimeout(() => {
      current.classList.remove('active');
      current.style.transform = '';
      current.style.opacity   = '';
      current.style.pointerEvents = '';
    }, 420);
  } else {
    slides.forEach(s => {
      s.classList.remove('active');
      s.style.transform = '';
      s.style.opacity   = '';
    });
  }

  currentSlide = index;
  next.classList.add('active');

  setTimeout(() => {
    isAnimating = false;
    onSlideEnter(index);
  }, instant ? 0 : 450);

  updateNavArrows();
  updateCounter();
  updateProgressBar();
  updateNavHighlight();
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }


/* ── Slide enter hooks ── */
function onSlideEnter(index) {
  switch (index) {
    case 1:  animateStoryLines();    break;
    case 2:  animateCounters();      break;
    case 7:  animateMapPins();       break;
    case 10: animateMasterPlan();    break;
    case 13: staggerPartnerLogos();  break;
  }
}


/* ── Update UI ── */
function updateNavArrows() {
  const prev = document.getElementById('nav-prev');
  const next = document.getElementById('nav-next');
  prev.classList.toggle('hidden', currentSlide === 0);
  next.classList.toggle('hidden', currentSlide === TOTAL_SLIDES - 1);
}

function updateCounter() {
  const cur = String(currentSlide + 1).padStart(2, '0');
  document.getElementById('counter-cur').textContent = cur;
  document.getElementById('counter-tot').textContent = String(TOTAL_SLIDES).padStart(2, '0');
}

function updateProgressBar() {
  const pct = ((currentSlide) / (TOTAL_SLIDES - 1)) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
}

function updateNavHighlight() {
  document.querySelectorAll('.nav-link').forEach((el, i) => {
    el.classList.toggle('active-nav', i === currentSlide);
  });
}


/* ── Touch swipe ── */
function onTouchStart(e) {
  if (e.target.closest('input, select, button, .amenity-panel, .full-modal, .plan-btns, .floor-tabs, .building-grid, .amenities-grid')) return;
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
  touchStartT = Date.now();
}

function onTouchEnd(e) {
  if (e.target.closest('input, select, button, .amenity-panel, .full-modal, .plan-btns, .floor-tabs, .building-grid, .amenities-grid')) return;
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  const dt = Date.now() - touchStartT;
  // Horizontal swipe: min 40px, faster than 800ms, more horizontal than vertical
  if (Math.abs(dx) > 40 && dt < 800 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    if (dx < 0) nextSlide();
    else        prevSlide();
  }
}

/* ── Keyboard ── */
function onKeyDown(e) {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault(); nextSlide();
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault(); prevSlide();
  }
  if (e.key === 'Escape') closeAllModals();
}


/* ================================================================
   NAVIGATION MENU
================================================================ */
function toggleMenu() {
  const overlay = document.getElementById('nav-overlay');
  const toggle  = document.getElementById('menu-toggle');
  overlay.classList.toggle('open');
  toggle.classList.toggle('open');
}

function closeAllModals() {
  document.querySelectorAll('.full-modal').forEach(m => m.classList.remove('open'));
  closeAmenityPanel();
  const overlay = document.getElementById('nav-overlay');
  if (overlay.classList.contains('open')) toggleMenu();
}


/* ================================================================
   MODALS (Map & Master Plan zoom)
================================================================ */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}


/* ================================================================
   SLIDE 02 — STORY LINES ANIMATION
================================================================ */
function animateStoryLines() {
  const lines = document.querySelectorAll('#story-lines .story-line');
  lines.forEach(line => {
    line.classList.remove('visible');
  });
  lines.forEach(line => {
    const delay = parseInt(line.dataset.delay || 0);
    setTimeout(() => line.classList.add('visible'), delay + 200);
  });
}


/* ================================================================
   SLIDE 03 — COUNTER ANIMATION
================================================================ */
function animateCounters() {
  animateCounter('counter-years',    19,  1200);
  animateCounter('counter-projects', 100, 1600);
}

function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '0';
  const start = performance.now();
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


/* ================================================================
   SLIDE 08 — MAP PINS ANIMATION
================================================================ */
function animateMapPins() {
  const pins = document.querySelectorAll('#slide-location .map-pin');
  pins.forEach(pin => {
    pin.classList.remove('visible');
    const delay = parseInt(pin.dataset.delay || 0);
    setTimeout(() => pin.classList.add('visible'), delay + 300);
  });
}


/* ================================================================
   SLIDE 10 — AMENITIES GRID
================================================================ */
function buildAmenitiesGrid() {
  const grid = document.getElementById('amenities-grid');
  if (!grid) return;
  grid.innerHTML = '';
  AMENITIES.forEach((amenity, i) => {
    const card = document.createElement('div');
    card.className = 'amenity-card';
    card.innerHTML = `
      <div class="amenity-card-img" style="background-image:url('${amenity.img}')"></div>
      <div class="amenity-card-name">${amenity.name}</div>
    `;
    card.addEventListener('click', () => openAmenityPanel(i));
    grid.appendChild(card);
  });
}

function openAmenityPanel(index) {
  const amenity = AMENITIES[index];
  const panel   = document.getElementById('amenity-panel');
  document.getElementById('panel-img').src   = amenity.img;
  document.getElementById('panel-name').textContent = amenity.name;
  document.getElementById('panel-desc').textContent = amenity.desc;
  panel.classList.add('open');
}

function closeAmenityPanel() {
  document.getElementById('amenity-panel').classList.remove('open');
}


/* ================================================================
   SLIDE 11 — MASTER PLAN ANIMATION
================================================================ */
function animateMasterPlan() {
  const callouts = document.querySelectorAll('#slide-masterplan .mp-callout');
  callouts.forEach(c => c.classList.remove('visible'));
  callouts.forEach(c => {
    const delay = parseInt(c.dataset.delay || 0);
    setTimeout(() => c.classList.add('visible'), delay + 300);
  });
}


/* ================================================================
   SLIDE 12 — UNIT EXPLORER (3-STEP)
================================================================ */
function buildBuildingGrid() {
  const grid = document.getElementById('building-grid');
  if (!grid) return;
  grid.innerHTML = '';
  BUILDING_TYPES.forEach((bldg, i) => {
    const card = document.createElement('div');
    card.className = 'building-card';
    card.innerHTML = `
      <div class="building-card-img" style="background-image:url('${bldg.img}')"></div>
      <div class="building-card-info">
        <h4>${bldg.name}</h4>
        <span>${bldg.desc}</span>
      </div>
    `;
    card.addEventListener('click', () => selectBuilding(i));
    grid.appendChild(card);
  });
}

function selectBuilding(index) {
  selectedBuilding = BUILDING_TYPES[index];
  selectedFloor    = 0;

  document.getElementById('units-bldg-title').textContent = selectedBuilding.name + ' — Floor Plans';
  buildFloorTabs();
  updateFloorPlan();
  unitsGoStep(2);
}

function buildFloorTabs() {
  const tabs = document.getElementById('floor-tabs');
  tabs.innerHTML = '';
  selectedBuilding.floors.forEach((floor, i) => {
    const btn = document.createElement('button');
    btn.className = 'floor-tab' + (i === 0 ? ' active' : '');
    btn.textContent = floor;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.floor-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      selectedFloor = i;
      updateFloorPlan();
    });
    tabs.appendChild(btn);
  });
}

function updateFloorPlan() {
  // Rotate through placeholder images for different floors
  const imgs = ['publication-web-resources/image/R01.png', 'publication-web-resources/image/R03.png'];
  const img  = document.getElementById('floor-plan-img');
  if (img) img.src = imgs[selectedFloor % imgs.length];
}

function unitsGoStep(step) {
  const steps = [1, 2, 3].map(n => document.getElementById('units-step-' + n));
  steps.forEach((s, i) => {
    if (!s) return;
    s.classList.toggle('active-step', i + 1 === step);
  });
  currentUnitsStep = step;

  if (step === 3) buildUnitDetail();
}

function buildUnitDetail() {
  if (!selectedBuilding) return;
  const container = document.getElementById('unit-detail');
  if (!container) return;

  const units = selectedBuilding.units;
  // Show first unit by default
  const unit = units[0];

  container.innerHTML = `
    <img src="${unit.img}" alt="${unit.name}" class="unit-detail-img">
    <div class="unit-detail-info">
      <h3>${unit.name}</h3>
      <div class="unit-detail-stats">
        <div class="unit-stat">
          <span class="unit-stat-val">${unit.area}</span>
          <span class="unit-stat-lbl">Area (m²)</span>
        </div>
        <div class="unit-stat">
          <span class="unit-stat-val">${unit.type}</span>
          <span class="unit-stat-lbl">Type</span>
        </div>
      </div>
      <div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap;">
        ${units.map((u, i) => `
          <button onclick="showUnit(${i})"
            class="floor-tab ${i === 0 ? 'active' : ''}"
            id="unit-btn-${i}">${u.name}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function showUnit(index) {
  if (!selectedBuilding) return;
  const unit = selectedBuilding.units[index];
  const container = document.getElementById('unit-detail');
  if (!container) return;

  const img = container.querySelector('.unit-detail-img');
  if (img) img.src = unit.img;
  const infoH3 = container.querySelector('.unit-detail-info h3');
  if (infoH3) infoH3.textContent = unit.name;

  const stats = container.querySelectorAll('.unit-stat-val');
  if (stats[0]) stats[0].textContent = unit.area;
  if (stats[1]) stats[1].textContent = unit.type;

  container.querySelectorAll('[id^="unit-btn-"]').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}


/* ================================================================
   SLIDE 14 — PARTNERS STAGGER
================================================================ */
function staggerPartnerLogos() {
  const logos = document.querySelectorAll('.partner-logo');
  logos.forEach((logo, i) => {
    logo.style.animationDelay = (i * 60) + 'ms';
  });
}


/* ================================================================
   VIDEO (Slide 05)
================================================================ */
function playVideo() {
  // Placeholder: alert until video is provided
  alert('Video file not yet provided.\n\nTo add video, open index.html and follow the instructions in the comment inside #slide-video.');
}
