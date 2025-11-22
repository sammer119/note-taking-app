"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { AuthPage } from "@/components/auth/AuthPage";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Load test function for debugging
    import("@/lib/test-supabase").then((module) => {
      (window as any).testSupabase = module.testSupabaseConnection;
      console.log("💡 Run testSupabase() in console to check Supabase setup");
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <MainLayout />;
}
