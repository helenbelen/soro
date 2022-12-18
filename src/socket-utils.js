import {io} from "socket.io-client";

const URL = "http://localhost:9000";
const socket = io(URL, {
    autoConnect: false,
    reconnectionAttempts: 3
});

socket.onAny((event, ...args) => {
    console.log(event, args);
});

socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
        console.log(err);
    }
});

socket.on("session", ({ sessionID, userID, username }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // save the ID of the user
    socket.userID = userID;
    socket.username = username;
    setUserId(username);
    setSessionId(sessionID)
});

export function connect(username) {
    socket.auth = { username };
    socket.connect();
}
export function emitMessage(message) {
    socket.emit("message", message)
}

export function getSessionId() {
    return window.sessionStorage.getItem("sessionId")
}

export function setSessionId(id) {
    window.sessionStorage.setItem("sessionId", id)
}

export function getUserId() {
    return window.sessionStorage.getItem("userId")
}

export function setUserId(id) {
    window.sessionStorage.setItem("userId", id)
}

export function isConnected() {
    return socket.connected
}