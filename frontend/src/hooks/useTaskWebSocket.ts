import {useEffect, useRef} from 'react';
import type {Dispatch, SetStateAction} from 'react';
import type {Task} from '../components/types';


// Derive the WS URL from the Vite API base URL
const WS_BASE = (import.meta.env.VITE_API_BASE_URL as string ?? 'http://localhost:3000')
    .replace(/^http/, 'ws')
    .replace(/\/api$/, '');

// The server validates this list against its own ALLOWED_EVENTS set.
const INTERESTED_IN = ['task:created', 'task:updated', 'task:deleted'] as const;

// Reconnect delay bounds (exponential backoff)
const INITIAL_DELAY_MS = 1000;
const MAX_DELAY_MS = 30000;

// The event shape: subscribed and 3 types of task events
interface WsEvent {
    type: 'subscribed' | 'task:created' | 'task:updated' | 'task:deleted';
    payload?: unknown;
}

// hooks
export function useTaskWebSocket(
    setTasks: Dispatch<SetStateAction<Task[]>>,
    fetchTasks: () => void,
): void {
    // stores the current websocket connection (reRef to not cause a re-render)
    const wsRef = useRef<WebSocket | null>(null);
    // we want a delay, because we want to make sure the frontend won't send like 100 times per second requests to the backend
    const reconnectDelayRef = useRef(INITIAL_DELAY_MS);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Tracks whether the component has unmounted so reconnect loops stop cleanly
    const unmountedRef = useRef(false);
    // run it once when the component mounts
    useEffect(() => {
        unmountedRef.current = false;

        // create the actual websocket connection
        function connect() {
            const token = localStorage.getItem('token');
            if (!token || unmountedRef.current) return;

            const ws = new WebSocket(WS_BASE);
            wsRef.current = ws;
            // send the message on open
            ws.onopen = () => {
                // this is the message we send to the backend to subscribe to the websocket
                // type + jwt token + interestedIn
                ws.send(JSON.stringify({
                    type: 'subscribe',
                    token,
                    interestedIn: [...INTERESTED_IN],
                }));
            };

            // handle incoming messages (when backend -> frontend)
            ws.onmessage = (event) => {
                let msg: WsEvent;
                try {
                    msg = JSON.parse(event.data as string);
                } catch {
                    return;
                }
                // route by message type (handles all 4 cases)
                switch (msg.type) {
                    case 'subscribed':
                        // Subscription confirmed — reset reconnect delay
                        reconnectDelayRef.current = INITIAL_DELAY_MS;
                        console.log('Subscribed to:', INTERESTED_IN.join(', '));
                        break;

                    case 'task:created': {
                        // Idempotent: only add if we don't already have this task
                        // so check the task if it exists (might have added it optimistically, which it probably did)
                        const incoming = msg.payload as Task & { _id?: string };
                        setTasks(prev => {
                            const exists = prev.some(t =>
                                (t as any)._id === incoming._id || t.id === incoming.id
                            );
                            return exists ? prev : [...prev, incoming];
                        });
                        break;
                    }

                    case 'task:updated': {
                        // replace the old one with the new one
                        // Safe to apply even if optimistic update already ran
                        const updated = msg.payload as Task & { _id?: string };
                        setTasks(prev => prev.map(t =>
                            (t as any)._id === updated._id ? updated : t
                        ));
                        break;
                    }

                    case 'task:deleted': {
                        // Idempotent: filter is always safe — removing an absent
                        // item leaves the array unchanged.
                        const {id} = msg.payload as { id: string };
                        setTasks(prev => prev.filter(t => (t as any)._id !== id));
                        break;
                    }
                }
            };

            // on close reconnect
            // using increasing delays to avoid overwhelming the server."
            ws.onclose = () => {
                if (unmountedRef.current) return;

                const delay = reconnectDelayRef.current;
                console.log(`Disconnected. Reconnecting in ${delay}ms...`);

                reconnectTimerRef.current = setTimeout(() => {
                    // Double the delay each attempt, capped at MAX_DELAY_MS
                    reconnectDelayRef.current = Math.min(delay * 2, MAX_DELAY_MS);
                    // "Re-fetch current state
                    // This restores consistency for any events missed while offline
                    fetchTasks();
                    connect();
                }, delay);
            };
            // on error let onclose handle the reconnect
            ws.onerror = () => {
                // Closing triggers onclose, which schedules the reconnect
                ws.close();
            };
        }

        connect();
        // handle the cleanup on unmount
        return () => {
            unmountedRef.current = true;
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
            wsRef.current?.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}