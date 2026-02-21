import { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import {
  LayoutDashboard, BookOpen, Code2, FlaskConical, TrendingUp,
  LogOut, ChevronRight, Flame, UserPlus, LogIn
} from 'lucide-react';
import AIChat from './AIChat';
import AuthDialog from './AuthDialog';
import logoImg from '@/assets/dsaforge-logo.jpeg';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Curriculum', path: '/curriculum' },
  { icon: Code2, label: 'Code Editor', path: '/editor' },
  { icon: FlaskConical, label: 'Practice', path: '/practice' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
];

function AppSidebarInner() {
  const { user, profile, signOut } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="py-4 px-3">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-border"
            style={{ boxShadow: 'var(--glow-cyan)' }}>
            <img src={logoImg} alt="DSA Forge" className="w-full h-full object-cover" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="font-bold text-sm gradient-text-brand">DSA Forge</div>
              <div className="text-xs text-muted-foreground">Learn. Code. Master.</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="px-2 gap-1">
          {NAV_ITEMS.map(item => {
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  <NavLink to={item.path} end={item.path === '/'}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/15 text-primary font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}>
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                    {!isCollapsed && isActive && <ChevronRight className="ml-auto w-3 h-3 text-primary" />}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer - only show user info when logged in */}
      {user && profile && (
        <SidebarFooter className="px-2 py-3 border-t border-sidebar-border">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
              style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}>
              {profile?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{profile?.username || 'User'}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber" />
                  <span>{profile?.streak_count || 0} day streak</span>
                </div>
              </div>
            )}
            {!isCollapsed && (
              <button onClick={signOut} className="text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const currentTopicMatch = location.pathname.match(/\/curriculum\/([^/]+)/);
  const currentTopicId = currentTopicMatch?.[1];

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebarInner />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0"
            style={{ background: 'hsl(var(--card))' }}>
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex-1" />

            {/* Auth buttons or user info */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                    style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}>
                    {profile?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-muted-foreground hidden sm:inline">{profile?.username || 'User'}</span>
                </div>
                <button onClick={signOut}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-lg hover:bg-muted">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openAuth('signin')}
                  className="text-muted-foreground hover:text-foreground gap-1.5">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
                <Button size="sm" onClick={() => openAuth('signup')}
                  style={{ background: 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}
                  className="gap-1.5">
                  <UserPlus className="w-4 h-4" />
                  Register
                </Button>
              </div>
            )}

            {/* AI Chat Button */}
            <button onClick={() => setChatOpen(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                chatOpen ? 'opacity-80' : ''
              }`}
              style={{ background: chatOpen ? 'var(--gradient-purple)' : 'var(--gradient-cyan)', color: 'hsl(var(--primary-foreground))' }}>
              <span className="ai-pulse">●</span>
              AI Assistant
            </button>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      <AIChat
        currentTopicId={currentTopicId}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultMode={authMode} />
    </SidebarProvider>
  );
}
