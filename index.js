
import express from "express"
import mongoose from "mongoose";
import ChatModel from "./models/chatModel.js"
import chatImageModel from "./models/chatImageModel.js";
import MessageModel from "./models/messageModel.js"
import cors from 'cors';
import { config } from "dotenv";
import fs from "fs";
import cloudinary from "./utils/cloundinary.js";
import upload from "./middleware/multer.js";
import multer from "multer"

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
mongoose.connect(
    "mongodb+srv://fairyqueen214:FAIRYQUin214@cluster0.kyo3a.mongodb.net/Chimbo?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log("Connected to DB")
);
// mongoose.connect("mongodb+srv://fairyqueen214:FAIRYQUin214@cluster0.kyo3a.mongodb.net/Chimbo?retryWrites=true&w=majority")
// mongoose.connect("mongodb+srv://hasnat100:123hasnat@cluster0.pslss.mongodb.net/ChimboByHasnat")
// mongoose.connect("mongodb+srv://hasnat100:123hasnat@cluster0.pslss.mongodb.net/ChimboByHasnat111")
// Upload Images 
app.use('/image-uploads', express.static('image-uploads'))
app.use('/video-uploads', express.static('video-uploads'))
// app.use('/upload-image', require('./upload-image'))

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
import message from "./routes/messages.routes.js"

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
app.use("/api/message", message)

app.use("/*", (req, res, next) => {
    const err = new AppError(404, "fail", "undefined route");
    next(err, req, res, next);
});

app.use(globalErrHandler);

server.listen(5000, () => {
    console.log("server Started at 3000");
})

let activeUsers = [];

app.post("/api/sendFile", upload.single("file"), async (req, res) => {
    try {
        console.log(req.file)
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" })
            if (result) {
                console.log(result)
                res.json({
                    message: "uploaded to cloudinary",
                    fileUrl: result.secure_url,
                    public_id: result.public_id
                })
            }
        }
    }
    catch (error) {
        console.log(error)
        res.json({
            message: "Error occurred while sending image",
            error: error
        })
    }
})



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






    socket.on("chat-start", async (data) => {
        var { senderId, receiverId } = data;

        const checkResult = await ChatModel.findOne({
            members: { $all: [senderId, receiverId] },
        });

        if (!checkResult) {
            const newChat = new ChatModel({
                members: [senderId, receiverId],
            });
            var savedChat = newChat.save();
        }
        else {
            var savedChat = await ChatModel.findOneAndUpdate({ _id: checkResult._id },
                {
                    members: [senderId, receiverId],
                },
                {
                    new: true,
                },
            )
        }

        try {
            if (savedChat) {
                console.log("successfully stored")

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
        }
        catch (err) {
            console.log(err);
            console.log("error in saving chat");
        }
    })



    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId);

        console.log("Sending from socket to :", receiverId)
        console.log("Data: ", data)


        const { chatId, senderId, msg_type } = data;
        const text = data.text
        const message = new MessageModel({
            _id: mongoose.Types.ObjectId(),
            chatId: chatId,
            senderId: senderId,
            text: text,
            msg_type: msg_type,

            time: new Date()
        });
        message.save(function (err) {
            if (!err) {
                console.log(message);
                console.log("Message has been stored in message database")
            } else {
                console.log("Error in storing messages");
            }
        })
        if (user) {
            data.time = message.time;
            console.log(message);
            io.to(user.socketId).emit("recieve-message", data);
        }
    });


})


