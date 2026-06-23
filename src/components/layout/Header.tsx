import { Bell, Menu, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu button placeholder */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight text-foreground md:hidden">
          Code Bondhu ERP
        </h1>
        <h1 className="hidden text-xl font-bold tracking-tight text-foreground md:block">
          Code Bondhu ERP
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-full bg-background pl-8"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
