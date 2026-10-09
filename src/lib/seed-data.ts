export type ExpeditionSeed = {
  id: string;
  code: string;
  name: string;
  region: "Arctic" | "Antarctic" | "Southern Ocean" | "Himalaya";
  station: string;
  vessel: string;
  lead: string;
  year: number;
  startDate: string;
  endDate: string;
  summary: string;
  lat: number;
  lng: number;
  focus: string;
};

export type SectionSeed = {
  heading: string;
  body: string;
  page: number;
};

export type ReportSeed = {
  id: string;
  expeditionId: string;
  title: string;
  authors: string;
  year: number;
  tags: string[];
  thumb: string;
  pages: number;
  abstract: string;
  sections: SectionSeed[];
};

export type StillSeed = {
  id: string;
  expeditionId: string;
  title: string;
  tags: string[];
  credit: string;
  url: string;
  caption: string;
};

export type ClipSeed = {
  id: string;
  expeditionId: string;
  title: string;
  tags: string[];
  credit: string;
  url: string;
  poster: string;
  duration: string;
  caption: string;
};

export type TableSeed = {
  id: string;
  expeditionId: string;
  title: string;
  authors: string;
  year: number;
  tags: string[];
  fileUrl: string;
  abstract: string;
  sections: SectionSeed[];
};

const ice = "https://images.pexels.com/photos/30429914/pexels-photo-30429914.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const shelf = "https://images.pexels.com/photos/39149679/pexels-photo-39149679.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const panorama = "https://images.pexels.com/photos/30429897/pexels-photo-30429897.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const blue = "https://images.pexels.com/photos/13314282/pexels-photo-13314282.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const cracked = "https://images.pexels.com/photos/11609967/pexels-photo-11609967.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const berg = "https://images.pexels.com/photos/11391441/pexels-photo-11391441.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const twilight = "https://images.pexels.com/photos/20250341/pexels-photo-20250341.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const aerial = "https://images.pexels.com/photos/28852824/pexels-photo-28852824.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const aurora1 = "https://images.pexels.com/photos/150240/pexels-photo-150240.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const aurora2 = "https://images.pexels.com/photos/30173395/pexels-photo-30173395.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const aurora3 = "https://images.pexels.com/photos/11869673/pexels-photo-11869673.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const aurora4 = "https://images.pexels.com/photos/30173399/pexels-photo-30173399.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const aurora5 = "https://images.pexels.com/photos/15688617/pexels-photo-15688617.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const aurora6 = "https://images.pexels.com/photos/11180716/pexels-photo-11180716.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const lab1 = "https://images.pexels.com/photos/8851080/pexels-photo-8851080.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const lab2 = "https://images.pexels.com/photos/8851605/pexels-photo-8851605.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const lab3 = "https://images.pexels.com/photos/8863040/pexels-photo-8863040.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const lab4 = "https://images.pexels.com/photos/3861457/pexels-photo-3861457.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const lab5 = "https://images.pexels.com/photos/8539059/pexels-photo-8539059.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const lab6 = "https://images.pexels.com/photos/8851610/pexels-photo-8851610.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const penguin1 = "https://images.pexels.com/photos/36479784/pexels-photo-36479784.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const penguin2 = "https://images.pexels.com/photos/20558234/pexels-photo-20558234.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const penguin3 = "https://images.pexels.com/photos/36746841/pexels-photo-36746841.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const penguin4 = "https://images.pexels.com/photos/6475330/pexels-photo-6475330.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const boat1 = "https://images.pexels.com/photos/1707251/pexels-photo-1707251.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const boat2 = "https://images.pexels.com/photos/5418589/pexels-photo-5418589.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const boat3 = "https://images.pexels.com/photos/30903104/pexels-photo-30903104.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const icebreaker = "https://images.pexels.com/photos/35014164/pexels-photo-35014164.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const texture = "https://images.pexels.com/photos/11877616/pexels-photo-11877616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const cave = "https://images.pexels.com/photos/27080044/pexels-photo-27080044.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";
const cave2 = "https://images.pexels.com/photos/27079995/pexels-photo-27079995.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400";

export const expeditionSeeds: ExpeditionSeed[] = [
  {
    id: "exp-isea44",
    code: "ISEA-44",
    name: "Bharati atmospheric observatory, 44th Indian Scientific Expedition to Antarctica",
    region: "Antarctic",
    station: "Bharati",
    vessel: "Chartered ice-class vessel, Cape Town to Larsemann Hills",
    lead: "Dr. Ananya Rao",
    year: 2025,
    startDate: "2024-11-18",
    endDate: "2025-03-02",
    summary: "Clear-sky aerosol, black carbon, and surface radiation measurements from Bharati, with a daily ozone and UV log through the summer window.",
    lat: -69.406,
    lng: 76.195,
    focus: "Aerosols and radiation",
  },
  {
    id: "exp-isea43",
    code: "ISEA-43",
    name: "Maitri ice-core and firn-air season",
    region: "Antarctic",
    station: "Maitri",
    vessel: "Chartered ice-class vessel, Cape Town to Schirmacher Oasis",
    lead: "Dr. Vikram Sethi",
    year: 2024,
    startDate: "2023-11-22",
    endDate: "2024-02-26",
    summary: "A shallow core and firn pits on the Schirmacher margin, extending the local δ18O and dust series used by the Goa laboratory.",
    lat: -70.766,
    lng: 11.735,
    focus: "Ice cores and paleoclimate",
  },
  {
    id: "exp-indarc9",
    code: "IndARC-9",
    name: "IndARC mooring service in Kongsfjorden",
    region: "Arctic",
    station: "Himadri",
    vessel: "Ny-Ålesund workboat",
    lead: "Dr. Meera Krishnan",
    year: 2024,
    startDate: "2024-07-06",
    endDate: "2024-08-19",
    summary: "Recovery and redeployment of the IndARC oceanographic mooring beside India's Himadri station, with a first look at the winter record.",
    lat: 78.923,
    lng: 11.928,
    focus: "Fjord oceanography",
  },
  {
    id: "exp-arctic-bc",
    code: "HIM-BC-23",
    name: "Himadri black carbon and snow albedo campaign",
    region: "Arctic",
    station: "Himadri",
    vessel: "Ny-Ålesund logistics",
    lead: "Dr. Arjun Bhat",
    year: 2023,
    startDate: "2023-03-28",
    endDate: "2023-05-12",
    summary: "Spring sampling of black carbon in snow and the matching albedo change on the Kongsfjorden foreland.",
    lat: 78.927,
    lng: 11.933,
    focus: "Snow impurities",
  },
  {
    id: "exp-sagar-2024",
    code: "SN-SO-24",
    name: "Southern Ocean transect on ORV Sagar Nidhi",
    region: "Southern Ocean",
    station: "Underway",
    vessel: "ORV Sagar Nidhi",
    lead: "Dr. Leela Menon",
    year: 2024,
    startDate: "2024-01-09",
    endDate: "2024-02-21",
    summary: "Indian-sector stations for chlorophyll, dimethyl sulfide, and ice-rafted debris across the Antarctic Polar Front.",
    lat: -56.4,
    lng: 57.8,
    focus: "Biology and sediments",
  },
  {
    id: "exp-madice",
    code: "MADICE-II",
    name: "MADICE-II traverse, Dronning Maud Land",
    region: "Antarctic",
    station: "Traverse from Maitri",
    vessel: "Over-snow convoy",
    lead: "Dr. Farhan Qureshi",
    year: 2023,
    startDate: "2022-12-14",
    endDate: "2023-02-03",
    summary: "Radar layering, firn density, and katabatic wind logs along the second phase of the MADICE traverse.",
    lat: -71.4,
    lng: 10.2,
    focus: "Ice-sheet traverse",
  },
  {
    id: "exp-microbe",
    code: "ISEA-45-BIO",
    name: "Bharati microbial dark matter season",
    region: "Antarctic",
    station: "Bharati",
    vessel: "Station laboratories",
    lead: "Dr. S. Iyer",
    year: 2025,
    startDate: "2025-01-04",
    endDate: "2025-02-18",
    summary: "A culture-light survey of epishelf lake mats and soil crusts around the Larsemann Hills station.",
    lat: -69.412,
    lng: 76.187,
    focus: "Microbial ecology",
  },
  {
    id: "exp-space",
    code: "MAI-SW-24",
    name: "Maitri space weather and neutron monitor season",
    region: "Antarctic",
    station: "Maitri",
    vessel: "Station observatory",
    lead: "Dr. N. Chawla",
    year: 2024,
    startDate: "2024-04-02",
    endDate: "2024-09-28",
    summary: "Winter-over log of the neutron monitor, geomagnetic pulsations, and a moderate solar proton event.",
    lat: -70.768,
    lng: 11.728,
    focus: "Space weather",
  },
  {
    id: "exp-cryo",
    code: "HIM-CRYO-25",
    name: "Himadri cryosphere-atmosphere coupling",
    region: "Arctic",
    station: "Himadri",
    vessel: "Ny-Ålesund",
    lead: "Dr. Ananya Rao",
    year: 2025,
    startDate: "2025-06-11",
    endDate: "2025-07-30",
    summary: "Early-summer energy balance over melting snow, including a drainage wind off the nearby glaciers.",
    lat: 78.91,
    lng: 11.89,
    focus: "Surface energy balance",
  },
  {
    id: "exp-carbon",
    code: "SN-SO-23",
    name: "Southern Ocean carbon pump stations",
    region: "Southern Ocean",
    station: "Underway",
    vessel: "ORV Sagar Nidhi",
    lead: "Dr. Leela Menon",
    year: 2023,
    startDate: "2023-01-16",
    endDate: "2023-02-27",
    summary: "Discrete pCO2, chlorophyll, and coccolithophore counts on a repeat Indian-sector line.",
    lat: -52.2,
    lng: 62.4,
    focus: "Ocean carbon",
  },
  {
    id: "exp-lakes",
    code: "BH-LAKE-24",
    name: "Larsemann Hills lakes and active layer",
    region: "Antarctic",
    station: "Bharati",
    vessel: "Station field party",
    lead: "Dr. Meera Krishnan",
    year: 2024,
    startDate: "2024-01-08",
    endDate: "2024-02-11",
    summary: "Thaw-depth transects and lake conductivity around Bharati, including a late-January warm spell.",
    lat: -69.4,
    lng: 76.15,
    focus: "Permafrost and lakes",
  },
  {
    id: "exp-heritage",
    code: "DG-REA-22",
    name: "Dakshin Gangotri heritage ice archive reanalysis",
    region: "Antarctic",
    station: "Dakshin Gangotri",
    vessel: "Desk reanalysis, Vasco da Gama",
    lead: "Dr. Vikram Sethi",
    year: 2022,
    startDate: "2022-06-01",
    endDate: "2022-11-30",
    summary: "A re-reading of the first Indian station's surviving meteorological sheets against the modern Maitri series.",
    lat: -70.083,
    lng: 12.0,
    focus: "Heritage meteorology",
  },
  {
    id: "exp-himalaya",
    code: "HIMCRYO-24",
    name: "Chandra Basin cryosphere liaison at Himansh",
    region: "Himalaya",
    station: "Himansh",
    vessel: "Road party, Chandra Basin",
    lead: "Dr. Arjun Bhat",
    year: 2024,
    startDate: "2024-09-02",
    endDate: "2024-09-24",
    summary: "A short liaison season so the polar desk can compare snow-impurity methods with the Arctic black-carbon campaign.",
    lat: 32.41,
    lng: 77.36,
    focus: "Snow impurities",
  },
];

export const reportSeeds: ReportSeed[] = [
  {
    id: "rpt-bharati-aod",
    expeditionId: "exp-isea44",
    title: "Aerosol optical depth and black carbon at Bharati, January 2025",
    authors: "Dr. Ananya Rao, Dr. Vikram Sethi",
    year: 2025,
    tags: ["aerosol", "black carbon", "albedo", "Bharati", "AOD"],
    thumb: shelf,
    pages: 18,
    abstract: "Clear-sky aerosol optical depth at Bharati stayed low through January, except for one black-carbon spike tied to a wind shift rather than a continental plume.",
    sections: [
      { heading: "Clear-sky optical depth", page: 3, body: "AOD at 500 nm averaged 0.041 during clear-sky January days at Bharati, 0.009 above the 2018-2023 January mean. The station log marked 21 of 27 January days as clear enough for the sun photometer." },
      { heading: "Black carbon spike", page: 5, body: "Black carbon mass concentration peaked at 78 ng m-3 on 14 January during a northerly wind shift. The same hour showed no rise in coarse dust, so the spike was soot rather than a local soil gust." },
      { heading: "Irradiance", page: 7, body: "The station pyranometer recorded a 6 percent drop in noon irradiance on 14 January relative to the clear-sky envelope. Albedo of the nearby snow patch fell from 0.81 to 0.76 between 13 and 15 January." },
      { heading: "Where the air came from", page: 9, body: "Trajectory analysis linked the 14 January spike to a passing ship corridor, not to a continental plume. The note asks editors not to describe the event as an Asian dust outbreak." },
    ],
  },
  {
    id: "rpt-bharati-ozone",
    expeditionId: "exp-isea44",
    title: "Ozone column and UV-B log at Bharati",
    authors: "Dr. Ananya Rao",
    year: 2025,
    tags: ["ozone", "UV", "Bharati", "Antarctica"],
    thumb: panorama,
    pages: 12,
    abstract: "The summer ozone column at Bharati remained above the deep-spring minimum, with one short UV-B rise during a thin high cloud.",
    sections: [
      { heading: "Column ozone", page: 2, body: "Mean column ozone for 1-20 January was 286 Dobson units, 18 Dobson units above the 2015-2023 January mean at Bharati. No day in the log fell below 260 Dobson units." },
      { heading: "UV-B window", page: 4, body: "Erythemal UV-B rose 11 percent above the clear-sky curve on 9 January under thin high cloud. The rise lasted 2.5 hours around local noon and was not repeated the next day." },
      { heading: "Station practice", page: 6, body: "Field parties kept the usual midday limit of 40 minutes on the ice when the UV index reached 4. The medical log recorded no new snow-blindness cases during the ozone window." },
      { heading: "What not to claim", page: 8, body: "The January column does not describe the spring ozone hole. That minimum is a September event and is not in this summer log." },
    ],
  },
  {
    id: "rpt-maitri-core",
    expeditionId: "exp-isea43",
    title: "Shallow core δ18O from the Schirmacher margin",
    authors: "Dr. Vikram Sethi, Dr. Farhan Qureshi",
    year: 2024,
    tags: ["δ18O", "ice core", "Maitri", "paleoclimate"],
    thumb: cave,
    pages: 22,
    abstract: "A 21 m shallow core from the Schirmacher margin carries a δ18O shift that the laboratory reads as a warmer decade, not as a single storm.",
    sections: [
      { heading: "Core recovery", page: 2, body: "The shallow core reached 21.4 m and was logged in 5 cm bags before leaving Maitri. Density increased from 410 kg m-3 at 1 m to 680 kg m-3 at 18 m." },
      { heading: "Isotope shift", page: 6, body: "δ18O rose by 1.2 per mil between the 1998-2002 mean and the 2014-2018 mean in this core. The laboratory treats 0.3 per mil as the bag-level uncertainty." },
      { heading: "Dust", page: 9, body: "Insoluble dust peaked at 86 ppb in the 2009-2010 bag group, twice the core median of 41 ppb. The peak sits one year above a visible melt crust." },
      { heading: "Reading limit", page: 12, body: "The core does not resolve seasons below 16 m. Editors should not quote an annual temperature from a single bag." },
    ],
  },
  {
    id: "rpt-maitri-firn",
    expeditionId: "exp-isea43",
    title: "Firn air and density pit at Maitri",
    authors: "Dr. Vikram Sethi",
    year: 2024,
    tags: ["firn", "Maitri", "density", "ice core"],
    thumb: texture,
    pages: 9,
    abstract: "A 4 m firn pit beside Maitri shows a thin ice lens from a warm week and a CO2 value still close to the flask network.",
    sections: [
      { heading: "Pit", page: 1, body: "The firn pit was 4.1 m deep and cut 180 m east of the Maitri balloon shed. An ice lens 6 mm thick sat at 1.35 m." },
      { heading: "Firn air", page: 3, body: "Firn-air CO2 at 3.5 m was 412 ppm, 3 ppm below the same-week flask value at the station inlet. Methane was 1890 ppb in the same flask pair." },
      { heading: "Temperature", page: 5, body: "Firn temperature at 2 m was -17.4 °C on 12 January, 1.1 °C warmer than the 2016 pit at the same depth. The warm week of 8-11 January is the likely source of the ice lens." },
      { heading: "Use", page: 7, body: "This pit calibrates the top of the shallow core. It is not a climate reconstruction on its own." },
    ],
  },
  {
    id: "rpt-indarc-winter",
    expeditionId: "exp-indarc9",
    title: "IndARC-9 winter mixed layer in Kongsfjorden",
    authors: "Dr. Meera Krishnan",
    year: 2024,
    tags: ["IndARC", "mixed layer", "Kongsfjorden", "Himadri", "mooring"],
    thumb: aurora2,
    pages: 16,
    abstract: "The IndARC-9 mooring recorded a deeper winter mixed layer in Kongsfjorden than the 2016-2020 mean, with the instruments recovered intact at Himadri.",
    sections: [
      { heading: "Mixed layer", page: 4, body: "IndARC-9 recorded a winter mixed-layer depth of 86 m in Kongsfjorden, 18 m deeper than the 2016-2020 mean. The deepest daily value was 91 m on 12 March." },
      { heading: "Recovery", page: 6, body: "The mooring was recovered on 14 July and redeployed the next day with the same 12-instrument string. No sensor failed the post-recovery clock check." },
      { heading: "Salinity", page: 8, body: "Winter salinity in the upper 40 m averaged 34.72, 0.08 above the previous winter on this mooring. The freshest week was early October, after a glacier-fed pulse." },
      { heading: "Limit", page: 11, body: "The record is one fjord, not the Arctic Ocean. Editors should keep the place name Kongsfjorden in every public line." },
    ],
  },
  {
    id: "rpt-indarc-atlantic",
    expeditionId: "exp-indarc9",
    title: "Atlantic Water on the IndARC mooring",
    authors: "Dr. Meera Krishnan, Dr. Arjun Bhat",
    year: 2024,
    tags: ["Atlantic Water", "IndARC", "Kongsfjorden", "temperature"],
    thumb: aurora4,
    pages: 11,
    abstract: "A warm, salty Atlantic Water layer sat on the IndARC mooring through late summer and cooled only after the September wind events.",
    sections: [
      { heading: "Warm layer", page: 3, body: "Atlantic Water warmed the 50-120 m layer by 0.4 °C relative to the previous September. The warm core sat at 78 m on 2 September." },
      { heading: "Salt", page: 5, body: "Salinity in that core was 34.95, the highest weekly value in the IndARC-9 file. The layer thinned from 42 m to 27 m after the wind events of 18-20 September." },
      { heading: "Ice", page: 7, body: "Fjord ice did not form over the mooring site during the logged year. The nearest fast ice remained 6 km to the east in the inner bay." },
      { heading: "Wording", page: 9, body: "Call the layer Atlantic Water only for the 50-120 m core described here. The surface water in October was glacier-fed and fresher." },
    ],
  },
  {
    id: "rpt-him-bc",
    expeditionId: "exp-arctic-bc",
    title: "Black carbon in spring snow at Himadri",
    authors: "Dr. Arjun Bhat",
    year: 2023,
    tags: ["black carbon", "Himadri", "snow", "Arctic"],
    thumb: aurora1,
    pages: 14,
    abstract: "April snow beside Himadri carried a black-carbon peak after a calm week, with lower values once the wind returned from the fjord.",
    sections: [
      { heading: "Snow samples", page: 2, body: "Twenty-four snow samples were taken within 1.2 km of Himadri between 4 and 18 April. Black carbon ranged from 9 to 64 ng g-1." },
      { heading: "Peak week", page: 4, body: "The peak of 64 ng g-1 fell on 11 April, after four days of wind below 3 m s-1. The same sample had an effective snow grain radius of 180 micrometres." },
      { heading: "After the wind", page: 6, body: "By 16 April, black carbon in the top 2 cm had fallen to 17 ng g-1. Fresh drift snow, not rain, covered the earlier surface." },
      { heading: "Method", page: 8, body: "Filters were read in Goa on the same photometer used for the Bharati aerosol filters. The blank was 2 ng g-1." },
    ],
  },
  {
    id: "rpt-him-albedo",
    expeditionId: "exp-arctic-bc",
    title: "Albedo drop after the April impurity event",
    authors: "Dr. Arjun Bhat, Dr. Ananya Rao",
    year: 2023,
    tags: ["albedo", "black carbon", "Himadri", "snow"],
    thumb: aurora5,
    pages: 8,
    abstract: "Broadband albedo fell on the impurity peak and recovered only partly when fresh snow arrived.",
    sections: [
      { heading: "Albedo", page: 2, body: "Noon albedo fell from 0.84 on 8 April to 0.71 on 11 April at the Himadri snow course. The drop of 0.13 matches the black-carbon peak of 64 ng g-1." },
      { heading: "Recovery", page: 4, body: "After the drift snow of 16 April, noon albedo returned to 0.79, still 0.05 below the 8 April value. Grain size remained coarser than the early-April snow." },
      { heading: "Energy", page: 6, body: "The extra absorbed sunlight on 11 April was estimated at 28 W m-2 at noon. That estimate uses the measured albedo and the station pyranometer, not a model climatology." },
    ],
  },
  {
    id: "rpt-so-dms",
    expeditionId: "exp-sagar-2024",
    title: "Dimethyl sulfide along the Sagar Nidhi line",
    authors: "Dr. Leela Menon",
    year: 2024,
    tags: ["dimethyl sulfide", "Southern Ocean", "Sagar Nidhi", "biology"],
    thumb: boat1,
    pages: 15,
    abstract: "Dimethyl sulfide rose south of the Polar Front on the 2024 Sagar Nidhi line, alongside a chlorophyll maximum.",
    sections: [
      { heading: "Front", page: 3, body: "The Antarctic Polar Front on this line sat near 53.5°S, marked by a surface temperature drop from 4.8 °C to 2.1 °C over 40 nautical miles. Dimethyl sulfide south of the front averaged 186 ng S L-1." },
      { heading: "Chlorophyll", page: 5, body: "Chlorophyll-a peaked at 1.8 mg m-3 at 54.2°S, in the same station as the DMS maximum of 240 ng S L-1. North of 48°S, DMS stayed below 70 ng S L-1." },
      { heading: "Wind", page: 8, body: "A 14 m s-1 westerly on 2 February mixed the upper 45 m and cut the surface DMS by half within a day. The chlorophyll peak thinned but did not vanish." },
      { heading: "Claim limit", page: 10, body: "These are underway and station values for one Indian-sector line. They are not a basin budget for dimethyl sulfide." },
    ],
  },
  {
    id: "rpt-so-ird",
    expeditionId: "exp-sagar-2024",
    title: "Ice-rafted debris at the Antarctic Polar Front",
    authors: "Dr. Leela Menon, Dr. Farhan Qureshi",
    year: 2024,
    tags: ["ice-rafted debris", "Southern Ocean", "Polar Front", "sediment"],
    thumb: aerial,
    pages: 10,
    abstract: "Coarse grains in the surface sediment rise at the Polar Front, consistent with melting ice rather than a river source.",
    sections: [
      { heading: "Counts", page: 2, body: "Ice-rafted debris coarser than 250 micrometres reached 14 grains per gram at 54°S. The same size class was 2 grains per gram at 46°S." },
      { heading: "Composition", page: 4, body: "Quartz dominated the coarse fraction, with 9 percent volcanic glass in the 54°S sample. No sample contained wood or other river debris." },
      { heading: "Context", page: 6, body: "The debris peak sits under the chlorophyll and dimethyl sulfide maximum of the same cruise. The note does not claim that the grains fertilised the bloom." },
    ],
  },
  {
    id: "rpt-madice-radar",
    expeditionId: "exp-madice",
    title: "Radar layering on the MADICE-II traverse",
    authors: "Dr. Farhan Qureshi",
    year: 2023,
    tags: ["MADICE", "radar", "firn", "Dronning Maud Land"],
    thumb: cracked,
    pages: 19,
    abstract: "The 400 MHz radar on MADICE-II tracked a continuous firn layer for 86 km before a crevasse field broke the return.",
    sections: [
      { heading: "Layer", page: 4, body: "A bright firn layer at 18 m depth stayed continuous for 86 km along the MADICE-II line. Depth varied by less than 1.4 m over that stretch." },
      { heading: "Crevasse field", page: 7, body: "The return broke at kilometre 112, where the crevasse field narrowed the safe corridor to 40 m. The convoy camped for 2 nights before the reroute." },
      { heading: "Density tie", page: 9, body: "A pit at kilometre 70 tied the bright layer to a density step from 540 to 590 kg m-3. That tie is local and should not be copied to kilometre 112." },
    ],
  },
  {
    id: "rpt-madice-wind",
    expeditionId: "exp-madice",
    title: "Katabatic wind and firn temperature on MADICE-II",
    authors: "Dr. Farhan Qureshi",
    year: 2023,
    tags: ["katabatic", "MADICE", "firn", "wind"],
    thumb: twilight,
    pages: 7,
    abstract: "A two-day katabatic wind cooled the upper firn and scoured 4 cm of surface snow at the kilometre-70 camp.",
    sections: [
      { heading: "Wind", page: 2, body: "The katabatic wind exceeded 18 m s-1 for 11 hours on 19 January at the kilometre-70 camp. Direction held within 15 degrees of the fall line." },
      { heading: "Firn temperature", page: 3, body: "Firn temperature at 10 cm fell from -19.2 °C to -26.8 °C during the wind. The 1 m temperature changed by only 0.4 °C." },
      { heading: "Scour", page: 5, body: "Stake 4 lost 4 cm of surface snow. Neighbouring stakes lost 2 to 5 cm, so the scour was camp-wide and not a single drift shadow." },
    ],
  },
  {
    id: "rpt-microbe-mats",
    expeditionId: "exp-microbe",
    title: "Epishelf lake mats near Bharati",
    authors: "Dr. S. Iyer",
    year: 2025,
    tags: ["epishelf", "microbes", "Bharati", "lakes"],
    thumb: lab4,
    pages: 13,
    abstract: "Pigmented mats in an epishelf lake near Bharati were dominated by a filament the laboratory has not yet named to species.",
    sections: [
      { heading: "Site", page: 2, body: "The epishelf lake sat 2.4 km south of Bharati and was ice-covered except for a 30 m moat. Water under the ice was 0.4 °C and 4.2 mS cm-1." },
      { heading: "Mats", page: 4, body: "Orange mats covered 18 percent of the surveyed moat edge. Chlorophyll-a in the mat slurry was 42 mg m-2." },
      { heading: "Sequences", page: 7, body: "The dominant filament accounted for 61 percent of the 16S reads in three replicate mats. It did not match a named species above 97 percent identity in the onboard database." },
      { heading: "Care", page: 9, body: "Do not call the filament a new species in public copy. The identity threshold is a screen, not a description." },
    ],
  },
  {
    id: "rpt-microbe-soil",
    expeditionId: "exp-microbe",
    title: "Soil crust pigments in the Larsemann Hills",
    authors: "Dr. S. Iyer",
    year: 2025,
    tags: ["soil crust", "microbes", "Larsemann", "Bharati"],
    thumb: lab2,
    pages: 8,
    abstract: "Dark soil crusts on a north-facing knoll carried more pigment than the pale crusts 40 m away.",
    sections: [
      { heading: "Contrast", page: 2, body: "Dark crusts held 3.4 micrograms of chlorophyll-a per gram, against 0.6 in the pale crusts 40 m west. Both sites were snow-free on 22 January." },
      { heading: "Moisture", page: 4, body: "Gravimetric moisture was 8 percent in the dark crust and 3 percent in the pale crust. The dark site sat in a lee of a 1.5 m boulder." },
      { heading: "Limit", page: 6, body: "The contrast is one knoll. It is not a hills-wide map of soil life." },
    ],
  },
  {
    id: "rpt-neutron",
    expeditionId: "exp-space",
    title: "Neutron monitor during the September proton event",
    authors: "Dr. N. Chawla",
    year: 2024,
    tags: ["neutron monitor", "Maitri", "space weather", "cosmic rays"],
    thumb: aurora6,
    pages: 11,
    abstract: "The Maitri neutron monitor dropped during a moderate solar proton event and recovered over two days.",
    sections: [
      { heading: "Forbush drop", page: 2, body: "The neutron monitor count fell 7.5 percent below the 27-day mean at 06:40 UTC on 12 September. The minimum lasted 35 minutes." },
      { heading: "Recovery", page: 4, body: "Counts were back within 1 percent of the mean by 14 September at 18:00 UTC. No second drop was logged that week." },
      { heading: "Station", page: 6, body: "The monitor hut temperature stayed between 18 and 21 °C, so the drop is not a heater failure. Pressure correction used the station barometer." },
      { heading: "Public wording", page: 8, body: "Call it a moderate solar proton event, not a storm that threatened the station crew. Operations continued on the normal winter roster." },
    ],
  },
  {
    id: "rpt-geomag",
    expeditionId: "exp-space",
    title: "Geomagnetic pulsations at Maitri",
    authors: "Dr. N. Chawla",
    year: 2024,
    tags: ["geomagnetic", "Maitri", "space weather", "pulsations"],
    thumb: aurora3,
    pages: 9,
    abstract: "Pc5 pulsations were frequent in the autumn shoulder, with one interval that coincided with the neutron-monitor drop.",
    sections: [
      { heading: "Occurrence", page: 2, body: "Pc5 pulsations were present on 41 of 90 autumn days in the Maitri induction-coil log. Typical amplitude was 8 nT." },
      { heading: "Shared hour", page: 4, body: "On 12 September the coil recorded 22 nT pulsations during the same hour as the 7.5 percent neutron-monitor drop. The coil and the monitor are 60 m apart." },
      { heading: "Quiet days", page: 6, body: "The quietest week, 2-8 June, stayed below 3 nT in the Pc5 band. That week is the baseline the winter-over team uses for instrument health." },
    ],
  },
  {
    id: "rpt-energy",
    expeditionId: "exp-cryo",
    title: "Surface energy balance at Himadri in early summer",
    authors: "Dr. Ananya Rao",
    year: 2025,
    tags: ["energy balance", "Himadri", "snow", "Arctic"],
    thumb: ice,
    pages: 12,
    abstract: "Net radiation turned positive in the third week of June and drove a measurable melt at the Himadri snow course.",
    sections: [
      { heading: "Sign change", page: 3, body: "Daily net radiation turned positive on 19 June, at +18 W m-2. The previous week had averaged -6 W m-2." },
      { heading: "Melt", page: 5, body: "The snow course lost 11 mm water equivalent between 19 and 24 June. Air temperature peaked at 4.6 °C on 21 June." },
      { heading: "Albedo", page: 7, body: "Albedo fell from 0.78 to 0.69 as the snow darkened. Black carbon in the top centimetre was 21 ng g-1, lower than the April 2023 peak of 64 ng g-1." },
    ],
  },
  {
    id: "rpt-drainage",
    expeditionId: "exp-cryo",
    title: "Glacier drainage wind at Himadri",
    authors: "Dr. Ananya Rao",
    year: 2025,
    tags: ["katabatic", "Himadri", "wind", "snow"],
    thumb: berg,
    pages: 6,
    abstract: "A night drainage wind off the glacier cooled the snow surface without resetting the June melt totals.",
    sections: [
      { heading: "Wind", page: 2, body: "The drainage wind reached 9 m s-1 at 02:10 on 22 June and held a glacier-to-fjord direction for 5 hours. It was weaker than the MADICE katabatic cases and should not share that name in public copy." },
      { heading: "Surface", page: 3, body: "Snow-surface temperature fell from -0.4 °C to -3.1 °C during the wind. The 10 cm temperature stayed at 0 °C, consistent with lingering meltwater." },
      { heading: "Melt total", page: 5, body: "The night did not restore the 11 mm water equivalent lost earlier in the week. Morning albedo was 0.70, close to the previous noon." },
    ],
  },
  {
    id: "rpt-pco2",
    expeditionId: "exp-carbon",
    title: "pCO2 and the carbon pump on the 2023 Southern Ocean line",
    authors: "Dr. Leela Menon",
    year: 2023,
    tags: ["pCO2", "carbon", "Southern Ocean", "chlorophyll"],
    thumb: boat3,
    pages: 17,
    abstract: "Surface pCO2 fell below the atmosphere south of 50°S, in step with a modest chlorophyll rise.",
    sections: [
      { heading: "Undersaturation", page: 4, body: "Surface pCO2 dropped to 342 µatm at 51.8°S, 28 µatm below the same-day atmospheric value of 370 µatm. North of 46°S the surface water was 8 µatm above the atmosphere." },
      { heading: "Chlorophyll", page: 7, body: "Chlorophyll-a at the undersaturated station was 0.9 mg m-3, against 0.2 mg m-3 at 44°S. The mixed layer was 38 m deep at the southern station." },
      { heading: "Pump wording", page: 10, body: "The line shows a local sink, not a quantified carbon-pump export. No sediment trap was recovered on this cruise." },
    ],
  },
  {
    id: "rpt-coccolith",
    expeditionId: "exp-carbon",
    title: "Coccolithophore counts on the repeat line",
    authors: "Dr. Leela Menon",
    year: 2023,
    tags: ["coccolithophore", "Southern Ocean", "biology", "carbon"],
    thumb: lab1,
    pages: 8,
    abstract: "Coccolithophores were common north of the front and scarce in the colder water where pCO2 was lowest.",
    sections: [
      { heading: "Counts", page: 2, body: "Coccolithophore cell counts reached 180,000 cells per litre at 45.5°S. At 52°S the count was 4,000 cells per litre." },
      { heading: "Species note", page: 4, body: "Emiliania-like plates dominated the northern counts. The southern samples were mostly naked flagellates, not coccolithophores." },
      { heading: "Link", page: 6, body: "The high counts sit in the supersaturated water, not in the 342 µatm sink. Do not credit coccolithophores for that sink in public copy." },
    ],
  },
  {
    id: "rpt-thaw",
    expeditionId: "exp-lakes",
    title: "Active layer thaw depth in the Larsemann Hills",
    authors: "Dr. Meera Krishnan",
    year: 2024,
    tags: ["active layer", "permafrost", "Bharati", "thaw"],
    thumb: cracked,
    pages: 10,
    abstract: "Late-January thaw depths around Bharati exceeded the 2017-2022 mean on the same stakes.",
    sections: [
      { heading: "Stakes", page: 2, body: "Mean active-layer thaw depth on 28 January was 62 cm across 15 stakes, 9 cm deeper than the 2017-2022 mean for that date. The deepest stake reached 81 cm." },
      { heading: "Warm spell", page: 4, body: "Air temperature stayed above 2 °C for 46 hours from 24 to 26 January. That spell accounts for 5 cm of the extra thaw in the stake model used by the party." },
      { heading: "Permafrost", page: 6, body: "The frost table was still present at every stake. The log does not show loss of permafrost, only a deeper active layer for this date." },
    ],
  },
  {
    id: "rpt-lakes-cond",
    expeditionId: "exp-lakes",
    title: "Lake conductivity after the January warm spell",
    authors: "Dr. Meera Krishnan",
    year: 2024,
    tags: ["lakes", "Bharati", "conductivity", "active layer"],
    thumb: blue,
    pages: 7,
    abstract: "A monitored lake freshened slightly after the warm spell, then returned toward its pre-spell conductivity.",
    sections: [
      { heading: "Freshening", page: 2, body: "Surface conductivity fell from 3.6 to 3.1 mS cm-1 between 23 and 27 January. Water temperature rose from 1.8 °C to 3.4 °C in the same window." },
      { heading: "Recovery", page: 4, body: "By 6 February conductivity was 3.4 mS cm-1. The party reads the dip as meltwater, not as a new drainage path." },
      { heading: "Level", page: 5, body: "Lake level rose 7 cm during the spell and held 4 cm of that rise into February. No outlet was observed." },
    ],
  },
  {
    id: "rpt-heritage",
    expeditionId: "exp-heritage",
    title: "Dakshin Gangotri sheets against the Maitri series",
    authors: "Dr. Vikram Sethi",
    year: 2022,
    tags: ["Dakshin Gangotri", "Maitri", "heritage", "temperature"],
    thumb: icebreaker,
    pages: 20,
    abstract: "Surviving 1984-1989 sheets from Dakshin Gangotri are warmer in January than the overlapping Maitri notes, for a reason the reanalysis does not settle.",
    sections: [
      { heading: "Sheets", page: 3, body: "The heritage set holds 1,126 daily temperature sheets from Dakshin Gangotri between 1984 and 1989. January means exist for all six years." },
      { heading: "Offset", page: 8, body: "The Dakshin Gangotri January mean is 1.8 °C warmer than the Maitri January mean for 1984-1989. The stations are 80 km apart, so the offset is not a single-site trend." },
      { heading: "Gaps", page: 12, body: "Wind direction is missing on 23 percent of the sheets. Those days were kept in the temperature mean and dropped from the wind rose." },
      { heading: "Wording", page: 15, body: "Do not say the ice shelf warmed by 1.8 °C. The number is a station offset, not a trend." },
    ],
  },
  {
    id: "rpt-himansh",
    expeditionId: "exp-himalaya",
    title: "Snow impurity methods at Himansh",
    authors: "Dr. Arjun Bhat",
    year: 2024,
    tags: ["Himansh", "Himalaya", "black carbon", "snow"],
    thumb: lab5,
    pages: 9,
    abstract: "The Chandra Basin liaison checked that the Himadri filter method still reads black carbon in Himalayan snow, which is dustier.",
    sections: [
      { heading: "Comparison", page: 2, body: "Twelve Himansh snow samples read between 28 and 140 ng g-1 of black carbon on the polar photometer. The dust load was 4 to 9 times the April Himadri samples." },
      { heading: "Blank", page: 4, body: "Field blanks averaged 3 ng g-1, close to the Arctic blank of 2 ng g-1. The method note accepts the filter for soot but not for a dust-corrected albedo without a second instrument." },
      { heading: "Use", page: 6, body: "File this liaison with the polar desk so the April Himadri albedo note is not copied onto Himalayan snow. The dust difference is the point of the season." },
    ],
  },
];

const stillRows: [string, string, string, string, string, string, string][] = [
  ["img-01", "exp-isea44", "Illustrative still — ice shelf over calm water", "Bharati,albedo,still", "Jan Tang / Pexels", shelf, "Used when the desk explains the Bharati clear-sky radiation log. Illustrative stock, not a Larsemann Hills photograph."],
  ["img-02", "exp-isea44", "Illustrative still — tabular bergs at dusk", "Bharati,radiation,still", "Francesco Ungaro / Pexels", twilight, "Paired with the noon irradiance passage. The frame is illustrative and was not shot at Bharati."],
  ["img-03", "exp-isea43", "Illustrative still — blue ice texture", "Maitri,ice core,still", "Lars H Knudsen / Pexels", blue, "A visual for the shallow-core note. Not a photograph of the Schirmacher core."],
  ["img-04", "exp-isea43", "Illustrative still — ice cave wall", "firn,Maitri,still", "Han-Chieh Lee / Pexels", cave, "Supports the firn-pit explainer. Illustrative ice, not the Maitri pit."],
  ["img-05", "exp-isea43", "Illustrative still — ice texture close-up", "firn,density,still", "Adeline MAN / Pexels", texture, "Used beside the density numbers from the Maitri pit. Stock texture only."],
  ["img-06", "exp-indarc9", "Illustrative still — aurora over a cold coast", "IndARC,Himadri,still", "Francesco Ungaro / Pexels", aurora2, "Opening still for the Kongsfjorden mooring story. Not a Ny-Ålesund frame from the expedition."],
  ["img-07", "exp-indarc9", "Illustrative still — aurora and open water", "Atlantic Water,Himadri,still", "Francesco Ungaro / Pexels", aurora4, "Paired with the Atlantic Water passage. Illustrative night sky."],
  ["img-08", "exp-arctic-bc", "Illustrative still — snow ridge under aurora", "black carbon,Himadri,albedo,still", "Flickr / Pexels", aurora1, "Cover still for the April snow-impurity note. Not the Himadri snow course."],
  ["img-09", "exp-arctic-bc", "Illustrative still — aurora above a ridgeline", "albedo,snow,still", "Stan Platt-Jones / Pexels", aurora5, "Secondary still for the albedo drop of 0.13. Stock photograph."],
  ["img-10", "exp-arctic-bc", "Illustrative still — moon and aurora", "Himadri,Arctic,still", "Tobias Bjørkli / Pexels", aurora6, "Night still for the Arctic desk. Not a research photograph."],
  ["img-11", "exp-sagar-2024", "Illustrative still — vessel in open water", "Sagar Nidhi,Southern Ocean,still", "Frans van Heerden / Pexels", boat1, "Stand-in for the ORV Sagar Nidhi line. Not the ship's own photograph."],
  ["img-12", "exp-sagar-2024", "Illustrative still — wake from above", "dimethyl sulfide,Southern Ocean,still", "cottonbro studio / Pexels", boat2, "Used with the dimethyl sulfide station note. Illustrative wake."],
  ["img-13", "exp-carbon", "Illustrative still — small craft on blue water", "pCO2,Southern Ocean,still", "天玑 不器 / Pexels", boat3, "Visual for the carbon-pump line. Not a cruise photograph."],
  ["img-14", "exp-carbon", "Illustrative still — helicopter on an icebreaker deck", "Southern Ocean,vessel,still", "Dmitriy Ryndin / Pexels", icebreaker, "Deck still for cruise explainers. Illustrative, not Sagar Nidhi."],
  ["img-15", "exp-madice", "Illustrative still — cracked sea ice from above", "MADICE,firn,still", "Maria Tsegelnik / Pexels", cracked, "Texture still for the traverse notes. Not Dronning Maud Land radar data."],
  ["img-16", "exp-madice", "Illustrative still — wide ice coast", "katabatic,Antarctica,still", "Francesco Ungaro / Pexels", panorama, "Horizon still for the katabatic wind note. Stock frame."],
  ["img-17", "exp-microbe", "Illustrative still — laboratory bench", "microbes,Bharati,still", "ThisIsEngineering / Pexels", lab4, "Laboratory still for the epishelf mat note. Not the Bharati wet lab."],
  ["img-18", "exp-microbe", "Illustrative still — notes at the bench", "soil crust,microbes,still", "Mikhail Nilov / Pexels", lab2, "Paired with the soil-crust pigment contrast. Illustrative laboratory."],
  ["img-19", "exp-microbe", "Illustrative still — gloved sample tube", "epishelf,microbes,still", "Mikhail Nilov / Pexels", lab1, "Sample-handling still. Not an Antarctic specimen photograph."],
  ["img-20", "exp-space", "Illustrative still — aurora over peaks", "neutron monitor,Maitri,still", "John Kristian Petersen / Pexels", aurora3, "Night still for the September proton-event note. Not the Maitri sky."],
  ["img-21", "exp-space", "Illustrative still — safety glasses at a bench", "space weather,Maitri,still", "Mikhail Nilov / Pexels", lab3, "Instrument-care still for the neutron monitor hut note. Illustrative."],
  ["img-22", "exp-lakes", "Illustrative still — berg in open water", "lakes,Bharati,still", "Nacho Canepa / Pexels", berg, "Water still for the conductivity note. Not a Larsemann lake."],
  ["img-23", "exp-lakes", "Illustrative still — aerial icebergs", "active layer,Antarctica,still", "Sergey Guk / Pexels", aerial, "Landscape still for the thaw-depth explainer. Stock aerial."],
  ["img-24", "exp-heritage", "Illustrative still — ice coast at blue hour", "Dakshin Gangotri,heritage,still", "Francesco Ungaro / Pexels", ice, "Heritage-desk still. Not the 1980s station."],
  ["img-25", "exp-himalaya", "Illustrative still — whiteboard laboratory", "Himansh,black carbon,still", "https://kaboompics.com/ / Pexels", lab5, "Method still for the Himansh filter comparison. Not the Chandra Basin hut."],
  ["img-26", "exp-cryo", "Illustrative still — ice cave mouth", "energy balance,Himadri,still", "Han-Chieh Lee / Pexels", cave2, "Cold-surface still for the June energy-balance note. Illustrative."],
  ["img-27", "exp-isea44", "Illustrative still — researcher at a bench", "ozone,Bharati,still", "Mikhail Nilov / Pexels", lab6, "People still for the ozone and UV log. Not an expedition portrait."],
  ["img-28", "exp-sagar-2024", "Illustrative still — penguins on ice", "wildlife,Southern Ocean,still", "Jan Tang / Pexels", penguin1, "Wildlife still held for outreach tone. Not a count from the Sagar Nidhi line, and not a census."],
  ["img-29", "exp-sagar-2024", "Illustrative still — penguins on a berg", "wildlife,ice,still", "Hugo Sykes / Pexels", penguin2, "Second wildlife still. Illustrative only. Do not attach a population number."],
  ["img-30", "exp-madice", "Illustrative still — two penguins on snow", "wildlife,Antarctica,still", "Alex Bian / Pexels", penguin3, "Quiet wildlife still for Antarctic explainers. Not a Maitri survey."],
  ["img-31", "exp-microbe", "Illustrative still — chick under an adult", "wildlife,outreach,still", "David Selbert / Pexels", penguin4, "Outreach still. No biological claim should be generated from this frame alone."],
];

export const stillSeeds: StillSeed[] = stillRows.map((row) => ({
  id: row[0],
  expeditionId: row[1],
  title: row[2],
  tags: row[3].split(","),
  credit: row[4],
  url: row[5],
  caption: row[6],
}));

export const clipSeeds: ClipSeed[] = [
  {
    id: "vid-01",
    expeditionId: "exp-indarc9",
    title: "Illustrative clip — aurora over a cold coast",
    tags: ["aurora", "Himadri", "video"],
    credit: "Cristian Manieri / Pexels",
    url: "https://videos.pexels.com/video-files/11860943/11860943-uhd_3840_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/11860943/aurora-borealis-lofoten-islands-11860943.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:08",
    caption: "Short aurora clip for the IndARC story opener. Illustrative. It is not a Himadri timelapse.",
  },
  {
    id: "vid-02",
    expeditionId: "exp-space",
    title: "Illustrative clip — aurora timelapse",
    tags: ["aurora", "neutron monitor", "video"],
    credit: "Nico Becker / Pexels",
    url: "https://videos.pexels.com/video-files/5701989/5701989-uhd_3238_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/5701989/pexels-photo-5701989.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:05",
    caption: "Timelapse held beside the Maitri space-weather note. Not the September event, and not filmed at Maitri.",
  },
  {
    id: "vid-03",
    expeditionId: "exp-arctic-bc",
    title: "Illustrative clip — winter aurora",
    tags: ["albedo", "Arctic", "video"],
    credit: "Ken Cheung / Pexels",
    url: "https://videos.pexels.com/video-files/35092214/14866549_3840_2160_25fps.mp4",
    poster: "https://images.pexels.com/videos/35092214/4k-natural-4k-timelapse-at-night-aurora-35092214.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:09",
    caption: "Winter clip for the snow-albedo desk. Illustrative landscape, not the April snow course.",
  },
  {
    id: "vid-04",
    expeditionId: "exp-cryo",
    title: "Illustrative clip — aurora in a clear night",
    tags: ["energy balance", "Himadri", "video"],
    credit: "Frank Cone / Pexels",
    url: "https://videos.pexels.com/video-files/28889010/12505180_3840_2160_60fps.mp4",
    poster: "https://images.pexels.com/videos/28889010/aurora-time-lapse-28889010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:08",
    caption: "Night clip for the June energy-balance story. Stock footage.",
  },
  {
    id: "vid-05",
    expeditionId: "exp-sagar-2024",
    title: "Illustrative clip — cold-ocean swell",
    tags: ["Southern Ocean", "Sagar Nidhi", "video"],
    credit: "Yaroslav Shuraev / Pexels",
    url: "https://videos.pexels.com/video-files/6886135/6886135-uhd_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/6886135/arctic-landscape-arctic-nature-beautiful-nature-beauty-in-nature-6886135.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:29",
    caption: "Swell clip for the dimethyl sulfide cruise note. Not filmed from ORV Sagar Nidhi.",
  },
  {
    id: "vid-06",
    expeditionId: "exp-carbon",
    title: "Illustrative clip — aerial icebergs",
    tags: ["ice-rafted debris", "Southern Ocean", "video"],
    credit: "Cristian Manieri / Pexels",
    url: "https://videos.pexels.com/video-files/28988998/12538708_3840_2160_50fps.mp4",
    poster: "https://images.pexels.com/videos/28988998/flight-glacial-greenland-ice-28988998.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "1:33",
    caption: "Aerial ice for the ice-rafted debris explainer. Illustrative drone footage, not the Polar Front station.",
  },
  {
    id: "vid-07",
    expeditionId: "exp-madice",
    title: "Illustrative clip — glacial ice from above",
    tags: ["MADICE", "firn", "video"],
    credit: "Sergey Guk / Pexels",
    url: "https://videos.pexels.com/video-files/29477419/12688869_3840_2160_60fps.mp4",
    poster: "https://images.pexels.com/videos/29477419/4k-drone-4k-drone-footage-4k-drone-shot-4k-drone-video-29477419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:16",
    caption: "Aerial ice for the MADICE radar note. Not the traverse corridor.",
  },
  {
    id: "vid-08",
    expeditionId: "exp-lakes",
    title: "Illustrative clip — snow ridge from a drone",
    tags: ["active layer", "Bharati", "video"],
    credit: "Florian Delée / Pexels",
    url: "https://videos.pexels.com/video-files/30090907/12905857_3840_2160_30fps.mp4",
    poster: "https://images.pexels.com/videos/30090907/4k-video-nature-alps-austrian-alps-beautiful-landscape-by-drone-30090907.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:44",
    caption: "Snow-landscape clip for the thaw-depth note. The terrain is not the Larsemann Hills.",
  },
  {
    id: "vid-09",
    expeditionId: "exp-heritage",
    title: "Illustrative clip — snowbound shore",
    tags: ["Dakshin Gangotri", "heritage", "video"],
    credit: "Yaroslav Shuraev / Pexels",
    url: "https://videos.pexels.com/video-files/7042041/7042041-uhd_3840_2160_24fps.mp4",
    poster: "https://images.pexels.com/videos/7042041/blood-blood-mask-cold-cold-atmosphere-7042041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:14",
    caption: "Quiet shore clip for the heritage reanalysis. Not archival film from Dakshin Gangotri.",
  },
  {
    id: "vid-10",
    expeditionId: "exp-isea44",
    title: "Illustrative clip — blowing snow",
    tags: ["Bharati", "aerosol", "video"],
    credit: "Cyrus Photography / Pexels",
    url: "https://videos.pexels.com/video-files/14867477/14867477-hd_1920_1080_60fps.mp4",
    poster: "https://images.pexels.com/videos/14867477/winter-storm-2023-14867477.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:27",
    caption: "Blowing-snow clip for the aerosol desk. Illustrative weather, not the 14 January ship-corridor event.",
  },
  {
    id: "vid-11",
    expeditionId: "exp-himalaya",
    title: "Illustrative clip — winter aerial",
    tags: ["Himansh", "Himalaya", "video"],
    credit: "K / Pexels",
    url: "https://videos.pexels.com/video-files/30243095/12967991_3840_2160_24fps.mp4",
    poster: "https://images.pexels.com/videos/30243095/pexels-photo-30243095.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    duration: "0:18",
    caption: "Winter aerial held for the Himansh method note. Not the Chandra Basin station.",
  },
];

export const tableSeeds: TableSeed[] = [
  {
    id: "set-indarc-ts",
    expeditionId: "exp-indarc9",
    title: "IndARC-9 daily temperature and salinity extract",
    authors: "Dr. Meera Krishnan",
    year: 2024,
    tags: ["IndARC", "dataset", "temperature", "salinity", "Kongsfjorden"],
    fileUrl: "/data/indarc-ts.csv",
    abstract: "Eight daily rows from the IndARC-9 upper instruments, released with the mixed-layer note so editors can check the 86 m figure.",
    sections: [
      { heading: "What the table holds", page: 1, body: "The extract lists date, mixed-layer depth in metres, temperature at 10 m, and salinity at 10 m. The 12 March row shows the 91 m maximum." },
      { heading: "How to cite a cell", page: 1, body: "Cite the mixed-layer note for interpretation. The table alone does not explain Atlantic Water, which sits deeper than 10 m." },
    ],
  },
  {
    id: "set-bharati-aod",
    expeditionId: "exp-isea44",
    title: "Bharati January clear-sky AOD extract",
    authors: "Dr. Ananya Rao",
    year: 2025,
    tags: ["AOD", "Bharati", "dataset", "black carbon"],
    fileUrl: "/data/bharati-aod.csv",
    abstract: "Daily clear-sky aerosol optical depth and black carbon for the January days used in the Bharati report.",
    sections: [
      { heading: "Columns", page: 1, body: "Columns are date, AOD at 500 nm, and black carbon in ng m-3. The 14 January row holds the 78 ng m-3 peak." },
      { heading: "Mean", page: 1, body: "The report mean of 0.041 is the clear-sky average, not the average of every calendar day. Cloudy days are absent from this extract." },
    ],
  },
  {
    id: "set-maitri-iso",
    expeditionId: "exp-isea43",
    title: "Maitri shallow-core δ18O bag means",
    authors: "Dr. Vikram Sethi",
    year: 2024,
    tags: ["δ18O", "dataset", "Maitri", "ice core"],
    fileUrl: "/data/maitri-d18o.csv",
    abstract: "Bag-group δ18O means from the 21.4 m Schirmacher margin core.",
    sections: [
      { heading: "Values", page: 1, body: "The 2014-2018 group is 1.2 per mil higher than the 1998-2002 group, matching the report. Uncertainty remains 0.3 per mil." },
    ],
  },
  {
    id: "set-so-chl",
    expeditionId: "exp-sagar-2024",
    title: "Sagar Nidhi chlorophyll and DMS stations",
    authors: "Dr. Leela Menon",
    year: 2024,
    tags: ["dimethyl sulfide", "chlorophyll", "dataset", "Southern Ocean"],
    fileUrl: "/data/so-chl.csv",
    abstract: "Station latitudes with chlorophyll and dimethyl sulfide from the 2024 line.",
    sections: [
      { heading: "Peak", page: 1, body: "The 54.2°S station holds 1.8 mg m-3 chlorophyll and 240 ng S L-1 dimethyl sulfide, the cruise maxima quoted in the report." },
    ],
  },
  {
    id: "set-neutron",
    expeditionId: "exp-space",
    title: "Maitri neutron-monitor hourly anomaly",
    authors: "Dr. N. Chawla",
    year: 2024,
    tags: ["neutron monitor", "dataset", "Maitri", "space weather"],
    fileUrl: "/data/maitri-neutron.csv",
    abstract: "Hourly percent anomaly around the 12 September drop.",
    sections: [
      { heading: "Drop", page: 1, body: "The 06:00 UTC hour on 12 September is 7.5 percent below the 27-day mean. Neighbouring hours show the recovery toward 14 September." },
    ],
  },
  {
    id: "set-thaw",
    expeditionId: "exp-lakes",
    title: "Larsemann stake thaw depths, 28 January",
    authors: "Dr. Meera Krishnan",
    year: 2024,
    tags: ["active layer", "dataset", "permafrost", "Bharati"],
    fileUrl: "/data/larsemann-thaw.csv",
    abstract: "Fifteen stake depths used for the 62 cm mean active-layer figure.",
    sections: [
      { heading: "Mean", page: 1, body: "The fifteen stakes average 62 cm. Stake 7 is the 81 cm maximum. The 2017-2022 date-mean of 53 cm is stored in the note, not as a column." },
    ],
  },
];

export const HERO_IMAGE = aurora2;
export const SEED_VERSION = "aurora-seed-4";
