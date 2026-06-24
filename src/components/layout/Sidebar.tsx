import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  Tag,
  BarChart,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

// eslint-disable-next-line react-refresh/only-export-components
export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Purchases", href: "/purchases", icon: ShoppingCart },
  { name: "Sales", href: "/sales", icon: Tag },
  { name: "Reports", href: "/reports", icon: BarChart },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  return (
    <div className="flex h-full w-full flex-col border-r bg-card text-card-foreground shadow-sm">
      <div className={`flex h-16 shrink-0 items-center border-b px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground truncate">ERP Menu</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
        >
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>
      <div className={`flex flex-1 flex-col overflow-y-auto py-6 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center rounded-md py-2.5 text-sm font-medium transition-all duration-200 ${
                  isCollapsed ? 'justify-center px-2' : 'px-3'
                } ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon
                className={`shrink-0 transition-all duration-200 ${
                  isCollapsed ? 'h-6 w-6' : 'mr-3 h-5 w-5'
                }`}
                aria-hidden="true"
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
