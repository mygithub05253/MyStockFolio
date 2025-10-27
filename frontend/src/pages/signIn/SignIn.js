import React from 'react';
import { useForm } from 'react-hook-form';
import BasicButton from "../../components/button/BasicButton.jsx";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setUserStatus } from '../../modules/user';

const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onchange" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

  const onSubmit = async (data) => {
    console.log("로그인 시도:", data);
    try {
      // TODO: 실제 백엔드 로그인 API 호출 (/api/auth/login)
      console.log("로그인 성공 (임시)");
      const tempUserData = {
        id: 1, email: data.email, nickname: "임시사용자", walletAddress: "0x...",
      };
      dispatch(setUser(tempUserData));
      dispatch(setUserStatus(true));
      navigate('/dashboard');
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      alert("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <form className="w-full h-full" onSubmit={handleSubmit(onSubmit)}>

      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">이메일</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="text"
          id="email" name="email"
          placeholder="아이디를 입력하세요."
          {...register("email", { required: true, pattern: { value: emailRegex } })}
        />
        {errors?.email?.type === "required" && (
          <p className="text-xs text-purple-600 pt-2.5">이메일을 입력해주세요.</p>
        )}
        {errors?.email?.type === "pattern" && (
          <p className="text-xs text-purple-600 pt-2.5">이메일 양식에 맞게 입력해주세요.</p>
        )}
      </label>

      <label className="block w-full mb-8">
        <p className="text-base font-semibold text-gray-800 mb-3">비밀번호</p>
        <input className="w-full aspect-[8/1] rounded-lg bg-gray-100 text-gray-900 px-4 border-none"
          type="password"
          id="password" name="password"
          placeholder="비밀번호를 입력하세요."
          {...register("password", { required: true, pattern: { value: passwordRegex } })}
        />
        {errors?.password?.type === "required" && (
          <p className="text-xs text-purple-600 pt-2.5">비밀번호를 입력해주세요.</p>
        )}
        {errors?.password?.type === "pattern" && (
          <p className="text-xs text-purple-600 pt-2.5">소문자, 숫자, 특수문자 각 하나씩 포함한 8자리 이상이어야 합니다.</p>
        )}
      </label>

      <BasicButton type="submit" size={"full"} shape={"small"} variant={"black"} color={"white"}>로그인</BasicButton>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">또는</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex flex-col space-y-3">
        {/* MetaMask 로그인 버튼 */}
        <button
          type="button"
          className="flex items-center justify-center w-full py-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          onClick={() => { console.log("MetaMask 로그인 시도"); /* TODO */ }}
        >
          <span className="ml-2 font-semibold">MetaMask로 로그인</span>
        </button>

        {/* Google 로그인 버튼 */}
        <button
          type="button"
          className="flex items-center justify-center w-full py-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
          onClick={() => { window.location.href = "/oauth2/authorization/google"; }}
        >
          <span className="ml-2 font-semibold">Google로 로그인</span>
        </button>

        {/* Kakao 로그인 버튼 */}
        <button
          type="button"
          className="flex items-center justify-center w-full py-3 text-black bg-yellow-400 rounded-lg hover:bg-yellow-500"
          onClick={() => { window.location.href = "/oauth2/authorization/kakao"; }}
        >
          <span className="ml-2 font-semibold">Kakao로 로그인</span>
        </button>

        {/* Naver 로그인 버튼 */}
        <button
          type="button"
          className="flex items-center justify-center w-full py-3 text-white bg-green-500 rounded-lg hover:bg-green-600"
          onClick={() => { window.location.href = "/oauth2/authorization/naver"; }}
        >
          <span className="ml-2 font-semibold">Naver로 로그인</span>
        </button>
      </div>
    </form>
  );
};

export default SignIn;