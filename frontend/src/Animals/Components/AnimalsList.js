import React from 'react'

import AnimalItem from './AnimalItem'
import './../Animals.css'

export default function AnimalsList(props) {

    if(props.items.length === 0){
        return (
            <div className='animal-list center'>
                <h2>No animals found</h2>
            </div>)
    }else{
        return(
            <ul className='animal-list'>
                {props.items.map(animal => <AnimalItem key={animal._id} id={animal._id} image={animal.imageURL} name={animal.name} creatorId={animal.creator} info={animal.info} type={animal.type} gender={animal.gender} weight={animal.weight} age={animal.age} onDelete={props.onDeleteAnimal} />)}
            </ul>
        )
    }
  
}
