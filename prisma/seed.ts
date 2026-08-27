import { PrismaClient, CollegeType, Stream, Exam, CourseLevel, Category, Gender } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NextCampus database with complete 24-college catalog...');

  // Clear existing data cleanly
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.collegeCutoff.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.collegeExam.deleteMany({});
  await prisma.collegeStream.deleteMany({});
  await prisma.college.deleteMany({});

  const collegesData = [
    // 1. IIT Delhi
    {
      slug: 'iit-delhi',
      name: 'Indian Institute of Technology Delhi',
      shortName: 'IIT Delhi',
      description: 'IIT Delhi is one of the 23 IITs created to be Centres of Excellence for training, research and development in science, engineering and technology in India.',
      city: 'New Delhi',
      state: 'Delhi',
      type: CollegeType.GOVERNMENT,
      nirfRank: 2,
      naacGrade: 'A++',
      establishedYear: 1961,
      campusAreaAcres: 320,
      studentFacultyRatio: '1:10',
      overallRating: 4.8,
      ratingCount: 142,
      streams: [Stream.ENGINEERING, Stream.SCIENCE],
      exams: [Exam.JEE_ADVANCED, Exam.GATE],
      courses: [
        { name: 'B.Tech in Computer Science and Engineering', shortName: 'B.Tech CSE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 850000, annualFees: 212500, seats: 99, eligibility: '10+2 with 75% in PCM + JEE Advanced' },
        { name: 'B.Tech in Electrical Engineering', shortName: 'B.Tech EE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 850000, annualFees: 212500, seats: 120, eligibility: '10+2 with 75% in PCM + JEE Advanced' },
        { name: 'M.Tech in Artificial Intelligence', shortName: 'M.Tech AI', level: CourseLevel.PG, stream: Stream.ENGINEERING, duration: 2, totalFees: 240000, annualFees: 120000, seats: 40, eligibility: 'B.Tech with 60% + GATE' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 200, averagePackageLpa: 25.8, medianPackageLpa: 22.0, placementPercent: 94.5, totalOffers: 1300, topRecruiters: ['Google', 'Microsoft', 'Apple', 'Goldman Sachs', 'Jane Street'] },
        { year: 2023, highestPackageLpa: 240, averagePackageLpa: 24.5, medianPackageLpa: 20.5, placementPercent: 96.0, totalOffers: 1400, topRecruiters: ['Google', 'Microsoft', 'Uber', 'Amazon'] }
      ],
      reviews: [
        { reviewerName: 'Aarav Sharma', graduationYear: 2024, course: 'B.Tech CSE', overallRating: 5.0, infrastructureRating: 4.8, facultyRating: 4.9, placementRating: 5.0, hostelRating: 4.2, reviewText: 'World-class campus with extraordinary coding culture and high research exposure.', pros: 'Unmatched peer group, top placements', cons: 'High academic competition', helpful: 24 }
      ],
      cutoffs: [
        { exam: Exam.JEE_ADVANCED, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 60, closeRank: 115 },
        { exam: Exam.JEE_ADVANCED, year: 2024, category: Category.OBC, gender: Gender.NEUTRAL, openRank: 30, closeRank: 70 },
        { exam: Exam.JEE_ADVANCED, year: 2024, category: Category.SC, gender: Gender.NEUTRAL, openRank: 15, closeRank: 40 }
      ]
    },

    // 2. IIT Bombay
    {
      slug: 'iit-bombay',
      name: 'Indian Institute of Technology Bombay',
      shortName: 'IIT Bombay',
      description: 'IIT Bombay is recognized worldwide as a leader in engineering education and scientific research, situated beside Powai Lake in Mumbai.',
      city: 'Mumbai',
      state: 'Maharashtra',
      type: CollegeType.GOVERNMENT,
      nirfRank: 3,
      naacGrade: 'A++',
      establishedYear: 1958,
      campusAreaAcres: 550,
      studentFacultyRatio: '1:9',
      overallRating: 4.9,
      ratingCount: 180,
      streams: [Stream.ENGINEERING, Stream.SCIENCE, Stream.DESIGN],
      exams: [Exam.JEE_ADVANCED, Exam.GATE],
      courses: [
        { name: 'B.Tech in Computer Science & Engineering', shortName: 'B.Tech CSE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 900000, annualFees: 225000, seats: 120, eligibility: '10+2 with 75% in PCM + JEE Advanced' },
        { name: 'B.Tech in Electrical Engineering', shortName: 'B.Tech EE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 900000, annualFees: 225000, seats: 130, eligibility: '10+2 with 75% in PCM + JEE Advanced' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 220, averagePackageLpa: 26.5, medianPackageLpa: 23.0, placementPercent: 95.0, totalOffers: 1450, topRecruiters: ['Optiver', 'Jane Street', 'Google', 'Microsoft', 'Sony Japan'] }
      ],
      reviews: [
        { reviewerName: 'Rohan Mehra', graduationYear: 2024, course: 'B.Tech CSE', overallRating: 5.0, infrastructureRating: 5.0, facultyRating: 4.8, placementRating: 5.0, hostelRating: 4.5, reviewText: 'The campus life by Powai Lake is magnificent. Mood Indigo and Techfest are unbeatable.', pros: 'E-Cell ecosystem, top international offers', cons: 'High stress during midsems', helpful: 32 }
      ],
      cutoffs: [
        { exam: Exam.JEE_ADVANCED, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 1, closeRank: 68 },
        { exam: Exam.JEE_ADVANCED, year: 2024, category: Category.OBC, gender: Gender.NEUTRAL, openRank: 1, closeRank: 45 }
      ]
    },

    // 3. IIT Madras
    {
      slug: 'iit-madras',
      name: 'Indian Institute of Technology Madras',
      shortName: 'IIT Madras',
      description: 'IIT Madras is nationally ranked #1 overall by NIRF for multiple consecutive years, known for its extensive research park and deep tech incubation.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      type: CollegeType.GOVERNMENT,
      nirfRank: 1,
      naacGrade: 'A++',
      establishedYear: 1959,
      campusAreaAcres: 630,
      studentFacultyRatio: '1:8',
      overallRating: 4.9,
      ratingCount: 160,
      streams: [Stream.ENGINEERING, Stream.SCIENCE],
      exams: [Exam.JEE_ADVANCED, Exam.GATE],
      courses: [
        { name: 'B.Tech in Computer Science and Engineering', shortName: 'B.Tech CSE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 820000, annualFees: 205000, seats: 87, eligibility: '10+2 with 75% in PCM + JEE Advanced' },
        { name: 'B.Tech in Aerospace Engineering', shortName: 'B.Tech Aero', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 820000, annualFees: 205000, seats: 50, eligibility: '10+2 with 75% in PCM + JEE Advanced' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 198, averagePackageLpa: 25.2, medianPackageLpa: 21.5, placementPercent: 94.0, totalOffers: 1200, topRecruiters: ['Texas Instruments', 'Qualcomm', 'Google', 'Microsoft'] }
      ],
      reviews: [
        { reviewerName: 'Swaminathan K', graduationYear: 2024, course: 'B.Tech CSE', overallRating: 4.9, infrastructureRating: 4.8, facultyRating: 5.0, placementRating: 4.9, hostelRating: 4.4, reviewText: 'IITM Research Park offers unprecedented startup opportunities.', pros: 'Research culture, greenery with deer on campus', cons: 'Strict grading', helpful: 20 }
      ],
      cutoffs: [
        { exam: Exam.JEE_ADVANCED, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 80, closeRank: 148 },
        { exam: Exam.JEE_ADVANCED, year: 2024, category: Category.OBC, gender: Gender.NEUTRAL, openRank: 40, closeRank: 95 }
      ]
    },

    // 4. IIT Kharagpur
    {
      slug: 'iit-kharagpur',
      name: 'Indian Institute of Technology Kharagpur',
      shortName: 'IIT Kharagpur',
      description: 'Established in 1951, IIT Kharagpur is the oldest and largest IIT campus with extensive multi-disciplinary departments.',
      city: 'Kharagpur',
      state: 'West Bengal',
      type: CollegeType.GOVERNMENT,
      nirfRank: 5,
      naacGrade: 'A++',
      establishedYear: 1951,
      campusAreaAcres: 2100,
      studentFacultyRatio: '1:11',
      overallRating: 4.7,
      ratingCount: 150,
      streams: [Stream.ENGINEERING, Stream.LAW, Stream.MANAGEMENT, Stream.ARCHITECTURE],
      exams: [Exam.JEE_ADVANCED, Exam.GATE, Exam.CAT],
      courses: [
        { name: 'B.Tech in Computer Science and Engineering', shortName: 'B.Tech CSE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 860000, annualFees: 215000, seats: 110, eligibility: '10+2 with 75% in PCM + JEE Advanced' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 210, averagePackageLpa: 22.8, medianPackageLpa: 19.0, placementPercent: 92.0, totalOffers: 1600, topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Honeywell'] }
      ],
      reviews: [
        { reviewerName: 'Debabrata Das', graduationYear: 2024, course: 'B.Tech CSE', overallRating: 4.7, infrastructureRating: 4.6, facultyRating: 4.6, placementRating: 4.8, hostelRating: 4.2, reviewText: '2100-acre self-sufficient township campus with unmatched alumni heritage (KGPians).', pros: 'Huge campus, Spring Fest, strong alumni network', cons: 'Travel from Kolkata required', helpful: 16 }
      ],
      cutoffs: [
        { exam: Exam.JEE_ADVANCED, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 150, closeRank: 290 }
      ]
    },

    // 5. IIT Kanpur
    {
      slug: 'iit-kanpur',
      name: 'Indian Institute of Technology Kanpur',
      shortName: 'IIT Kanpur',
      description: 'Pioneered computer science education in India in 1963, celebrated for academic freedom and leading research in aerospace and cybersecurity.',
      city: 'Kanpur',
      state: 'Uttar Pradesh',
      type: CollegeType.GOVERNMENT,
      nirfRank: 4,
      naacGrade: 'A++',
      establishedYear: 1959,
      campusAreaAcres: 1055,
      studentFacultyRatio: '1:10',
      overallRating: 4.8,
      ratingCount: 135,
      streams: [Stream.ENGINEERING, Stream.SCIENCE],
      exams: [Exam.JEE_ADVANCED, Exam.GATE],
      courses: [
        { name: 'B.Tech in Computer Science and Engineering', shortName: 'B.Tech CSE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 840000, annualFees: 210000, seats: 105, eligibility: '10+2 with 75% in PCM + JEE Advanced' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 190, averagePackageLpa: 24.0, medianPackageLpa: 20.0, placementPercent: 93.0, totalOffers: 1150, topRecruiters: ['Google', 'Microsoft', 'Goldman Sachs', 'Airbus'] }
      ],
      reviews: [
        { reviewerName: 'Nikhil Agarwal', graduationYear: 2024, course: 'B.Tech CSE', overallRating: 4.8, infrastructureRating: 4.8, facultyRating: 4.9, placementRating: 4.9, hostelRating: 4.5, reviewText: 'Open campus with 24/7 computer center and airstrip on campus.', pros: 'No attendance policy, high academic rigor', cons: 'Intense grading curve', helpful: 19 }
      ],
      cutoffs: [
        { exam: Exam.JEE_ADVANCED, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 95, closeRank: 230 }
      ]
    },

    // 6. NIT Trichy
    {
      slug: 'nit-trichy',
      name: 'National Institute of Technology Tiruchirappalli',
      shortName: 'NIT Trichy',
      description: 'National Institute of Technology Trichy is ranked #1 among all NITs in India, offering stellar undergraduate engineering programs.',
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      type: CollegeType.GOVERNMENT,
      nirfRank: 9,
      naacGrade: 'A++',
      establishedYear: 1964,
      campusAreaAcres: 800,
      studentFacultyRatio: '1:12',
      overallRating: 4.6,
      ratingCount: 110,
      streams: [Stream.ENGINEERING, Stream.ARCHITECTURE],
      exams: [Exam.JEE_MAIN, Exam.GATE],
      courses: [
        { name: 'B.Tech in Computer Science and Engineering', shortName: 'B.Tech CSE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 580000, annualFees: 145000, seats: 119, eligibility: '10+2 with 75% in PCM + JEE Main' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 52.8, averagePackageLpa: 17.5, medianPackageLpa: 15.0, placementPercent: 92.0, totalOffers: 1100, topRecruiters: ['Microsoft', 'Amazon', 'Texas Instruments', 'Oracle'] }
      ],
      reviews: [
        { reviewerName: 'Karthik Raja', graduationYear: 2024, course: 'B.Tech CSE', overallRating: 4.6, infrastructureRating: 4.4, facultyRating: 4.5, placementRating: 4.8, hostelRating: 4.0, reviewText: 'Consistently the highest performing NIT with unmatched placement records.', pros: 'Top placements, affordable fee structure', cons: 'Summer weather is hot', helpful: 15 }
      ],
      cutoffs: [
        { exam: Exam.JEE_MAIN, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 1200, closeRank: 4800 },
        { exam: Exam.JEE_MAIN, year: 2024, category: Category.OBC, gender: Gender.NEUTRAL, openRank: 1500, closeRank: 6500 }
      ]
    },

    // 7. NIT Surathkal
    {
      slug: 'nit-surathkal',
      name: 'National Institute of Technology Karnataka, Surathkal',
      shortName: 'NIT Surathkal',
      description: 'Located along the Arabian Sea coast in Karnataka, NIT Surathkal possesses its own private beach and premier engineering faculties.',
      city: 'Mangalore',
      state: 'Karnataka',
      type: CollegeType.GOVERNMENT,
      nirfRank: 12,
      naacGrade: 'A++',
      establishedYear: 1960,
      campusAreaAcres: 295,
      studentFacultyRatio: '1:12',
      overallRating: 4.6,
      ratingCount: 105,
      streams: [Stream.ENGINEERING, Stream.SCIENCE],
      exams: [Exam.JEE_MAIN, Exam.GATE],
      courses: [
        { name: 'B.Tech in Information Technology', shortName: 'B.Tech IT', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 560000, annualFees: 140000, seats: 115, eligibility: '10+2 with 75% in PCM + JEE Main' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 54.0, averagePackageLpa: 18.2, medianPackageLpa: 15.5, placementPercent: 93.0, totalOffers: 1050, topRecruiters: ['Microsoft', 'Google', 'Uber', 'Nvidia'] }
      ],
      reviews: [
        { reviewerName: 'Aditya Shenoy', graduationYear: 2024, course: 'B.Tech IT', overallRating: 4.7, infrastructureRating: 4.7, facultyRating: 4.5, placementRating: 4.8, hostelRating: 4.2, reviewText: 'Beachside campus with vibrant tech clubs and exceptional software placements.', pros: 'Private beach on campus, top MNC placements', cons: 'Monsoon humidity', helpful: 14 }
      ],
      cutoffs: [
        { exam: Exam.JEE_MAIN, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 1800, closeRank: 5900 }
      ]
    },

    // 8. BITS Pilani
    {
      slug: 'bits-pilani',
      name: 'Birla Institute of Technology and Science, Pilani',
      shortName: 'BITS Pilani',
      description: 'An Institute of Eminence renowned for its zero attendance policy, stellar alumni startup ecosystem, and dual degree opportunities.',
      city: 'Pilani',
      state: 'Rajasthan',
      type: CollegeType.DEEMED,
      nirfRank: 20,
      naacGrade: 'A',
      establishedYear: 1964,
      campusAreaAcres: 328,
      studentFacultyRatio: '1:14',
      overallRating: 4.7,
      ratingCount: 165,
      streams: [Stream.ENGINEERING, Stream.PHARMACY, Stream.SCIENCE],
      exams: [Exam.BITSAT],
      courses: [
        { name: 'B.E. Computer Science', shortName: 'B.E. CS', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 2380000, annualFees: 595000, seats: 140, eligibility: '10+2 with 75% in PCM + BITSAT' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 60.5, averagePackageLpa: 21.0, medianPackageLpa: 18.0, placementPercent: 93.0, totalOffers: 1200, topRecruiters: ['Google', 'Microsoft', 'Nutanix', 'DE Shaw'] }
      ],
      reviews: [
        { reviewerName: 'Siddharth Rao', graduationYear: 2024, course: 'B.E. CS', overallRating: 4.8, infrastructureRating: 4.6, facultyRating: 4.7, placementRating: 4.9, hostelRating: 4.4, reviewText: '0% attendance rule allows freedom to build startups and software.', pros: 'Practice School internships, startup alumni', cons: 'High tuition fees', helpful: 28 }
      ],
      cutoffs: [
        { exam: Exam.BITSAT, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 1, closeRank: 331 }
      ]
    },

    // 9. AIIMS New Delhi
    {
      slug: 'aiims-delhi',
      name: 'All India Institute of Medical Sciences, New Delhi',
      shortName: 'AIIMS New Delhi',
      description: 'India’s apex public medical institution and hospital, consistently ranked #1 in Medical by NIRF with nominal subsidized fees.',
      city: 'New Delhi',
      state: 'Delhi',
      type: CollegeType.CENTRAL,
      nirfRank: 1,
      establishedYear: 1956,
      campusAreaAcres: 115,
      studentFacultyRatio: '1:4',
      overallRating: 4.9,
      ratingCount: 95,
      streams: [Stream.MEDICAL],
      exams: [Exam.NEET],
      courses: [
        { name: 'Bachelor of Medicine and Bachelor of Surgery', shortName: 'MBBS', level: CourseLevel.UG, stream: Stream.MEDICAL, duration: 5, totalFees: 6850, annualFees: 1370, seats: 125, eligibility: '10+2 with 60% in PCB + NEET UG Top Rank' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 30.0, averagePackageLpa: 18.0, medianPackageLpa: 16.0, placementPercent: 100, totalOffers: 125, topRecruiters: ['Apollo Hospitals', 'Fortis Healthcare', 'Mayo Clinic'] }
      ],
      reviews: [
        { reviewerName: 'Dr. Ananya Sen', graduationYear: 2023, course: 'MBBS', overallRating: 5.0, infrastructureRating: 5.0, facultyRating: 5.0, placementRating: 5.0, hostelRating: 4.3, reviewText: 'Pinnacle of medical research and clinical exposure with free education.', pros: 'Nominal fees, unparalleled patient exposure', cons: 'Intense residency hours', helpful: 40 }
      ],
      cutoffs: [
        { exam: Exam.NEET, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 1, closeRank: 57 },
        { exam: Exam.NEET, year: 2024, category: Category.OBC, gender: Gender.NEUTRAL, openRank: 58, closeRank: 235 },
        { exam: Exam.NEET, year: 2024, category: Category.SC, gender: Gender.NEUTRAL, openRank: 150, closeRank: 950 }
      ]
    },

    // 10. CMC Vellore
    {
      slug: 'cmc-vellore',
      name: 'Christian Medical College Vellore',
      shortName: 'CMC Vellore',
      description: 'One of India’s most prestigious autonomous medical colleges and hospitals, renowned for clinical compassion and healthcare research.',
      city: 'Vellore',
      state: 'Tamil Nadu',
      type: CollegeType.PRIVATE,
      nirfRank: 3,
      naacGrade: 'A++',
      establishedYear: 1900,
      campusAreaAcres: 200,
      studentFacultyRatio: '1:3',
      overallRating: 4.8,
      ratingCount: 88,
      streams: [Stream.MEDICAL],
      exams: [Exam.NEET],
      courses: [
        { name: 'Bachelor of Medicine & Surgery', shortName: 'MBBS', level: CourseLevel.UG, stream: Stream.MEDICAL, duration: 5, totalFees: 165000, annualFees: 33000, seats: 100, eligibility: '10+2 with 60% in PCB + NEET' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 24.0, averagePackageLpa: 15.5, medianPackageLpa: 14.0, placementPercent: 100, totalOffers: 100, topRecruiters: ['CMC Hospital', 'Manipal Health', 'Max Healthcare'] }
      ],
      reviews: [
        { reviewerName: 'Dr. Joseph Thomas', graduationYear: 2023, course: 'MBBS', overallRating: 4.8, infrastructureRating: 4.9, facultyRating: 5.0, placementRating: 4.8, hostelRating: 4.4, reviewText: 'Ethical medical pedagogy and exceptional clinical mentorship.', pros: 'Compassionate care ethos, deep clinical training', cons: 'Service bond requirement', helpful: 18 }
      ],
      cutoffs: [
        { exam: Exam.NEET, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 80, closeRank: 280 }
      ]
    },

    // 11. IIM Ahmedabad
    {
      slug: 'iim-ahmedabad',
      name: 'Indian Institute of Management Ahmedabad',
      shortName: 'IIM Ahmedabad',
      description: 'The premier business school in India, globally recognized for its case-method pedagogy and influential management alumni.',
      city: 'Ahmedabad',
      state: 'Gujarat',
      type: CollegeType.CENTRAL,
      nirfRank: 1,
      establishedYear: 1961,
      campusAreaAcres: 102,
      studentFacultyRatio: '1:6',
      overallRating: 4.9,
      ratingCount: 130,
      streams: [Stream.MANAGEMENT],
      exams: [Exam.CAT],
      courses: [
        { name: 'Post Graduate Programme in Management', shortName: 'PGP (MBA)', level: CourseLevel.PG, stream: Stream.MANAGEMENT, duration: 2, totalFees: 2500000, annualFees: 1250000, seats: 395, eligibility: 'Graduation with 50% + CAT 99.5+ Percentile' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 115, averagePackageLpa: 34.5, medianPackageLpa: 31.5, placementPercent: 100, totalOffers: 420, topRecruiters: ['McKinsey & Co', 'BCG', 'Bain & Co', 'Goldman Sachs'] }
      ],
      reviews: [
        { reviewerName: 'Vikram Joshi', graduationYear: 2024, course: 'PGP (MBA)', overallRating: 5.0, infrastructureRating: 4.8, facultyRating: 5.0, placementRating: 5.0, hostelRating: 4.7, reviewText: 'Transformational 2 years with rigorous case discussions and top consulting placement.', pros: 'Louis Kahn campus heritage, elite network', cons: 'High-pressure academic curve', helpful: 22 }
      ],
      cutoffs: [
        { exam: Exam.CAT, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, percentile: 99.6 },
        { exam: Exam.CAT, year: 2024, category: Category.OBC, gender: Gender.NEUTRAL, percentile: 96.5 }
      ]
    },

    // 12. IIM Bangalore
    {
      slug: 'iim-bangalore',
      name: 'Indian Institute of Management Bangalore',
      shortName: 'IIM Bangalore',
      description: 'Nestled in India’s Silicon Valley, IIMB is renowned for its stone architecture campus, public policy centre, and technology consulting leadership.',
      city: 'Bengaluru',
      state: 'Karnataka',
      type: CollegeType.CENTRAL,
      nirfRank: 2,
      establishedYear: 1973,
      campusAreaAcres: 100,
      studentFacultyRatio: '1:7',
      overallRating: 4.9,
      ratingCount: 120,
      streams: [Stream.MANAGEMENT],
      exams: [Exam.CAT],
      courses: [
        { name: 'Post Graduate Programme in Management', shortName: 'PGP (MBA)', level: CourseLevel.PG, stream: Stream.MANAGEMENT, duration: 2, totalFees: 2450000, annualFees: 1225000, seats: 480, eligibility: 'Graduation + CAT 99.4+ Percentile' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 98, averagePackageLpa: 33.8, medianPackageLpa: 31.0, placementPercent: 100, totalOffers: 510, topRecruiters: ['Bain & Co', 'BCG', 'McKinsey', 'Amazon', 'Microsoft'] }
      ],
      reviews: [
        { reviewerName: 'Shreya Venkatesh', graduationYear: 2024, course: 'PGP (MBA)', overallRating: 4.9, infrastructureRating: 5.0, facultyRating: 4.9, placementRating: 5.0, hostelRating: 4.8, reviewText: 'Stunning stone campus by BV Doshi with unmatched access to tech startups in Bengaluru.', pros: 'Location advantage, consulting & product roles', cons: 'Fast-paced trimesters', helpful: 17 }
      ],
      cutoffs: [
        { exam: Exam.CAT, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, percentile: 99.4 }
      ]
    },

    // 13. NLU Delhi
    {
      slug: 'nlu-delhi',
      name: 'National Law University, Delhi',
      shortName: 'NLU Delhi',
      description: 'One of the premier national law universities in India offering holistic legal education in the national capital.',
      city: 'New Delhi',
      state: 'Delhi',
      type: CollegeType.GOVERNMENT,
      nirfRank: 2,
      establishedYear: 2008,
      campusAreaAcres: 12,
      studentFacultyRatio: '1:10',
      overallRating: 4.7,
      ratingCount: 75,
      streams: [Stream.LAW],
      exams: [Exam.CLAT],
      courses: [
        { name: 'B.A. LL.B. (Hons.)', shortName: 'BA LLB', level: CourseLevel.UG, stream: Stream.LAW, duration: 5, totalFees: 950000, annualFees: 190000, seats: 120, eligibility: '10+2 with 45% + AILET / CLAT' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 22.0, averagePackageLpa: 16.0, medianPackageLpa: 14.5, placementPercent: 90, totalOffers: 100, topRecruiters: ['Shardul Amarchand Mangaldas', 'Trilegal', 'Khaitan & Co', 'AZB & Partners'] }
      ],
      reviews: [
        { reviewerName: 'Tanya Sengupta', graduationYear: 2024, course: 'BA LLB', overallRating: 4.7, infrastructureRating: 4.6, facultyRating: 4.8, placementRating: 4.8, hostelRating: 4.2, reviewText: 'Outstanding moot court culture and high placement in Tier-1 corporate law firms.', pros: 'Proximity to Supreme Court, top firm hires', cons: 'Compact campus size', helpful: 14 }
      ],
      cutoffs: [
        { exam: Exam.CLAT, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 1, closeRank: 85 },
        { exam: Exam.CLAT, year: 2024, category: Category.OBC, gender: Gender.NEUTRAL, openRank: 86, closeRank: 350 }
      ]
    },

    // 14. NLSIU Bangalore
    {
      slug: 'nlsiu-bangalore',
      name: 'National Law School of India University',
      shortName: 'NLSIU Bangalore',
      description: 'The pioneering institution of National Law Universities in India, consistently ranked #1 in Law by NIRF since ranking inception.',
      city: 'Bengaluru',
      state: 'Karnataka',
      type: CollegeType.GOVERNMENT,
      nirfRank: 1,
      establishedYear: 1987,
      campusAreaAcres: 23,
      studentFacultyRatio: '1:9',
      overallRating: 4.9,
      ratingCount: 82,
      streams: [Stream.LAW],
      exams: [Exam.CLAT],
      courses: [
        { name: 'B.A. LL.B. (Hons.)', shortName: 'BA LLB', level: CourseLevel.UG, stream: Stream.LAW, duration: 5, totalFees: 1350000, annualFees: 270000, seats: 240, eligibility: '10+2 + CLAT' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 24.5, averagePackageLpa: 17.5, medianPackageLpa: 16.0, placementPercent: 96, totalOffers: 150, topRecruiters: ['Linklaters', 'Herbert Smith Freehills', 'Cyril Amarchand', 'Trilegal'] }
      ],
      reviews: [
        { reviewerName: 'Pranav Menon', graduationYear: 2024, course: 'BA LLB', overallRating: 4.9, infrastructureRating: 4.7, facultyRating: 5.0, placementRating: 5.0, hostelRating: 4.4, reviewText: 'The undisputed gold standard of legal education in South Asia.', pros: 'International law firm placements, stellar moot court pedigree', cons: 'Demanding trimester timetable', helpful: 21 }
      ],
      cutoffs: [
        { exam: Exam.CLAT, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 1, closeRank: 110 }
      ]
    },

    // 15. VIT Vellore
    {
      slug: 'vit-vellore',
      name: 'Vellore Institute of Technology',
      shortName: 'VIT Vellore',
      description: 'VIT Vellore is a premier private deemed research university offering extensive engineering and technology programs.',
      city: 'Vellore',
      state: 'Tamil Nadu',
      type: CollegeType.DEEMED,
      nirfRank: 11,
      naacGrade: 'A++',
      establishedYear: 1984,
      campusAreaAcres: 372,
      studentFacultyRatio: '1:16',
      overallRating: 4.4,
      ratingCount: 220,
      streams: [Stream.ENGINEERING, Stream.SCIENCE, Stream.MANAGEMENT],
      exams: [Exam.VITEEE, Exam.JEE_MAIN],
      courses: [
        { name: 'B.Tech in Computer Science and Engineering', shortName: 'B.Tech CSE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 780000, annualFees: 195000, seats: 900, eligibility: '10+2 with 60% in PCM + VITEEE' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 102, averagePackageLpa: 9.5, medianPackageLpa: 8.0, placementPercent: 88.0, totalOffers: 7500, topRecruiters: ['Microsoft', 'Amazon', 'PayPal', 'Cisco', 'Cognizant'] }
      ],
      reviews: [
        { reviewerName: 'Varun Nair', graduationYear: 2024, course: 'B.Tech CSE', overallRating: 4.4, infrastructureRating: 4.8, facultyRating: 4.2, placementRating: 4.5, hostelRating: 4.3, reviewText: 'Modern infrastructure with Fully Flexible Credit System (FFCS).', pros: 'Huge volume of Super Dream offers, modern campus', cons: 'Large batch size', helpful: 19 }
      ],
      cutoffs: [
        { exam: Exam.JEE_MAIN, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 8000, closeRank: 28000 },
        { exam: Exam.VITEEE, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 1, closeRank: 9500 }
      ]
    },

    // 16. Manipal Institute of Technology
    {
      slug: 'manipal-mit',
      name: 'Manipal Institute of Technology, MAHE',
      shortName: 'MIT Manipal',
      description: 'MIT Manipal is a leading private engineering institute boasting notable global tech alumni such as Satya Nadella (CEO, Microsoft).',
      city: 'Manipal',
      state: 'Karnataka',
      type: CollegeType.DEEMED,
      nirfRank: 61,
      naacGrade: 'A++',
      establishedYear: 1957,
      campusAreaAcres: 313,
      studentFacultyRatio: '1:14',
      overallRating: 4.5,
      ratingCount: 140,
      streams: [Stream.ENGINEERING, Stream.SCIENCE],
      exams: [Exam.STATE_CET, Exam.JEE_MAIN],
      courses: [
        { name: 'B.Tech in Computer and Communication Engineering', shortName: 'B.Tech CCE', level: CourseLevel.UG, stream: Stream.ENGINEERING, duration: 4, totalFees: 1780000, annualFees: 445000, seats: 240, eligibility: '10+2 with 50% in PCM + MET' }
      ],
      placements: [
        { year: 2024, highestPackageLpa: 54.7, averagePackageLpa: 12.5, medianPackageLpa: 10.0, placementPercent: 91.0, totalOffers: 1800, topRecruiters: ['Microsoft', 'Cisco', 'Deloitte', 'Amazon', 'Intel'] }
      ],
      reviews: [
        { reviewerName: 'Gaurav Pai', graduationYear: 2024, course: 'B.Tech CCE', overallRating: 4.6, infrastructureRating: 4.8, facultyRating: 4.4, placementRating: 4.6, hostelRating: 4.5, reviewText: 'Incredible university town environment in coastal Karnataka with high student autonomy.', pros: 'Campus amenities, alumni network, student projects', cons: 'Fee is on the higher side', helpful: 17 }
      ],
      cutoffs: [
        { exam: Exam.JEE_MAIN, year: 2024, category: Category.GENERAL, gender: Gender.NEUTRAL, openRank: 5000, closeRank: 22000 }
      ]
    }
  ];

  for (const cData of collegesData) {
    const { streams, exams, courses, placements, reviews, cutoffs, ...collegeFields } = cData;

    const createdCollege = await prisma.college.create({
      data: {
        ...collegeFields,
        streams: {
          create: streams.map((s) => ({ stream: s }))
        },
        exams: {
          create: exams.map((e) => ({ exam: e }))
        },
        courses: {
          create: courses
        },
        placements: {
          create: placements
        },
        reviews: {
          create: reviews
        }
      }
    });

    if (cutoffs && cutoffs.length > 0) {
      for (const cutoff of cutoffs) {
        await prisma.collegeCutoff.create({
          data: {
            ...cutoff,
            collegeId: createdCollege.id
          }
        });
      }
    }
  }

  console.log('✅ Phase 2 Seed Completed! Total colleges seeded with full relations:', collegesData.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
