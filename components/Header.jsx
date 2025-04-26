"use client";
import { useSession } from "next-auth/react";
import LoginHeader from "./LoginHeader";
import LogoutHeader from "./LogoutHeader";
// import { useLogin } from "./login-context";
// Main Header component that switches between Login and Logout state
const Header = () => {
  const { data: session } = useSession();
  return <div>{session ? <LoginHeader /> : <LogoutHeader />}</div>;
};

export default Header;
