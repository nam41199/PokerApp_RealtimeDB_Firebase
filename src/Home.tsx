import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import App from './App';
import Login from './Login';

function Home() {
    return (
        
            <BrowserRouter>
            {localStorage.getItem("user") ? <Redirect to="/home"/> :<Redirect to="/login"/> }
                <Switch>

                    <Route path="/home">
                        <App />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                </Switch>
            </BrowserRouter>
      
    )
}
export default Home;