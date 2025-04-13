import React, { useRef, ReactElement, SyntheticEvent } from 'react';
import { useEffectOnce } from 'react-use';

import { CloseButton } from './CloseButton';

import './styles.css';
import './Content/styles.css';
import './CloseButton/styles.css';

export const CLOSE_MODAL_EVENT_TYPE = 'CLOSE_MODAL';

const body = document.body;

function setBodyOverflow(overflowValue: string) {
  body.style.overflow = overflowValue;
}
function hideBodyScrollbar() {
  setBodyOverflow('hidden');
}

function showBodyScrollbar() {
  setBodyOverflow('');
}

export const Modal = ({ onClose, children } : {
  onClose?: () => void;
  children: (closeModal?: (event: SyntheticEvent<HTMLDivElement, Event>) => void) => ReactElement;
}) => {
  const modal = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  
  // useEffectOnce = onMount
  useEffectOnce(() => {
    hideBodyScrollbar();
  })

  function closeModal(event: SyntheticEvent<Element, Event>) {
    const isValidOnClickCloseModalEvent = (
      event.target === modal.current ||
      event.target === closeButton.current ||
      event.type === CLOSE_MODAL_EVENT_TYPE
    );

    if (!isValidOnClickCloseModalEvent) {
      return;
    }
    
    modal.current && modal.current.classList.remove('open');
    onClose && onClose();
    showBodyScrollbar();
  }

  return (
    // TODO fix onClick type
    <div ref={modal} className="modal open" onClick={closeModal}>
      <div className="modal__top-bar">
        <CloseButton ref={closeButton}/>
      </div>
      <div className="modal__content custom-scrollbar">
        <div className="w-modal-forms-contact w-txt" id="modal-forms">
          <div className="content">
            {children && children(closeModal)}
          </div>
        </div>
      </div>
    </div>
  );
};
