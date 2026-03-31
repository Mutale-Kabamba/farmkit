// app.js - FarmKit Modular SPA
// Description: Modular Farm Management Kit with SPA navigation and localStorage state management

// --- Constants & State ---
const STORAGE_KEY = 'farmkitState';
const MODULES = [
  { key: 'Poultry', label: 'Poultry', icon: 'ph-bird' },
  { key: 'Vegetation', label: 'Vegetation/Crops', icon: 'ph-plant' }
];
const CROPS = [
  { key: 'Beetroot', label: 'Beetroot', icon: '🧃' },
  { key: 'Broccoli', label: 'Broccoli', icon: '🥦' },
  { key: 'Butternut', label: 'Butternut', icon: '🎃' },
  { key: 'Cabbage', label: 'Cabbage', icon: '🥬' },
  { key: 'Carrot', label: 'Carrot', icon: '🥕' },
  { key: 'Cauliflower', label: 'Cauliflower', icon: '🥦' },
  { key: 'Chilies', label: 'Chilies', icon: '🌶️' },
  { key: 'Cucumber', label: 'Cucumber', icon: '🥒' },
  { key: 'Eggplant', label: 'Eggplant', icon: '🍆' },
  { key: 'Garlic', label: 'Garlic', icon: '🧄' },
  { key: 'GreenBeans', label: 'Green Beans', icon: '🫘' },
  { key: 'IrishPotato', label: 'Irish Potato', icon: '🥔' },
  { key: 'Lettuce', label: 'Lettuce', icon: '🥬' },
  { key: 'Okra', label: 'Okra', icon: '🟩' },
  { key: 'Onion', label: 'Onion', icon: '🧅' },
  { key: 'Peas', label: 'Peas', icon: '🌱' },
  { key: 'Pumpkin', label: 'Pumpkin', icon: '🎃' },
  { key: 'Rape', label: 'Rape (Kale)', icon: '🥬' },
  { key: 'Spinach', label: 'Spinach', icon: '🥬' },
  { key: 'SweetPepper', label: 'Sweet Pepper', icon: '🫑' },
  { key: 'SweetPotato', label: 'Sweet Potato', icon: '🍠' },
  { key: 'Tomato', label: 'Tomato', icon: '🍅' },
  { key: 'Watermelon', label: 'Watermelon', icon: '🍉' }
];
let state = {};
let activeModule = null;

// --- Utility Functions ---
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadState() {
  const data = localStorage.getItem(STORAGE_KEY);
  state = data ? JSON.parse(data) : { activeModules: [] };
}
function formatZMW(amount) {
  return `ZMW ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function generateId() {
  return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

// --- SPA Navigation ---
function Maps(view) {
  const root = document.getElementById('app-root');
  root.innerHTML = '';
  
  if (view === 'landing') renderLanding();
  else if (view === 'crop-select') renderCropSelect();
  else if (view === 'setup') renderSetupWizard();
  else if (view === 'dashboard') renderDashboard(activeModule);
}

// --- View 1: Landing Page ---
function renderLanding() {
  const root = document.getElementById('app-root');
  const container = document.createElement('div');
  container.className = 'flex flex-1 items-center justify-center min-h-screen bg-slate-50';
  container.innerHTML = `
    <div class="max-w-3xl w-full p-10 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
        <i class="ph ph-tractor text-3xl"></i>
      </div>
      <h1 class="text-3xl font-bold mb-2 text-slate-800">Welcome to FarmKit</h1>
      <p class="mb-10 text-slate-500 text-center">Select a management module to get started.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <button id="select-poultry" class="group bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md rounded-2xl p-8 flex flex-col items-center transition-all">
          <i class="ph ph-bird text-5xl mb-4 text-slate-400 group-hover:text-emerald-500 transition-colors"></i>
          <span class="text-xl font-semibold text-slate-700">Poultry</span>
        </button>
        <button id="select-vegetation" class="group bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md rounded-2xl p-8 flex flex-col items-center transition-all">
          <i class="ph ph-plant text-5xl mb-4 text-slate-400 group-hover:text-emerald-500 transition-colors"></i>
          <span class="text-xl font-semibold text-slate-700">Vegetation/Crops</span>
        </button>
      </div>
    </div>
  `;
  root.appendChild(container);
  document.getElementById('select-poultry').onclick = () => handleModuleSelect('Poultry');
  document.getElementById('select-vegetation').onclick = () => Maps('crop-select');
}

// --- View 2: Crop Sub-Selection ---
function renderCropSelect() {
  const root = document.getElementById('app-root');
  const container = document.createElement('div');
  container.className = 'flex flex-1 items-center justify-center min-h-screen bg-slate-50';
  container.innerHTML = `
    <div class="max-w-3xl w-full p-10 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
      <h2 class="text-2xl font-bold mb-8 text-slate-800">Select a Crop Profile</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        ${CROPS.map(crop => `
          <button class="group bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-2xl p-6 flex flex-col items-center transition-all" data-crop="${crop.key}">
            <i class="${crop.icon} text-3xl mb-3 text-slate-500 group-hover:text-emerald-600"></i>
            <span class="text-sm font-semibold text-slate-700">${crop.label}</span>
          </button>
        `).join('')}
      </div>
      <button id="back-to-landing" class="mt-8 text-slate-500 hover:text-emerald-600 font-medium flex items-center gap-2 transition-colors">
        <i class="ph ph-arrow-left"></i> Back to Modules
      </button>
    </div>
  `;
  root.appendChild(container);
  document.querySelectorAll('[data-crop]').forEach(btn => {
    btn.onclick = () => handleModuleSelect('Vegetation_' + btn.getAttribute('data-crop'));
  });
  document.getElementById('back-to-landing').onclick = () => Maps('landing');
}

// --- View 3: Setup Wizard ---
function renderSetupWizard() {
  const root = document.getElementById('app-root');
  const isPoultry = activeModule === 'Poultry';
  const cropKey = isPoultry ? null : activeModule.replace('Vegetation_', '');
  
  let formHtml = isPoultry ? `
      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-slate-600">Initial Flock Size</label>
        <input type="number" id="setup-flock" min="1" required class="w-full border border-slate-300 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none" placeholder="e.g. 500" />
      </div>
      <div class="mb-8">
        <label class="block mb-2 text-sm font-medium text-slate-600">Start Date</label>
        <input type="date" id="setup-date" required class="w-full border border-slate-300 rounded-xl px-4 py-3 focus:border-emerald-500 transition-all outline-none" />
      </div>
    ` : `
      <div class="mb-5">
        <label class="block mb-2 text-sm font-medium text-slate-600">Planting Date</label>
        <input type="date" id="setup-planting-date" required class="w-full border border-slate-300 rounded-xl px-4 py-3 focus:border-emerald-500 transition-all outline-none" />
      </div>
      <div class="mb-8">
        <label class="block mb-2 text-sm font-medium text-slate-600">Area Size</label>
        <input type="text" id="setup-area-size" required class="w-full border border-slate-300 rounded-xl px-4 py-3 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 2 Hectares" />
      </div>
    `;

  const container = document.createElement('div');
  container.className = 'flex flex-1 items-center justify-center min-h-screen bg-slate-50';
  container.innerHTML = `
    <form id="setup-form" class="max-w-md w-full p-10 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
          <i class="ph ${isPoultry ? 'ph-bird' : 'ph-plant'} text-xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-800">${isPoultry ? 'Poultry Setup' : cropKey + ' Setup'}</h2>
      </div>
      ${formHtml}
      <button type="submit" class="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 font-semibold transition-colors">Initialize Module</button>
    </form>
  `;
  root.appendChild(container);
  document.getElementById('setup-form').onsubmit = setupModuleSubmit;
}

function setupModuleSubmit(e) {
  e.preventDefault();
  const isPoultry = activeModule === 'Poultry';
  if (isPoultry) {
    const initialFlock = Number(document.getElementById('setup-flock').value);
    const startDate = document.getElementById('setup-date').value;
    if (!initialFlock || !startDate) return alert('Please fill all fields.');
    state[activeModule] = { setup: { initialFlock, startDate }, sales: [], expenses: [], inventory: [] };
  } else {
    const plantingDate = document.getElementById('setup-planting-date').value;
    const areaSize = document.getElementById('setup-area-size').value.trim();
    if (!plantingDate || !areaSize) return alert('Please fill all fields.');
    state[activeModule] = { setup: { plantingDate, areaSize }, sales: [], expenses: [], inventory: [] };
  }
  if (!state.activeModules.includes(activeModule)) state.activeModules.push(activeModule);
  saveState();
  Maps('dashboard');
}

function handleModuleSelect(moduleKey) {
  activeModule = moduleKey;
  loadState();
  if (!state[activeModule]) Maps('setup');
  else Maps('dashboard');
}

// --- View 4: Management Dashboard ---
function renderDashboard(moduleKey) {
  loadState();
  activeModule = moduleKey;
  const moduleData = state[moduleKey];
  if (!moduleData) return Maps('landing');
  
  const isPoultry = moduleKey === 'Poultry';
  
  // Sleek Dark Sidebar
  const sidebar = `
    <aside class="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-screen fixed">
      <div class="p-6 flex items-center gap-3 border-b border-slate-800/50 mb-6">
        <div class="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white">
          <i class="ph ph-tractor font-bold"></i>
        </div>
        <h1 class="text-xl font-bold text-white tracking-wide">FarmKit</h1>
      </div>
      
      <div class="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Management</div>
      
      <nav class="flex flex-col gap-1 px-3 flex-1">
        <button class="sidebar-btn active flex items-center gap-3 py-2.5 px-3 rounded-lg hover:text-white transition-colors text-left text-sm font-medium" data-section="overview">
          <i class="ph ph-squares-four text-lg"></i> Dashboard
        </button>
        <button class="sidebar-btn flex items-center gap-3 py-2.5 px-3 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors text-left text-sm font-medium" data-section="sales">
          <i class="ph ph-chart-line-up text-lg"></i> Sales
        </button>
        <button class="sidebar-btn flex items-center gap-3 py-2.5 px-3 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors text-left text-sm font-medium" data-section="expenses">
          <i class="ph ph-receipt text-lg"></i> Expenses
        </button>
        <button class="sidebar-btn flex items-center gap-3 py-2.5 px-3 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors text-left text-sm font-medium" data-section="inventory">
          <i class="ph ${isPoultry ? 'ph-heartbeat' : 'ph-plant'} text-lg"></i> ${isPoultry ? 'Mortality Log' : 'Growth Log'}
        </button>
      </nav>
      
      <div class="p-4 border-t border-slate-800/50">
        <button class="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors" id="switch-module">
          <i class="ph ph-arrows-left-right"></i> Switch Module
        </button>
      </div>
    </aside>
  `;
  
  // Header mirroring the uploaded image
  const header = `
    <header class="flex justify-between items-end mb-10">
      <div>
        <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Good Morning, Mutale</h2>
        <p class="text-slate-500 mt-1 font-medium">March 30, 2026</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative">
          <i class="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input type="text" placeholder="Search..." class="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:border-emerald-500 w-64 shadow-sm" />
        </div>
      </div>
    </header>
  `;

  // Main content wrapper
  const main = `
    <main class="flex-1 ml-64 p-10 bg-[#F7F9FC] min-h-screen">
      ${header}
      <section id="dashboard-overview" class="dashboard-section block"></section>
      <section id="dashboard-sales" class="dashboard-section hidden"></section>
      <section id="dashboard-expenses" class="dashboard-section hidden"></section>
      <section id="dashboard-inventory" class="dashboard-section hidden"></section>
    </main>
  `;
  
  const root = document.getElementById('app-root');
  root.innerHTML = `<div class="flex">${sidebar}${main}</div>`;
  
  // Sidebar Interaction
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.sidebar-btn').forEach(b => {
        b.classList.remove('active', 'bg-white/10', 'border-l-2', 'border-emerald-500');
        b.classList.add('hover:bg-slate-800/50');
      });
      btn.classList.add('active');
      btn.classList.remove('hover:bg-slate-800/50');
      showDashboardSection(btn.getAttribute('data-section'), moduleKey);
    };
  });
  document.getElementById('switch-module').onclick = () => Maps('landing');
  showDashboardSection('overview', moduleKey);
}

function showDashboardSection(section, moduleKey) {
  document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById('dashboard-' + section).classList.remove('hidden');
  if (section === 'overview') renderOverview(moduleKey);
  else if (section === 'sales') renderSales(moduleKey);
  else if (section === 'expenses') renderExpenses(moduleKey);
  else if (section === 'inventory') renderInventory(moduleKey);
}

// --- Overview/Metrics Section ---
function renderOverview(moduleKey) {
  const moduleData = state[moduleKey];
  const isPoultry = moduleKey === 'Poultry';
  let totalRevenue = 0, totalExpenses = 0, netProfit = 0, unpaidTotal = 0, numUnpaid = 0, inventory = 0;
  let totalMortality = 0, totalSold = 0;
  
  moduleData.sales.forEach(sale => {
    totalRevenue += sale.totalAmount;
    if (sale.paymentStatus === 'Unpaid') {
      unpaidTotal += sale.totalAmount;
      numUnpaid++;
    }
    if (isPoultry) totalSold += sale.quantity;
  });
  moduleData.expenses.forEach(exp => { totalExpenses += exp.amount; });
  netProfit = totalRevenue - totalExpenses;
  
  if (isPoultry) {
    inventory = moduleData.setup.initialFlock;
    moduleData.inventory.forEach(log => { if (log.type === 'mortality') totalMortality += log.count; });
    inventory = inventory - totalMortality - totalSold;
  }
  
  const overview = document.getElementById('dashboard-overview');
  overview.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between h-32">
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">Total Revenue</span>
          <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><i class="ph ph-trend-up"></i></div>
        </div>
        <span class="text-2xl font-bold text-slate-900">${formatZMW(totalRevenue)}</span>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between h-32">
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">Total Expenses</span>
          <div class="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center"><i class="ph ph-trend-down"></i></div>
        </div>
        <span class="text-2xl font-bold text-slate-900">${formatZMW(totalExpenses)}</span>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between h-32">
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">Net Profit</span>
          <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><i class="ph ph-wallet"></i></div>
        </div>
        <span class="text-2xl font-bold text-slate-900">${formatZMW(netProfit)}</span>
      </div>
      
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between h-32">
        <div class="flex justify-between items-start">
          <span class="text-sm font-medium text-slate-500">${isPoultry ? 'Current Inventory' : 'Unpaid Owed'}</span>
          <div class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><i class="ph ${isPoultry ? 'ph-bird' : 'ph-warning-circle'}"></i></div>
        </div>
        <span class="text-2xl font-bold text-slate-900">${isPoultry ? inventory : formatZMW(unpaidTotal)}</span>
      </div>
    </div>
    
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 class="text-lg font-bold text-slate-800">${isPoultry ? 'Recent Activity Log' : 'Unpaid Accounts Report'}</h3>
      </div>
      <div class="p-0">
         ${isPoultry ? renderActivityLogTable(moduleKey) : renderUnpaidTable(moduleKey)}
      </div>
    </div>
  `;
}

function renderActivityLogTable(moduleKey) {
  const moduleData = state[moduleKey];
  let logs = [];
  moduleData.inventory.forEach(log => logs.push({ date: log.date, type: 'Mortality', detail: log.count, notes: log.notes || '' }));
  moduleData.sales.forEach(sale => logs.push({ date: sale.date, type: 'Sale', detail: `${sale.quantity} @ ${formatZMW(sale.unitPrice)}`, notes: sale.notes || '' }));
  moduleData.expenses.forEach(exp => logs.push({ date: exp.date, type: 'Expense', detail: `${exp.category}: ${formatZMW(exp.amount)}`, notes: exp.notes || '' }));
  
  logs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  
  if (!logs.length) return '<div class="p-6 text-slate-500 text-center text-sm">No activity recorded yet.</div>';
  
  return `
    <table class="min-w-full text-left text-sm whitespace-nowrap">
      <thead class="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
        <tr>
          <th class="py-4 px-6">Date</th>
          <th class="py-4 px-6">Type</th>
          <th class="py-4 px-6">Details</th>
          <th class="py-4 px-6">Notes</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-50">
        ${logs.slice(0, 10).map(log => `
          <tr class="hover:bg-slate-50/50 transition-colors text-slate-700">
            <td class="py-4 px-6">${log.date}</td>
            <td class="py-4 px-6"><span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${log.type === 'Sale' ? 'bg-emerald-50 text-emerald-700' : log.type === 'Expense' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}">${log.type}</span></td>
            <td class="py-4 px-6">${log.detail}</td>
            <td class="py-4 px-6 text-slate-500">${log.notes}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderUnpaidTable(moduleKey) {
  const sales = state[moduleKey].sales.filter(sale => sale.paymentStatus === 'Unpaid');
  if (!sales.length) return '<div class="p-6 text-slate-500 text-center text-sm">All accounts are settled.</div>';
  return `
    <table class="min-w-full text-left text-sm whitespace-nowrap">
      <thead class="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
        <tr>
          <th class="py-4 px-6">Date</th>
          <th class="py-4 px-6">Customer</th>
          <th class="py-4 px-6">Total Owed</th>
          <th class="py-4 px-6">Notes</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-50 text-slate-700">
        ${sales.map(sale => `
          <tr class="hover:bg-slate-50/50 transition-colors">
            <td class="py-4 px-6">${sale.date}</td>
            <td class="py-4 px-6 font-medium text-slate-900">${sale.customer}</td>
            <td class="py-4 px-6 text-rose-600 font-medium">${formatZMW(sale.totalAmount)}</td>
            <td class="py-4 px-6 text-slate-500">${sale.notes || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

// --- Forms and Tables (Sales, Expenses, Inventory) ---
function renderSales(moduleKey) {
  const moduleData = state[moduleKey];
  const section = document.getElementById('dashboard-sales');
  
  section.innerHTML = `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><i class="ph ph-plus-circle text-emerald-500"></i> Log New Sale</h3>
      <form id="sales-form" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="date" id="sale-date" required class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        <input type="text" id="sale-customer" required placeholder="Customer Name" class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        <input type="number" id="sale-quantity" min="1" required placeholder="Qty" class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        <input type="number" id="sale-unit-price" min="0.01" step="0.01" required placeholder="Price (ZMW)" class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        <select id="sale-payment-status" required class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none text-slate-600">
          <option value="Paid">Status: Paid</option>
          <option value="Unpaid">Status: Unpaid</option>
        </select>
        <input type="text" id="sale-notes" placeholder="Optional Notes" class="md:col-span-2 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        <button type="submit" class="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 transition">Save Record</button>
      </form>
    </div>
    
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100"><h3 class="text-lg font-bold text-slate-800">Sales History</h3></div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
            <tr><th class="py-4 px-6">Date</th><th class="py-4 px-6">Customer</th><th class="py-4 px-6">Qty</th><th class="py-4 px-6">Unit Price</th><th class="py-4 px-6">Total</th><th class="py-4 px-6">Status</th></tr>
          </thead>
          <tbody class="divide-y divide-slate-50 text-slate-700">
            ${moduleData.sales.map(sale => `
              <tr class="hover:bg-slate-50/50">
                <td class="py-3 px-6">${sale.date}</td>
                <td class="py-3 px-6 font-medium text-slate-900">${sale.customer}</td>
                <td class="py-3 px-6">${sale.quantity}</td>
                <td class="py-3 px-6">${formatZMW(sale.unitPrice)}</td>
                <td class="py-3 px-6 font-medium">${formatZMW(sale.totalAmount)}</td>
                <td class="py-3 px-6"><span class="px-2.5 py-1 rounded-md text-xs font-medium ${sale.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}">${sale.paymentStatus}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('sales-form').onsubmit = e => {
    e.preventDefault();
    const payload = {
      id: generateId(),
      date: document.getElementById('sale-date').value,
      customer: document.getElementById('sale-customer').value.trim(),
      quantity: Number(document.getElementById('sale-quantity').value),
      unitPrice: Number(document.getElementById('sale-unit-price').value),
      paymentStatus: document.getElementById('sale-payment-status').value,
      notes: document.getElementById('sale-notes').value.trim()
    };
    payload.totalAmount = payload.quantity * payload.unitPrice;
    saveTransaction(moduleKey, 'sales', payload);
    renderSales(moduleKey);
  };
}

function renderExpenses(moduleKey) {
  const moduleData = state[moduleKey];
  const section = document.getElementById('dashboard-expenses');
  section.innerHTML = `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><i class="ph ph-minus-circle text-rose-500"></i> Log New Expense</h3>
      <form id="expenses-form" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="date" id="expense-date" required class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        <select id="expense-category" required class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none text-slate-600">
          <option value="Feed">Feed</option><option value="Fertilizer">Fertilizer</option><option value="Medicine">Medicine</option><option value="Labor">Labor</option><option value="Other">Other</option>
        </select>
        <input type="number" id="expense-amount" min="0.01" step="0.01" required placeholder="Amount (ZMW)" class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        <input type="text" id="expense-notes" placeholder="Notes" class="md:col-span-2 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        <button type="submit" class="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 transition">Save Expense</button>
      </form>
    </div>
    
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100"><h3 class="text-lg font-bold text-slate-800">Expense History</h3></div>
      <table class="min-w-full text-left text-sm whitespace-nowrap">
        <thead class="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
          <tr><th class="py-4 px-6">Date</th><th class="py-4 px-6">Category</th><th class="py-4 px-6">Amount</th><th class="py-4 px-6">Notes</th></tr>
        </thead>
        <tbody class="divide-y divide-slate-50 text-slate-700">
          ${moduleData.expenses.map(exp => `
            <tr class="hover:bg-slate-50/50">
              <td class="py-3 px-6">${exp.date}</td>
              <td class="py-3 px-6"><span class="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">${exp.category}</span></td>
              <td class="py-3 px-6 font-medium text-rose-600">${formatZMW(exp.amount)}</td>
              <td class="py-3 px-6 text-slate-500">${exp.notes || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('expenses-form').onsubmit = e => {
    e.preventDefault();
    saveTransaction(moduleKey, 'expenses', {
      id: generateId(),
      date: document.getElementById('expense-date').value,
      category: document.getElementById('expense-category').value,
      amount: Number(document.getElementById('expense-amount').value),
      notes: document.getElementById('expense-notes').value.trim()
    });
    renderExpenses(moduleKey);
  };
}

function renderInventory(moduleKey) {
  const moduleData = state[moduleKey];
  const isPoultry = moduleKey === 'Poultry';
  const section = document.getElementById('dashboard-inventory');
  section.innerHTML = `
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><i class="ph ${isPoultry ? 'ph-heartbeat text-rose-500' : 'ph-plant text-emerald-500'}"></i> ${isPoultry ? 'Log Mortality' : 'Log Growth Stage'}</h3>
      <form id="inventory-form" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="date" id="inv-date" required class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        ${isPoultry ? `<input type="number" id="inv-mortality" min="1" required placeholder="Mortality Count" class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />` : `<input type="text" id="inv-stage" required placeholder="Growth Stage / Event" class="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />`}
        <input type="text" id="inv-notes" placeholder="Notes / Cause" class="md:col-span-2 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-emerald-500 outline-none" />
        <button type="submit" class="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 transition">Save Log</button>
      </form>
    </div>
    
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100"><h3 class="text-lg font-bold text-slate-800">Records Log</h3></div>
      <table class="min-w-full text-left text-sm whitespace-nowrap">
        <thead class="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
          <tr><th class="py-4 px-6">Date</th><th class="py-4 px-6">${isPoultry ? 'Mortality Count' : 'Stage/Event'}</th><th class="py-4 px-6">Notes</th></tr>
        </thead>
        <tbody class="divide-y divide-slate-50 text-slate-700">
          ${moduleData.inventory.map(log => `
            <tr class="hover:bg-slate-50/50">
              <td class="py-3 px-6">${log.date}</td>
              <td class="py-3 px-6 font-medium">${isPoultry ? log.count : log.stage}</td>
              <td class="py-3 px-6 text-slate-500">${log.notes || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById('inventory-form').onsubmit = e => {
    e.preventDefault();
    const payload = { id: generateId(), date: document.getElementById('inv-date').value, notes: document.getElementById('inv-notes').value.trim() };
    if (isPoultry) {
      payload.type = 'mortality';
      payload.count = Number(document.getElementById('inv-mortality').value);
    } else {
      payload.stage = document.getElementById('inv-stage').value.trim();
    }
    saveTransaction(moduleKey, 'inventory', payload);
    renderInventory(moduleKey);
  };
}

function saveTransaction(moduleKey, type, data) {
  loadState();
  if (!state[moduleKey]) return;
  state[moduleKey][type].push(data);
  saveState();
}

function initApp() {
  loadState();
  if (!state.activeModules || !state.activeModules.length) {
    Maps('landing');
    return;
  }
  activeModule = state.activeModules[state.activeModules.length - 1];
  Maps('dashboard');
}

window.addEventListener('DOMContentLoaded', initApp);