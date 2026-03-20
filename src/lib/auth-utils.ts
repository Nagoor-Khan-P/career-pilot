/**
 * Simple mock authentication utilities using localStorage.
 * Now supports username, password, and profile details.
 */

const AUTH_USER_KEY = 'careerpilot_current_user';
const USERS_DB_KEY = 'careerpilot_users';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface StoredUser extends User {
  password: string;
}

export const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_DB_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(AUTH_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const signup = (username: string, password: string, firstName: string, lastName: string): User => {
  if (!username || !password || !firstName || !lastName) {
    throw new Error('All fields are required');
  }
  
  const users = getStoredUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Username is already taken');
  }
  
  const newUser: StoredUser = { 
    id: crypto.randomUUID(), 
    username, 
    password,
    firstName,
    lastName
  };
  
  localStorage.setItem(USERS_DB_KEY, JSON.stringify([...users, newUser]));
  
  // Store session without sensitive password data
  const sessionUser: User = { 
    id: newUser.id, 
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName
  };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
  
  return sessionUser;
};

export const login = (username: string, password: string): User => {
  const users = getStoredUsers();
  const user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && 
    u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid username or password');
  }
  
  const sessionUser: User = { 
    id: user.id, 
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
  };
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
  
  return sessionUser;
};

export const logout = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};
