import React, { Component } from 'react';
import Groups from './Groups';
import { Link } from 'react-router-dom';

export default class ToolBar extends Component {
  constructor(props){
    super(props);
    this.state = { countUsers: 0 }
  }
  componentWillReceiveProps(newProps){
    this.setState({countUsers: newProps.data.contacts.length});
  }
  callDataChangeParentComp(data, path, method, group){
    this.props.onDataChange(data, path, method, group);
  }
  render() {
    return (
      <aside className='toolbar'>
        <div className='toolbar__title'>
          <Link to='/'>
            <i className='fa fa-address-book toolbar__icon'></i>
            <span className='toolbar__span'>Контакты </span>
            <span className='toolbar__count'>{`(${this.state.countUsers})`}</span>
          </Link>
        </div>
        <hr/>
        <Groups data={this.props.data} onAction={this.callDataChangeParentComp.bind(this)}/>
        <hr/>
      </aside>
    );
  }
}