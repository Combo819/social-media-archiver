import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

/**
 *
 * @param props
 * @returns
 */

export function Crawler(props: { server: string }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    console.log('submitting');
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const url = values.url;
      console.log(url, 'url');
      await axios({
        url: props.server + '/api/post',
        data: { postIdUrl: url },
        method: 'post',
      });

      message.success(`post ${url} backup is processing`);
    } catch (error) {
      message.error('Failed to backup');
      alert(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form form={form} onFinish={onSubmit}>
      <Form.Item label="post url" name="url">
        <Input placeholder="input the post url"></Input>
      </Form.Item>
      <Form.Item>
        <Button loading={loading} htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
