"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SidebarProvider, Sidebar, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Wrench, UserCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const adminUid = 'emM4KrlWNMR9Vhh7uCMmH5D6t362';

  useEffect(() => {
    if (loading) {
      return; 
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.uid !== adminUid) {
      toast({
        title: 'Not Authorized',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
      router.push('/'); // Redirect non-admin users away
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [user, loading, router, toast]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-foreground">{loading ? 'Loading...' : 'Authorizing...'}</div>
      </div>
    );
  }

  const navItems = [
    { href: '/portfolio-sam-pannel04', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/portfolio-sam-pannel04/projects', label: 'Projects', icon: FileText },
    { href: '/portfolio-sam-pannel04/skills', label: 'Skills', icon: Wrench },
    { href: '/portfolio-sam-pannel04/about', label: 'About', icon: UserCircle },
  ];

  return (
    <div className="bg-muted/40">
        <SidebarProvider>
        <Sidebar>
            <div className="flex h-full flex-col">
            <div className="p-4">
                <h2 className="text-xl font-semibold">Admin Panel</h2>
            </div>
            <SidebarMenu>
                {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <div className="mt-auto p-4">
                <Button onClick={handleSignOut} variant="outline" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
            </div>
        </Sidebar>
        <SidebarInset>
            {children}
        </SidebarInset>
        </SidebarProvider>
    </div>
  );
}
