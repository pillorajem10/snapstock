import socketIOClient from "socket.io-client";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://snapstock.site";

const socket = socketIOClient(baseUrl); // Replace with your server URL

socket.on("connect", (v) => {
  console.log("[connect v] ", v, process.env.NODE_ENV);
});

socket.on("joinRoom", ({ category, acknowledgmentData }) => {
  if (acknowledgmentData && acknowledgmentData.success) {
    console.log(`Successfully joined room ${category}`);
  } else {
    console.error(`Failed to join room ${category}`);
  }
});

export default socket;
