// 중첩적인 스타일들을 선언하는 파일

import { css } from "styled-components";

export const flexCenterColumn = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const flexCenterRow = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const textH1 = css`
  font-size: 48px;
  font-weight: 900;
  letter-spacing: -0.1px;
`;

export const inputBackground = css`
  border: none;
  background-color: gray;
  margin: 4px;
`;
