"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NewUser as NewUserType } from "@/interfaces/interfaces";
import { toast } from "react-hot-toast";

export function Register() {
  const [formData, setFormData] = useState<NewUserType>({
    username: "",
    email: "",
    password_hash: ""
  });
  const [error, setError] = useState("");
  const [status, setStatus] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password_hash.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setStatus(true);
    console.log('url',  process.env.NEXT_PUBLIC_API_URL);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 201) {
        setStatus(false);
        toast.success("Registration successful");
        window.location.href = "/auth/login";
      } else {
        setStatus(false);
        setError(data.message);
        // toast.error(await res.text());
      }
    } catch (err: any) {
      setStatus(false);
      console.log(err);
      toast.error(err.message || "An error occurred");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground">Create an account to manage your finances.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password_hash">Password</Label>
          <Input
            id="password_hash"
            name="password_hash"
            type="password"
            value={formData.password_hash}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          {
          error && 
          <div className="text-red-500 text-sm">{error}</div>
        }
        </div>
        <Button type="submit" className="w-full">
          {status? 'Signing Up' : 'Sign Up'}
        </Button>
      </form>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline" prefetch={false}>
          Log in
        </Link>
      </div>
    </div>
  );
}
