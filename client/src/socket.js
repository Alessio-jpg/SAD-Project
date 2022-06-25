import {io} from "socket.io-client";
import React from 'react';
//import { SOCKET_URL } from "config";

const SOCKET_URL = 'http://192.168.0.144:5000';

export const socket = io(SOCKET_URL);
export const SocketContext = React.createContext();
