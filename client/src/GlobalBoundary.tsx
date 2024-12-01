import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

export const GlobalErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  const navigate = useNavigate();
  const navigateToMain = () => {
    navigate('/');
    resetErrorBoundary();
  };
  console.log('글로벌');
  return (
    <div>
      <h1>에러가 발생했습니다.</h1>
      <pre>{error.message}</pre>
      <button onClick={navigateToMain}>메인으로 이동</button>
    </div>
  );
};

export const GlobalBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
      <Suspense fallback={<div>로딩중...</div>}>{children}</Suspense>
    </ErrorBoundary>
  );
};
