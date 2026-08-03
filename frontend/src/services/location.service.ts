import { Country, State, City } from "country-state-city";

export const getCountries = () => Country.getAllCountries();

export const getStates = (countryCode: string) =>
  State.getStatesOfCountry(countryCode);

export const getCities = (countryCode: string, stateCode: string) =>
  City.getCitiesOfState(countryCode, stateCode);