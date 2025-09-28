import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner = ({
  message = 'Loading...',
  size = 'medium',
}: LoadingSpinnerProps) => {
  return (
    <div className='loading-spinner-container' data-testid='loading-spinner'>
      <div className={`loading-spinner loading-spinner--${size}`} />
      {message && <p className='loading-message'>{message}</p>}
    </div>
  );
};
