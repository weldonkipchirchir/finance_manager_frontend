"use client";
import Cookies from 'js-cookie';
import { NextRequest } from 'next/server';
import { jwtVerify } from "jose";

const TOKEN_KEY: string = process.env.NEXT_TOKEN_NAME || '';
export const saveCookie = (token: string) => {
  Cookies.set(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) ?? null;
};

export const getUserFromToken = async(req: NextRequest) => {
  const token = req.cookies.get(TOKEN_KEY)?.value;
  if (!token) return null;
  console.log(token)

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_SECRET_KEY));    
      return payload as { exp: number };
    } catch (e) {
    return null;
  }
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};
