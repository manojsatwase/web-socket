# web-socket
client and server make a dual request

# socket.io 
insalation :
backend :-
npm i socket.io 

frontend :- 
npm i socket.io-client

socket.io is library of web socket ke liye hai library

web socket :- wen socket is a comunication protocol
 eg. websocket, HTTP , FTP , SMTP - SIMPLE MALE TRANSFER PROTOCOL
    

HTTP:-       Request one way request comunication only client can request
    client  --------> server
           <---------

                        doual comunication
WEB SOCKET :-   client <---------------->  server

 eg. notification push, admin status change real time

web socket event notify function to send data 
                notify <---------------> notify



SOCKET.IO :-

SERVER : 
 
circuit :  socket 1 : client1 +  socket 2 : client1  +  socket 3 : client3
   
IO :- when  we write IO then we are reffering to entire circuit

io.on("connection", (socket) => {
  console.log('User Connection', socket.id);
});

emit is method whenever we write emit to send message or event to trigger this allows real-time communication between the client and server.

and i'm write perticular socket then i;'m talking about perticular user not a entire circuit

IO: means entire circuit
socket : means induatual user jis jis ne connection buil kiya hai or create kiya hai


SOCKET :- every socket is own id assign and we can access that id through the socket.id


now question is ? how to trigger event

emit :- event trigger - emit this event this event karne pe we are send data alway ak listener lag raha honga on ke sath jo ki is event ko thisevent ko listener kar raha honga
eg. this event(data);

on :- handler listener 
on.thisevent(data) // receive that data 
and jaise hi thisevent trigger hongo receive that data 


server :- 
IO.emit('event1','hi');

const socket = io('http://localhost:3000');

 useEffect(()=> {

  socket.on('connect',() => {
    console.log('connected',socket.id)
  })
 })

              eg event name is btn
socket.emit('event-name',5)
e.g
socket.emit('btn',5)


server:-
syntax :-
socket.on('btn',(n)=>{
 console.log(n);
})

client :- 
CLICK :- on the click on this button event tricker hongo this btn trigger hongo socket.emit('btn',5)

IO: whenever i talk IO. then i'm talking about entire circuit
SOCKET:- whener i talk socket then i'm talking about indidual user ki iska kya matlab hai

when i write IO.emit('even1','hi') then i'm triggering entire circuit jitne bhi socket hai sabhi ke pass hai pohatch jayenga rather then every one and we i write IO.emit() then every one

and when i write socket.emit() us time kya honga perticular jis bhi socket ki bath horahi hai perticular usi ko message jayenga

 
Asa Koi Senario Hai :- jaise ki person1 ne request kari isko chhot ke baki sabhi ko message send karna hai ha uske liye bhi hai 
socket.broadcast.emit()
When a client sends a 'chat message' event (socket.emit('chat message', msg)), the server receives it and then broadcasts it to all other clients except the sender using socket.broadcast.emit('chat message', msg).
This way, every client in the chat room will receive messages from other clients but won't receive their own messages echoed back. jisne send kiya hai usko chhod ke sabhi ko message chala jayenga

server :-                        client "-
1. io.emit for all               
2. socket.emit for inditual user      socket.on('event-name',(m)m=>)
3. socket.broadcast.emit jo socket hai usko chhot ke sabhi pe jaraha hai
4. To:  personal chat or individually group eg.
 socket A ko Socket C se chat karni ho to
 socket B ko A se karni ho to kaise karenga
for example group room  
individually seperate by one by one
room ki ID 
every socket is own id 
A socket to chat B socket then we send B id inside to()
 individually to hai hi ak room me

socket.to(roomB_id).emit(room_id); 

To: to trigger event for perticular room

Join :  
10 user hai but if we want to send message 5 user then un 5 cho ko ak room pe dal sakte hai
jo bhi us group me message karenga un sabhi ko pohatch jayenga

Join -> To join people 
socket.join('room-name or groop name')
and then we can send message to the help of socket.to().emit(); 

To: why to ke undar id deni padengi because of by default wo usi room ke andar hai user

Pre-Built Event :-
connection , disconnect


server :-

io.on('connection',(socket)=>{
    console.log(socket.id);
      sending request to the client event name welcome 
      socket.emit('welcome','welocme to the server'); // socket.emit individualy user
})


// recieving server request on client
client  : -
import {io} from 'socket.io.client'

const socket = io('server path');

useEffect(()=>{
 socket.on('connect',(socket)=>{
   console.log(socket.id);
   socket.on receiving server request individual user through the welcome event name
    socket.on('welcome',msg => {
       console.log(msg);
   })
})
},[])


// socket means individual socket
io.on("connection", (socket) => {
   console.log('User Connection', socket.id);
   //socket.emit('welcome',`welcome to the user $${socket.id}`); // perticlar message send
   socket.broadcast.emit('welcome',`$${socket.id} join the server`);
   // client 1 and client 2 if client 1 
     // client 1 refresh page then see the message on client 2 client1id join server
     // if client 2 refresh page then see the message on client 1 client2id joint the server
});
