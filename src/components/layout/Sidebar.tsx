import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  Tag,
  BarChart,
} from "lucide-react";

export const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Purchases", href: "/purchases", icon: ShoppingCart },
  { name: "Sales", href: "/sales", icon: Tag },
  { name: "Reports", href: "/reports", icon: BarChart },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-full flex-col border-r bg-card text-card-foreground shadow-sm">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">ERP Menu</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
