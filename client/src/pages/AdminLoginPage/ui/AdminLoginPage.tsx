// src/pages/AdminLoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';
import axios from 'axios';

export function AdminLoginPage() {
  const [adminKey, setAdminKey] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/admin/login', { adminKey });
      localStorage.setItem('adminToken', data.token);
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setAdminKey('');
      alert('관리자 인증에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          관리자 로그인
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="adminKey"
              className="block text-sm font-medium text-black"
            >
              관리자 키
            </label>
            <input
              id="adminKey"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="관리자 키를 입력하세요"
              required
            />
          </div>
          <Button type="submit" message="로그인" className="w-full" />
        </form>
      </div>
    </div>
  );
}
