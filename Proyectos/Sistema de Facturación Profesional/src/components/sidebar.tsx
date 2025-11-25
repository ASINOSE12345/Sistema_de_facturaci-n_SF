import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Clock,
  FileText,
  BarChart3,
  Settings,
  Menu,
  Code,
  Globe,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'projects', label: 'Proyectos', icon: FolderOpen },
  { id: 'timesheet', label: 'Timesheet', icon: Clock },
  { id: 'invoices', label: 'Facturas', icon: FileText },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

export function Sidebar({ activeView, onViewChange, isOpen, onToggle }: SidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-10",
      isOpen ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center space-x-3", !isOpen && "justify-center")}>
            <div className="bg-blue-600 rounded-lg p-2">
              <Code className="h-6 w-6" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-lg font-semibold">jbCodingIoT</h1>
                <p className="text-sm text-slate-400">Sistema de Facturación</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-slate-700"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-white hover:bg-slate-700",
                activeView === item.id && "bg-slate-700",
                !isOpen && "justify-center px-2"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Button>
          );
        })}

        {/* Logout Button */}
        <div className="pt-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white hover:bg-red-600",
              !isOpen && "justify-center px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {isOpen && <span className="ml-3">Cerrar Sesión</span>}
          </Button>
        </div>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300">Multi-moneda habilitada</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              USD, EUR, ARS, MXN
            </div>
          </div>
        </div>
      )}
    </div>
  );
}