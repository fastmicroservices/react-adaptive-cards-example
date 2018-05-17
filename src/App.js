import './App.css';
import React, {Component} from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Navigation from "./components/nav/navigation";
import SearchFlights from "./components/flight/search_flights";
class App extends Component {

    render() {
        return (
            <div className="App">
               {/* <header className="App-header">
                    <Navigation/>
                </header>*/}
                <Grid fluid>
                    <SearchFlights className="searchFlighs"/>
                </Grid>
            </div>

        );
    }
}

export default App;
