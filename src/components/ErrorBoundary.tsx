import React from 'react';
import { sendEmail } from "../components/SendMail";

class ErrorBoundary extends React.Component<{}, {
  hasError: boolean
}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
    
    const subject = "Erreur erdv (ErrorBoundary)";
    const sendTo = 'cuillandret@culligan.fr';
    const ccAddresses = 'cuillandret@culligan.fr';
    const htmlContentCheck = "<html><head></head><body><p>Commentaire :</p><p>" + error + " </p><br/><p> L'erreur info est : " + JSON.stringify(errorInfo) + "</p></body></html>";

    sendEmail( sendTo, subject, htmlContentCheck, ccAddresses);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>Une erreur inattendue s'est produite.</h1>
          <p>Si cela persiste, merci de contacter votre agence Culligan.</p>
        </>
      );
    }

    return this.props.children; 
  }
}

export { ErrorBoundary };