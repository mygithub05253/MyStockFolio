import React from 'react';
import { useForm } from 'react-hook-form';
import BasicButton from "../../components/button/BasicButton.jsx";

const SignUp = () => {
  
  // react-hook-form
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode : "onchange" });

  // 정규식 문법
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

  return (
    <form className="w-full h-full" onSubmit={handleSubmit((data) => { 
        console.log(data)
      })}>
      {/* 이메일 검증 로직 */}
      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">이메일</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none" 
          type="text" 
          id="email" name="email" 
          placeholder="아이디를 입력하세요." 
          {...register("email", {
            required : true,
            pattern : {
              value : emailRegex,
            }
          })} />

        {errors?.email?.type === "required" && (
          <p className="text-xs text-purple-600 pt-2.5">이메일을 입력해주세요.</p>
        )}  

        {errors?.email?.type === "pattern" && (
          <p className="text-xs text-purple-600 pt-2.5">이메일 양식에 맞게 입력해주세요.</p>
        )}  
      </label>

      {/* 비밀번호 검증 로직 */}
      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">비밀번호</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="password" 
          id="password" name="password" 
          placeholder="비밀번호를 입력하세요." 
          {...register("password", {
            required : true,
            pattern : {
              value : passwordRegex,
            }
          })} />

        {errors?.password?.type === "required" && (
          <p className="text-xs text-purple-600 pt-2.5">비밀번호를 입력해주세요.</p>
        )}  

        {errors?.password?.type === "pattern" && (
          <p className="text-xs text-purple-600 pt-2.5">소문자, 숫자, 특수문자 각 하나씩 포함한 8자리 이상이어야 합니다. "!@#만 사용가능"</p>
        )}  
      </label>

      {/* 비밀번호 확인 로직 */}
      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">비밀번호 확인</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="password" 
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
          <p className="text-xs text-purple-600 pt-2.5">비밀번호를 확인해주세요.</p>
        )}  

      </label>

      {/* 블록체인 지갑 주소 입력란 */}
      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">블록체인 지갑 주소 (선택)</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none" 
          type="text" 
          placeholder="MetaMask 지갑 주소를 입력하세요. (예: 0x...)"
          {...register("walletAddress")}
          />
      </label>

      <BasicButton size={"full"} shape={"small"} variant={"black"} color={"white"}>회원가입</BasicButton>
    </form>
  );
};

export default SignUp;