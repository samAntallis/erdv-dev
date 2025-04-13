import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();
export const allowedCountries = [
  'France', 'Allemagne', 'Luxembourg', 'Suisse', 'Belgique', 'Italie', 'Espagne'
];
const allowedCountryCodes = ['FR', 'DE', 'LU', 'CH', 'BE', 'IT', 'ES'];

export function isValidPhoneNumber(value: string): boolean {
  let isValidNumber = false;
  
  try {
    isValidNumber = allowedCountryCodes.some((countryCode) => {
      const number = phoneUtil.parseAndKeepRawInput(value, countryCode); 
      return phoneUtil.isValidNumber(number);
    });

  } catch(error) {
    //TODO
  }

  return isValidNumber;
};

const removeSpaces = (value: string) => value.split(' ').join('');
const cleanUpRawPhoneNumberValue = (value: string) => removeSpaces(value).split('.').join('');

export function getFormattedPhoneNumber(value: string): string {
  let number: string = value;
  value = cleanUpRawPhoneNumberValue(value);
  const isPhoneNumberNationalFormatWithoutLeadingZero = (9 === value.length && '0' !== value[0]);
  const isPhoneNumberInternationalFormatWithoutLeadingPlus = (value.length > 10 && '+' !== value[0]);

  if (isPhoneNumberNationalFormatWithoutLeadingZero) {
    value = '0' + value;
  }

  // Adding a leading + because Optitime returns international phone number without + symbol
  if (isPhoneNumberInternationalFormatWithoutLeadingPlus) {
    value = '+' + value;
  }

  try {
    for (let i = 0; i < allowedCountryCodes.length; i++) {
      let tmpNumber;
      const countryCode = allowedCountryCodes[i];
      
      let tmpPhoneNumberInstance = phoneUtil.parseAndKeepRawInput(value, countryCode);
      
      if ('FR' === countryCode) {
        tmpNumber = removeSpaces(phoneUtil.format(tmpPhoneNumberInstance, PhoneNumberFormat.NATIONAL));
      } else {
        tmpNumber = phoneUtil.format(tmpPhoneNumberInstance, PhoneNumberFormat.E164);
      }
      
      if (phoneUtil.isValidNumberForRegion(tmpPhoneNumberInstance, countryCode)) {
        number = tmpNumber;
        break;
      }
    }

  } catch(error) {
    //TODO
  }
  
  return number;
};