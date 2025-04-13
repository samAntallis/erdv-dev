import React from 'react';

export const errorMessagesMap : {
  [key: number]: string | JSX.Element;
} = {
  /**
   * default message: Le lien n'est pas ou n'est plus valide
   * TODO enhance feedback message, provide phone number, better UI?, make title shorter
   */
  1004: (
    <>
      <div className="h3 text-center">La prise de rendez-vous en ligne<br/>n'est plus disponible</div>
      <br/>
      <p>Chère Cliente, cher Client,</p>
      <br/>
      <p style={{ fontWeight: 600 }}>Vous avez pris un rendez-vous en ligne ou la date limite de prise de votre rendez-vous en ligne
        a été dépassée ?</p>
      <p>Une date et un créneau d'intervention vous ont été communiqués par e-mail.</p>
      <br/>
      <p style={{ fontWeight: 600 }}>Vous avez refusé tous les créneaux et vous souhaitez prendre un rendez-vous qui vous convient mieux ?</p>
      <p>Merci de contacter le Service Clients de votre agence Culligan.</p>
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
    </>
    ),
  1003: (
    <>
      <div className="h3 text-center">La prise de rendez-vous en ligne<br/>n'est plus disponible</div>
      <br/>
      <p>Chère Cliente, cher Client,</p>
      <br/>
      <p style={{ fontWeight: 600 }}>Vous avez pris un rendez-vous en ligne ou la date limite de prise de votre rendez-vous en ligne
        a été dépassée ?</p>
      <p>Une date et un créneau d'intervention vous ont été communiqués par e-mail.</p>
      <br/>
      <p style={{ fontWeight: 600 }}>Vous avez refusé tous les créneaux et vous souhaitez prendre un rendez-vous qui vous convient mieux ?</p>
      <p>Merci de contacter le Service Clients de votre agence Culligan.</p>
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
    </>
    )
};