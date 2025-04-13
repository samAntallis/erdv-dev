import React from "react";
import {
  useHistory
} from "react-router-dom";
import { useForm } from 'react-hook-form';
import { FlexCenteredLogo as Logo } from '../components/Logo';
import { ErrorIcon } from '../components/ErrorIcon';
import { TimerIcon } from '../components/TimerIcon';

type LoginFormData = {
  customerId: string;
  jobId: string;
};

export const LoginPage = (props: any) => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<LoginFormData>();

  const onSubmit = handleSubmit(async (props) => {
    history.push("/validate", props);
  });

  const renderLogin = () => {
    return (
      <div className="content-fluid">
        <div className="w-content">
          <div className="w-txt">
            <div className="h3">Prise de rendez-vous en ligne</div>
            <p>
              Effectuez votre demande en moins d’une minute
              <TimerIcon />
            </p>
          </div>
          <form data-animation="fade-up" data-delay="100">
            <div className="form-content">
              <div className="w-field w-field--required">
                <label className="w-field__label">N° de client</label>
                <input
                  name="customerId"
                  type="text"
                  ref={register({
                    required: {
                      value: true,
                      message: 'Saisissez votre n° de client'
                    }
                  })}
                  placeholder="Votre n° de client"
                  className="w-field__control"
                />              
                {
                  errors.customerId
                  &&
                  <div className="w-field__message--error">
                    <ErrorIcon style={{ marginRight: '4px' }}/>
                    {errors.customerId.message}
                  </div>
                }
              </div>
              <div className="w-field w-field--required">
                <label className="w-field__label">N° de demande de service</label>
                <input
                  name="jobId"
                  type="text"
                  ref={register({
                    required: {
                      value: true,
                      message: 'Saisissez votre n° de demande de service'
                    }
                  })}
                  placeholder="Votre n° de demande de service"
                  className="w-field__control"
                />
                {
                  errors.jobId
                  &&
                  <div className="w-field__message--error">
                    <ErrorIcon style={{ marginRight: '4px' }}/>
                    {errors.jobId.message}
                  </div>
                }
              </div>
              <div className="w-field">
                <div
                  className="btn btn--primary"
                  onClick={onSubmit}
                >
                  Se connecter
                </div>
              </div>
              <div className="w-field w-field-txt">
                <p className="p--small">
                  <strong>AIDE</strong>
                </p>
                <p className="p--small">
                  Votre numéro de Client et de demande de Service
                  sont indiqués sur l'invitation papier que vous
                  avez reçue par courrier.
                </p>
                <br/>
                <p className="p--small">
                  <strong>N° Client</strong> : 12 caractères
                  (exemple : 115C00788802)
                </p>
                <p className="p--small">
                <strong>N° demande de Service</strong><br/>
                  5 caractères suivis d'un tiret (du 6)
                  puis de 5 caractères<br/>
                  (exemple : A1515-07604)
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="page page--forms">
      <header>
        <Logo/>
      </header>
      {renderLogin()}  
    </div>
  );
};