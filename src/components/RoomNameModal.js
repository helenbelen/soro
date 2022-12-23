import {Box, Button, Layer, TextInput} from "grommet";
import {joinNewRoom} from "../socket-utils";
import React, {useState} from "react";

export const RoomNameModal = ({user, closeModal}) => {
    const [room, setRoom] = useState(null);
    return (<Layer>
        <Box direction={"row"} gap={"small"} margin={"small"}>
            <TextInput size={"small"} placeholder={"enter a room name"} onChange={(event) => {
                if (event.target.value.length > 0) {
                    setRoom(event.target.value)
                }
            }
            }/>
            <Button label={"enter"} onClick={() => {
                if (room && room.length > 0) {
                    joinNewRoom(user, room)
                    closeModal()
                }
            }}/>
        </Box>
    </Layer>)
}