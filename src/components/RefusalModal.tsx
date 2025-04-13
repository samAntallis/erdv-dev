import React, { useState } from 'react';

import { Modal, CLOSE_MODAL_EVENT_TYPE } from './Modal';


export const RefusalModal = ({
  onClose,
  onConfirm,
  onAfterConfirmCloseModal = true,
  onCancel,
  onAfterCancelCloseModal = true
} : {
  onClose?: () => void;
  onConfirm?: ({customMessage}: {customMessage: string}) => void;
  // calls closeModal method from Modal (after onConfirm is called if defined)
  onAfterConfirmCloseModal?: boolean;
  onCancel?: () => void;
  // calls closeModal method from Modal (after onCancel is called if defined)
  onAfterCancelCloseModal?: boolean;
}) => {
  const [customMessage, setCustomMessage] = useState('');

  return (
    <Modal onClose={onClose}>
      {(closeModal) => (
        <div className="page page--forms" >
          <div className="content-fluid">
            <div className="w-content">
              <div className="w-txt" style={{width: '100%'}}>
                <div className="title h3 text-center">Souhaitez-vous vraiment refuser<br/>tous les rendez-vous ?</div>
              </div>
              <form id="appointmentCustomMessage" data-animation="fade-up" data-delay="100">
                <div className="form-content">
                  <div className="w-field w-field--required w-field__question">
                  <label htmlFor="question" className="w-field__label">
                    Souhaitez-vous laisser un message à votre service Clients Culligan&nbsp;?<span>(facultatif)</span>
                  </label>
                  <textarea
                    name="customMessage"
                    placeholder="Votre message"
                    id="customMessage"
                    className="w-field__control"
                    onChange={(e) => {
                      setCustomMessage(e.target.value);
                    }}
                  ></textarea>
                </div>
                </div>
              </form>
              <div className="w-btn">
                {/* //TODO check right order and precedence for onXXX method calls */}
                <div
                  className="btn btn--primary"
                  onClick={(e) => {
                    onCancel && onCancel();

                    onAfterCancelCloseModal &&
                    closeModal &&
                    (e.type = CLOSE_MODAL_EVENT_TYPE) && closeModal(e);
                  }}
                >
                  Non, je choisis un créneau
                </div>
                <div
                  className="btn btn--outline"
                  onClick={(e) => {
                    onConfirm && onConfirm({ customMessage });

                    onAfterConfirmCloseModal &&
                    closeModal &&
                    (e.type = CLOSE_MODAL_EVENT_TYPE) && closeModal(e);
                  }}
                >
                  Oui, je refuse tous les rendez-vous
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

