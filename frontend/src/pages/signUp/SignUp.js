import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/input/style';
import BasicButton from "../../components/button/BasicButton.jsx";
import S from "./style.js";

const SignUp = () => {
  
  // react-hook-form
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode : "onchange" });

  // 정규식 문법
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

  return (
    <S.Form onSubmit={handleSubmit((data) => { 
        console.log(data)
      })}>
      {/* 이메일 검증 로직 */}
      <S.Label>
        <S.Title>이메일</S.Title>
        <Input size={"full"} shape={"small"} variant={"gray"} color={"black"} 
          type="text" 
          className="BasicInput" 
          id="email" name="email" 
          placeholder="아이디를 입력하세요." 
          {...register("email", {
            required : true,
            pattern : {
              value : emailRegex,
            }
          })} />

        {errors?.email?.type === "required" && (
          <S.ConfirmMessage>이메일을 입력해주세요.</S.ConfirmMessage>
        )}  

        {errors?.email?.type === "pattern" && (
          <S.ConfirmMessage>이메일 양식에 맞게 입력해주세요.</S.ConfirmMessage>
        )}  
      </S.Label>

      {/* 비밀번호 검증 로직 */}
      <S.Label>
        <S.Title>비밀번호</S.Title>
        <Input size={"full"} shape={"small"} variant={"gray"} color={"black"} 
          type="password" 
          className="BasicInput" 
          id="password" name="password" 
          placeholder="비밀번호를 입력하세요." 
          {...register("password", {
            required : true,
            pattern : {
              value : passwordRegex,
            }
          })} />

        {errors?.password?.type === "required" && (
          <S.ConfirmMessage>비밀번호를 입력해주세요.</S.ConfirmMessage>
        )}  

        {errors?.password?.type === "pattern" && (
          <S.ConfirmMessage>소문자, 숫자, 특수문자 각 하나씩 포함한 8자리 이상이어야 합니다. "!@#만 사용가능"</S.ConfirmMessage>
        )}  
      </S.Label>

      {/* 비밀번호 확인 로직 */}
      <S.Label>
        <S.Title>비밀번호 확인</S.Title>
        <Input size={"full"} shape={"small"} variant={"gray"} color={"black"} 
          type="password" 
          className="BasicInput" 
          placeholder="비밀번호를 확인해주세요." 
          {...register("passwordConfirm", {
            required : true,
            validate : {
              matchPassword : (value) => {
                const { password } = getValues();
                let isMatch = password === value;
                // console.log(value, password, isMatch);
                return isMatch;
              }
            }
          })} />

        {errors?.passwordConfirm && (
          <S.ConfirmMessage>비밀번호를 확인해주세요.</S.ConfirmMessage>
        )}  

      </S.Label>

      {/* 블록체인 지갑 주소 입력란 */}
      <S.Label>
        <S.Title>블록체인 지갑 주소 (선택)</S.Title>
        <Input size={"full"} shape={"small"} variant={"gray"} color={"black"} 
          type="text" 
          className="BasicInput" 
          placeholder="MetaMask 지갑 주소를 입력하세요. (예: 0x...)"
          {...register("walletAddress")}
          />
      </S.Label>

      <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}>회원가입</BasicButton>
    </S.Form>
  );
};

export default SignUp;