import isEmpty from "lodash.isempty";
import { OTRM_REST_CONNECTOR_PATH } from '../../constants';
import { CustomerSessionInfo } from './types';
// import { submitRestJsonRequest } from '../utils/index';

async function submitRestJsonRequest(config : { url: string, data: {}}) {
  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config.data)
  });

  if (!response.ok) {
    // TODO handle error
    throw Error(`Response error code: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchCustomerSession(ffaSession: string): Promise<CustomerSessionInfo> {
  return await submitRestJsonRequest({
    url: `${OTRM_REST_CONNECTOR_PATH}/finalCustomer/json/checkCustomerSession.json`,
    data: {
      "id": "0",
      "sessionId": ffaSession
    }
  });
}

export function parseCustomerSessionResponse(customerSessionInfo: CustomerSessionInfo) {
  const { status, errorMsg, customerInformations } = customerSessionInfo;

  if ('success' !== status) {
    throw Error(`parseCustomerSession - error status: ${status}: ${errorMsg}`);
  }

  if (isEmpty(customerInformations)) {
    //TODO handle error
    throw Error('No customer Information');
  }

  //use customerInformations.address data

  const { jobId } = customerInformations;

  if (isEmpty(jobId)) {
    //TODO handle error
    throw Error('No jobId');
  }

  return { jobId };
}