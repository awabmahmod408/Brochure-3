/* ================================================================
   FLOW PARK RESIDENCE — Payment Calculator
   Payment plans, calculation logic, UI management
================================================================ */

'use strict';

/* ── PAYMENT PLANS ──────────────────────────────────────────
   Update these with real payment plan data from Flow Developments.
   - id:          unique identifier
   - label:       button label shown to sales rep
   - downPct:     down payment percentage (e.g. 10 = 10%)
   - years:       installment period in years
   - desc:        displayed description in plan detail box
──────────────────────────────────────────────────────────── */
const PAYMENT_PLANS = [
  {
    id: 'plan-a',
    label: 'Plan A',
    downPct: 10,
    years: 5,
    desc: '10% down payment · 5 years installment · 60 equal monthly payments'
  },
  {
    id: 'plan-b',
    label: 'Plan B',
    downPct: 15,
    years: 7,
    desc: '15% down payment · 7 years installment · 84 equal monthly payments'
  },
  {
    id: 'plan-c',
    label: 'Plan C',
    downPct: 20,
    years: 10,
    desc: '20% down payment · 10 years installment · 120 equal monthly payments'
  },
  {
    id: 'plan-d',
    label: 'Plan D',
    downPct: 30,
    years: 3,
    desc: '30% down payment · 3 years installment · 36 equal monthly payments'
  }
];

/* ── STATE ── */
let selectedPlanId = null;


/* ── INIT ──────────────────────────────────────────────────── */
function initCalculator() {
  buildPlanButtons();
  resetResults();
}


/* ── BUILD PLAN BUTTONS ─────────────────────────────────────── */
function buildPlanButtons() {
  const container = document.getElementById('plan-btns');
  if (!container) return;
  container.innerHTML = '';

  PAYMENT_PLANS.forEach(plan => {
    const btn = document.createElement('button');
    btn.className = 'plan-btn';
    btn.id = 'btn-' + plan.id;
    btn.innerHTML = `
      <strong>${plan.label}</strong>
      <br>
      <small>${plan.downPct}% · ${plan.years} yrs</small>
    `;
    btn.addEventListener('click', () => selectPlan(plan.id));
    container.appendChild(btn);
  });
}


/* ── SELECT PLAN ────────────────────────────────────────────── */
function selectPlan(planId) {
  selectedPlanId = planId;

  // Update button states
  PAYMENT_PLANS.forEach(p => {
    const btn = document.getElementById('btn-' + p.id);
    if (btn) btn.classList.toggle('active', p.id === planId);
  });

  // Show plan description
  const plan = PAYMENT_PLANS.find(p => p.id === planId);
  const box  = document.getElementById('plan-detail-box');
  if (box && plan) {
    box.innerHTML = `<p class="plan-detail-text">${plan.desc}</p>`;
  }

  updateCalculator();
}


/* ── CALCULATE ──────────────────────────────────────────────── */
function updateCalculator() {
  const priceInput = document.getElementById('calc-price');
  if (!priceInput) return;

  const rawVal = parseFloat(priceInput.value);
  const price  = isNaN(rawVal) || rawVal <= 0 ? null : rawVal;

  if (!price || !selectedPlanId) {
    if (!price && selectedPlanId) {
      // Plan selected but no price yet — just keep placeholders
      setResult('res-total',    '—');
      setResult('res-down',     '—');
      setResult('res-remaining','—');
      setResult('res-monthly',  '—');
      setNote('res-down-note',    '');
      setNote('res-monthly-note', '');
    }
    return;
  }

  const plan = PAYMENT_PLANS.find(p => p.id === selectedPlanId);
  if (!plan) return;

  /* ── Core calculations (zero-interest equal installments) ── */
  const totalPrice         = price;
  const downPaymentAmount  = Math.round(totalPrice * (plan.downPct / 100));
  const remainingAmount    = totalPrice - downPaymentAmount;
  const totalMonths        = plan.years * 12;
  const monthlyInstallment = Math.round(remainingAmount / totalMonths);

  /* ── Update UI ── */
  setResult('res-total',     formatEGP(totalPrice));
  setResult('res-down',      formatEGP(downPaymentAmount));
  setResult('res-remaining', formatEGP(remainingAmount));
  setResult('res-monthly',   formatEGP(monthlyInstallment));

  setNote('res-down-note',    `${plan.downPct}% of total price`);
  setNote('res-monthly-note', `${plan.years} years · ${totalMonths} monthly payments`);
}


/* ── HELPERS ────────────────────────────────────────────────── */
function formatEGP(amount) {
  return amount.toLocaleString('en-US') + ' EGP';
}

function setResult(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setNote(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function resetResults() {
  ['res-total', 'res-down', 'res-remaining', 'res-monthly'].forEach(id => setResult(id, '—'));
  ['res-down-note', 'res-monthly-note'].forEach(id => setNote(id, ''));
}
