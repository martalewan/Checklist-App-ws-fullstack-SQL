import { log } from "console";

interface Msg {
  command: string,
  data?: any,
  id?: number | string,
  
}

export class WebsocketHandler {

  cleanDisconnect: boolean;
  wsSocket: any;
  endpoint: string;

  constructor(endpoint : string) {
      this.cleanDisconnect = true;
      this.wsSocket = undefined;
      this.endpoint = endpoint;
  }

  connect(todoListId : number, messageHandler : Function , onClose : Function , onOpen : Function) {

      this.wsSocket = new WebSocket(this.endpoint);
      this.cleanDisconnect = false;

      this.wsSocket.onopen = () => {
          onOpen && onOpen();
          console.log(`Connected to session ${todoListId}`);
          // Handshake protocol
          this.send({"command": "join", "id": todoListId});
      }

      this.wsSocket.onmessage = (msg : Msg) => {
          messageHandler && messageHandler(JSON.parse(msg.data));
      }

      this.wsSocket.onclose = () => {
          console.info("Connection to " + todoListId + " closed");
          const reconnect = () => this.connect(todoListId, messageHandler, onClose, onOpen)
          onClose && onClose(this.cleanDisconnect, reconnect);
      }
  }

  send(msg : Msg) {
      const serializedMessage = JSON.stringify(msg);
      this.wsSocket.send(serializedMessage);
  }

  disconnect() {
      if (this.wsSocket !== undefined) {
          this.cleanDisconnect = true;
          this.wsSocket.close();
      }
  }

  sendMessage(msg : Msg) {
  }
}