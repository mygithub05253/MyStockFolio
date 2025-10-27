import React from 'react';
import { useForm } from 'react-hook-form';
import BasicButton from "../../components/button/BasicButton.jsx";
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 임포트 추가

const SignUp = () => {
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({ mode : "onchange" });
  const navigate = useNavigate(); // useNavigate 훅 사용

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

  // 회원가입 제출 핸들러 (API 호출 활성화)
  const onSubmit = async (data) => {
    console.log("회원가입 시도:", data);

    // passwordConfirm 필드는 백엔드로 보낼 필요 없음 (프론트 검증용)
    const { passwordConfirm, ...submitData } = data;

    try {
      // 👇 주석 해제 및 API 호출 실행
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // passwordConfirm 제외한 데이터 전송
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        navigate('/signIn'); // 로그인 페이지로 이동
      } else {
        // 회원가입 실패 처리 (백엔드 에러 메시지 활용)
        const errorData = await response.json(); // 백엔드가 에러 메시지를 JSON으로 보낸다고 가정
        alert(`회원가입 실패: ${errorData.message || '입력 정보를 확인하세요.'}`);
      }
      // alert('회원가입 기능 구현 예정입니다.'); // 👈 임시 알림 제거
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      alert("회원가입 중 오류가 발생했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.");
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

      {/* 닉네임 필드 추가 (백엔드 AuthDto.SignUpRequest 에 맞춰) */}
      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">닉네임</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="text" id="nickname" name="nickname" placeholder="사용할 닉네임을 입력하세요."
          {...register("nickname", { required : "닉네임을 입력해주세요." })} // 필수 입력 및 메시지 추가
        />
        {errors.nickname && (<p className="text-xs text-purple-600 pt-2.5">{errors.nickname.message}</p>)}
      </label>

      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">비밀번호</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="password" id="password" name="password" placeholder="비밀번호를 입력하세요."
          {...register("password", { required : true, pattern : { value : passwordRegex } })}
        />
        {errors?.password?.type === "required" && (<p className="text-xs text-purple-600 pt-2.5">비밀번호를 입력해주세요.</p>)}
        {errors?.password?.type === "pattern" && (<p className="text-xs text-purple-600 pt-2.5">소문자, 숫자, 특수문자(!@#) 포함 8자 이상이어야 합니다.</p>)}
      </label>

      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">비밀번호 확인</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="password" placeholder="비밀번호를 확인해주세요."
          {...register("passwordConfirm", {
            required : "비밀번호 확인을 입력해주세요.", // 메시지 추가
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
          {...register("walletAddress", {
             // 간단한 지갑 주소 형식 검사 (선택 사항)
             pattern: {
               value: /^0x[a-fA-F0-9]{40}$/,
               message: "올바른 지갑 주소 형식이 아닙니다."
             }
          })}
        />
         {errors.walletAddress && (<p className="text-xs text-purple-600 pt-2.5">{errors.walletAddress.message}</p>)}
      </label>

      <BasicButton type="submit" size={"full"} shape={"small"} variant={"black"} color={"white"}>회원가입</BasicButton>

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