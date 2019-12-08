import React from 'react';
import { observer } from 'mobx-react';
import Editor from 'react-ace';
import 'ace-builds/src-noconflict/mode-space';
import 'ace-builds/src-noconflict/theme-tomorrow';
import store from './store';
import { http } from "libs";
import { Button, message } from "antd";

@observer
class TextView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      readOnly: true,
      body: ''
    }
  }

  componentDidMount() {
    this.updateValue()
  }

  updateValue = () => {
    let body = '';
    for (let item of store.records) {
      body += `${item.key} = ${item.value}\n`
    }
    this.setState({readOnly: true, body})
  };

  handleSubmit = () => {
    this.setState({loading: true});
    const formData = {type: store.type, o_id: store.id, env_id: store.env.id, data: this.state.body};
    http.post('/api/config/parse/text/', formData)
      .then(res => {
        message.success('保存成功');
        this.updateValue()
      })
      .finally(() => this.setState({loading: false}))
  };

  render() {
    const {body, loading, readOnly} = this.state;
    return (
      <div style={{position: 'relative'}}>
        <Editor
          mode="space"
          width="100%"
          height="500px"
          theme="tomorrow"
          style={{fontSize: 14}}
          value={body}
          readOnly={readOnly}
          onChange={v => this.setState({body: v})}/>
        {readOnly && <Button
          icon="edit"
          type="link"
          size="large"
          style={{position: 'absolute', top: 0, right: 0}}
          onClick={() => this.setState({readOnly: false})}>编辑</Button>}
        {readOnly || <Button
          icon="save"
          type="link"
          size="large"
          loading={loading}
          style={{position: 'absolute', top: 0, right: 0}}
          onClick={this.handleSubmit}>保存</Button>}
      </div>
    )
  }
}

export default TextView