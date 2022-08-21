import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

const Navigation: React.FC = () => {

    return (
        <nav className="App-nav">
            <ul>
                <Link to="/"><li>Main Page</li></Link>
                <Link to="/list"><li>Bet List</li></Link>
            </ul>
        </nav>
    )
}

export default Navigation;