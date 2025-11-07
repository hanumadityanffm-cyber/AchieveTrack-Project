import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container" style={{ textAlign: 'center', padding: '20px' }}>
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;