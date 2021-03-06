import React from 'react';
import { Link } from 'react-router-dom';

export default function(props) {
  if (!props.data) { return <ul></ul> }
  const groups = props.data.groups.map(function(group, index){
    return (
      <li key={`group-${index}`} className='group-list__item'>
        <i className='fa fa-users item__icon'></i>
        <Link to={`/groups/${group.id}`}><span className='item__title'>{group.name}</span></Link>
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