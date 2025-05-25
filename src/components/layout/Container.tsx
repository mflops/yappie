type Props = React.PropsWithChildren<object>;
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";

export default function Container({children} : Props) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1 h-full overflow-hidden p-2 gap-3 dark:bg-[#202020] pb-4">
                {children}
            </div>
        </SidebarProvider>
    )
}