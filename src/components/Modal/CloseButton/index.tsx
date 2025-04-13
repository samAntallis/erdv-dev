import React from 'react';

// TODO remove any type
export const CloseButton = React.forwardRef((props: any, ref) => {
  // TODO internationalize button title
  return (
    <button
      ref={ref}
      type="button"
      className="modal__button--close w-btn-circle w-btn-circle--close"
      title="Fermer"
      {...props}
    >
      <div className="btn-circle-container">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
          <circle className="btn-circle" cx="28" cy="28" r="27" fill="none" stroke="#000" strokeWidth="1"></circle>
          <circle className="btn-circle-prog" cx="28" cy="28" r="27" fill="none" stroke="#000" strokeWidth="1"></circle>
        </svg>
      </div>
    </button>
  );
});