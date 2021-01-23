import { io } from "socket.io/client-dist/socket.io";

export const socket = io("https://arian-tictactoe.herokuapp.com/", {
  transports: ["websocket", "polling", "flashsocket"],
});
