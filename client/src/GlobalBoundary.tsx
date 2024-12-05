import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './shared/ui';

export const GlobalErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  const navigate = useNavigate();
  const navigateToMain = () => {
    navigate('/');
    resetErrorBoundary();
  };
  return (
    <div className="text-grayscale-100 w-full h-screen flex flex-col justify-center items-center">
      <h1>에러가 발생했습니다.</h1>
      <pre>{error.message}</pre>
      <Button message="메인으로 이동" onClick={navigateToMain}></Button>
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
