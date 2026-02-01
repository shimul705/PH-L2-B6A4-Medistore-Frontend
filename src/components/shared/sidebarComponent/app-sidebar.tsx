'use client';

import * as React from 'react';
import {
    Bot,
    Settings,
    SquareTerminal,
    ShoppingCart,
    Package,
    Tag,
    User,
} from 'lucide-react';
import Link from 'next/link';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import Image from 'next/image';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

// User Navigation Items (Customer/Seller)
const USER_NAV_ITEMS = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: SquareTerminal,
        isActive: true,
    },
    {
        title: 'My Orders',
        url: '/dashboard/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Profile',
        url: '/profile',
        icon: Settings,
    },
];

// Admin Navigation Items
const ADMIN_NAV_ITEMS = [
    {
        title: 'Admin Dashboard',
        url: '/dashboard',
        icon: SquareTerminal,
        isActive: true,
    },
    {
        title: 'Management',
        url: '#',
        icon: Bot,
        items: [
            { title: 'Categories', url: '/dashboard/categories', icon: Tag },
            { title: 'Medicines', url: '/dashboard/medicines', icon: Package },
            { title: 'Orders', url: '/dashboard/orders', icon: ShoppingCart },
            { title: 'Users', url: '/dashboard/users', icon: User },
        ],
    },
    {
        title: 'Profile',
        url: '/profile',
        icon: Settings,
    },
];



interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    userRole: 'user' | 'admin'; // Role-based prop
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <LogoHeader />
            </SidebarHeader>

            <SidebarContent>
                {/* Main Navigation */}
                <NavMain items={userRole === 'admin' ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS} />

                {/* Common Secondary Navigation */}
                {/* <div className="mt-4">
          <NavMain items={COMMON_SECONDARY_ITEMS} />
        </div> */}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

const LogoHeader = () => (
    <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                    <div className="relative h-10 w-28">
                        <Image
                            src="https://i.ibb.co.com/q301vwPr/image.png"
                            alt="MediStore Logo"
                            fill
                            className="object-contain"
                            sizes="112px"
                        />
                    </div>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
);