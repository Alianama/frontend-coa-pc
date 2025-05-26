import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { asyncUnsetAuthUser } from "@/store/authUser/action";
import Logout from "@/components/logout";

// Konfigurasi menu sidebar
const sidebarConfig = {
  main: [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      path: "/coa",
      label: "COA Management",
      icon: FileText,
    },
    {
      path: "/coa/approval",
      label: "COA Approval",
      icon: ClipboardList,
    },
    {
      path: "/reports",
      label: "Reports",
      icon: BarChart3,
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
      path: "/settings",
      label: "Settings",
      icon: Settings,
      permission: "manage:roles",
    },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  // const logout = () => {
  //   dispatch(asyncUnsetAuthUser());
  //   navigate("/login");
  // };

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
          <form className="px-2 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <Input id="search" placeholder="Search..." className="pl-8 h-9" />
            </div>
          </form>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(sidebarConfig.main)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(sidebarConfig.admin)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleNavigation("/profile")}>
                <User className="h-4 w-4" />
                <span>{user?.fullName}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setLogoutIsOpen(true)}>
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
