import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useContentTitle(
  loadCustomerSlots: boolean,
  isDefaultDateScreen: boolean,
  selectedCustomerSlot: {
    period: {
        start: string;
        end: string;
    };
    label: string;
  } | undefined,
  progressMessage: string,
  customerSlots: Array<{
    period: {
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      start: string;
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      end: string;
    };
    label: string;
  }>,
  customLabels: {
    [key: string]: string
  }
) {
  const [contentTitle, setContentTitle] = useState('');

  const location = useLocation();
  const locationState = location.state as { customerSessionData: {
  customerId: string;
  jobId: string;  
  ffaSession: string;
  mailAgence: string;
  secteurX3: string;
  rdvPris: string;
} };

  useEffect(() => {
    if (!isDefaultDateScreen && customerSlots.length) {
      setContentTitle('Choisir une date :');
    }

    if (loadCustomerSlots) {
        setContentTitle(progressMessage);
    } else if (selectedCustomerSlot) {
      if (1 === customerSlots.length) {
        setContentTitle(customLabels.slotConfirm);

        if (locationState.customerSessionData.rdvPris === 'true') {
          setContentTitle(customLabels.slotTaken);
        }
      } else {
        setContentTitle('Choisir une date :');
      }
    }
  }, [
    loadCustomerSlots,
    isDefaultDateScreen,
    selectedCustomerSlot,
    progressMessage,
    customerSlots,
    customLabels,
    locationState
  ]);

  return contentTitle;
}