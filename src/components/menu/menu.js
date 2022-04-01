import React from 'react'
import { NavLink } from 'react-router-dom'
import { LogInLogOutButton } from '../loginLogout/loginLogoutButton'
import { useAuth } from '../../auth'

import './menu.css'


export function MainMenu() {
  const authContext = useAuth();
  return (
    <ul className="main-menu">
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>

      {/* JSX visible for authorised users only */}
      {authContext.isAutorised() && <li>
        <NavLink exact to="/private">Private Page</NavLink>
      </li>}

      {/* JSX visible for users, who have role == 'admin'. You can apply any other value here */}
      {authContext.hasRole('admin') && <li>
        <NavLink exact to="/admin">Admin Page</NavLink>
      </li>}
      <li className="rihgt-top">
        <LogInLogOutButton />
      </li>
    </ul>
  )
}