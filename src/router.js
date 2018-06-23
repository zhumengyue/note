import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Note from './routes/Note';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Note} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
