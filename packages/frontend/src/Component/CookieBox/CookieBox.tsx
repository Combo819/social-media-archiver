import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Space } from 'antd';
import styles from './CookieBox.module.scss';
import { EditOutlined } from '@ant-design/icons';
import { IUser } from '../../types';
import {
  getCookieApi,
  getAccountProfileApi,
  setCookieApi,
  validateCookieApi,
} from '../../Api';
import { useDispatch } from 'react-redux';
import { accountCreators } from '../../Store';
type CookieBoxProps = {
  account: IUser | null;
};
function CookieBox(props: CookieBoxProps) {
  const { account } = props;

  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [cookie, setCookie] = useState(`Cookie doesn't exist`);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const init = () => {
    getCookieApi()
      .then((res) => {
        const cookie: string = res.data.result;
        setCookie(cookie);
        form.setFieldsValue({ cookie });
      })
      .catch((err) => {
        message.error('Failed to get cookie');
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (account) {
      init();
    } else {
      form.setFieldsValue({ cookie: `Cookie doesn't exist` });
      setCookie(`Cookie doesn't exist`);
    }
  }, [account?.id]);

  const onSaveCookie = async () => {
    setLoading(true);
    const values = form.getFieldsValue();
    let isCookieValid: boolean = false;
    try {
      const res = await validateCookieApi(values['cookie']);
      isCookieValid = res.data.result;
      if (!isCookieValid) {
        message.error('the cookie is invalid');
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      message.error('failed to validate cookie');
      return;
    }

    if (isCookieValid) {
      try {
        await setCookieApi(values['cookie']);
        setIsEdit(false);
        message.success('New Cookie Set');
        const account = await (await getAccountProfileApi()).data.result;
        dispatch(accountCreators.setAccount(account));
      } catch (error) {
        message.error('failed to set cookie');
      } finally {
        setLoading(false);
      }
    }
  };

  const onCancel = () => {
    setIsEdit(false);
    form.setFieldsValue({ cookie });
  };

  return (
    <div className={styles['cookie-box']}>
      <Form form={form}>
        <Form.Item
          name="cookie"
          className={styles['form-item']}
          labelCol={{ span: 24 }}
          label={
            <>
              <a target="_blank" href="#">
                soc.com
              </a>{' '}
              &nbsp;cookie
            </>
          }
        >
          {isEdit ? (
            <Input.TextArea rows={6}></Input.TextArea>
          ) : (
            <p>{cookie}</p>
          )}
        </Form.Item>
        <Form.Item>
          <div className={styles['action-div']}>
            {isEdit ? (
              <Space>
                {' '}
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="primary" loading={loading} onClick={onSaveCookie}>
                  Save
                </Button>
              </Space>
            ) : (
              <EditOutlined
                className={styles['edit-icon']}
                onClick={() => setIsEdit(true)}
              />
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
export { CookieBox };
