import React, {forwardRef, TextareaHTMLAttributes} from 'react'
import oc from 'open-color'
import {styledSize} from '../../styles/SizeStyles'
import {css} from '@emotion/react'


const sizeStyles = {
    sm: css`
      height: 54px;
      font-size: 14px;
      padding: 0 14px;
      margin: 6px 14px;
    `,
    md: css`
      height: 56px;
      font-size: 16px;
      padding: 0 16px;
      margin: 8px 16px;
    `,
    lg: css`
      height: 58px;
      font-size: 18px;
      padding: 0 18px;
      margin: 10px 18px;
    `,
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    size?: styledSize
    color?: string
    bgcolor?: string
    borderColor?: string
    enableFocusEffect?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
                                                                     color = 'black',
                                                                     bgcolor = 'white',
                                                                     size = 'md',
                                                                     borderColor = oc.gray[3],
                                                                     enableFocusEffect = true,
                                                                     ...rest
                                                                 }, ref) => {

    return (
        <textarea
            ref={ref}
            css={css`
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
              resize: none;
              border: 1px solid ${borderColor};
              background: ${bgcolor};
              color: ${color};
              outline: none;
              border-radius: .25rem;
              line-height: 2.5rem;

              &:focus {
                ${enableFocusEffect && css`outline: 2px solid ${oc.blue[7]};`};
              }

              ${sizeStyles[size]}
            `}
            {...rest}
        />
    )
})

export default Textarea