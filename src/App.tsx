import React from 'react';
import { Game } from './components/Game';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <h1>Time Hacker Game</h1>
            <Game />
        </div>
    );
};

export default App;
