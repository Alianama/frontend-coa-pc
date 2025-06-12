import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/common/mode-toggle";
import { useNavigate } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Layout({ children, title, items = [] }) {
  const navigate = useNavigate();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background backdrop-blur-sm px-4 lg:h-16">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-sm font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 px-5 overflow-auto">
          <Breadcrumb className="mt-4">
            <BreadcrumbList>
              {items.map((item, index) => (
                <div
                  className="flex items-center gap-2 justify-center"
                  key={index}
                >
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(item.href);
                      }}
                    >
                      {item.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < items.length - 1 && <BreadcrumbSeparator />}
                </div>
              ))}
              {items.length > 0 && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="cursor-pointer text-primary">
                      {title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="container mx-auto py-6 animate-in">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
