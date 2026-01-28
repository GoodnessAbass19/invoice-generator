import TraderDashboardayout from "@/components/layout/dashboard-layout";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { UserProvider } from "@/hooks/user-context";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const token = cookieStore.get("token-234")?.value;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider token={token}>
        <TraderDashboardayout defaultOpen={defaultOpen}>
          {children}
        </TraderDashboardayout>
      </UserProvider>
    </ThemeProvider>
  );
}
