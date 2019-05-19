
import Peer, { DataConnection } from 'peerjs';
import { listeners } from 'cluster';


/**
 * Listen to changes within data connection.
 */
export interface ConnectionListener {

    connectionEstablished(): void;
    connectionLost(): void;
    connectionMessageUpdate(msg: string): void;

}

export class ConnectionManager {
    peer: Peer;
    connection: DataConnection;
    listeners: ConnectionListener[] = [];
    lastPing: number;

    constructor() {
        this.peer = new Peer({debug: 2});
    }

    addListener(connListener: ConnectionListener) {
        this.listeners.push(connListener);
    }

    private notifyConnectionEstablished() {
        this.listeners.forEach((listener) => {
            if (listener.connectionEstablished) {
                listener.connectionEstablished();
            }
        });
    }
    
    private notifyConnectionLost() {
        this.listeners.forEach((listener) => {
            if (listener.connectionLost) {
                listener.connectionLost();
            }
        });
    }

    private notifyConnectionMessageUpdate(msg: string) {
        this.listeners.forEach((listener) => {
            if (listener.connectionMessageUpdate) {
                listener.connectionMessageUpdate(msg);
            }
        });
    }

    connect(connectionId: string) {
        // initiate peer connection
        this.connection = this.peer.connect(connectionId);

        this.peer.on('connection', (data) => {
            console.log('peer on connection');
        });
        this.peer.on('open', (id) => {
            console.log('peer open, id: ', id);
            this.notifyConnectionMessageUpdate('Peer open. Ready to connect.');
        });
        this.peer.on('error', (err) => {
            console.error('error: ', err);
            this.notifyConnectionLost();
            this.notifyConnectionMessageUpdate('Connection lost due to peer error.');
        });
        this.connection.on('open', () => {
            this.notifyConnectionMessageUpdate('Connection successfull!');
            console.log('connection successfull');
            this.connection.on('data', (data) => {
                console.log('received data: ', data);
                if (data === 'ping') {
                    this.connection.send('pong');
                } else if (typeof data === 'object') {
                    data = <{t: any, v: any}> data;
                    if (data.t === 'ping') {
                        // received last ping value
                        this.lastPing = data.v;
                    }
                }
                
            });
            this.connection.send('hellooo');
        });
        this.connection.on('close', () => {
            console.log('Connection closed');
            this.notifyConnectionLost();
        });
        this.connection.on('error', (err) => {
            console.error('Connection error');
            this.notifyConnectionLost();
        });
    }

}
