"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Inter, Bangers } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";

const inter = Inter({subsets: ['latin']});
const bangers = Bangers({subsets: ['latin'], weight: ['400']});

export default function SignInPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <>
                <Head>
                    <link rel="icon" href="/favicon.ico" sizes="any" />
                    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" href="/favicon.ico" />
                </Head>
                <div className="flex h-screen w-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
                </div>
            </>
        );
    }

    if (status === "authenticated") {
        return null;
    }

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col h-screen w-screen text-center items-center justify-center gap-y-40 p-4 dark:bg-[#202020]">
                <div className="flex flex-col gap-y-4">
                <Card className="p-8 text-5xl bg-black text-amber-400 outline-none border-none shadow-[10px_10px_0px_#ffba00] rounded-3xl lg:text-7xl md:text-6xl dark:text-[#758aef] dark:shadow-[10px_10px_0px_#758aef]">
                    <h1 className={bangers.className}>Welcome to YAPPIE 🧠🗣️</h1>
                </Card>
                <Card className="p-4 text-xl outline-none border-none shadow-none bg-transparent">
                    <h6 className={inter.className}>{"(you've made a terrible decision. but hey, let's chat.)"}</h6>
                </Card>
                </div>
                <Button onClick={() => signIn("google", {redirect: true, callbackUrl: '/'})} className={inter.className + " p-10 flex items-center justify-center gap-x-6 bg-black text-white outline-none border-none shadow-[10px_10px_0px_#ffba00] hover:shadow-[10px_10px_0px_#fcbe19] hover:bg-neutral-700 rounded-3xl hover:cursor-pointer transition-all duration-150 sm:p-12 dark:shadow-[10px_10px_0px_#758aef]"}>
                    <h6 className="text-xl sm:text-2xl">Sign in with Google</h6>
                    <Image src="/google.svg" alt="Google" width={40} height={40} />
                </Button>
            </div>
        </>
    );
}
