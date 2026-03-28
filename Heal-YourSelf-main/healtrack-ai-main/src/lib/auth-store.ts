export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const USERS_KEY = 'woundguard-users';
const SESSION_KEY = 'woundguard-session';

function getUsers(): Record<string, { name: string; email: string; password: string; role: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function register(name: string, email: string, password: string, role: string = 'patient'): User | string {
  const users = getUsers();
  if (users[email]) return 'Email already registered';
  if (password.length < 6) return 'Password must be at least 6 characters';
  users[email] = { name, email, password, role };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const user = { id: email, name, email, role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function login(email: string, password: string): User | string {
  const users = getUsers();
  const u = users[email];
  if (!u) return 'No account found with this email';
  if (u.password !== password) return 'Incorrect password';
  const user = { id: email, name: u.name, email, role: u.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
