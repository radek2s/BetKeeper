import React from 'react';

import logo from '../logo.svg';
const Loading: React.FC = () => {
    return (
        <div className="App-loader">
            <div>
                <img src={logo} className="App-logo" alt="logo"/>
            </div>
            <div>
                <p>Loading please wait...</p>
            </div>
        </div>
    )
}
export default Loading;