'use client';

const ADMIN_AUTH_KEY = 'starry_admin_authenticated';
const ADMIN_PIN_KEY = 'starry_admin_pin';
const DEFAULT_PIN = '1234';

export const getAdminPin = (): string => {
  if (typeof window === 'undefined') return DEFAULT_PIN;
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
};

export const setAdminPin = (newPin: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_PIN_KEY, newPin);
};

export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

export const loginAdmin = (inputPin: string): boolean => {
  if (typeof window === 'undefined') return false;
  const currentPin = getAdminPin();
  if (inputPin.trim() === currentPin) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
};
