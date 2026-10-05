/**
 * Patient stories: real Shiland patients, shared with their families' permission.
 *
 * One entry per approved photo. Each entry feeds three places:
 *   1. /patients/ (the full gallery, newest first)
 *   2. the matching service pages listed in `services` (a "recent patients" strip)
 *   3. the homepage "recent patients" row
 *
 * Copy rules: plain language, no hyphens, no invented clinical details. Only say
 * what the clinic told us about the visit; anything more general must already be
 * true on the matching service page. Never include owner names or contact info.
 *
 * To add a patient: drop a 4:5 portrait JPG (about 1200x1500, EXIF stripped) in
 * src/assets/patients/ with a descriptive file name, import it below, and add an
 * entry at the top of the list.
 */
import type { ImageMetadata } from 'astro';
import gracie from '../assets/patients/gracie-spay-surgery-rock-hill-sc.jpg';
import foundKitten from '../assets/patients/found-kitten-checkup-rock-hill-sc.jpg';
import colt from '../assets/patients/colt-puppy-vaccines-rock-hill-sc.jpg';
import christinithAnn from '../assets/patients/christinith-ann-puppy-vaccines-rock-hill-sc.jpg';
import lucy from '../assets/patients/lucy-kitten-shiland-animal-hospital.jpg';

export interface PatientStory {
  /** Anchor id on /patients/ (e.g. /patients/#gracie). Stable once published. */
  id: string;
  /** The pet's name as the clinic gave it to us. */
  name: string;
  species: 'Dog' | 'Cat';
  /** Short visit label shown as a tag, e.g. "Spay surgery". */
  visit: string;
  /** Date of the visit or photo, YYYY-MM-DD. Drives sort order. */
  date: string;
  image: ImageMetadata;
  /** Descriptive alt text: who, what, where. */
  alt: string;
  /** One to three sentences. */
  story: string;
  /** Service slugs whose pages show this story. The first one is the card's link. */
  services: string[];
}

export const patients: PatientStory[] = [
  {
    id: 'gracie',
    name: 'Gracie',
    species: 'Dog',
    visit: 'Spay surgery',
    date: '2026-09-30',
    image: gracie,
    alt: 'Gracie, a fluffy cream colored dog, lying belly up with an upside down grin on the day of her spay at Shiland Animal Hospital in Rock Hill, SC',
    story:
      'Gracie came in for her spay and gave us this upside down grin on surgery day. Spays are done right here in our Rock Hill hospital, with an exam and screening first, monitored anesthesia, pain control, and clear instructions for recovery at home.',
    services: ['spay-and-neuter-rock-hill-fort-mill', 'pet-surgery-rock-hill-fort-mill'],
  },
  {
    id: 'rock-hill-baby',
    name: 'Rock Hill Baby',
    species: 'Cat',
    visit: 'Found kitten',
    date: '2026-09-30',
    image: foundKitten,
    alt: 'A tiny kitten found outside in Rock Hill, curled up in a blue towel on a soft blanket at Shiland Animal Hospital',
    story:
      'This tiny Rock Hill baby was found outside and brought in for a checkup. Found a kitten on its own? Keep it warm, skip the cow’s milk, and bring it in. We’ll check its health, estimate its age, look for fleas and scan for a microchip.',
    services: ['puppy-and-kitten-care-rock-hill-fort-mill'],
  },
  {
    id: 'colt',
    name: 'Colt',
    species: 'Dog',
    visit: 'Puppy vaccines',
    date: '2026-09-30',
    image: colt,
    alt: 'Colt, a black puppy with floppy ears and a green bandana, on the exam table for his puppy vaccines at Shiland Animal Hospital in Rock Hill, SC',
    story:
      'Colt came in for his puppy vaccines. Puppies usually start their series around 8 weeks old, with boosters every 3 to 4 weeks until about 16 weeks, and we set up the whole schedule at the first visit.',
    services: ['pet-vaccines-rock-hill-fort-mill', 'puppy-and-kitten-care-rock-hill-fort-mill'],
  },
  {
    id: 'christinith-ann',
    name: 'Christinith Ann',
    species: 'Dog',
    visit: 'Puppy vaccines',
    date: '2026-09-30',
    image: christinithAnn,
    alt: 'Christinith Ann, a brown puppy in a teal harness, standing on the exam table for her vaccines at Shiland Animal Hospital in Rock Hill, SC',
    story:
      'Christinith Ann stopped in for her puppy vaccines, teal harness and all. Core puppy vaccines protect against rabies, distemper and parvo, and we tailor the rest to your puppy’s lifestyle.',
    services: ['pet-vaccines-rock-hill-fort-mill', 'puppy-and-kitten-care-rock-hill-fort-mill'],
  },
  {
    id: 'lucy',
    name: 'Lucy',
    species: 'Cat',
    visit: 'Team kitten',
    date: '2026-09-30',
    image: lucy,
    alt: 'Lucy, a gray tabby kitten, standing on a desk at Shiland Animal Hospital in Rock Hill, SC',
    story:
      'Meet Lucy, our honorary staff member for the day. She belongs to one of our team members and spent the day keeping us company.',
    services: [],
  },
];

/** Newest first; entries with the same date keep their order above. */
export const patientsByDate: PatientStory[] = patients
  .map((p, i) => ({ p, i }))
  .sort((a, b) => b.p.date.localeCompare(a.p.date) || a.i - b.i)
  .map(({ p }) => p);

/** Stories tagged for one service page, newest first. */
export function patientsFor(serviceSlug: string): PatientStory[] {
  return patientsByDate.filter((p) => p.services.includes(serviceSlug));
}

/** Strip headings on service pages. Anything not listed uses the default. */
const stripHeadings: Record<string, string> = {
  'pet-vaccines-rock-hill-fort-mill': 'Recent vaccine visits in Rock Hill',
  'spay-and-neuter-rock-hill-fort-mill': 'Recent spay and neuter patients',
  'puppy-and-kitten-care-rock-hill-fort-mill': 'Recent puppy and kitten visits',
  'pet-surgery-rock-hill-fort-mill': 'Recent surgery patients',
};

export function stripHeading(serviceSlug: string): string {
  return stripHeadings[serviceSlug] ?? 'Recent patients';
}

/** "September 2026" style label for a YYYY-MM-DD date. */
export function monthLabel(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
