
import express from "express"
import mongoose from "mongoose";
import ChatModel from "./models/chatModel.js"
import chatImageModel from "./models/chatImageModel.js";
import MessageModel from "./models/messageModel.js"
import cors from 'cors';
import { config } from "dotenv";
import fs from "fs";

config({
    path: "./config.env",
});

import path from "path";
const app = express();

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

import globalErrHandler from "./utils/errorController.js";
import AppError from "./utils/appError.js";
app.use(express.static('public'));
app.use(cors());
app.use(express.json())
app.get("/chk", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

import * as socketio from "socket.io"

import { createServer } from 'http';


const server = createServer(app);
const io = new socketio.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});
// 
// mongoose.connect("mongodb://127.0.0.1:27017/ChimboByHasnat")
mongoose.connect("mongodb+srv://hasnat100:123hasnat@cluster0.pslss.mongodb.net/ChimboByHasnat")
// mongoose.connect("mongodb+srv://hasnat100:123hasnat@cluster0.pslss.mongodb.net/ChimboByHasnat111")
import listingRoutes from "./routes/listing.routes.js"
import specificationRoutes from "./routes/specification.routes.js"
import roomCharRoutes from "./routes/roomCharacteristics.routes.js"
import propertyTypeRoutes from "./routes/propertyType.routes.js";
import userRoutes from "./routes/users.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import listingFeaturesRoutes from "./routes/listingFeatures.routes.js"
import savedSearches from "./routes/savedSearches.routes.js"
import wishListItems from "./routes/wishlist.routes.js"
import accessibilityItems from "./routes/accessibilityItems.routes.js"
import gender from "./routes/gender.routes.js"
import heatingType from "./routes/heatingType.routes.js"
import occupationType from "./routes/occupationType.routes.js"
import listingType from "./routes/listingType.routes.js"
import floor from "./routes/floors.routes.js"
import chat from "./routes/chat.routes.js"




app.use("/api/listings", listingRoutes)
app.use("/api/specifications", specificationRoutes)
app.use("/api/room-characteristics", roomCharRoutes)
app.use("/api/property-types", propertyTypeRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/listing-features", listingFeaturesRoutes)
app.use("/api/saved-searches", savedSearches)
app.use("/api/wishlist", wishListItems)
app.use("/api/accessibility-items", accessibilityItems)
app.use("/api/genders", gender)
app.use("/api/heating-types", heatingType)
app.use("/api/occupation-types", occupationType)
app.use("/api/listing-types", listingType)
app.use("/api/floors", floor)
app.use("/api/chat", chat)
// app.use('/images', express.static('images'));
// app.use('/profile-photos', express.static('images/profile-photos'));



app.use("/*", (req, res, next) => {
    const err = new AppError(404, "fail", "undefined route");
    next(err, req, res, next);
});

app.use(globalErrHandler);



// const user = {};

// io.on("connection", (socket) => {
//     // add new User
//     socket.on("login", (newUserId) => {
//         console.log(newUserId);
//         user[socket.id] = newUserId;
//         console.log(socket.id);
//         console.log(newUserId);
//         socket.emit('user-joined', newUserId)
//         console.log(user);
//         socket.username = "hasnat"
//         console.log(socket);
//         // if user is not added previously
//         // if (!activeUsers.some((user) => user.userId === newUserId)) {
//         //     activeUsers.push({ userId: newUserId, socketId: socket.id });
//         //     console.log("New User Connected", activeUsers);
//         // }
//         // send all active users to new user
//         // io.emit("get-users", activeUsers);
//     });
// });
// io.on("connection", socket => {
//     console.log(socket.id);
//     // socket.on("private message", (msg, id) => {
//     //     // console.log(id);
//     //     socket.join(id)
//     //     console.log(msg);



//     //     io.to(id).emit("private", socket.id, msg);
//     // });
// });
server.listen(3000, function () {
    console.log("server started on port 3000")
})


function decodeBase64Image(dataString) {


    var buffer = Buffer.from(dataString, 'base64');

    return buffer

}



global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("new-user-add", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(onlineUsers);
    });

    socket.on("send-msg", (data) => {
        console.log(data);
        console.log(socket.id);
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            console.log(data.msg);
            socket.to(sendUserSocket).emit("recieve-message", data.msg);
        }
    });
});




/*
let activeUsers = [];

io.on("connection", (socket) => {
    // add new User
    socket.on("new-user-add", (newUserId) => {
        // if user is not added previously
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({ userId: newUserId, socketId: socket.id });
            console.log("New User Connected", activeUsers);
        }
        // send all active users to new user
        io.emit("get-users", activeUsers);
    });


    socket.on("disconnect", () => {
        // remove user from active users
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected", activeUsers);
        // send all active users to all users
        io.emit("get-users", activeUsers);
    });

    // send message to a specific user


    socket.on("chat-start", (data) => {
        console.log(data);
        console.log("has");
        var { senderId, receiverId } = data;

        const newChat = new ChatModel({
            members: [senderId, receiverId],
        });

        const result = newChat.save(function (err) {

            if (err) {
                console.log("error in chat")
            } else {
                console.log("successfully stored")
                console.log(newChat)

                ChatModel.findOne({
                    members: { $all: [senderId, receiverId] },
                }, (err, foundResult) => {
                    if (foundResult) {
                        console.log("This is chatId:" + foundResult._id)
                        let chatId = foundResult._id;
                        socket.emit("chatId-receive", chatId)
                    } else {
                        console.log("error in getting")
                    }
                });

            }
        });






    })
    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId);
        console.log("Sending from socket to :", receiverId)
        console.log("Data: ", data)
        console.log(activeUsers);
        console.log(user);
        // console.log(user.socketId);
        const { chatId, senderId } = data;
        const text = data.text;
        console.log(text);
        const message = new MessageModel({
            chatId: chatId,
            user: {
                _id: senderId
            },
            text: text,
        });
        const obj = {};
        obj.user = senderId;
        obj.content = text;
        obj.sId = socket.id;
        message.save(function (err) {
            if (!err) {
                console.log("Message has been stored in message database")
            } else {
                console.log("Error in storing messages");
            }
        })
        if (user) {
            const Sockkt = { id: user.socketId }

            // console.log(user.s   ocketId);
            io.to(user.socketId).emit("recieve-message", obj);
        }
    });

    // io.on('connection', (socket) => {
    //     console.log('a user connected');

    //     socket.on("chat-start", (data) => {
    //         console.log(data);
    //         console.log("has");
    //         var { senderId, receiverId } = data;

    //         const newChat = new ChatModel({
    //             members: [senderId, receiverId],
    //         });

    //         const result = newChat.save(function (err) {

    //             if (err) {
    //                 console.log("error in chat")
    //             } else {
    //                 console.log("successfully stored")
    //                 console.log(newChat)

    //                 ChatModel.findOne({
    //                     members: { $all: [senderId, receiverId] },
    //                 }, (err, foundResult) => {
    //                     if (foundResult) {
    //                         console.log("This is chatId:" + foundResult._id)
    //                         let chatId = foundResult._id;
    //                         socket.emit("chatId-receive", chatId)
    //                     } else {
    //                         console.log("error in getting")
    //                     }
    //                 });

    //             }
    //         });

    //     });

    //     socket.on('send-message', (data) => {
    //         console.log("received message in server side", data)
    //         io.emit('receive-message', data)
    //     })

    //     socket.on('disconnect', () => {
    //         console.log('user disconnected');
    //     });

    // })
    socket.on('image', (data1) => {
        //console.log(data)
        var data = data1.replace("data:image/jpeg;base64,", "");
        console.log(data)
        var imageBuffer = decodeBase64Image(data);



        console.log("Buffer is:" + imageBuffer);
        const file = Date.now() + "380925" + "chatImg.png";
        const path = "./chatImages/" + file
        fs.writeFile(path, imageBuffer, function (err) {
            if (!err) {
                console.log("saved")
            }
        });


        const screenshot = new chatImageModel({
            chatId: "380925",
            senderId: "33434",
            imagePath: path
        })

        screenshot.save(function (err) {
            if (!err) {
                console.log("Image sucessfully")
                io.sockets.emit('image', data1)
            }
        })

    })



});

*/
