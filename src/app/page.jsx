"use client";

import Image from "next/image";
import "./styles/generel.scss";
import "./styles/homepage.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import arrowRight from "/public/arrow-right.svg";

export default function HomePage() {
  const [savedPoints, setSavedPoints] = useState(0);

  useEffect(() => {
    const points = Number(localStorage.getItem("savedPoints") || "0");
    setSavedPoints(points);
  }, []);

  return (
    <div className="padding-bottom">
      <section className="hero-section">
        <Link href="/profil">
          <div className="point-link">
            <h4>{savedPoints} Point</h4>
            <Image
              src={arrowRight}
              alt="Molly"
              width={20}
              height={20}
              className="arrow-right"
            />
          </div>
        </Link>
        <div className="hero-wrapper">
          <div className="hero">
            <h1>Hotdog-spillet er i gang!</h1>
            <p>
              Hjælp Molly, maskotten for Hotdog DM, med at gribe hendes livret -
              hotdogs. <br />
              <br /> Vi ses til Food Festival den 5. - 7. september 2025.
            </p>
          </div>
          {/* <div className="hero-image">
            <Image
              src="/molly-hotdog.svg"
              alt="Molly-with-hotdog"
              width={0}
              height={0}
              className="hero-molly"
              sizes="100%"
            />
          </div> */}
        </div>
      </section>

      <Link href="hotdog-spillet">
        <section>
          <div className="dashboard-card">
            <div className="top">
              <Image
                src="/gamelink.svg"
                alt="Home icon"
                width={0}
                height={0}
                className="image molly-image"
                sizes="100%"
              />
            </div>

            <div className="bottom">
              <h2>Klar, parat, grib</h2>
              <p>
                Spil Hotdog-spillet én gang om dagen og optjen point til lækre
                præmier.
              </p>
            </div>
          </div>
        </section>
      </Link>

      <Link href="/profil">
        <section>
          <div className="dashboard-card">
            <div className="top">
              <Image
                src="/profilelink.svg"
                alt="Profil ikon"
                width={0}
                height={0}
                className=" image molly-image"
                sizes="100%"
              />
            </div>

            <div className="bottom">
              <h2>Din profil</h2>
              <p>
                Hold styr på dine point, vælg præmier og indløs dine kuponer.
              </p>
            </div>
          </div>
        </section>
      </Link>

      <Link href="/hotdogdm">
        <section>
          <div className="dashboard-card">
            <div className="top">
              <Image
                src="/hvaderhotdogdm.png"
                alt="Profil ikon"
                width={0}
                height={0}
                className=" image molly-image"
                sizes="100%"
              />
            </div>

            <div className="bottom">
              <h2>Hvad er Hotdog DM?</h2>
              <p>
                En konkurrence, hvor kokke dyster om Danmarks bedste
                gourmet-hotdog.
              </p>
            </div>
          </div>
        </section>
      </Link>
    </div>
  );
}
