import React from 'react'
import ReactDOM from 'react-dom'

export default function SideMenu(props) {
    const content = <aside className='side-menu'>{props.children}</aside>

  return (
    ReactDOM.createPortal(content, document.getElementById('side-menu-hook'))
  )
}
