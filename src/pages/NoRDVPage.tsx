import React from "react";
import { FlexCenteredLogo as Logo } from '../components/Logo';

export const NoRDVPage = (props: any) => {
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
            <p>Nous n’avons pas trouvé de créneaux disponibles.</p>
            <br />
            <p>Nous vous invitons à contacter votre agence Culligan pour prendre un RDV</p>
            <br/>
            <p>Nous vous remercions de votre compréhension</p>
            <p>Votre Service Clients Culligan</p>
            <br/>
          </div>
        </div>
      </div> 
    </div>
  );
};
