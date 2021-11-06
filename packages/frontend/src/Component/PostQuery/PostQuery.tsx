import React, { useEffect } from 'react';
import { Button, Form, Input, Select, Typography } from 'antd';
import { getUsersByNameApi } from '../../Api';
import { DebounceSelect } from '../DebounceSelect/DebounceSelect';
import styles from './PostQuery.module.scss';
import { IUser } from '../../types';
import { DatePicker } from '../DatePicker/DatePicker';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { convertToUnix } from '../../Utility/timeFormat';
import { generateQueryString } from '../../Utility/route/generateQueryString';
import dayjs from 'dayjs';

const { Title } = Typography;

const { RangePicker } = DatePicker;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 22 },
    sm: { span: 22 },
  },
};

const getUsersByNameFormatted = (username: string) => {
  return getUsersByNameApi(username).then((res) => {
    const users: IUser[] = res.data.users;
    return users.map((user) => ({ label: user.username, value: user.id }));
  });
};

const parseQuery = (query: string) => {
  const searchParams = new URLSearchParams(query);
  const output: any = {};
  searchParams.forEach((value: any, key) => {
    if (!value) return;
    value = decodeURIComponent(value);
    try {
      value = JSON.parse(value);
    } catch (error) {
    } finally {
      if (_.isArray(value)) {
        value = value.map((item) => {
          if (_.isNumber(item)) {
            return dayjs(item);
          } else {
            return item;
          }
        });
      }
      output[key] = value;
    }
  });


  return output;
};

function PostQuery() {
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const restoredQuery = parseQuery(history.location.search);
    form.setFieldsValue(restoredQuery);
  }, []);
  const submitQuery = () => {
    const rawValues = form.getFieldsValue();

    const values = convertToUnix(rawValues);

    const params = generateQueryString(values);
    let path: string = '';
    if (params.length > 0) {
      path = `?${params}`;
    }
    history.push(path);
  };

  const onClear = () => {
    form.resetFields();
    history.push('');
  };

  return (
    <Form
      labelCol={formItemLayout.labelCol}
      /*   wrapperCol={formItemLayout.wrapperCol} */
      form={form}
      className={styles['form']}
      onFinish={submitQuery}
    >
      <Title level={4}>Search and Sort</Title>
      <Form.Item name="createdAt" label="Create Time">
        <RangePicker dropdownClassName={styles['date-picker-dropdown']} />
      </Form.Item>
      <Form.Item name="saveTime" label="Save Time">
        <RangePicker dropdownClassName={styles['date-picker-dropdown']} />
      </Form.Item>
      <Form.Item
        tooltip="Partial search is not supported. Please input the full username"
        name="users"
        label="User"
      >
        <DebounceSelect fetchApi={getUsersByNameFormatted} />
      </Form.Item>
      <Form.Item name="text" label="Post Content">
        <Input.TextArea></Input.TextArea>
      </Form.Item>
      <Form.Item name="orderBy" label="Sort By">
        <Select>
          <Option value="createdAt">Create Time</Option>
          <Option value="saveTime">Save Time</Option>
        </Select>
      </Form.Item>
      <Form.Item name="orderType" label="Sort Type">
        <Select>
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          onClick={onClear}
          type="default"
          className={styles['search-button']}
        >
          Clear
        </Button>
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          className={styles['search-button']}
        >
          Search
        </Button>
      </Form.Item>
    </Form>
  );
}

export { PostQuery };
