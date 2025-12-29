"use client";

import { useAuth } from '@/hooks/use-auth';

export default function AdminPanelPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <p>Welcome, {user?.displayName || user?.email}! You can manage your portfolio from the sidebar.</p>
    </div>
  );
}
