import React, { HTMLAttributes, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import oc from 'open-color';
import { AiFillFile, AiOutlineDownload } from 'react-icons/ai';
import { getFileInfo, IFileInfo } from '../../utils/FileInfo';
import { css } from '@emotion/react';

const StyledFileAttachment = styled.div`
  
  max-width: 100%;
  background-color: ${oc.gray[8]};
  display: flex;
  color :${oc.gray[4]};
  border-radius: .25rem;
  align-items: center;
  padding: 10px;
  gap:10px;
  p{
    margin: 0;
  }
  .fileInfo{

    overflow:hidden;
    width:300px;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
  #fileIcon{
    min-width: 40px;
    width:40px;
    height:40px;
    color: ${oc.gray[3]};
  }
  #downloadButton{
    min-width: 26px;
    width:26px;
    height:26px;
    color: ${oc.gray[5]};
    &:hover{
      color: ${oc.white};
    }
  }
`;

interface FileAttachmentProps extends HTMLAttributes<HTMLDivElement>{
  attachmentUrl:string
}

const FileAttachment:React.FC<FileAttachmentProps>=({attachmentUrl, ...rest})=>{

  const [fileInfo, setFileInfo] = useState<IFileInfo>(getFileInfo(attachmentUrl));

  useEffect(()=>{
    setFileInfo(getFileInfo(attachmentUrl));
  },[attachmentUrl])
  
  if(fileInfo){
    return(
      <StyledFileAttachment className='fileAttachment'>
        <AiFillFile id='fileIcon'/>
        <span className="fileInfo">
          <b>{fileInfo.name}</b>
          <p>{fileInfo.size}</p>
        </span>
        <a href={attachmentUrl}>
          <AiOutlineDownload id='downloadButton'/>
        </a>
      </StyledFileAttachment>
    )
  }
}

export default FileAttachment