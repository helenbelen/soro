class SessionStore {
    findSession(id) {}
    saveSession(id, session) {}
    findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
    }

    findSession(id) {
        return this.sessions.get(id);
    }

    saveSession(id, session) {
        this.sessions.set(id, session);
    }

    findAllSessions() {
        return [...this.sessions.values()];
    }
}

class MongoSessionStore extends SessionStore {

    constructor(mongoClient) {
        super();
        this.collection = mongoClient.db("soro").collection("sessions");
    }

    async findSession(user) {
        return await this.collection
            .find({
                username: user
            }).toArray()
    }

    async saveSession(id, userId, userName, rooms, connected) {
        let result = await this.collection
            .updateOne({username: userName},{ $set: {
                sessionID: id,
                userID: userId,
                username: userName,
                rooms: rooms,
                connected: connected,
            }})
        if (result.matchedCount === 0) {
            await this.collection
                .insertOne({
                        sessionID: id,
                        userID: userId,
                        username: userName,
                        rooms: rooms,
                        connected: connected,
                    })
        }
    }

    async addNewRoom(userName, newRoom) {
        let current = await this.collection
            .find({
                username: userName
            }).toArray()
        if (current && current.length > 0) {
            let currentRooms = current[0].rooms
            currentRooms.push(newRoom)
            await this.collection
                .updateOne({username: userName}, {
                    $set: {
                        rooms: currentRooms,
                    }
                })
            return {"success": true, "result": currentRooms }
        }
        return {"success": false}
    }

    async leaveRoom(userName, roomToLeave) {
        let current = await this.collection
            .find({
                username: userName
            }).toArray()
        if (current && current.length > 0) {
            let currentRooms = current[0].rooms
            if (!currentRooms.includes(roomToLeave)) return false
            let newRoomList = currentRooms.filter((room) => room !== roomToLeave)
            await this.collection
                .updateOne({username: userName}, {
                    $set: {
                        rooms: newRoomList,
                    }
                })
            return {"success": true, "result": newRoomList }
        }
        return {"success": false}
    }

}

module.exports = {
    InMemorySessionStore,
    MongoSessionStore
};
