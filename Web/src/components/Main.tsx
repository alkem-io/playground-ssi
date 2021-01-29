import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Home } from '../pages/Home';
import { Deliverer } from '../pages/Deliverer';
import { Client } from "../pages/Client";

const Main = () => {
  return (
    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' component={Home}></Route>
      <Route exact path='/Client' component={Client}></Route>
      <Route exact path='/Deliverer' component={Deliverer}></Route>
    </Switch>
  );
}

export default Main;