// src/mocks/mockCustomerSession.ts

export const mockCustomerSessionData = {
    customerId: "123456",
    jobId: "JOB-001",
    ffaSession: "mock-ffa-session",
    mailAgence: "agence@example.com",
    secteurX3: "SECTEUR-01",
    rdvPris: "non",
    customerEmail: "mock@client.fr",
    customerPhone: "+33612345678",
    defaultCustomerSlot: {
        period: {
            start: "2025-04-10T09:00:00",
            end: "2025-04-10T11:00:00"
        },
        label: "Jeudi 10 Avril entre 9h et 11h"
    }
};
