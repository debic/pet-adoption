import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import Logo from '../../Style/IMG/logo.svg'
import './MainNavigation.css'
import MainHeader from './MainHeader'
import NavLinks from './NavLinks'
import Sidemenu from './SideMenu'


export default function MainNavigation(props) {

    const [sideMenuOpen, setSideMenuOpen] = useState(false)

    const openSideMenu = () =>{
        if(sideMenuOpen === false){
            setSideMenuOpen(true)
        }else{
            setSideMenuOpen(false)
        }
    }
    
  return (
  <>
    {sideMenuOpen && (
        <Sidemenu>
            <nav className="main-navigation__side-menu" onClick={openSideMenu}>
            <NavLinks />
            </nav>
        </Sidemenu>
    )}
    
    <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openSideMenu}>
            <span />
            <span className='middle-span'/>
            <span />
        </button>
       
        <Link to="/" ><img className='logo' src={Logo} alt='logo'></img></Link>
      
        <nav className='main-navigation__header-nav'>
        <NavLinks/>
        </nav>
  </MainHeader>
  </>
  )
}
