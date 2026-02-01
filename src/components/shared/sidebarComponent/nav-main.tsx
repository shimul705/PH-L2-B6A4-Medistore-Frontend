"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useState } from "react";

export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
            icon?: LucideIcon;
        }[];
    }[];
}) {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (title: string) => {
        setOpenItems(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <div
                            className="flex items-center w-full cursor-pointer"
                            onClick={() => item.items?.length && toggleItem(item.title)}
                        >
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                className="flex-1 hover:bg-secondary"
                            >
                                <Link
                                    href={item.items?.length ? "#" : item.url}
                                    className="flex items-center"
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>

                            {item.items?.length && (
                                <span className="px-2">
                                    {openItems[item.title] ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </span>
                            )}
                        </div>

                        {item.items?.length && (
                            <Collapsible open={openItems[item.title]}>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={subItem.url} className="flex items-center pl-8">
                                                        {subItem.icon && (
                                                            <subItem.icon className="mr-2 h-4 w-4" />
                                                        )}
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}