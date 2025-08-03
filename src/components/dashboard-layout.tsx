

'use client';

import React, { type ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Bot,
  FileText,
  Languages,
  LayoutDashboard,
  LogOut,
  Mic,
  PanelLeft,
  User,
} from 'lucide-react';
import Image from 'next/image';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lesson-plan', label: 'Lesson Plans', icon: BookOpen },
  { href: '/question-paper', label: 'Question Papers', icon: FileText },
  { href: '/voice-coaching', label: 'Voice Coach', icon: Mic },
  { href: '/chatbot', label: 'AI Assistant', icon: Bot },
];

function AppHeader() {
  const { isMobile, toggleSidebar } = useSidebar();
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'KA' : 'EN'));
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-8">
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="sm:hidden"
          >
            <PanelLeft className="size-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
        <h1 className="text-xl font-semibold font-headline">Shikshak Sahayak</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleLanguage}>
          <Languages className="size-5" />
          <span className="sr-only">Toggle Language</span>
          <span className="ml-2 font-semibold">{language}</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
               <User className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogOut className="mr-2 size-4" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Image src="https://placehold.co/32x32.png" alt="App Logo" width={32} height={32} data-ai-hint="logo book" className="rounded-md"/>
          <span className="text-base font-semibold font-headline">Shikshak Sahayak</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/login" passHref>
                <SidebarMenuButton tooltip="Logout">
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}


function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { state } = useSidebar();
  return (
      <div className="flex min-h-screen w-full bg-muted/40">
        <AppSidebar />
        <div className={cn("flex flex-col flex-1", state === 'expanded' ? "sm:ml-64" : "sm:ml-14")}>
            <AppHeader />
            <main className="flex-1">{children}</main>
        </div>
      </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
