"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Load test function for debugging
    import("@/lib/test-supabase").then((module) => {
      (window as any).testSupabase = module.testSupabaseConnection;
      console.log("💡 Run testSupabase() in console to check Supabase setup");
    });
  }, []);

  return <MainLayout />;
}
