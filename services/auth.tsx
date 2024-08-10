"use client";
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; 

const TOKEN_KEY = 'finance_manager_token';
export const saveCookie = (token: string) => {
  Cookies.set(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) ?? null;
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};