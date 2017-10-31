import React, { Component } from 'react';
import Actions from './Actions';
import ModalWindow from './ModalWindow';
import Modal from 'react-modal';
import Form from './Form';

export default class ContactList extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: this.props.initialData,
      sortBy: null,
      descending: false,
      dialog: null
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({data: newProps.initialData});
  }
  handleClickSort(id){
    let data = this.state.data;
    const descending = this.state.sortBy === id && !this.state.descending;
    data.contacts.sort((a, b) => descending ? (a[id] < b[id] ? 1 : -1) : (a[id] > b[id] ? 1 : -1));
    this.setState({
      data: data,
      sortBy: id,
      descending: descending
    });
    if(this.state.data.groups) {this.callDataChangeParentComp(data);}
  }

  callDataChangeParentComp(data, path, method, user){
    this.props.onDataChange(data, path, method, user);
  }

  handleClickAction(id, action){
    this.setState({ dialog: {type: action, index: id}})
  }

  DeleteUser(){
    const item = this.state.data.contacts[this.state.dialog.index];
    const itemName = `${item[Object.keys(item)[1]]} ${item[Object.keys(item)[2]]}`;
    return (
      <ModalWindow
        isShow={true}
        header= {`Удалить контакт '${itemName}'?`}
        confirmLabel='Удалить'
        onAction={this.handleClickDelete.bind(this)}>
        
      </ModalWindow>
    );
  }

  BelongToGroup(){
    const item = this.state.data.contacts[this.state.dialog.index];
    let data = (!this.state.data.groups) ? this.props.parentData : this.state.data;
    const groups = data.groups.map(function(group, index){
      return (
        <li key={`group-${index}`} className='group-list__item' onClick={this.handleClickAddToGroup.bind(this, 'addToGroup', index)}>
          <i className='fa fa-users item__icon'></i>
          <span className='item__title'>{group.name}</span>
          {(()=>{
            for (var i in group.contacts){
              if(group.contacts[i].id === item.id){
                return (<i className='fa fa-check action__icon'></i>);
              } else {
               return (<i className='fa fa-check action__icon' style={{visibility: 'hidden'}}></i>);;
              }
            }
          })()}
        </li>
      );
    }, this);
    return (
      <Modal
        isOpen={true}
        onRequestClose={this.handleClickAddToGroup.bind(this, 'dismiss')}
        className={{base: 'modalContentClass'}}
        overlayClassName={{base: 'modalOverlayClass'}}
        contentLabel='Modal Window'>
        <div className='my-modal__header my-modal__header--group'>Изменить группу</div>
        <div className='my-modal__main my-modal__main--group'>
        <ul className='group-list group-list--add'>
          {groups}
        </ul>
        </div>
      </Modal>
    );
  }

  ShowModal(readonly){
    const item = this.state.data.contacts[this.state.dialog.index];
    const itemName = `${item[Object.keys(item)[1]]} ${item[Object.keys(item)[2]]}`;
    return (
      <ModalWindow
        isShow={true}
        header={!readonly ? 'Изменить контакт' : itemName}
        confirmLabel='Сохранить'
        hasCancel={readonly}
        onAction={this.handleClickSaveChanges.bind(this)}>
        
        <Form
          ref='form'
          fields={this.props.schema}
          initialData={this.state.data.contacts[this.state.dialog.index]}
          id={this.state.data.contacts[this.state.dialog.index].id}
          readonly={readonly}/>
      </ModalWindow>
    );
  }
  handleClickAddToGroup(action, index){
    if (action === 'dismiss'){
      this.closeModalWindow();
      return;
    }
    
    let data = (!this.state.data.groups) ? this.props.parentData : this.state.data;
    let user = (!this.state.data.groups) ? this.state.data.contacts[this.state.dialog.index] : data.contacts[this.state.dialog.index];

    if (!data.groups[index].contacts.length){
      data.groups[index].contacts.push(user);
    } else {
      for (var i in data.groups[index].contacts){
        (data.groups[index].contacts[i].id === user.id)
        ? data.groups[index].contacts.splice(i,1)
        : data.groups[index].contacts.push(user)
      }
    }
    if (this.state.data.groups) {
      this.setState({ data: data });
    } else if (!this.state.data.groups && !this.state.data.contacts.length){
      this.setState({ dialog: null });
    }
    this.callDataChangeParentComp(data, 'groups', 'put', data.groups[index]);
  }
  handleClickDelete(action){
    if (action === 'dismiss'){
      this.closeModalWindow();
      return;
    }
    let data = (!this.state.data.groups) ? this.props.parentData : this.state.data;
    let user = (this.state.data.groups) ? data.contacts[this.state.dialog.index] : this.state.data.contacts[this.state.dialog.index];
    for(var i in data.groups){
      for (var j in data.groups[i].contacts){
        if(data.groups[i].contacts[j].id === user.id){
          data.groups[i].contacts.splice(j, 1);
          this.callDataChangeParentComp(data, 'groups', 'put', data.groups[i]);
        }
      }
    }
    if (this.state.data.groups) {
      data.contacts.splice(this.state.dialog.index, 1);
      this.setState({ data: data });
    } else {
      for (var i in data.contacts){
        if(data.contacts[i].id === user.id){
          data.contacts.splice(i, 1);
        }
      }
    }
    this.setState({ dialog: null });
    this.callDataChangeParentComp(data, 'contacts', 'delete', user);
  }

  closeModalWindow(){
    this.setState({dialog: null});
  }

  handleClickSaveChanges(action){
    if(action === 'dismiss'){
      this.closeModalWindow();
      return;
    }

    let data = (!this.state.data.groups) ? this.props.parentData : this.state.data;
    let user = (this.state.data.groups) ? data.contacts[this.state.dialog.index] : this.state.data.contacts[this.state.dialog.index];
    user = this.refs.form.getData();
    for(var i in data.groups){
      for (var j in data.groups[i].contacts){
        if(data.groups[i].contacts[j].id === user.id){
          data.groups[i].contacts[j] = user;
          this.callDataChangeParentComp(data, 'groups', 'put', data.groups[i]);
        }
      }
    }
    if (this.state.data.groups) {
      data.contacts[this.state.dialog.index] = user;
      this.setState({ data: data });
    } else {
      for (var i in data.contacts){
        if(data.contacts[i].id === user.id){
          data.contacts[i] = user;
        }
      }
    }
    this.setState({ dialog: null });
    this.callDataChangeParentComp(data, 'contacts', 'put', user);
  }

  renderTable(){
    return (
      <table className='contact-list__table'>
        <thead className='table__header'>
          <tr className='table__row'>
            <th className='table__cell table__cell--image'></th>
            {this.props.schema.map(item => {
              if(!item.show) { return null; }
              let title = item.label;
              if(this.state.sortBy === item.id) {
                title += this.state.descending ? ' \u2191' : ' \u2193';
              }
              return (
                <th
                  className={`table__cell table__cell--${item.id}`}
                  key={item.id}
                  onClick={this.handleClickSort.bind(this, item.id)}>
                  {title}
                </th>
              );
              }, this)
            }
            <th className='table__cell table__cell--actions'></th>
          </tr>
        </thead>
        <tbody className='table__main'>
          {this.state.data.contacts.map((user, index)=>{
            return (
              <tr 
                className='table__row'
                key={index}>
                <td className='table__cell table__cell--image'><span className='cell__image'>{user.firstName.charAt(0)}</span></td>
                {Object.keys(user).map((prop, ind)=>{
                  const schema = this.props.schema[ind];
                  if(!schema || !schema.show) { return null };
                  let content = user[prop];
                  return( <td className={`table__cell table__cell--${prop}`} key={ind} onClick={this.handleClickAction.bind(this, index, 'info')}>{content}</td> );
                }, this)}
                <td className='table__cell table__cell--actions'>
                  <Actions onAction={this.handleClickAction.bind(this, index)}/>
                </td>
              </tr>
            );
          }, this)}
        </tbody>
      </table>
    );
  }

  renderDialog(){
    if (!this.state.dialog) {return null;}
    switch(this.state.dialog.type){
      case 'delete':
        return this.DeleteUser();
      case 'info':
        return this.ShowModal(true);
      case 'edit':
        return this.ShowModal();
      case 'addToGroup':
        return this.BelongToGroup();
      default:
        throw Error (`Unexpected dialog type ${this.state.dialog.type}`);
    }
  }

  render() {
    return (
      <div className='contact-list'>
        {this.renderTable()}
        {this.renderDialog()}
      </div>
    );
  }
}