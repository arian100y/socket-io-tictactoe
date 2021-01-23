import React, { useEffect, useState } from "react";

import "./GameRoom.css";
import { socket } from "../service/socket";
import { Redirect, useParams } from "react-router-dom";
export default function GameRoom() {
  const [redirect, setRedirect] = useState(null);
  let myClass;
  let circleTurn = null;
  let a = useParams();
  let room = a.roomid;

  const start = () => {
    socket.on("chat message", function (msg) {
      console.log("chat message:", msg);
      const currentClass = msg["class"];
      const cell = document.getElementById(msg["cell"]);
      cell.classList.add(currentClass);

      if (checkWin(currentClass)) {
        endGame(false);
      } else if (isDraw()) {
        endGame(true);
      } else {
        console.log("im confused");
        swapTurns();
        //setBoardHoverClass();
        if (myClass === "x" && circleTurn) {
          document.getElementById("turn").style.display = "block";
        }
        if (myClass === "circle" && !circleTurn) {
          document.getElementById("turn").style.display = "block";
        }
      }
    });
    socket.on("disconnected", (msg) => {
      console.log(msg);
    });

    socket.on("login", function (msg) {
      console.log("MSG:", circleTurn);

      if (circleTurn === null) {
        console.log("Class received: ", msg);
        circleTurn = true;
        console.log("changed:", circleTurn);
        myClass = msg;
        socket.emit("changeTurn", "");
        const title = document.getElementById("title");
        title.textContent = "You are " + myClass;
        verifyTurn();
        startGame();
        socket.off("login");
      }
    });
    const X_CLASS = "x";
    const CIRCLE_CLASS = "circle";
    const WINNING_COMBINATIONS = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const cellElements = document.querySelectorAll("[data-cell]");
    const board = document.getElementById("board");
    const winningMessageElement = document.getElementById("winningMessage");
    const restartButton = document.getElementById("restartButton");
    const winningMessageTextElement = document.querySelector(
      "[data-winning-message-text]"
    );
    //let circleTurn;

    //startGame();

    restartButton.addEventListener("click", () => {
      setRedirect(<Redirect to="/"></Redirect>);
    });

    function startGame() {
      //circleTurn = false;

      cellElements.forEach((cell) => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener("click", handleClick);
        cell.addEventListener("click", handleClick, { once: true });
      });
      setBoardHoverClass();
      winningMessageElement.classList.remove("show");
    }

    function handleClick(e) {
      const cell = e.target;

      const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
      if (currentClass === myClass) {
        placeMark(cell, currentClass);
      }
    }

    function endGame(draw) {
      if (draw) {
        winningMessageTextElement.innerText = "Draw!";
      } else {
        winningMessageTextElement.innerText = `${
          circleTurn ? "O's" : "X's"
        } Wins!`;
      }
      winningMessageElement.classList.add("show");
    }

    function isDraw() {
      return [...cellElements].every((cell) => {
        return (
          cell.classList.contains(X_CLASS) ||
          cell.classList.contains(CIRCLE_CLASS)
        );
      });
    }

    function placeMark(cell, currentClass) {
      //cell.classList.add(currentClass);
      console.log("class", currentClass);
      socket.emit("chat message", { cell: cell.id, class: currentClass });
    }

    function swapTurns() {
      circleTurn = !circleTurn;

      verifyTurn();
    }

    function verifyTurn() {
      console.log("verifying...");

      if (myClass === "x" && circleTurn) {
        board.classList.remove("myturn");
        document.getElementById("turn").style.display = "block";
        board.classList.add("notMyTurn");
        document.querySelectorAll(".cell").forEach((element) => {
          element.style.cursor = "not-allowed";
        });
        return;
      }
      if (myClass === "circle" && !circleTurn) {
        board.classList.remove("myturn");
        document.getElementById("turn").style.display = "block";
        document.querySelectorAll(".cell").forEach((element) => {
          element.style.cursor = "not-allowed";
        });

        return;
      }
      board.classList.add("myturn");
      document.getElementById("turn").style.display = "none";
      document.querySelectorAll(".cell").forEach((element) => {
        element.style.cursor = "pointer";
      });
    }
    function setBoardHoverClass() {
      board.classList.remove(X_CLASS);
      board.classList.remove(CIRCLE_CLASS);
      console.log("it's ", circleTurn, " circle turn");
      if (myClass === "circle") {
        board.classList.add(CIRCLE_CLASS);
      } else {
        board.classList.add(X_CLASS);
      }
    }

    function checkWin(currentClass) {
      return WINNING_COMBINATIONS.some((combination) => {
        return combination.every((index) => {
          return cellElements[index].classList.contains(currentClass);
        });
      });
    }
  };

  useEffect(() => {
    const profile = document.querySelector(".profile");
    const height = profile.getBoundingClientRect().height;
    document.querySelector(".profile").style.width = height + "px";
    console.log(room);
    start();
    return () => {};
  });

  return (
    <div style={{ height: "100vh" }}>
      {redirect}
      <div className="container">
        <div className="side">
          <div className="profile">
            <img
              alt=""
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              src="https://i.redd.it/v0caqchbtn741.jpg"
            />
          </div>
          <div className="credentials">
            <h3>arian10y</h3>
            <p>normal user</p>
          </div>
        </div>
        <div className="glass gameRoom">
          {/* <h2 style={{ marginBottom: "5%" }}>Active Games</h2> */}

          <div id="title" className="title"></div>
          <div id="turn" className="turn">
            Wait for turn...
          </div>

          <div className="board myturn" id="board">
            <div className="cell" data-cell id="1"></div>
            <div className="cell" data-cell id="2"></div>
            <div className="cell" data-cell id="3"></div>
            <div className="cell" data-cell id="4"></div>
            <div className="cell" data-cell id="5"></div>
            <div className="cell" data-cell id="6"></div>
            <div className="cell" data-cell id="7"></div>
            <div className="cell" data-cell id="8"></div>
            <div className="cell" data-cell id="9"></div>
          </div>

          <div className="winning-message" id="winningMessage">
            <div data-winning-message-text></div>
            <button id="restartButton">Go back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
