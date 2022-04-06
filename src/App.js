import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import { MainMenu } from './components/menu/menu'
import { ProvideAuth, useAuth } from './auth'

import Page1 from './pages/Page1'
import PrivatePage from './pages/PrivatePage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/login'
import Detail from './pages/Page2'

function PrivateRoute({ children, hasRole, ...rest }) {
  const auth = useAuth();
  return (
      <Route
          {...rest}
          render={({ location }) =>
              auth.isAutorised() && auth.hasRole(hasRole) ? (
                  children
              ) : auth.isAutorised() && !auth.hasRole(hasRole) ? <div>Access denied</div> : (
                  <Redirect
                      to={{
                          pathname: '/login',
                          state: { from: location }
                      }}
                  />
              )
          }
      />
  )
}

// This is for pages like your.app/books/the-bible, wthere 'the-bible' in nan Object ID
// 
// const Child = ({ match }) => {
//   return (
//   <div>Object ID: {match.params.id}</div>
//   )
// } 

export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <MainMenu />
        <Switch>

         {/* Public pages */}
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/">
            <Page1 />
          </Route>
          <Route path="/product/:id">
            <Detail />
          </Route>
          
          {/* Pages for any authorised user */}
          <PrivateRoute path="/private">
            <PrivatePage />
          </PrivateRoute>
          
          {/* Pages for users, who have role == 'admin'. You can apply any other value here */}
          <PrivateRoute path="/admin" hasRole={'admin'}>
            <AdminPage />
          </PrivateRoute>

          {/* This is for pages like your.app/books/the-bible, wthere 'the-bible' in an Object ID */}
          {/* <Route exact path="/table/:id" component={Child}/> */}
        </Switch>
      </Router>
    </ProvideAuth>
  );
}
