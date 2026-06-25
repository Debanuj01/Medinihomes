const logo = (initials, bg) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" rx="24" fill="${bg}"/><text x="80" y="98" font-family="Poppins, sans-serif" font-size="56" font-weight="700" fill="#FFFFFF" text-anchor="middle">${initials}</text></svg>`
  )}`

export const PROMOTERS = [
  {
    id: 'shanti-developers',
    name: 'Shanti Developers',
    logo: logo('SD', '%230B1F3A'),
    foundedYear: 2009,
    yearsExperience: 17,
    headquarters: 'Medinipur Town',
    completedProjects: 14,
    ongoingProjects: 3,
    rating: 4.4,
    reviewCount: 312,
    reraRegistration: 'WB/RERA/PROM/2009/00451',
    description:
      'One of the longest-running developers in Paschim Medinipur, Shanti Developers built its reputation on mid-market 2 and 3 BHK projects in and around Medinipur Town before expanding into Contai and the Digha coastal corridor. The firm is known locally for handing over projects close to original possession dates — a track record buyers cite often in reviews.',
    specialties: ['Mid-market apartments', 'Township planning', 'Coastal residential'],
    contact: {
      phone: '+91 98300 11234',
      email: 'sales@shantideveloperswb.in',
      office: 'Vidyasagar Road, Medinipur Town, West Bengal 721101',
    },
    portfolioGallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=450&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=600&h=450&fit=crop&q=80',
    ],
  },
  {
    id: 'medinipur-infra',
    name: 'Medinipur Infra Group',
    logo: logo('MIG', '%23D4AF37'),
    foundedYear: 2014,
    yearsExperience: 12,
    headquarters: 'Kharagpur',
    completedProjects: 9,
    ongoingProjects: 4,
    rating: 4.5,
    reviewCount: 268,
    reraRegistration: 'WB/RERA/PROM/2014/00622',
    description:
      'Medinipur Infra Group builds the largest-format projects in this region — its Haldia and Digha developments are both among the biggest single projects in their respective towns. The group has institutional backing from a Kolkata-based NBFC, which shows in faster construction timelines than most local peers, though buyers note its customer service is more process-driven and less personal than smaller developers.',
    specialties: ['Large-format townships', 'Premium high-rise', 'Institutional housing'],
    contact: {
      phone: '+91 98301 56789',
      email: 'info@medinipurinfra.com',
      office: 'Inda, Kharagpur, West Bengal 721302',
    },
    portfolioGallery: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&h=450&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=450&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=600&h=450&fit=crop&q=80',
    ],
  },
  {
    id: 'eastern-habitat',
    name: 'Eastern Habitat Projects',
    logo: logo('EHP', '%232563EB'),
    foundedYear: 2017,
    yearsExperience: 9,
    headquarters: 'Tamluk',
    completedProjects: 6,
    ongoingProjects: 2,
    rating: 4.0,
    reviewCount: 184,
    reraRegistration: 'WB/RERA/PROM/2017/00789',
    description:
      'Eastern Habitat Projects is the newest of the three developers active on MediniHomes, and has deliberately focused on the budget and first-time-buyer segment — 1 and 2 BHK units in Kharagpur, Haldia and Egra priced below what Shanti Developers or Medinipur Infra Group typically build. Reviews are positive but more mixed than the older firms, reflecting a smaller track record.',
    specialties: ['Affordable housing', 'First-time buyer projects', 'Compact 1-2 BHK formats'],
    contact: {
      phone: '+91 90072 34561',
      email: 'contact@easternhabitat.in',
      office: 'Hospital Road, Tamluk, West Bengal 721636',
    },
    portfolioGallery: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=450&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=450&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop&q=80',
    ],
  },
  {
    id: 'coastal-crest-builders',
    name: 'Coastal Crest Builders',
    logo: logo('CCB', '%2322C55E'),
    foundedYear: 2019,
    yearsExperience: 7,
    headquarters: 'Digha',
    completedProjects: 3,
    ongoingProjects: 2,
    rating: 4.2,
    reviewCount: 97,
    reraRegistration: 'WB/RERA/PROM/2019/00903',
    description:
      'A Digha-focused boutique developer with no current listings on MediniHomes yet, but onboarding for Q3 2026. Coastal Crest Builders specializes exclusively in the Digha–Mandarmani–Shankarpur coastal stretch and is best known for shorter, low-rise builds that work within the area\u2019s coastal construction restrictions.',
    specialties: ['Coastal low-rise', 'Holiday-home developments'],
    contact: {
      phone: '+91 98765 43210',
      email: 'hello@coastalcrest.in',
      office: 'Digha–Chandaneshwar Road, Digha, West Bengal 721428',
    },
    portfolioGallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=450&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&h=450&fit=crop&q=80',
    ],
  },
  {
    id: 'kanthi-builders-cooperative',
    name: 'Kanthi Builders Cooperative',
    logo: logo('KBC', '%230B1F3A'),
    foundedYear: 2011,
    yearsExperience: 15,
    headquarters: 'Contai',
    completedProjects: 11,
    ongoingProjects: 1,
    rating: 3.9,
    reviewCount: 156,
    reraRegistration: 'WB/RERA/PROM/2011/00512',
    description:
      'A cooperative structure of independent local builders operating under one shared brand across Contai and Egra. Project quality varies more than with single-company developers since each project is effectively run by a different member-builder, which shows up in a wider spread of reviews than its peers.',
    specialties: ['Cooperative-built housing', 'Contai–Egra corridor'],
    contact: {
      phone: '+91 94340 98765',
      email: 'admin@kanthibuilders.coop',
      office: 'College Junction, Contai, West Bengal 721401',
    },
    portfolioGallery: [
      'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=600&h=450&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop&q=80',
    ],
  },
  {
    id: 'haldia-port-homes',
    name: 'Haldia Port Homes Pvt. Ltd.',
    logo: logo('HPH', '%23D4AF37'),
    foundedYear: 2016,
    yearsExperience: 10,
    headquarters: 'Haldia',
    completedProjects: 5,
    ongoingProjects: 1,
    rating: 4.1,
    reviewCount: 142,
    reraRegistration: 'WB/RERA/PROM/2016/00671',
    description:
      'A Haldia-only developer with close ties to the port and refinery employers in the area — most of its buyers are referred directly through employer housing-assistance programs rather than open-market marketing. No active MediniHomes listings currently; onboarding in progress.',
    specialties: ['Employer-linked housing', 'Industrial-town residential'],
    contact: {
      phone: '+91 98300 22456',
      email: 'sales@haldiaporthomes.com',
      office: 'Durgachak, Haldia, West Bengal 721602',
    },
    portfolioGallery: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&h=450&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=450&fit=crop&q=80',
    ],
  },
]

export const getPromoterById = (id) => PROMOTERS.find((p) => p.id === id)
