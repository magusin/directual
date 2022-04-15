import React, { useState } from 'react'
import { LogInLogOutButton } from '../loginLogout/loginLogoutButton'
import { useAuth } from '../../auth'
import {
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from 'reactstrap'
import './menu.css'

export function MainMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen((prevState) => !prevState)
  const authContext = useAuth()
  return (
    // <ul className="main-menu">
    //   <li>
    //     <NavLink exact to="/">Home</NavLink>
    //   </li>

    //   {/* JSX visible for authorised users only */}
    //   {authContext.isAutorised() && <li>
    //     <NavLink exact to="/private">Private Page</NavLink>
    //   </li>}

    //   {/* JSX visible for users, who have role == 'admin'. You can apply any other value here */}
    //   {authContext.hasRole('admin') && <li>
    //     <NavLink exact to="/admin">Admin Page</NavLink>
    //   </li>}
    //   <li className="rihgt-top">
    //     <LogInLogOutButton />
    //   </li>
    // </ul>
    <Nav pills className="position-relative">
      <NavItem>
        <NavLink href="/">Home</NavLink>
      </NavItem>
      <NavItem>
        {authContext.hasRole('admin') && (
          <NavLink exact href="/admin">
            Admin Page
          </NavLink>
        )}
      </NavItem>
      {authContext.isAutorised() && <Dropdown nav isOpen={dropdownOpen} toggle={toggle} className='rihgt-top'>
        <DropdownToggle caret nav>
          Profil
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <NavLink href="/profil">Mes informations</NavLink>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <NavLink href="/private">Mes logiciels</NavLink>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>}
      <NavItem className='position-absolute top-0 end-0'>
        <LogInLogOutButton />
      </NavItem>
    </Nav>
  )
}
