'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import backendUrl from 'environment';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Login failed');
        return;
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token stored:', data.token);
        await fetchDashboard();
        router.push('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${backendUrl}/dashboard`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error fetching dashboard:', errorData.message);
        return;
      }

      const data = await res.json();
      console.log('Dashboard data:', data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form className="w-full max-w-lg p-12 space-y-8" onSubmit={handleLogin}>
        <div className="flex justify-center mb-8">
          <Image
            className="h-10"
            src={"/logo/logo.png"}
            alt="Logo"
            height={40}
            width={40}
            layout="intrinsic"
          />
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-800" htmlFor="Email">Email</label>
            <input className="w-full px-4 py-3 mt-2 bg-rainy-blue text-ice-blue rounded shadow-sm bg-color-green-400 focus:outline-none sm:text-sm" name="Email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800" htmlFor="password">Password</label>
            <input className="w-full px-4 py-3 mt-2 bg-rainy-blue text-ice-blue rounded shadow-sm focus:outline-none sm:text-sm" type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 mb-0">
          <p className="text-sm text-zinc-700">Don't have an account?</p>
          <a href="./signup" className="text-sm font-medium text-petrol-blue">Sign up!</a>
        </div>
        <button id="button" type="submit" className="w-full px-4 py-3 mt-4 text-white bg-petrol-blue rounded cursor-pointer">Login</button>
      </form>
    </div>
  );
}
