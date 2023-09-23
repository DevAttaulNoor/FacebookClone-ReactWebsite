import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { StateProvider } from './Components/BackendRelated/StateProvider';
import reducer, { initialState } from './Components/BackendRelated/Reducer'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StateProvider initialState={initialState} reducer={reducer}>
        <App />
    </StateProvider>
);