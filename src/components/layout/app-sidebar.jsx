import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  FileText,
  Home,
  LogOut,
  ShieldCheck,
  User,
  Contact,
  History,
  BadgeDollarSign,
  Paperclip,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "@/components/common/logout";
import { useState } from "react";
import { useSelector } from "react-redux";
const sidebarConfig = {
  main: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      path: "/planning",
      label: "Planning Management",
      icon: FileText,
    },
    {
      path: "/coa-history",
      label: "COA History",
      icon: History,
    },
    {
      path: "/products",
      label: "Products",
      icon: BadgeDollarSign,
    },

    {
      path: "/customers",
      label: "Customers List",
      icon: Contact,
    },
    {
      path: "/trend",
      label: "Color Trend",
      icon: BarChart3,
    },
    {
      path: "/reports",
      label: "Reports",
      icon: Paperclip,
    },
  ],
  admin: [
    {
      path: "/roles",
      label: "Role Management",
      icon: ShieldCheck,
      permission: "manage:roles",
    },
    {
      path: "/users",
      label: "User Management",
      icon: User,
      permission: "manage:users",
    },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser);

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const renderMenuItems = (items) => {
    return items.map((item) => {
      const Icon = item.icon;
      return (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            onClick={() => handleNavigation(item.path)}
            isActive={isActive(item.path)}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
  };

  const [logoutIsOpen, setLogoutIsOpen] = useState(false);

  return (
    <>
      <Logout logoutIsOpen={logoutIsOpen} setLogoutIsOpen={setLogoutIsOpen} />
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="font-bold text-primary-foreground">C</span>
            </div>
            <div className="font-semibold">COA Creator</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(sidebarConfig.main)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {authUser?.role.name === "SUPER_ADMIN" && (
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {renderMenuItems(sidebarConfig.admin)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80
                 hover:text-primary-foreground rounded-md p-2 hover:scale-105 transition-all duration-300"
                onClick={() => setLogoutIsOpen(true)}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
