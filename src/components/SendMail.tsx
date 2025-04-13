import AWS from 'aws-sdk';

AWS.config.update({ region: process.env.REACT_APP_REGION,
                    secretAccessKey: process.env.REACT_APP_KEY,
                    accessKeyId:process.env.REACT_APP_KEYID,
});

export function sendEmail(  mailto: string,
                            subject: string,
                            htmlContent: string,
                            ccAddresses: string = 'cuillandret@culligan.fr'
): Promise<boolean> {
    const params = {
        Source: "no-reply@culligan.fr",
        Destination: {
            CcAddresses: [
                mailto
              ],
            ToAddresses: [
                ccAddresses
            ]
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: "UTF-8"
            },
            Body: {
                Html: {
                    Data: htmlContent,
                    Charset: "UTF-8"
                }
            }
        }
    };
    const sendPromise = new AWS.SES({apiVersion: "2010-12-01"}).sendEmail(params).promise();
  
    sendPromise.then(function(data) {
        console.log(data.MessageId);
    }).catch(
        function(err) {
        console.error(err, err.stack);
    });
    
    return Promise.resolve(true);
}
