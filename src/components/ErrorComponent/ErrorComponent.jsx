import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorComponent.module.scss';

const ErrorComponent = ({ message, onRetry }) => {
  return (
    <div className={styles.errorContainer}>
      <h2>Something went wrong</h2>
      <p>{message || "Noget gik galt, prøv at gå til forsiden og start forfra"}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton}>
          
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
