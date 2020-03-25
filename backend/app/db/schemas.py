from pydantic import BaseModel
from enum import Enum
import typing as t


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True


class MessageTypeEnum(str, Enum):
    USER_CONNECTED = 'USER_CONNECTED'
    USER_DISCONNECTED = 'USER_DISCONNECTED'
    MESSAGE_SENT = 'MESSAGE_SENT'


class WebSocketResponse(BaseModel):
    type: MessageTypeEnum
    data: t.Dict
