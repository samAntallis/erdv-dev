import React from "react";

import { FlexCenteredLogo as Logo } from '../components/Logo';


export const SchedulerRefusalPage = () => {
  const renderConfirmationScreen = () => {
    return (
      <>
        <div className="step custom-scrollbar full-width">
          <div className="step__content">
            <div className="w-txt">
              <div data-animation="fade-up" className="title h3 text-center">Tous les rendez-vous ont été refusés</div>
            </div>
            {/* // TODO better message */}
            <div className="w-txt">
              <div className="title h4 text-center" style={{
                fontFamily: 'Arial',
                fontSize: '17px'
              }}>Votre Service Clients Culligan vous contactera dans les meilleurs délais afin de convenir d'un rendez-vous.</div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="page page--forms">
      <header>
        <Logo />
      </header>
      <div className="content-fluid">
        <div className="w-content">
          {renderConfirmationScreen()}  
        </div>
      </div>
    </div>
  );
}