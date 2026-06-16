// =============================================================================
// Socket.IO Server — real-time event channel
//
// REST still performs all database-changing commands. Socket.IO publishes a
// named event after a command succeeds, so other open browser clients can
// update without refreshing.
//
// Clients declare their interests in the Socket.IO auth payload:
//   auth: { interestedIn: ['dish:create', 'dish:update'] }
//
// Each event name is also used as a room name. The server validates requested
// rooms before joining them. REST mutations publish to every interested client,
// including the page that initiated the request.
// =============================================================================
import {WebSocketServer, WebSocket} from 'ws';
import {Server} from 'http';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_teaching_key';

// subscription timeouts typically range from 10 to 120 seconds
const SUBSCRIBE_TIMEOUT_MS = 100000;

// Only these public event rooms exist in the final application.
// Never join arbitrary room names supplied by a browser.
const ALLOWED_EVENTS = new Set([
    'task:created',
    'task:updated',
    'task:deleted',
]);

// Message the client sends to subscribe
interface SubscribeMessage {
    type: 'subscribe';
    token: string;
    // optional
    interestedIn?: string[];
}

// Events the server pushes to the client
export interface WsEvent {
    type: 'subscribed' | 'task:created' | 'task:updated' | 'task:deleted';
    payload?: unknown;
}

// to map from userId -> all sockets of user
const connections = new Map<string, Set<WebSocket>>();
const socketInterests = new Map<WebSocket, Set<string>>();

// function ws Attaches a WebSocketServer to the existing HTTP server
// Called once from main.ts after connectDB() resolves
// client connects -> authentication -> subscribe -> stored
export function ws(server: Server): void {
    const wss = new WebSocketServer({server});
    // listen for new connections
    wss.on('connection', (socket: WebSocket) => {
        // in the beginning to have no value, like the lecture said
        // assign it only after we verify the token
        let userId: string | null = null;

        // logic for the timeout
        const subscribeTimer = setTimeout(() => {
            if (!userId) {
                // if there is no userId -> timeout and close the socket
                socket.close(4002, 'Subscribe timeout');
                console.log('Socket closed unauthenticated socket after timeout');
            }
        }, SUBSCRIBE_TIMEOUT_MS);
        // listen for messages from the client
        socket.on('message', (data) => {
            // if already subscribed - ignore
            if (userId) return;
            let msg: SubscribeMessage;
            // try to parse the message
            try {
                msg = JSON.parse(data.toString());
            } catch {
                socket.close(4003, 'Invalid message format');
                return;
            }
            // next we would like to verify the jwt token
            try {
                const decoded = jwt.verify(msg.token, process.env.JWT_SECRET);
                userId = decoded.userId;
            } catch {
                socket.close(4004, 'Invalid token');
                return;
            }
            // lastly register the interest
            // interestedIn might contain different events so we need to pick which ones
            const requested = Array.isArray(msg.interestedIn)
                ? msg.interestedIn
                // default to all allowed events
                : [...ALLOWED_EVENTS];
            // we filter for any potential invalid event and pass only the ones that are defined in ALLOWED_EVENTS
            const validatedInterests = new Set(
                requested.filter(e => ALLOWED_EVENTS.has(e))
            );
            clearTimeout(subscribeTimer);
            // register the socket under userId
            if (!connections.has(<string>userId)) {
                // typescript screams at me because userId is null although we parse it (he doesn't know)
                if (typeof userId === "string") {
                    connections.set(userId, new Set());
                    connections.get(userId)!.add(socket);
                }
            }
            // store the event it cares about and socket
            socketInterests.set(socket, validatedInterests);

            socket.send(JSON.stringify({type: 'subscribed'} satisfies WsEvent));
        });
        // handling the logic for closing the socket
        socket.on('close', () => {
            // clear the timeout for subscribeTimer (just in case)
            clearTimeout(subscribeTimer);
            socketInterests.delete(socket)

            if (!userId) return;
            // remove the socket from the connections map
            const userSockets = connections.get(userId);
            if (userSockets) {
                userSockets.delete(socket);
                if (userSockets.size === 0) connections.delete(userId);
            }
            console.log(`User ${userId} disconnected`);
        });
        socket.on('error', (err) => {
            console.error(`Socket error for user ${userId ?? 'unknown'}:`, err.message);
        });
    });

    console.log(' WebSocket server attached');
}

// function to notify a user of an event
// smt happens -> sent it to the user (userid)
export function notifyUser(userId: string, event: WsEvent): void {
    const userSockets = connections.get(userId);
    // if user is no sockets -> return
    if (!userSockets || userSockets.size === 0) return;

    const message = JSON.stringify(event);

    for (const socket of userSockets) {
        // Check if this socket declared interest in this event type
        // we dont want to filter the subscribed event (its a system confirmation)
        const interests = socketInterests.get(socket);
        if (interests && event.type !== 'subscribed' && !interests.has(event.type)) {
            // skip — this socket didn't subscribe to this event
            continue;
        }
        // if the socket is open -> send the message
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    }
}