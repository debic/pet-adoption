import React, { useReducer, useEffect } from 'react';
import { validate } from '../validators';
import './Input.css'

//El reducer ayeda a manejar states que sean mas complicados, es como un UseState
const inputReducer = (state, action) => {
  switch (action.type) {
    //'case' es el identificador
    case 'CHANGE':
      return {
        // El ... es copia del ahora "old state"
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      }
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    //If a value is provides it will come by props, and if not it will be an empty string
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const {id, onInput} = props
  const {value, isValid} = inputState

  useEffect(() =>{
   onInput(id, value, isValid)
  }, [id, value, isValid, onInput])

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  //Decide si e sun textarea o un input
  const element =
  props.type === 'radio-group' ? (
    <div className="radio-group">
      {props.options.map(option => (
        <label key={option.value} className="radio-option">
          <input
            type="radio"
            name={props.id}
            value={option.value}
            checked={inputState.value === option.value}
            onChange={changeHandler}
            onBlur={touchHandler}
          />
          {option.label}
        </label>
      ))}
    </div>
  ) : props.type === 'select' ? (
    <select
      id={props.id}
      name={props.id}
      value={inputState.value}
      onChange={changeHandler}
      onBlur={touchHandler}
    >
      <option value="">Type of animal</option>
      {props.options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ) : props.element === 'input' ? (
    <input
      id={props.id}
      type={props.type}
      placeholder={props.placeholder}
      onChange={changeHandler}
      onBlur={touchHandler}
      value={inputState.value}
    />
  ) : (
    <textarea
      id={props.id}
      rows={props.rows || 3}
      onChange={changeHandler}
      onBlur={touchHandler}
      value={inputState.value}
    />
  );

  return (
    <div
      className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}
    >
      <label htmlFor={props.id} className={props.labelColor}>{props.label} </label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p className='error-text'>{props.errorText}</p>}
    </div>
  );
};

export default Input;