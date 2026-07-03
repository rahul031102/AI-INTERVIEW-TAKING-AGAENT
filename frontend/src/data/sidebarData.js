import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText,
  History,
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
];

export const bottomSidebarItems = [
  {
    id: 7,
    label: 'Logout',
    icon: LogOut,
    path: '/logout',
    badge: null,
  },
];
