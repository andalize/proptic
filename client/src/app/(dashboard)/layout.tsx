"use client";
import { SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { Header } from "@/components/custom/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetProfile } from "@/hooks/api/users/profile";
import { getToken, removeToken, setToken } from "@/lib/token";
import { useQueryString } from "@/hooks/useQueryString";
import { ProfileDropdown } from "@/components/custom/header/profile-dropdown";
// import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // const isOnline = useNetworkStatus();
  const { isLoading, isSuccess } = useGetProfile();

  const { getQueryObject } = useQueryString();
  const queries = getQueryObject();
  const tokenQuery = queries["token"];

  useEffect(() => {
    const token = getToken();
    if ((!token && !tokenQuery) || (!isLoading && !isSuccess)) {
      removeToken();
      router.replace("/login");
    }
  }, [isSuccess, isLoading]);

  useEffect(() => {
    if (tokenQuery) {
      setToken(tokenQuery);
    }
  }, []);

  return (
    <SidebarProvider className="">
      <div className="print:hidden">
        <AppSidebar />
      </div>
      <div className="flex-1 min-h-screen bg-[#F1F2F4]">
        <div className="print:hidden mb-14 lg:mb-11">
          <Header
            isOnline={false}
            left={<SidebarTrigger />}
            right={<ProfileDropdown />}
          />
        </div>
        <main className="">{children}</main>
      </div>
    </SidebarProvider>
  );
}
