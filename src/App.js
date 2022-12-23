import React, {useEffect, useState} from "react";
import './App.css';
import {Box, Button, Footer, Grid, Grommet, Header, Heading, Layer, Nav, Paragraph, Text, TextInput} from 'grommet';
import {emitMessage, getSessionId, connect, isConnected, getRooms} from './socket-utils'
import {SidebarButton} from "./components/SidebarButton";
import {SidebarButtonIcon} from "./components/SidebarButtonIcon";
import {Add} from "grommet-icons";
import {useDispatch, useSelector} from "react-redux";
import {addRooms, addSessionId, addUsername} from "./redux/slices/socketSlice";

const theme = {
    global: {
        font: {
            family: 'Roboto',
            size: '18px',
            height: '20px',
        },
    },
};


function App() {

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [user, setUser] = useState(null)
    const dispatch = useDispatch()
    const socketSlice = useSelector((state) => state.socketSlice)
    const [active, setActive] = useState();
    const socketId = socketSlice.sessionId
    const isSocketConnected = isConnected()

    function setUpStore() {
        if (!socketSlice["username"] || !isSocketConnected) {
            dispatch(addUsername(user))
        }
        let rooms = getRooms()
        if (rooms) {
            dispatch(addRooms(rooms.split(",")))
        }
        dispatch(addSessionId(getSessionId()))
    }
    useEffect(() => {
        if (!user && !socketSlice["username"]) {
            setOpenModal(true)
        }
    }, [user, setOpenModal])
    return (
        <Grommet theme={theme}>
            <Grid
                rows={['xxsmall', 'large', "xxsmall"]}
                columns={['1/4', '3/4']}
                areas={[
                    {name: 'header', start: [0, 0], end: [1, 0]},
                    {name: 'nav', start: [0, 1], end: [0, 1]},
                    {name: 'main', start: [1, 1], end: [1, 1]},
                    {name: 'footer', start: [0, 2], end: [1, 2]},
                ]}
            >
                <Box gridArea={'header'} direction={"column"} background={"brand"} alignContent={"center"}>
                    <Heading level={"3"} margin={"xsmall"}>soro</Heading>
                </Box>
                <Box gridArea="nav" direction={"column"} background={"light-5"}>
                    <Nav background="brand">
                        {socketSlice["rooms"] && socketSlice["rooms"].map((label) => (
                            <SidebarButton
                                key={label}
                                label={<Text color="white">{label}</Text>}
                                active={label === active}
                                onClick={() => setActive(label)}
                            />
                        ))}
                        <SidebarButtonIcon
                            label={<Text color="black" size={"medium"}>Add Room</Text>}
                            icon={<Add size='medium'/>}
                            active={"Add Room" === active}
                            onClick={() => setActive("Add Room")}
                        />
                    </Nav>
                </Box>
                <Box overflow={"scroll"} gridArea="main" direction={"column"} background={"light-2"}
                     justify={"between"}>
                    <Header direction={"column"} gap={"xxsmall"}>
                        {messages && messages.map((message, i) => [
                            <Paragraph color={i % 2 === 0 ? "brand" : "black"} fill key={i} margin={{left: "small"}}
                                       alignSelf={"start"} size={"large"}>
                                {user} [{socketId}]: {message}
                            </Paragraph>
                        ])}
                    </Header>
                    <Footer>
                        <TextInput
                            value={newMessage}
                            placeholder={"enter your message"}
                            onChange={(event) => {
                                if (event.target.value.length > 0) {
                                    setNewMessage(event.target.value)
                                }
                            }}
                        />
                        <Button label={"enter"} onClick={() => {
                            if (newMessage && newMessage.length > 0) {
                                setMessages([...messages, newMessage])
                                emitMessage(newMessage)
                            }
                            setNewMessage("")
                        }}/>
                    </Footer>
                </Box>
                <Footer gridArea={"footer"} background={"brand"} pad="small"/>
            </Grid>
            {openModal && <Layer>
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
            </Layer>}
        </Grommet>
    );
}

export default App;
