import React from "react";
import { FlexCenteredLogo as Logo } from '../components/Logo';

export const Maintenance = (props: any) => {
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
            <p>Le service de prise de rendez-vous est momentanément indisponible. Veuillez nous excuser de la gêne occasionnée.</p>
          </div>
        </div>
      </div> 
    </div>
  );
};