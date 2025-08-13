// src/components/EmailVerification.js
import React, { useState } from 'react';
import { sendCode, verifyCode } from '../api/client'; // api 폴더 기준 경로

export default function EmailVerification() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);

  const handleSend = async () => {
    const res = await sendCode(email);
    alert(res.message);
  };

  const handleVerify = async () => {
    const res = await verifyCode(code);
    if (res.verified) {
      alert('인증되었습니다!');
      setVerified(true);
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <div>
      {!verified ? (
        <>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSend}>인증번호 요청</button>

          <input
            type="text"
            placeholder="인증번호 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleVerify}>확인</button>
        </>
      ) : (
        <>
          <input type="password" placeholder="비밀번호 입력" />
          <button>가입하기</button>
        </>
      )}
    </div>
  );
}
