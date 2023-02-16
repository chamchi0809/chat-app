import React, {Dispatch, InputHTMLAttributes, SetStateAction, useRef} from 'react'
import oc from 'open-color'
import {styledSize} from '../../styles/SizeStyles'
import {css} from '@emotion/react'
import {AiOutlineClose, AiOutlineSearch} from 'react-icons/ai'


const sizeStyles = {
    sm: css`
      height: 24px;
      font-size: 12px;
      margin: 6px 14px;
      padding: 0 4px;
    `,
    md: css`
      height: 36px;
      font-size: 16px;
      margin: 8px 16px;
      padding: 0 8px;
    `,
    lg: css`
      height: 48px;
      font-size: 16px;
      margin: 10px 18px;
      padding: 0 12px;
    `,
}

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: styledSize
    color?: string
    bgcolor?: string
    setValue: Dispatch<SetStateAction<string>>
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                     color = 'black',
                                                     bgcolor = 'white',
                                                     size = 'md',
                                                     setValue,
                                                     ...rest
                                                 }) => {

    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div
            className='searchInput'
            css={css`
              position: relative;
              ${sizeStyles[size]}
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: ${bgcolor};

              border-radius: .25em;
              width: max-content;

              input {
                border: 0;
                outline: none;
                border-radius: .25rem;
                font-size: 1.0em;
                line-height: 1.0em;
                height: 100%;
                width: max-content;
                flex: 1;
                background: ${bgcolor};
                color: ${color};
              }

              span {
                font-size: 1.0em;
                color: ${oc.gray[6]};
              }

              .deleteButton {
                cursor: pointer;

                &:hover {
                  color: ${oc.gray[3]}
                }
              }
            `}
        >
            <input {...rest}/>
            <span>
        {
            String(rest.value).length === 0 ?
                <AiOutlineSearch/>
                :
                <AiOutlineClose className='deleteButton' onClick={(e) => {
                    setValue('');
                }}/>
        }
      </span>
        </div>
    )
}

export default SearchInput