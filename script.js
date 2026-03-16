let currentUser = null;

function getUsers() {
  const users = localStorage.getItem('tescoUsers');
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem('tescoUsers', JSON.stringify(users));
}

function checkLoginStatus() {
  const loggedInUser = localStorage.getItem('tescoCurrentUser');
  if (loggedInUser) {
    currentUser = JSON.parse(loggedInUser);
    updateUIForLoggedIn();
  }
}

function updateUIForLoggedIn() {
  document.getElementById('authLink').style.display = 'none';
  document.getElementById('userInfo').style.display = 'flex';
  document.getElementById('userName').textContent = currentUser.name;
}

function updateUIForLoggedOut() {
  document.getElementById('authLink').style.display = 'inline';
  document.getElementById('userInfo').style.display = 'none';
}

function openAuthModal() {
  if (currentUser) {
    return;
  }
  openModal('loginModal');
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  document.getElementById('loginError').style.display = 'none';
  document.getElementById('signupError').style.display = 'none';
  document.getElementById('signupSuccess').style.display = 'none';
}

function switchModal(fromModal, toModal) {
  closeModal(fromModal);
  setTimeout(function() { openModal(toModal); }, 200);
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorMsg = document.getElementById('loginError');

  const users = getUsers();
  const user = users.find(function(u) { return u.email === email && u.password === password; });

  if (user) {
    currentUser = user;
    localStorage.setItem('tescoCurrentUser', JSON.stringify(user));
    updateUIForLoggedIn();
    closeModal('loginModal');
    document.getElementById('loginForm').reset();
  } else {
    errorMsg.textContent = 'Invalid email or password';
    errorMsg.style.display = 'block';
  }
}

function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const phone = document.getElementById('signupPhone').value;
  const errorMsg = document.getElementById('signupError');
  const successMsg = document.getElementById('signupSuccess');

  if (password !== confirm) {
    errorMsg.textContent = 'Passwords do not match';
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = 'Password must be at least 6 characters';
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    return;
  }

  const users = getUsers();
  
  if (users.find(function(u) { return u.email === email; })) {
    errorMsg.textContent = 'Email already registered';
    errorMsg.style.display = 'block';
    successMsg.style.display = 'none';
    return;
  }

  const newUser = { name: name, email: email, password: password, phone: phone };
  users.push(newUser);
  saveUsers(users);

  currentUser = newUser;
  localStorage.setItem('tescoCurrentUser', JSON.stringify(newUser));
  
  successMsg.textContent = 'Account created successfully!';
  successMsg.style.display = 'block';
  errorMsg.style.display = 'none';

  setTimeout(function() {
    updateUIForLoggedIn();
    closeModal('signupModal');
    document.getElementById('signupForm').reset();
  }, 1500);
}

function logout() {
  currentUser = null;
  localStorage.removeItem('tescoCurrentUser');
  updateUIForLoggedOut();
}

window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
}

function calculatePayment() {
  const amount = parseFloat(document.getElementById("amount").value);
  const months = parseFloat(document.getElementById("months").value);
  const years = parseFloat(document.getElementById("years").value);
  const interest = parseFloat(document.getElementById("interest").value) / 100;

  if (isNaN(amount) || isNaN(months) || isNaN(years) || isNaN(interest)) {
    document.getElementById("output").innerText = "Please enter valid numbers.";
    return;
  }

  const totalMonths = months + (years * 12);
  const monthlyRate = interest / 12;
  
  if (monthlyRate === 0) {
    const payment = amount / totalMonths;
    document.getElementById("output").innerText = "Monthly Payment: KES " + payment.toFixed(2);
    return;
  }

  const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
  document.getElementById("output").innerText = "Monthly Payment: KES " + payment.toFixed(2);
}

checkLoginStatus();
