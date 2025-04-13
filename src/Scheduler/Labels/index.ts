import isEmpty from "lodash.isempty";
import isNil from "lodash.isnil";
import { OTRM_CONNECTOR_PATH } from '../../constants';
import { LabelsResponse } from './types';
// import { createSubmitRequestConfig, submitRequest } from '../utils/index';

interface CredentialsAuth {
  login: string;
  password: string;
};

interface FfaSessionAuth {
  ffaSession: string;
};
type Auth = FfaSessionAuth | CredentialsAuth;

async function submitRequest(url: string, submitRequestConfig: {}) {
  const response = await fetch(`${url}?submitRequest=${JSON.stringify(submitRequestConfig)}`);

  if (!response.ok) {
    // TODO handle error
    throw Error(`Response error code: ${response.statusText}`);
  }      

  return await response.json();
}

function createSubmitRequestConfig(auth: Auth) {
  return {
    "service": "businessService",
    // "mode": undefined,
    // "clientLocale": undefined,
    "ffaSession": 'ffaSession' in auth ? auth.ffaSession : undefined,
    "sessionLogin": 'login' in auth ? auth.login : undefined,
    "sessionPassword": 'password' in auth ? auth.password : undefined,
    "requests": {}
  };
}

export const customLabels: {
  [key: string]: string
} = {
  slotConfirm: 'Votre technicien interviendra :',
  slotTaken: 'Vous avez reservé ce rendez-vous :'
};

export async function fetchLabels(auth: Auth): Promise<LabelsResponse> {

  const submitRequestConfig = createSubmitRequestConfig(auth);

  //TODO internationalization
  const browserLocale = 'fr';
  // if (navigator.language) {
  //   browserLocale = navigator.language.substring(0, 2);
  // } else if (navigator.userLanguage) {
  //   browserLocale = navigator.userLanguage.substring(0, 2);
  // }

  const getStringsDefaultConfig = {
    profile: 'all',
    language: browserLocale,
    full: true,
    replaceBusinessWords: true
  };

  const getStringsLabel = {
    id: 0,
    module: 'labels.flexPlanning',
    ...getStringsDefaultConfig
  };

  const getStringsEnum = {
    id: 1,
    module: 'labels.flexPlanning',
    ...getStringsDefaultConfig
  };

  const getStringsSlot = {
    id: 2,
    module: 'labels',
    ...getStringsDefaultConfig
  };

  submitRequestConfig.requests = [{
    listRequests: [
      { getStrings: getStringsLabel },
      { getStrings: getStringsEnum },
      { getStrings: getStringsSlot }
    ]
  }];

  // TODO : test a failing request
  return await submitRequest(OTRM_CONNECTOR_PATH+'/json', submitRequestConfig);
}

export function parseLabels(labelsResponse: LabelsResponse) : {
  [key: string]: string
} {
  if (isNil(labelsResponse) || isEmpty(labelsResponse)) {
    // TODO handle error
    throw Error('No labelsResponse');
  }

  if ('success' !== labelsResponse.status) {
    // TODO handle error
    throw Error(`labelsResponse.status: ${labelsResponse.status}`);
  }

  const listResponses = labelsResponse.responses[0].listResponses;
  const labels: {
    [key: string]: string
  } = {};

  listResponses.forEach(listResponse => {
    const stringResponse = listResponse.getStringsResponse;

    if ('error' === stringResponse.status) {
      // TODO handle error
      throw Error(`error: ${stringResponse.errorMsg} | debug: ${stringResponse.debugMsg}`);
    }
    
    stringResponse.strings.appString.forEach(appStringConfig => {
      if (!isEmpty(appStringConfig.value)) {
        labels[appStringConfig.key] = appStringConfig.value;
        return;
      }

      labels[appStringConfig.key] = appStringConfig.defaultValue;
    });

    // overwrite fetched labels with static custom defined labels
    if (!isNil(customLabels)) {
      Object.entries(customLabels).forEach(([customLabel, customLabelValue]) => {
        labels[customLabel] = customLabelValue;
      });
    }
  });

  return labels;
}