// Real subdivisions/towns across Purba Medinipur & Paschim Medinipur, West Bengal.
// Coordinates are approximate town-centre values sourced from public geographic records.

export const TOWNS = [
  {
    id: 'medinipur-town',
    name: 'Medinipur Town',
    district: 'Paschim Medinipur',
    lat: 22.4211,
    lng: 87.3226,
    blurb: 'District headquarters with established schools, the Kangsabati riverfront and a steady government-job economy.',
    avgPricePerSqft: 3150,
  },
  {
    id: 'kharagpur',
    name: 'Kharagpur',
    district: 'Paschim Medinipur',
    lat: 22.3302,
    lng: 87.3237,
    blurb: 'Anchored by IIT Kharagpur and the railway settlement — the district\u2019s strongest rental demand from students and railway staff.',
    avgPricePerSqft: 3400,
  },
  {
    id: 'tamluk',
    name: 'Tamluk',
    district: 'Purba Medinipur',
    lat: 22.30,
    lng: 87.92,
    blurb: 'The administrative seat of Purba Medinipur, built around Tamluk Junction and the historic Bargabhima temple precinct.',
    avgPricePerSqft: 3050,
  },
  {
    id: 'haldia',
    name: 'Haldia',
    district: 'Purba Medinipur',
    lat: 22.03,
    lng: 88.06,
    blurb: 'Port-and-petrochemical town with the district\u2019s highest salaried population — strong demand from refinery and port staff.',
    avgPricePerSqft: 3650,
  },
  {
    id: 'contai',
    name: 'Contai',
    district: 'Purba Medinipur',
    lat: 21.78,
    lng: 87.75,
    blurb: 'Also called Kanthi — a trading town close to the coast, popular with families wanting Digha within easy reach.',
    avgPricePerSqft: 2850,
  },
  {
    id: 'egra',
    name: 'Egra',
    district: 'Purba Medinipur',
    lat: 21.90,
    lng: 87.53,
    blurb: 'A quieter market town on the Egra–Contai corridor, increasingly drawing buyers priced out of Contai.',
    avgPricePerSqft: 2600,
  },
  {
    id: 'digha',
    name: 'Digha',
    district: 'Purba Medinipur',
    lat: 21.6275,
    lng: 87.5025,
    blurb: 'West Bengal\u2019s best-known seaside town — a small but fast-growing market for holiday homes and rental-yield apartments.',
    avgPricePerSqft: 4200,
  },
]

export const getTownById = (id) => TOWNS.find((t) => t.id === id)

// Listing counts are derived from PROPERTIES rather than stored statically,
// so the two data files can never drift out of sync.
export const getTownsWithCounts = (properties) =>
  TOWNS.map((town) => ({
    ...town,
    listingCount: properties.filter((p) => p.townId === town.id).length,
  }))

