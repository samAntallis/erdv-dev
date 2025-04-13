import { OTRM_REST_CONNECTOR_PATH } from '../../constants';
// import { FetchCustomerSlotParams as FetchCustomerSlotsParams, CustomerSlotResponse as CustomerSlotsResponse, CustomerSlot } from './types';

interface CustomerSlot {
  period: TimePeriod;
  color: string;
  travelTimeChange: number;
  waitingTime: number;
  newTourStarted: boolean;
  respectProperty: boolean;
  respectSector: boolean;
  respectPreferedWorker: boolean;
  bestSlot: boolean;
  maxDeviationTime: number;
  label: string;
};

// import { submitRestJsonRequest } from '../utils/index';
// import { TimePeriod } from '../TimeSlots/types';

interface TimePeriod {
  // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
  start: string;
  // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
  end: string;
};

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

// let timeSlotsInformationDataResponse;
// let vocabulary = {};
// let period = {};
// let indexListInperiodSlot;
// let cacheAllDayToDisplayList = {};
// let itemSelected = [];
// let nodeSelected = [];
// let singleSlotSelection;
// let mapDayItems = {};
// let timestamp = { value: ""};
// let inputText;
// let jobId;
// let customerSlotResponseSlotsInfos: Array<{}> | null = null;
// let firstDislay = true;
// let firstFullSlotRequest = true;
// let indexFin 	= 0;
// let startIndex	= 0;
// let index		= 0;
// let nextCalendar = null;
// let visibleSlotRadioButtons = 0;
// let bestSlotInfo;
//TODO enable change slotPacketSize from url or params
// let slotPacketSize = 5;
// let canSearchNext = true;

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
      "period": TimePeriod,
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
function getCustomerSlotLabel(period: TimePeriod): string {
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
      "period": TimePeriod,
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
    throw Error('No slots available');
  }

  const slotInfo = customerSlotsResponse.slotsInfos.slotInfo;

  return slotInfo.map((slotInfoData): CustomerSlot => {
    return {
      period: slotInfoData.period,
      color: slotInfoData.color,
      travelTimeChange: slotInfoData.travelTimeChange,
      waitingTime: slotInfoData.waitingTime,
      newTourStarted: slotInfoData.newTourStarted,
      respectProperty: slotInfoData.respectProperty,
      respectSector: slotInfoData.respectSector,
      respectPreferedWorker: slotInfoData.respectPreferedWorker,
      bestSlot: slotInfoData.bestSlot,
      maxDeviationTime: slotInfoData.maxDeviationTime,
      label: getCustomerSlotLabel(slotInfoData.period)
    };
  });
}