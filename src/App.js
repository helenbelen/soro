import React, {useState} from "react";
import './App.css';
import {Box, Button, Grid, Grommet, Heading, Page, Paragraph, TextInput} from 'grommet';
import { io } from "socket.io-client";

const URL = "http://localhost:9000";
const socket = io(URL, { autoConnect: true });

function emitMessage(message) {
    socket.emit("message", message)
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
                <Box gridArea="main" direction={"column"} background={"light-2"}>
                    <Page alignSelf={"start"}>
                        {messages && messages.map((message, i) => [
                            <Paragraph key={i}>
                                {message}
                            </Paragraph>
                        ])}
                    </Page>
                    <Box direction={"row"}>
                        <TextInput
                            placeholder={"enter your message"}
                            onChange={(event) => setNewMessage(event.target.value)}
                        />
                        <Button label={"enter"} onClick={(event) => {
                            setMessages([...messages, newMessage])
                            emitMessage(newMessage)
                        }}/>
                    </Box>
                </Box>
                <Box gridArea="footer" background={"brand"}>
                </Box>
            </Grid>
        </Grommet>
    );
}

export default App;
