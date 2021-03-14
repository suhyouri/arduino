//server.js
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const serialPort = require("serialport"); //immediately opens a port.

app.use(express.static(__dirname + "/"));
app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/index.html");
});

const port = new serialPort("/dev/ttyACM0", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

//start our web server and socket.io server listening
server.listen(5500, function () {
  console.log("server: listening on *:5500");
});

//let AclickCount = 0;
let RclickCount = 0;
let BclickCount = 0;
let userCount = 0;
let currentcolor='';//1.현재 색을 기록하는 바구니
let currentbtnRcolor='';//현재 버튼색기록 
let currentbtnBcolor='';//

io.on("connection", function (client) {
//클라이언트가 접속하여 연결이 만들어질 때 발생하는 이벤트 
userCount++;//event listener 

  io.emit("userCount", userCount);

  io.emit("currentcolor", currentcolor);//2.현재 색깔지정하기
  io.emit("currentbtnRcolor", currentbtnRcolor);//2.현재버튼색깔지정하기
  io.emit("currentbtnBcolor", currentbtnBcolor);

  console.log("userCount: " + userCount);

  client.on("disconnect", function (){
    userCount--;
    console.log("1 out left one :" + userCount);
    io.emit("userCount", userCount);
  });

  //when the server receives clicked message, do this
  //red button
  client.on("Rclicked", function () {
    RclickCount++;
    let Rnum = RclickCount % 2;
    console.log("Rnum: " + Rnum + ",RclickCount: " + RclickCount);

    if (Rnum == "1") {
      console.log("red on");
      port.write("2");//아두이노한테 Red 켜줘
      currentcolor='red';//server 
      currentbtnRcolor='red';
      io.emit("currentcolor", currentcolor);//2.현재 색깔지정하기
      io.emit("currentbtnRcolor", currentbtnRcolor);//2.현재버튼색깔지정하기
      //io.emit("RbuttonUpdate", Rnum); //1. 여기서Rnum넘겨줘야
    } else if (Rnum == "0") {
      console.log("red off");
      port.write("4");
      currentcolor='yellow';
      currentbtnRcolor='yellow';
      io.emit("currentcolor", currentcolor);//2.현재 색깔지정하기
      io.emit("currentbtnRcolor", currentbtnRcolor);//2.현재버튼색깔지정하기
      //io.emit("RbuttonUpdate", Rnum); //1. 여기서Rnum넘겨줘야
    }
  });
  //blue button
  client.on("Bclicked", function () {
    BclickCount++;
    let Bnum = BclickCount % 2;
    console.log("Bnum: " + Bnum + " BclickCount: " + BclickCount);
    if (Bnum == "1") {
      console.log("blue on");
      port.write("3");
      currentcolor='blue';
      currentbtnBcolor='blue';
      io.emit("currentcolor", currentcolor);//2.현재 색깔지정하기
      io.emit("currentbtnBcolor", currentbtnBcolor);//2.현재버튼색깔지정하기
      //io.emit("BbuttonUpdate", Bnum); //1. 여기서Bnum넘겨줘야
    } else if (Bnum == "0") {
      console.log("blue off");
      port.write("5");
      currentcolor='yellow';
      currentbtnBcolor='yellow';
      io.emit("currentcolor", currentcolor);//2.현재 색깔지정하기
      io.emit("currentbtnBcolor", currentbtnBcolor);//2.현재버튼색깔지정하기
      //io.emit("BbuttonUpdate", Bnum); //1. 여기서Bnum넘겨줘야
    }
  });
});
