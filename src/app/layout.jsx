"use client";

import "./styles/generel.scss";
import NavBar from "./components/navigation";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const mainClass = pathname === "/hotdog-spillet" ? "no-padding" : "";

  return (
    <html lang="da">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/aak3jid.css" />
      </head>
      <body>
        <NavBar />
        <main className={mainClass}>{children}</main>
      </body>
    </html>
  );
}
