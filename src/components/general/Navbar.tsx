import Link from "next/link";
import React from "react";
import logo from "@/assets/public/logo.png";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "../theme/ThemeToggle";
import { auth, signOut } from "@/utils/auth";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} alt="logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          Job<span className="text-primary">Marshal</span>
        </h1>
      </Link>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button className="cursor-pointer">Logout</Button>
          </form>
        ) : (
          <Link
            href="/login"
            className={`cursor-pointer ${buttonVariants({
              variant: "outline", size: "lg"
            })}`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
