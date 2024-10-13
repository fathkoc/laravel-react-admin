import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';

import { Navigator } from './core';
import { ROUTES } from './config';
import { Loading } from './views';
import { AppProvider } from './AppContext';
import TaskDashboard from './components/TaskDashboard'; // Görev yönetim bileşeni

function App(props) {
    const [initialized, setInitialized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [nightMode, setNightMode] = useState(false);
    const [token, setToken] = useState({});
    const [user, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [monitoringEnabled, setMonitoringEnabled] = useState(false);
    const [responseInterceptor, setResponseInterceptor] = useState(null);

    const monitor = () => {
        const configItem = document.querySelector('meta[name=TELESCOPE_ENABLED]');
        if (configItem) {
            setMonitoringEnabled(Boolean(configItem.content));
        }
    };

    const removeResponseInterceptor = (interceptor) => {
        axios.interceptors.response.eject(interceptor);
    };

    const addResponseInterceptor = () => {
        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response.status === 401) {
                    removeToken();
                }
                return Promise.reject(error);
            }
        );

        setResponseInterceptor(responseInterceptor);
    };

    const authenticate = async (tokenString) => {
        const token = JSON.parse(tokenString);
        if (token === {}) {
            return;
        }
        storeToken(token);
        await fetchUser();
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await axios.post('/api/v1/auth/signout');
            removeToken();
            setLoading(false);
            setAuthenticated(false);
            setUser({});
        } catch (error) {
            //
        }
    };

    const handleNightModeToggled = () => {
        setNightMode(!nightMode);
        if (!nightMode) {
            window.localStorage.setItem('nightMode', true);
        } else {
            window.localStorage.removeItem('nightMode');
        }
    };

    const handleLock = (username) => {
        setUsername(username);
        signOut();
    };

    const handleSignOut = () => {
        signOut();
    };

    const night = () => {
        const nightMode = window.localStorage.getItem('nightMode');
        setNightMode(nightMode ? true : false);
    };

    const getToken = () => {
        const tokenString = window.localStorage.getItem('token');
        if (!tokenString) {
            return {};
        }
        const token = JSON.parse(tokenString);
        setToken(token);
        return token;
    };

    const storeToken = (token) => {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${token.auth_token}`;
        window.localStorage.setItem('token', JSON.stringify(token));
    };

    const removeToken = () => {
        localStorage.removeItem('token');
    };

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/auth/user');
            setAuthenticated(true);
            setUser(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        if (initialized) {
            return;
        }
        monitor();
        addResponseInterceptor();
        night();
        const token = getToken();
        if (Object.keys(token).length > 0) {
            authenticate(JSON.stringify(token));
        } else {
            setLoading(false);
        }
        if (responseInterceptor !== null) {
            removeResponseInterceptor(responseInterceptor);
        }
        setInitialized(true);
    }, [initialized]);

    const { environment, darkTheme, lightTheme } = props;

    const pageProps = {
        environment,
        routes: ROUTES,
        loading,
        authenticated,
        nightMode,
        user,
        token,
        username,
        monitoringEnabled,
        handleNightModeToggled,
        authenticate,
        handleLock,
        handleSignOut,
    };

    return (
        <MuiThemeProvider theme={nightMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <AppProvider {...pageProps}>
                {loading ? (
                    <Loading />
                ) : (
                    <Router>
                    <>
                        <Navigator />
                        <TaskDashboard />
                    </>
                </Router>
                )}
            </AppProvider>
        </MuiThemeProvider>
    );
}

App.propTypes = {
    environment: PropTypes.oneOf(['backoffice']).isRequired,
    darkTheme: PropTypes.object.isRequired,
    lightTheme: PropTypes.object.isRequired,
};

export default App;
