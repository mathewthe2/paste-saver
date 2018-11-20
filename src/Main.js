import React, { Component, Fragment } from 'react';
const electron = window.require('electron');
const {clipboard, ipcRenderer} = electron;
// const { globalShortcut } =  electron.remote;

const TOKEN = 'ubHN4Isc1lLohRnBmunkIKpYj97YaG5FRzPncrG2B';

const postText =  async (body) => fetch('https://api.paste.ee/v1/pastes', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'X-Auth-Token': TOKEN,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

class Main extends Component {
  state = {text: '', list: []}

  componentDidMount() {
    ipcRenderer.on('save', ()=> {
      const t = clipboard.readText('selection');
      if (t !== this.state.text && t.length) {
        console.log(t);
        this.setState({text: t});
        postText({description:'unnamed',
        sections:[{
          name:'Section1',
          syntax:'autodetect',
          contents:t}
        ]}).then(res=>{res.json().then(tObj=>{
          tObj.content = t;
          this.setState({list: [...this.state.list, tObj]});
        })
      })
      }
  });
  }
  render() {

    return (
     this.state.list.map(text=>
      <li key={text.id}>
      <a href={text.link} target="_blank">
        {text.content.substring(0,20)}
        {text.content.length > 20 && '...'}
      </a>
     </li>
    )
    )
  }
}

export default Main;
