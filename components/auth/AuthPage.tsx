'use client';

import { LoginForm } from './LoginForm';

// Set to true to allow public signups, false for login-only
const ALLOW_SIGNUPS = false;

export function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
