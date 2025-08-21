import { Home, BookOpen, TrendingUp, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "#", icon: BookOpen, label: "Courses" },
    { href: "#", icon: TrendingUp, label: "Progress" },
    { href: "#", icon: User, label: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return item.href === "#" ? (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center py-3 ${
                isActive ? "text-primary" : "text-textSecondary"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center py-3 ${
                isActive ? "text-primary" : "text-textSecondary"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
