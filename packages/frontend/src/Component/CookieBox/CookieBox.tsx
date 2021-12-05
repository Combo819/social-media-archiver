import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Space, Modal } from 'antd';
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

const { confirm } = Modal;
function CookieBox(props: CookieBoxProps) {
  const { account } = props;

  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [cookie, setCookie] = useState(``);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const init = () => {
    getCookieApi()
      .then((res) => {
        const cookie: string = res.data.result;
        if (!cookie) {
          setCookie(``);
        } else {
          setCookie(cookie);
        }
      })
      .catch((err) => {
        setCookie(``);
      })
      .finally(() => {
        form.setFieldsValue({ cookie: `` });
      });
  };

  useEffect(() => {
    init();
  }, [account?.id]);

  const onSaveCookie = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const cookie = values['cookie'];
      if (!cookie || cookie === "Cookie doesn't exist") {
        message.error('Cookie is empty');
        setLoading(false);
        return;
      }
      const isCookieValid: boolean = await validateCookie(cookie);
      if (isCookieValid) {
        await submitCookie(cookie);
        const account = await (await getAccountProfileApi()).data.result;
        dispatch(accountCreators.setAccount(account));
        setLoading(false);
      } else {
        confirm({
          title: 'Cookie is invalid',
          content: 'Set the cookie anyway?',
          async onOk() {
            await submitCookie(cookie);
            setLoading(false);
          },
          onCancel() {
            setLoading(false);
          },
        });
      }
    } catch (err) {
      message.error('Failed to save cookie');
    }
  };

  const validateCookie = async (cookie: string) => {
    const res = await validateCookieApi(cookie);
    const isCookieValid: boolean = res.data.result;
    return isCookieValid;
  };

  const submitCookie = async (cookie: string) => {
    await setCookieApi(cookie);
    setIsEdit(false);
    setCookie(cookie);
    message.success('New Cookie Set');
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
          label={'Cookie'}
        >
          {isEdit ? (
            <Input.TextArea rows={6}></Input.TextArea>
          ) : (
            <p>{cookie || `Cookie doesn't exist`}</p>
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
