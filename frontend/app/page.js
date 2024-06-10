import Image from "next/image";
import Home1 from "./homeee/page";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-6xl justify-center place-items-center text-red-800 font-extrabold grid">
      <Link href="/homeee" className="cursor-pointer">

        Hello
      </Link>
      ProdUp
    </div>
  );
}
