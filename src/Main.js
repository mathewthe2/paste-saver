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
  state = {text: '', selectedText: {content: ''}, list: [], selected :0, copyConfirmation: false};

  runSample() {
    this.setState({list:[
      {id: 1, link: '/2e2/ds', content: 'abcddasfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfef'},
      {id: 2, link: '/2e2/ds', content: '22d'},
      {id: 3, link: '/2e2/ds', content: 'abcdfddef'},
      {id: 4, link: '/2e2/ds', content: 'abc222def'},
    ]})
  }

  selectText = (text) =>this.setState({selectedText:text, copyConfirmation: false});
  copyToClipBoard = (text) => {
    clipboard.writeText(text);
    this.setState({text, copyConfirmation: true});
  }

  componentDidMount() {
    ipcRenderer.on('save', ()=> {
      // this.runSample();
      // return;
      const t = clipboard.readText('selection');
      const selectedTextInApp = window.getSelection() && t === window.getSelection().toString();
      if (selectedTextInApp) {
        this.setState({text: window.getSelection().toString()});
      } else if (t !== this.state.text && t.length) {
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
    
    var disabledShowText = !this.state.selectedText.content;

    return (
      <div style={{padding: 16}}>
        <div style={{  cursor: 'pointer', position: 'absolute', height: 400, overflow: 'auto'}} >
      {this.state.list.map((text, index)=>
        <div style={{background: index % 2 === 0 ? 'rgba(243,243,243,1)' : '#FFFF'}}
        key={text.id} onClick={()=>this.selectText(text)}>
          {text.content.substring(0,20)}
          {text.content.length > 20 && '...'}
      </div>
    )}
    </div>
      <div style={{position: 'absoolute', marginLeft: 200}}>
      <div>
        <button disabled={disabledShowText} onClick={()=>this.copyToClipBoard(this.state.selectedText.content)}>Copy</button>
       {this.state.copyConfirmation && <text style={{marginLeft: 4}}>Copied!</text>}
        </div> 
        <textarea disabled={disabledShowText}style={{marginTop: 8, minHeight:300, minWidth: 300}}
          value={this.state.selectedText.content} />
          <div>
            <a href={this.state.selectedText.link} target='_blank'>View Online</a>
        </div>
      </div>
     </div>
    )
  }
}

export default Main;
