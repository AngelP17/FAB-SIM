import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, PlayCircle, Scale, Github, BookOpen, Settings } from "lucide-react";

interface ShellProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Shell({ children, currentPage, onNavigate }: ShellProps) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-mono">
              F
            </div>
            FAB-SIM
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500">v2.4.0-STABLE</div>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="px-4 space-y-2">
            <Button 
              variant={currentPage === 'overview' ? "secondary" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => onNavigate('overview')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button 
              variant={currentPage === 'simulator' ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => onNavigate('simulator')}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Testbed Simulator
            </Button>
            <Button 
              variant={currentPage === 'invariants' ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => onNavigate('invariants')}
            >
              <Scale className="mr-2 h-4 w-4" />
              Design Invariants
            </Button>
          </nav>
          
          <div className="px-4 py-4 mt-4 border-t border-slate-800/50">
             <h4 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Resources</h4>
             <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">
               <BookOpen className="mr-2 h-4 w-4" />
               API Reference
             </Button>
             <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">
               <Github className="mr-2 h-4 w-4" />
               GitHub Repo
             </Button>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-800">
           <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white">
             <Settings className="mr-2 h-4 w-4" />
             Settings
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 border-b border-slate-800 flex items-center px-4 justify-between">
           <div className="font-bold">FAB-SIM</div>
           {/* Mobile menu could go here, for now just simple title */}
        </header>
        
        <ScrollArea className="flex-1">
          <div className="container max-w-5xl mx-auto py-8 px-4 md:px-8">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
