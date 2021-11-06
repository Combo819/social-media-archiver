import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  List,
  message,
  Modal,
  Popover,
  Select,
  Space,
  Tooltip,
} from 'antd';
import { IUser } from '../../types';
import {
  addCollectionApi,
  getCollectionsApi,
  getCollectionTypesApi,
  removeCollectionApi,
  validateCollectionApi,
} from '../../Api';
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';
import styles from './monitorPopover.module.scss';

type MonitorCollection = {
  url: string;
  type: string;
};

const { Option } = Select;

function MonitorPopover(props: any) {
  const [collections, setCollections] = useState<MonitorCollection[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form] = Form.useForm();

  const init = async () => {
    setLoading(true);
    try {
      const collections: MonitorCollection[] = (await getCollectionsApi()).data;
      setCollections(collections);
    } catch (err) {
      message.error('Fail to get collections');
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionTypes = async () => {
    try {
      const collectionTypes: string[] = (await getCollectionTypesApi()).data;
      setCollectionTypes(collectionTypes);
    } catch (err) {
      message.error('Fail to get collection types');
    }
  };

  useEffect(() => {
    init();
    loadCollectionTypes();
  }, []);

  const validate = async (collectionUrl: string, type: string) => {
    try {
      const { data: isValid } = await validateCollectionApi(
        collectionUrl,
        type,
      );
      if (isValid) {
        message.success('Validate success');
      } else {
        message.error(
          `Validation failed. Either the collection url is invalid or the returned data is not transformed into a promise which will be resolved into an array of post id`,
        );
      }
    } catch (err) {
      message.error('Error network: Validation failed');
    }
  };

  const addCollection = async (collectionUrl: string, type: string) => {
    try {
      const isAdded = await addCollectionApi(collectionUrl, type);
      if (isAdded) {
        await init();
        form.resetFields();
      } else {
        message.error('Fail to add collection');
      }
    } catch (error) {
      message.error(error.response?.data || `Failed to add collection`);
    } finally {
      setAdding(false);
    }
  };

  const onFinish = async () => {
    setAdding(true);
    let values: any;
    try {
      values = await form.validateFields();
    } catch (error) {
      setAdding(false);
      return;
    }

    try {
      const { data: isValid } = await validateCollectionApi(
        values.url,
        values.type,
      );
      if (isValid) {
        addCollection(values.url, values.type);
      } else {
        Modal.confirm({
          title: 'Confirm',
          icon: <ExclamationCircleOutlined />,
          content: `The validation failed. Either it's an invalid url, or its didn't return an array of post id`,
          okText: 'Yes',
          cancelText: 'Cancel',
          onOk: () => {
            addCollection(values.url, values.type);
          },
          onCancel: () => {
            setAdding(false);
          },
        });
      }
    } catch (err) {
      message.error('Fail to add collection');
      setAdding(false);
    }
  };

  const onRemove = (collectionUrl: string, type: string) => {
    Modal.confirm({
      title: 'Are you sure to remove the collection?',
      icon: <ExclamationCircleOutlined />,
      content: `Collection url: ${collectionUrl}, type: ${type}`,
      okText: `Delete`,
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const { data: isRemoved } = await removeCollectionApi(collectionUrl);
          if (isRemoved) {
            await init();
          } else {
            message.error('Fail to remove collection');
          }
        } catch (err) {
          message.error(err.response?.data || `Failed to remove collection`);
        }
      },
    });
  };

  return (
    <Card className={styles['card']}>
      <List<MonitorCollection>
        loading={loading}
        dataSource={collections}
        renderItem={(collection) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Space>
                  <span>{collection.type}</span>
                  <Tooltip title="validate">
                    <SecurityScanOutlined
                      onClick={() => validate(collection.url, collection.type)}
                      className={styles['validate-icon']}
                    />
                  </Tooltip>
                  <CloseOutlined
                    onClick={() => {
                      onRemove(collection.url, collection.type);
                    }}
                    className={styles['remove-icon']}
                  />
                </Space>
              }
              description={
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={collection.url}
                >
                  {collection.url}
                </a>
              }
            />
          </List.Item>
        )}
      ></List>
      <hr></hr>
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          required
          rules={[
            {
              validator: (rule, value) => {
                if (!value) {
                  return Promise.reject(`Please input the collection url`);
                }
                return Promise.resolve();
              },
            },
          ]}
          name="url"
          labelCol={{ span: 24 }}
          label="Collection Url"
        >
          <Input placeholder={`Please input the collection url`}></Input>
        </Form.Item>
        <Form.Item
          required
          rules={[
            {
              validator: (rule, value) => {
                if (!value) {
                  return Promise.reject(`Please input collection type`);
                }
                return Promise.resolve();
              },
            },
          ]}
          name="type"
          labelCol={{ span: 24 }}
          label="Collection Type"
        >
          <Select>
            {collectionTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button loading={adding} htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export { MonitorPopover };
