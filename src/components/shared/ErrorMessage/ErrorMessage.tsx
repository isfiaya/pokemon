import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className='error-message-container' data-testid='error-message'>
      <div className='error-icon'>⚠️</div>
      <h3 className='error-title'>{message}</h3>
      {onRetry && (
        <button
          className='retry-button'
          onClick={onRetry}
          data-testid='retry-button'
        >
          Try Again
        </button>
      )}
    </div>
  );
};
