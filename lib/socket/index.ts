export {
  getSocket,
  connectSocket,
  disconnectSocket,
} from "./client";
export { SERVER_EVENTS } from "./client";
export type {
  JoinRoomPayload,
  CircuitUpdatePayload,
  StudentJoinedEvent,
  StudentDisconnectedEvent,
  FullStatePayload,
  AnnotationStartPayload,
  AnnotationDrawPayload,
  AnnotationEndPayload,
  AnnotationClearPayload,
} from "./types";
export {
  useSocketStatus,
  useJoinRoom,
  useCircuitBroadcast,
  useCircuitSubscription,
  useRoomEvents,
  useFullState,
} from "./hooks";
export type {
  SocketStatus,
  StudentEvent,
  FullState,
} from "./hooks";