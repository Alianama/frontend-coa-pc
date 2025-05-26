import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export default function Layout({ children, title }) {
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
          <div className="container mx-auto py-6 animate-in">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
