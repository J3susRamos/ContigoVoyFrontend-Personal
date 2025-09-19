export interface NavLink {
  name: string;
  link: string;
}

export interface NavItem {
  name: string;
  link: string;
  isButton?: boolean;
  dropList?: NavLink[];
}

export interface DesktopNavProps {
  navItems: NavItem[];
}
