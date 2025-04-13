import { OTRM_CONNECTOR_PATH } from '../../constants';
// import { Auth } from '../../types';

// import { createSubmitRequestConfig, submitRequest } from '../utils/index';

// import { TimeSlotsResponse } from './types';

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

export async function fetchTimeSlots(config: {
  jobId: string;
  customerId?: string | null;
  startDate?: string;
  endDate?: string;
  periodStart?: string;
  withRequiredWorker: boolean;
  withPossibleWorker: boolean;
  auth: Auth
}): Promise<{
  "id": string,
  "status": string,
  "responses": Array<{
    "listResponses": Array<{
      "getTimeSlotsInformationsResponse": {
        "daySlotsInfos": {
          "daySlotsInfo": Array<{
            "slots": {
              "slotInfo": Array<{
                "period": {
                  // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
                  start: string;
                  // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
                  end: string;
                },
                "color": string,
                "travelTimeChange": number,
                "waitingTime": number,
                "newTourStarted": boolean,
                "respectProperty": boolean,
                "respectSector": boolean,
                "respectPreferedWorker": boolean,
                "bestSlot": boolean,
                "maxDeviationTime": number
              }>;
            } | null;
            "nonWorkingDay": boolean,
            "weeklyDayOff": boolean,
            "day": Date
          }>;
        },
        "periodsOnSameCustomer": null,
        "periodsForSlot": {
          "timePeriod": Array<{
            // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
            start: string;
            // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
            end: string;
          }>
        },
        "id": number,
        "status": string,
        "errorId": number,
        "errorMsg": string | null,
        "debugMsg": string | null,
        "synchronisationId": number | null,
        "displayWithSurbooking": string,
        "numberOfDaysToDisplay": number,
        "displayNoWorkingDay": boolean,
        "displaySectorIcon": boolean,
        "displayPropIcon": boolean,
        "displayPreferedWorkerIcon": boolean,
        "lockedJob": boolean,
        "singleSlotSelection": boolean,
        "heightProportionelle": boolean,
        "bestSlotPresentation": string,
        "corporateBooking": boolean,
        "numberOfSelectSlotForCorporateBooking": number,
        "duplicatedJobForCorporateBooking": boolean,
        "beforeScheduleCheck": null,
        "jobIsLocalized": false,
        "width": null,
        "widthForCorporateBookingTimeSlot": number,
        "requiredWorkers": null,
        "possibleWorkerIds": null,
        "settingSlotName": string,
        "displayFirstFreeSlot": boolean,
        "calendarToMoveToSlot": boolean
      }
    }>
  }>
}> {
  const submitRequestConfig = createSubmitRequestConfig(config.auth);

  const fetchTimeSlotsConfig = {
    period: {
      start: config.startDate,
      end: config.endDate
    },
    jobId: config.jobId,
    customerId: config.customerId,
    periodStart: config.periodStart,
    withRequiredWorker: config.withRequiredWorker,
    withPossibleWorker: config.withPossibleWorker
  };
  
  submitRequestConfig.requests = [{
    listRequests: [{
      getTimeSlotsInformations: fetchTimeSlotsConfig
    }]
  }];
  
  return await submitRequest(OTRM_CONNECTOR_PATH, submitRequestConfig); 
}

export function parseTimePeriods(response: {
  "id": string,
  "status": string,
  "responses": Array<{
    "listResponses": Array<{
      "getTimeSlotsInformationsResponse": {
        "daySlotsInfos": {
          "daySlotsInfo": Array<{
            "slots": {
              "slotInfo": Array<{
                "period": {
                  // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
                  start: string;
                  // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
                  end: string;
                },
                "color": string,
                "travelTimeChange": number,
                "waitingTime": number,
                "newTourStarted": boolean,
                "respectProperty": boolean,
                "respectSector": boolean,
                "respectPreferedWorker": boolean,
                "bestSlot": boolean,
                "maxDeviationTime": number
              }>;
            } | null;
            "nonWorkingDay": boolean,
            "weeklyDayOff": boolean,
            "day": Date
          }>;
        },
        "periodsOnSameCustomer": null,
        "periodsForSlot": {
          "timePeriod": Array<{
            // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
            start: string;
            // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
            end: string;
          }>
        },
        "id": number,
        "status": string,
        "errorId": number,
        "errorMsg": string | null,
        "debugMsg": string | null,
        "synchronisationId": number | null,
        "displayWithSurbooking": string,
        "numberOfDaysToDisplay": number,
        "displayNoWorkingDay": boolean,
        "displaySectorIcon": boolean,
        "displayPropIcon": boolean,
        "displayPreferedWorkerIcon": boolean,
        "lockedJob": boolean,
        "singleSlotSelection": boolean,
        "heightProportionelle": boolean,
        "bestSlotPresentation": string,
        "corporateBooking": boolean,
        "numberOfSelectSlotForCorporateBooking": number,
        "duplicatedJobForCorporateBooking": boolean,
        "beforeScheduleCheck": null,
        "jobIsLocalized": false,
        "width": null,
        "widthForCorporateBookingTimeSlot": number,
        "requiredWorkers": null,
        "possibleWorkerIds": null,
        "settingSlotName": string,
        "displayFirstFreeSlot": boolean,
        "calendarToMoveToSlot": boolean
      }
    }>
  }>
}) {
  if ('success' !== response.status) {
    throw Error(`TimeSlotsResponse | status: ${response.status} | ${response}`);
  }

  const timeSlotsInfoResponse = response.responses[0].listResponses[0].getTimeSlotsInformationsResponse;

  if ('error' === timeSlotsInfoResponse.status) {
    throw Error(`error: ${timeSlotsInfoResponse.errorMsg} | debug: ${timeSlotsInfoResponse.debugMsg}`);
  }

  if (!timeSlotsInfoResponse.periodsForSlot.timePeriod.length) {
    // TODO better error message
    throw Error('No available periods');
  }

  // return available time periods
  return timeSlotsInfoResponse.periodsForSlot.timePeriod;
}

export function convertDateToOptitimeFormat(date: Date) {
  function pad(number: number) {
    if ( number < 10 ) {
      return '0' + number;
    }
    return number;
  }

  return date.getFullYear() +
        '-' + pad( date.getMonth() + 1 ) +
        '-' + pad( date.getDate() ) +
        'T00:00:00';
}

export function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getOptitimeDateStringInXDays({ inXDays, fromDate } : {
  inXDays: number;
  fromDate: string;
}) {
  return convertDateToOptitimeFormat(addDays(new Date(fromDate), inXDays));
}