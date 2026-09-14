// The website's launch content. `npm run seed` loads this into MongoDB so the
// admin panel has real rows to edit from day one.

export const services = [
  { slug: 'profile-evaluation', title: 'Profile evaluation', icon: 'target', description: 'We map your academics, budget, test scores and career goal to a realistic target list — ambitious, moderate and safe.' },
  { slug: 'university-shortlisting', title: 'University shortlisting', icon: 'search', description: 'Course-level comparison on ranking, fees, intake, scholarships, post-study work rights and graduate outcomes.' },
  { slug: 'sop-lor-essays', title: 'SOP, LOR & essays', icon: 'document', description: 'Structured drafting sessions with editors who have read thousands of admits — your voice, sharpened, never templated.' },
  { slug: 'test-prep', title: 'IELTS / TOEFL / GRE prep', icon: 'shield-check', description: 'Diagnostic test, a 6-week plan and small-batch live classes with weekly mocks and score-band tracking.' },
  { slug: 'visa-documentation', title: 'Visa & documentation', icon: 'briefcase', description: 'Financial documents, SOP for visa, mock interviews and file review before submission — the step most applications fail on.' },
  { slug: 'loans-scholarships', title: 'Loans & scholarships', icon: 'coins', description: 'Merit and need-based scholarship applications, plus collateral-free education loan options from partner lenders.' },
];

export const destinations = [
  {
    slug: 'usa', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/New_York_City_skyline_from_ferry.jpg/960px-New_York_City_skyline_from_ferry.jpg', name: 'United States', flag: '🇺🇸', tag: 'STEM OPT 3 yrs', showOnHome: true,
    bg: 'linear-gradient(155deg,#2C4A7C,#0C1E3B)',
    blurb: 'Research funding, assistantships and the widest choice of specialisations anywhere.',
    meta: ['Fall / Spring', '₹24 – 53 Lakh / yr', 'F-1 visa'],
    description: 'The deepest pool of specialisations, research funding and assistantships — and the biggest range of costs, from state schools to the Ivies.',
    facts: [
      { label: 'Tuition / year', value: '₹24 – 53 Lakh' },
      { label: 'Living cost / year', value: '₹11 – 19 Lakh' },
      { label: 'Intakes', value: 'Fall · Spring' },
      { label: 'Post-study work', value: '1 yr OPT · 3 yrs STEM' },
      { label: 'Tests', value: 'IELTS/TOEFL + GRE/GMAT' },
    ],
    tags: ['Research funding', 'Assistantships', 'STEM OPT'],
  },
  {
    slug: 'uk', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/London_Tower_Bridge_%289816168804%29.jpg/960px-London_Tower_Bridge_%289816168804%29.jpg', name: 'United Kingdom', flag: '🇬🇧', tag: '1-year masters', showOnHome: true,
    bg: 'linear-gradient(155deg,#7C2C3B,#2B0E17)',
    blurb: 'Finish a masters in twelve months and stay two more years on the Graduate Route.',
    meta: ['Sep / Jan', '₹18 – 39 Lakh / yr', 'Student visa'],
    description: 'One-year masters means one year of tuition and living cost. Fastest route from application to a foreign degree on your CV.',
    facts: [
      { label: 'Tuition / year', value: '₹18 – 39 Lakh' },
      { label: 'Living cost / year', value: '₹13 – 19 Lakh' },
      { label: 'Intakes', value: 'September · January' },
      { label: 'Post-study work', value: '2 yrs Graduate Route' },
      { label: 'Tests', value: 'IELTS UKVI' },
    ],
    tags: ['1-year masters', 'No GRE', 'Russell Group'],
  },
  {
    slug: 'canada', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Toronto_Skyline_viewed_from_Centre_Island.jpg/960px-Toronto_Skyline_viewed_from_Centre_Island.jpg', name: 'Canada', flag: '🇨🇦', tag: 'PR pathway', showOnHome: true,
    bg: 'linear-gradient(155deg,#8A3A2E,#2A0F0A)',
    blurb: 'Affordable tuition, a 3-year post-study work permit and a clear route to residency.',
    meta: ['Sep / Jan / May', '₹12 – 22 Lakh / yr', 'Study permit'],
    description: 'The most balanced option — moderate fees, three intakes a year, a long work permit and the clearest permanent-residency pathway.',
    facts: [
      { label: 'Tuition / year', value: '₹12 – 22 Lakh' },
      { label: 'Living cost / year', value: '₹8.5 – 12 Lakh' },
      { label: 'Intakes', value: 'Sep · Jan · May' },
      { label: 'Post-study work', value: 'Up to 3 yrs PGWP' },
      { label: 'Tests', value: 'IELTS / PTE' },
    ],
    tags: ['PR pathway', 'SDS route', 'Co-op programs'],
  },
  {
    slug: 'australia', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/The_Sydney_Opera_House._%2810531420586%29.jpg/960px-The_Sydney_Opera_House._%2810531420586%29.jpg', name: 'Australia', flag: '🇦🇺', tag: 'Work while you study', showOnHome: true,
    bg: 'linear-gradient(155deg,#1F6B63,#07211F)',
    blurb: 'Strong nursing, IT and engineering pipelines with 48-hour fortnightly work rights.',
    meta: ['Feb / Jul', '₹15 – 31 Lakh / yr', 'Subclass 500'],
    description: 'Strong for nursing, IT, engineering and hospitality, with generous part-time work rights and a skilled-migration points system.',
    facts: [
      { label: 'Tuition / year', value: '₹15 – 31 Lakh' },
      { label: 'Living cost / year', value: '₹14 – 18 Lakh' },
      { label: 'Intakes', value: 'February · July' },
      { label: 'Post-study work', value: '2 – 4 yrs subclass 485' },
      { label: 'Tests', value: 'IELTS / PTE' },
    ],
    tags: ['Group of Eight', 'Regional bonus', 'Nursing'],
  },
  {
    slug: 'germany', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Brandenburg_gate_Berlin_with_Christmas_tree_at_night_2022-12-09_03.jpg/960px-Brandenburg_gate_Berlin_with_Christmas_tree_at_night_2022-12-09_03.jpg', name: 'Germany', flag: '🇩🇪', tag: 'Low / no tuition', showOnHome: true,
    bg: 'linear-gradient(155deg,#3C3F8F,#111233)',
    blurb: "Public universities with negligible tuition and Europe's strongest engineering job market.",
    meta: ['Oct / Apr', '₹0 – 3.5 Lakh / yr', 'Blocked account'],
    description: 'Public universities charge little or no tuition. You budget for living costs and a blocked account, not for fees.',
    facts: [
      { label: 'Tuition / year', value: '₹0 – 3.5 Lakh' },
      { label: 'Living cost / year', value: '₹12 – 14 Lakh' },
      { label: 'Intakes', value: 'October · April' },
      { label: 'Post-study work', value: '18-month job-seeker visa' },
      { label: 'Tests', value: 'IELTS + APS · German A1–B2' },
    ],
    tags: ['Low tuition', 'Engineering', 'Blocked account'],
  },
  {
    slug: 'ireland', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Cliffs_Of_Moher_Doolin_2009_%28155299131%29.jpeg/960px-Cliffs_Of_Moher_Doolin_2009_%28155299131%29.jpeg', name: 'Ireland', flag: '🇮🇪', tag: 'Tech hub', showOnHome: true,
    bg: 'linear-gradient(155deg,#1C5C8A,#061A2A)',
    blurb: 'European HQs for the biggest tech and pharma firms, plus a 2-year stay-back option.',
    meta: ['Sep / Jan', '₹13 – 28 Lakh / yr', 'Stamp 2'],
    description: 'European headquarters for most large tech and pharma companies, English-taught, and a two-year stay-back for masters graduates.',
    facts: [
      { label: 'Tuition / year', value: '₹13 – 28 Lakh' },
      { label: 'Living cost / year', value: '₹11 – 16 Lakh' },
      { label: 'Intakes', value: 'September · January' },
      { label: 'Post-study work', value: '2 yrs Stamp 1G' },
      { label: 'Tests', value: 'IELTS / PTE' },
    ],
    tags: ['Tech & pharma', 'EU degree', 'English-taught'],
  },
  {
    slug: 'new-zealand', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Mitre_Peak_of_Milford_Sound%2C_New_Zealand%3B_February_2015.jpg/960px-Mitre_Peak_of_Milford_Sound%2C_New_Zealand%3B_February_2015.jpg', name: 'New Zealand', flag: '🇳🇿', tag: 'Quality of life', showOnHome: false,
    bg: 'linear-gradient(150deg,#B08234,#3B2708)',
    blurb: 'Small cohorts, high quality of life and open work rights for partners of postgraduate students.',
    meta: ['Feb / Jul', '₹14 – 22 Lakh / yr', 'Fee-paying visa'],
    description: 'Small cohorts, high quality of life and open work rights for partners of postgraduate students.',
    facts: [
      { label: 'Tuition / year', value: '₹14 – 22 Lakh' },
      { label: 'Living cost / year', value: '₹9 – 12 Lakh' },
      { label: 'Intakes', value: 'February · July' },
      { label: 'Post-study work', value: 'Up to 3 yrs' },
      { label: 'Tests', value: 'IELTS / PTE' },
    ],
    tags: ['Partner work visa', 'Agriculture', 'Small classes'],
  },
  {
    slug: 'dubai-singapore', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Marina_Bay_skyline_sunset_%28Unsplash%29.jpg/960px-Marina_Bay_skyline_sunset_%28Unsplash%29.jpg', name: 'Dubai & Singapore', flag: '🇦🇪', tag: 'Close to home', showOnHome: false,
    bg: 'linear-gradient(150deg,#5B3E8F,#1A1030)',
    blurb: 'Global campuses of Western universities, two to five hours from home.',
    meta: ['Sep / Jan / rolling', '₹13 – 29 Lakh / yr', 'Employer-sponsored'],
    description: 'Global campuses of Western universities, two to five hours from home, with strong finance, logistics and hospitality placements.',
    facts: [
      { label: 'Tuition / year', value: '₹13 – 29 Lakh' },
      { label: 'Living cost / year', value: '₹8.5 – 15 Lakh' },
      { label: 'Intakes', value: 'Sep · Jan · rolling' },
      { label: 'Post-study work', value: 'Employer-sponsored' },
      { label: 'Tests', value: 'IELTS (often waived)' },
    ],
    tags: ['Close to home', 'Branch campuses', 'Tax-free income'],
  },
];

export const courseCategories = [
  { key: 'tech', label: 'Engineering & Tech' },
  { key: 'data', label: 'Data & AI' },
  { key: 'business', label: 'Business' },
  { key: 'health', label: 'Health Sciences' },
  { key: 'design', label: 'Design & Media' },
  { key: 'law', label: 'Law & Social' },
];

export const courses = [
  { slug: 'ms-data-science', category: 'data', icon: '📊', badge: 'Highest demand', title: 'MS Data Science & Analytics', description: 'Statistics, machine learning and data engineering with a capstone on real industry data. The most-applied program in our network.', duration: '12 – 24 months', level: 'Masters', tuition: '₹17 – 46 Lakh', topPicks: 'USA · Canada · UK', note: 'GRE optional at most campuses' },
  { slug: 'ms-computer-science', category: 'tech', icon: '💻', badge: 'STEM OPT', title: 'MS Computer Science', description: 'Systems, algorithms, distributed computing and electives in AI, security or graphics. The classic route into a US or Canadian tech role.', duration: '18 – 24 months', level: 'Masters', tuition: '₹21 – 53 Lakh', topPicks: 'USA · Canada · Ireland', note: 'Portfolio strengthens weak GPA' },
  { slug: 'msc-ai', category: 'data', icon: '🤖', badge: 'Fast growing', title: 'MSc Artificial Intelligence', description: 'Deep learning, NLP and computer vision with heavy lab work. Best suited to CS, IT, maths or electronics backgrounds.', duration: '12 – 24 months', level: 'Masters', tuition: '₹21 – 49 Lakh', topPicks: 'UK · Germany · Australia', note: 'Strong maths prerequisite' },
  { slug: 'mba', category: 'business', icon: '📈', badge: 'Work experience', title: 'MBA / Master of Management', description: 'General management with finance, marketing or operations tracks. MiM suits fresh graduates; MBA expects two or more years of work.', duration: '12 – 24 months', level: 'Masters', tuition: '₹19 – 67 Lakh', topPicks: 'UK · Ireland · USA', note: 'GMAT waivers available' },
  { slug: 'nursing-healthcare', category: 'health', icon: '🩺', badge: 'PR friendly', title: 'Nursing & Healthcare Management', description: 'Registered-nurse conversion pathways plus health administration. Consistently on skilled-occupation lists in Australia and Canada.', duration: '18 – 24 months', level: 'Bachelors / Masters', tuition: '₹18 – 29 Lakh', topPicks: 'Australia · Canada · NZ', note: 'Registration rules vary by state' },
  { slug: 'msc-mechanical', category: 'tech', icon: '⚙️', badge: 'Low tuition', title: 'MSc Mechanical & Automotive', description: "Design, thermodynamics, CAE and manufacturing systems — with Germany's near-zero tuition making it the cheapest strong option.", duration: '18 – 24 months', level: 'Masters', tuition: '₹0 – 20 Lakh', topPicks: 'Germany · UK · Canada', note: 'German A2 helps employability' },
  { slug: 'msc-finance-fintech', category: 'business', icon: '💰', badge: 'CFA aligned', title: 'MSc Finance & Fintech', description: 'Corporate finance, quantitative methods and financial technology, often mapped to CFA Level I and II curricula.', duration: '12 – 18 months', level: 'Masters', tuition: '₹23 – 54 Lakh', topPicks: 'UK · Singapore · UAE', note: 'Maths-heavy admission screen' },
  { slug: 'msc-public-health', category: 'health', icon: '🧬', badge: 'Research track', title: 'MSc Public Health / Biotech', description: 'Epidemiology, biostatistics and health policy, or lab-based biotechnology with strong pharma placement in Ireland and the UK.', duration: '12 – 24 months', level: 'Masters', tuition: '₹16 – 38 Lakh', topPicks: 'Ireland · UK · USA', note: 'Funded PhD routes available' },
  { slug: 'ma-ux-design', category: 'design', icon: '🎨', badge: 'Portfolio led', title: 'MA UX & Interaction Design', description: 'Research methods, prototyping and design systems. Admission weighs your portfolio far more heavily than your GPA.', duration: '12 – 18 months', level: 'Masters', tuition: '₹19 – 38 Lakh', topPicks: 'UK · Canada · Australia', note: 'We run portfolio reviews' },
  { slug: 'ma-film-vfx', category: 'design', icon: '🎬', badge: 'Studio based', title: 'MA Film, Animation & VFX', description: 'Production pipelines, motion and post-production in studio-linked schools with industry mentorship and showreel outcomes.', duration: '12 – 24 months', level: 'Masters / Diploma', tuition: '₹15 – 43 Lakh', topPicks: 'UK · Canada · NZ', note: 'Showreel required' },
  { slug: 'llm-international-law', category: 'law', icon: '⚖️', badge: '1 year', title: 'LLM International Law', description: 'Commercial, human-rights or IP specialisations. A one-year LLM is the most common route for law graduates going abroad.', duration: '12 months', level: 'Masters', tuition: '₹21 – 48 Lakh', topPicks: 'UK · USA · Australia', note: 'Bar eligibility varies' },
  { slug: 'ma-international-relations', category: 'law', icon: '🌍', badge: 'Scholarship rich', title: 'MA International Relations', description: 'Policy, development and diplomacy, with the widest range of merit scholarships of any humanities program we handle.', duration: '12 – 24 months', level: 'Masters', tuition: '₹9 – 36 Lakh', topPicks: 'Germany · UK · Netherlands', note: 'Strong SOP matters most' },
];

export const studyLevels = [
  { num: '01', title: 'Bachelors', description: '3 – 4 year undergraduate degrees with foundation and pathway options if your marks fall short.' },
  { num: '02', title: 'Masters', description: 'Taught and research masters, the bulk of what we do — 12 to 24 months depending on country.' },
  { num: '03', title: 'MBA', description: 'One and two-year MBAs, including GMAT-waiver routes for candidates with solid work experience.' },
  { num: '04', title: 'PhD & Diplomas', description: 'Funded doctoral positions, plus one-year PG diplomas that lead into work permits.' },
];

export const testimonials = [
  { initials: 'AR', name: 'Aditi R.', program: 'MSc Data Analytics · Toronto', rating: 5, quote: 'I had a 6.5 IELTS and a 68% average and thought Canada was out of reach. GIA Educare found four colleges that fit and I got two offers with a scholarship on one.' },
  { initials: 'KS', name: 'Karan S.', program: 'MS Computer Science · Texas', rating: 5, quote: 'The SOP sessions were the difference. Three drafts, real feedback, and it finally sounded like me instead of a template off the internet.' },
  { initials: 'MF', name: 'Meher F.', program: 'MBA · Dublin', rating: 5, quote: "My visa file had a funding gap I didn't even notice. They caught it two weeks before submission and rebuilt the documents. Approved first attempt." },
];

export const team = [
  { initials: 'RM', name: 'Rhea Malhotra', role: 'Founder · US & Canada', bio: 'Twelve years in admissions consulting. Handles US graduate applications and funding strategy.', featured: true, specialisation: 'USA & Canada · masters and funding', experienceYears: 12, studentsCounselled: 3200, languages: ['English', 'Hindi'], phone: '+91 90000 00010', whatsapp: '+91 90000 00010' },
  { initials: 'AV', name: 'Arjun Verma', role: 'UK & Ireland desk', bio: 'Former UK university recruiter. Knows exactly what each admissions office actually reads.', featured: true, specialisation: 'UK & Ireland admissions', experienceYears: 9, studentsCounselled: 2100, languages: ['English', 'Hindi', 'Punjabi'], phone: '+91 90000 00011', whatsapp: '+91 90000 00011' },
  { initials: 'SN', name: 'Sana Nair', role: 'Visa & documentation', bio: 'Runs file review and mock interviews. Has taken over 3,000 files through submission.', featured: true, specialisation: 'Visas, loans and documentation', experienceYears: 10, studentsCounselled: 3000, languages: ['English', 'Malayalam', 'Hindi'], phone: '+91 90000 00012', whatsapp: '+91 90000 00012' },
  { initials: 'DK', name: 'Dev Kulkarni', role: 'Test prep lead', bio: 'IELTS and GRE trainer. Builds the six-week plans and runs the weekly mock reviews.', featured: true, specialisation: 'Germany, IELTS & GRE', experienceYears: 7, studentsCounselled: 1500, languages: ['English', 'Marathi', 'Hindi'], phone: '+91 90000 00013', whatsapp: '+91 90000 00013' },
];

export const milestones = [
  { year: '2016', title: 'GIA Educare opens in Gurugram', description: 'Three counsellors, one room, 42 students in the first admission cycle.' },
  { year: '2019', title: 'Test-prep wing added', description: 'In-house IELTS and GRE coaching so students stop juggling two vendors.' },
  { year: '2021', title: 'Application tracker goes live', description: "Students see every application's live status instead of emailing for updates." },
  { year: '2023', title: 'Three offices, 25 countries', description: 'Gurugram, Bengaluru and Pune, with a remote counselling desk for everyone else.' },
  { year: '2026', title: '12,000 students and counting', description: 'Alumni chapters in nine cities help new arrivals with housing and part-time work.' },
];

export const values = [
  { icon: 'shield', title: 'Honest odds', description: "If your profile won't clear a university's bar, we say so on the first call — even when it costs us the sale." },
  { icon: 'clock', title: 'Replies in hours', description: 'Capped caseloads mean a real answer the same working day, not a ticket number.' },
  { icon: 'home', title: 'Fee clarity', description: 'Counselling is free. Where a service is paid, the number is written down before you start, not after.' },
  { icon: 'users', title: 'Support after landing', description: 'Housing, banking, SIM and part-time work rules — plus an alumni chapter in your city.' },
];

export const stats = [
  { value: 12000, suffix: '+', label: 'Students counselled' },
  { value: 850, suffix: '+', label: 'Partner universities' },
  { value: 25, suffix: '+', label: 'Study destinations' },
  { value: 96, suffix: '%', label: 'Visa success rate' },
];

export const processSteps = [
  { num: '01', title: 'Free counselling', description: 'A free call with a senior counsellor to understand your goal, budget and timeline.' },
  { num: '02', title: 'Shortlist & tests', description: 'Target list locked, IELTS/GRE plan begins alongside.' },
  { num: '03', title: 'Applications', description: 'SOP, LORs, transcripts and portal submissions handled with you.' },
  { num: '04', title: 'Offers & funding', description: 'Compare offers, claim scholarships, arrange the loan and deposit.' },
  { num: '05', title: 'Visa & fly', description: 'File prep, mock interview, pre-departure briefing, done.' },
];

export const faqs = [
  { question: 'Is the counselling really free?', answer: 'Yes. Profile evaluation, country and university shortlisting and the first counselling session cost nothing. Paid services — test prep, premium application handling — are optional and priced in writing before you commit to anything.' },
  { question: 'When should I start for a September intake?', answer: 'Twelve months ahead is comfortable, nine is workable, six is tight but possible for countries with rolling admissions. Starting early mainly buys you scholarship deadlines and better loan terms, not just a calmer process.' },
  { question: 'I have backlogs and an education gap. Am I out?', answer: "No. Several countries assess backlogs leniently and accept documented gaps for work, family or health reasons. What matters is how the gap is explained in your statement of purpose and whether the rest of your profile is consistent. Bring your transcripts to the call and we'll be specific." },
  { question: 'Can I apply without IELTS or GRE scores?', answer: 'Often yes. Many universities accept Medium of Instruction letters or waive the GRE entirely, and applications can be prepared on predicted bands while you sit the test. We shortlist waiver-friendly options where that suits your timeline.' },
  { question: 'How much should I budget in total?', answer: 'Think in total cost of attendance — tuition plus living, insurance, visa and airfare. A one-year UK masters typically lands between ₹28 and ₹45 lakh all-in; Germany can be under ₹18 lakh; the US ranges widely. We put exact numbers against your shortlist so you can compare like with like.' },
  { question: 'Do you help with education loans?', answer: "Yes — we prepare the documentation and introduce you to collateral-free and secured loan options from partner lenders. We don't lend ourselves and we don't take a cut from lenders, so the comparison you get is on rate and terms only." },
];

export const comparisonRows = [
  { country: '🇺🇸 USA', length: '18 – 24 months', tuition: '₹24 – 53 Lakh', living: '₹11 – 19 Lakh', work: '1 yr (3 yrs STEM)', best: 'Research & specialisation depth' },
  { country: '🇬🇧 UK', length: '12 months', tuition: '₹18 – 39 Lakh', living: '₹13 – 19 Lakh', work: '2 years', best: 'Fastest, lowest total cost' },
  { country: '🇨🇦 Canada', length: '16 – 24 months', tuition: '₹12 – 22 Lakh', living: '₹8.5 – 12 Lakh', work: 'Up to 3 years', best: 'Residency pathway' },
  { country: '🇦🇺 Australia', length: '18 – 24 months', tuition: '₹15 – 31 Lakh', living: '₹14 – 18 Lakh', work: '2 – 4 years', best: 'Nursing, IT, engineering' },
  { country: '🇩🇪 Germany', length: '24 months', tuition: '₹0 – 3.5 Lakh', living: '₹12 – 14 Lakh', work: '18 months', best: 'Lowest tuition, engineering' },
  { country: '🇮🇪 Ireland', length: '12 – 24 months', tuition: '₹13 – 28 Lakh', living: '₹11 – 16 Lakh', work: '2 years', best: 'Tech & pharma careers' },
  { country: '🇳🇿 New Zealand', length: '12 – 24 months', tuition: '₹14 – 22 Lakh', living: '₹9 – 12 Lakh', work: 'Up to 3 years', best: 'Quality of life' },
  { country: '🇦🇪 UAE / 🇸🇬 SG', length: '12 – 18 months', tuition: '₹13 – 29 Lakh', living: '₹8.5 – 15 Lakh', work: 'Employer-sponsored', best: 'Staying close to home' },
];

const launchPosts = [
  {
    slug: 'uk-or-canada-2027-intake',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Oxford_University_Press_Building_%E2%80%93_Walton_Street.jpg/960px-Oxford_University_Press_Building_%E2%80%93_Walton_Street.jpg',
    category: 'country-guides',
    destination: 'uk',
    publishedAt: '2026-09-02T09:00:00.000Z',
    title: 'UK or Canada for the 2027 intake? The honest trade-off',
    author: 'Rhea Malhotra',
    tags: ['Destinations', 'Costs'],
    excerpt: 'One finishes in twelve months, the other hands you a three-year work permit. Here is how we actually choose between them on a counselling call.',
    body: `Students ask us this more than any other question, and the honest answer is that it depends on one thing: whether you want to **finish fast** or **stay long**.

## The twelve-month argument for the UK

A UK taught masters is one year. That means one year of tuition, one year of living cost, and one year of lost salary instead of two. When we add the total cost of attendance, a UK masters often lands *below* a two-year Canadian program even though the sticker price looks higher.

- Tuition: ₹18 – 39 Lakh
- Living: ₹13 – 19 Lakh
- Post-study work: 2 years on the Graduate Route

## The three-year argument for Canada

Canada is slower and cheaper per year, and the post-graduation work permit runs up to three years. If your goal is residency rather than a credential, that extra time is the whole point.

- Tuition: ₹12 – 22 Lakh
- Living: ₹8.5 – 12 Lakh
- Post-study work: up to 3 years

> If you want the degree, go to the UK. If you want the address, go to Canada.

## How we decide with you

1. Write down your total budget, including the flight and the visa.
2. Decide whether you are optimising for a job in India or a job abroad.
3. Only then look at university rankings.

Ranking is the last filter, not the first. A student who picks the country correctly and the campus imperfectly does better than the reverse, every single time.`,
  },
  {
    slug: 'sop-mistakes-that-cost-admits',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Pen-writing-notes-studying.jpg/960px-Pen-writing-notes-studying.jpg',
    category: 'applications',
    destination: '',
    publishedAt: '2026-08-21T09:00:00.000Z',
    title: 'Five SOP mistakes that quietly cost students their admit',
    author: 'Arjun Verma',
    tags: ['Applications', 'SOP'],
    excerpt: 'Admissions officers read thousands of these. After the first paragraph they already know whether yours was written for them or for everyone.',
    body: `We read a lot of statements of purpose. The weak ones fail in the same five ways.

## 1. Opening with a childhood anecdote

"Ever since I was a child, I have been fascinated by computers." So has everyone applying. The first two lines are the only ones guaranteed to be read closely — spend them on something only you could have written.

## 2. Describing the university back to itself

They know they have excellent faculty and state-of-the-art labs. Naming *one* professor and *one* specific reason their work connects to something you have actually done is worth more than a paragraph of praise.

## 3. Listing your CV again

The SOP exists to explain the things a transcript cannot: why the gap, why the switch, why this course now.

## 4. Hiding the weak semester

A backlog you do not explain looks worse than one you do. Two sentences, no excuses, then move on to what changed.

## 5. One draft

Nobody writes this well the first time. Our students average three drafts, and the third is always shorter than the first.

If you want a read on yours, send it over — we do this every week.`,
  },
  {
    slug: 'education-loan-checklist',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Financial_Calculator_Hewlett-Packard_HP-12C_built_from_1981%2C_this_item_produced_1988_%28edited_to_remove_background%2C_warmer_colours%29.jpg/960px-Financial_Calculator_Hewlett-Packard_HP-12C_built_from_1981%2C_this_item_produced_1988_%28edited_to_remove_background%2C_warmer_colours%29.jpg',
    category: 'finances',
    destination: '',
    publishedAt: '2026-08-08T09:00:00.000Z',
    title: 'The education loan checklist we give every family',
    author: 'Sana Nair',
    tags: ['Funding', 'Loans'],
    excerpt: 'Collateral or not, co-applicant income, moratorium period, and the four documents that hold up more files than anything else.',
    body: `Most loan rejections we see are not credit problems. They are paperwork problems.

## Sort these four first

1. **Co-applicant income proof** — three years of ITR, not one.
2. **Admission letter** — conditional offers are usually fine, but the lender must see the fee structure.
3. **Cost of attendance breakdown** — tuition *plus* living, from the university, on university letterhead.
4. **Collateral valuation** — if you are pledging property, start this a month early. It is always the slowest step.

## Collateral-free vs secured

Collateral-free loans are faster and cap out lower, typically around ₹40 lakh depending on the lender and the country. Secured loans go higher and carry a lower rate, but add three to five weeks.

## The moratorium question

Ask every lender when repayment actually starts — course duration plus six months is common, but not universal. A one-year difference in the moratorium changes your first-job budget more than half a percent on the rate does.

We do not lend and we take nothing from lenders, so the comparison we hand you is on rate and terms only.`,
  },
];

const morePosts = [
  // --- Beginner Doubts ------------------------------------------------------
  {
    slug: 'best-country-to-study-abroad',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/World_map_of_bathymetric_data_-_GEBCO_2014.jpg/960px-World_map_of_bathymetric_data_-_GEBCO_2014.jpg',
    category: 'beginner-doubts',
    destination: '',
    publishedAt: '2026-09-10T09:00:00.000Z',
    title: 'Best country to study abroad?',
    author: 'Rhea Malhotra',
    tags: ['Choosing a country'],
    excerpt: 'There is no single best country — only the best one for your budget, your marks and what you want after the degree. Here is how to work it out.',
    body: `Every counsellor gets this question on the first call, and the honest answer is: **it depends on what you want the degree to do for you.**

## Start with the outcome, not the ranking

- **A job and residency abroad?** Canada and Australia have the clearest post-study pathways.
- **The fastest, cheapest foreign degree?** A one-year UK masters keeps total cost down.
- **Research and specialisation?** The USA has the deepest range of programs and funding.
- **Low tuition?** Public universities in Germany charge little or nothing.

## Then check three numbers

1. Total cost of attendance for the whole program, in rupees.
2. Post-study work rights, in years.
3. Your realistic admit odds with your current profile.

> The best country is the one where all three numbers work at the same time.

Bring your marks and budget to a free counselling call and we will narrow it to two or three options with the reasoning written down.`,
  },
  {
    slug: 'most-affordable-countries-to-study-abroad',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Piggy-bank-968302.jpg/960px-Piggy-bank-968302.jpg',
    category: 'beginner-doubts',
    destination: '',
    publishedAt: '2026-09-08T09:00:00.000Z',
    title: 'Most affordable countries?',
    author: 'Sana Nair',
    tags: ['Costs', 'Choosing a country'],
    excerpt: 'Low tuition is only half the bill. These are the countries where the total — fees plus living — stays manageable for Indian families.',
    body: `"Affordable" has to mean **total cost**, not just tuition. A free-tuition country with an expensive city can cost more than a paid program somewhere cheaper.

## Consistently lower total cost

- **Germany** — public universities charge a small semester fee; living costs are the main expense.
- **Ireland** — one-year masters programs keep the total down.
- **The UK** — high annual fees, but a one-year masters halves the living bill.

## Where costs vary most

The **USA** ranges from affordable state universities to very expensive private schools, and **Australia** depends heavily on the city you choose.

## What to budget for besides fees

1. Living costs for every month of the course.
2. Health insurance and visa fees.
3. Flights, a deposit on housing and a buffer for the first two months.

Every figure on this site is shown in INR and is indicative — we confirm live numbers for your shortlist on the call.`,
  },
  {
    slug: 'most-immigration-friendly-countries-for-students',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Belize-passport-stamp.jpg/960px-Belize-passport-stamp.jpg',
    category: 'beginner-doubts',
    destination: '',
    publishedAt: '2026-09-05T09:00:00.000Z',
    title: 'Most immigration friendly country?',
    author: 'Arjun Verma',
    tags: ['Work rights', 'PR'],
    excerpt: 'If settling abroad after your degree is the goal, the post-study work permit matters more than the university ranking.',
    body: `Students who want to **stay and work** after graduating should compare countries on their pathways first.

## What to look for

- **Length of the post-study work permit** — longer permits give you more time to find a skilled job.
- **A points-based residency system** that rewards local study and work experience.
- **Whether your field is in demand** in that country's skilled-occupation lists.

## Countries students most often choose for this

- **Canada** — a post-graduation work permit and well-known residency routes.
- **Australia** — post-study work rights, with extra time in some regional areas.
- **Germany** — time to find a job after graduating, and a growing need for skilled workers.
- **The UK** — the Graduate Route lets you work after your degree.

> Immigration rules change often. Treat any article, including this one, as a starting point and confirm current rules before you commit.

We check the latest rules against your course and profile during counselling.`,
  },
  {
    slug: 'country-with-best-education-system',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/UIUC_Library_Main_Stacks.jpg/960px-UIUC_Library_Main_Stacks.jpg',
    category: 'beginner-doubts',
    destination: '',
    publishedAt: '2026-09-03T09:00:00.000Z',
    title: 'Country with best education system?',
    author: 'Rhea Malhotra',
    tags: ['Choosing a country', 'Rankings'],
    excerpt: 'Rankings measure research output, not whether a course will get you hired. Here is how to judge quality for your own goals.',
    body: `The USA and UK dominate global rankings, and Canada, Australia, Germany and Ireland all have strong universities. But **the best system for you** depends on how you learn and what you want next.

## Different styles of teaching

- **USA** — flexible, broad, lots of electives and research opportunities.
- **UK and Ireland** — focused, shorter programs with independent study.
- **Germany** — rigorous, theory-heavy, especially strong in engineering.
- **Canada and Australia** — practical, often with co-op or work-integrated learning.

## Better questions than "which is best"

1. Does the course teach what employers in your field ask for?
2. What do graduates of *this* program earn, and where?
3. Is there an internship or placement built in?

A mid-ranked university with a strong placement record often beats a famous name with no industry links for your specific course.`,
  },
  {
    slug: 'how-to-choose-the-right-country',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/B26055959H_-_Insula_India_orientalis_pracipua.jpg/960px-B26055959H_-_Insula_India_orientalis_pracipua.jpg',
    category: 'beginner-doubts',
    destination: '',
    publishedAt: '2026-09-01T09:00:00.000Z',
    title: 'How to choose the right country?',
    author: 'Dev Kulkarni',
    tags: ['Choosing a country'],
    excerpt: 'A simple five-step method we use with every student to go from "anywhere abroad" to a shortlist of two or three countries.',
    body: `Picking a country is easier when you decide in the right order.

## The five steps

1. **Fix your total budget** in rupees, including loans and family support.
2. **Decide your goal** — a degree and return home, or work and settle abroad.
3. **Check your profile** — marks, backlogs, gap years and English test scores.
4. **List countries that fit all three**, then compare work rights and intakes.
5. **Only now compare universities** within those countries.

## Common mistakes

- Choosing because a friend or relative went there.
- Looking only at tuition and ignoring living costs.
- Applying to one country and having no backup.

> Two or three realistic countries beat one dream country with no plan B.

Tell us your budget and marks and we will do this exercise with you on a free call.`,
  },

  // --- Finances -------------------------------------------------------------
  {
    slug: 'scholarships-for-indian-students-abroad',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Graduation-cap-g6c3c0e4d0_1920.jpg/960px-Graduation-cap-g6c3c0e4d0_1920.jpg',
    category: 'finances',
    destination: '',
    publishedAt: '2026-08-28T09:00:00.000Z',
    title: 'Scholarships Indian students can actually win',
    author: 'Sana Nair',
    tags: ['Scholarships', 'Funding'],
    excerpt: 'Most scholarships are partial and university-specific. Knowing where to look — and applying early — matters more than a perfect profile.',
    body: `Full scholarships are rare. **Partial tuition waivers** are common, and several of them together can change your budget significantly.

## Where the money comes from

- **University merit scholarships** — often awarded automatically with your admit, based on your academic record.
- **Government-funded programs** — competitive, with fixed deadlines months before intake.
- **Department and research funding** — assistantships, mainly for masters and PhD students in the USA.

## How to improve your chances

1. Apply in the **first round** — scholarship budgets run out.
2. Write a separate, specific scholarship essay; do not reuse your SOP.
3. Include universities where your profile is *above* their average admit.

## Be realistic

Budget as if you will receive nothing, and treat any scholarship as a bonus. We add a scholarship column to every shortlist we build.`,
  },
  {
    slug: 'monthly-cost-of-living-abroad',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Vegan_and_vegetarian_grocery_shopping_and_cookery_books.jpg/960px-Vegan_and_vegetarian_grocery_shopping_and_cookery_books.jpg',
    category: 'finances',
    destination: '',
    publishedAt: '2026-08-15T09:00:00.000Z',
    title: 'What it really costs to live abroad each month',
    author: 'Arjun Verma',
    tags: ['Costs', 'Budgeting'],
    excerpt: 'Rent is the biggest line, but groceries, transport and phone bills add up. A simple way to estimate your monthly spend in rupees.',
    body: `Tuition gets the attention, but **living costs are paid every single month** — and they are what families underestimate most.

## The main expenses

- **Rent** — usually the largest cost; shared housing is far cheaper than a studio.
- **Food** — cooking at home costs a fraction of eating out.
- **Transport** — student travel passes help in most cities.
- **Phone, internet and insurance** — small individually, significant together.

## Ways to keep costs down

1. Choose a smaller city where rent is lower.
2. Share accommodation for at least the first year.
3. Use part-time work rights sensibly — never plan to fund tuition from them.

## Plan for the first two months

Arrive with enough for a housing deposit, first month's rent and basic setup costs before any part-time income starts.

We give you a city-specific monthly budget in INR during counselling.`,
  },

  // --- Country guides -------------------------------------------------------
  {
    slug: 'study-in-usa-guide',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Albert_B._Dod_Hall_-_Princeton_University_-_Princeton%2C_NJ_-_DSC00821.jpg/960px-Albert_B._Dod_Hall_-_Princeton_University_-_Princeton%2C_NJ_-_DSC00821.jpg',
    category: 'country-guides',
    destination: 'usa',
    publishedAt: '2026-08-25T09:00:00.000Z',
    title: 'Studying in the USA: what to know before you apply',
    author: 'Rhea Malhotra',
    tags: ['USA', 'Country guide'],
    excerpt: 'The widest choice of programs anywhere, STEM work rights, and costs that range from reasonable to very high. The essentials in one place.',
    body: `The USA offers the **widest range of specialisations** of any destination, and many masters programs include research or assistantship opportunities.

## Key facts

- **Tuition:** roughly ₹24 – 53 Lakh a year, depending heavily on public vs private universities.
- **Intakes:** Fall (main) and Spring.
- **Work after study:** OPT, extended for eligible STEM programs.
- **Tests:** IELTS or TOEFL, plus GRE or GMAT for many programs.

## Who it suits

Students who want research depth, a specialised course, or a career in technology and business.

## Things to plan for

1. Application deadlines can be 9–12 months before the intake.
2. The F-1 visa interview needs clear proof of funds.
3. Costs vary enormously by state and city.

We build US shortlists that balance ambitious, moderate and safe universities.`,
  },
  {
    slug: 'study-in-germany-guide',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/2013.10.01.111339_Alte_Br%C3%BCcke_Heiliggeistkirche_View_City_Heidelberg.jpg/960px-2013.10.01.111339_Alte_Br%C3%BCcke_Heiliggeistkirche_View_City_Heidelberg.jpg',
    category: 'country-guides',
    destination: 'germany',
    publishedAt: '2026-08-12T09:00:00.000Z',
    title: 'Studying in Germany on a small budget',
    author: 'Dev Kulkarni',
    tags: ['Germany', 'Country guide', 'Costs'],
    excerpt: 'Public universities with little or no tuition, strong engineering programs and time to find work after graduating.',
    body: `Germany is the go-to choice for students who want a **quality degree with low tuition**.

## Key facts

- **Tuition:** ₹0 – 3.5 Lakh a year at most public universities.
- **Intakes:** Winter (October) and Summer (April).
- **Proof of funds:** a blocked account covering living costs for your first year.
- **Language:** many masters programs are taught in English, but German helps you find work.

## Who it suits

Engineering, technology and science students who are comfortable with a theory-heavy, independent style of study.

## Things to plan for

1. Some programs need a pre-check of your Indian degree.
2. Learning German to A2–B1 level makes daily life and job hunting much easier.
3. Popular public universities are competitive — apply to several.`,
  },
  {
    slug: 'study-in-canada-guide',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Emmanuel_College%2C_Victoria_University_-_University_of_Toronto_-_Toronto%2C_Canada_-_DSC00527.jpg/960px-Emmanuel_College%2C_Victoria_University_-_University_of_Toronto_-_Toronto%2C_Canada_-_DSC00527.jpg',
    category: 'country-guides',
    destination: 'canada',
    publishedAt: '2026-08-05T09:00:00.000Z',
    title: 'Studying in Canada: permits, costs and co-op',
    author: 'Arjun Verma',
    tags: ['Canada', 'Country guide'],
    excerpt: 'Moderate fees, three intakes a year and a well-known route from study to work. What the process looks like in practice.',
    body: `Canada is popular with students who want a **balanced option**: moderate fees and a clear path from study to work.

## Key facts

- **Tuition:** roughly ₹12 – 22 Lakh a year.
- **Intakes:** September, January and May.
- **Work after study:** a post-graduation work permit for eligible programs.
- **Tests:** IELTS or PTE.

## Who it suits

Students planning to work in Canada after graduating, and those who want practical, co-op based programs.

## Things to plan for

1. Study permit rules and caps change — always check the current requirements.
2. Colleges and universities differ in work-permit eligibility; confirm before applying.
3. Show clear proof of funds for tuition and living costs.`,
  },
  // --- Exam doubts ----------------------------------------------------------
  {
    slug: 'which-exam-for-which-course-and-country',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Hourglass_1.jpg/960px-Hourglass_1.jpg',
    category: 'exam-doubts',
    destination: '',
    exam: '',
    publishedAt: '2026-09-12T09:00:00.000Z',
    title: 'Which exam to give for which course & country?',
    author: 'Dev Kulkarni',
    tags: ['Exams', 'Choosing a test'],
    excerpt: 'Most students need two tests: one to prove their English and one for admission. Here is how to work out exactly which ones your shortlist needs.',
    body: `Almost every student abroad needs an **English test**, and many also need an **admission test**. Which ones depends on the course and the country.

## Step 1 — the English test

- **IELTS** is accepted almost everywhere and is the safest default, especially for the UK, Australia, Canada, New Zealand and Ireland.
- **TOEFL iBT** is the traditional choice for US universities.
- **PTE Academic** is popular for Australia and New Zealand because results come back quickly.
- **Duolingo English Test (DET)** is the cheapest and fastest, but only works if every university on your list accepts it.

## Step 2 — the admission test

- **MS, MA or PhD in the US** → usually the **GRE**.
- **MBA or business masters** → the **GMAT**, or the GRE where accepted.
- **Bachelors in the US** → the **SAT** at many universities.
- **UK, Ireland, Australia and most of Europe** → often no admission test for masters; your degree marks carry more weight.

## Step 3 — check the visa

Some visas only accept specific English tests, or a specific version of one. Always confirm the visa rules as well as the university's.

> Pick your universities first, then your tests — not the other way round.

Fees and formats change often, so confirm on each test's official website before you book. We map the right tests to your shortlist during free counselling.`,
  },
  {
    slug: 'ielts-vs-toefl-vs-pte-vs-det',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Getting_the_Most_Out_of_Multiple-choice_Questions_%286347992956%29.jpg/960px-Getting_the_Most_Out_of_Multiple-choice_Questions_%286347992956%29.jpg',
    category: 'exam-doubts',
    destination: '',
    exam: '',
    publishedAt: '2026-09-11T09:00:00.000Z',
    title: 'IELTS v/s TOEFL v/s PTE v/s DET?',
    author: 'Dev Kulkarni',
    tags: ['IELTS', 'TOEFL', 'PTE', 'DET'],
    excerpt: 'Four English tests, four different formats. The right one depends on where you are applying and how you perform best under test conditions.',
    body: `All four tests prove your English. They differ in **format, speed, cost and where they are accepted**.

## At a glance

- **IELTS** — band 0 – 9, about 2 hr 45 min, speaking face to face with an examiner. Accepted almost everywhere.
- **TOEFL iBT** — fully on computer, including recorded speaking. The traditional choice for the US.
- **PTE Academic** — 10 – 90, about 2 hours, scored by software with results in a few days. Popular for Australia and New Zealand.
- **DET** — 10 – 160, about 1 hour online from home, and the cheapest. Accepted by many, but not all, universities.

## How to choose

1. **Check your shortlist first.** If one university does not accept a test, that test is out.
2. **Check the visa.** Some student visas accept only certain tests.
3. **Play to your strengths.** If you speak more naturally to a person, IELTS suits you; if you prefer a computer, TOEFL or PTE may suit you better.
4. **Consider timing.** PTE and DET results arrive fastest when a deadline is close.

> The cheapest test is the one you only have to take once.

Fees and formats change, so confirm on the official websites before booking.`,
  },
  {
    slug: 'ielts-academic-vs-ielts-general',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/The_Hub%2C_Chancellor_Oppenheimer_Library%2C_University_of_Cape_Town.jpg/960px-The_Hub%2C_Chancellor_Oppenheimer_Library%2C_University_of_Cape_Town.jpg',
    category: 'exam-doubts',
    destination: '',
    exam: 'ielts',
    publishedAt: '2026-09-09T09:00:00.000Z',
    title: 'IELTS academic V/s IELTS general?',
    author: 'Sana Nair',
    tags: ['IELTS'],
    excerpt: 'Booking the wrong IELTS is one of the most common and costly mistakes. Here is which version you need and why.',
    body: `There are two versions of IELTS, and universities only accept one of them.

## IELTS Academic

For **university admission** — bachelors, masters and PhD — and for professional registration. If you are applying to study abroad, this is almost certainly the one you need.

## IELTS General Training

For **work, migration** and some training or below-degree programs. Most universities will **not** accept it for admission.

## What is the same, and what is different

- **Listening and Speaking** are the same in both versions.
- **Reading and Writing** are different — Academic uses academic texts and asks you to describe charts or data; General Training uses everyday texts and letter writing.

## Before you book

1. Check your university's English requirement page.
2. Check whether your visa needs a specific version, such as **IELTS for UKVI**.
3. Book the matching test — scores cannot be converted between versions.

> When in doubt for studying abroad, the answer is IELTS Academic.`,
  },
];

export const posts = [...launchPosts, ...morePosts];

export const postCategories = [
  { key: 'beginner-doubts', label: 'Beginner Doubts', description: 'The questions every student asks before they pick a country.' },
  { key: 'finances', label: 'Finances', description: 'Costs, education loans, scholarships and money abroad.', showInNav: true },
  { key: 'country-guides', label: 'Country Guides', description: 'What studying in a specific country actually involves.' },
  { key: 'applications', label: 'Applications', description: 'SOPs, LORs, deadlines and getting the admit.' },
  { key: 'exam-doubts', label: 'Exam Doubts', description: 'Which test to take, how they compare and what score you need.' },
];

// "Founder connect" on the home and about pages. Placeholder profile — replace
// the photo, message and social links from Settings before launch.
export const founder = {
  enabled: true,
  name: 'Rhea Malhotra',
  title: 'Founder & Lead Counsellor',
  photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Coffee-desk-laptop-notebook_%2824244320481%29.jpg/960px-Coffee-desk-laptop-notebook_%2824244320481%29.jpg',
  message: "I started GIA Educare after being mis-advised as a student myself. Every family deserves honest odds, a clear budget and one person who stays with them to the finish line. If you have a question, message me directly — I read every one.",
  email: 'founder@giaeducare.com',
  phone: '+91 90000 00010',
  whatsapp: '+91 90000 00010',
  linkedin: '',
  instagram: '',
  youtube: '',
  twitter: '',
  facebook: '',
};

// Seven exams students ask about most. Fees are approximate INR for Indian test
// takers and change often — every exam links to its official site.
export const exams = [
  {
    slug: 'ielts', name: 'IELTS', fullName: 'International English Language Testing System', kind: 'English proficiency',
    summary: 'The most widely accepted English test for the UK, Australia, Canada, New Zealand and Ireland.',
    description: 'IELTS tests listening, reading, writing and speaking. Choose IELTS Academic for university admission; General Training is for work and migration. The speaking test is a face-to-face conversation with an examiner, which many students find more natural than speaking to a computer.',
    typicalScore: '6.5 overall, no band below 6.0, for most masters',
    usedFor: 'Bachelors, masters and student visas',
    acceptedIn: ['United Kingdom', 'Australia', 'Canada', 'New Zealand', 'Ireland', 'United States'],
    facts: [
      { label: 'Score scale', value: 'Band 0 – 9' },
      { label: 'Test duration', value: 'About 2 hr 45 min' },
      { label: 'Test fee (India)', value: 'Approx. ₹18,000' },
      { label: 'Score validity', value: '2 years' },
      { label: 'Format', value: 'Paper or computer, at a test centre' },
    ],
    officialUrl: 'https://ielts.org',
  },
  {
    slug: 'toefl', name: 'TOEFL', fullName: 'Test of English as a Foreign Language (TOEFL iBT)', kind: 'English proficiency',
    summary: 'A computer-based English test accepted by almost every US university and many worldwide.',
    description: 'TOEFL iBT is taken entirely on computer, including a recorded speaking section. It is the traditional choice for US admissions and is accepted by most universities in Canada, the UK and Europe. ETS has been updating the test format and score scale, so check the current version before you book.',
    typicalScore: 'Around 90+ (0 – 120 scale) for most masters',
    usedFor: 'Bachelors and masters, especially in the US',
    acceptedIn: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Ireland', 'Germany'],
    facts: [
      { label: 'Score scale', value: 'New 1 – 6 bands, with a 0 – 120 equivalent' },
      { label: 'Test duration', value: 'About 1.5 – 2 hours' },
      { label: 'Test fee (India)', value: 'Approx. ₹17,000 – 20,000' },
      { label: 'Score validity', value: '2 years' },
      { label: 'Format', value: 'Computer, at a test centre or at home' },
    ],
    officialUrl: 'https://www.ets.org/toefl.html',
  },
  {
    slug: 'det', name: 'DET', fullName: 'Duolingo English Test', kind: 'English proficiency',
    summary: 'An online, adaptive English test you take from home in about an hour.',
    description: 'The Duolingo English Test is the fastest and cheapest option and is accepted by many universities in the US, Canada, the UK and Ireland. It is not accepted for every student visa or every university, so confirm your shortlist accepts it before you rely on it.',
    typicalScore: 'Around 115 – 125 for most masters',
    usedFor: 'Admissions at universities that list it',
    acceptedIn: ['United States', 'Canada', 'United Kingdom', 'Ireland'],
    facts: [
      { label: 'Score scale', value: '10 – 160' },
      { label: 'Test duration', value: 'About 1 hour' },
      { label: 'Test fee (India)', value: 'Approx. ₹6,000 – 7,000' },
      { label: 'Score validity', value: '2 years' },
      { label: 'Format', value: 'Online, at home' },
    ],
    officialUrl: 'https://englishtest.duolingo.com',
  },
  {
    slug: 'pte', name: 'PTE', fullName: 'Pearson Test of English Academic', kind: 'English proficiency',
    summary: 'A computer-based, AI-scored English test with fast results — popular for Australia and New Zealand.',
    description: 'PTE Academic is taken on computer and scored by software, with results usually within a few days. It is widely used for Australia and New Zealand and accepted by many universities in the UK, Canada and Ireland.',
    typicalScore: 'Around 58 – 65 for most masters',
    usedFor: 'Bachelors, masters and student visas',
    acceptedIn: ['Australia', 'New Zealand', 'United Kingdom', 'Canada', 'Ireland', 'United States'],
    facts: [
      { label: 'Score scale', value: '10 – 90' },
      { label: 'Test duration', value: 'About 2 hours' },
      { label: 'Test fee (India)', value: 'Approx. ₹18,000' },
      { label: 'Score validity', value: '2 years' },
      { label: 'Format', value: 'Computer, at a test centre' },
    ],
    officialUrl: 'https://www.pearsonpte.com',
  },
  {
    slug: 'gre', name: 'GRE', fullName: 'Graduate Record Examinations (GRE General Test)', kind: 'Graduate admission',
    summary: 'The standard admission test for masters and PhD programs, especially in the United States.',
    description: 'The GRE measures verbal reasoning, quantitative reasoning and analytical writing. Most US MS and PhD programs ask for it, and a strong score can offset a weaker GPA. Many business schools accept it as an alternative to the GMAT.',
    typicalScore: '310 – 320+ for competitive MS programs',
    usedFor: 'MS, MA and PhD programs; some MBAs',
    acceptedIn: ['United States', 'Canada', 'Germany', 'United Kingdom', 'Australia', 'Ireland'],
    facts: [
      { label: 'Score scale', value: '260 – 340, plus writing 0 – 6' },
      { label: 'Test duration', value: 'About 2 hours' },
      { label: 'Test fee (India)', value: 'Approx. ₹22,000 – 24,000' },
      { label: 'Score validity', value: '5 years' },
      { label: 'Format', value: 'Computer, at a test centre or at home' },
    ],
    officialUrl: 'https://www.ets.org/gre.html',
  },
  {
    slug: 'gmat', name: 'GMAT', fullName: 'Graduate Management Admission Test (GMAT Focus Edition)', kind: 'Graduate admission',
    summary: 'The admission test most business schools ask for — MBA, Masters in Finance and Masters in Management.',
    description: 'The GMAT Focus Edition tests quantitative reasoning, verbal reasoning and data insights. It is the default test for MBA and business masters programs worldwide, though many schools also accept the GRE.',
    typicalScore: 'Around 600 – 650+ for most business masters',
    usedFor: 'MBA and business masters',
    acceptedIn: ['United States', 'United Kingdom', 'Canada', 'Ireland', 'Australia', 'Dubai & Singapore'],
    facts: [
      { label: 'Score scale', value: '205 – 805' },
      { label: 'Test duration', value: '2 hr 15 min' },
      { label: 'Test fee (India)', value: 'Approx. ₹25,000 – 28,000' },
      { label: 'Score validity', value: '5 years' },
      { label: 'Format', value: 'Computer, at a test centre or online' },
    ],
    officialUrl: 'https://www.mba.com/exams/gmat-exam',
  },
  {
    slug: 'sat', name: 'SAT', fullName: 'SAT', kind: 'Undergraduate admission',
    summary: 'The admission test many US universities use for bachelors applicants.',
    description: 'The digital SAT covers reading and writing plus maths. It is mainly used for US bachelors admissions, and some universities in other countries accept it for international students applying straight from Class 12.',
    typicalScore: '1200 – 1400+, depending on the university',
    usedFor: 'Bachelors programs',
    acceptedIn: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Dubai & Singapore'],
    facts: [
      { label: 'Score scale', value: '200 – 1600' },
      { label: 'Test duration', value: 'About 2 hr 15 min' },
      { label: 'Test fee (India)', value: 'Approx. ₹9,000 – 11,000' },
      { label: 'Score validity', value: 'Recent scores preferred; check each university' },
      { label: 'Format', value: 'Digital, at a test centre' },
    ],
    officialUrl: 'https://satsuite.collegeboard.org/sat',
  },
];

export const offices = [
  { name: 'Gurugram · Head office', address: '4th Floor, Orion Tower, Sector 44, Gurugram 122003', phone: '+91 90000 00000', hours: 'Mon–Sat · 10am–7pm', order: 0 },
  { name: 'Bengaluru', address: '2nd Floor, Meridian Square, Indiranagar, Bengaluru 560038', phone: '+91 90000 00002', hours: 'Mon–Sat · 10am–7pm', order: 1 },
  { name: 'Pune', address: 'Unit 11, Aurora Business Park, Baner, Pune 411045', phone: '+91 90000 00003', hours: 'Mon–Sat · 10am–7pm', order: 2 },
];

export const sections = [
  { key: 'exams.head', label: 'Exams — page header', title: 'Pick the test |your course actually needs.', lead: 'English tests and admission exams, compared in plain language — scores, fees in INR, validity and where each one is accepted.' },
  { key: 'exams.list', label: 'Exams — list', eyebrow: 'Exams we prepare you for', title: 'English tests and admission exams' },
  { key: 'exams.colleges', label: 'Exams — find colleges by exam', eyebrow: 'Find colleges by exam', title: 'Where your score can take you', lead: 'Indicative scores most programs ask for. Share your score and a counsellor will send universities that match it.' },
  { key: 'home.counsellors', label: 'Home — top counsellors', eyebrow: 'Meet your counsellors', title: 'Talk to a senior counsellor today', lead: 'Pick the counsellor who knows your destination best, then call or WhatsApp them directly.' },
  { key: 'home.videos', label: 'Home — video testimonials', eyebrow: 'Hear it from students', title: 'Video stories from our admits', lead: 'Real students on how they chose a country, got the admit and cleared the visa.' },
  { key: 'home.founder', label: 'Home — founder connect', eyebrow: 'Founder connect', title: 'A note from our founder' },
  { key: 'home.blog', label: 'Home — insights', eyebrow: 'Insights', title: 'Advice worth reading before you apply', lead: 'Notes from our counselling desk — costs, applications and funding, written by the people who handle the files.' },
  { key: 'blog.head', label: 'Blog — page header', title: 'Notes from the |counselling desk.', lead: 'No listicles and no brochure copy. What we actually tell students about costs, applications, visas and funding — written by the counsellors who handle the files.' },
  { key: 'blog.list', label: 'Blog — article list', eyebrow: 'All articles', title: 'Latest from GIA Educare' },
  { key: 'blog.cta', label: 'Blog — CTA', eyebrow: 'Still have a question?', title: 'Reading only gets you so far. Ask a counsellor.', lead: 'Fifteen minutes on a call is worth three weeks of forum reading. Tell us where you are and we will give you an honest read on your options.' },
  { key: 'home.hero', label: 'Home — hero', eyebrow: '🌍 25+ countries · 850+ partner universities', title: 'Your degree abroad, |guided end to end.', lead: 'From shortlisting the right university to stamping your visa — GIA Educare gives you one counsellor, one plan and zero guesswork. Start with a free profile evaluation.', ctaLabel: 'Get free counselling' },
  { key: 'home.services', label: 'Home — services', eyebrow: 'What we do', title: 'Everything between |"I want to study abroad"| and boarding the flight', lead: 'One dedicated counsellor stays with you through all seven stages. No handoffs, no chasing, no surprise fees.' },
  { key: 'home.destinations', label: 'Home — destinations', eyebrow: 'Where you can go', title: 'Six destinations our students pick most', lead: 'Each one has a different sweet spot — cost, duration, work rights or PR pathway. We help you pick on evidence, not on trends.' },
  { key: 'home.why', label: 'Home — why us', eyebrow: 'Why GIA Educare', title: "We are paid to get you admitted — not to fill a university's seats", lead: 'Most consultancies push whichever campus pays the highest commission. We publish our shortlisting criteria, show you the trade-offs, and let you decide.' },
  { key: 'home.process', label: 'Home — process', eyebrow: 'The process', title: 'Five steps. Nine to twelve months.' },
  { key: 'home.testimonials', label: 'Home — testimonials', eyebrow: 'Student stories', title: 'Admits, in their own words', lead: "Sample testimonials — swap these for your own students' quotes before launch." },
  { key: 'home.cta', label: 'Home — closing CTA', eyebrow: 'Start here', title: 'Book a free 1:1 profile evaluation', lead: "Tell us where you are today. You'll get an honest read on your chances, a shortlist direction and a timeline — on the call itself, not after a sales pitch." },
  { key: 'destinations.head', label: 'Destinations — page header', title: 'Pick the country before you pick the campus.', lead: 'Cost, course length, work rights and residency pathways differ enormously. Here is the honest comparison we walk every student through — no country is "the best", only the best fit for your profile.' },
  { key: 'destinations.list', label: 'Destinations — list', eyebrow: 'Top 8 destinations', title: 'Where our students went last year', lead: 'Tuition figures are indicative annual ranges for international students and change every intake — we confirm live numbers on your call.' },
  { key: 'destinations.compare', label: 'Destinations — comparison', eyebrow: 'Side by side', title: 'The four-minute comparison', lead: 'Swipe horizontally on mobile. Figures are indicative for a taught masters and are confirmed live during counselling.' },
  { key: 'destinations.cta', label: 'Destinations — CTA', eyebrow: 'Not sure which country?', title: "Tell us your budget and marks. We'll tell you where you'll actually get in.", lead: 'Fifteen minutes on a call is worth three weeks of forum reading. Share a few details and a counsellor will come back with two or three realistic country options and why.' },
  { key: 'courses.head', label: 'Courses — page header', title: 'Programs that pay for themselves.', lead: 'Twelve of the most-applied-for programs across our destinations, with realistic duration, fee bands and where graduates actually end up. Filter by field, then ask us for a shortlist.' },
  { key: 'courses.list', label: 'Courses — catalogue', eyebrow: 'Course catalogue', title: 'Filter by field of study' },
  { key: 'courses.levels', label: 'Courses — study levels', eyebrow: 'Study levels', title: 'We support every stage' },
  { key: 'courses.cta', label: 'Courses — CTA', eyebrow: 'Course shortlist', title: 'Get a shortlist built around your marks, not a brochure', lead: "Send your details and we'll come back with six to nine specific programs — ambitious, moderate and safe — with deadlines, fees and entry requirements against each." },
  { key: 'about.head', label: 'About — page header', title: 'A counselling desk, |not a sales floor.', lead: "GIA Educare was started by three former international students who were mis-advised themselves. We built the practice we wish we'd had — small, senior, and straight with you about what your profile can and cannot do." },
  { key: 'about.story', label: 'About — story', eyebrow: 'Our story', title: "We lost two years to bad advice. You shouldn't have to." },
  { key: 'about.values', label: 'About — values', eyebrow: 'What we hold to', title: "Four rules we don't bend" },
  { key: 'about.team', label: 'About — team', eyebrow: 'The team', title: 'Senior counsellors, not call-centre staff', lead: 'Sample profiles for layout — replace with your actual team before launch.' },
  { key: 'about.cta', label: 'About — CTA', eyebrow: 'Say hello', title: 'Come in for a coffee, or just book the call', lead: 'Walk into any of our three offices, or take the whole process remotely — most of our students never visit in person and it makes no difference to the outcome.' },
  { key: 'contact.head', label: 'Contact — page header', title: "Let's map your route out.", lead: 'Fill the form and a counsellor calls you back within one working day — or just phone the office. Counselling is free and there is no obligation to sign up for anything.' },
  { key: 'contact.form', label: 'Contact — form', eyebrow: 'Enquiry form', title: 'Tell us about your plan' },
  { key: 'contact.offices', label: 'Contact — offices', eyebrow: 'Walk in', title: 'Three offices, one standard' },
  { key: 'contact.faq', label: 'Contact — FAQ', eyebrow: 'FAQ', title: 'Questions we get every week' },
  { key: 'contact.cta', label: 'Contact — CTA', eyebrow: 'Prefer WhatsApp?', title: "Message us and we'll call back at a time you pick", lead: "Drop your number here, tell us when you're free, and a counsellor will call. If you'd rather have everything in writing, say so — we'll email instead." },
];
