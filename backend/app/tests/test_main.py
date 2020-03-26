from fastapi.testclient import TestClient
from app.db.schemas import MessageTypeEnum, WebSocketResponse

from starlette.websockets import WebSocket


async def app(scope, receive, send):
    assert scope['type'] == 'websocket'
    websocket = WebSocket(scope, receive=receive, send=send)
    await websocket.accept()
    await websocket.send_json(WebSocketResponse(
        type=MessageTypeEnum.MESSAGE_SENT,
        data={
            'user': 'guest',
            'message': 'Hello World!',
        }
    ).dict())
    await websocket.close()


def test_websocket_message():
    client = TestClient(app)
    with client.websocket_connect("/ws") as websocket:
        response = websocket.receive_json()
        assert response
        assert response['type'] == MessageTypeEnum.MESSAGE_SENT
        assert response['data']['message'] == 'Hello World!'
