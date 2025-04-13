import React, { useState } from "react";
import {
  useHistory,
  useLocation
} from "react-router-dom";
import { useEffectOnce } from 'react-use';
import isEmpty from 'lodash.isempty';
import isNil from "lodash.isnil";

import { FlexCenteredLogo as Logo } from '../components/Logo';
// import { CustomerSessionData } from "../types";


export const SchedulerConfirmationPage = () => {
  const locationState = useLocation().state as { customerSessionData: {
    customerId: string;
    jobId: string;  
    ffaSession: string;
    customerEmail: string;
    customerPhone: string;
    timePeriods?: Array<{ start: string, end: string }>;
    defaultCustomerSlot?: {
      period: {
        // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
        start: string;
        // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
        end: string;
      };
      label: string;
    };
    customerSlots?: Array<{
      period: {
        // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
        start: string;
        // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
        end: string;
      };
      label: string;
    }>;
    confirmedCustomerSlot?: {
      period: {
        // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
        start: string;
        // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
        end: string;
      };
      label: string;
    };
  } };
  const [customerSlot, setCustomerSlot] = useState<{
    period: {
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      start: string;
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      end: string;
    };
    label: string;
  }>();
  const history = useHistory();

  useEffectOnce(() => {
    if (isEmpty(locationState) || isNil(locationState.customerSessionData.confirmedCustomerSlot)) {
      // redirect to default page
      history.replace("/");
      return;
    }

    setCustomerSlot(locationState.customerSessionData.confirmedCustomerSlot);
  });

  const renderConfirmationScreen = () => {
    return (
      <>
        <div className="step custom-scrollbar full-width">
          <div className="step__content">
            <div className="w-txt">
              <div data-animation="fade-up" className="title h3 text-center">Votre rendez-vous est validé</div>
            </div>
            <div className="w-info full-width" style={{display: 'block'}}>
              <p className="text-center">Un technicien Culligan interviendra chez vous</p>
              <p className="text-center" style={{fontWeight: 'bold'}}>{customerSlot && customerSlot.label}</p>
            </div>
            {/* // TODO better message */}
            <div className="w-txt">
              <div className="title h4 text-center" style={{ fontSize: '1.1rem' }}>Vous allez recevoir un e-mail de confirmation.</div>
            </div>
            <div className="w-txt">
              <div className="title h4 text-center" style={{ fontSize: '1.1rem', color: 'black'}}>Nouveau ! Vous avez desormais la possibilité de modifier votre rendez-vous en cliquant sur le lien du mail de confirmation.</div>
            </div>
          </div>
        </div>
      </>
    );
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