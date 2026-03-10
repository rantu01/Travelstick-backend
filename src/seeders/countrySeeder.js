import countries from 'world-countries';
import { Country } from '../models/country.model'; // Apnar Country Model-er path din

export const seedWorldCountries = async () => {
  try {
    // Prothome check korun database-e age theke country ache kina
    const count = await Country.countDocuments();
    if (count > 0) {
      console.log("Countries already exist in database. Skipping seed.");
      return;
    }

    // world-countries theke data map kora
    const countryList = countries.map((c) => ({
      name: {
        en: c.name.common,
        bn: c.translations?.ben?.common || c.name.common, // Bengali translation thakle nibe, na thakle English
      },
      isoCode: c.cca2,
      flag: c.flag,
      type: 'both', // Jeno Citizen of ebong Travelling to - dui jaygay-i use kora jay
    }));

    await Country.insertMany(countryList);
    console.log("✅ 250+ Countries added to database successfully!");
  } catch (error) {
    console.error("❌ Error seeding countries:", error);
  }
};