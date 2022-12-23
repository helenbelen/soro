import {Box, Button, Layer, TextInput} from "grommet";
import {connect} from "../socket-utils";
import React from "react";

export const UsernameModal = ({user, setUser, setUpStore, setOpenModal}) => (
    <Layer>
        <Box direction={"row"} gap={"small"} margin={"small"}>
            <TextInput size={"small"} placeholder={"enter a username"} onChange={(event) => {
                if (event.target.value.length > 0) {
                    setUser(event.target.value)
                }
            }
            }/>
            <Button label={"enter"} onClick={() => {
                if (user && user.length > 0) {
                    setUpStore()
                    connect(user)
                    setOpenModal(false)
                }
            }}/>
        </Box>
    </Layer>
)