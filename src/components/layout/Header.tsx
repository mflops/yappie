import { Card } from "@/components/ui/card";
import { Bangers } from "next/font/google";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Link from "next/link";

type Props = React.PropsWithChildren<object>;
const bangers = Bangers({ weight: "400", style: "normal", subsets: ["latin"] });

export default function Header({ children }: Props) {
  return (
    <Card className="flex-row items-center justify-center bg-black shadow-[7px_7px_0px_#ffba00] p-4 outline-none border-none rounded-3xl dark:shadow-[7px_7px_0px_#758aef]">
      <div className="flex-1 flex-row flex items-center justify-start gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="text-white hover:bg-neutral-500 hover:!text-black w-9 h-9 rounded-xl dark:hover:bg-neutral-500"/>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`${cn("size-9")} hover:bg-neutral-500 group rounded-xl dark:hover:bg-neutral-500`}
              >
                <Link href={"/"}>
                  <SquarePen className="!w-6 !h-6 stroke-white group-hover:stroke-black stroke-[1.5]" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex-1 text-center">
        <h1
          className={`${bangers.className} text-amber-400 text-5xl  dark:text-[#758aef] `}
        >
          {children}
        </h1>
      </div>
      <div className="flex-1 flex items-center justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="bg-transparent w-11 h-11 hover:bg-neutral-500 rounded-2xl group" size="icon">
                <a href="https://www.github.com/mflops" target="_blank">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="0.9"
                    className="text-white group-hover:text-black transition-colors !w-8.5 !h-8.5"
                  >
                    {/* <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/> */}
                    {/* <g id="SVGRepo_iconCarrier">  */}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.475 2 2 6.475 2 12C2 16.425 4.8625 20.1625 8.8375 21.4875C9.3375 21.575 9.525 21.275 9.525 21.0125C9.525 20.775 9.5125 19.9875 9.5125 19.15C7 19.6125 6.35 18.5375 6.15 17.975C6.0375 17.6875 5.55 16.8 5.125 16.5625C4.775 16.375 4.275 15.9125 5.1125 15.9C5.9 15.8875 6.4625 16.625 6.65 16.925C7.55 18.4375 8.9875 18.0125 9.5625 17.75C9.65 17.1 9.9125 16.6625 10.2 16.4125C7.975 16.1625 5.65 15.3 5.65 11.475C5.65 10.3875 6.0375 9.4875 6.675 8.7875C6.575 8.5375 6.225 7.5125 6.775 6.1375C6.775 6.1375 7.6125 5.875 9.525 7.1625C10.325 6.9375 11.175 6.825 12.025 6.825C12.875 6.825 13.725 6.9375 14.525 7.1625C16.4375 5.8625 17.275 6.1375 17.275 6.1375C17.825 7.5125 17.475 8.5375 17.375 8.7875C18.0125 9.4875 18.4 10.375 18.4 11.475C18.4 15.3125 16.0625 16.1625 13.8375 16.4125C14.2 16.725 14.5125 17.325 14.5125 18.2625C14.5125 19.6 14.5 20.675 14.5 21.0125C14.5 21.275 14.6875 21.5875 15.1875 21.4875C17.1727 20.8173 18.8977 19.5415 20.1198 17.8395C21.3419 16.1376 21.9995 14.0953 22 12C22 6.475 17.525 2 12 2Z"
                      strokeLinejoin="round"
                    />
                    {/* </g> */}
                  </svg>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>GitHub</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}
