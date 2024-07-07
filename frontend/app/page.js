import Image from "next/image";
import Home1 from "./homeee/page";
import Link from "next/link";
import Navbar from "../components/navbar";

export default function Home() {
  return (
    <div>
        <Navbar />
        <Home1 />
    </div>
  );
}
