import React from "react";
import { FlexCenteredLogo as Logo } from '../components/Logo';

export const HomePage = (props: any) => {
  return (
    <div className="page page--forms">
      <header>
        <Logo/>
      </header>
      <div className="content-fluid">
        <div className="w-content">
          <div className="w-txt">
            <div className="h3">Service de prise de rendez-vous en ligne</div>
            <br/>
            <p>Chère Cliente, cher Client,</p>
            <br/>
            <p>Afin d'accéder au service de prise de rendez-vous en ligne,
              un lien de connexion vous a été transmis par e-mail.</p>
            <p>Nous vous remercions de bien vouloir utiliser ce lien pour
              prendre votre rendez-vous.</p>
            <br/>
            <p>Votre Service Clients Culligan</p>
            <br/>
            <hr/>
            <br/>
            <p style={{ fontWeight: 600 }}>Je n'ai rien reçu</p>
            <p>Avez-vous vérifé votre dossier d'e-mails indésirables (spams) ?</p>
            <br/>
            <p style={{ fontWeight: 600 }}>J'ai vérifié, je n'ai rien reçu</p>
            <p>Dans ce cas, merci de contacter votre agence Culligan le plus rapidement
              possible pour convenir d'une date de rendez-vous.</p> 
          </div>
        </div>
      </div> 
    </div>
  );
};