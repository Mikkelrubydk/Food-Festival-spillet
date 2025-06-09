"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "../styles/hotdogspillet.scss";
import hotdogImg from "/public/hotdogimg.svg";
import mollyImg from "/public/molly2.svg";
import mollySittingImg from "/public/molly1.svg";
import sleepingMolly from "/public/sleeping-molly.svg";
import arrowRight from "/public/arrow-right.svg";
import Link from "next/link";

export default function GamePage() {
  const hotdogRef = useRef(null);
  const hundRef = useRef(null);
  const gameAreaRef = useRef(null);
  const [hundX, setHundX] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(5);
  const [highScore, setHighScore] = useState(0);
  const [savedPoints, setSavedPoints] = useState(0);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  const [gameState, setGameState] = useState("start");

  const scoreRef = useRef(0);
  const earnedPointsRef = useRef(0);

  useEffect(() => {
    setHundX(window.innerWidth / 2 - 50);

    const savedHighScore = localStorage.getItem("highscore");
    if (savedHighScore) setHighScore(Number(savedHighScore));

    const points = Number(localStorage.getItem("savedPoints") || "0");
    setSavedPoints(points);

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("playDate");
    const storedGames = Number(localStorage.getItem("gamesPlayed") || "0");

    if (storedDate === today) {
      setGamesPlayedToday(storedGames);
      if (storedGames >= 1) setGameState("limitReached");
    } else {
      localStorage.setItem("playDate", today);
      localStorage.setItem("gamesPlayed", "0");
      setGamesPlayedToday(0);
    }
  }, []);

  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;

    if (gameState === "playing") {
      nav.style.display = "none";
    } else {
      nav.style.display = "";
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft") {
        setHundX((prev) => Math.max(prev - 50, 0));
        hundRef.current.style.transform = "scaleX(1)";
      } else if (e.key === "ArrowRight") {
        setHundX((prev) =>
          Math.min(prev + 50, window.innerWidth - hundRef.current.offsetWidth)
        );
        hundRef.current.style.transform = "scaleX(-1)";
      }
    };

    // Ny dragging logik her:
    let dragging = false;
    let lastTouchX = 0;

    const handleTouchStart = (e) => {
      if (gameState !== "playing") return;
      dragging = true;
      lastTouchX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (gameState !== "playing" || !dragging) return;
      const touchX = e.touches[0].clientX;
      const deltaX = touchX - lastTouchX;
      lastTouchX = touchX;

      setHundX((prev) => {
        let newX = prev + deltaX;
        const maxX = window.innerWidth - (hundRef.current?.offsetWidth || 100);
        if (newX < 0) newX = 0;
        if (newX > maxX) newX = maxX;

        if (deltaX > 0) {
          hundRef.current.style.transform = "scaleX(-1)";
        } else if (deltaX < 0) {
          hundRef.current.style.transform = "scaleX(1)";
        }

        return newX;
      });
    };

    const handleTouchEnd = (e) => {
      if (gameState !== "playing") return;
      dragging = false;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameState]);

  useEffect(() => {
    let animationId;
    const dropHotdog = () => {
      if (!hotdogRef.current || !hundRef.current) return;

      const hotdog = hotdogRef.current;
      const hund = hundRef.current;

      let hotdogTop = parseFloat(hotdog.style.top || "-100px");
      hotdogTop += speed;
      hotdog.style.top = hotdogTop + "px";

      const hotdogRect = hotdog.getBoundingClientRect();
      const hundRect = hund.getBoundingClientRect();

      if (checkCollision(hotdogRect, hundRect)) {
        const eatSound = document.getElementById("eat-sound");
        // if (eatSound) eatSound.play();
        setScore((prev) => {
          const newScore = prev + 1;
          scoreRef.current = newScore;
          if (newScore % 10 === 0) {
            setLevel((l) => l + 1);
            setSpeed((s) => s * 1.2);
          }
          return newScore;
        });
        resetHotdog();
      } else if (hotdogRect.top > window.innerHeight) {
        endGame();
        return;
      }

      animationId = requestAnimationFrame(dropHotdog);
    };

    if (gameState === "playing") {
      resetHotdog();
      animationId = requestAnimationFrame(dropHotdog);
    }

    return () => cancelAnimationFrame(animationId);
  }, [gameState, speed]);

  const checkCollision = (r1, r2) => {
    return !(
      r1.bottom < r2.top ||
      r1.top > r2.bottom ||
      r1.right < r2.left ||
      r1.left > r2.right
    );
  };

  const resetHotdog = () => {
    const hotdog = hotdogRef.current;
    hotdog.style.top = "-100px";
    hotdog.style.left =
      Math.floor(Math.random() * (window.innerWidth - 50)) + "px";
  };

  const startGame = () => {
    if (gamesPlayedToday >= 1) {
      setGameState("limitReached");
      return;
    }

    const updatedGames = gamesPlayedToday + 1;
    localStorage.setItem("gamesPlayed", updatedGames.toString());
    setGamesPlayedToday(updatedGames);

    setScore(0);
    setLevel(1);
    setSpeed(5);
    scoreRef.current = 0;
    setGameState("playing");
  };

  const endGame = () => {
    const finalScore = scoreRef.current;
    const earnedPoints = finalScore * 1;
    earnedPointsRef.current = earnedPoints;

    const newTotal = savedPoints + earnedPoints;
    localStorage.setItem("savedPoints", newTotal.toString());
    setSavedPoints(newTotal);

    if (finalScore > highScore) {
      localStorage.setItem("highscore", finalScore.toString());
      setHighScore(finalScore);
    }

    setGameState("result");
  };

  return (
    <>
      {gameState === "start" && (
        <div className="start-screen">
          <section>
            <Link href="/profil">
              <div className="point-link">
                <h4>{savedPoints} Point</h4>
                <Image src={arrowRight} alt="Pil" width={20} height={20} />
              </div>
            </Link>
            <h1>Hotdog-spillet</h1>
            <h3>Mød Molly – Hotdog DM’s sultne maskot!</h3>
            <p>
              Hjælp Molly med at fange hendes livret og optjen point til lækre
              præmier i Food Festivals barer. <br /> <br /> Du kan spille én
              gang om dagen, så gør dit bedste!
            </p>
            <div className="molly">
              <Image
                src={mollySittingImg}
                alt="Molly"
                width={300}
                height={200}
              />
            </div>
            <button onClick={startGame} className="button">
              Start spil
            </button>
          </section>
        </div>
      )}

      {gameState === "playing" && (
        <div ref={gameAreaRef} className="game-area">
          <div className="score-display">
            🏆 Point: {score} | 🎖️ Highscore: {highScore}
          </div>
          <div
            ref={hotdogRef}
            className="hotdog"
            style={{ top: "-100px", left: "0px" }}
          >
            <Image src={hotdogImg} alt="Hotdog" fill />
          </div>
          <div ref={hundRef} className="hund" style={{ left: hundX }}>
            <Image src={mollyImg} alt="Hund" fill />
          </div>
          <audio id="eat-sound" src="/nam.mp3" preload="auto"></audio>
        </div>
      )}

      {gameState === "result" && (
        <div className="result-screen">
          <Link href="/profil">
            <div className="point-link">
              <h4>{savedPoints} Point</h4>
              <Image src={arrowRight} alt="Pil" width={20} height={20} />
            </div>
          </Link>
          <h1>Sådan. Du gjorde det!</h1>
          <p>
            Tak fordi du hjalp Molly i Hotdog-spillet i dag. Kom tilbage igen i
            morgen og spil igen!
          </p>
          <p className="score">{score} point</p>

          <div className="standing-molly">
            <Image
              src="/standing-molly.svg"
              alt="Molly"
              width={300}
              height={200}
              sizes="100%"
            />
          </div>

          <Link href="/profil">
            <button className="button">Gå til din profil</button>
          </Link>
        </div>
      )}

      {gameState === "limitReached" && (
        <div className="limit-screen">
          <Link href="/profil">
            <div className="point-link">
              <h4>{savedPoints} Point</h4>
              <Image src={arrowRight} alt="Pil" width={20} height={20} />
            </div>
          </Link>
          <h1>Hotdog-spillet</h1>
          <h3>Molly er mæt og træt for i dag!</h3>
          <p>
            Kom tilbage igen i morgen og spil en ny runde af Hotdog-spillet og
            hjælp Molly.
          </p>
          <div className="molly">
            <Image
              src={sleepingMolly}
              alt="Molly"
              width={300}
              height={200}
              sizes="100%"
            />
          </div>
        </div>
      )}
    </>
  );
}
