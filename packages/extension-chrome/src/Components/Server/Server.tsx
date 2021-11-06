import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';

export function Server(props: {
  server: string;
  setServer: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { setServer } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['server'], function (result) {
      setServer(result['server']);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = async () => {
    console.log('submitting');
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const url = new URL(values.server);
      const serverUrl = url.protocol + '//' + url.host;
      await fetch(serverUrl);
      props.setServer(serverUrl);
      chrome.storage.local.set({ server: serverUrl }, function () {});
      message.success('new server set');
    } catch (error) {
      message.error('invalid url or server has no response');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      Current Server Url:{' '}
      {<a href={props.server}>{props.server}</a> || 'Not Set'}
      <Form form={form} onFinish={onSubmit}>
        <Form.Item label="Server" name="server">
          <Input placeholder="input the post crawler backend url"></Input>
        </Form.Item>
        <Form.Item>
          <Button loading={loading} htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
