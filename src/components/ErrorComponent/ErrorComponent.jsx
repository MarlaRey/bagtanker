import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorComponent.module.scss';

const ErrorComponent = ({ message, onRetry }) => {
  return (
    <div className={styles.errorContainer}>
      <h2>Something went wrong</h2>
      <p>{message || "An unexpected error occurred. Please try again later."}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton}>
          Retry
        </button>
      )}
    </div>
  );
};

ErrorComponent.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ErrorComponent;
