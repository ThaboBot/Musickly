'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  BrainCircuit,
  Camera,
  GitBranch,
  LayoutDashboard,
  LogIn,
  MicVocal,
  Music4,
  Rocket,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './icons';

const menuItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/inspiration',
    label: 'Inspiration',
    icon: Sparkles,
  },
  {
    href: '/lyrics-generator',
    label: 'Lyrics Generator',
    icon: Music4,
  },
  {
    href: '/mindfulness',
    label: 'Mindfulness',
    icon: BrainCircuit,
  },
  {
    href: '/voice-to-music',
    label: 'Voice-to-Music',
    icon: MicVocal,
  },
  {
    href: '/neural-remix',
    label: 'Neural Remix',
    icon: GitBranch,
  },
  {
    href: '/camera-to-theme',
    label: 'Camera to Theme',
    icon: Camera,
  },
  {
    href: '/features',
    label: 'Features Roadmap',
    icon: Rocket,
  },
];

export function AppSidebarContent() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <NextLink href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </NextLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/login'}
              tooltip={{ children: 'Login' }}
            >
              <NextLink href="/login">
                <LogIn />
                <span>Login</span>
              </NextLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/register'}
              tooltip={{ children: 'Register' }}
            >
              <NextLink href="/register">
                <UserPlus />
                <span>Register</span>
              </NextLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
