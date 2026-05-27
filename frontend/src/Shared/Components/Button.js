import React from 'react'
import {Link} from 'react-router-dom'
import './Button.css'

export default function Button(props) {
    if(props.href){
        return (
          <a className={`button ${props.basic && 'button-brown'} ${props.inverse && 'button-inverse'} ${props.delete && 'button-delete'} ${props.link && 'button-link'} ${props.form && 'button-form'}`} href={props.href}>
            {props.children}  
          </a>
          )
    }
    if(props.to){
        return (
            <Link
            to={props.to}
            exact={props.exact}
            className={`button ${props.basic && 'button-brown'} ${props.inverse && 'button-inverse'} ${props.delete && 'button-delete'} ${props.form && 'button-form'}`}
            >
            {props.children}
            </Link>
          )
    }
    return (
        <button
        className={`button ${props.basic && 'button-brown'} ${props.inverse && 'button-inverse'} ${props.delete && 'button-delete'} ${props.link && 'button-link'} ${props.form && 'button-form'}`}
        type={props.type}
        onClick={props.onClick}
        disabled={props.disabled}
        >
        {props.children}
        </button>
      )
  
}
