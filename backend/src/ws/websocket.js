import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { MessageModel } from "../models/message.model.js";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });
  const notifyAboutOnlinePeople = () =>{
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            name: c.name,
          })),
        })
      );
    });
  };
  wss.on("connection", (connection, req) => {
    
    // console.log('Client connected');
    // connection.send('Hello Sayan');
    // console.log(req.headers);
    // Read the name and userId from the cookie for the connection
    const cookies = req.headers.cookie;
    // console.log(cookies);
    if (cookies) {
      const tokenCookieString = cookies
        .split(";")
        .find((str) => str.startsWith("token=")); // split cookies if there is more than one cookie that starts with 'token='
      // console.log(cookieString);
      const token = tokenCookieString.split("=")[1];
      if (token) {
        // console.log(token);
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, data) => {
          if (err) throw err;
          // console.log(data);
          const { userId, name } = data;
          connection.userId = userId;
          connection.name = name;
          notifyAboutOnlinePeople();
        });
      }
    }

    connection.on("message", async (message) => {
     try {
       // console.log(message); The message is in buffer form
       const messsageData = JSON.parse(message.toString());
     //   console.log(messsageData);
       const { recipient, text, file } = messsageData.message;
     //   console.log(recipient);
     //   console.log(text);
       let fileName = null;
       if(file){
         // console.log({file});
         const __filename = fileURLToPath(import.meta.url);
         const __dirname = dirname(__filename);
         const parts = file.name.split('.');
         const extension = parts[parts.length - 1];
         fileName = `${Date.now()}.${extension}`;
         const path = `${__dirname}/../uploads/${fileName}`;
         const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
         fs.writeFile(path, bufferData, () =>{
           console.log("file saved" + path);
         })
       }
       if (recipient && (text || file)) {
         const messageDoc = await MessageModel.create({
             sender: connection.userId,
             recipient,
             text,
             file: file ? fileName : null
         });
         [...wss.clients]
           .filter((c) => c.userId === recipient)
           .forEach((c) => c.send(JSON.stringify({ 
             sender:connection.userId, 
             recipient, 
             _id: messageDoc._id, 
             text,
             file: file ? fileName : null 
           })));
       }
      } catch (error) {
        console.error('Message handling error:', error);
      }
    });

    // console.log([...wss.clients].map(c => c.name));
    // this is for online checking (Notify everyone about online people)

    notifyAboutOnlinePeople()
  });

}
