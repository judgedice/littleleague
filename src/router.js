import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import GameView from './Containers/GameView';



export default (
    <BrowserRouter>
        <Route path="/" exact component={GameView} />
    </BrowserRouter>









);