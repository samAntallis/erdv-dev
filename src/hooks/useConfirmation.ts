import isEmpty from "lodash.isempty";
import { useEffect } from "react";
import ReactGA from 'react-ga4';
import { useHistory, useLocation } from "react-router-dom";
import { sendEmail } from "../components/SendMail";
import { OTRM_FETCH_CUSTOMER, OTRM_REST_CONNECTOR_PATH, SEND_MAIL_TO } from "../constants/index";

export function useConfirmation(confirmedSlot: boolean, confirmCustomerMessage: string, isDefaultDateScreen: boolean, selectedCustomerSlot: {
  period: {
    // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
    start: string;
    // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
    end: string;
  };
  travelTimeChange: number;
  waitingTime: number;
  newTourStarted: boolean;
  respectProperty: boolean;
  respectSector: boolean;
  respectPreferedWorker: boolean;
  bestSlot: boolean;
  maxDeviationTime: number;
  color: string;
  label: string;
} | undefined ) {
  const history = useHistory();
  const location = useLocation();
  const locationState = location.state as { customerSessionData: {
    customerId: string;
    jobId: string;  
    ffaSession: string;
    mailAgence: string;
    secteurX3: string;
    rdvPris: string;
    customerEmail: string;
    customerCity: string;
    customerPhone: string;
    customerPostalCode: string;
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
      travelTimeChange: number;
      waitingTime: number;
      newTourStarted: boolean;
      respectProperty: boolean;
      respectSector: boolean;
      respectPreferedWorker: boolean;
      bestSlot: boolean;
      maxDeviationTime: number;
      color: string;
      label: string;
    };
  } };

  useEffect(() => {
    if (!confirmedSlot) {
      return;
    }
  
    ReactGA.event({
      category: 'Compteur prise de RDV',
      action: locationState.customerSessionData.rdvPris === 'true' ? 'Changed slot' : isDefaultDateScreen ? 'Best slot' : 'Other slot',
      label: locationState.customerSessionData.jobId.substring(0,3) + '|' + (new Date()).toLocaleDateString(navigator.language, { month: 'long'}),
      value: 1
    });
  
    locationState.customerSessionData.confirmedCustomerSlot = selectedCustomerSlot;
    (async function sendConfirmation() {
      await fetch(OTRM_REST_CONNECTOR_PATH + '/finalCustomer/json/checkCustomerSession.json', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: "0",
          sessionId: locationState.customerSessionData.ffaSession
        })
});
      //TODO vérifier le retour avant de faire la redirection
      await fetch(OTRM_FETCH_CUSTOMER, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          actionCommand: locationState.customerSessionData.confirmedCustomerSlot?.period === locationState.customerSessionData.defaultCustomerSlot?.period ? "acceptedBestSlot" : 'acceptedOtherSlot',
          id: "0",
          jobId: locationState.customerSessionData.jobId,
          sessionId: locationState.customerSessionData.ffaSession,
          slotInfo: {
            bestSlot: locationState.customerSessionData.confirmedCustomerSlot?.bestSlot,
            respectPreferedWorker: locationState.customerSessionData.confirmedCustomerSlot?.respectPreferedWorker,
            respectProperty: locationState.customerSessionData.confirmedCustomerSlot?.respectProperty,
            respectSector: locationState.customerSessionData.confirmedCustomerSlot?.respectSector,
            travelTimeChange: locationState.customerSessionData.confirmedCustomerSlot?.travelTimeChange,
            waitingTime: locationState.customerSessionData.confirmedCustomerSlot?.waitingTime,
            color: locationState.customerSessionData.confirmedCustomerSlot?.color,
            maxDeviationTime: locationState.customerSessionData.confirmedCustomerSlot?.maxDeviationTime,
            newTourStarted: locationState.customerSessionData.confirmedCustomerSlot?.newTourStarted,
            period: locationState.customerSessionData.confirmedCustomerSlot?.period
          },
          sessionDaysLife: 3
        })
      });

      history.replace('/schedule/confirmed', {
        customerSessionData: locationState.customerSessionData
      });
    })();
  
    if (isEmpty(confirmCustomerMessage)) {
      return;
    }
  
    ReactGA.event({
      category: 'Compteur commentaire Client',
      action: 'confirmé',
      label: locationState.customerSessionData.jobId.substring(0,3) + '|' + (new Date()).toLocaleDateString(navigator.language, { month: 'long'}),
      value: 1
    });

    const subject = "[Commentaire client] DS "+locationState.customerSessionData.jobId+" | "+locationState.customerSessionData.secteurX3;
    const htmlContent = "<html><head></head><body><p>Commentaire :</p><p>"+confirmCustomerMessage+"</p><br/><p>DS : "
    + locationState.customerSessionData.jobId+
    "</p><p>N° client : "+locationState.customerSessionData.customerId+
    "<p>Code postal : "+locationState.customerSessionData.customerPostalCode +
    "</p><p>Ville : "+locationState.customerSessionData.customerCity +
    "</p><p>Code secteur : "+locationState.customerSessionData.secteurX3 +
    "</p><p>Mail client : "+locationState.customerSessionData.customerEmail
    + "</p></body></html>"

    const sendTo = locationState.customerSessionData.mailAgence;
    const ccAddresses = SEND_MAIL_TO;
    sendEmail(sendTo , subject, htmlContent, ccAddresses);
  },
  
  // Watch following variables so if any of these has changed, we run the hook
  [
    selectedCustomerSlot,
    locationState,
    confirmedSlot,
    confirmCustomerMessage,
    history,
    isDefaultDateScreen
  ]);
}