import React from 'react'
import {Link} from 'react-router-dom'
import './Button.css'

export default function Button(props) {
    if(props.href){
        return (
          <a className={`button ${props.basic && 'button-brown'} ${props.inverse && 'button-inverse'} ${props.danger && 'button-danger'} ${props.link && 'button-link'}`} href={props.href}>
            {props.children}  
          </a>
          )
    }
    if(props.to){
        return (
            <Link
            to={props.to}
            exact={props.exact}
            className={`button ${props.basic && 'button-brown'} ${props.inverse && 'button-inverse'} ${props.danger && 'button-danger'}`}
            >
            {props.children}
            </Link>
          )
    }
    return (
        <button
        className={`button ${props.basic && 'button-brown'} ${props.inverse && 'button-inverse'} ${props.danger && 'button-danger'} ${props.link && 'button-link'}`}
        type={props.type}
        onClick={props.onClick}
        disabled={props.disabled}
        >
        {props.children}
        </button>
      )
  
}
