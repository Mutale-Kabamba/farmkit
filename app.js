// app.js - FarmKit Modular SPA
// Author: FarmKit
// Description: Modular Farm Management Kit with SPA navigation and localStorage state management

// --- Constants & State ---
const STORAGE_KEY = 'farmkitState';
const MODULES = [
  { key: 'Poultry', label: 'Poultry', icon: '🐔' },
  { key: 'Vegetation', label: 'Vegetation/Crops', icon: '🌱' }
];
const CROPS = [
  { key: 'Tomatoes', label: 'Tomatoes', icon: '🍅' },
  { key: 'Spinach', label: 'Spinach', icon: '🥬' },
  { key: 'Cabbage', label: 'Cabbage', icon: '🥬' },
  { key: 'Baobab', label: 'Baobab', icon: '🌳' },
  { key: 'Tamarind', label: 'Tamarind', icon: '🌳' }
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
  // Remove all views
  const root = document.getElementById('app-root');
  root.innerHTML = '';
  // Render selected view
  if (view === 'landing') renderLanding();
  else if (view === 'crop-select') renderCropSelect();
  else if (view === 'setup') renderSetupWizard();
  else if (view === 'dashboard') renderDashboard(activeModule);
}

// --- View 1: Landing Page ---
function renderLanding() {
  const root = document.getElementById('app-root');
  const container = document.createElement('div');
  container.className = 'flex flex-1 items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300';
  container.innerHTML = `
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg flex flex-col items-center">
      <h1 class="text-3xl font-bold mb-6 text-green-800">Welcome to FarmKit</h1>
      <p class="mb-8 text-gray-600 text-center">Select a module to get started:</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <button id="select-poultry" class="bg-green-700 hover:bg-green-800 text-white rounded-lg p-8 flex flex-col items-center shadow transition">
          <span class="text-5xl mb-2">🐔</span>
          <span class="text-xl font-semibold">Poultry</span>
        </button>
        <button id="select-vegetation" class="bg-green-700 hover:bg-green-800 text-white rounded-lg p-8 flex flex-col items-center shadow transition">
          <span class="text-5xl mb-2">🌱</span>
          <span class="text-xl font-semibold">Vegetation/Crops</span>
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
  container.className = 'flex flex-1 items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300';
  container.innerHTML = `
    <div class="max-w-xl w-full p-8 bg-white rounded-lg shadow-lg flex flex-col items-center">
      <h2 class="text-2xl font-bold mb-6 text-green-800">Select a Crop</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        ${CROPS.map(crop => `
          <button class="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 flex flex-col items-center shadow transition" data-crop="${crop.key}">
            <span class="text-4xl mb-2">${crop.icon}</span>
            <span class="text-lg font-semibold">${crop.label}</span>
          </button>
        `).join('')}
      </div>
      <button id="back-to-landing" class="mt-8 text-green-700 hover:underline">&larr; Back</button>
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
  let formHtml = '';
  if (isPoultry) {
    formHtml = `
      <div class="mb-4">
        <label class="block mb-1 font-medium">Initial Flock Size</label>
        <input type="number" id="setup-flock" min="1" required class="w-full border rounded px-3 py-2" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Start Date</label>
        <input type="date" id="setup-date" required class="w-full border rounded px-3 py-2" />
      </div>
    `;
  } else {
    formHtml = `
      <div class="mb-4">
        <label class="block mb-1 font-medium">Planting Date</label>
        <input type="date" id="setup-planting-date" required class="w-full border rounded px-3 py-2" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">Area Size</label>
        <input type="text" id="setup-area-size" required class="w-full border rounded px-3 py-2" placeholder="e.g. 2 Hectares" />
      </div>
    `;
  }
  const container = document.createElement('div');
  container.className = 'flex flex-1 items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300';
  container.innerHTML = `
    <form id="setup-form" class="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-green-800">${isPoultry ? 'Poultry Setup' : cropKey + ' Setup'}</h2>
      ${formHtml}
      <button type="submit" class="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 font-semibold">Save & Continue</button>
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
    state[activeModule] = {
      setup: { initialFlock, startDate },
      sales: [],
      expenses: [],
      inventory: []
    };
  } else {
    const plantingDate = document.getElementById('setup-planting-date').value;
    const areaSize = document.getElementById('setup-area-size').value.trim();
    if (!plantingDate || !areaSize) return alert('Please fill all fields.');
    state[activeModule] = {
      setup: { plantingDate, areaSize },
      sales: [],
      expenses: [],
      inventory: []
    };
  }
  if (!state.activeModules.includes(activeModule)) state.activeModules.push(activeModule);
  saveState();
  Maps('dashboard');
}

function handleModuleSelect(moduleKey) {
  activeModule = moduleKey;
  loadState();
  if (!state[activeModule]) {
    Maps('setup');
  } else {
    Maps('dashboard');
  }
}

// --- View 4: Management Dashboard ---
function renderDashboard(moduleKey) {
  loadState();
  activeModule = moduleKey;
  const moduleData = state[moduleKey];
  if (!moduleData) return Maps('landing');
  const isPoultry = moduleKey === 'Poultry';
  const cropKey = isPoultry ? null : moduleKey.replace('Vegetation_', '');
  // Sidebar
  const sidebar = `
    <aside class="w-64 bg-green-700 text-white flex flex-col py-8 px-4 min-h-screen">
      <h1 class="text-2xl font-bold mb-8">FarmKit</h1>
      <nav class="flex flex-col gap-4">
        <button class="sidebar-btn py-2 px-4 rounded hover:bg-green-800 text-left" data-section="overview">Overview</button>
        <button class="sidebar-btn py-2 px-4 rounded hover:bg-green-800 text-left" data-section="sales">Sales</button>
        <button class="sidebar-btn py-2 px-4 rounded hover:bg-green-800 text-left" data-section="expenses">Expenses</button>
        <button class="sidebar-btn py-2 px-4 rounded hover:bg-green-800 text-left" data-section="inventory">${isPoultry ? 'Inventory/Mortality' : 'Growth Log'}</button>
        <button class="mt-8 py-2 px-4 rounded bg-white text-green-700 hover:bg-green-100 font-semibold" id="switch-module">Switch Module</button>
      </nav>
    </aside>
  `;
  // Main content
  const main = `
    <main class="flex-1 p-8">
      <section id="dashboard-overview" class="dashboard-section block"></section>
      <section id="dashboard-sales" class="dashboard-section hidden"></section>
      <section id="dashboard-expenses" class="dashboard-section hidden"></section>
      <section id="dashboard-inventory" class="dashboard-section hidden"></section>
    </main>
  `;
  // Layout
  const root = document.getElementById('app-root');
  root.innerHTML = `<div class="flex min-h-screen">${sidebar}${main}</div>`;
  // Sidebar events
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.onclick = () => showDashboardSection(btn.getAttribute('data-section'), moduleKey);
  });
  document.getElementById('switch-module').onclick = () => Maps('landing');
  // Render default section
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
    if (isPoultry) {
      totalSold += sale.quantity;
    }
  });
  moduleData.expenses.forEach(exp => {
    totalExpenses += exp.amount;
  });
  netProfit = totalRevenue - totalExpenses;
  if (isPoultry) {
    inventory = moduleData.setup.initialFlock;
    moduleData.inventory.forEach(log => {
      if (log.type === 'mortality') totalMortality += log.count;
    });
    inventory = inventory - totalMortality - totalSold;
  }
  const overview = document.getElementById('dashboard-overview');
  overview.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded shadow p-6 flex flex-col items-center">
        <span class="text-gray-500">Total Revenue</span>
        <span class="text-2xl font-bold text-green-700">${formatZMW(totalRevenue)}</span>
      </div>
      <div class="bg-white rounded shadow p-6 flex flex-col items-center">
        <span class="text-gray-500">Total Expenses</span>
        <span class="text-2xl font-bold text-red-600">${formatZMW(totalExpenses)}</span>
      </div>
      <div class="bg-white rounded shadow p-6 flex flex-col items-center">
        <span class="text-gray-500">Net Profit</span>
        <span class="text-2xl font-bold text-blue-700">${formatZMW(netProfit)}</span>
      </div>
      <div class="bg-white rounded shadow p-6 flex flex-col items-center">
        <span class="text-gray-500">${isPoultry ? 'Current Inventory' : 'Unpaid Total'}</span>
        <span class="text-2xl font-bold ${isPoultry ? 'text-green-700' : 'text-red-600'}">${isPoultry ? inventory : formatZMW(unpaidTotal)}</span>
      </div>
    </div>
    <div class="bg-white rounded shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 class="text-xl font-semibold">${isPoultry ? 'Activity Log' : 'Unpaid Report'}</h2>
        ${isPoultry ? renderActivityLogFilters() : ''}
      </div>
      ${isPoultry ? renderActivityLogTable(moduleKey) : renderUnpaidTable(moduleKey)}
    </div>
  `;
  if (isPoultry) attachActivityLogFilterEvents(moduleKey);
}

function renderActivityLogFilters() {
  return `
    <div class="flex flex-wrap gap-2 items-center">
      <button class="activity-filter-btn px-3 py-1 rounded bg-green-100 hover:bg-green-200" data-range="today">Today</button>
      <button class="activity-filter-btn px-3 py-1 rounded bg-green-100 hover:bg-green-200" data-range="week">This Week</button>
      <button class="activity-filter-btn px-3 py-1 rounded bg-green-100 hover:bg-green-200" data-range="month">This Month</button>
      <button class="activity-filter-btn px-3 py-1 rounded bg-green-100 hover:bg-green-200" data-range="year">This Year</button>
      <label class="ml-2 text-sm">Custom:</label>
      <input type="date" class="activity-filter-date border rounded px-2 py-1" id="activity-date-from" />
      <span>-</span>
      <input type="date" class="activity-filter-date border rounded px-2 py-1" id="activity-date-to" />
      <button class="activity-filter-btn px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700" data-range="custom">Apply</button>
    </div>
  `;
}

function attachActivityLogFilterEvents(moduleKey) {
  document.querySelectorAll('.activity-filter-btn').forEach(btn => {
    btn.onclick = () => {
      let range = btn.getAttribute('data-range');
      let from = null, to = null;
      if (range === 'custom') {
        from = document.getElementById('activity-date-from').value;
        to = document.getElementById('activity-date-to').value;
        if (!from || !to) return alert('Select both dates.');
      }
      renderActivityLogTable(moduleKey, range, from, to);
    };
  });
}

function renderActivityLogTable(moduleKey, filterRange = null, customFrom = null, customTo = null) {
  const moduleData = state[moduleKey];
  // Gather all activity: inventory, sales, expenses
  let logs = [];
  // Inventory logs
  moduleData.inventory.forEach(log => {
    logs.push({
      date: log.date,
      type: log.type === 'mortality' ? 'Mortality' : (log.stage ? 'Growth' : 'Other'),
      detail: log.type === 'mortality' ? log.count : (log.stage || ''),
      notes: log.notes || '',
      source: 'inventory'
    });
  });
  // Sales logs
  moduleData.sales.forEach(sale => {
    logs.push({
      date: sale.date,
      type: 'Sale',
      detail: `${sale.quantity} @ ${formatZMW(sale.unitPrice)}`,
      notes: sale.notes || '',
      source: 'sales'
    });
  });
  // Expenses logs
  moduleData.expenses.forEach(exp => {
    logs.push({
      date: exp.date,
      type: 'Expense',
      detail: `${exp.category}: ${formatZMW(exp.amount)}`,
      notes: exp.notes || '',
      source: 'expenses'
    });
  });
  // Sort by date descending
  logs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  // Filter by range
  if (filterRange) {
    const today = new Date();
    let from, to;
    if (filterRange === 'today') {
      from = to = today.toISOString().slice(0, 10);
    } else if (filterRange === 'week') {
      const first = today.getDate() - today.getDay();
      from = new Date(today.setDate(first)).toISOString().slice(0, 10);
      to = new Date().toISOString().slice(0, 10);
    } else if (filterRange === 'month') {
      from = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
      to = today.toISOString().slice(0, 10);
    } else if (filterRange === 'year') {
      from = `${today.getFullYear()}-01-01`;
      to = today.toISOString().slice(0, 10);
    } else if (filterRange === 'custom') {
      from = customFrom;
      to = customTo;
    }
    logs = logs.filter(log => log.date >= from && log.date <= to);
  }
  if (!logs.length) return document.querySelector('.bg-white .activity-log-table') ? document.querySelector('.bg-white .activity-log-table').outerHTML = '<p class="text-gray-500">No activity records for this range.</p>' : '<p class="text-gray-500">No activity records for this range.</p>';
  // Render table
  const tableHtml = `<table class="min-w-full text-sm activity-log-table"><thead><tr class="bg-green-100"><th class="py-2 px-4">Date</th><th class="py-2 px-4">Type</th><th class="py-2 px-4">Details</th><th class="py-2 px-4">Notes</th></tr></thead><tbody>${logs.map(log => `<tr><td class="py-2 px-4">${log.date}</td><td class="py-2 px-4">${log.type}</td><td class="py-2 px-4">${log.detail}</td><td class="py-2 px-4">${log.notes}</td></tr>`).join('')}</tbody></table>`;
  // Replace or insert table
  const container = document.querySelector('.bg-white .activity-log-table')?.parentNode || document.querySelector('.bg-white');
  if (container) {
    const oldTable = container.querySelector('.activity-log-table');
    if (oldTable) oldTable.outerHTML = tableHtml;
    else container.insertAdjacentHTML('beforeend', tableHtml);
  }
  return tableHtml;
}
function renderUnpaidTable(moduleKey) {
  const sales = state[moduleKey].sales.filter(sale => sale.paymentStatus === 'Unpaid');
  if (!sales.length) return '<p class="text-gray-500">No unpaid sales.</p>';
  return `<table class="min-w-full text-sm"><thead><tr class="bg-red-100"><th class="py-2 px-4">Date</th><th class="py-2 px-4">Customer</th><th class="py-2 px-4">Total (ZMW)</th><th class="py-2 px-4">Notes</th></tr></thead><tbody>${sales.map(sale => `<tr><td class="py-2 px-4">${sale.date}</td><td class="py-2 px-4">${sale.customer}</td><td class="py-2 px-4">${formatZMW(sale.totalAmount)}</td><td class="py-2 px-4">${sale.notes || ''}</td></tr>`).join('')}</tbody></table>`;
}

// --- Sales Tracker Section ---
function renderSales(moduleKey) {
  const moduleData = state[moduleKey];
  const isPoultry = moduleKey === 'Poultry';
  const sales = moduleData.sales;
  const section = document.getElementById('dashboard-sales');
  section.innerHTML = `
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Sales Tracker</h2>
      <form id="sales-form" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input type="date" id="sale-date" required class="border rounded px-3 py-2" />
        <input type="text" id="sale-customer" required placeholder="Customer Name" class="border rounded px-3 py-2" />
        <input type="number" id="sale-quantity" min="1" required placeholder="Quantity" class="border rounded px-3 py-2" />
        <input type="number" id="sale-unit-price" min="0.01" step="0.01" required placeholder="Unit Price (ZMW)" class="border rounded px-3 py-2" />
        <select id="sale-payment-status" required class="border rounded px-3 py-2">
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
        <input type="text" id="sale-notes" placeholder="Notes" class="border rounded px-3 py-2" />
        <button type="submit" class="col-span-1 md:col-span-3 bg-green-700 text-white py-2 rounded hover:bg-green-800 font-semibold">Add Sale</button>
      </form>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm" id="sales-table">
          <thead>
            <tr class="bg-green-100">
              <th class="py-2 px-4">Date</th>
              <th class="py-2 px-4">Customer</th>
              <th class="py-2 px-4">Quantity</th>
              <th class="py-2 px-4">Unit Price (ZMW)</th>
              <th class="py-2 px-4">Total (ZMW)</th>
              <th class="py-2 px-4">Status</th>
              <th class="py-2 px-4">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${sales.map(sale => `
              <tr>
                <td class="py-2 px-4">${sale.date}</td>
                <td class="py-2 px-4">${sale.customer}</td>
                <td class="py-2 px-4">${sale.quantity}</td>
                <td class="py-2 px-4">${formatZMW(sale.unitPrice)}</td>
                <td class="py-2 px-4">${formatZMW(sale.totalAmount)}</td>
                <td class="py-2 px-4">
                  <span class="px-2 py-1 rounded text-xs font-semibold ${sale.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                    ${sale.paymentStatus}
                  </span>
                </td>
                <td class="py-2 px-4">${sale.notes || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="mt-4 flex justify-end">
        <span class="font-semibold text-red-600">Unpaid Owed: ${formatZMW(sales.filter(s => s.paymentStatus === 'Unpaid').reduce((sum, s) => sum + s.totalAmount, 0))}</span>
      </div>
    </div>
  `;
  document.getElementById('sales-form').onsubmit = e => {
    e.preventDefault();
    const date = document.getElementById('sale-date').value;
    const customer = document.getElementById('sale-customer').value.trim();
    const quantity = Number(document.getElementById('sale-quantity').value);
    const unitPrice = Number(document.getElementById('sale-unit-price').value);
    const paymentStatus = document.getElementById('sale-payment-status').value;
    const notes = document.getElementById('sale-notes').value.trim();
    if (!date || !customer || quantity < 1 || unitPrice < 0.01) return alert('Please fill all fields.');
    const sale = {
      id: generateId(),
      date, customer, quantity, unitPrice,
      totalAmount: quantity * unitPrice,
      paymentStatus, notes
    };
    saveTransaction(moduleKey, 'sales', sale);
    renderSales(moduleKey);
  };
}

// --- Expenses Tracker Section ---
function renderExpenses(moduleKey) {
  const moduleData = state[moduleKey];
  const expenses = moduleData.expenses;
  const section = document.getElementById('dashboard-expenses');
  section.innerHTML = `
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Expense Tracker</h2>
      <form id="expenses-form" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input type="date" id="expense-date" required class="border rounded px-3 py-2" />
        <select id="expense-category" required class="border rounded px-3 py-2">
          <option value="Feed">Feed</option>
          <option value="Fertilizer">Fertilizer</option>
          <option value="Medicine">Medicine</option>
          <option value="Labor">Labor</option>
        </select>
        <input type="number" id="expense-amount" min="0.01" step="0.01" required placeholder="Amount (ZMW)" class="border rounded px-3 py-2" />
        <input type="text" id="expense-notes" placeholder="Notes" class="border rounded px-3 py-2" />
        <button type="submit" class="col-span-1 md:col-span-3 bg-green-700 text-white py-2 rounded hover:bg-green-800 font-semibold">Add Expense</button>
      </form>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm" id="expenses-table">
          <thead>
            <tr class="bg-green-100">
              <th class="py-2 px-4">Date</th>
              <th class="py-2 px-4">Category</th>
              <th class="py-2 px-4">Amount (ZMW)</th>
              <th class="py-2 px-4">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${expenses.map(exp => `
              <tr>
                <td class="py-2 px-4">${exp.date}</td>
                <td class="py-2 px-4">${exp.category}</td>
                <td class="py-2 px-4">${formatZMW(exp.amount)}</td>
                <td class="py-2 px-4">${exp.notes || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('expenses-form').onsubmit = e => {
    e.preventDefault();
    const date = document.getElementById('expense-date').value;
    const category = document.getElementById('expense-category').value;
    const amount = Number(document.getElementById('expense-amount').value);
    const notes = document.getElementById('expense-notes').value.trim();
    if (!date || !category || amount < 0.01) return alert('Please fill all fields.');
    const expense = {
      id: generateId(),
      date, category, amount, notes
    };
    saveTransaction(moduleKey, 'expenses', expense);
    renderExpenses(moduleKey);
  };
}

// --- Inventory/Growth Log Section ---
function renderInventory(moduleKey) {
  const moduleData = state[moduleKey];
  const isPoultry = moduleKey === 'Poultry';
  const logs = moduleData.inventory;
  const section = document.getElementById('dashboard-inventory');
  section.innerHTML = `
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">${isPoultry ? 'Inventory/Mortality Log' : 'Growth Log'}</h2>
      <form id="inventory-form" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input type="date" id="inv-date" required class="border rounded px-3 py-2" />
        ${isPoultry ? `
          <input type="number" id="inv-mortality" min="1" required placeholder="Mortality Count" class="border rounded px-3 py-2" />
          <input type="text" id="inv-notes" placeholder="Notes" class="border rounded px-3 py-2" />
        ` : `
          <input type="text" id="inv-stage" required placeholder="Growth Stage/Harvest" class="border rounded px-3 py-2" />
          <input type="text" id="inv-notes" placeholder="Notes" class="border rounded px-3 py-2" />
        `}
        <button type="submit" class="col-span-1 md:col-span-3 bg-green-700 text-white py-2 rounded hover:bg-green-800 font-semibold">Add Log</button>
      </form>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm" id="inventory-table">
          <thead>
            <tr class="bg-green-100">
              <th class="py-2 px-4">Date</th>
              ${isPoultry ? '<th class="py-2 px-4">Mortality</th>' : '<th class="py-2 px-4">Stage/Harvest</th>'}
              <th class="py-2 px-4">Notes</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(log => `
              <tr>
                <td class="py-2 px-4">${log.date}</td>
                <td class="py-2 px-4">${isPoultry ? log.count : log.stage}</td>
                <td class="py-2 px-4">${log.notes || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('inventory-form').onsubmit = e => {
    e.preventDefault();
    const date = document.getElementById('inv-date').value;
    const notes = document.getElementById('inv-notes').value.trim();
    if (isPoultry) {
      const count = Number(document.getElementById('inv-mortality').value);
      if (!date || count < 1) return alert('Please fill all fields.');
      const log = { id: generateId(), date, type: 'mortality', count, notes };
      saveTransaction(moduleKey, 'inventory', log);
    } else {
      const stage = document.getElementById('inv-stage').value.trim();
      if (!date || !stage) return alert('Please fill all fields.');
      const log = { id: generateId(), date, stage, notes };
      saveTransaction(moduleKey, 'inventory', log);
    }
    renderInventory(moduleKey);
  };
}

// --- Save Transaction (Sales, Expenses, Inventory) ---
function saveTransaction(moduleKey, type, data) {
  loadState();
  if (!state[moduleKey]) return;
  state[moduleKey][type].push(data);
  saveState();
}

// --- App Initialization ---
function initApp() {
  loadState();
  // If no modules, show landing
  if (!state.activeModules || !state.activeModules.length) {
    Maps('landing');
    return;
  }
  // If modules exist, load last used
  activeModule = state.activeModules[state.activeModules.length - 1];
  Maps('dashboard');
}

window.addEventListener('DOMContentLoaded', initApp);
