import express, { json } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const PORT = 1234;

const app = express();

app.use(cors({
          //client url
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true 
}));

const server = createServer(app);

// circuit instance create 
const io = new Server(server,{
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true 
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const secret_keyJWT = "ilovesocket"; // Note: Keep this secret key private
app.get('/login', (req, res) => {
  // Generate JWT token with an expiration time (e.g., expiresIn: '1d' for 1 day)
  const token = jwt.sign({ _id: "asdadsdasda" }, secret_keyJWT, { expiresIn: '1d' });

  // Set the token as a cookie in the response
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  }).json({
    message: 'Login Success'
  });
});

// middleware 
const user = true;
io.use((socket,next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
      if (err) return next(err);
  
      const token = socket.request.cookies.token;
      if (!token) return next(new Error("Authentication Error"));

     // db senario
   // if(!decoded) return next(new Error('Authentication Error'));
     next();

   })
})

// socket means individual socket
io.on("connection", (socket) => {
   console.log('User Connection', socket.id);

   socket.on('message',({message,room}) => {
    console.log(message,room);

    // send message to all including and excluding 

    //io.emit('recieve-message',message); // send all user data io entire circuit send msg 

    // send message all excluding own

    //socket.broadcast.emit('recieve-message',data); // send msg in the group
 

    // send message one to one 

    // io.to(room).emit('recieve-message',message); // both are work some way
     socket.to(room).emit('recieve-message',message); // both are work some way does'nt matter 
   })

   // join room // when we are talking about socket that means individual socket
   // request person join only the room  jisne bhi request kiya hai wo hi join karenga us room ko
   socket.on('join-room',({roomName,userName}) => {
      socket.join(roomName);
      console.log(`${userName} joined room ${roomName}`);
      socket.broadcast.emit(`join-${roomName}`,`${userName} joined room ${roomName}`);
   })

   // Handle leaving room
   socket.on('leave-room', () => {
    socket.leave(roomName);
    console.log(`${userName} left room ${roomName}`);
    socket.broadcast.to(roomName).emit('leave', `${userName} left room ${roomName}`);
});

   socket.on('disconnect',() => {
     console.log('User Disconnect',socket.id);
   })

});

// app.listen is internally http.createServer creates
// app.listen pe new instance create hongo
server.listen(PORT, () => {
  console.log(`Server Running At PORT ${PORT}`);
});
