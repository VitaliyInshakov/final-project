import React, { Component } from 'react';
import FormInput from './FormInput';

export default class Form extends Component{
  constructor (props) {
    super(props);
    this.state = {
      fieldValid: ''
    }
  }
  getData(){
    let data = {};
    this.props.fields.forEach((field)=> {
      if(field.id == 'id'){
        data[field.id] =  this.props.id;
      } else {
        data[field.id] = this.refs[field.id].getValue()
      }
    });
    return data;
  }
  validateField(id){
    let dataValid = this.state.fieldValid;
    let fieldValue = this.refs[id].getValue();
    switch(id) {
      case 'firstName':
      case 'secondName':
        dataValid = !fieldValue.search(/^([A-zА-я])+([A-zА-я0-9]+)?$/i) ? '' : id;
        break;
      case 'phone':
        dataValid = !fieldValue.search(/^(\+380)?\d{9}$/g) ? '' : id;
        break;
      default:
        break;
    }
    
    this.setState({fieldValid: dataValid});
    if(!!this.props.onDisabled){
      let valid = true;
      this.props.fields.map((field)=>{
        if(field.id !== 'id' && !!this.refs[field.id].getValue()){return valid = false;}
      })
      this.props.onDisabled(valid);
    }
  }

  render(){
    return(
      <form className='my-modal__form'>
        {this.props.fields.map((field, index)=>{
          if(field.id !== 'id'){
            const prefilled = this.props.initialData && this.props.initialData[field.id];
            if(!this.props.readonly){
              return (
                <div 
                  className={`input__row${this.state.fieldValid !== field.id ? '' : ' tooltip-error has-error'}`}
                  key={field.id}
                  data-tooltip='Введены некорректные данные'>
                    <span className='input__row__addon'><i className={`fa fa-${field.icon}`}></i></span>
                    <FormInput {...field} ref={field.id} defaultValue={prefilled} onChange={this.validateField.bind(this)}/>
                </div>
              );
            }
            if (!prefilled){return null;}
            return(
              <div key={field.id} className='form__item'>
                <span className='item__icon item__cell'><i className={`fa fa-${field.icon}`}></i></span>
                {(()=>{
                  switch(field.id) {
                    case 'phone':
                      return <a className='item__content item__cell' href={`tel:${prefilled}`}>{prefilled}</a>;
                    case 'email':
                      return <a className='item__content item__cell' href={`mailto:${prefilled}`}>{prefilled}</a>
                      case 'website':
                      return <a className='item__content item__cell' href={prefilled} target='_blank'>{prefilled}</a>
                    default:
                      return <span className='item__content item__cell'>{prefilled}</span>
                  }
                })()}
              </div>
            );
          }
        }, this)}
      </form>
    );
  }
}