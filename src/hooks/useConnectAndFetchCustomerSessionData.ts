import { useState } from "react";
import { useEffectOnce } from "react-use";
import {
  useLocation,
  useParams
} from "react-router-dom";
import isEmpty from 'lodash.isempty';

import { connectAndFetchCustomerDataInternal } from '../utils/connectAndFetchCustomerSessionDataInternal';
import { mockCustomerSessionData } from "../mock/mockCustomerSession";
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

// 🎯 Mise à jour du mock pour simuler plusieurs choix de créneaux
mockCustomerSessionData.defaultCustomerSlot = {
  period: {
    start: "2025-04-10T09:00:00",
    end: "2025-04-10T11:00:00"
  },
  label: "Jeudi 10 Avril entre 9h et 11h"
};

(mockCustomerSessionData as CustomerSessionData).customerSlots = [
  mockCustomerSessionData.defaultCustomerSlot,
  {
    period: {
      start: "2025-04-10T13:00:00",
      end: "2025-04-10T15:00:00"
    },
    label: "Jeudi 10 Avril entre 13h et 15h"
  },
  {
    period: {
      start: "2025-04-11T10:00:00",
      end: "2025-04-11T12:00:00"
    },
    label: "Vendredi 11 Avril entre 10h et 12h"
  },
  {
    period: {
      start: "2025-04-11T14:00:00",
      end: "2025-04-11T16:00:00"
    },
    label: "Vendredi 11 Avril entre 14h et 16h"
  }
];

// 🧪 Créneaux supplémentaires simulés quand on clique sur "autres dates"
export const mockRemainingSlots: CustomerSlot[] = [
  {
    period: {
      start: "2025-04-14T09:00:00",
      end: "2025-04-14T11:00:00"
    },
    label: "Lundi 14 Avril entre 9h et 11h"
  },
  {
    period: {
      start: "2025-04-14T13:00:00",
      end: "2025-04-14T15:00:00"
    },
    label: "Lundi 14 Avril entre 13h et 15h"
  },
  {
    period: {
      start: "2025-04-15T10:00:00",
      end: "2025-04-15T12:00:00"
    },
    label: "Mardi 15 Avril entre 10h et 12h"
  }
];

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
        console.log("✅ Utilisation du mock de session");
        setCustomerSessionData(mockCustomerSessionData);
        return;
      }
      if (!isEmpty(urlParams)) {
        setCustomerSessionData(await connectAndFetchCustomerDataInternal(urlParams));
        return;
      }
      else if (!isEmpty(locationState)) {
        setCustomerSessionData(await connectAndFetchCustomerDataInternal(locationState));
        return;
      }

      setCustomerSessionData({ errorMessage: 'Could not fetch Customer session data' });
    })();
  });

  return customerSessionData;
};