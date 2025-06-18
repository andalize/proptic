import {
  Calendar,
  LayoutDashboard,
  Users as Tenants,
  Warehouse,
  Search,
  Settings
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/receptionist",
    icon: LayoutDashboard,
  },
  {
    title: "Tenants",
    url: "/receptionist/tenants",
    icon: Tenants,
  },
  {
    title: "Rental Units",
    url: "/receptionist/property-units",
    icon: Warehouse,
  },
 

]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
         <h2>La Casa</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General  </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}