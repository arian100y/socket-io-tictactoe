import React, { useEffect } from "react";
import { useState } from "react";
import "./menu.css";
import Room from "./Room";
import { socket } from "../service/socket";

export default function Menu() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("totalRooms", (msg) => {
      console.log("MSYG", msg);
      let tempRooms = [];

      for (let i = 0; i < msg.length; i++) {
        tempRooms.push(
          <Room key={i} players={msg[i].players} name={msg[i].name}></Room>
        );
      }
      setRooms(tempRooms);
    });
    socket.on("addRoom", (msg) => {
      setRooms((old) => [
        ...old,
        <Room key={old.length} players={msg.players} name={msg.name}></Room>,
      ]);
    });

    const profile = document.querySelector(".profile");
    const height = profile.getBoundingClientRect().height;
    document.querySelector(".profile").style.width = height + "px";

    return () => {
      socket.off();
    };
  }, []);

  const createRoom = () => {
    socket.emit("createRoom", "");
  };

  return (
    <div style={{ height: "100vh" }}>
      <div className="container">
        <div className="side">
          <div className="profile">
            <img
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              src="https://i.redd.it/v0caqchbtn741.jpg"
            />
          </div>
          <div className="credentials">
            <h3>username</h3>
            <p>normal user</p>
          </div>
          <div className="logos">
            <div className="logo-container-texas">
              <div className="logo-texas">
                <i className="fab fa-twitch"></i>
              </div>
              <div className="title-texas">Streams</div>
            </div>
            <div className="logo-container-texas">
              <div className="logo-texas">
                <i className="fab fa-steam"></i>
              </div>
              <div className="title-texas">Games</div>
            </div>
            <div className="logo-container-texas">
              <div className="logo-texas">
                <i className="fas fa-gamepad"></i>
              </div>
              <div className="title-texas">Upcoming</div>
            </div>
            <div className="logo-container-texas">
              <div className="logo-texas">
                <i className="fas fa-book"></i>
              </div>
              <div className="title-texas">Libray</div>
            </div>
          </div>

          <div className="join">
            <h2>Join pro for free games</h2>
          </div>
        </div>
        <div className="glass">
          <h2 style={{ marginBottom: "5%" }}>Active Games</h2>
          <div className="lil-flex">
            <div className="search" id="search">
              <input type="text" />
              <div className="search-icon">
                <i style={{ fontSize: "22px" }} className="fas fa-search"></i>
              </div>
            </div>
            <button onClick={createRoom}>Create Room</button>
          </div>

          <div className="room-container">{rooms}</div>
        </div>
      </div>
    </div>
  );
}
