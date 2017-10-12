import React, { Component } from 'react';
import Modal from 'react-modal';

export default class ModalWindow extends Component{
 
  render(){
    return(
      <Modal
      isOpen={this.props.isShow}
      onRequestClose={this.props.onAction.bind(this, 'dismiss')}
      className={{base: `modalContentClass${this.props.children ? ' modalContentClass--resize': ''}`}}
      overlayClassName={{base: 'modalOverlayClass'}}
      contentLabel='Modal Window'>
        <div className={`my-modal${this.props.children ? ' my-modal--fix-width': ''}`}>
          <div className='my-modal__header'>
          <h2 className={`${!this.props.children ? 'header__title--group': ''}`}>{this.props.header}</h2>
          {this.props.hasCancel 
          ? <span onClick={this.props.onAction.bind(this, 'dismiss')}>
              <i className='fa fa-times'></i>
            </span>
          : null}
          </div>
          <div className={`my-modal__main${!this.props.children ? ' my-modal__main--delete': ''}`}>
            {this.props.hasCancel ? <h3>Данные контакта</h3> : null}
            {this.props.children}
          </div>
          {this.props.hasCancel
          ? null
          : <div className='my-modal__footer'>
              <button 
                onClick={this.props.onAction.bind(this, 'dismiss')}
                className='btn btn-default'>Отмена</button>
              <button
                onClick={this.props.onAction.bind(this, 'confirm')}
                className='btn btn-default'
                disabled={this.props.disabled}>{this.props.confirmLabel}</button>
            </div>
          }
        </div>
      </Modal>
    );
  }
}