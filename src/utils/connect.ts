import isEmpty from 'lodash.isempty';

import {
  getXPathFrom
} from './xpath';
import { WS_REQUEST_PATH } from '../constants';
// TODO Add types to connect function
// import { LoginLocationState, AutoLoginUrlParams, ErrorResult, ConnectResult } from '../types';

// import { sendEmail } from "../components/SendMail";

interface ErrorResult {
  errorId?: number;
  errorMessage: any;
} 

interface LoginLocationState {
  customerId: string;
  jobId: string;
};

interface AutoLoginUrlParams {
  ffaSession: string;
};

interface ConnectResult {
  jobId: string;
  customerId: string;
  ffaSession: string;
  mailAgence: string;
  secteurX3: string;
  rdvPris: string;
};


function getValidatedConnectParams(connectParams: LoginLocationState | AutoLoginUrlParams): ConnectResult | ErrorResult {
  if ('ffaSession' in connectParams) {
    if (isEmpty(connectParams.ffaSession)) {
      return {
        errorMessage: 'connect: ffaSession needs to be provided'
      };
    }

    return {
      jobId: '',
      customerId: '',
      ffaSession: connectParams.ffaSession,
      mailAgence: '',
      secteurX3: '',
      rdvPris: '',
    };

  } else if ('jobId' in connectParams && 'customerId' in connectParams) {
    const { jobId, customerId } = connectParams;

    if (isEmpty(jobId) || isEmpty(customerId)) {
      return {
        errorMessage: 'connect: both jobId and customerId need to be provided'
      };
    }

    return {
      jobId: connectParams.jobId,
      customerId: connectParams.customerId,
      ffaSession: '',
      mailAgence:'',
      secteurX3: '',
      rdvPris: ''
    };
  }

  return {
    errorMessage: 'connect: ffaSession or (jobId and customerId) need to be provided'
  };
}

export const connect = async (
  connectParams: LoginLocationState | AutoLoginUrlParams
): Promise<ConnectResult | ErrorResult> => {

  const validatedConnectParams = getValidatedConnectParams(connectParams);

  if ('errorMessage' in validatedConnectParams) {
    return validatedConnectParams;
  }

  let { jobId, customerId, ffaSession, mailAgence, secteurX3, rdvPris } = validatedConnectParams;

  const checkConnexionXML = `<?xml version='1.0' encoding='UTF-8'?><checkConnexion login='${jobId}' password='${customerId}' ffaSession='${ffaSession}'/>`;

  let response;
  let responseXML;

  try {
    response = await fetch(WS_REQUEST_PATH + checkConnexionXML);
  
    if (!response.ok) {
      return {
        errorMessage: 'Response error code: ' + response.statusText
      }
    }

    /**
     * Example of successful response
     * 
     * <?xml version="1.0" encoding="UTF-8"?>
     * <checkConnexionResponse
     *    status="success"
     *    ffaSession="2c9d442f72da66ed0172dbfe27b70026"
     *    jobId="RFA19-49021"
     *    customerId="141C00146302"
     * />
     * 
     * Example of failing response
     * 
     * <?xml version="1.0" encoding="UTF-8"?>
     * <checkConnexionResponse
     *    status="failed"
     *    errorId="1004"
     *    errorMsg="Le lien n'est pas ou n'est plus valide"
     * />
     * 
     * OR
     * 
     * <checkConnexionResponse status="failed" errorId="1003"
     *    errorMsg="La prise de rendez-vous en ligne n'est plus active"
     *    ffaSession="***"
     *    jobId="***"
     *    customerId="***"
     *    mailAgence="**@culligan.fr"
     * />
     * 
     **/ 
    const responseText = await response.text();
    responseXML = (new DOMParser()).parseFromString(responseText, "text/xml");

  } catch (e) {
    // const subject = "Erreur erdv (connect)";
    // const sendTo = 'cuillandret@culligan.fr';
    // const htmlContent = "<html><head></head><body><p>ERREUR :</p><p>"+e+
    // "</p><br/><p>DS : " +jobId+
    // "</p><p>N° client : "+customerId+
    // "</p><p>ffaSession : "+ffaSession+
    //  "</p></body></html>";
    // const ccAddresses = "louyera@culligan.fr";
    
    // sendEmail( sendTo, subject, htmlContent, ccAddresses);
    return {
      errorMessage: e.message
    };
  }
  
  const { getXPathBoolean, getXPathString, getXPathNumber } = getXPathFrom(responseXML);

  const isSuccess = getXPathBoolean("//@status='success'");           
  if (!isSuccess) {
    // const status = getXPathString('//@status');
    return {
      errorId: getXPathNumber('//@errorId'),
      errorMessage: getXPathString('//@errorMsg')
    };
  }

  const errorMessages: Array<string> = [];

  if (isEmpty(customerId)) {
    customerId = getXPathString('//@customerId');

    if (isEmpty(customerId)) {
      // TODO better error message
      errorMessages.push('empty customerId');
    }
  }

  if (isEmpty(mailAgence)) {
    mailAgence = getXPathString('//@mailAgence');

    if (isEmpty(mailAgence)) {
      // TODO better error message
      errorMessages.push('empty mailAgence');
    }
  }

  if (isEmpty(secteurX3)) {
    secteurX3 = getXPathString('//@secteurX3');

    if (isEmpty(secteurX3)) {
      // TODO better error message
      errorMessages.push('empty secteurX3');
    }
  }

  if (isEmpty(rdvPris)) {
    rdvPris = getXPathString('//@rdvPris');

    if (isEmpty(rdvPris)) {
      // TODO better error message
      errorMessages.push('empty rdvPris');
    }
  }

  if (isEmpty(jobId)) {
    jobId = getXPathString('//@jobId');

    if (isEmpty(jobId)) {
      // TODO better error message
      errorMessages.push('empty jobId');
    }
  }

  if (isEmpty(ffaSession)) {
    ffaSession = getXPathString('//@ffaSession');

    if (isEmpty(ffaSession)) {
      // TODO better error message
      errorMessages.push('empty ffaSession');
    }
  }

  if (!isEmpty(errorMessages)) {
    return {
      errorMessage: errorMessages.join(', ')
    };
  }

  return {
    customerId,
    jobId,
    ffaSession,
    mailAgence,
    secteurX3,
    rdvPris
  }
}
