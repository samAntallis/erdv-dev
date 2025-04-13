export interface CustomerSessionInfo {
  id: number;
  status: string;
  jobId: number | null;
  errorId: number;
  errorMsg: string | null;
  debugMsg: string | null;
  synchronisationId: string;
  customerInformations: {
    address: {
      number: null;
      street: string;
      streetComplement: string | null;
      postalCode: number;
      city: string;
      cityComplement: string;
      locality: string;
      country: string;
      state: string;
      latitude: number;
      longitude: number;
      degradation: string;
      geocodingType: string;
      score: number;
      initialAddress: string | null;
    };
    customerLogin: string; // email
    customerName: string;
    customerLanguage: string;
    workerId: string | null;
    jobId: string
  };  
};