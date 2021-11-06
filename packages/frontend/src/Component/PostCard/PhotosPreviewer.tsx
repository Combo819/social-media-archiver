import React from 'react';
import { Col, Row } from 'antd';
import { PhotoProvider, PhotoConsumer } from 'react-photo-view';
import { getImageUrl } from '../../Utility/parseUrl';
import 'react-photo-view/dist/index.css';
import { Image } from '../../types';

function PhotosPreviewer(props: { images: Image[][] }) {
  const { images } = props;
  return (
    <PhotoProvider>
      {images.map((item) => (
        <Row gutter={[8, 8]} justify="center">
          {item.map((image) => (
            <Col key={image.name} style={{ overflow: 'hidden' }} span={8}>
              <PhotoConsumer
                key={getImageUrl(image.name)}
                intro={getImageUrl(image.name)}
                src={getImageUrl(image.name)}
              >
                <img
                  className="img-thumbnail"
                  style={{
                    height: 150,
                    width: '100%',
                    objectFit: 'cover',
                  }}
                  src={getImageUrl(image.name)}
                ></img>
              </PhotoConsumer>
            </Col>
          ))}
        </Row>
      ))}
    </PhotoProvider>
  );
}

export { PhotosPreviewer };
