import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Button } from './shared/ui';

export const NetworkFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  const handleClickReset = () => {
    resetErrorBoundary();
  };
  return (
    <div className="flex flex-col h-screen justify-center items-center w-full text-grayscale-100 gap-4">
      <h1>이 에러엔 슬픈 전설이 있어</h1>
      <pre>{error.message}</pre>
      {/* <Button message={'메인으로 이동'} onClick={handleClickReset} /> */}
    </div>
  );
};

export const NetworkBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={NetworkFallback}>
          <Suspense
            fallback={<div className="text-grayscale-100">로딩중...</div>}
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
