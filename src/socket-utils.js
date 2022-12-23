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

socket.on("error", (data) => {
    console.log(data)
})

socket.on("session", ({ sessionID, userID, username, rooms }) => {
    socket.auth = { sessionID };
    // save random ID of the user
    socket.userID = userID;
    socket.username = username;
    let filteredRooms = rooms.split(",").filter((room) => room !== socket.id)
    window.sessionStorage.setItem("rooms", filteredRooms.join(','))
    setUserName(username);
    setSessionId(sessionID)
});

export function connect(username) {
    socket.auth = { username };
    socket.connect();
}
export function emitMessage(message) {
    socket.emit("message", message)
}

export function joinNewRoom(username, roomname) {
    socket.emit("joinNewRoom", {"user": username, "room": roomname})
    connect(username)
}
export function getSessionId() {
    return window.sessionStorage.getItem("sessionId")
}

export function setSessionId(id) {
    window.sessionStorage.setItem("sessionId", id)
}

export function getUserName() {
    return window.sessionStorage.getItem("username")
}

export function getRooms() {
    return window.sessionStorage.getItem("rooms")
}

export function setUserName(id) {
    window.sessionStorage.setItem("username", id)
}

export function isConnected() {
    return socket.connected
}
