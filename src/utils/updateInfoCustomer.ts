import { oneLine } from 'common-tags';
import {
  getXPathString,
  getXPathBoolean
} from './xpath';
import { WS_REQUEST_PATH } from '../constants';

type UpdateInfoCustomerParam = {
  ffaSession: string,
  customerId: string,
  newCustomerEmail: string,
  newCustomerPhone?: string
};

export const updateInfoCustomer = async ({
                                           ffaSession,
                                           customerId,
                                           newCustomerEmail,
                                           newCustomerPhone
                                         } : UpdateInfoCustomerParam) => {

  const useMock = process.env.REACT_APP_USE_MOCK === 'true';
  if (useMock) {
    console.log('🧪 MOCK - updateInfoCustomer appelé avec :', {
      ffaSession,
      customerId,
      newCustomerEmail,
      newCustomerPhone
    });

    // on simule un petit délai réseau
    await new Promise(res => setTimeout(res, 300));

    return ''; // ou return { success: true } si tu préfères
  }

  // 🛠 Requête réelle (production)
  const updateInfoCustomerXML = oneLine`
    <updateInfoCustomer
      ffaSession='${ffaSession}' 
      userId='${customerId}'
      mail='${newCustomerEmail}' 
      phone='${newCustomerPhone}'      
    />
  `;

  const response = await fetch(WS_REQUEST_PATH + updateInfoCustomerXML);
  if (!response.ok) {
    console.log(response);
    throw Error(`Response error code: ${response.statusText}`);
  }

  const responseText = await response.text();
  const responseXML = (new DOMParser()).parseFromString(responseText, "text/xml");

  const isSuccess = getXPathBoolean(responseXML, "//@status='success'");
  if (!isSuccess) {
    throw Error(getXPathString(responseXML, '//@errorMsg'));
  }

  return '';
};
