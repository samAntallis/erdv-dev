// import { Auth, FfaSessionAuth } from '../../types';

// import { fetchLabels } from '../Labels';
// import { fetchCustomerSession, parseCustomerSessionResponse } from '../CustomerSession';
import isEmpty from 'lodash.isempty';
// import { CustomerSessionInfo } from '../CustomerSession/types';
import { OTRM_REST_CONNECTOR_PATH, OTRM_CONNECTOR_PATH } from '../../constants';
// import { TimeSlotsResponse, TimePeriod } from '../TimeSlots/types';
// import { CustomerSlot } from '../CustomerSlot/types';


interface CustomerSlot {
  period: {
    // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
    start: string;
    // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
    end: string;
  };
  label: string;
};

interface CredentialsAuth {
  login: string;
  password: string;
};

interface FfaSessionAuth {
  ffaSession: string;
};

type Auth = FfaSessionAuth | CredentialsAuth;

interface CredentialsAuth {
  login: string;
  password: string;
};

interface FfaSessionAuth {
  ffaSession: string;
};


interface CustomerSlot {
  period: {
    // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
    start: string;
    // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
    end: string;
  };
  label: string;
};

export async function fetchCustomerSession(ffaSession: string): Promise<{
  id: number;
  status: string;
  jobId: number | null;
  errorId: number;
  errorMsg: string | null;
  debugMsg: string | null;
  synchronisationId: string;
  customerInformations: {
    address: {
      number: null;
      street: string;
      streetComplement: string | null;
      postalCode: number;
      city: string;
      cityComplement: string;
      locality: string;
      country: string;
      state: string;
      latitude: number;
      longitude: number;
      degradation: string;
      geocodingType: string;
      score: number;
      initialAddress: string | null;
    };
    customerLogin: string; // email
    customerName: string;
    customerLanguage: string;
    workerId: string | null;
    jobId: string
  };  
}> {
  return await submitRestJsonRequest({
    url: `${OTRM_REST_CONNECTOR_PATH}/finalCustomer/json/checkCustomerSession.json`,
    data: {
      "id": "0",
      "sessionId": ffaSession  
    }
  });
}

function parseCustomerSessionResponse(customerSessionInfo: {
  id: number;
  status: string;
  jobId: number | null;
  errorId: number;
  errorMsg: string | null;
  debugMsg: string | null;
  synchronisationId: string;
  customerInformations: {
    address: {
      number: null;
      street: string;
      streetComplement: string | null;
      postalCode: number;
      city: string;
      cityComplement: string;
      locality: string;
      country: string;
      state: string;
      latitude: number;
      longitude: number;
      degradation: string;
      geocodingType: string;
      score: number;
      initialAddress: string | null;
    };
    customerLogin: string; // email
    customerName: string;
    customerLanguage: string;
    workerId: string | null;
    jobId: string
  };  
}) {
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


// import { fetchTimeSlots, parseTimePeriods } from '../TimeSlots';

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

// import { fetchCustomerSlots, parseCustomerSlots } from '../CustomerSlot';

const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
};

export async function fetchCustomerSlots(params: {
  ffaSession: string;
  jobId: string;
  actionCommand: string;
  notificationDate: Date | string | null;
}): Promise<{
  "slotsInfos": {
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
    }>
  },
  "id": number,
  "status": string,
  "nextPeriod": string | null,
  "errorId": number,
  "errorMsg": string | null,
  "debugMsg": string | null,
  "synchronisationId": string
}> {
const fetchCustomerSlotConfig = {
  "id": "0",
  "sessionId": params.ffaSession, 
  "actionCommand": params.actionCommand,
  "jobId": params.jobId,
  "notificationDate": params.notificationDate
};

return await submitRestJsonRequest({
  url: `${OTRM_REST_CONNECTOR_PATH}/finalCustomer/json/getCustomerSlot.json`,
  data: fetchCustomerSlotConfig
});
}

// TODO is 13:00 - 20:00 static for afternoon period?
const AFTERNOON_PERIOD_START_HOUR = 13;
// const AFTERNOON_PERIOD_END_HOUR = 20;

function isAfternoonPeriod(periodStart: Date) {
  return periodStart.getHours() >= AFTERNOON_PERIOD_START_HOUR;
  // return AFTERNOON_PERIOD_START_HOUR === period.start.getHours() &&
  //        AFTERNOON_PERIOD_END_HOUR === period.end.getHours(); 
}

// TODO is 06:00 - 12:59 static for morning?
// const MORNING_PERIOD_START_HOUR = 6;
// const MORNING_PERIOD_END_HOUR = '12:59';

// function isMorningPeriod(period: {
//   start: Date,
//   end: Date
// }) {
//   return MORNING_PERIOD_START_HOUR === period.start.getHours() &&
//          MORNING_PERIOD_END_HOUR === `${period.end.getHours()}:${period.end.getMinutes()}`
// }

const labels = {
  period: {
    morning: 'entre 8h et 13h',
    afternoon : 'entre 13h et 17h'
  },
  separators: {
    hourMinute: 'h'
  }
};

// function isValidDate(date: Date): date is Date {
//   return !isNaN(date.valueOf());
// }


// TODO better period handling
function getCustomerSlotLabel(period: {
  // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
  start: string;
  // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
  end: string;
}): string {
  const periodStart = new Date(period.start);
  const periodStartDateLabel = periodStart.toLocaleDateString(navigator.language, dateOptions);

  let dayTimeLabel;

  if (isAfternoonPeriod(periodStart)) {
    dayTimeLabel = labels.period.afternoon;
  } else {
    dayTimeLabel = labels.period.morning;
  }

  return periodStartDateLabel + ' ' + dayTimeLabel;
}

export function parseCustomerSlots(customerSlotsResponse: {
  "slotsInfos": {
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
    }>
  },
  "id": number,
  "status": string,
  "nextPeriod": string | null,
  "errorId": number,
  "errorMsg": string | null,
  "debugMsg": string | null,
  "synchronisationId": string
}): Array<CustomerSlot> {
  const { status, errorMsg } = customerSlotsResponse;

  if ('success' !== customerSlotsResponse.status) {
    //TODO handle error
    throw Error(`parseCustomerSession - error status: ${status}: ${errorMsg}`);
  }

  if (!customerSlotsResponse.slotsInfos) {
    // TODO use case No slots available for this date
    // example empty data 
    // {"slotsInfos":null,"id":0,"status":"success","nextPeriod":"2020-06-28T00:00:00","errorId":0,"errorMsg":null,"debugMsg":null,"synchronisationId":null}
    
    // if (canSearchNext) {
		// 	search();
		// } else {
		// 	deleteSlotRadioButtons();
		// 	createSlotRadioButtons(startIndex);						
    // }
    throw Error('No slots available');
  }

  const slotInfo = customerSlotsResponse.slotsInfos.slotInfo;

  return slotInfo.map((slotInfoData): CustomerSlot => {
    return {
      period: slotInfoData.period,
      label: getCustomerSlotLabel(slotInfoData.period)
    };
  });
}



export async function submitRequest(url: string, submitRequestConfig: {}) {
  const response = await fetch(`${url}?submitRequest=${JSON.stringify(submitRequestConfig)}`);

  if (!response.ok) {
    // TODO handle error
    throw Error(`Response error code: ${response.statusText}`);
  }      

  return await response.json();
}

export async function submitRestJsonRequest(config : { url: string, data: {}}) {
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

export function createSubmitRequestConfig(auth: Auth) {
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

export async function getSchedulerData(auth: FfaSessionAuth) {
  // const labelsResponse = await fetchLabels(auth);
  // const labels = parseLabels(labelsResponse);
  
  const customerSessionInfoResponse = await fetchCustomerSession(auth.ffaSession);
  const { jobId } = parseCustomerSessionResponse(customerSessionInfoResponse);

  const timeSlotsResponse = await fetchTimeSlots({
    auth,
    jobId,
    customerId: undefined,
    startDate: undefined,
    endDate: undefined,
    periodStart: undefined,
    withRequiredWorker: false,
    withPossibleWorker: false,
  });

  parseTimePeriods(timeSlotsResponse);

  const customerSlotResponse = await fetchCustomerSlots({
    ffaSession: auth.ffaSession,
    jobId,
    actionCommand: 'undefined',
    notificationDate: null
  });

  return parseCustomerSlots(customerSlotResponse);
}

