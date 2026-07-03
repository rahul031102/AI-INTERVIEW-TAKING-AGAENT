import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  FileText,
  History,
  Settings,
  LogOut
} from 'lucide-react';

export const sidebarItems = [
  {
    id: 1,
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    badge: null,
  },
  {
    id: 2,
    label: 'Start Interview',
    icon: MessageSquare,
    path: '/interview',
    badge: null,
  },
  {
    id: 3,
    label: 'Resume Analyzer',
    icon: FileText,
    path: '/resume-analyzer',
    badge: 'new',
  },
  {
    id: 4,
    label: 'Interview History',
    icon: History,
    path: '/history',
    badge: null,
  },
  {
    id: 5,
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    badge: null,
  },
];

export const bottomSidebarItems = [
  {
    id: 6,
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    badge: null,
  },
  {
    id: 7,
    label: 'Logout',
    icon: LogOut,
    path: '/logout',
    badge: null,
  },
];
