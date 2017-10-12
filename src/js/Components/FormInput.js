import React, { Component } from 'react';

export default class FormInput extends Component{
  getValue(){
    return 'value' in this.refs.input
    ? this.refs.input.value
    : this.refs.input.getValue();
  }
  render(){
    const common = {
      id: this.props.id,
      ref: 'input',
      defaultValue: this.props.defaultValue,
      placeholder: this.props.placeholder
    }
    return(
      <input
        {...common}
        className='form-control input__field input__row__field'
        onChange={this.props.onChange.bind(this, this.props.id)} />
    );
  }
}