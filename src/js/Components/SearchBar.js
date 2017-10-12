import React from 'react';

export default function SearchBar(props) {

  return (
    <div className={`search${props.class.focus ? ' search--focus' : ''}${props.class.move ? ' search--move' : ''}`}>
      <span className='search__span' onClick={props.handleClickSearch.bind(this)}>
        <i className='fa fa-search search__icon'></i>
      </span>
      <input
        ref={input => input && (props.class.move ? input.focus() : '')}
        type='text'
        className='search__input'
        placeholder='Поиск'
        onChange={props.onChange.bind(this)}
        onFocus={props.onFocus.bind(this)}
        onBlur={props.onBlur.bind(this)}/>
  </div>
  )
}