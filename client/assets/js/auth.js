import { apiRequest } from './api.js';
import { showToast } from './toast.js';

export function getUser() {
  const userStr = localStorage.getItem('pk_user');
  return userStr ? JSON.parse(userStr) : null;
}

export function getToken() {
  return localStorage.getItem('pk_token');
}

export function isAuthenticated() {
  return !!getToken();
}

export function checkAuth(requiredRole = null) {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }

  const user = getUser();
  if (requiredRole && user.role !== requiredRole) {
    showToast(`Access Denied: ${requiredRole} role required`, 'error');
    return false;
  }

  return true;
}

export function renderUserSidebar() {
  const user = getUser();
  if (!user) return;

  const avatarEl = document.getElementById('user-avatar');
  const nameEl = document.getElementById('user-name');
  const roleEl = document.getElementById('user-role-badge');

  if (avatarEl) avatarEl.src = user.avatarUrl || 'https://ui-avatars.com/api/?name=User';
  if (nameEl) nameEl.textContent = user.name || 'Agent User';
  if (roleEl) roleEl.textContent = user.role || 'Observer';

  // Toggle admin-only UI elements
  if (user.role !== 'Admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  }
}

export function logout() {
  localStorage.removeItem('pk_token');
  localStorage.removeItem('pk_user');
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = '/login.html';
  }, 500);
}
