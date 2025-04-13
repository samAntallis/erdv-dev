// src/mocks/mockCustomerSession.ts
export const mockCustomerSessionData = {
    customerId: '123456',
    jobId: 'JOB-MOCK-001',
    ffaSession: 'mock-ffa-session',
    mailAgence: 'agence@mock.fr',
    secteurX3: 'X3Z',
    rdvPris: 'non',
    customerEmail: 'mock@client.fr',
    customerPhone: '0612345678',
    defaultCustomerSlot: {
        period: {
            start: '2025-04-21T09:00:00',
            end: '2025-04-21T11:00:00',
        },
        label: 'Lundi 21 Avril entre 9h et 11h'
    },
    customerSlots: [
        {
            period: {
                start: '2025-04-21T09:00:00',
                end: '2025-04-21T11:00:00',
            },
            label: 'Lundi 21 Avril entre 9h et 11h'
        },
        {
            period: {
                start: '2025-04-21T13:00:00',
                end: '2025-04-21T15:00:00',
            },
            label: 'Lundi 21 Avril entre 13h et 15h'
        },
        {
            period: {
                start: '2025-04-22T10:00:00',
                end: '2025-04-22T12:00:00',
            },
            label: 'Mardi 22 Avril entre 10h et 12h'
        }
    ]
};

export const mockRemainingSlots = [
    {
        period: {
            start: '2025-04-23T09:00:00',
            end: '2025-04-23T11:00:00',
        },
        label: 'Mercredi 23 Avril entre 9h et 11h'
    },
    {
        period: {
            start: '2025-04-24T14:00:00',
            end: '2025-04-24T16:00:00',
        },
        label: 'Jeudi 24 Avril entre 14h et 16h'
    }
];
