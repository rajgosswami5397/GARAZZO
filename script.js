// Global state
let currentPage = 'home';
let bookings = [
  {
    id: 'BK001',
    customerName: 'John Smith',
    customerPhone: '(555) 123-4567',
    customerEmail: 'john.smith@email.com',
    vehicleInfo: '2020 Toyota Camry',
    serviceType: 'Engine Repair',
    problemDescription: 'Engine making strange knocking noise when accelerating. Started yesterday morning.',
    location: '123 Main St, Downtown',
    urgency: 'urgent',
    status: 'pending',
    requestedDate: '2024-08-21',
    requestedTime: 'morning',
    submittedAt: '2024-08-21 09:30 AM'
  },
  {
    id: 'BK002',
    customerName: 'Sarah Johnson',
    customerPhone: '(555) 987-6543',
    customerEmail: 'sarah.j@email.com',
    vehicleInfo: '2019 Honda Civic',
    serviceType: 'Battery Jumpstart',
    problemDescription: 'Car won\'t start, battery seems completely dead. Lights don\'t work.',
    location: '456 Oak Ave, Uptown',
    urgency: 'emergency',
    status: 'accepted',
    requestedDate: '2024-08-21',
    requestedTime: 'anytime',
    submittedAt: '2024-08-21 10:15 AM'
  },
  {
    id: 'BK003',
    customerName: 'Mike Davis',
    customerPhone: '(555) 456-7890',
    customerEmail: 'mike.davis@email.com',
    vehicleInfo: '2018 Ford F-150',
    serviceType: 'Tire Replacement',
    problemDescription: 'Front left tire has a flat, nail puncture visible.',
    location: '789 Pine Rd, Westside',
    urgency: 'same-day',
    status: 'pending',
    requestedDate: '2024-08-21',
    requestedTime: 'afternoon',
    submittedAt: '2024-08-21 11:45 AM'
  },
  {
    id: 'BK004',
    customerName: 'Lisa Wilson',
    customerPhone: '(555) 321-0987',
    customerEmail: 'lisa.wilson@email.com',
    vehicleInfo: '2021 BMW X3',
    serviceType: 'Emergency Towing',
    problemDescription: 'Vehicle broke down on highway, smoke coming from engine compartment.',
    location: 'Highway 101, Mile Marker 45',
    urgency: 'emergency',
    status: 'in-progress',
    requestedDate: '2024-08-21',
    requestedTime: 'anytime',
    submittedAt: '2024-08-21 12:20 PM'
  }
];

// Navigation functionality
// Note: The navigateTo function also handles Exit button clicks that redirect to home
function navigateTo(page) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.style.display = 'none');
  
  // Show selected page
  const selectedPage = document.getElementById(`${page}-page`);
  if (selectedPage) {
    selectedPage.style.display = 'block';
  }
  
  // Update navigation active state
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));
  
  const activeLink = document.querySelector(`[data-page="${page}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Show/hide navigation based on page
  const navbar = document.getElementById('navbar');
  if (page === 'login' || page === 'dashboard' || page === 'admin-dashboard') {
    navbar.style.display = 'none';
  } else {
    navbar.style.display = 'block';
  }
  
  currentPage = page;
  
  // Initialize page-specific functionality
  if (page === 'dashboard') {
    initializeDashboard();
  } else if (page === 'admin-dashboard') {
    initializeAdminDashboard();
  }
  
  // Set minimum date for booking form
  if (page === 'booking') {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('preferredDate').setAttribute('min', today);
  }
}

// Auth UI updates
function updateAuthUI() {
  const userStr = localStorage.getItem('user');
  const authButtons = document.getElementById('auth-buttons');
  if (!authButtons) return;

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      let dashboardPage = user.role === 'admin' ? 'admin-dashboard' : (user.role === 'mechanic' ? 'dashboard' : 'home');
      authButtons.innerHTML = `
        <span style="color: var(--foreground); margin-right: 15px; font-weight: 500;">Hi, ${user.name}</span>
        ${user.role !== 'customer' ? `<button class="btn btn-outline" onclick="navigateTo('${dashboardPage}')">Dashboard</button>` : ''}
        <button class="btn btn-destructive" onclick="logout()">Logout</button>
      `;
    } catch (e) {
      console.error('Error parsing user data:', e);
      logout();
    }
  } else {
    authButtons.innerHTML = `
      <button class="btn btn-outline" onclick="navigateTo('login')" id="login-btn">Login</button>
      <button class="btn btn-primary" onclick="navigateTo('booking')">Book Now</button>
    `;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthUI();
  navigateTo('home');
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
}

// Login/Register tab switching
function switchTab(tab) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-btn');
  
  tabs.forEach(t => t.classList.remove('active'));
  buttons.forEach(b => b.classList.remove('active'));
  
  document.getElementById(`${tab}-tab`).classList.add('active');
  document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
}

// Form handling
function handleFormSubmission(event, formType) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  
  switch (formType) {
    case 'booking':
      handleBookingSubmission(data);
      break;
    case 'login':
      handleLoginSubmission(data);
      break;
    case 'register':
      handleRegisterSubmission(data);
      break;
  }
}

function handleBookingSubmission(data) {
  // Validate required fields
  const requiredFields = ['fullName', 'email', 'phone', 'vehicleType', 'vehicleMake', 'vehicleModel', 'vehicleYear', 'serviceType', 'problemDescription', 'urgency', 'location'];
  const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
  
  if (missingFields.length > 0) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Create new booking
  const newBooking = {
    id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
    customerName: data.fullName,
    customerPhone: data.phone,
    customerEmail: data.email,
    vehicleInfo: `${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`,
    serviceType: data.serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    problemDescription: data.problemDescription,
    location: data.location,
    urgency: data.urgency,
    status: 'pending',
    requestedDate: data.preferredDate || 'Flexible',
    requestedTime: data.preferredTime || 'Anytime',
    submittedAt: new Date().toLocaleString()
  };
  
  bookings.push(newBooking);
  
  alert('Booking request submitted! We\'ll contact you shortly to confirm your appointment.');
  document.getElementById('bookingForm').reset();
  navigateTo('home');
}

async function handleLoginSubmission(data) {
  if (!data.loginEmail || !data.loginPassword) {
    alert('Please enter both email and password.');
    return;
  }
  
  try {
    const res = await fetch('http://127.0.0.1:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.loginEmail, password: data.loginPassword })
    });
    const result = await res.json();
    
    if (result.ok) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      updateAuthUI();
      alert(`Login successful! Welcome back, ${result.user.name}`);
      if (result.user.role === 'admin') navigateTo('admin-dashboard');
      else if (result.user.role === 'mechanic') navigateTo('dashboard');
      else navigateTo('home');
    } else {
      alert(result.error || 'Invalid email or password.');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Failed to connect to the server. Please check if the backend is running on port 5001.');
  }
}

async function sendOtp() {
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  
  if (!name || !email) {
    alert('Please enter your name and email address first.');
    return;
  }
  
  try {
    const res = await fetch('http://127.0.0.1:5001/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    
    const result = await res.json();
    if (result.ok) {
      document.getElementById('otpGroup').style.display = 'block';
      if (result.code) {
        alert(`Verification code sent! (TEST MODE: Your code is ${result.code})`);
      } else {
        alert('Verification code sent to your email! Please enter it below.');
      }
    } else {
      alert(result.error || 'Failed to send verification code.');
    }
  } catch (err) {
    console.error('Send OTP error:', err);
    alert('Failed to connect to the server.');
  }
}

async function handleRegisterSubmission(data) {
  const requiredFields = ['registerRole', 'registerName', 'registerEmail', 'registerPassword', 'confirmPassword'];
  const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
  
  if (missingFields.length > 0) {
    alert('Please fill in all required fields.');
    return;
  }
  
  if (data.registerPassword !== data.confirmPassword) {
    alert('Passwords don\'t match!');
    return;
  }
  
  if (!data.agreeTerms) {
    alert('Please agree to the Terms of Service and Privacy Policy.');
    return;
  }
  const otpGroup = document.getElementById('otpGroup');
  if (otpGroup.style.display !== 'block' || !data.registerOtp) {
    alert('Please request and enter a verification code first.');
    return;
  }

  try {
    const res = await fetch('http://127.0.0.1:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.registerName,
        email: data.registerEmail,
        password: data.registerPassword,
        role: data.registerRole,
        otp: data.registerOtp
      })
    });
    const result = await res.json();
    
    if (result.ok) {
      if (data.registerRole === 'mechanic') {
        alert('Mechanic Registration successful! Our team will review your application. Please log in.');
      } else {
        alert('Registration successful! Please log in to your new account.');
      }
      switchTab('login');
      document.getElementById('registerForm').reset();
    } else {
      alert(result.error || 'Registration failed.');
    }
  } catch (err) {
    console.error('Register error:', err);
    alert('Failed to connect to the server. Please check if the backend is running on port 5001.');
  }
}

function handleSocialLogin(provider) {
  alert(`${provider} login would be implemented here`);
}

// Dashboard functionality
function initializeDashboard() {
  updateDashboardStats();
  renderBookingsTable();
  setupDashboardFilters();
}

function updateDashboardStats() {
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    active: bookings.filter(b => b.status === 'accepted' || b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };
  
  document.querySelector('.stat-value:nth-of-type(1)').textContent = stats.total;
  document.querySelector('.stat-value.pending').textContent = stats.pending;
  document.querySelector('.stat-value.active').textContent = stats.active;
  document.querySelector('.stat-value.completed').textContent = stats.completed;
}

function renderBookingsTable(filteredBookings = bookings) {
  const tbody = document.querySelector('#bookingsTable tbody');
  tbody.innerHTML = '';
  
  if (filteredBookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--muted-foreground);">No bookings found matching your filters.</td></tr>';
    return;
  }
  
  filteredBookings.forEach(booking => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-family: monospace; font-size: 0.875rem;">${booking.id}</td>
      <td>
        <div class="customer-info">
          <div class="customer-name">
            <i class="fas fa-user" style="color: var(--muted-foreground); font-size: 0.875rem;"></i>
            <span>${booking.customerName}</span>
          </div>
          <div class="customer-phone">
            <i class="fas fa-phone" style="font-size: 0.75rem;"></i>
            <span>${booking.customerPhone}</span>
          </div>
        </div>
      </td>
      <td>
        <div class="vehicle-info">
          <i class="fas fa-car" style="color: var(--muted-foreground);"></i>
          <span>${booking.vehicleInfo}</span>
        </div>
      </td>
      <td>
        <div class="service-info">
          <div>${booking.serviceType}</div>
          <div class="problem-description" title="${booking.problemDescription}">
            ${booking.problemDescription}
          </div>
        </div>
      </td>
      <td>
        <span class="badge ${booking.urgency}">${booking.urgency}</span>
      </td>
      <td>
        <span class="badge ${booking.status}">${booking.status.replace('-', ' ')}</span>
      </td>
      <td>
        <div class="location-info" title="${booking.location}">
          <i class="fas fa-map-marker-alt" style="color: var(--muted-foreground); font-size: 0.875rem;"></i>
          <span>${booking.location}</span>
        </div>
      </td>
      <td>
        <div class="action-buttons">
          ${getActionButtons(booking)}
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function getActionButtons(booking) {
  switch (booking.status) {
    case 'pending':
      return `
        <button class="btn btn-sm btn-accept" onclick="updateBookingStatus('${booking.id}', 'accepted')">
          <i class="fas fa-check-circle"></i>
        </button>
        <button class="btn btn-sm btn-destructive" onclick="updateBookingStatus('${booking.id}', 'cancelled')">
          <i class="fas fa-times-circle"></i>
        </button>
      `;
    case 'accepted':
      return `
        <button class="btn btn-sm btn-start" onclick="updateBookingStatus('${booking.id}', 'in-progress')">
          Start Job
        </button>
      `;
    case 'in-progress':
      return `
        <button class="btn btn-sm btn-complete" onclick="updateBookingStatus('${booking.id}', 'completed')">
          Complete
        </button>
      `;
    default:
      return '';
  }
}

function updateBookingStatus(bookingId, newStatus) {
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = newStatus;
    updateDashboardStats();
    renderBookingsTable(getFilteredBookings());
  }
}

function setupDashboardFilters() {
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const urgencyFilter = document.getElementById('urgencyFilter');
  
  function applyFilters() {
    const filteredBookings = getFilteredBookings();
    renderBookingsTable(filteredBookings);
  }
  
  searchInput.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  urgencyFilter.addEventListener('change', applyFilters);
}

function getFilteredBookings() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const urgencyFilter = document.getElementById('urgencyFilter').value;
  
  return bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm) ||
                         booking.id.toLowerCase().includes(searchTerm) ||
                         booking.vehicleInfo.toLowerCase().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || booking.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app
  updateAuthUI();
  navigateTo('home');
  
  // Form event listeners
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => handleFormSubmission(e, 'booking'));
  }
  
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => handleFormSubmission(e, 'login'));
  }
  
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => handleFormSubmission(e, 'register'));
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileMenuBtn.contains(event.target) && !navMenu.contains(event.target)) {
      navMenu.style.display = 'none';
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    const navMenu = document.getElementById('navMenu');
    if (window.innerWidth > 768) {
      navMenu.style.display = 'flex';
    } else {
      navMenu.style.display = 'none';
    }
  });
});

// Utility functions
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function formatTime(time) {
  return time.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Admin Dashboard Functionality
function initializeAdminDashboard() {
  // Mock data for stats
  document.getElementById('adminTotalUsers').textContent = '24';
  document.getElementById('adminTotalMechanics').textContent = '8';
  document.getElementById('adminTotalBookings').textContent = bookings.length;
  document.getElementById('adminPendingBookings').textContent = bookings.filter(b => b.status === 'pending').length;
  
  renderAdminBookingsTable();
}

function renderAdminBookingsTable() {
  const tbody = document.querySelector('#adminBookingsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  if (bookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--muted-foreground);">No bookings found in the system.</td></tr>';
    return;
  }
  
  bookings.forEach(booking => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-family: monospace; font-size: 0.875rem;">${booking.id}</td>
      <td>
        <div class="customer-info">
          <div class="customer-name">
            <i class="fas fa-user" style="color: var(--muted-foreground); font-size: 0.875rem;"></i>
            <span>${booking.customerName}</span>
          </div>
          <div class="customer-phone">
            <i class="fas fa-phone" style="font-size: 0.75rem;"></i>
            <span>${booking.customerPhone}</span>
          </div>
        </div>
      </td>
      <td>
        <div class="vehicle-info">
          <i class="fas fa-car" style="color: var(--muted-foreground);"></i>
          <span>${booking.vehicleInfo}</span>
        </div>
      </td>
      <td>
        <div class="service-info">
          <div>${booking.serviceType}</div>
          <div class="problem-description" title="${booking.problemDescription}">
            ${booking.problemDescription}
          </div>
        </div>
      </td>
      <td>
        <span class="badge ${booking.urgency}">${booking.urgency}</span>
      </td>
      <td>
        <span class="badge ${booking.status}">${booking.status.replace('-', ' ')}</span>
      </td>
      <td>
        <div class="location-info" title="${booking.location}">
          <i class="fas fa-map-marker-alt" style="color: var(--muted-foreground); font-size: 0.875rem;"></i>
          <span>${booking.location}</span>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Export functions for global access
window.navigateTo = navigateTo;
window.toggleMobileMenu = toggleMobileMenu;
window.switchTab = switchTab;
window.handleSocialLogin = handleSocialLogin;
window.updateBookingStatus = updateBookingStatus;