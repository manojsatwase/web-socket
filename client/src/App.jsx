import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { Button, Container, TextField, Typography,Box, Stack } from '@mui/material';

const App = () => {
  // server url
  const socket = useMemo(() => io('http://localhost:1234',{
    withCredentials:true
  }),[]);
 
  const [allMessages,setAllMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [room,setRoom] = useState('');
  const [socketID,setSocketID] = useState('');
  const [roomName,setRoomName] = useState('')
  const [userName,setUserName] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected', socket.id);
      setSocketID(socket.id);
      // receiving msg print on console
      socket.on('welcome', (msg) => {
        console.log(msg);
      });

    });
     
    socket.on("recieve-message",(msg)=> {
      console.log(msg);
      setAllMessages(message=> [...message,msg]);
    })


    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({message,room});
    socket.emit('message', {message,room}); // Emit the message to the server indivitualy user   
    setMessage(''); // Clear the input field after sending
  };


  console.log(allMessages);


  useEffect(()=> {
    socket.on(`join-${roomName}`,(msg)=>{
       console.log(msg);
    })
     // Leave the dynamic room when the component unmounts
     return () => {
      socket.emit('leave-room');
  };
  },[roomName]);

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join-room',{roomName,userName});
     setRoomName('');
  }
  
  return (
    <Container maxWidth='sm'>
     <form onSubmit={joinRoomHandler}>
       <h5>Join Room</h5>
        <TextField
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          id='outlined-basic'
          label='User Name'
          variant='outlined'
          fullWidth
          autoFocus
        />
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id='outlined-basic'
          label='Room Name'
          variant='outlined'
          fullWidth
          autoFocus
        />
        <Button type='submit' variant='contained' color='primary'>
          Join
        </Button>
      </form>


         {/*  */}

       <Box sx={{height:200}} />
      <Typography variant='h6' component='div' gutterBottom>
        {/* why we not see id jab tak ye component render ho raha honga ustime tak instance create nhi hota disconnected hota hai */}
        {socketID}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id='outlined-basic'
          label='Message'
          variant='outlined'
          fullWidth
          autoFocus
        />
          <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id='outlined-basic'
          label='Room'
          variant='outlined'
          fullWidth
          autoFocus
        />
        <Button type='submit' variant='contained' color='primary'>
          Send
        </Button>
      </form>
      
      <Stack>
        {allMessages.map((msg,index)=>(
          <Typography key={index} variant='h6' component='div' gutterBottom>
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
