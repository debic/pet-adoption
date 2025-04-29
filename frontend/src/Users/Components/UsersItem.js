import React from 'react'
import './../Pages/Users.css'
import {Link} from 'react-router-dom'

export default function UsersItem(props) {
  return (
    <li className='userItem'>
        <div className='userItemContainer'>
            <Link to={`/${props.id}/animals`}>
                <div className='userItemContent'>
                <div className='userItemImage'>
                    <img className='userItemImage' alt='' src={props.image} />
                </div>
                <div className='userIteminfo'>
                    <h2>{props.name}</h2>
                    <h3>{props.animalCount} {props.animals === 1 ? 'Animal' : "Animals"}</h3>
                </div>
                </div>
            </Link>
        </div>
    </li>
  )
}