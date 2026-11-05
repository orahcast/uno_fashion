declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }

  export type LucideIcon = React.ComponentType<LucideProps>;

  export const ArrowRight: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Menu: LucideIcon;
  export const X: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Heart: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const Calendar: LucideIcon;
  export const Clock: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Lock: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Shirt: LucideIcon;
  export const Users: LucideIcon;
  export const Sparkles: LucideIcon;
  export const BarChart3: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Settings: LucideIcon;
  export const Bell: LucideIcon;
  export const Search: LucideIcon;
  export const ScanLine: LucideIcon;
  export const Plus: LucideIcon;
  export const Shield: LucideIcon;
  export const LayoutList: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const Trash2: LucideIcon;
  export const Edit: LucideIcon;
  export const Info: LucideIcon;
  export const Upload: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Mail: LucideIcon;
  export const Phone: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Minus: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Instagram: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Package: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const LogOut: LucideIcon;
  export const Pencil: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Eye: LucideIcon;
  export const Download: LucideIcon;
}
