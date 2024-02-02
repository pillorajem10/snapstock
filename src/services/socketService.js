import io from "socket.io-client";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://snapstock.site";

const socket = io(baseUrl); // Replace with your server URL

socket.on("connect", (v) => {
  console.log("[(x_-) SOCKET SERVICE ON CONNECT] ", v, process.env.NODE_ENV);
});

// const socket = io(baseUrl);
socket.on("joinRoom", (category, acknowledgmentData) => {
  console.log("[(x_-) USE EFFECT socketONJOINROOM category] ", category);
  console.log(
    "[(x_-) USE EFFECT socketONJOINROOM acknowledgmentData] ",
    acknowledgmentData
  );

  // console.log('ACKKNOW', acknowledgmentData)
  if (acknowledgmentData && acknowledgmentData.success) {
    console.log("[(x_-) USE EFFECT socketONJOINROOM SUCCESS] ", category);
    // console.log(`Successfully joined room ${category}`);
  } else {
    console.log("[(x_-) USE EFFECT socketONJOINROOM FAIL] ", category);
    // console.error(`Failed to join room ${category}`);
  }
});

console.log("[(x_-) SOCKET SERVICE baseUrl] ", baseUrl);
console.log("[(x_-) SOCKET SERVICE socket] ", socket);

export default socket;
