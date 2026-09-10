import { Event, EventCategory, Speaker, ScheduleItem, Sponsor, PassType } from './types';

export const SYMPOSIUM_DATE = "2026-09-28T09:00:00";
export const SYMPOSIUM_END_DATE = "2026-09-29T17:00:00";
export const SYMPOSIUM_DATES_DISPLAY = "September 28 & 29, 2026";
export const SYMPOSIUM_DATES_SHORT = "28/09/2026 & 29/09/2026";
export const SYMPOSIUM_DAY1_LABEL = "Day 1 (28/09/2026) — Morning Workshop & Afternoon Project Display";
export const SYMPOSIUM_DAY2_LABEL = "Day 2 (29/09/2026) — 4 Technical & 4 Non-Technical Events";

export interface SymposiumPass {
  id: 'NOVA' | 'AURA' | 'ELITE';
  name: string;
  badge: string;
  tagline: string;
  daysLabel: string;
  agenda: string;
  priceDisplay: string;
  priceNote: string;
  offerDetails: string;
  features: string[];
  accommodationNote?: string;
  accentGradient: string;
  borderColor: string;
  popular?: boolean;
}

export const SYMPOSIUM_PASSES: SymposiumPass[] = [
  {
    id: 'NOVA',
    name: 'NOVA PASS',
    badge: 'Day 1 Exclusive Pass',
    tagline: 'Morning Workshop & Afternoon Project Display',
    daysLabel: 'Day 1 Only • 28/09/2026',
    agenda: 'Morning Solar 2.0 Workshop (09:30 AM) & Afternoon Project Display (01:30 PM)',
    priceDisplay: '₹200 (1 Event) • ₹300 (Both)',
    priceNote: '₹200 for 1 Event  |  ₹300 for Both Events (Save ₹100)',
    offerDetails: 'Register for 1 Event at ₹200/person OR participate in Both Events (Workshop + Project Display) for only ₹300/person (Save ₹100 combo)!',
    features: [
      'Morning Session: Solar 2.0 Next-Gen Solar Energy Workshop',
      'Afternoon Session: Project Display & Working Hardware Showcase',
      '1 Event: ₹200 / person',
      'Both Events Combo: ₹300 / person (Save ₹100)',
      'Official Government Workshop / Project Display Certification',
      'Morning Refreshments, Networking Lunch & Delegate Kit'
    ],
    accentGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    borderColor: 'border-blue-400/50'
  },
  {
    id: 'AURA',
    name: 'AURA PASS',
    badge: 'Day 2 Grand Arena',
    tagline: '1 Tech Battle + 1 Non-Tech Event FREE',
    daysLabel: 'Day 2 Only • 29/09/2026',
    agenda: '4 Technical Battles & 4 Non-Technical Arenas across GCE Erode campus',
    priceDisplay: '₹300',
    priceNote: '₹300 / person (1 Tech + 1 Non-Tech FREE)',
    offerDetails: 'Register for ₹300/person: Select 1 Technical Event and get 1 Non-Technical Event completely FREE!',
    features: [
      'Choose 1 Technical Battle (PaperXpose, Tech Spark, QuizTech 360°, Trace & Find)',
      'Choose 1 Non-Technical Arena 100% FREE (CineQuest, Guess My Act, IPL Auction, Card of Chaos)',
      'Exciting Cash Prize Pools for all event winners',
      'Official Certificate of Merit & Participation for all events',
      'Morning Refreshments & College Networking Lunch Included'
    ],
    accentGradient: 'from-amber-500 via-yellow-500 to-amber-600',
    borderColor: 'border-amber-400/60',
    popular: true
  },
  {
    id: 'ELITE',
    name: 'ELITE PASS',
    badge: 'Overall Conclave Pass • Both Days',
    tagline: 'All-Access Day 1 & Day 2 Grand Package',
    daysLabel: 'Both Days • 28/09 & 29/09/2026',
    agenda: 'Day 1 Workshop &/or Project Display (Choose 1 or Both) + Day 2 (1 Tech & 1 Non-Tech Event)',
    priceDisplay: '₹450',
    priceNote: '₹450 / person (Overall Conclave Access)',
    offerDetails: 'Full 2-Day Conclave Access for ₹450/person! Choose Day 1 events (Workshop, Project Display, or both) + Day 2 (1 Tech & 1 Non-Tech Event).',
    accommodationNote: 'Accommodation will NOT be provided. Only Food and Refreshments are provided for both days.',
    features: [
      'Day 1 Choice: Select Hands-on Workshop, Project Display, or both events',
      'Day 2 Choice: 1 Technical Event + 1 Non-Technical Event included',
      'Unbeatable overall value: Up to 4 high-impact events for just ₹450/person',
      'Official Symposium Delegate Kit & Verified Certifications',
      'Food & Refreshments provided for both days',
      'Important: Accommodation is NOT provided (only food & refreshments)'
    ],
    accentGradient: 'from-purple-600 via-pink-600 to-amber-500',
    borderColor: 'border-purple-400/60'
  }
];

export const VENUE_LOCATION = "Department of Electrical and Electronics Engineering, Government College of Engineering, Erode – 638316";
export const CAMPUS_IMAGE_URL = "https://lh3.googleusercontent.com/d/13_YHLKtKakHsHGpOVNBaY7-15uQpzYSm";
export const CAMPUS_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920";

export const EVENTS: Event[] = [
  // ==========================================
  // DAY 1 (28/09/2026) - WORKSHOP & PROJECT DISPLAY
  // ==========================================
  {
    id: "workshop",
    title: "SOLAR 2.0 : THE NEXT GENERATION SOLAR ENERGY TECHNOLOGY",
    description: "Solar 2.0 is a technical workshop focused on emerging solar energy technologies and their future applications. Participants will explore solar PV systems, MPPT, inverters, energy storage, and smart solar technologies. A hands-on MATLAB/Simulink simulation session will help participants understand and analyse solar PV system performance. The workshop also highlights the role of solar energy in smart grids, electric vehicles, and sustainable power systems.",
    slogan: "Think Beyond Solar , Build Beyond Tomorrow !!!",
    category: EventCategory.TECHNICAL,
    day: 1,
    dayLabel: "Day 1 (Morning) • 28/09/2026",
    maxMembers: 1,
    fee: 200,
    feeDisplay: "₹200 (1 Event) • ₹300 (Both)",
    feeNote: "NOVA Pass: ₹200 for single event or ₹300 for both Day 1 events combo (Save ₹100)",
    whatsappUrl: "https://chat.whatsapp.com/E5Wg9NiKlfnE7xqZlRRIiP?s=sh&p=a&mlu=4&ilr=4?s=sh&p=a&mlu=4&ilr=4",
    prize: "Official Workshop Certification",
    timing: "Day 1 (28/09/2026) • Morning 09:30 AM – 01:00 PM",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "SESSION 1: EMERGING SOLAR PV, MPPT & POWER CONVERSION",
        details: "Comprehensive technical insights into emerging solar PV systems, MPPT, inverters, energy storage, smart grids, and electric vehicle power systems."
      },
      {
        name: "SESSION 2: HANDS-ON MATLAB / SIMULINK SIMULATION",
        details: "Interactive, hands-on simulation session to analyze, design, and understand solar PV system performance and characteristics."
      }
    ],
    rules: [
      "1) Prior registration is mandatory for all participants.",
      "2) Participants must report at the venue before the scheduled time.",
      "3) Participants should carry their college ID card and registration confirmation.",
      "4) Participants should actively participate in all practical and interactive sessions.",
      "5) Participants must follow the instructions of the workshop coordinator.",
      "6) Certificates will be provided to all participants."
    ],
    coordinators: [
      { name: "SUNDHARAMOORTHI K", phone: "8248121866" }
    ]
  },
  {
    id: "project-expo",
    title: "PROJECT DISPLAY",
    description: "Project Display is a platform where participants showcase their projects and working models to demonstrate practical applications of their ideas. The event encourages innovation, creativity, and hands-on problem solving. Participants explain their project concepts, design, and implementation clearly before judges. Project Display helps students enhance technical knowledge, teamwork, communication, and presentation skills.",
    slogan: "Show Your Skills. Share Your Vision. Learn. Create. Present.",
    category: EventCategory.TECHNICAL,
    day: 1,
    dayLabel: "Day 1 (Afternoon) • 28/09/2026",
    maxMembers: 4,
    fee: 200,
    feeDisplay: "₹200 (1 Event) • ₹300 (Both)",
    feeNote: "NOVA Pass: ₹200 for single event or ₹300 for both Day 1 events combo (Save ₹100)",
    whatsappUrl: "https://chat.whatsapp.com/Gqe4SAFgEYW7dvBvBzdhWh?s=sw&p=a&mlu=4&ilr=4",
    prize: "Certificate + Cash Prize",
    timing: "Day 1 (28/09/2026) • Afternoon 01:30 PM – 04:30 PM",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "HARDWARE PROTOTYPE / WORKING MODEL DISPLAY",
        details: "Teams display their hardware prototype or working model to demonstrate practical applications and hands-on problem solving."
      },
      {
        name: "PROJECT PRESENTATION & JURY EVALUATION",
        details: "Each team is given 5–6 minutes to present concepts, design, and implementation before judges. All members must participate equally in presentation."
      }
    ],
    rules: [
      "1. A team may consist of a maximum of 3–4 members.",
      "2. The abstract must not exceed 400 words.",
      "3. Each team will be given 5–6 minutes for project presentation.",
      "4. A valid college identity card is mandatory for all participants.",
      "5. A hardware prototype or working model must be displayed on the day of the event.",
      "6. Project PPT presentation is optional.",
      "7. All team members must participate equally in the presentation.",
      "8. Projects will be evaluated based on innovation, technical content, working demonstration, and clarity of presentation."
    ],
    coordinators: [
      { name: "Mehanathan R", phone: "8056865856" },
      { name: "Rithanya K" }
    ]
  },

  // ==========================================
  // DAY 2 (29/09/2026) - 4 TECHNICAL EVENTS
  // ==========================================
  {
    id: "paperxpose",
    title: "PAPERXPOSE",
    slogan: "Turn your ideas into impact!",
    description: "Paper Presentation is a technical event where participants present their ideas, research, and technical concepts. The event helps participants improve their technical knowledge, creativity, communication, and presentation skills. It provides a platform to share ideas, learn new concepts, and gain confidence in presenting before an audience and judges.",
    category: EventCategory.TECHNICAL,
    day: 2,
    dayLabel: "Day 2 • 29/09/2026",
    maxMembers: 4,
    fee: 300,
    feeDisplay: "₹300 (1 Tech + 1 Non-Tech FREE)",
    feeNote: "AURA Pass: ₹300 / person includes 1 Technical Event + 1 Non-Technical Event completely FREE!",
    whatsappUrl: "https://chat.whatsapp.com/HzPaDf7lt13Ctsef7DWyRd?s=cl&p=a&mlu=4&ilr=4",
    prize: "Certificate + Cash Prize",
    timing: "Day 2 (29/09/2026) • 09:30 AM",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "TECHNICAL PAPER PRESENTATION & Q&A",
        details: "5 to 7 minutes presentation followed by 3 minutes for Q&A. Maximum 7 slides permitted. Videos are not allowed."
      }
    ],
    rules: [
      "1. Team Size: A maximum of 4 members per team is allowed.",
      "2. Maximum Slides: A maximum of 7 slides are permitted. Videos are not allowed.",
      "3. Slide Contents: Title Page, Abstract & Problem Statement, Technical Approach, Impacts & Benefits, Future Scope & Applications and Results & Conclusion.",
      "4. Presentation Time: 5 to 7 minutes for presentation, followed by 3 minutes for Q&A.",
      "5. PPT & Abstract Submission: Participants must submit the PPT and Abstract to the coordinator before the presentation.",
      "6. Judging Criteria: Judging will be based on Content, Innovation, and Presentation Skills.",
      "7. Judges' Decision: The judges' decision will be final and binding.",
      "8. College ID Card: College ID card is mandatory for all participants.",
      "9. Certification: Certificates will be provided to all participants."
    ],
    coordinators: [
      { name: "SUNDHARAMOORTHI K", phone: "8248121866" },
      { name: "KAVIYADHARSANA R" }
    ]
  },
  {
    id: "tech-spark",
    title: "TECH SPARK",
    slogan: "Think Smart. Solve Fast. Spark Your Technical Mind!",
    description: "Mode: Traditional Pen & Paper | Number of Rounds: 2 | Participation: Individual. Participants decode image combinations into science and engineering terms and face basic electrical questions, real-world situational challenges, and EEE-based riddles without using the internet.",
    category: EventCategory.TECHNICAL,
    day: 2,
    dayLabel: "Day 2 • 29/09/2026",
    maxMembers: 1,
    fee: 300,
    feeDisplay: "₹300 (1 Tech + 1 Non-Tech FREE)",
    feeNote: "AURA Pass: ₹300 / person includes 1 Technical Event + 1 Non-Technical Event completely FREE!",
    whatsappUrl: "https://chat.whatsapp.com/Gc1EQR8vvUDLI2PZJmxQjw?s=cl&p=a&mlu=4&ilr=4",
    prize: "Certificate + Cash Prize",
    timing: "Day 2 (29/09/2026) • 10:30 AM",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "Round 1 – IMAGE TO TECH",
        details: "Participants will identify the names or sounds represented by a set of images and combine them to form Science, Engineering, or Technology-related terms."
      },
      {
        name: "Round 2 – ELECTRICAL & SITUATIONAL CHALLENGE",
        details: "Participants will face basic electrical questions, real-world situational challenges, and EEE-based riddles to test fundamental knowledge, technical understanding, and practical problem-solving skills."
      }
    ],
    rules: [
      "• Participation is strictly individual.",
      "• The event will be conducted through the traditional pen-and-paper method.",
      "• No negative marking.",
      "• Use of the internet is not allowed during the event.",
      "• Participants must analyse the questions and situations carefully and provide suitable answers.",
      "• Evaluation will be based on accuracy, understanding, technical knowledge, and problem-solving ability.",
      "• Coordinator’s decision will be final.",
      "• Ranking is based on total score of 2 rounds."
    ],
    coordinators: [
      { name: "Garunyaa S" },
      { name: "Arun N T", phone: "9842139399" }
    ]
  },
  {
    id: "quiztech-360",
    title: "QUIZTECH 360°",
    slogan: "Challenge Your Mind. Prove Your Knowledge.",
    description: "It is an individual technical quiz open to students from all engineering branches. The event tests technical knowledge, logical thinking, observation, speed, and accuracy through multiple exciting rounds.",
    category: EventCategory.TECHNICAL,
    day: 2,
    dayLabel: "Day 2 • 29/09/2026",
    maxMembers: 1,
    fee: 300,
    feeDisplay: "₹300 (1 Tech + 1 Non-Tech FREE)",
    feeNote: "AURA Pass: ₹300 / person includes 1 Technical Event + 1 Non-Technical Event completely FREE!",
    whatsappUrl: "https://chat.whatsapp.com/JyvnUJFNITDAar8sB3L6VK?s=cl&p=a&mlu=4&ilr=4",
    prize: "Certificate + Cash Prize",
    timing: "Day 2 (29/09/2026) • 11:30 AM",
    image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "Round 1 – Foundation",
        details: "Technical MCQs testing fundamental concepts."
      },
      {
        name: "Round 2 – Interactive",
        details: "Guess, Match & Identify tasks."
      },
      {
        name: "Round 3 – Rapid Fire",
        details: "Buzzer mode to answer. Scoring: Correct +2 | Wrong −1 | Steal option available."
      },
      {
        name: "Final Round – All Play",
        details: "All finalists answer all questions. No elimination. Final round uses participant's own mobile. Final ranking is based on total score."
      }
    ],
    rules: [
      "• Individual participation – No teams.",
      "• Open to all engineering branches.",
      "• Round 1 – Foundation: Technical MCQs.",
      "• Round 2 – Interactive: Guess, Match & Identify.",
      "• Round 3 – Rapid Fire: buzzer mode to answer.",
      "• Scoring: Correct +2 | Wrong −1 | Steal option available.",
      "• Final Round – All Play: All finalists answer all questions. No elimination.",
      "• Winner: Final ranking is based on the total score.",
      "• Final Round: Use your own mobile.",
      "• Organizer's decision will be final."
    ],
    coordinators: [
      { name: "VIMAL.M", phone: "9361805238" },
      { name: "SABITHA.K" },
      { name: "SANGEETHA. R" }
    ]
  },
  {
    id: "trace-find",
    title: "TRACE & FIND",
    slogan: "Find the Fault. Fix the Circuit.",
    description: "A technical troubleshooting event where teams solve electrical and electronic circuit-based questions through three progressive levels. Tests your circuit analysis, fault finding, and analytical reasoning.",
    category: EventCategory.TECHNICAL,
    day: 2,
    dayLabel: "Day 2 • 29/09/2026",
    maxMembers: 4,
    fee: 300,
    feeDisplay: "₹300 (1 Tech + 1 Non-Tech FREE)",
    feeNote: "AURA Pass: ₹300 / person includes 1 Technical Event + 1 Non-Technical Event completely FREE!",
    whatsappUrl: "https://chat.whatsapp.com/C1z8pRcOZImI5BF0KQuYl6?s=cl&p=a&mlu=4&ilr=4",
    prize: "Certificate + Cash Prize",
    timing: "Day 2 (29/09/2026) • 01:30 PM",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "Level 1 – MCQ",
        details: "Basic circuit and troubleshooting concepts with multiple-choice questions."
      },
      {
        name: "Level 2 – Assertion & Reasoning",
        details: "Teams must analyse the given Assertion (A) and Reason (R) and select the correct relationship."
      },
      {
        name: "Level 3 – Fill in the Blanks",
        details: "Teams must complete technical statements."
      }
    ],
    rules: [
      "• Team: 1–4 members/team. One round with 3 progressive levels.",
      "• Level 1 – MCQ: Basic circuit and troubleshooting concepts with multiple-choice questions.",
      "• Level 2 – Assertion & Reasoning: Analyse given Assertion (A) and Reason (R) to determine relationship.",
      "• Level 3 – Fill in the Blanks: Complete technical circuit statements.",
      "• Event will be conducted like a traditional pen and paper event.",
      "• Both question paper and pen will be provided.",
      "• No negative marks.",
      "• No mobile phones, smart watches, internet, calculators, or external assistance.",
      "• Discussion only within the team.",
      "• Coordinator's decision will be final and binding."
    ],
    coordinators: [
      { name: "PREETHA" },
      { name: "TAMILSELVAN", phone: "6379697946" }
    ]
  },

  // ==========================================
  // DAY 2 (29/09/2026) - 4 NON-TECHNICAL EVENTS
  // ==========================================
  {
    id: "cinequest",
    title: "CINEQUEST",
    slogan: "Where Every Clue Leads to a Blockbuster!",
    description: "CineQuest is an entertaining and engaging quiz event that celebrates the world of Tamil Cinema. Participants will test their knowledge of Tamil movies, songs, and iconic dialogues through exciting and challenging rounds. The event encourages teamwork, quick thinking, memory, and cinematic knowledge while providing a fun-filled experience.",
    category: EventCategory.NON_TECHNICAL,
    day: 2,
    dayLabel: "Day 2 • 29/09/2026",
    maxMembers: 4,
    fee: 300,
    feeDisplay: "FREE with Tech / ₹300",
    feeNote: "AURA Pass: 100% FREE when paired with any Technical Event, or ₹300 individual pass",
    whatsappUrl: "https://chat.whatsapp.com/ClH7fGb0pyeLueceOerRny?s=cl&p=a&mlu=4&ilr=4",
    prize: "Certificate + Cash Prize",
    timing: "Day 2 (29/09/2026) • 11:30 AM",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "Round 1 – Guess the Song / Guess the Movie",
        details: "Participants must identify the song or movie using connected pictures and given clues."
      },
      {
        name: "Round 2 – Complete the Dialogue",
        details: "Participants must complete famous Tamil movie dialogues. Buzzer-based answering system."
      }
    ],
    rules: [
      "1. Team Size: Each team must consist of 3–4 members.",
      "2. Quiz Theme: The quiz will be based entirely on Tamil Cinema.",
      "3. Number of Rounds: The event consists of 2 rounds.",
      "4. Round 1 – Guess the Song / Guess the Movie: Identify song or movie using connected pictures and given clues.",
      "5. Round 2 – Complete the Dialogue: Complete famous Tamil movie dialogues.",
      "6. Buzzer System: The quiz is buzzer-based. The team that presses first answers.",
      "7. Time Limit: Each question will have a specified time limit for answering.",
      "8. Mobile & Internet Usage: Mobile phones and internet usage are strictly prohibited.",
      "9. Answering: Only answers given within the allotted time will be considered.",
      "10. Tie-Breaker: In case of a tie, a tie-breaker question/round will determine the winner.",
      "11. Quizmaster’s Decision: The decision of the Quizmaster will be final and binding."
    ],
    coordinators: [
      { name: "DHARSHAN N", phone: "8122578554" },
      { name: "SARMIYA P" }
    ]
  },
  {
    id: "guess-my-act",
    title: "GUESS MY ACT",
    slogan: "Act It Out. Read the Gesture. Beat the Clock.",
    description: "A fun non-technical event where one participant acts out a given word or phrase using only gestures and expressions, while teammates try to guess it.",
    category: EventCategory.NON_TECHNICAL,
    day: 2,
    dayLabel: "Day 2 • 29/09/2026",
    maxMembers: 4,
    fee: 300,
    feeDisplay: "FREE with Tech / ₹300",
    feeNote: "AURA Pass: 100% FREE when paired with any Technical Event, or ₹300 individual pass",
    whatsappUrl: "https://chat.whatsapp.com/I1rwmwE7B6cLfDMATZRjRv?s=cl&p=a&mlu=4&ilr=4",
    prize: "Certificate + Cash Prize",
    timing: "Day 2 (29/09/2026) • 12:00 PM",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "ACT & GUESS",
        details: "1 member acts out the word/phrase using gestures, body movements, and expressions (no speaking, sounds, lip-reading, or writing). Teammates must guess within 60 seconds."
      }
    ],
    rules: [
      "1. Team size: 2–4 members.",
      "2. Only 1 round.",
      "3. 1 member will act and the others will guess.",
      "4. Time limit: 60 seconds.",
      "5. No speaking, sounds, lip-reading, or writing.",
      "6. Gestures, body movements, and expressions are allowed.",
      "7. Correct answer: +2 points.",
      "8. Acting/creativity: +1 point."
    ],
    coordinators: [
      { name: "Mithra" },
      { name: "Sriram", phone: "+918778743292" }
    ]
  },
  {
    id: "ipl-auction",
    title: "IPL AUCTION",
    slogan: "Bid Smart. Build Strong. Rule the Auction!",
    description: "A fun and competitive non-technical event where teams experience the excitement of an IPL-style player auction. Teams must use strategy, teamwork, bidding skills, and budget management to build the strongest possible squad.",
    category: EventCategory.NON_TECHNICAL,
    day: 2,
    dayLabel: "Day 2 • 29/09/2026",
    maxMembers: 3,
    fee: 300,
    feeDisplay: "FREE with Tech / ₹300",
    feeNote: "AURA Pass: 100% FREE when paired with any Technical Event, or ₹300 individual pass",
    whatsappUrl: "https://chat.whatsapp.com/HC7ANJM7rZ51vXDzHIhsjl?s=cl&p=a&mlu=4&ilr=4",
    prize: "Certificate + Cash Prize",
    timing: "Day 2 (29/09/2026) • 01:30 PM",
    image: "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "AUCTION BIDDING ARENA",
        details: "Each team represents an IPL franchise with a virtual purse of ₹100 Crores to bid on 60 players. Build a balanced minimum 5-player squad (2 Batters, 1 All-rounder, 1 Bowler, 1 Wicketkeeper)."
      }
    ],
    rules: [
      "• Each team must consist of 2–3 participants.",
      "• A total of 10 IPL teams will participate.",
      "• Each team will receive a virtual purse of ₹100 Crores.",
      "• A total of 60 players will be auctioned.",
      "• Every player will have a base price announced by the auctioneer.",
      "• Bidding will start from the announced base price. The minimum bid increment is ₹1 Crore.",
      "• Teams cannot bid beyond their available purse. Once a bid is made, it cannot be withdrawn.",
      "• The player will be awarded to the highest bidder after the auctioneer declares “SOLD!”. If no team bids, the player will be declared “UNSOLD”.",
      "• Each team must purchase a minimum of 5 players: 2 Batters, 1 All-rounder, 1 Bowler, 1 Wicketkeeper.",
      "• Teams must complete their required squad within the allotted time.",
      "• A team cannot purchase additional players if doing so prevents it from completing the minimum squad requirement.",
      "• Mobile phones and other electronic devices are strictly prohibited during the event.",
      "• Any form of cheating or malpractice will result in immediate disqualification.",
      "• Participants are expected to maintain discipline and proper decorum throughout the event.",
      "• The decision of the auctioneer/event coordinators will be final and binding."
    ],
    coordinators: [
      { name: "GOKUL RAJ M", phone: "9025280584" },
      { name: "JENY PRINCY B" }
    ]
  },
  {
    id: "card-of-chaos",
    title: "CARD OF CHAOS",
    slogan: "Find the Pattern. Crack the Answer.",
    description: "A fun-filled non-technical puzzle game that tests general knowledge, observation, pattern recognition, logical thinking, and speed. Participants will be given questions and a collection of cards. The answer must be identified by cracking the hidden pattern in the cards.",
    category: EventCategory.NON_TECHNICAL,
    day: 2,
    dayLabel: "Day 2 • 29/09/2026",
    maxMembers: 3,
    fee: 300,
    feeDisplay: "FREE with Tech / ₹300",
    feeNote: "AURA Pass: 100% FREE when paired with any Technical Event, or ₹300 individual pass",
    whatsappUrl: "https://chat.whatsapp.com/CNzTIhlerkZJ8M77Rt9A7V?s=cl&p=a&mlu=4&ilr=4",
    prize: "Certificate + Cash Prize",
    timing: "Day 2 (29/09/2026) • 02:30 PM",
    image: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "Round 1 – Pattern Hunt (“Observe. Connect. Crack!”)",
        details: "General question with a set of cards (letters, numbers, symbols, shapes, emojis). Identify hidden pattern and arrange answer cards within 30s. 2 points/question."
      },
      {
        name: "Round 2 – Chaos Code (“The pattern gets harder!”)",
        details: "Decode hidden coding system from 2–3 clues and represent correct answer with cards within 45s. Correct pattern + answer = 3 points."
      },
      {
        name: "Round 3 – The Ultimate Chaos (“One question. Multiple patterns. One winner!”)",
        details: "Complex puzzle with decoy cards. Eliminate decoys and arrange final answer within 2 minutes. Correct answer = 5 points (+2 bonus for first team). Sudden-death tiebreaker if needed."
      }
    ],
    rules: [
      "• Round 1 – Pattern Hunt: 30s limit per question. Identify hidden pattern and arrange cards. 2 points per correct answer.",
      "• Round 2 – Chaos Code: 45s limit per question. Decode pattern from 2–3 clues. Correct pattern + arrangement = 3 points (0 points if incorrect arrangement).",
      "• Round 3 – Ultimate Chaos: 2 minutes limit. Watch out for decoy cards. Correct answer = 5 points, +2 bonus points for first team to solve correctly.",
      "• Scoring: Round 1 (2 pts/q) | Round 2 (3 pts/q) | Round 3 (5 + 2 bonus). Highest total score wins.",
      "• No cards can be exchanged between teams.",
      "• No mobile phones, internet, or outside assistance (results in immediate round disqualification).",
      "• In case of a tie, a sudden-death puzzle will be conducted."
    ],
    coordinators: [
      { name: "Mohammedbarkathulla", phone: "9865008786" },
      { name: "Sariga" }
    ]
  }
];

export const SPEAKERS: Speaker[] = [];

export const SCHEDULE: ScheduleItem[] = [
  // DAY 1: 28/09/2026 (MORNING WORKSHOP & AFTERNOON PROJECT DISPLAY)
  { day: 1, dayTitle: "Day 1 (28/09/2026)", time: "08:30 AM", activity: "Day 1 Registration & Welcome Kit Distribution", type: "General", venue: "EEE Department Foyer" },
  { day: 1, dayTitle: "Day 1 (28/09/2026)", time: "09:15 AM", activity: "Grand Inauguration & Lamp Lighting Ceremony", type: "Ceremony", venue: "Main Auditorium" },
  { day: 1, dayTitle: "Day 1 (28/09/2026)", time: "09:30 AM", activity: "Solar 2.0 Workshop: Emerging Solar Energy Technologies & MATLAB/Simulink Simulation", type: "Workshop", venue: "Computing & Embedded Systems Lab" },
  { day: 1, dayTitle: "Day 1 (28/09/2026)", time: "01:00 PM", activity: "Networking Lunch & Refreshment Break", type: "General", venue: "College Food Court" },
  { day: 1, dayTitle: "Day 1 (28/09/2026)", time: "01:30 PM", activity: "Project Display: Working Model Presentation, Innovation Expo & Jury Evaluation", type: "Project Expo", venue: "EEE Project Arena" },
  { day: 1, dayTitle: "Day 1 (28/09/2026)", time: "04:30 PM", activity: "Day 1 Valedictory & Workshop / Project Display Certificate Distribution", type: "Ceremony", venue: "Main Auditorium" },

  // DAY 2: 29/09/2026 (4 TECHNICAL & 4 NON-TECHNICAL BATTLES)
  { day: 2, dayTitle: "Day 2 (29/09/2026)", time: "08:30 AM", activity: "Day 2 Delegate Reporting & Morning Refreshments", type: "General", venue: "Department Foyer" },
  { day: 2, dayTitle: "Day 2 (29/09/2026)", time: "09:30 AM", activity: "PaperXpose Presentations & Tech Spark (Round 1)", type: "Technical", venue: "Conference Hall & Computing Center" },
  { day: 2, dayTitle: "Day 2 (29/09/2026)", time: "10:30 AM", activity: "Tech Spark (Round 2) & QuizTech 360° Showdown", type: "Technical", venue: "EEE Seminar Hall & Classrooms" },
  { day: 2, dayTitle: "Day 2 (29/09/2026)", time: "11:30 AM", activity: "Trace & Find Troubleshooting & CineQuest (Tamil Cinema Quiz)", type: "Technical / Non-Tech", venue: "Circuits Lab & Seminar Hall" },
  { day: 2, dayTitle: "Day 2 (29/09/2026)", time: "12:00 PM", activity: "Guess My Act (Gesture & Expression Battle)", type: "Non-Technical", venue: "EEE Classroom 102" },
  { day: 2, dayTitle: "Day 2 (29/09/2026)", time: "01:00 PM", activity: "Symposium Lunch Break", type: "General", venue: "College Food Court" },
  { day: 2, dayTitle: "Day 2 (29/09/2026)", time: "01:30 PM", activity: "IPL Auction: Mega Franchise Bidding War", type: "Non-Technical", venue: "Main Auditorium" },
  { day: 2, dayTitle: "Day 2 (29/09/2026)", time: "02:30 PM", activity: "Card of Chaos: Pattern Hunt, Chaos Code & Ultimate Chaos", type: "Non-Technical", venue: "Audio-Visual Hall" },
  { day: 2, dayTitle: "Day 2 (29/09/2026)", time: "04:00 PM", activity: "Grand Valediction, Award Ceremony & Cash Prize Distribution", type: "Ceremony", venue: "Main Auditorium" }
];

export const SPONSORS: Sponsor[] = [
  { id: "sp1", name: "ABB", tier: "Title", logo: "https://picsum.photos/seed/abb/200/200" },
  { id: "sp2", name: "Siemens", tier: "Gold", logo: "https://picsum.photos/seed/siemens/200/200" }
];

export const OFFICIAL_COORDINATORS = [
  {
    role: "Secretary",
    name: "Barath kumar",
    phone: "6380616416",
    displayPhone: "+91 63806 16416",
    waLink: "https://wa.me/916380616416?text=Hi%20Barath%20kumar%2C%20I%20have%20an%20inquiry%20regarding%20ELIXIR%2726",
    email: "gceelixir26@gmail.com",
    department: "Department of EEE"
  },
  {
    role: "Joint Secretary",
    name: "Abinaya",
    phone: "",
    displayPhone: "",
    waLink: "",
    email: "gceelixir26@gmail.com",
    department: "Department of EEE"
  },
  {
    role: "Co-ordinator",
    name: "Bala Muppidathy",
    phone: "8015172974",
    displayPhone: "+91 80151 72974",
    waLink: "https://wa.me/918015172974?text=Hi%20Bala%20Muppidathy%2C%20I%20have%20an%20inquiry%20regarding%20ELIXIR%2726",
    email: "gceelixir26@gmail.com",
    department: "Department of EEE"
  }
];

export const TRANSIT_GUIDE = {
  title: "GETTING TO IRT",
  subtitle: "Government bus services to the college campus",
  morningDepartures: {
    fromErodeBusStand: [
      { name: "Route Bus", time: "8:00 AM" },
      { name: "Town Govt Bus", time: "8:00 AM" },
      { name: "Town Govt Bus 5B", time: "8:30 AM" }
    ],
    fromChithode: [
      { name: "Route Bus", time: "8:15 – 8:20 AM" },
      { name: "Town Govt Bus", time: "8:30 – 8:35 AM" },
      { name: "Town Govt Bus 5B", time: "Around 8:50 AM" }
    ]
  },
  goodToKnow: [
    "Route buses from Erode Bus Stand and Chithode reach the college by around 8:45 AM.",
    "Town bus from Lakshmi Nagar / Bhavani Bypass departs about 8:10 AM and reaches the college by 8:30 AM.",
    "Bus No. 3 and B12 run roughly every 5 minutes from Lakshmi Nagar or Bhavani Bypass – get down at the Government College of Engineering stop, then a short walk to campus.",
    "Bus No. 3 runs roughly every 10 minutes from Erode Bus Stand – get down at the Government College of Engineering (IRTT) stop, then a short walk to campus."
  ]
};

export interface EventWhatsAppInfo {
  id: string;
  title: string;
  shortName: string;
  link: string;
  category: string;
}

export const EVENT_WHATSAPP_LINKS: Record<string, EventWhatsAppInfo> = {
  "workshop": {
    id: "workshop",
    title: "SOLAR 2.0 : THE NEXT GENERATION SOLAR ENERGY TECHNOLOGY",
    shortName: "Solar 2.0 Workshop",
    link: "https://chat.whatsapp.com/E5Wg9NiKlfnE7xqZlRRIiP?s=sh&p=a&mlu=4&ilr=4?s=sh&p=a&mlu=4&ilr=4",
    category: "Day 1 Workshop"
  },
  "project-expo": {
    id: "project-expo",
    title: "PROJECT DISPLAY",
    shortName: "Project Display",
    link: "https://chat.whatsapp.com/Gqe4SAFgEYW7dvBvBzdhWh?s=sw&p=a&mlu=4&ilr=4",
    category: "Day 1 Technical"
  },
  "paperxpose": {
    id: "paperxpose",
    title: "PAPERXPOSE",
    shortName: "PaperXpose",
    link: "https://chat.whatsapp.com/HzPaDf7lt13Ctsef7DWyRd?s=cl&p=a&mlu=4&ilr=4",
    category: "Day 2 Technical"
  },
  "tech-spark": {
    id: "tech-spark",
    title: "TECH SPARK",
    shortName: "Tech Spark",
    link: "https://chat.whatsapp.com/Gc1EQR8vvUDLI2PZJmxQjw?s=cl&p=a&mlu=4&ilr=4",
    category: "Day 2 Technical"
  },
  "quiztech-360": {
    id: "quiztech-360",
    title: "QUIZTECH 360°",
    shortName: "QuizTech 360°",
    link: "https://chat.whatsapp.com/JyvnUJFNITDAar8sB3L6VK?s=cl&p=a&mlu=4&ilr=4",
    category: "Day 2 Technical"
  },
  "trace-find": {
    id: "trace-find",
    title: "TRACE & FIND",
    shortName: "Trace & Find",
    link: "https://chat.whatsapp.com/C1z8pRcOZImI5BF0KQuYl6?s=cl&p=a&mlu=4&ilr=4",
    category: "Day 2 Technical"
  },
  "cinequest": {
    id: "cinequest",
    title: "CINEQUEST",
    shortName: "CineQuest",
    link: "https://chat.whatsapp.com/ClH7fGb0pyeLueceOerRny?s=cl&p=a&mlu=4&ilr=4",
    category: "Day 2 Non-Technical"
  },
  "guess-my-act": {
    id: "guess-my-act",
    title: "GUESS MY ACT",
    shortName: "Guess My Act",
    link: "https://chat.whatsapp.com/I1rwmwE7B6cLfDMATZRjRv?s=cl&p=a&mlu=4&ilr=4",
    category: "Day 2 Non-Technical"
  },
  "ipl-auction": {
    id: "ipl-auction",
    title: "IPL AUCTION",
    shortName: "IPL Auction",
    link: "https://chat.whatsapp.com/HC7ANJM7rZ51vXDzHIhsjl?s=cl&p=a&mlu=4&ilr=4",
    category: "Day 2 Non-Technical"
  },
  "card-of-chaos": {
    id: "card-of-chaos",
    title: "CARD OF CHAOS",
    shortName: "Card of Chaos",
    link: "https://chat.whatsapp.com/CNzTIhlerkZJ8M77Rt9A7V?s=cl&p=a&mlu=4&ilr=4",
    category: "Day 2 Non-Technical"
  }
};

export function getEventWhatsAppData(idOrTitle: string): EventWhatsAppInfo | null {
  if (!idOrTitle) return null;
  const normalized = idOrTitle.toLowerCase().trim();
  
  if (EVENT_WHATSAPP_LINKS[normalized]) {
    return EVENT_WHATSAPP_LINKS[normalized];
  }
  
  const found = Object.entries(EVENT_WHATSAPP_LINKS).find(([key, data]) => {
    const titleLow = data.title.toLowerCase();
    const shortLow = data.shortName.toLowerCase();
    return (
      key === normalized ||
      titleLow === normalized ||
      shortLow === normalized ||
      normalized.includes(key) ||
      normalized.includes(shortLow) ||
      (normalized.includes('workshop') && key === 'workshop') ||
      (normalized.includes('solar') && key === 'workshop') ||
      (normalized.includes('project') && key === 'project-expo') ||
      (normalized.includes('paper') && key === 'paperxpose') ||
      (normalized.includes('spark') && key === 'tech-spark') ||
      (normalized.includes('quiz') && key === 'quiztech-360') ||
      (normalized.includes('trace') && key === 'trace-find') ||
      (normalized.includes('cine') && key === 'cinequest') ||
      (normalized.includes('guess') && key === 'guess-my-act') ||
      (normalized.includes('ipl') && key === 'ipl-auction') ||
      (normalized.includes('chaos') && key === 'card-of-chaos')
    );
  });
  
  return found ? found[1] : null;
}

