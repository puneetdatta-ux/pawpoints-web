// Mirrors the app's CityPicker (C:\Pawpoints\CityPicker.js). Fixed list — free
// text would silently break city-targeted promotions. Keep both in sync.
export const CITY_SECTIONS: { title: string; data: string[] }[] = [
  {
    title: "New Zealand",
    data: [
      "Auckland", "Hamilton", "Tauranga", "Wellington", "Christchurch",
      "Dunedin", "Napier-Hastings", "Palmerston North", "Nelson", "Rotorua",
      "New Plymouth", "Whangārei", "Queenstown", "Invercargill",
    ],
  },
  {
    title: "United Kingdom",
    data: [
      "London", "Birmingham", "Manchester", "Leeds", "Liverpool",
      "Newcastle", "Sheffield", "Bristol", "Nottingham", "Leicester",
      "Edinburgh", "Glasgow", "Aberdeen", "Cardiff", "Belfast",
    ],
  },
  {
    title: "Netherlands",
    data: [
      "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven",
      "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen",
      "Haarlem", "Arnhem",
    ],
  },
];
