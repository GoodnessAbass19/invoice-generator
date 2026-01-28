import { Blocks, BookText, Moon, Settings, Sun } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useTheme } from "next-themes";
import Link from "next/link";
import { NavUser } from "./nav-user";

const navItems = [
  {
    name: "Dashboard",
    icon: Blocks,
    href: "/dashboard",
  },
  {
    name: "Invoices",
    icon: BookText,
    href: "/dashboard/invoices",
  },
];

interface SidebarProps {
  name: string;
  email: string;
  logo: string;
  props?: React.ComponentProps<typeof Sidebar>;
}

export function AppSidebar({ name, email, logo, ...props }: SidebarProps) {
  const pathname = usePathname();
  // const [isOpen, setIsOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              className="data-[state=open]:text-sidebar-accent-foreground flex items-center gap-3 px-2 py-4 mb-6"
            >
              <span className="material-symbols-outlined text-4xl">
                receipt_long
              </span>
              <div className="flex flex-col">
                <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">
                  TraderDash
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Invoice Management
                </p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-medium">
            management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "w-full flex justify-start items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200",
                        // Highlight active HoverPrefetchLink based on pathname.startsWith for nested routes
                        pathname === item.href
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                          : "",
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase font-medium">
            system
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={"/your/store/dashboard/settings"}
                    className={cn(
                      "w-full flex justify-start items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 capitalize",
                      // Highlight active HoverPrefetchLink based on pathname.startsWith for nested routes
                      pathname === "/your/store/dashboard/settings"
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "",
                    )}
                  >
                    <Settings className="w-5 h-5" />
                    settings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  {open ? (
                    <div className="flex justify-between items-center px-3.5">
                      {/* <div className="flex justify-start items-center gap-1"> */}
                      {theme === "dark" ? (
                        <div className="flex justify-start items-center gap-1">
                          <Moon
                            className="w-5 h-5 mr-2 text-gray-700 dark:text-gray-300"
                            fill="none"
                            stroke="currentColor"
                          />
                          Dark mode
                        </div>
                      ) : (
                        <div className="flex justify-start items-center gap-1">
                          <Sun
                            className="w-5 h-5 mr-2 text-yellow-500"
                            fill="#eab308"
                            stroke="currentColor"
                          />
                          Light mode
                        </div>
                      )}

                      {/* </div> */}
                      <Switch
                        checked={theme === "dark"} // The switch is 'checked' if the theme is 'dark'
                        onCheckedChange={toggleTheme} // Calls the toggleTheme function when the switch state changes
                        className={cn()}
                      />
                    </div>
                  ) : (
                    <div>
                      {theme === "dark" ? (
                        <button
                          onClick={() => {
                            setTheme("light");
                          }}
                          className="bg-none outline-none rounded-none"
                        >
                          <Moon
                            className="w-5 h-5 text-gray-700 dark:text-gray-300"
                            fill="none"
                            stroke="currentColor"
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => setTheme("dark")}
                          className="bg-none outline-none rounded-none"
                        >
                          <Sun
                            className="w-5 h-5 text-yellow-500"
                            fill="#eab308"
                            stroke="currentColor"
                          />
                        </button>
                      )}
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser name={name} avatar={logo} email={email} />
      </SidebarFooter>
    </Sidebar>
  );
}
