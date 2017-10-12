import React, { Component } from 'react';
import Header from './Components/Header';
import ToolBar from './Components/ToolBar';
import ContactList from './Components/ContactList';
import ModalWindow from './Components/ModalWindow';
import Form from './Components/Form';
import 'whatwg-fetch';
import Promise from 'promise-polyfill'; 

if (!window.Promise) {
  window.Promise = Promise;
}

const infoLabels = [
  {
    id: 'id',
    label: 'ID',
    show: false,
    icon: ''
  },
  {
    id: 'firstName',
    label: 'Имя',
    show: true,
    icon: 'user-circle',
    validation: true,
    placeholder: 'Имя'
  },
  {
    id: 'secondName',
    label: 'Фамилия',
    show: true,
    icon: 'user-circle',
    validation: true,
    placeholder: 'Фамилия'
  },
  {
    id: 'phone',
    label: 'Телефон',
    show: true,
    icon: 'phone',
    validation: true,
    placeholder: '+380ХХХХХХХХХ'
  },
  {
    id: 'birthday',
    label: 'День Рождения',
    show: false,
    icon: 'birthday-cake',
    validation: false,
    placeholder: 'День Рождения'
  },
  {
    id: 'website',
    label: 'Веб-сайт',
    show: false,
    icon: 'link',
    validation: false,
    placeholder: 'Веб-сайт'
  },
  {
    id: 'email',
    label: 'Email',
    show: true,
    icon: 'envelope',
    validation: false,
    placeholder: 'Email'
  },
  {
    id: 'company',
    label: 'Компания',
    show: false,
    icon: 'building',
    validation: false,
    placeholder: 'Компания'
  }
]

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {'contacts': [], 'groups': []},
      term: '',
      addNew: false,
      btnDisabled: true,
      showSideBar: true,
      heightSet: window.innerHeight - 64
    }
  }
  componentDidMount() {
    let contactsReq = fetch(`${this.props.data}contacts`).then((response) => response.json()).catch((error) => alert(error));
    let groupsReq = fetch(`${this.props.data}groups`).then((response) => response.json()).catch((error) => alert(error));
    let combinedData = {};
    Promise.all([contactsReq, groupsReq]).then((values) =>{
      combinedData['contacts'] = values[0];
      combinedData['groups'] = values[1];

      combinedData.contacts = [].slice.call(combinedData.contacts).sort((a, b) => {
        return (a.firstName > b.firstName) ? 1 : ((b.firstName > a.firstName) ? -1 : 0);
      });
      this.setState({data: combinedData});
    });

    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({ heightSet: window.innerHeight - 64 });
  }

  handleDataChange(data, path, method, dataItem){
    if (method === 'post'){
      this.updateDataBase(`${this.props.data}${path}`, method, dataItem);
    } else {
      (typeof method !== 'undefined') && this.updateDataBase(`${this.props.data}${path}/${dataItem.id}`, method, dataItem);
    }
    this.setState({data: data});
  }
  handleClickAddUser(){
    this.setState({ addNew: true });
  }
  addNewUser(action){
    if(action === 'dismiss') {
      this.setState({addNew: false});
      return;
    }
    let data = this.state.data;
    data.contacts.push(this.refs.form.getData());
    data.contacts.sort((a,b)=>{
      return (a.firstName > b.firstName) ? 1 : ((b.firstName > a.firstName) ? -1 : 0);
    });
    this.updateDataBase(`${this.props.data}contacts`, 'post', this.refs.form.getData());
    this.setState({
      addNew: false,
      data: data
    });
  }

  updateDataBase(path, method, data){
    if(method === 'delete'){
      fetch(path, {method: method});
    } else {
      fetch(path, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    }
  }
  
  handleClickHideSidebar(){
    this.setState({showSideBar: !this.state.showSideBar})
  }
  onDisabled(valid){
    this.setState({btnDisabled: valid})
  }
  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <Header 
            initialData={this.state.data}
            schema={infoLabels}
            onDataChange={this.handleDataChange.bind(this)}
            onAction={this.handleClickHideSidebar.bind(this)} />
        </div>
        <div className='row'>
          <main className='main'>
            <div className={`main__sidebar${this.state.showSideBar ? '' : ' main__sidebar--hide'}`}>
              <ToolBar data={this.state.data} hide={this.state.showSideBar} onDataChange={this.handleDataChange.bind(this)} />
            </div>
            <div className={`main__content${this.state.showSideBar ? '' : ' main__content--full'}`} style={{height: this.state.heightSet + 'px'}}>
              <ContactList
                initialData={this.state.data}
                schema={infoLabels}
                onDataChange={this.handleDataChange.bind(this)} />
              <div className='button-add'>
                <button
                  className='btn'
                  onClick={this.handleClickAddUser.bind(this)}><span className="btn__content">&#43;</span></button>
              </div>
            </div>
            {this.state.addNew
              ? <ModalWindow
                  isShow={true}
                  header='Новый контакт'
                  confirmLabel='Сохранить'
                  onAction={this.addNewUser.bind(this)}
                  disabled={this.state.btnDisabled}>
                    <Form
                      ref='form'
                      fields={infoLabels}
                      id={this.state.data.contacts.length+1}
                      onDisabled={this.onDisabled.bind(this)}/>
                </ModalWindow>
              : null}
          </main>
        </div>
      </div>
    );
  }
}