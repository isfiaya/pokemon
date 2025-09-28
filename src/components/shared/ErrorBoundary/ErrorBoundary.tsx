import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import './ErrorBoundary.css';

export const ErrorBoundary = () => {
  const error = useRouteError();

  const getErrorMessage = (error: unknown): string => {
    if (isRouteErrorResponse(error)) {
      return error.statusText || 'Something went wrong';
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Unknown error';
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className='error-boundary'>
      <div className='error-content'>
        <h1>Oops! Something went wrong</h1>
        <p className='error-message'>{errorMessage}</p>
        <button
          className='retry-button'
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
        <button
          className='home-button'
          onClick={() => (window.location.href = '/')}
        >
          Go home
        </button>
      </div>
    </div>
  );
};
