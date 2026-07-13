/**
 * Canonical business data — single source of truth.
 * Do NOT fabricate or alter any of these values. NAP must be identical everywhere.
 * Built to be reusable: swap this file to re-skin the template for another clinic.
 */

export const site = {
  name: 'Shiland Animal Hospital',
  /** Google Business Profile name (used in schema / rich contexts). */
  legalName: 'Shiland Animal Hospital & Urgent Care',
  tagline: 'Veterinarian in Rock Hill, SC — Walk-ins & Same-Day Care',

  phone: {
    display: '(803) 752-4950',
    href: 'tel:+18037524950',
    e164: '+1-803-752-4950',
  },

  email: 'shilandvet.info@gmail.com',

  address: {
    street: '2685 Celanese Road, Suite #123',
    streetShort: '2685 Celanese Rd, Suite #123',
    locality: 'Rock Hill',
    region: 'SC',
    postalCode: '29732',
    country: 'US',
  },

  geo: { lat: 34.9745339, lng: -81.0246755 },

  rating: {
    value: '5.0',
    count: 164,
    label: 'Excellent',
  },

  links: {
    googleReview: 'https://g.page/r/CUS6xCaiNJfsEBM/review',
    directions: 'https://maps.app.goo.gl/xRnS96p22ArJZT7DA',
    mapEmbed:
      'https://www.google.com/maps?q=Shiland+Animal+Hospital+2685+Celanese+Road+Rock+Hill+SC&output=embed',
    facebook: 'https://www.facebook.com/profile.php?id=61566394071601',
    instagram: 'https://www.instagram.com/shilandanimalhospital/',
  },

  /** Standalone off-hours scheduler. Set via BOOK_URL env at build time; falls back to phone. */
  bookUrl: import.meta.env.BOOK_URL || '',

  payment: [
    { name: 'Cherry', url: '/payment-plans/' },
    { name: 'CareCredit', url: 'https://www.carecredit.com/' },
    { name: 'Scratchpay', url: 'https://scratchpay.com/' },
  ],

  serviceArea: [
    'Rock Hill',
    'Fort Mill',
    'York',
    'Lancaster',
    'Chester',
    'Indian Land',
    'Pineville, NC',
    'Greater Charlotte',
  ],

  /** For schema areaServed (region-qualified). */
  areaServedSchema: [
    'Rock Hill, SC',
    'Fort Mill, SC',
    'York, SC',
    'Lancaster, SC',
    'Indian Land, SC',
    'Pineville, NC',
    'Charlotte, NC',
  ],

  /** Full geo sentence for service-page footers (mirrors the live pages' local signal). */
  serviceAreaSentence:
    'Rock Hill, Fort Mill, York, Lancaster, Chester, and Indian Land, SC, as well as Pineville, NC and the greater Charlotte, NC area.',

  doctor: {
    name: 'Dr. Sabah Kadhim',
    role: 'Owner & Veterinarian',
    // Do NOT publish specific degrees/schools/years until a real bio is supplied.
  },

  openedYear: 2024,
  timezone: 'America/New_York',

  /** Approved, live promotion. */
  promo: 'First wellness visit free',

  analytics: {
    ga4: 'GT-WF3LGK35',
    gtm: 'GTM-N8SQGHBR',
  },
} as const;

/**
 * Hours in the clinic timezone (America/New_York).
 * Indexed by JS Date.getDay(): 0 = Sunday … 6 = Saturday.
 * `null` = closed. Times are 24h decimal hours.
 */
export const hours: ({ open: number; close: number } | null)[] = [
  { open: 10, close: 20 }, // Sun
  { open: 8, close: 19 }, // Mon
  { open: 8, close: 19 }, // Tue
  null, // Wed — CLOSED
  { open: 8, close: 19 }, // Thu
  { open: 8, close: 19 }, // Fri
  { open: 9, close: 20 }, // Sat
];

/** Human-readable hours for footer/contact display, Monday-first. */
export const hoursDisplay: { day: string; hours: string; closed?: boolean }[] = [
  { day: 'Mon', hours: '8 AM – 7 PM' },
  { day: 'Tue', hours: '8 AM – 7 PM' },
  { day: 'Wed', hours: 'Closed', closed: true },
  { day: 'Thu', hours: '8 AM – 7 PM' },
  { day: 'Fri', hours: '8 AM – 7 PM' },
  { day: 'Sat', hours: '9 AM – 8 PM' },
  { day: 'Sun', hours: '10 AM – 8 PM' },
];

/**
 * The 14 service pages. Slugs carry SEO since Oct 2024 — preserve EXACTLY,
 * including the legacy "dentisty" typo. `icon` maps to the Icon.astro set.
 * metaTitle / metaDescription / h1 mirror the live pages for ranking continuity.
 */
export interface Service {
  slug: string;
  title: string; // nav / card label
  h1: string; // geo-modified page H1 (matches the live-site H1 for SEO continuity)
  metaTitle: string; // exact live Yoast title
  metaDescription: string; // exact live Yoast meta description
  icon: string;
  intro: string;
  /** Quick-scan capabilities list ("What's included"). */
  included: string[];
  /** Detailed body sections reconciled from the live page copy (de-Vetcelerated). */
  sections: { h: string; p?: string; list?: string[] }[];
}

export const services: Service[] = [
  {
    slug: 'pet-wellness-exam-rock-hill-fort-mill',
    title: 'Wellness Exams',
    h1: 'Pet Wellness Exam in Rock Hill',
    icon: 'stethoscope',
    metaTitle: 'Pet Wellness Exam Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'If your pet needs their annual vet appointment, contact Shiland Animal Hospital. We perform vet check-ups for cats and dogs in Rock Hill 6 days a week. Call us!',
    intro:
      'Routine vet exams are the foundation of a long, healthy life for your pet. Just like us, pets benefit from preventive care that helps detect potential issues early — before they develop into more serious problems.',
    included: [
      'Full nose-to-tail physical examination',
      'Weight, heart, and lung evaluation',
      'Parasite screening and prevention plan',
      'Heartworm testing',
      'Vaccine and lifestyle recommendations',
      'Nutrition, weight, and behavior guidance',
    ],
    sections: [
      {
        h: 'Annual veterinary check-ups: a must for every pet',
        p: 'During an annual wellness exam, our veterinarian gives your pet a thorough physical evaluation and looks for early signs of illness. Catching problems early gives your pet the best chance at a simple, successful treatment and a long, healthy life.',
      },
      {
        h: 'Year-round parasite protection',
        p: 'Fleas, ticks, and heartworms aren’t just a nuisance — they pose serious health risks. At each wellness exam we perform a heartworm test and recommend the best flea, tick, and heartworm preventatives for your pet’s lifestyle. Preventing parasites is far easier and less costly than treating them.',
      },
      {
        h: 'A partner in your pet’s lifelong health',
        p: 'Your pet’s wellness exam is the ideal time to raise any questions about their health, behavior, or diet. From choosing the right food to managing weight and behavior, our team offers personalized guidance — and same-day appointments are often available.',
      },
    ],
  },
  {
    slug: 'pet-vaccines-rock-hill-fort-mill',
    title: 'Vaccines',
    h1: 'Pet Vaccines in Rock Hill',
    icon: 'shield',
    metaTitle: 'Cat and Dog Vaccines Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'Pets need to get their yearly shots. Call Shiland Animal Hospital for veterinary vaccinations in Rock Hill, SC. Open 6 days a week with same-day availability.',
    intro:
      'Vaccinations are the best way to protect your pet from common, potentially life-threatening diseases — some of which can spread between pets and even to people. We offer both core and non-core vaccines tailored to your pet’s age, lifestyle, and health history.',
    included: [
      'Core dog vaccines (Rabies, DAPP/DHPP)',
      'Core cat vaccines (Rabies, FVRCP)',
      'Non-core / lifestyle vaccines',
      'Puppy and kitten vaccine series',
      'Boosters and reminders',
      'Same-day availability',
    ],
    sections: [
      {
        h: 'Vaccinations for dogs',
        p: 'Core dog vaccines include Rabies and the DAPP/DHPP vaccination. For dogs with particular lifestyles — dog parks, boarding, frequent contact with other dogs — we may recommend non-core vaccines such as Bordetella (kennel cough), Leptospirosis, and others.',
      },
      {
        h: 'Vaccinations for cats',
        p: 'Core cat vaccines include Rabies and the FVRCP vaccine, which protects against feline viral rhinotracheitis, calicivirus, and panleukopenia. For cats that go outdoors or live in multi-cat homes, non-core vaccines such as Feline Leukemia (FeLV) may be recommended.',
      },
      {
        h: 'Vaccine schedules for puppies and kittens',
        p: 'We typically begin the vaccine series around 8 weeks of age, with boosters every 3 to 4 weeks until about 16 weeks. Staying on schedule matters — if you miss a booster, call us right away so we can get your pet back on track.',
      },
    ],
  },
  {
    slug: 'spay-and-neuter-rock-hill-fort-mill',
    title: 'Spay & Neuter',
    h1: 'Spay & Neuter in Rock Hill',
    icon: 'scalpel',
    metaTitle: 'Pet Spay and Neuter Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'Shiland Animal Hospital proudly performs expert spay and neuter surgeries for cats and dogs in Rock Hill. Same-day consultations are available 6 days a week.',
    intro:
      'Spaying or neutering your pet is one of the most important decisions you can make for their long-term health and well-being. They’re among the most common surgeries we perform, with modern anesthesia and careful monitoring throughout.',
    included: [
      'Pre-surgical exam and screening',
      'Spay (females) and neuter (males)',
      'Modern, monitored anesthesia',
      'Multi-step pain management',
      'Recovery and discharge instructions',
      'Same-day consultations',
    ],
    sections: [
      {
        h: 'Why you should consider spaying your cat or dog',
        p: 'Spaying removes a female pet’s ovaries and uterus. Beyond preventing unwanted litters, it reduces the risk of uterine infections and mammary tumors, and eliminates the heat cycle — which usually means calmer behavior and less yowling or attempts to escape.',
      },
      {
        h: 'Reasons to neuter your dog or cat',
        p: 'Neutering removes a male pet’s testicles. It eliminates the risk of testicular cancer, reduces prostate problems, and curbs hormone-driven behaviors like marking, mounting, roaming, and aggression — which also lowers their risk of injury.',
      },
    ],
  },
  {
    slug: 'pet-dentisty-rock-hill-fort-mill',
    title: 'Dental Care',
    h1: 'Pet Dentistry in Rock Hill',
    icon: 'tooth',
    metaTitle: 'Cat & Dog Dentistry Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'For pets that need a dentist, Shiland Animal Hospital is here! We provide dental care, including pet teeth cleanings, in Rock Hill, SC. Open 6 days a week.',
    intro:
      'Oral health contributes to full-body health. Dental care is often overlooked until a problem arises — but without it, pets can develop plaque buildup, gingivitis, and periodontal disease, which can lead to tooth loss, infections, and pain.',
    included: [
      'Complete oral examination',
      'Teeth cleaning under anesthesia',
      'Plaque and tartar removal, polishing',
      'Tooth extractions and oral surgery',
      'Oral tumor and mass removal',
      'At-home dental care guidance',
    ],
    sections: [
      {
        h: 'Teeth cleanings: keeping your pet’s mouth healthy',
        p: 'We provide pet dental cleanings under anesthesia so your pet stays comfortable while we thoroughly clean their teeth — removing plaque and tartar, polishing, and assessing overall oral health. We recommend yearly cleanings to prevent gum disease and tooth decay.',
      },
      {
        h: 'Oral surgery for pet health',
        p: 'If more serious problems have developed, oral surgery may be needed. Our team performs simple and complicated tooth extractions, as well as removal of oral tumors and masses when necessary — always aiming for the least invasive treatment and a comfortable recovery.',
      },
      {
        h: 'How to know when your pet has a dental issue',
        p: 'Bad breath, drooling, difficulty eating, pawing at the mouth, or red and bleeding gums can all signal a dental problem. If you notice any of these signs, contact us for a dental exam — preventive care is the best way to avoid painful conditions.',
      },
    ],
  },
  {
    slug: 'pet-surgery-rock-hill-fort-mill',
    title: 'Surgery',
    h1: 'Pet Surgery in Rock Hill',
    icon: 'scalpel',
    metaTitle: 'Cat and Dog Surgery Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'When your pet needs a life-saving surgery, Shiland Animal Hospital is here. Our skilled veterinarians perform surgery for pets in Rock Hill. Book a consult!',
    intro:
      'The thought of surgery for your pet can be stressful — but at Shiland Animal Hospital, your furry family member is in caring, experienced hands. We offer both routine and more advanced procedures, with modern anesthesia and continuous monitoring.',
    included: [
      'Spay and neuter',
      'Mass and tumor removal',
      'Exploratory surgery',
      'Foreign body removal',
      'Continuous anesthetic monitoring',
      'Comprehensive pain management',
    ],
    sections: [
      {
        h: 'Surgeries performed by our veterinarians',
        p: 'Our team is skilled in a range of surgical procedures to meet your pet’s needs, including:',
        list: [
          'Spay and neuter',
          'Exploratory surgery',
          'Foreign body removal',
          'Enterotomy (intestinal blockages)',
          'Gastrotomy (stomach)',
          'Splenectomy (spleen removal)',
          'Cystotomy (bladder)',
          'Mastectomy',
          'Mass or tumor removal',
        ],
      },
      {
        h: 'Safe, monitored procedures',
        p: 'Every surgery includes a pre-surgical evaluation, modern anesthesia with continuous monitoring, and a thoughtful pain-management plan. Because we’re equipped for surgery in-house, we handle many cases other clinics refer out — close to home in Rock Hill.',
      },
    ],
  },
  {
    slug: 'pet-x-rays-rock-hill-fort-mill',
    title: 'X-rays',
    h1: 'Pet X-rays in Rock Hill',
    icon: 'xray',
    metaTitle: 'Dog and Cat X-rays Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'Your pet is limping. Do they have a broken bone? Find out at Shiland Animal Hospital. We perform X-rays for the pets of Rock Hill, SC. Open 6 days a week.',
    intro:
      'A physical exam is helpful, but it’s not always enough. Our digital pet radiography (X-ray) gives us a detailed look at your pet’s internal structures — helping us diagnose broken bones and internal issues quickly, right here on-site.',
    included: [
      'Digital radiography (X-ray)',
      'Bone, joint, and fracture imaging',
      'Chest and abdominal imaging',
      'Foreign-object detection',
      'Fast, on-site results',
      'Imaging for surgical planning',
    ],
    sections: [
      {
        h: 'Why your pet may need an X-ray',
        list: [
          'Injuries — fractures and bone injuries after an accident, fall, or limping',
          'Digestive issues — foreign objects, blockages, or abnormalities',
          'Respiratory concerns — evaluating the lungs and chest',
          'Orthopedic problems — arthritis, hip dysplasia, and joint conditions',
          'Abdominal concerns — bladder stones, tumors, or enlarged organs',
        ],
      },
      {
        h: 'X-ray safety',
        p: 'X-rays work by passing a very small amount of radiation through your pet’s body to create an image. The exposure is minimal and safe, and digital imaging lets us capture detailed results in minutes so we can move quickly toward the right treatment.',
      },
    ],
  },
  {
    slug: 'in-house-pet-diagnostics-rock-hill-fort-mill',
    title: 'In-House Lab Work',
    h1: 'In-House Pet Diagnostics in Rock Hill',
    icon: 'flask',
    metaTitle: 'Diagnostic Pet Tests Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'Our veterinary lab at Shiland Animal Hospital performs diagnostics for cats and dogs in Rock Hill, SC. We can perform blood and heartworm tests in-house.',
    intro:
      'When making decisions about your pet’s health, you need timely, accurate information. Our in-house lab performs comprehensive diagnostics for cats and dogs — giving us immediate insight instead of waiting days for outside results.',
    included: [
      'Complete Blood Count (CBC)',
      'Chemistry panels',
      'Urinalysis and fecal exams',
      'Heartworm testing',
      'Cortisol and cytology testing',
      'Same-visit results',
    ],
    sections: [
      {
        h: 'Why your pet should get annual diagnostic testing',
        p: 'Even if your pet appears healthy, routine tests like blood work, urinalysis, and fecal exams can detect illness before symptoms develop. Conditions such as kidney disease, liver disease, diabetes, and hormonal imbalances often show up in testing long before outward signs appear.',
      },
      {
        h: 'A peek into our lab',
        p: 'We use advanced in-house equipment to run essential tests, including:',
        list: [
          'Complete Blood Count (CBC) — detects infections, anemia, and blood disorders',
          'Chemistry Panel — evaluates liver, kidney, electrolyte, and blood-sugar levels',
          'Cortisol Testing — for conditions like Cushing’s and Addison’s disease',
          'Fecal Exam — detects intestinal parasites',
          'Urinalysis — assesses kidney and urinary health',
          'Heartworm Testing, Cytology, and Parvo Testing',
        ],
      },
    ],
  },
  {
    slug: 'pet-microchipping-rock-hill-fort-mill',
    title: 'Microchipping',
    h1: 'Pet Microchipping in Rock Hill',
    icon: 'chip',
    metaTitle: 'Pet Microchipping Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'Nervous about losing your pet? Get them microchipped! Shiland Animal Hospital performs microchipping for dogs and cats in Rock Hill, SC. Schedule today!',
    intro:
      'As pet parents, we all worry about our fur babies getting lost. Microchipping is a simple, permanent way to keep your pet safe — and give you peace of mind that they can be identified and returned to you.',
    included: [
      'Quick, low-stress microchip placement',
      'Permanent, tamper-proof pet ID',
      'No anesthesia required',
      'Can be done at any visit',
      'Registration guidance',
      'Works with universal scanners nationwide',
    ],
    sections: [
      {
        h: 'What is a microchip for pets?',
        p: 'A pet microchip is a very small device implanted just beneath the skin, typically between the shoulder blades. It’s not a GPS tracker — instead it holds a unique ID number that links to your contact details. Unlike collars and tags, it can’t fall off or wear out.',
      },
      {
        h: 'The microchipping process',
        p: 'We insert the microchip just under your pet’s skin with a needle. The procedure takes only moments and requires no anesthesia, so it can be done during a regular wellness visit. Remember to keep your registered contact information current — a chip only works if the details are up to date.',
      },
      {
        h: 'Permanent ID to the rescue',
        p: 'If a lost pet is found, veterinarians, shelters, and rescues can scan the chip and use the ID number to reunite them with you. Microchipping is an important step to help your pet come home — even if they slip out without their collar.',
      },
    ],
  },
  {
    slug: 'puppy-and-kitten-care-rock-hill-fort-mill',
    title: 'Puppy & Kitten Care',
    h1: 'Puppy & Kitten Care in Rock Hill',
    icon: 'paw',
    metaTitle: 'Puppy and Kitten Vet Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'Shiland Animal Hospital loves performing first veterinary exams and vaccines for puppies and kittens in Rock Hill. We are open 6 days a week and evenings.',
    intro:
      'Bringing home a new puppy or kitten is an exciting time. Start your fur baby off on the right paw at Shiland Animal Hospital — the first months of life set the stage for a healthy adulthood.',
    included: [
      'First wellness exam and physical',
      'Puppy and kitten vaccine series',
      'Parasite testing, deworming, and prevention',
      'Nutrition and growth guidance',
      'Spay and neuter planning',
      'Microchipping',
    ],
    sections: [
      {
        h: 'Their very first vet visit',
        p: 'At the first wellness exam, our veterinarian performs a thorough physical — checking weight, eyes, ears, heart, lungs, and more — to make sure your new pet is off to a healthy start. We’ll also set up their vaccine schedule and parasite prevention.',
      },
      {
        h: 'Tips for raising healthy puppies and kittens',
        list: [
          'Socialize early — after their vaccines, expose them to new people, pets, and places',
          'Start training right away with basic commands',
          'Provide age-appropriate nutrition for growing bodies',
          'Keep them active to build strong muscles and joints',
          'Introduce grooming and dental habits early',
          'Stay on top of parasite prevention',
        ],
      },
    ],
  },
  {
    slug: 'senior-pet-care-rock-hill-fort-mill',
    title: 'Senior Pet Care',
    h1: 'Senior Pet Care in Rock Hill',
    icon: 'heart',
    metaTitle: 'Senior Pet Care Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'When your aging pet needs care for thyroid issues or arthritis, trust Shiland Animal Hospital! We care for senior cats and dogs in the Rock Hill, SC area.',
    intro:
      'As pets get older, their health needs evolve, and specialized care becomes even more important. Senior pets — much like older humans — benefit from more frequent attention to manage age-related conditions and maintain their quality of life.',
    included: [
      'Senior wellness exams',
      'Annual senior blood panels',
      'Arthritis and mobility support',
      'Chronic-condition management',
      'Nutrition and weight management',
      'Quality-of-life planning',
    ],
    sections: [
      {
        h: 'The importance of annual blood work for senior pets',
        p: 'As pets age, they become more prone to conditions that may not show obvious symptoms right away. Annual senior blood panels give us a comprehensive view of your pet’s internal health — helping us catch problems early and track known conditions over time.',
      },
      {
        h: 'Common senior conditions we treat',
        list: [
          'Arthritis and joint pain',
          'Thyroid issues (hypothyroidism or hyperthyroidism)',
          'Diabetes',
          'Kidney disease',
          'Liver disease',
        ],
      },
      {
        h: 'Nutrition & weight management',
        p: 'Maintaining a healthy weight becomes more challenging with age, especially alongside conditions like arthritis or diabetes. Our team helps you find the right balance so your senior pet stays as comfortable and active as possible.',
      },
    ],
  },
  {
    slug: 'pet-allergies-and-skin-conditions-rock-hill-fort-mill',
    title: 'Allergies & Skin',
    h1: 'Pet Allergies & Skin Conditions in Rock Hill',
    icon: 'sparkle',
    metaTitle: 'Allergy & Skin Care Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'When your pet has a skin problem, call Shiland Animal Hospital. We treat skin issues, infections, hot spots, and allergies for cats and dogs in Rock Hill.',
    intro:
      'Allergies and other skin conditions can cause your pet real discomfort — itching, redness, and irritation that affect their quality of life. Testing and treatments are available to bring your pet lasting relief.',
    included: [
      'Allergy evaluation and testing',
      'Skin scraping and cytology',
      'Fungal culture (e.g. ringworm)',
      'Ear and skin infection treatment',
      'Flea, mite, and parasite control',
      'Long-term relief and management plans',
    ],
    sections: [
      {
        h: 'Recognizing allergies & skin conditions in pets',
        p: 'Pets can be allergic to pollen, dust, mold, fleas, certain foods, or products like shampoos. Common signs include excessive itching, licking, or chewing. Cats and dogs can also develop hot spots, infections, ringworm, and other skin conditions with overlapping symptoms.',
      },
      {
        h: 'Diagnosing your pet’s skin issues',
        p: 'To pinpoint the cause, our veterinarians use in-house skin and allergy testing, which may include:',
        list: [
          'Skin scraping — checks for mites, infections, or underlying issues',
          'Cytology — examines skin or ear cells for infection or inflammation',
          'Fungal culture — diagnoses fungal infections like ringworm',
          'Blood work — rules out underlying health problems',
        ],
      },
      {
        h: 'Soothing dermatology treatments',
        p: 'Once we understand the cause, we build a treatment plan to calm the itch and heal the skin — leading to renewed comfort and skin health for your pet.',
      },
    ],
  },
  {
    slug: 'pet-urgent-care-rock-hill-fort-mill',
    title: 'Urgent Care',
    h1: 'Pet Urgent Care in Rock Hill',
    icon: 'clock',
    metaTitle: 'Cat & Dog Urgent Care Rock Hill | Shiland Animal Hospital',
    metaDescription:
      'When your pet is sick or injured, get care at Shiland Animal Hospital. We treat cats and dogs six days a week and evenings in Rock Hill, SC. Walk-ins welcome.',
    intro:
      'Not every pet health concern is life-threatening, but some issues still need to be addressed quickly. When your pet is unwell and you’re worried, we offer same-day attention six days a week — including evenings, with walk-ins welcome.',
    included: [
      'Same-day sick visits',
      'On-site lab and X-ray for fast diagnosis',
      'Wound and infection care',
      'Vomiting and diarrhea evaluation',
      'Limping and lameness assessment',
      'Walk-ins welcome',
    ],
    sections: [
      {
        h: 'When to seek urgent care for your pet',
        p: 'If your pet is showing signs of illness or discomfort, it’s important to address the issue before it worsens. Common reasons to seek urgent care include:',
        list: [
          'Vomiting or diarrhea',
          'Hot spots or skin infections',
          'Skin rashes or itching',
          'Minor allergic reactions',
          'Limping or sudden lameness',
          'Ear infections',
          'Coughing or sneezing',
          'Eye irritation or discharge',
          'Parasites',
        ],
      },
      {
        h: 'Close to home, when you need it',
        p: 'You shouldn’t have to drive to Charlotte and wait hours when your pet needs help today. Call ahead or walk in — with an in-house lab and X-ray, we can diagnose quickly and start treatment the same visit.',
      },
    ],
  },
  {
    slug: 'pet-emergency-care-rock-hill-fort-mill',
    title: 'Emergency Care',
    h1: 'Emergency Veterinarian in Rock Hill',
    icon: 'bolt',
    metaTitle: 'Emergency Veterinarian Rock Hill | Shiland Animal Hospital',
    metaDescription:
      'Shiland Animal Hospital is an emergency vet in Rock Hill, SC. Treating cats and dogs 6 days a week and evenings. No overnight. Walk-ins welcome. (803) 752-4950',
    intro:
      'You never expect an emergency to happen to your pet — but emergencies can happen at any time. Shiland Animal Hospital provides life-saving care for cats and dogs in distress, six days a week including evenings.',
    included: [
      'Emergency surgery on-site',
      'Foreign-body and exploratory surgery',
      'Trauma and laceration repair',
      'Rapid in-house diagnostics',
      'Critical-care stabilization',
      'Call ahead so our team can prepare',
    ],
    sections: [
      {
        h: 'What to do during a pet emergency',
        p: 'If your pet is experiencing a life-threatening emergency, call our clinic right away to let us know you’re coming so our team can prepare. Please note we provide emergency services during business hours but do not offer overnight care — if your pet needs continued critical care, we can refer you to a trusted 24/7 hospital.',
      },
      {
        h: 'Common reasons to seek an emergency vet',
        list: [
          'Ingestion of toxic substances (chocolate, medications, etc.)',
          'Severe allergic reactions (swelling or difficulty breathing)',
          'Bloat or abdominal swelling (especially large dogs)',
          'Birthing complications',
          'Trauma, wounds, or uncontrolled bleeding',
          'Difficulty breathing or collapse',
        ],
      },
      {
        h: 'Emergency pet surgery',
        p: 'Because we’re equipped for surgery in-house — including exploratory surgery, foreign body removal, and more — many emergencies can be treated right here in Rock Hill instead of a long drive to a referral ER.',
      },
    ],
  },
  {
    slug: 'pet-end-of-life-care-rock-hill-fort-mill',
    title: 'End-of-Life Care',
    h1: 'Pet End-of-Life Care in Rock Hill',
    icon: 'dove',
    metaTitle: 'Pet Euthanasia Rock Hill, SC | Shiland Animal Hospital',
    metaDescription:
      'Shiland Animal Hospital has end-of-life care for cats and dogs. Hospice, pain management, and euthanasia for Rock Hill pets. Here for their peaceful passing.',
    intro:
      'Saying goodbye to a pet you have loved is never easy. At Shiland Animal Hospital, we understand how difficult it is to say farewell, and we’re here to provide a peaceful ending with dignity for your pet and support for your family.',
    included: [
      'Quality-of-life assessments',
      'Hospice and pain management',
      'Peaceful, private euthanasia',
      'Compassionate, unhurried support',
      'Cremation options through our partner',
      'Guidance through every step',
    ],
    sections: [
      {
        h: 'Examining your pet’s quality of life',
        p: 'Deciding when it’s time is never easy, and we’ll guide you through it. Our quality-of-life exams assess your pet’s comfort and overall health, and we’ll discuss whether hospice care or pain management might help in the short term.',
      },
      {
        h: 'A gentle goodbye',
        p: 'When euthanasia is the most compassionate choice, we make the process as peaceful and stress-free as possible. Your pet receives a sedative to relax them, followed by a gentle medication. You’re welcome to stay with your pet, or we can be present privately — whatever brings you comfort.',
      },
      {
        h: 'Cremation options',
        p: 'Afterward, we offer cremation services through a trusted crematorium partner. You can choose private cremation, where your pet’s ashes are returned to you, or communal cremation — whichever feels right for your family.',
      },
    ],
  },
];
