"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { IAppSidebarProps } from "@/interfaces/sidebar.interface";
import {
  ArchiveIcon,
  BackpackIcon,
  BoxIcon,
  BriefcaseBusiness,
  FileIcon,
  FileTextIcon,
  Home,
  LayersIcon,
  RowsIcon,
  Users
} from "lucide-react";
import * as React from "react";
import { MainNav } from "./nav-main";

import { useAuth } from "@/contexts/auth-context";
import { UserRoleEnum } from "@/enums/common.enum";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";

// This is sample data.
const data: IAppSidebarProps = {
  mainNav: [
    {
      name: "Home",
      url: "/",
      icon: Home,
      isActive: true,
      visibleProps: {
        bothRoles: true,
      },
    },
    {
      name: "Asset Types",
      url: "/asset-types",
      icon: BackpackIcon,
      isActive: true,
      visibleProps: {
        bothRoles: true,
      },
    },
    {
      name: "Departments",
      url: "/departments",
      icon: LayersIcon,
      isActive: true,
      visibleProps: {
        bothRoles: true,
      },
    },
    {
      name: "Depreciation Calculations",
      url: "/depreciation-calculations",
      icon: ArchiveIcon,
      isActive: true,
      visibleProps: {
        bothRoles: true,
      },
    },
    {
      name: "Employees",
      url: "/employees",
      icon: BriefcaseBusiness,
      isActive: true,
      visibleProps: {
        userRole: UserRoleEnum.USER,
      },
    },
    {
      name: "Fixed Assets",
      url: "/fixed-assets",
      icon: BoxIcon,
      isActive: true,
      visibleProps: {
        bothRoles: true,
      },
    },
    {
      name: "Inventory Types",
      url: "/inventory-types",
      icon: RowsIcon,
      isActive: true,
      visibleProps: {
        bothRoles: true,
      },
    },
    {
      name: "Journal Entries",
      url: "/journal-entries",
      icon: FileTextIcon,
      isActive: true,
      visibleProps: {
        bothRoles: true,
      },
    },
    {
      name: "Ledger Accounts",
      url: "/ledger-accounts",
      icon: FileIcon,
      isActive: true,
      visibleProps: {
        bothRoles: true,
      },
    },
    {
      name: "Users",
      url: "/users",
      icon: Users,
      isActive: true,
      visibleProps: {
        userRole: UserRoleEnum.USER,
      },
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <MainNav
          items={data.mainNav.filter((nav) =>
            !user?.uuid
              ? nav.visibleProps?.default
              : nav.visibleProps?.userRole == user.role ||
                nav.visibleProps?.bothRoles
          )}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
