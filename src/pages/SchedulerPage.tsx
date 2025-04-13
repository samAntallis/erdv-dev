import React, { useState, useEffect } from "react";
import {
  useHistory,
  useLocation
} from "react-router-dom";
import { useEffectOnce, useMount } from 'react-use';
import isEmpty from 'lodash.isempty';
import isNil from "lodash.isnil";

import { FlexCenteredLogo as Logo } from '../components/Logo';
import { ConfirmModal } from "../components/ConfirmModal";
import { fetchCustomerSlots, parseCustomerSlots } from "../Scheduler/CustomerSlot";

import { fetchTimeSlots as fetchTimePeriods, parseTimePeriods } from "../Scheduler/TimeSlots";

import { RefusalModal } from "../components/RefusalModal";
import { customLabels } from '../Scheduler/Labels';

import { useRefusal } from '../hooks/useRefusal';
import { useConfirmation } from '../hooks/useConfirmation';
import { useContentTitle } from "../hooks/useContentTitle";

import { fetchCustomerSession } from "../Scheduler/CustomerSession/index";

import { mockRemainingSlots } from "../mock/mockCustomerSession";


// import { sendEmail } from "../components/SendMail";


export const SchedulerPage = () => {
  const [, setIsLoading] = useState(true);
  const [confirmedSlot, setConfirmedSlot] = useState(false);
  const [customerSlots, setCustomerSlots] = useState<Array<{
    period: {
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      start: string;
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      end: string;
    };
    travelTimeChange: number;
    waitingTime: number;
    newTourStarted: boolean;
    respectProperty: boolean;
    respectSector: boolean;
    respectPreferedWorker: boolean;
    bestSlot: boolean;
    maxDeviationTime: number;
    color: string;
    label: string;
  }>>([]);

  const [isDefaultSlotScreen, setIsDefaultStateScreen] = useState(true);

  // remaining customer slots for other dates first other dates screen
  const [firstScreenFullFetched, setFirstScreenFullFetched] = useState(false);
  const [otherSlotsFirstScreenLoading, setOtherSlotsFirstScreenLoading] = useState(false);
  const [remainingSlots, setRemainingCustomerSlots] = useState<Array<{
    period: {
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      start: string;
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      end: string;
    };
    travelTimeChange: number;
    waitingTime: number;
    newTourStarted: boolean;
    respectProperty: boolean;
    respectSector: boolean;
    respectPreferedWorker: boolean;
    bestSlot: boolean;
    maxDeviationTime: number;
    color: string;
    label: string;
  }>>();
  const [loadCustomerSlots, setLoadOtherSlots] = useState(false);
  const [displayRemainingCustomerSlots, setDisplayRemainingCustomerSlots] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [currentTimePeriodIndex, setCurrentTimePeriodIndex] = useState(NaN);
  const [timePeriodsCount, setTimePeriodsCount] = useState(NaN);
  const [progressMessage, setProgressMessage] = useState('');
  const [remainingTimePeriods, ] = useState<Array<{
    start: string;
    end: string;
  }>>([]);
  const [refusalModalOpen, setRefusalModalOpen] = useState(false);
  const [refusal, setRefusal] = useState(false);
  const [confirmCustomerMessage, setConfirmCustomerMessage] = useState('');
  const [refusalCustomerMessage, setRefusalCustomerMessage] = useState('');
  const [defaultSlot, setDefaultSlot] = useState<{
    period: {
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      start: string;
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      end: string;
    };
    travelTimeChange: number;
    waitingTime: number;
    newTourStarted: boolean;
    respectProperty: boolean;
    respectSector: boolean;
    respectPreferedWorker: boolean;
    bestSlot: boolean;
    maxDeviationTime: number;
    color: string;
    label: string;
  }>();
  const [selectedSlot, setSelectedSlot] = useState<{
    period: {
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      start: string;
      // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
      end: string;
    };
    travelTimeChange: number;
    waitingTime: number;
    newTourStarted: boolean;
    respectProperty: boolean;
    respectSector: boolean;
    respectPreferedWorker: boolean;
    bestSlot: boolean;
    maxDeviationTime: number;
    color: string;
    label: string;
  }>();

  const [allSlotsLoaded, setAllSlotsLoaded] = useState(false);
  const contentTitle = useContentTitle(
    loadCustomerSlots,
    isDefaultSlotScreen,
    selectedSlot,
    progressMessage,
    customerSlots,
    customLabels,
  );

  const location = useLocation();
  // 🧪 Mode mock pour accéder directement à /schedule
  const useMock = process.env.REACT_APP_USE_MOCK === "true";
  const locationState = location.state as { customerSessionData: {
    customerId: string;
    jobId: string;  
    ffaSession: string;
    customerEmail: string;
    customerPhone: string;
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
  } };
  const [otherSlotsFirstScreenSlotsLoaded, setOtherDatesFirstScreenCustomerSlotsLoaded] = useState(false);
  const [remainingCustomerSlotsLoaded, setRemainingCustomerSlotsLoaded] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState<{
    id: number | undefined;
    clear: boolean;
  }>({ id: undefined, clear: false });

  const history = useHistory();
  useRefusal(refusal, refusalCustomerMessage);
  useConfirmation(confirmedSlot, confirmCustomerMessage, isDefaultSlotScreen, selectedSlot);

  useEffectOnce(() => {
      const timeoutDelay = 1200000; // 20 minutes
      const sessionId = setTimeout(() => {
        history.replace(`/validate/${locationState.customerSessionData.ffaSession}`);
      }, timeoutDelay) as unknown as number;
      setSessionTimeout({id: sessionId, clear: false});
  });

  useEffect(() => {
    if(sessionTimeout.id && sessionTimeout.clear) {
      clearTimeout(sessionTimeout.id);
      setSessionTimeout({ ...sessionTimeout, clear: false});
    }
  }, [sessionTimeout]);

  useMount(() => {
    if (firstScreenFullFetched || otherSlotsFirstScreenLoading) {
      return;
    }

    if (
      isEmpty(locationState) ||
      isEmpty(locationState.customerSessionData.ffaSession)
    ) {
      // redirect to login
      history.replace("/");
      return;
    }

    //fetch best slot
    if (isNil(locationState.customerSessionData.defaultCustomerSlot)) {

      const useMock = process.env.REACT_APP_USE_MOCK === 'true';
      if (useMock) {
        setProgressMessage("Recherche d'autres créneaux en cours...");
        setOtherSlotsFirstScreenLoading(true);


        setAllSlotsLoaded(true);
        setOtherDatesFirstScreenCustomerSlotsLoaded(true);
        setRemainingCustomerSlotsLoaded(true);
        setFirstScreenFullFetched(true);
        setLoadOtherSlots(false);
        setOtherSlotsFirstScreenLoading(false);
        return;
      }

      (async function getData() {

        try {
          await fetchCustomerSession(locationState.customerSessionData.ffaSession)
        }
        catch (error) {
          history.replace("/error");

          // const subject = "Erreur erdv (fetch CustomerSession)";
          // const sendTo = 'cuillandret@culligan.fr';
          // const htmlContent = "<html><head></head><body><p>ERREUR :</p><p>"+error+"</p><br/><p>DS : "
          // + locationState.customerSessionData.jobId+
          // "</p><p>N° client : "+locationState.customerSessionData.customerId+
          // "<p>Email : "+locationState.customerSessionData.customerEmail +
          // "</p><p>Phone : "+locationState.customerSessionData.customerPhone +
          // "</p><p>ffaSession : "+locationState.customerSessionData.ffaSession
          // + "</p></body></html>";
          // const ccAddresses = "louyera@culligan.fr";

          // sendEmail( sendTo, subject, htmlContent, ccAddresses);
        }

        try {
        const customerSlotResponse = await fetchCustomerSlots({
          ffaSession: locationState.customerSessionData.ffaSession,
          jobId: locationState.customerSessionData.jobId,
          actionCommand: 'undefined',
          notificationDate: null
        });

        const customerSlots = parseCustomerSlots(customerSlotResponse);
      
        //set best slot to default and selected
        setSelectedSlot(customerSlots[0]);
        setDefaultSlot(customerSlots[0]);
        setCustomerSlots(customerSlots);
        locationState.customerSessionData.defaultCustomerSlot = customerSlots[0];
        setIsLoading(false);
      }
      catch (error) {
        history.replace("/error");
        
        // const subject = "Erreur erdv (fetch CustomerSlots)";
        // const sendTo = 'cuillandret@culligan.fr';
        // const htmlContent = "<html><head></head><body><p>ERREUR :</p><p>"+error+"</p><br/><p>DS : "
        // + locationState.customerSessionData.jobId+
        // "</p><p>N° client : "+locationState.customerSessionData.customerId+
        // "<p>Email : "+locationState.customerSessionData.customerEmail +
        // "</p><p>Phone : "+locationState.customerSessionData.customerPhone +
        // "</p><p>ffaSession : "+locationState.customerSessionData.ffaSession
        // + "</p></body></html>";
        // const ccAddresses = "louyera@culligan.fr";

        // sendEmail( sendTo, subject, htmlContent, ccAddresses);
      }
      })();

      return;
    }
  });


  useEffect(() => {
    if (
      isEmpty(locationState) ||
      isEmpty(locationState.customerSessionData.ffaSession)
    ) {
      return;
    }

    if (displayRemainingCustomerSlots && !isNil(remainingSlots) && remainingSlots.length && !allSlotsLoaded) {
      setCustomerSlots([...customerSlots, ...remainingSlots]);
      setAllSlotsLoaded(true);
      return;
    }

    if (!loadCustomerSlots || otherSlotsFirstScreenLoading || otherSlotsFirstScreenSlotsLoaded) {
      return;
    }

        if (useMock) {
          setProgressMessage("Simulation de recherche de créneaux en cours...");
          setTimeout(() => {
            setCustomerSlots(prev => [...prev, ...mockRemainingSlots.map(slot => ({
              ...slot,
              travelTimeChange: 0,
              waitingTime: 0,
              newTourStarted: false,
              respectProperty: true,
              respectSector: true,
              respectPreferedWorker: false,
              bestSlot: false,
              maxDeviationTime: 0,
              color: "#FFA500"
            }))]);

            setOtherSlotsFirstScreenLoading(false);
            setOtherDatesFirstScreenCustomerSlotsLoaded(true);
            setFirstScreenFullFetched(true);
            setRemainingCustomerSlotsLoaded(true);
            setAllSlotsLoaded(true);
          }, 800);
          return;
        }


        (async function getData() {
      setProgressMessage('Recherche d\'autres créneaux en cours...');
      setOtherSlotsFirstScreenLoading(true);

      const timePeriodsResponse = await fetchTimePeriods({
        auth: { ffaSession: locationState.customerSessionData.ffaSession },
        jobId: locationState.customerSessionData.jobId,
        withRequiredWorker: false,
        withPossibleWorker: false,
      });

      const timePeriods = parseTimePeriods(timePeriodsResponse);

      if (!timePeriods || !Array.isArray(timePeriods) || !timePeriods.length) {
        // TODO no timePeriods
        throw Error('No time periods available');
      }

      if (isNil(locationState.customerSessionData.defaultCustomerSlot)) {
        // TODO
        return;
      }

      let timePeriodIndex = 0;
      let tmpCustomerSlots: Array<{
        period: {
          // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
          start: string;
          // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
          end: string;
        };
        travelTimeChange: number;
        waitingTime: number;
        newTourStarted: boolean;
        respectProperty: boolean;
        respectSector: boolean;
        respectPreferedWorker: boolean;
        bestSlot: boolean;
        maxDeviationTime: number;
        color: string;
        label: string;
      }> = [];
      const tmpRemainingCustomerSlots: Array<{
        period: {
          // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
          start: string;
          // date string ISO format yyyy-mm-ddThh:mm:ss (format used by Optitime)
          end: string;
        };
        travelTimeChange: number;
        waitingTime: number;
        newTourStarted: boolean;
        respectProperty: boolean;
        respectSector: boolean;
        respectPreferedWorker: boolean;
        bestSlot: boolean;
        maxDeviationTime: number;
        color: string;
        label: string;
      }> = [];
      setTimePeriodsCount(timePeriods.length);

      for (const timePeriod of timePeriods) {
        timePeriodIndex += 1;
        setCurrentTimePeriodIndex(timePeriodIndex);
        
        const customerSlotsResponse = await fetchCustomerSlots({
          actionCommand: "acceptedBestSlot",
          jobId: locationState.customerSessionData.jobId,
          notificationDate: timePeriod.start,
          ffaSession: locationState.customerSessionData.ffaSession
        });

        try {
          const currentPeriodCustomerSlots = parseCustomerSlots(customerSlotsResponse);
          
          currentPeriodCustomerSlots.forEach((customerSlot) => {
            if (customerSlot.label === defaultSlot?.label) {
              return;
            }

            if (tmpCustomerSlots.length < 5) {
              tmpCustomerSlots.push(customerSlot);
              return;
            }

            if (tmpCustomerSlots.length === 5) {
              setOtherDatesFirstScreenCustomerSlotsLoaded(true);
            }
            
            tmpRemainingCustomerSlots.push(customerSlot);
          });

          // setCustomerSlots is needed to update the UI each time
          // a time period (week) customer slots have been parsed
          if (defaultSlot) {
            setCustomerSlots([defaultSlot, ...tmpCustomerSlots]);
          } else {
            setCustomerSlots(tmpCustomerSlots);
          }
        } catch (error) {
            // const subject = "Erreur erdv (parse CustomerSlots)";
            // const sendTo = 'cuillandret@culligan.fr';
            // const htmlContent = "<html><head></head><body><p>ERREUR :</p><p>"+error+"</p><br/><p>DS : "
            // + locationState.customerSessionData.jobId+
            // "</p><p>N° client : "+locationState.customerSessionData.customerId+
            // "<p>Email : "+locationState.customerSessionData.customerEmail +
            // "</p><p>Phone : "+locationState.customerSessionData.customerPhone +
            // "</p><p>ffaSession : "+locationState.customerSessionData.ffaSession
            // + "</p></body></html>";
            // const ccAddresses = "cuillandret@culligan.fr";

            // sendEmail( sendTo, subject, htmlContent, ccAddresses);
          }
      }

      if (tmpRemainingCustomerSlots.length === 0) {
        setAllSlotsLoaded(true);
      }

      setOtherDatesFirstScreenCustomerSlotsLoaded(true);

      if (tmpRemainingCustomerSlots.length) {
        setOtherSlotsFirstScreenLoading(false);
        setFirstScreenFullFetched(true);
        setLoadOtherSlots(false);
      }
      
      setRemainingCustomerSlots(tmpRemainingCustomerSlots);
      setRemainingCustomerSlotsLoaded(true);
    })();
  },
  // Watch following variables so if any of these has changed, we run the hook
  [
    defaultSlot,
    loadCustomerSlots,
    displayRemainingCustomerSlots,
    remainingSlots,
    remainingTimePeriods,
    locationState,
    customerSlots,
    firstScreenFullFetched,
    otherSlotsFirstScreenLoading,
    allSlotsLoaded,
    otherSlotsFirstScreenSlotsLoaded,
    useMock
  ]);

  function openModal() {
    setConfirmModalOpen(true);
  }

  function openRefusalModal() {
    setRefusalModalOpen(true);
  }

  function getConfirmButtonClass() {
    if (selectedSlot) {
      return 'primary';
    }
    
    return 'disabled';
  }

  const renderScreenContent = () => {
    return (
      <>
        <div className="step custom-scrollbar full-width">
          <div className="step__content">
            <div className="w-txt">
              <div data-animation="fade-up" className={"title h3 " + ('Choisir une date :' === contentTitle? '': 'text-center')}>
                {contentTitle}
              </div>
            </div>
            <div className="answers">
              <ul>
                {customerSlots.map((customerSlot, index) => (
                  <li
                    key={index}
                    data-animation="fade-up"
                    data-delay="100"
                    className={`answer answer--check${
                      selectedSlot?.label === customerSlot.label ? ' checked' : ''
                    }${
                      isDefaultSlotScreen ? ' no-pointer' : ''
                    }${
                      (
                        !isDefaultSlotScreen &&
                        customerSlot.label === defaultSlot?.label
                      ) ? ' default-slot' : ''
                    }`}
                    onClick={(event) => {
                      if (isDefaultSlotScreen) {
                        return;
                      }
                      
                      if (selectedSlot?.label !== customerSlot.label) {
                        setSelectedSlot(customerSlot);
                        return;
                      }

                      setSelectedSlot(undefined);
                    }}
                  >
                    <div></div>
                    <p>{customerSlot.label}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {
          (isDefaultSlotScreen && (selectedSlot || customerSlots.length)) ||
          otherSlotsFirstScreenSlotsLoaded
          ? (
          <>
            <div className="w-btn">
              <div className={`btn btn--${getConfirmButtonClass()} full-width`} onClick={openModal}>
                OK, je confirme
              </div>
            </div>
            { isDefaultSlotScreen || (!allSlotsLoaded && otherSlotsFirstScreenSlotsLoaded && remainingCustomerSlotsLoaded) ? 
              <div className="w-btn">
                <div
                  className="btn btn--outline full-width"
                  onClick={() => {
                    setIsDefaultStateScreen(false);

                    if (isNil(remainingSlots)) {
                      setLoadOtherSlots(true);
                    } else {
                      setDisplayRemainingCustomerSlots(true);
                    }
                  }}
                >
                  Non, choisir une autre date
                </div>
              </div> : <></>
            }
            {
              !isDefaultSlotScreen &&
              !remainingCustomerSlotsLoaded &&
              (!isNaN(currentTimePeriodIndex) && !isNaN(timePeriodsCount)) ?
              <div className="w-btn">
                <div
                  className="btn full-width"
                >
                  {`Recherche de créneaux restants... ${currentTimePeriodIndex}/${timePeriodsCount}`}
                </div>
              </div>
              : <></>
            }
            
            {(!isNil(remainingSlots) && !remainingSlots.length)  || allSlotsLoaded ?
              <div className="w-btn">
                <div
                  className="btn btn--outline full-width"
                  onClick={openRefusalModal}
                >
                  Je refuse tous les rendez-vous
                </div>
              </div> : <></>
            }
          </>
        ): <></> }
        {!isDefaultSlotScreen && !otherSlotsFirstScreenSlotsLoaded &&
          <div className="overlay">
            <div className="overlay__inner">
                <div className="overlay__content"><span className="spinner"></span></div>
            </div>
          </div>
        }
      </>
    );
  };

  return (
    <>
      <div className="page page--forms">
        <header>
          <Logo />
        </header>
        <div className="content-fluid">
          <div className="w-content">
            {renderScreenContent()}  
          </div>
        </div>
      </div>
      {confirmModalOpen && selectedSlot &&
        <ConfirmModal
          dateLabel={selectedSlot.label}
          onConfirm={({ customMessage }) => {
            setSessionTimeout({ ...sessionTimeout, clear: true});;
            setConfirmCustomerMessage(customMessage);
            setConfirmedSlot(true);
          }}
          onClose={() => setConfirmModalOpen(false)}
        />
      }
      {refusalModalOpen ?
        <RefusalModal
          onClose={() => setRefusalModalOpen(false)}
          onConfirm={({ customMessage }) => {
            setSessionTimeout({ ...sessionTimeout, clear: true});
            setRefusalCustomerMessage(customMessage);
            setRefusal(true);
          }}
        /> : <></>
      }
    </>
  );
}