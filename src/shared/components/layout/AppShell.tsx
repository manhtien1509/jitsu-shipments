import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";

// AppShell.tsx
export function AppShell() {
  return (
    <div className="h-full flex flex-col">
      {/* Desktop: TopNav trên cùng */}
      <div className="hidden md:block">
        <TopNav />
      </div>

      <main className="flex-1 overflow-hidden pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile: Bottom Tab Bar */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
