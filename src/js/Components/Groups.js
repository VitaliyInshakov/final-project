import React, { Component } from 'react';
import Modal from 'react-modal';
import GroupList from './GroupList';
import FormInput from './FormInput';


export default class Groups extends Component {
  constructor(props){
    super(props);
    this.state = {
      direction: true,
      data: this.props.data,
      modalShow: false,
      modalInputValue: '',
      dialog: null,
      disableBtn: true
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({data: newProps.data});
  }

  handleClickShowGroups(){
    this.setState({direction: !this.state.direction});
  }

  openModal() {
    this.setState({
      modalInputValue: '',
      modalShow: true
    });
  }

  closeModal() {
    this.setState({ modalShow: false });
  }

  handleClickAction(id, action){
    this.setState(
      { dialog: {type: action, index: id}},
      ()=>this.changeGroup()
    );
  }

  addNewGroup(e){
    e.preventDefault();
    let data = this.state.data;
    let inputValue = this.refs.group.value;
    if (!this.state.dialog){
      let group = {'id': this.state.data.groups.length+1, 'name': inputValue, 'contacts': []};
      data.groups.push(group);
      this.setState({data: data});
      this.props.onAction(data, 'groups', 'post', group);
    } else {
      data.groups[this.state.dialog.index].name = inputValue;
      this.setState({
        data: data,
        dialog: null
      });
      this.props.onAction(data, 'groups', 'put', data.groups[this.state.dialog.index]);
    }
    this.closeModal();
  }
  
  changeGroup(){
    let data = this.state.data;

    if(this.state.dialog.type === 'delete'){
      let group = data.groups[this.state.dialog.index];
      data.groups.splice(this.state.dialog.index,1);
      this.setState({
        data: data,
        dialog: null
      });
      this.props.onAction(data, 'groups', 'delete', group);
    } else if(this.state.dialog.type === 'change') {
      this.setState({
        modalShow: true,
        modalInputValue: data.groups[this.state.dialog.index].name
      });
    }
  }

  render() {
    return (
      <div className='groups'>
          <div className='groups__title' onClick={this.handleClickShowGroups.bind(this)}>
            <i className={`fa fa-angle-${this.state.direction ? 'up' : 'down'} title__icon`}></i>
            <span>Группы</span>
          </div>
          <div className={!this.state.direction ? 'groups__main': ''}>
            <GroupList data={this.state.data} onAction={this.handleClickAction.bind(this)}/>
            <div className='groups__add' onClick={this.openModal.bind(this)}>
              <i className='add__icon'>+</i>
              <span>Создайте группу</span>
              {this.state.modalShow
              ? <Modal
                  isOpen={true}
                  onRequestClose={this.closeModal.bind(this)}
                  className={{base: 'modalContentClass'}}
                  overlayClassName={{base: 'modalOverlayClass'}}
                  contentLabel='Modal Window'>
                  <div className='my-modal__header my-modal__header--group'>{!this.state.modalInputValue ? 'Создайте группу' : 'Переименовать группу'}</div>
                  <div className='my-modal__main my-modal__main--group'>
                    <input
                      className='form-control input__field input__field--group'
                      type='text'
                      ref='group'
                      defaultValue={this.state.modalInputValue}
                      onChange={(e)=>this.setState({disableBtn: !e.target.value})}/>
                  </div>
                  <div className='my-modal__footer'>
                    <button className='btn btn-default' onClick={this.closeModal.bind(this)}>Отмена</button>
                    <button className='btn btn-default'
                      disabled={this.state.disableBtn}
                      onClick={this.addNewGroup.bind(this)}>Ок</button>
                  </div>
                </Modal>
              : null}
            </div>
          </div>
        </div>
    );
  }
}