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
    slug: 'usa', name: 'United States', flag: '🇺🇸', tag: 'STEM OPT 3 yrs', showOnHome: true,
    bg: 'linear-gradient(155deg,#2C4A7C,#0C1E3B)',
    blurb: 'Research funding, assistantships and the widest choice of specialisations anywhere.',
    meta: ['Fall / Spring', '$25k–55k / yr', 'F-1 visa'],
    description: 'The deepest pool of specialisations, research funding and assistantships — and the biggest range of costs, from state schools to the Ivies.',
    facts: [
      { label: 'Tuition / year', value: '$25,000 – $55,000' },
      { label: 'Intakes', value: 'Fall · Spring' },
      { label: 'Post-study work', value: '1 yr OPT · 3 yrs STEM' },
      { label: 'Tests', value: 'IELTS/TOEFL + GRE/GMAT' },
    ],
    tags: ['Research funding', 'Assistantships', 'STEM OPT'],
  },
  {
    slug: 'uk', name: 'United Kingdom', flag: '🇬🇧', tag: '1-year masters', showOnHome: true,
    bg: 'linear-gradient(155deg,#7C2C3B,#2B0E17)',
    blurb: 'Finish a masters in twelve months and stay two more years on the Graduate Route.',
    meta: ['Sep / Jan', '£14k–30k / yr', 'Student visa'],
    description: 'One-year masters means one year of tuition and living cost. Fastest route from application to a foreign degree on your CV.',
    facts: [
      { label: 'Tuition / year', value: '£14,000 – £30,000' },
      { label: 'Intakes', value: 'September · January' },
      { label: 'Post-study work', value: '2 yrs Graduate Route' },
      { label: 'Tests', value: 'IELTS UKVI' },
    ],
    tags: ['1-year masters', 'No GRE', 'Russell Group'],
  },
  {
    slug: 'canada', name: 'Canada', flag: '🇨🇦', tag: 'PR pathway', showOnHome: true,
    bg: 'linear-gradient(155deg,#8A3A2E,#2A0F0A)',
    blurb: 'Affordable tuition, a 3-year post-study work permit and a clear route to residency.',
    meta: ['Sep / Jan / May', 'C$18k–32k / yr', 'Study permit'],
    description: 'The most balanced option — moderate fees, three intakes a year, a long work permit and the clearest permanent-residency pathway.',
    facts: [
      { label: 'Tuition / year', value: 'C$18,000 – C$32,000' },
      { label: 'Intakes', value: 'Sep · Jan · May' },
      { label: 'Post-study work', value: 'Up to 3 yrs PGWP' },
      { label: 'Tests', value: 'IELTS / PTE' },
    ],
    tags: ['PR pathway', 'SDS route', 'Co-op programs'],
  },
  {
    slug: 'australia', name: 'Australia', flag: '🇦🇺', tag: 'Work while you study', showOnHome: true,
    bg: 'linear-gradient(155deg,#1F6B63,#07211F)',
    blurb: 'Strong nursing, IT and engineering pipelines with 48-hour fortnightly work rights.',
    meta: ['Feb / Jul', 'A$22k–45k / yr', 'Subclass 500'],
    description: 'Strong for nursing, IT, engineering and hospitality, with generous part-time work rights and a skilled-migration points system.',
    facts: [
      { label: 'Tuition / year', value: 'A$22,000 – A$45,000' },
      { label: 'Intakes', value: 'February · July' },
      { label: 'Post-study work', value: '2 – 4 yrs subclass 485' },
      { label: 'Tests', value: 'IELTS / PTE' },
    ],
    tags: ['Group of Eight', 'Regional bonus', 'Nursing'],
  },
  {
    slug: 'germany', name: 'Germany', flag: '🇩🇪', tag: 'Low / no tuition', showOnHome: true,
    bg: 'linear-gradient(155deg,#3C3F8F,#111233)',
    blurb: "Public universities with negligible tuition and Europe's strongest engineering job market.",
    meta: ['Oct / Apr', '€0–3k / yr', 'Blocked account'],
    description: 'Public universities charge little or no tuition. You budget for living costs and a blocked account, not for fees.',
    facts: [
      { label: 'Tuition / year', value: '€0 – €3,000' },
      { label: 'Intakes', value: 'October · April' },
      { label: 'Post-study work', value: '18-month job-seeker visa' },
      { label: 'Tests', value: 'IELTS + APS · German A1–B2' },
    ],
    tags: ['Low tuition', 'Engineering', 'Blocked account'],
  },
  {
    slug: 'ireland', name: 'Ireland', flag: '🇮🇪', tag: 'Tech hub', showOnHome: true,
    bg: 'linear-gradient(155deg,#1C5C8A,#061A2A)',
    blurb: 'European HQs for the biggest tech and pharma firms, plus a 2-year stay-back option.',
    meta: ['Sep / Jan', '€12k–25k / yr', 'Stamp 2'],
    description: 'European headquarters for most large tech and pharma companies, English-taught, and a two-year stay-back for masters graduates.',
    facts: [
      { label: 'Tuition / year', value: '€12,000 – €25,000' },
      { label: 'Intakes', value: 'September · January' },
      { label: 'Post-study work', value: '2 yrs Stamp 1G' },
      { label: 'Tests', value: 'IELTS / PTE' },
    ],
    tags: ['Tech & pharma', 'EU degree', 'English-taught'],
  },
  {
    slug: 'new-zealand', name: 'New Zealand', flag: '🇳🇿', tag: 'Quality of life', showOnHome: false,
    bg: 'linear-gradient(150deg,#B08234,#3B2708)',
    blurb: 'Small cohorts, high quality of life and open work rights for partners of postgraduate students.',
    meta: ['Feb / Jul', 'NZ$26k–40k / yr', 'Fee-paying visa'],
    description: 'Small cohorts, high quality of life and open work rights for partners of postgraduate students.',
    facts: [
      { label: 'Tuition / year', value: 'NZ$26,000 – NZ$40,000' },
      { label: 'Intakes', value: 'February · July' },
      { label: 'Post-study work', value: 'Up to 3 yrs' },
      { label: 'Tests', value: 'IELTS / PTE' },
    ],
    tags: ['Partner work visa', 'Agriculture', 'Small classes'],
  },
  {
    slug: 'dubai-singapore', name: 'Dubai & Singapore', flag: '🇦🇪', tag: 'Close to home', showOnHome: false,
    bg: 'linear-gradient(150deg,#5B3E8F,#1A1030)',
    blurb: 'Global campuses of Western universities, two to five hours from home.',
    meta: ['Sep / Jan / rolling', '$14k–30k / yr', 'Employer-sponsored'],
    description: 'Global campuses of Western universities, two to five hours from home, with strong finance, logistics and hospitality placements.',
    facts: [
      { label: 'Tuition / year', value: '$14,000 – $30,000' },
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
  { slug: 'ms-data-science', category: 'data', icon: '📊', badge: 'Highest demand', title: 'MS Data Science & Analytics', description: 'Statistics, machine learning and data engineering with a capstone on real industry data. The most-applied program in our network.', duration: '12 – 24 months', level: 'Masters', tuition: '$18k – $48k', topPicks: 'USA · Canada · UK', note: 'GRE optional at most campuses' },
  { slug: 'ms-computer-science', category: 'tech', icon: '💻', badge: 'STEM OPT', title: 'MS Computer Science', description: 'Systems, algorithms, distributed computing and electives in AI, security or graphics. The classic route into a US or Canadian tech role.', duration: '18 – 24 months', level: 'Masters', tuition: '$22k – $55k', topPicks: 'USA · Canada · Ireland', note: 'Portfolio strengthens weak GPA' },
  { slug: 'msc-ai', category: 'data', icon: '🤖', badge: 'Fast growing', title: 'MSc Artificial Intelligence', description: 'Deep learning, NLP and computer vision with heavy lab work. Best suited to CS, IT, maths or electronics backgrounds.', duration: '12 – 24 months', level: 'Masters', tuition: '£16k – £38k', topPicks: 'UK · Germany · Australia', note: 'Strong maths prerequisite' },
  { slug: 'mba', category: 'business', icon: '📈', badge: 'Work experience', title: 'MBA / Master of Management', description: 'General management with finance, marketing or operations tracks. MiM suits fresh graduates; MBA expects two or more years of work.', duration: '12 – 24 months', level: 'Masters', tuition: '$20k – $70k', topPicks: 'UK · Ireland · USA', note: 'GMAT waivers available' },
  { slug: 'nursing-healthcare', category: 'health', icon: '🩺', badge: 'PR friendly', title: 'Nursing & Healthcare Management', description: 'Registered-nurse conversion pathways plus health administration. Consistently on skilled-occupation lists in Australia and Canada.', duration: '18 – 24 months', level: 'Bachelors / Masters', tuition: 'A$26k – A$42k', topPicks: 'Australia · Canada · NZ', note: 'Registration rules vary by state' },
  { slug: 'msc-mechanical', category: 'tech', icon: '⚙️', badge: 'Low tuition', title: 'MSc Mechanical & Automotive', description: "Design, thermodynamics, CAE and manufacturing systems — with Germany's near-zero tuition making it the cheapest strong option.", duration: '18 – 24 months', level: 'Masters', tuition: '€0 – €18k', topPicks: 'Germany · UK · Canada', note: 'German A2 helps employability' },
  { slug: 'msc-finance-fintech', category: 'business', icon: '💰', badge: 'CFA aligned', title: 'MSc Finance & Fintech', description: 'Corporate finance, quantitative methods and financial technology, often mapped to CFA Level I and II curricula.', duration: '12 – 18 months', level: 'Masters', tuition: '£18k – £42k', topPicks: 'UK · Singapore · UAE', note: 'Maths-heavy admission screen' },
  { slug: 'msc-public-health', category: 'health', icon: '🧬', badge: 'Research track', title: 'MSc Public Health / Biotech', description: 'Epidemiology, biostatistics and health policy, or lab-based biotechnology with strong pharma placement in Ireland and the UK.', duration: '12 – 24 months', level: 'Masters', tuition: '€14k – $40k', topPicks: 'Ireland · UK · USA', note: 'Funded PhD routes available' },
  { slug: 'ma-ux-design', category: 'design', icon: '🎨', badge: 'Portfolio led', title: 'MA UX & Interaction Design', description: 'Research methods, prototyping and design systems. Admission weighs your portfolio far more heavily than your GPA.', duration: '12 – 18 months', level: 'Masters', tuition: '£15k – $40k', topPicks: 'UK · Canada · Australia', note: 'We run portfolio reviews' },
  { slug: 'ma-film-vfx', category: 'design', icon: '🎬', badge: 'Studio based', title: 'MA Film, Animation & VFX', description: 'Production pipelines, motion and post-production in studio-linked schools with industry mentorship and showreel outcomes.', duration: '12 – 24 months', level: 'Masters / Diploma', tuition: '$16k – $45k', topPicks: 'UK · Canada · NZ', note: 'Showreel required' },
  { slug: 'llm-international-law', category: 'law', icon: '⚖️', badge: '1 year', title: 'LLM International Law', description: 'Commercial, human-rights or IP specialisations. A one-year LLM is the most common route for law graduates going abroad.', duration: '12 months', level: 'Masters', tuition: '£16k – $50k', topPicks: 'UK · USA · Australia', note: 'Bar eligibility varies' },
  { slug: 'ma-international-relations', category: 'law', icon: '🌍', badge: 'Scholarship rich', title: 'MA International Relations', description: 'Policy, development and diplomacy, with the widest range of merit scholarships of any humanities program we handle.', duration: '12 – 24 months', level: 'Masters', tuition: '€8k – $38k', topPicks: 'Germany · UK · Netherlands', note: 'Strong SOP matters most' },
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
  { initials: 'RM', name: 'Rhea Malhotra', role: 'Founder · US & Canada', bio: 'Twelve years in admissions consulting. Handles US graduate applications and funding strategy.' },
  { initials: 'AV', name: 'Arjun Verma', role: 'UK & Ireland desk', bio: 'Former UK university recruiter. Knows exactly what each admissions office actually reads.' },
  { initials: 'SN', name: 'Sana Nair', role: 'Visa & documentation', bio: 'Runs file review and mock interviews. Has taken over 3,000 files through submission.' },
  { initials: 'DK', name: 'Dev Kulkarni', role: 'Test prep lead', bio: 'IELTS and GRE trainer. Builds the six-week plans and runs the weekly mock reviews.' },
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
  { num: '01', title: 'Free counselling', description: 'A 30-minute call to understand your goal, budget and timeline.' },
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
  { country: '🇺🇸 USA', length: '18 – 24 months', tuition: '$25k – $55k', living: '$12k – $20k', work: '1 yr (3 yrs STEM)', best: 'Research & specialisation depth' },
  { country: '🇬🇧 UK', length: '12 months', tuition: '£14k – £30k', living: '£10k – £15k', work: '2 years', best: 'Fastest, lowest total cost' },
  { country: '🇨🇦 Canada', length: '16 – 24 months', tuition: 'C$18k – C$32k', living: 'C$12k – C$18k', work: 'Up to 3 years', best: 'Residency pathway' },
  { country: '🇦🇺 Australia', length: '18 – 24 months', tuition: 'A$22k – A$45k', living: 'A$21k – A$26k', work: '2 – 4 years', best: 'Nursing, IT, engineering' },
  { country: '🇩🇪 Germany', length: '24 months', tuition: '€0 – €3k', living: '€11k – €13k', work: '18 months', best: 'Lowest tuition, engineering' },
  { country: '🇮🇪 Ireland', length: '12 – 24 months', tuition: '€12k – €25k', living: '€10k – €14k', work: '2 years', best: 'Tech & pharma careers' },
  { country: '🇳🇿 New Zealand', length: '12 – 24 months', tuition: 'NZ$26k – NZ$40k', living: 'NZ$16k – NZ$22k', work: 'Up to 3 years', best: 'Quality of life' },
  { country: '🇦🇪 UAE / 🇸🇬 SG', length: '12 – 18 months', tuition: '$14k – $30k', living: '$9k – $16k', work: 'Employer-sponsored', best: 'Staying close to home' },
];

export const offices = [
  { name: 'Gurugram · Head office', address: '4th Floor, Orion Tower, Sector 44, Gurugram 122003', phone: '+91 90000 00000', hours: 'Mon–Sat · 10am–7pm', order: 0 },
  { name: 'Bengaluru', address: '2nd Floor, Meridian Square, Indiranagar, Bengaluru 560038', phone: '+91 90000 00002', hours: 'Mon–Sat · 10am–7pm', order: 1 },
  { name: 'Pune', address: 'Unit 11, Aurora Business Park, Baner, Pune 411045', phone: '+91 90000 00003', hours: 'Mon–Sat · 10am–7pm', order: 2 },
];

export const sections = [
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
