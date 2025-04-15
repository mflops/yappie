import {Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarGroup} from '@/components/ui/sidebar';

export default function AppSidebar() {
    return (
        <Sidebar variant='floating'>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}