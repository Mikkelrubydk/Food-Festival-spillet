"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const getActiveClass = () => {
    if (pathname === "/") return 0;
    if (pathname === "/hotdog-spillet") return 1;
    if (pathname === "/profil") return 2;
    if (pathname === "/hotdogdm") return 3;
    return -1;
  };

  const currentClass = getActiveClass();

  return (
    <nav>
      <ul>
        <li className={currentClass === 0 ? "active" : ""}>
          <Link href="/">
            <img src="/hjem.svg" alt="Home icon" />
          </Link>
        </li>
        <li className={currentClass === 1 ? "active" : ""}>
          <Link href="/hotdog-spillet">
            <img src="/hotdog.svg" alt="Tasks icon" />
          </Link>
        </li>
        <li className={currentClass === 2 ? "active" : ""}>
          <Link href="/profil">
            <img src="/profil.svg" alt="Add task icon" />
          </Link>
        </li>
        <li className={currentClass === 3 ? "active" : ""}>
          <Link href="/hotdogdm">
            <img src="/information.svg" alt="Add task icon" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
