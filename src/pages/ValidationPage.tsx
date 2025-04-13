import isEmpty from 'lodash.isempty';
import React, { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { default as DefaultSkeleton } from 'react-loading-skeleton';
import {
  useHistory
} from "react-router-dom";
import { allowedCountries, getFormattedPhoneNumber, isValidPhoneNumber } from '../utils/phoneUtils';

import { FlexCenteredLogo as Logo } from '../components/Logo';
import { useConnectAndFetchCustomerSessionData } from '../hooks/useConnectAndFetchCustomerSessionData';
import { updateInfoCustomer } from '../utils/updateInfoCustomer';

import every from "lodash.every";
import values from "lodash.values";
import ReactGA from 'react-ga4';
import { useMount } from "react-use";
import { Modal } from "../components/Modal";
import { errorMessagesMap } from '../constants/errorMessages';

interface SkeletonProps {
  children?: any,
  count?: number,
  width?: string | number,
  height?: string | number,
  wrapper?: ReactNode,
  auto?: boolean
};

export const ValidationPage = () => {
  const history = useHistory();
  const [emailValidate, setEmailValidate] = useState(false);
  const [consentIsValidate, setConsentIsValidate] = useState(false);
  const [submitButtonType, setSubmitButtonType] = useState('disabled');
  const [ffaSession, setFfaSession] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [isFormDataLoaded, setIsFormDataLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorElement, setErrorElement] = useState<string | JSX.Element>('');
  const customerSessionData = useConnectAndFetchCustomerSessionData();
  const { register, setValue, handleSubmit, errors } = useForm();
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const activeCovidBanner = false;
  
  // TODO add automatic Skeleton calculation without providing height/width
  const Skeleton: FunctionComponent<SkeletonProps> = (props, loaded): any => {
    if (!props.children) {
      //TODO what to do when no children?
      return;
    }
  
    const skeleton = <DefaultSkeleton {...props} />

    return (isFormDataLoaded && props.children) || skeleton;
  };

  useMount(() => ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search }));

  useEffect(() => {
    if (emailValidate && consentIsValidate) {
      setSubmitButtonType('primary');
    } else {
      setSubmitButtonType('disabled');
    }
  }, [emailValidate, consentIsValidate]);

  useEffect(() => {
    if (every(values(customerSessionData), isEmpty)) {
      if (customerSessionData instanceof Error) {
        history.replace('/');
        return;
      }

      return;
    }

    if ('errorId' in customerSessionData) {
      setErrorElement(errorMessagesMap[customerSessionData.errorId || NaN]);
      return;
    }


    if ('customerId' in customerSessionData) setCustomerId( customerSessionData.customerId);
    if ('ffaSession' in customerSessionData) setFfaSession(customerSessionData.ffaSession);
    if ('customerEmail' in customerSessionData) {
      setValue('customerEmail', customerSessionData.customerEmail, true);
      setEmailValidate(true);
    }
    if ('customerPhone' in customerSessionData && undefined !== customerSessionData.customerPhone) {
      const formattedCustomerPhone = getFormattedPhoneNumber(customerSessionData.customerPhone);
      
      setValue(
        'customerPhone',
        formattedCustomerPhone,
        true
      );
    }

    if(!activeCovidBanner) {
      setConsentIsValidate(true);
    }

    setIsFormDataLoaded(true);
  }, [
    //useEffect dependencies
    customerSessionData,
    setValue,
    history,
    activeCovidBanner
  ]);

  const onSubmit = handleSubmit(async ({ customerEmail, customerPhone }) => {
    await updateInfoCustomer({
      customerId,
      ffaSession,
      newCustomerEmail: customerEmail,
      newCustomerPhone: customerPhone
    });

    if ('customerEmail' in customerSessionData) customerSessionData.customerEmail = customerEmail;
    if ('customerPhone' in customerSessionData) customerSessionData.customerPhone = customerPhone;

    history.push('/schedule', {
      customerSessionData
    });
  });

  // TODO specify any type
  const ProtocolAnchor = (props: any) => (
    <button
      className="link"
      data-toggle="modal"
      data-target="#consentProtocolModal"
      onClick={(event) => {
        event.stopPropagation(); 
        event.preventDefault();
        setShowModal(true);
      }
    }>
      {props.children}
    </button>
  );

  const renderValidationForm = () => {
    return (
      <div className="content-fluid">
        <div className="w-content">
            <div className="w-txt">
              <div className="h3 text-center">
                <Skeleton width={402}>Prise de rendez-vous en ligne</Skeleton>
              </div>
              {activeCovidBanner && (
                <>
                  <br/>
                  <p>
                    <Skeleton count={5}>
                      Avant de vérifier et compléter vos cordonnées ci-dessous,
                      nous vous demandons de prendre connaissance de notre{' '}
                      <ProtocolAnchor>protocole</ProtocolAnchor>{' '}
                      d’intervention sous COVID-19 (en cliquant sur le mot{' '}
                      <ProtocolAnchor>protocole</ProtocolAnchor>)
                      et de cocher la case pour acceptation.
                    </Skeleton>
                  </p>
                </>
              )}
            </div>
            <form data-animation="fade-up" data-delay="100">
              <div className="form-content">
                <div className="w-field w-field--required">
                  <Skeleton width={92.84}>
                    <label htmlFor="customer.email" className="w-field__label">
                      Adresse e-mail
                    </label>
                  </Skeleton>
                  <input
                    name="customerEmail"
                    type="text"
                    ref={register({
                      required: {
                        value: true,
                        message: 'Saisissez une adresse e-mail'
                      },
                      pattern: {
                        value: emailRegex,
                        message: 'Saisissez une adresse e-mail valide'
                      }
                    })}
                    onChange={(event) => {
                      const emailMatch = event.target.value.match(emailRegex);

                      if (emailMatch) {
                        setEmailValidate(true);
                      }
                      else {
                        setEmailValidate(false);
                      }
                    }}
                    placeholder="Votre adresse e-mail"
                    className="w-field__control"
                    style={{ display: isFormDataLoaded ? 'inherit' : 'none' }}
                  />
                  {isFormDataLoaded ? true : <DefaultSkeleton height={48} />}
                  {
                    errors.customerEmail
                    &&
                    <div className="w-field__message--error">
                      {errors.customerEmail.message}
                    </div>
                  }
                </div>
                <div className="w-field">
                  <Skeleton width={162.28}>
                    <label htmlFor="customerPhone" className="w-field__label">
                      N° de téléphone portable
                    </label>
                  </Skeleton>
                  <input
                    name="customerPhone"
                    type="text"
                    ref={register({
                      validate: value => {
                        if (!value.length) {
                          return true;
                        }
    
                        return isValidPhoneNumber(value);
                      }
                    })}
                    placeholder="Votre n° de téléphone portable"
                    className="w-field__control"
                    style={{ display: isFormDataLoaded ? 'inherit' : 'none' }}
                  />
                  {isFormDataLoaded ? true : <DefaultSkeleton height={48} />}
                  {
                    errors.customerPhone
                    &&
                    <div className="w-field__message--error">
                      Saisissez un numéro de téléphone valide dans
                      l'un des pays suivants : {allowedCountries.join(', ')}
                    </div>
                  }
                </div>

                {activeCovidBanner && (
                  <div className="w-field w-field--required">
                    <input
                      type="checkbox"
                      name="consent"
                      id="consent"
                      className="w-field__control"
                      onChange={ (event) => {
                        const checked = event.target.checked;

                        if (checked) {
                          setConsentIsValidate(true);
                        }
                        else {
                          setConsentIsValidate(false);
                        }
                      }}
                      style={{ display: isFormDataLoaded ? 'block' : 'none' }}
                    />
                    {isFormDataLoaded ? true : <DefaultSkeleton width={22} height={22} />}
                    <label
                      htmlFor="consent"
                      className="w-field__label"
                      style={{ display: isFormDataLoaded ? 'flex' : 'none' }}
                    >
                        <p>
                          J'accepte les conditions du{' '}
                          <ProtocolAnchor>protocole</ProtocolAnchor>{' '}
                          COVID-19 en vigueur chez Culligan France (obligatoire)             
                        </p>
                    </label>
                    {isFormDataLoaded ? true : <DefaultSkeleton width={365} count={2} />}
                  </div>
                )}

                <div className="w-field" id="btnvalid">
                  <Skeleton width={286.46} height={56}>
                    <div
                      className={`btn btn--${submitButtonType}`}
                      onClick={onSubmit}
                    >
                      Valider mes coordonnées
                    </div>
                  </Skeleton>
                </div>
              </div>
            </form>
          </div>
          {
            showModal
            &&
            activeCovidBanner
            &&
            <Modal onClose={() => setShowModal(false)}>
              {() => (
                <img
                src="/images/protocole-particuliers.jpg"
                alt="Protocole Covid-19 pour particuliers"
                style={{ width: '100%' }}
              />
              )}
            </Modal>
          }
      </div>
    );
  };

  function renderError() {
    return (
      <div className="content-fluid">
        <div className="w-content">
          <div className="w-txt">
            {errorElement}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--forms">
      <header>
        <Logo />
      </header>
      {errorElement ? renderError(): renderValidationForm()}
    </div>
  );
}
