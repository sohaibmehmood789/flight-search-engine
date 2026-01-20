import "./LoadingSkeleton.css";

const LoadingSkeleton = () => {
  return (
    <div className="skeleton-container">
      {[1, 2, 3].map((index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-header">
            <div className="skeleton-airline">
              <div className="skeleton-logo"></div>
              <div className="skeleton-text skeleton-text-medium"></div>
            </div>
            <div className="skeleton-price">
              <div className="skeleton-text skeleton-text-large"></div>
              <div className="skeleton-text skeleton-text-small"></div>
            </div>
          </div>

          <div className="skeleton-body">
            <div className="skeleton-route">
              <div className="skeleton-point">
                <div className="skeleton-text skeleton-text-large"></div>
                <div className="skeleton-text skeleton-text-small"></div>
              </div>
              <div className="skeleton-path">
                <div className="skeleton-text skeleton-text-small"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-text skeleton-text-tiny"></div>
              </div>
              <div className="skeleton-point">
                <div className="skeleton-text skeleton-text-large"></div>
                <div className="skeleton-text skeleton-text-small"></div>
              </div>
            </div>
          </div>

          <div className="skeleton-footer">
            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
