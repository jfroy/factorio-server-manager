import React, {useCallback, useState} from 'react';

import user from "../api/resources/user";
import Login from "./views/Login";
import {Route, Routes} from "react-router";
import Controls from "./views/Controls";
import {BrowserRouter, Navigate} from "react-router-dom";
import Logs from "./views/Logs";
import Saves from "./views/Saves/Saves";
import Layout from "./components/Layout";
import server from "../api/resources/server";
import Mods from "./views/Mods/Mods";
import UserManagement from "./views/UserManagement/UserManagment";
import ServerSettings from "./views/ServerSettings";
import GameSettings from "./views/GameSettings";
import Console from "./views/Console";
import Help from "./views/Help";
import socket from "../api/socket";
import {Flash} from "./components/Flash";


const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [serverStatus, setServerStatus] = useState(null);

    const handleAuthenticationStatus = useCallback(async (status) => {
        if (status?.username) {
            setIsAuthenticated(true);

            const status = await server.status();
            setServerStatus(status);

            socket.emit('server status subscribe');
            socket.on('server_status', status => {
                setServerStatus(JSON.parse(status));
            });
        }
    },[]);

    const handleLogout = useCallback(async () => {
        const loggedOut = await user.logout();
        if (loggedOut) {
            setIsAuthenticated(false);
        }
    }, []);

    const RequireAuth = useCallback(({ children, redirectTo }) => (
        isAuthenticated ? children : <Navigate to={redirectTo} />
    ), [isAuthenticated]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={
                        <Login handleLogin={handleAuthenticationStatus}/>
                    }
                />

                <Route element={
                        <Layout handleLogout={handleLogout} serverStatus={serverStatus} />
                    }
                >
                    <Route path="/" element={
                            <RequireAuth redirectTo="/login">
                                <Controls serverStatus={serverStatus} />
                            </RequireAuth>
                        }
                    />
                    <Route path="/saves" element={
                            <RequireAuth redirectTo="/login">
                                <Saves serverStatus={serverStatus} />
                            </RequireAuth>
                        }
                    />
                    <Route path="/mods" element={
                            <RequireAuth redirectTo="/login">
                                <Mods serverStatus={serverStatus} />
                            </RequireAuth>
                        }
                    />
                    <Route path="/server-settings" element={
                            <RequireAuth redirectTo="/login">
                                <ServerSettings serverStatus={serverStatus} />
                            </RequireAuth>
                        }
                    />
                    <Route path="/game-settings" element={
                            <RequireAuth redirectTo="/login">
                                <GameSettings serverStatus={serverStatus} />
                            </RequireAuth>
                        }
                    />
                    <Route path="/console" element={
                            <RequireAuth redirectTo="/login">
                                <Console serverStatus={serverStatus} />
                            </RequireAuth>
                        }
                    />
                    <Route path="/logs" element={
                            <RequireAuth redirectTo="/login">
                                <Logs serverStatus={serverStatus} />
                            </RequireAuth>
                        }
                    />
                    <Route path="/user-management" element={
                            <RequireAuth redirectTo="/login">
                                <UserManagement serverStatus={serverStatus} />
                            </RequireAuth>
                        }
                    />
                    <Route path="/help" element={
                            <RequireAuth redirectTo="/login">
                                <Help serverStatus={serverStatus} />
                            </RequireAuth>
                        }
                    />
                    <Route element={
                            <Flash/>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
