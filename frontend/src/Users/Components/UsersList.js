import React from 'react'
import UsersItem from './UsersItem'
import './../Pages/Users.css'


const UsersList = props => {
    if (props.items.length === 0){
        return <div> <h2>No users found</h2></div>
    }

    return(
        <ul className='Userslist'>
            
        {props.items.map(user => (
            <UsersItem 
                key={user.is} 
                id={user.id} 
                image={user.image} 
                name={user.name} 
                animalCount={user.animals.length}
            />
        ))}
        </ul>
    )
}

export default UsersList