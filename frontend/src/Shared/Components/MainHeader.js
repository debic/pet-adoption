import React from 'react'

import '../Shared.css'

export default function MainHeader(props) {
  return (
    <header className='main-header'>
        {props.children}
    </header>
  )
}
