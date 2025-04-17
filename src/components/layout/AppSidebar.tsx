import {Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarGroup} from '@/components/ui/sidebar';

export default function AppSidebar() {
    return (
        <Sidebar variant='floating' className='m-0 outline-0 border-0 ring-0'>
            <SidebarHeader/>
            <SidebarContent>
                <SidebarGroup/>
                <SidebarGroup/>
            </SidebarContent>
            <SidebarFooter/>
        </Sidebar>
    )
}