const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const {MongoSessionStore} = require("./sessionStore");
const crypto = require("crypto");
const {createAdapter} = require("@socket.io/mongo-adapter");
const {MongoClient} = require("mongodb");
const randomId = () => crypto.randomBytes(8).toString("hex");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});


const DB = "soro";
const EVENTS_COLLECTION = "adapter-events";
const MESSAGES_COLLECTION = "messages";
const ROOMS_COLLECTION = "rooms";
const SESSIONS_COLLECTION = "sessions";
const mongoClient = new MongoClient("mongodb://root:example@localhost:27017", {
    useUnifiedTopology: true,
});

const sessionStore = new MongoSessionStore(mongoClient);

const main = async () => {
    await mongoClient.connect();
    let collections = (await mongoClient.db(DB).collections()).map((c) => {
        c.collectionName
    })
    let expectedCollections = [
        EVENTS_COLLECTION,
        MESSAGES_COLLECTION,
        ROOMS_COLLECTION,
        SESSIONS_COLLECTION
    ]
    try {
        expectedCollections.filter((expected) => {
            !collections.includes(expected)
        }).map(async (c) => {
            await mongoClient.db(DB).createCollection(c, {
                capped: true,
                size: 1e6
            });
        })
    } catch (e) {
        // collection already exists
        console.log(e)
    }
    const mongoCollection = mongoClient.db(DB).collection(EVENTS_COLLECTION);

    io.adapter(createAdapter(mongoCollection));

}


io.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    const username = socket.handshake.auth.username;
    const foundSessions = await sessionStore.findSession(username);
    if (username && foundSessions && foundSessions.length > 0) {
        let session = foundSessions[0]
        socket.sessionID = session.sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        let validRooms = session.rooms.filter((room) => room !== socket.id)
        socket.join(validRooms)
        return next();

    }

    if (!username || username.length === 0) {
        return next(new Error("invalid username"));
    }
    // create new session
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    socket.join(socket.username + "-room");

    let clientRooms = []
    socket.rooms.forEach((room) => {
        if (room !== socket.id) {
            clientRooms.push(room)
        }
    })
    await sessionStore.saveSession(
        socket.sessionID,
        socket.userID,
        socket.username,
        clientRooms,
        true);
    next();
});

io.on('connection', async (socket) => {

    let clientRooms = []
    socket.rooms.forEach((room) => {
        clientRooms.push(room)
    })
    socket.emit("session", {
        username: socket.username,
        sessionID: socket.sessionID,
        userID: socket.userID,
        rooms: clientRooms.join(',')
    })

    socket.broadcast.emit("user connected", {
        userID: socket.userID,
        username: socket.username,
        connected: true,
        messages: [],
    });

    socket.on("joinNewRoom", async (data) => {
        let username = data.user
        let roomname = data.room
        if (await sessionStore.addNewRoom(username, roomname)) {
            socket.join(roomname)
        } else {
            socket.emit("error", {
                error: `could not add ${username} to room: ${roomname}`
            })
        }
    })
    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).fetchSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {

            let clientRooms = []
            matchingSockets.forEach((socket) => {
                socket.rooms.forEach((room) => {
                    clientRooms.push(room)
                })
            })

            // notify other users
            socket.broadcast.emit("user disconnected", socket.userID);
            // update the connection status of the session
            await sessionStore.saveSession(
                socket.sessionID,
                socket.userID,
                socket.username,
                clientRooms,
                true);
        }
    });
});

server.listen(9000, () => {
    main();
    console.log('listening on *:9000');
});