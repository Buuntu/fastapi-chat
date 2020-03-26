from fastapi import FastAPI
import typing as t
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.websockets import WebSocket, WebSocketDisconnect

from app.core import config
from app.db.session import SessionLocal
from app.db.schemas import WebSocketResponse, MessageTypeEnum


app = FastAPI(
    title=config.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
)

# CORS
origins = []

# Set all CORS enabled origins
if config.BACKEND_CORS_ORIGINS:
    origins_raw = config.BACKEND_CORS_ORIGINS.split(",")
    for origin in origins_raw:
        use_origin = origin.strip()
        origins.append(use_origin)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    ),


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


class Notifier:
    """
    Class used to handle various websocket connections and broadcast
    messages to all of those

    WebSocket connections are tied to users and removed when a user
    disconnects
    """
    def __init__(self):
        self.connections: t.Dict[str, WebSocket] = {}
        self.generator = self.get_notification_generator()

    async def get_notification_generator(self):
        while True:
            message = yield
            await self._notify(message)

    async def push(self, msg: WebSocketResponse):
        await self.generator.asend(msg)

    async def connect(self, websocket: WebSocket, user_id: str):
        if user_id in self.connections:
            await self.push(WebSocketResponse(
                type=MessageTypeEnum.ERROR,
                data={
                    'message': 'user is already registered',
                    'user': user_id,
                }
            ))
        await websocket.accept()
        self.connections[user_id] = websocket

        await self.push(WebSocketResponse(
            type=MessageTypeEnum.USER_CONNECTED,
            data={
                'message': 'user connected',
                'user': user_id,
                'num_users': len(self.connections)
            }
        ))

    async def remove(self, websocket: WebSocket, user_id: str):
        if (user_id in self.connections):
            self.connections.pop(user_id)

            await self.push(WebSocketResponse(
                type=MessageTypeEnum.USER_DISCONNECTED,
                data={
                    'message': 'user disconnected',
                    'user': user_id,
                    'num_users': len(self.connections)
                }
            ))

    async def _notify(self, message: WebSocketResponse):
        living_connections = {}
        keys = list(self.connections)
        for user in keys:
            print(user)
            # Looping like this is necessary in case a disconnection is handled
            # during await websocket.send_text(message)
            websocket = self.connections.pop(user)
            await websocket.send_json(message.dict())
            living_connections[user] = websocket
        self.connections = living_connections


notifier = Notifier()


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str = 'guest',
):
    await notifier.connect(websocket, user_id)
    try:
        while True:
            response = await websocket.receive_json()
            if 'type' in response and 'data' in response:
                await notifier.push(WebSocketResponse(
                    type=response['type'],
                    data=response['data'],
                ))
    except WebSocketDisconnect:
        await notifier.remove(websocket, user_id)


@app.on_event("startup")
async def startup():
    # Prime the push notification generator
    await notifier.generator.asend(None)
