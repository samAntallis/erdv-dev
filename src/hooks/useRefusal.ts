import isEmpty from "lodash.isempty";
import { useEffect } from "react";
import ReactGA from 'react-ga4';
import { useHistory, useLocation } from "react-router-dom";
import { sendEmail } from "../components/SendMail";
import { OTRM_FETCH_CUSTOMER, OTRM_REST_CONNECTOR_PATH, SEND_MAIL_TO } from "../constants/index";

export function useRefusal(refusal: boolean, refusalCustomerMessage: string) {
  const history = useHistory();
  const location = useLocation();
  const locationState = location.state as { customerSessionData: {
    customerId: string;
    jobId: string;  
    ffaSession: string;
    customerEmail: string;
    customerPhone: string;
    customerPostalCode: string;
    customerCity: string;
    mailAgence: string;
    secteurX3: string;
    rdvPris: string;
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
  

  useEffect(() => {
    if (!refusal) {
      return;
    }
    ReactGA.event({
      category: 'Compteur prise de RDV',
      action: locationState.customerSessionData.rdvPris === 'true' ? 'Declined - Changed Slot' : 'refusé',
      label: locationState.customerSessionData.jobId.substring(0,3) + '|' + (new Date()).toLocaleDateString(navigator.language, { month: 'long'}),
      value: 1
    });
    (async function sendRefusal() {
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: "0",
          sessionId: locationState.customerSessionData.ffaSession,
          actionCommand: "refused",
          slotInfo: null,
          jobId: locationState.customerSessionData.jobId
        })
      });
      history.replace('/schedule/refusal', locationState);
    })()
  
    if (isEmpty(refusalCustomerMessage)) {
      return;
    }
  
    ReactGA.event({
      category: 'Compteur commentaire Client',
      action: 'refusé',
      label: locationState.customerSessionData.jobId.substring(0,3) + '|' + (new Date()).toLocaleDateString(navigator.language, { month: 'long'}),
      value: 1
    });
  
    const subject = "[Refus client] DS "+locationState.customerSessionData.jobId+" | "+locationState.customerSessionData.secteurX3;
    const htmlContent = "<html><head></head><body><p>Commentaire :</p><p>"+refusalCustomerMessage+"</p><br/><p>DS : "
    +locationState.customerSessionData.jobId+
    "</p><p>N° client : "+locationState.customerSessionData.customerId
    +"<p>Code postal : "+locationState.customerSessionData.customerPostalCode +
    "</p><p>Ville : "+locationState.customerSessionData.customerCity +
    "</p><p>Code secteur : "+locationState.customerSessionData.secteurX3 +
    "</p><p>Mail client : "+locationState.customerSessionData.customerEmail
    +"</p></body></html>";

    const sendTo = locationState.customerSessionData.mailAgence;
    const ccAddresses = SEND_MAIL_TO;
    sendEmail(sendTo , subject, htmlContent, ccAddresses);

  },
  // Watch following variables so if any of these has changed, we run the hook
  [
    locationState,
    refusal,
    refusalCustomerMessage,
    history
  ]);
}
