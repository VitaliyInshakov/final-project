import React from 'react';

export default function(props) {
  if (!props.data) { return <ul></ul> }
  const groups = props.data.groups.map(function(group, index){
    return (
      <li key={`group-${index}`} className='group-list__item'>
        <i className='fa fa-users item__icon'></i>
        <span className='item__title'>{group.name}</span>
        <div className='item__action'>
          <i className='fa fa-pencil action__icon' onClick={props.onAction.bind(null, index, 'change')}></i>
          <i className='fa fa-trash action__icon' onClick={props.onAction.bind(null, index, 'delete')}></i>
        </div>
      </li>
    );
  });
  return(
    <ul className='group-list'>
      {groups}
    </ul>
  );
}