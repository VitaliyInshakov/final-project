import React, { Component } from 'react';
import SearchBar from './SearchBar';

export default class Header extends Component {
  constructor(props){
    super(props);
    this.preSearchData = null;
    this.state={
      searchCLass: {focus: false, move: false}
    }
  }
  dataSearch(e){
    const val = e.target.value.toLowerCase();
    if(!val){
      this.props.onDataChange(this.preSearchData);
      return;
    }
    const fields = this.props.schema.map(item => item.id);
    const filter = this.preSearchData.contacts.filter(row => {
      for(let i = 0; i < fields.length; i++){
        if(row[fields[i]].toString().toLowerCase().indexOf(val) > -1){return true;}
      }
      return false;
    });
    
    this.props.onDataChange({contacts: filter, groups: this.props.initialData.groups});
  }
  startSearch(){
    let searchCLass = this.state.searchCLass;
    searchCLass.focus = true;
    this.setState({searchCLass: searchCLass});
    this.preSearchData = this.props.initialData;
  }
  doneSearch(){
    let searchCLass = this.state.searchCLass;
    searchCLass.focus = false;
    searchCLass.move = false;
    this.setState({searchCLass: searchCLass});
    this.props.onDataChange(this.preSearchData);
  }
  clickSearch(){
    let searchCLass = this.state.searchCLass;
    searchCLass.focus = true;
    searchCLass.move = !searchCLass.move;
    this.setState({searchCLass: searchCLass});
  }
  render() {
    return (
      <header className='header'>
        <div className='header__title'>
          <i className='fa fa-bars header__bar' onClick={this.props.onAction.bind(this)}></i>
          <span className='header__span'>Westeros Контакты</span>
        </div>
        <div className='header__search-bar'>
          <SearchBar 
            onChange={this.dataSearch.bind(this)}
            onFocus={this.startSearch.bind(this)}
            onBlur={this.doneSearch.bind(this)}
            handleClickSearch={this.clickSearch.bind(this)}
            class={this.state.searchCLass}
            />
        </div>
      </header>
    );
  }
}