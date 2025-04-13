import { OTRM_REST_CONNECTOR_PATH } from "../constants";

export async function useLogIn(ffaSession: any) {
    await fetch(OTRM_REST_CONNECTOR_PATH + '/finalCustomer/json/checkCustomerSession.json', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: "0",
          sessionId: ffaSession
        })
});
}