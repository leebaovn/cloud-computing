import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function ThumbUpload() {
  const [imgUrl, setImgUrl] = useState();
  const [fileSelect, setFileSelect] = useState();

  const handleUpload = (e) => {
    if (e.target.files) {
      setFileSelect(e.target.files[0]);
    }
  };
  return (
    <Upload name='thumb' onChange={handleUpload}>
      <Button icon={<UploadOutlined />}>Upload thumbnail</Button>
    </Upload>
  );
}

export default ThumbUpload;
