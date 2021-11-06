import React, { useState } from 'react';
import { Modal, Form, Input, message, Tooltip } from 'antd';
import { savePostApi } from '../../Api';
import { QuestionCircleOutlined } from '@ant-design/icons';
interface SavePostModalProps {
  visible: boolean;
  closeModal: () => void;
}

export default function SavePostModal(props: SavePostModalProps) {
  const { visible, closeModal } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      title="Save A Post"
      confirmLoading={loading}
      onCancel={() => {
        closeModal();
        form.resetFields();
      }}
      onOk={async () => {
        setLoading(true);
        try {
          const value = await form.validateFields();
          const response = await savePostApi(value.postIdUrl);
          setLoading(false);
          closeModal();
          form.resetFields();
          if (response?.data?.status === 'error') {
            message.error(
              response?.data?.message ||
                `post "${value.postIdUrl}" doesn't exist or the token has expired`,
            );
          } else {
            message.success(`Post ${value.postIdUrl} backup processing`);
          }
        } catch (err) {
          message.error('Error Network: Failed to save the post');
          setLoading(false);
        }
      }}
      visible={visible}
    >
      <Form form={form}>
        <Form.Item
          name="postIdUrl"
          label="post Id/Url"
          rules={[
            { required: true, message: 'please input the post url or id' },
          ]}
        >
          <Input placeholder="Paste the post url or Id here"></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
}
