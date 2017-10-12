import React from 'react';

export default function Actions(props){
  return (
    <div className='actions'>
      <i className='fa fa-pencil action__icon' onClick={props.onAction.bind(null, 'edit')}></i>
      <i className='fa fa-trash action__icon' onClick={props.onAction.bind(null, 'delete')}></i>
    </div>
  );
}