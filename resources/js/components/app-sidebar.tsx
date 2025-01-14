"use client"

import * as React from "react"
import {
  Command,
  Frame, Home,
  LifeBuoy,
  Users,
  Shield,
  SquareTerminal,
  Lock,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Link, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    // {
    //   title: "Candidates",
    //   url: "/candidates",
    //   icon: Users,
    // },
    // {
    //   title: "Elections",
    //   url: "/elections",
    //   icon: Frame,
    // },
    // {
    //   title: "Voting Results",
    //   url: "/results",
    //   icon: SquareTerminal,
    // },
  ],
  navMaintenance: [
    // {
    //   title: "Voters",
    //   url: "/voters",
    //   icon: Users,
    // },
    {
      title: "User Management",
      url: "/users",
      icon: LifeBuoy,
    },
    {
      title: "Roles",
      url: "/roles",
      icon: Shield,
    },
    {
      title: "Permissions",
      url: "/permissions",
      icon: Lock,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;

    return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={route('dashboard')}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Lems</span>
                  <span className="truncate text-xs">Starter Kit</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} navTitle="Main" />
        <NavMain items={data.navMaintenance} navTitle="System" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={auth.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
