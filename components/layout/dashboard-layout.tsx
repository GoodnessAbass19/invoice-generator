"use client";

import { useUser } from "@/hooks/user-context";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";

const TraderDashboardayout = ({
  children, // This is where your page.tsx content will be rendered
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) => {
  const user = useUser();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar
        name={user.admin?.name || ""}
        email={user.admin?.email || ""}
        logo={user.admin?.logo || ""}
      />
      <SidebarInset>
        <SidebarTrigger className="-ml-1" />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TraderDashboardayout;
