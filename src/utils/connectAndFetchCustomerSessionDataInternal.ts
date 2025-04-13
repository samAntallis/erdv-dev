import { connect } from './connect';
import { fetchCustomerData } from './fetchCustomerData';
// import { LoginLocationState, AutoLoginUrlParams, CustomerSessionData, ErrorResult } from '../types';



interface ErrorResult {
  errorId?: number;
  errorMessage?: any;
} 

interface LoginLocationState {
  customerId: string;
  jobId: string;  
};

interface AutoLoginUrlParams {
  ffaSession: string;
};

export const connectAndFetchCustomerDataInternal = async (
  connectParams: LoginLocationState | AutoLoginUrlParams
) : Promise<{
  customerId: string;
  jobId: string;  
  ffaSession: string;
  mailAgence: string;
  secteurX3: string;
  rdvPris: string;
  customerEmail?: string;
  customerPhone?: string;
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
} | ErrorResult> => {
  
  const connectResponse = await connect(connectParams);

  if ('errorMessage' in connectResponse) {
    return connectResponse;
  }

  const fetchCustomerDataResponse = await fetchCustomerData(
    connectResponse.customerId,
    connectResponse.ffaSession
  );
  
  return {
    ...fetchCustomerDataResponse,
    ...connectResponse    
  }
};