import { NavLink } from "react-router-dom";
import { Package, ClipboardList } from "lucide-react";
import { cn } from "@/shared/lib/cn";

const tabs = [
  { to: "/shipments", label: "Shipments", icon: Package },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-neutral-200 flex items-center justify-around z-40 safe-area-inset-bottom">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs",
              isActive ? "text-primary-600" : "text-neutral-500",
            )
          }
        >
          <tab.icon className="w-5 h-5" />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
