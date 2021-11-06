import React, { useState, useRef, useMemo } from 'react';

import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

/**
 * https://ant.design/components/select/#components-select-demo-select-users
 * the fetchApi should return format like {value:string,label:string}
 * @returns 
 */
export function DebounceSelect({ fetchApi, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchApi(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchApi, debounceTimeout]);

  return (
    <Select
      mode='multiple'
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : <span>Not Found</span>}
      {...props}
      options={options}
    />
  );
} // Usage of DebounceSelect
