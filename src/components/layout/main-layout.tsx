"use client";

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/portfolio-sam-pannel04');
  const isLoginPage = pathname === '/login';

  if (isLoginPage || isAdminPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
