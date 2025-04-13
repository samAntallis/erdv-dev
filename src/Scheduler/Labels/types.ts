export interface LabelsResponse {
  id: string;
  status: string;
  responses: {
    listResponses: {
      getStringsResponse: {
        id: number;
        status: string; 
        errorId: number;
        errorMsg: string;
        debugMsg: string;
        synchronisationId: number;
        strings: {
          appString: {
            key: string;
            name: string
            description: string;
            profile: string;
            module: string;
            language: string;
            defaultValue: string;
            value: string;
          }[];
        };
      };
    }[];
  }[];
};