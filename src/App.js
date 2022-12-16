import React, {useState} from "react";
import './App.css';
import {Box, Button, Footer, Grid, Grommet, Header, Heading, Paragraph, TextInput} from 'grommet';
import {io} from "socket.io-client";

const URL = "http://localhost:9000";
const socket = io(URL, {autoConnect: true});

function emitMessage(message) {
    socket.emit("message", message)
}

function getSocketId() {
    return window.sessionStorage.getItem("socketId")
}

function isConnected() {
    return socket.connected
}

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
    const socketId = getSocketId()
    const isSocketConnected = isConnected()
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
                <Box gridArea="nav" direction={"column"} background={"light-5"}/>
                <Box overflow={"scroll"} gridArea="main" direction={"column"} background={"light-2"} justify={"between"}>
                    <Header direction={"column"} gap={"xxsmall"}>
                        {messages && messages.map((message, i) => [
                            <Paragraph color={i % 2 === 0 ? "brand" : "black"} fill key={i} margin={{left: "small"}} alignSelf={"start"} size={"large"}>
                                {socketId} : {message}
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
                        <Button label={"enter"} onClick={(event) => {
                            if (!isSocketConnected) {
                                alert("Socket is not connected. Is server on?");
                            }
                            else if (newMessage && newMessage.length > 0) {
                                setMessages([...messages, newMessage])
                                emitMessage(newMessage)
                            }
                            setNewMessage("")
                        }}/>
                    </Footer>
                </Box>
                <Footer gridArea={"footer"} background={"brand"} pad="small"/>
            </Grid>
        </Grommet>
    );
}

export default App;
