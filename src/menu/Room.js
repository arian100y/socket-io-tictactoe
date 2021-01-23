import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { socket } from "../service/socket";
export default function Room(props) {
  const [redirect, setRedirect] = useState(null);

  const resize = () => {
    const gameLogo = document.querySelectorAll(".game-logo");
    const gameheight = gameLogo[0].getBoundingClientRect().height;
    gameLogo.forEach((element) => {
      element.style.width = gameheight + "px";
    });
  };
  useEffect(() => {
    // resize();
    // window.addEventListener("resize", resize);
    // return () => {
    //   window.removeEventListener("resize", resize);
    // };
  }, []);
  const handleClick = () => {
    if (props.players < 2) {
      socket.emit("joinRoom", props.name);

      setRedirect(<Redirect to={`/gameroom/${props.name}`}></Redirect>);
    }
  };
  return (
    <div
      onClick={handleClick}
      className={props.players < 2 ? "item clickable" : "item"}
    >
      {redirect}
      {/* <div className="game-logo"></div> */}
      <div className="game-content">
        <h3>{props.name} | TicTacToe</h3>
        {/* <p>Ps5 Version</p> */}
      </div>
      <div className="percent">{props.players} Players</div>
    </div>
  );
}
