import { oneLine } from 'common-tags';
import isEmpty from 'lodash.isempty';
import {
  getXPathFrom
} from './xpath';
import { OTRMS_REQUEST_PATH } from '../constants';

export const fetchCustomerData = async (customerId: string, ffaSession: string) => {
  // setIsLoading(true);

  const selectCustomerXML = oneLine`
    <?xml version='1.0' encoding='UTF-8'?> 
    <submitRequests  
      service='businessService'
      mode='ignoreErrorsOrFails'  
      locale='fr' 
      ffaSession='${ffaSession}' 
    > 
      <requests> 
        <selectCustomer id='0'> 
          <customerIds> 
            <value>${customerId}</value> 
          </customerIds> 
        </selectCustomer> 
      </requests> 
    </submitRequests>
  `;

    const response = await fetch(OTRMS_REQUEST_PATH + selectCustomerXML);
    if (!response.ok) {
      return {
        errorMessage: `Response error code: ${response.statusText}`
      };
    }

    const responseText = await response.text();
    const responseXML = (new DOMParser()).parseFromString(responseText, "text/xml");

    const { getXPathString, getXPathBoolean, getXPathNumber } = getXPathFrom(responseXML);

    const isSuccess = getXPathBoolean("//selectCustomerResponse/@status='success'");       
    if (!isSuccess) {
      return {
        errorMessage: getXPathString('//@errorMsg')
      };
    }

    const customerCount = getXPathNumber('count(//customer)');
    if (customerCount !== 1) {
      //TODO better error message
      return {
        errorMessage: 'customerCount !== 1, erreur à définir'
      };
    }

    const customerPhone = getXPathString('//customer/@phone');
    const customerEmail = getXPathString('//customer/@mailAdress');
    const customerPostalCode = getXPathString('//customer/address/@postalCode');
    const customerCity = getXPathString('//customer/address/@city');
    const errorMessages: string[] = [];

    if (isEmpty(customerPhone)) {
      //TODO better error message
      errorMessages.push('customerPhone empty');
    }

    if (isEmpty(customerEmail)) {
      //TODO better error message
      errorMessages.push('customerEmail empty');
    }

    if (!isEmpty(errorMessages)) {
      return {
        errorMessage: errorMessages.join(', ')
      };
    }

    return {
      customerEmail,
      customerPhone,
      customerPostalCode,
      customerCity
    }
};