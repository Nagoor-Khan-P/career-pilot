
/**
 * Simple mock authentication utilities using localStorage.
 */

const AUTH_USER_KEY = 'careerpilot_current_user';
const USERS_DB_KEY = 'careerpilot_users';

export interface User {
  id: string;
  email: string;
  name: string;
}

export const getStoredUsers = (): any[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_DB_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(AUTH_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const signup = (email: string, name: string) => {
  const users = getStoredUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }
  const newUser = { id: crypto.randomUUID(), email, name };
  localStorage.setItem(USERS_DB_KEY, JSON.stringify([...users, newUser]));
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

export const login = (email: string) => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('User not found. Please sign up.');
  }
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};
