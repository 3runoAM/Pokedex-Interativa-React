import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {ToastProvider} from "./provider/ToastProvider";
import {ConfirmationProvider} from "./provider/ConfirmationProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ToastProvider>
                <ConfirmationProvider>
                    <App/>
                </ConfirmationProvider>
            </ToastProvider>
        </BrowserRouter>
    </React.StrictMode>
);

