import React from 'react';
import { useForm } from 'react-hook-form';
import BasicButton from "../../components/button/BasicButton.jsx";
import { Link } from 'react-router-dom'; // Link 임포트 추가

const SignUp = () => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode : "onchange" });

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

  // 회원가입 제출 핸들러 (API 연동 필요)
  const onSubmit = async (data) => {
    console.log("회원가입 시도:", data);
    // TODO: 실제 백엔드 회원가입 API 호출 (/api/auth/register)
    // 비밀번호 확인 로직은 백엔드에서도 수행하는 것이 안전합니다.
    try {
      // const response = await fetch('/api/auth/register', { ... });
      // if (response.ok) {
      //   alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      //   navigate('/signIn');
      // } else {
      //   // 회원가입 실패 처리
      // }
      alert('회원가입 기능 구현 예정입니다.'); // 임시 알림
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };


  return (
    <form className="w-full h-full" onSubmit={handleSubmit(onSubmit)}>

      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">이메일</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="text" id="email" name="email" placeholder="아이디를 입력하세요."
          {...register("email", { required : true, pattern : { value : emailRegex } })}
        />
        {errors?.email?.type === "required" && (<p className="text-xs text-purple-600 pt-2.5">이메일을 입력해주세요.</p>)}
        {errors?.email?.type === "pattern" && (<p className="text-xs text-purple-600 pt-2.5">이메일 양식에 맞게 입력해주세요.</p>)}
      </label>

      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">비밀번호</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="password" id="password" name="password" placeholder="비밀번호를 입력하세요."
          {...register("password", { required : true, pattern : { value : passwordRegex } })}
        />
        {errors?.password?.type === "required" && (<p className="text-xs text-purple-600 pt-2.5">비밀번호를 입력해주세요.</p>)}
        {errors?.password?.type === "pattern" && (<p className="text-xs text-purple-600 pt-2.5">소문자, 숫자, 특수문자 각 하나씩 포함한 8자리 이상이어야 합니다.</p>)}
      </label>

      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">비밀번호 확인</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="password" placeholder="비밀번호를 확인해주세요."
          {...register("passwordConfirm", {
            required : true,
            validate : {
              matchPassword : (value) => {
                const { password } = getValues();
                return password === value || "비밀번호가 일치하지 않습니다.";
              }
            }
          })}
        />
        {errors.passwordConfirm && (<p className="text-xs text-purple-600 pt-2.5">{errors.passwordConfirm.message}</p>)}
      </label>

      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">블록체인 지갑 주소 (선택)</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="text" placeholder="MetaMask 지갑 주소를 입력하세요. (예: 0x...)"
          {...register("walletAddress")}
        />
      </label>

      <BasicButton type="submit" size={"full"} shape={"small"} variant={"black"} color={"white"}>회원가입</BasicButton>

      {/* 소셜/지갑 계정 사용 안내 문구 */}
      <p className="mt-6 text-sm text-center text-gray-500">
        Google, Kakao, Naver, MetaMask 계정이 있으신가요?
        <Link to="/signIn" className="text-indigo-600 hover:underline font-medium ml-1">
          로그인 페이지
        </Link>
        에서 간편하게 시작하세요.
      </p>

    </form>
  );
};

export default SignUp;