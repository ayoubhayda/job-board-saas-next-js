import Link from "next/link";
import React from "react";
import logo from "@/assets/public/logo.png";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "../theme/ThemeToggle";
import { auth } from "@/utils/auth";
import UserDropdown from "./UserDropdown";

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

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        <Link
          className={`cursor-pointer ${buttonVariants({
            size: "lg",
            className: "text-white",
          })}`}
          href="/post-job"
        >
          Post Job
        </Link>
        {session?.user ? (
          <UserDropdown
            email={session.user.email!}
            name={session.user.name!}
            image={session.user.image!}
          />
        ) : (
          <Link
            href="/login"
            className={`cursor-pointer ${buttonVariants({
              variant: "outline",
              size: "lg",
              className: "text-white",
            })}`}
          >
            Login
          </Link>
        )}
      </div>

      {/* Right section */}
      {/* <div className="flex items-center gap-4">
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
      </div>*/}
    </nav>
  );
};

export default Navbar;
