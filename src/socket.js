import { io } from "socket.io-client";

// const socket = io("http://localhost:3000", {
//   autoConnect: false,
// });

const socket = io("https://yotamputra.site/", {
  autoConnect: false,
});

export default socket;
