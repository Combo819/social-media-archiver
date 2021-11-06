import React from 'react';
import { Button, Form, Input, Modal, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { importData } from '../../Api';
const { Option } = Select;
type Props = { setImportModalVisible: Function; importModalVisible: boolean };
export function ImportModal({
  setImportModalVisible,
  importModalVisible,
}: Props) {
  const [form] = Form.useForm();

  const onCancel = () => {
    setImportModalVisible(false);
    form.resetFields();
  };
  const onSubmit = () => {
    form.validateFields().then((values) => {
      const bodyFormData = new FormData();
      bodyFormData.append('file', values.file.file);
      bodyFormData.append('version', values.version);

      const type:
        | 'post'
        | 'user'
        | 'comment'
        | 'subComment'
        | 'repostComment' = values.type;

      importData(bodyFormData, type).then(() => {
        setImportModalVisible(false);
      });
    });
  };
  return (
    <Modal
      title="import data"
      onCancel={onCancel}
      footer={[
        <Button onClick={onCancel}>Cancel</Button>,
        <Button type="primary" onClick={onSubmit}>
          {' '}
          Submit
        </Button>,
      ]}
      visible={importModalVisible}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} form={form}>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          required
          label="type"
          name="type"
        >
          <Select style={{ width: 200 }}>
            <Option value="post">post</Option>
            <Option value="comment">comment</Option>
            <Option value="repostComment">repost comment</Option>
            <Option value="subcomment">subcomment</Option>
            <Option value="user">user</Option>
          </Select>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          required
          label="file"
          name="file"
        >
          <Upload accept=".json" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          required
          label="version"
          name="version"
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
