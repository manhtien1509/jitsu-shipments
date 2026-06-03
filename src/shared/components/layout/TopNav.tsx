import { NavLink } from 'react-router-dom';
import { Package } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const tabs = [
  { to: '/shipments', label: 'Shipments' },
  { to: '/assignments', label: 'Assignments' },
];

export function TopNav() {
  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center px-6 gap-6">
      <div className="flex items-center gap-2 font-semibold text-neutral-900">
        <Package className="w-5 h-5 text-primary-600" />
        Jitsu Logistics
      </div>

      <nav className="flex items-center gap-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100',
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}