process.title = "node-chat";
SCREEN = {
    height: 900,
    width: 580,
};

class ShipClient {
    constructor(ws) {
        this.ws = ws;
        this.coords = [];
    }

    init(){
        const y = Math.random() * (SCREEN.height - 60) + 60;
        const x = Math.random() * (SCREEN.width - 60) + 60;
        this.coords = [Math.floor(x), Math.floor(y)];
        this.cid = '_' + Math.random().toString(36).substr(2, 9);
    }

    configureData (){
        let data = {
            id: this.cid,
            coords: this.coords,
            ready: 1,
        };
        return  data;
    }

    send(data){
        this.ws.send(data);
    }
}

CLIENTS = [];

// imports
const WebSocket = require("ws");


// Create ws server
const wsServer = new WebSocket.Server({port: 8080});

// Handle ws events
wsServer.on("connection", ws => {
    console.log("New client connected!");
    let client = new ShipClient(ws);
    client.init();
    console.log(client.cid, client.coords);
    CLIENTS.push(client);

    const data = client.configureData();
    ws.send(JSON.stringify(data));

    // CLIENTS.forEach( (client) => {
    //     if (client.ws !== ws){
    //         const data = client.configureData();
    //         client.ws.send(data);
    //     }
    // })
    ws.on("message", (msg)=> {
        if(msg === "up"){
            console.log("up");
            client.coords[1] += 1;
            let data = client.configureData();
            data.ready = 2;
            console.log(data);
            ws.send(JSON.stringify(data));
        }
        // console.log("up");
    })
});