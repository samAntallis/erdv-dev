import { useState } from "react";
import { useEffectOnce } from "react-use";
import {
  useLocation,
  useParams
} from "react-router-dom";
import isEmpty from 'lodash.isempty';

import { connectAndFetchCustomerDataInternal } from '../utils/connectAndFetchCustomerSessionDataInternal';
import { mockCustomerSessionData } from '../mock/mockCustomerSession';

// import { LoginLocationState, AutoLoginUrlParams, CustomerSessionData, ErrorResult } from '../types';

interface CustomerSlot {
  period: {
    // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
    start: string;
    // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
    end: string;
  };
  label: string;
};

interface ErrorResult {
  errorId?: number;
  errorMessage?: any;
} 

interface LoginLocationState {
  customerId: string;
  jobId: string;
  mailAgence: string;
  secteurX3: string;
  rdvPris: string;
};

interface AutoLoginUrlParams {
  ffaSession: string;
};

interface CustomerSessionData {
  customerId: string;
  jobId: string;  
  ffaSession: string;
  mailAgence: string;
  secteurX3: string;
  rdvPris: string;
  customerEmail?: string;
  customerPhone?: string;
  timePeriods?: Array<{ start: string, end: string }>;
  defaultCustomerSlot?: CustomerSlot;
  customerSlots?: Array<CustomerSlot>;
  confirmedCustomerSlot?: CustomerSlot;
};

export const useConnectAndFetchCustomerSessionData = (): CustomerSessionData | ErrorResult => {
  // when coming from /login/ path
  const locationState = useLocation<LoginLocationState>().state;
  // when coming from /login/:ffaSession path
  const urlParams = useParams<AutoLoginUrlParams>();
  
  const [customerSessionData, setCustomerSessionData] = useState<CustomerSessionData | ErrorResult>({
    customerId: '',
    jobId: '',
    ffaSession: '',
    mailAgence: '',
    secteurX3: '',
    rdvPris: '',
    customerEmail: '',
    customerPhone: ''
  });

  useEffectOnce(() => {
    (async function connectAndFetchCustomerSessionData() {
      const useMock = process.env.REACT_APP_USE_MOCK === 'true';

      if (useMock) {
        console.log("✅ Mode mock activé - données de session injectées");
        setCustomerSessionData(mockCustomerSessionData);
        return;
      }

      if (!isEmpty(urlParams)) {
        setCustomerSessionData(await connectAndFetchCustomerDataInternal(urlParams));
        return;
      }

      if (!isEmpty(locationState)) {
        setCustomerSessionData(await connectAndFetchCustomerDataInternal(locationState));
        return;
      }

      setCustomerSessionData({ errorMessage: 'Could not fetch Customer session data' });
    })();
  });


  return customerSessionData;
};