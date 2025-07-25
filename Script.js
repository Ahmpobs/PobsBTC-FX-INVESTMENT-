// Simulated user database
let users = JSON.parse(localStorage.getItem('tnk_users')) || {};
let currentUser = null;

// Signup
const signupForm = document.getElementById('signupForm');
signupForm?.addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  const referral = document.getElementById('referralCode').value;

  if (users[username]) return alert('User already exists');

  users[username] = {
    password,
    balance: 0,
    referredBy: referral || null,
    referrals: []
  };

  if (referral && users[referral]) {
    users[referral].referrals.push(username);
  }

  localStorage.setItem('tnk_users', JSON.stringify(users));
  alert('Signup successful! Please log in.');
});

// Login
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (users[username]?.password === password) {
    currentUser = username;
    localStorage.setItem('tnk_currentUser', currentUser);
    loadDashboard();
  } else {
    alert('Invalid login');
  }
});

// Load Dashboard
function loadDashboard() {
  currentUser = localStorage.getItem('tnk_currentUser');
  if (!currentUser || !users[currentUser]) return;

  document.getElementById('auth').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  document.getElementById('userDisplay').innerText = currentUser;
  document.getElementById('userBalance').innerText = users[currentUser].balance.toFixed(2);
  document.getElementById('referralLink').value = `${location.href}?ref=${currentUser}`;
}

// Referral balance update (admin panel)
const updateBalanceForm = document.getElementById('updateBalanceForm');
updateBalanceForm?.addEventListener('submit', e => {
  e.preventDefault();
  const refUser = document.getElementById('refUsername').value;
  const amount = parseFloat(document.getElementById('refAmount').value);
  if (!users[refUser]) return alert('User not found');
  users[refUser].balance += amount;
  localStorage.setItem('tnk_users', JSON.stringify(users));
  alert('Balance updated!');
});

// Support form
const supportForm = document.getElementById('supportForm');
supportForm?.addEventListener('submit', e => {
  e.preventDefault();
  const user = document.getElementById('supportUser').value;
  const message = document.getElementById('supportMessage').value;
  alert(`Complaint submitted. Thank you, ${user}!`);
});

// Auto-fill referral on load
window.addEventListener('load', () => {
  const params = new URLSearchParams(location.search);
  const ref = params.get('ref');
  if (ref) {
    const refField = document.getElementById('referralCode');
    if (refField) refField.value = ref;
  }
  loadDashboard();
});
