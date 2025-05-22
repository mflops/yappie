"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Inter, Bangers } from "next/font/google";

const inter = Inter({subsets: ['latin']});
const bangers = Bangers({subsets: ['latin'], weight: ['400']});

export default function SignInPage() {
    return (
        <div className="flex flex-col h-screen w-screen text-center items-center justify-center gap-y-40 p-4">
            <div className="flex flex-col gap-y-4">
            <Card className="p-8 text-5xl bg-black text-amber-400 text-shadow-[1px_1px_0.2px_#ffffff] outline-none border-none shadow-[10px_10px_0px_#ffba00] rounded-3xl lg:text-7xl md:text-6xl">
                <h1 className={bangers.className}>Welcome to YAPPIE 🧠🗣️</h1>
            </Card>
            <Card className="p-4 text-xl outline-none border-none shadow-none">
                <h6 className={inter.className}>{"(you’ve made a terrible decision. but hey, let’s chat.)"}</h6>
            </Card>
            </div>
            <Button onClick={() => signIn("google", {redirect: true, callbackUrl: '/'})} className={inter.className + " p-10 flex items-center justify-center gap-x-6 bg-black text-white outline-none border-none shadow-[10px_10px_0px_#ffba00] hover:shadow-[10px_10px_0px_#fcbe19] hover:bg-neutral-700 rounded-3xl hover:cursor-pointer transition-all duration-150 sm:p-12"}>
                <h6 className="text-xl sm:text-2xl">Sign in with Google</h6>
                <img src="/google.svg" alt="Google" className="w-10 h-10" />
            </Button>
        </div>
    );
}
