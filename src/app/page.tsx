import { redirect } from "next/navigation"
import Image from "next/image";

export default function Home() {
  redirect("/dashboard");
  return (
    <div className="flex h-screen items-center justify-center ">
 
    </div>
  );
}
