import Image from "next/image";
import { Metadata } from "next";
import { getSession } from "@/server/actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Grade IQ teacher login",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (session.id) {
    redirect(`/`);
  }
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-c1/10 to-c2/20 p-4">
      <div className="fx gap-1">
        <Image
          src={"/giqlogo_dark.png"}
          className="w-6 h-10"
          width={50}
          height={50}
          alt="Grade Iq logo"
        />
        <span className="font-bold text-c1 text-xl">
          Grade <span className="text-c1">IQ</span>
        </span>
      </div>
      <div className="w-full max-w-md bg-white/90 dark:bg-neutral-900 p-8 rounded-2xl shadow-xl backdrop-blur">
        {children}
      </div>
    </div>
  );
}
