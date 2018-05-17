import React, {Component} from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import './nav.css';

class Navigation extends Component {

    render() {
        return (
            <Navbar fluid>
                <Navbar.Header>
                    <Navbar.Brand>
                        <img src={require('./traveloka_logo.png')} className="App-logo" alt="logo"/>
                    </Navbar.Brand>
                </Navbar.Header>
            </Navbar>
        )
    }

}

export default Navigation;