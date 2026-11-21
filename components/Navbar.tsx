"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  ShieldAlert,
  Building2,
  FilePlus2,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, isAdmin, signInWithGoogle, signOut, switchDemoRole, isDemoMode } =
    useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      name: "Report an Issue",
      href: "/report",
      icon: FilePlus2,
      badge: "AI Powered",
    },
    {
      name: "Citizen Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Admin Console",
      href: "/admin",
      icon: Building2,
      adminOnly: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl text-slate-900 hover:text-civic-700 transition-colors focus-visible:ring-2 focus-visible:ring-civic-600 rounded-md p-1"
              aria-label="CivicResolve Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-civic-600 to-civic-800 flex items-center justify-center text-white shadow-md shadow-civic-600/20">
                <ShieldCheck className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight font-extrabold tracking-tight bg-gradient-to-r from-civic-800 to-civic-600 bg-clip-text text-transparent">
                  CivicResolve
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                  AI Civic Resolution
                </span>
              </div>
            </Link>

            {/* Demo / Sandbox Indicator Pill */}
            {isDemoMode && (
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 mr-1 text-amber-600" aria-hidden="true" />
                Demo Sandbox
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1.5"
          >
            {navLinks.map((link) => {
              if (link.adminOnly && !isAdmin) return null;
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-civic-50 text-civic-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1 text-[10px] bg-civic-100 text-civic-800 px-1.5 py-0.2 rounded font-semibold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Role Switcher & Auth Section */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Role Switcher for instant testing */}
            <div
              className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium"
              role="group"
              aria-label="Switch User Role for Evaluation"
            >
              <button
                type="button"
                onClick={() => switchDemoRole("citizen")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  role === "citizen"
                    ? "bg-white text-civic-700 font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
                aria-pressed={role === "citizen"}
              >
                Citizen Role
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole("admin")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  role === "admin"
                    ? "bg-civic-700 text-white font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
                aria-pressed={role === "admin"}
              >
                Admin Role
              </button>
            </div>

            {/* Auth status & user details */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-800 truncate max-w-[140px]">
                    {user.displayName || user.email}
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 capitalize">
                    {user.role} Account
                  </div>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-civic-600 hover:bg-civic-700 rounded-lg shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-civic-600"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-civic-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3">
          <nav aria-label="Mobile Navigation" className="space-y-1">
            {navLinks.map((link) => {
              if (link.adminOnly && !isAdmin) return null;
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium",
                    isActive
                      ? "bg-civic-50 text-civic-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] bg-civic-100 text-civic-800 px-2 py-0.5 rounded font-semibold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Role Switcher */}
          <div className="pt-2 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-2">
              Evaluation Role Switcher
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  switchDemoRole("citizen");
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "py-2 px-3 rounded-lg border text-center font-semibold",
                  role === "citizen"
                    ? "bg-civic-50 border-civic-300 text-civic-800"
                    : "border-slate-200 text-slate-600"
                )}
              >
                Citizen Role
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole("admin");
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "py-2 px-3 rounded-lg border text-center font-semibold",
                  role === "admin"
                    ? "bg-civic-700 text-white border-civic-700"
                    : "border-slate-200 text-slate-600"
                )}
              >
                Admin Role
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
