import type { Incident, Vehicle, User, Notification } from '@/store/useAppStore'

// SA Medical Aids
export const MEDICAL_AIDS = [
  'Discovery Health',
  'Bonitas',
  'Momentum Health',
  'GEMS',
  'Medihelp',
  'Bestmed',
  'Fedhealth',
  'KeyHealth',
  'Profmed',
  'Sizwe',
  'Hosmed',
  'CompCare',
  'LA Health',
  'Medshield',
  'Polmed',
  'Resolution Health',
  'Selfmed',
  'Spectramed',
  'TotalCare',
  'Transmed',
]

// SA Insurers
export const INSURERS = [
  'Old Mutual',
  'Sanlam',
  'Discovery Insure',
  'Outsurance',
  'Hollard',
  'Santam',
  'Momentum Insure',
  'Budget Insurance',
  '1st for Women',
  'Auto & General',
  'Dial Direct',
  'MiWay',
  'Pineapple',
  'King Price',
  'Clientele',
]

// Blood Types
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// Languages
export const LANGUAGES = [
  'English',
  'Afrikaans',
  'Zulu',
  'Xhosa',
  'Sotho',
  'Tswana',
  'Pedi',
  'Venda',
  'Tsonga',
  'Swati',
  'Ndebele',
]

// Medical Conditions
export const MEDICAL_CONDITIONS = [
  'Diabetic',
  'Hypertensive',
  'Epileptic',
  'Asthmatic',
  'Heart Condition',
  'Other',
]

// Certifications
export const CERTIFICATIONS = ['BLS', 'ALS', 'Paramedic', 'EMT', 'First Responder']

// Departments
export const DEPARTMENTS = [
  'EMS/Ambulance',
  'Police/Metro',
  'Fire & Rescue',
  'Disaster Management',
] as const

// Tembisa / Ekurhuleni area coordinates
export const MAP_CENTER = { lat: -26.0067, lng: 28.2260 }

// Dummy Vehicles
export const DUMMY_VEHICLES: Vehicle[] = [
  { id: 'v1', plate: 'GP 123 EMS', make: 'Toyota Quantum', type: 'ambulance', status: 'available', inspectionComplete: true, lastInspection: '2024-01-15' },
  { id: 'v2', plate: 'GP 456 EMS', make: 'Mercedes Sprinter', type: 'ambulance', status: 'dispatched', assignedTo: 'Thabo Mokoena', inspectionComplete: true, lastInspection: '2024-01-15' },
  { id: 'v3', plate: 'GP 789 EMS', make: 'Toyota Quantum', type: 'ambulance', status: 'returning', assignedTo: 'Sipho Ndlovu', inspectionComplete: true, lastInspection: '2024-01-14' },
  { id: 'v4', plate: 'JHB METRO 01', make: 'BMW X5', type: 'police', status: 'available', inspectionComplete: true, lastInspection: '2024-01-15' },
  { id: 'v5', plate: 'JHB METRO 02', make: 'VW Amarok', type: 'police', status: 'dispatched', assignedTo: 'Constable Khumalo', inspectionComplete: true, lastInspection: '2024-01-15' },
  { id: 'v6', plate: 'JHB METRO 03', make: 'Ford Ranger', type: 'police', status: 'available', inspectionComplete: false, lastInspection: '2024-01-10' },
  { id: 'v7', plate: 'EKU FIRE 01', make: 'MAN TGM', type: 'fire', status: 'available', inspectionComplete: true, lastInspection: '2024-01-15' },
  { id: 'v8', plate: 'EKU FIRE 02', make: 'Scania P360', type: 'fire', status: 'dispatched', assignedTo: 'Captain Dlamini', inspectionComplete: true, lastInspection: '2024-01-15' },
  { id: 'v9', plate: 'GP 101 EMS', make: 'Toyota Hilux', type: 'ambulance', status: 'available', inspectionComplete: true, lastInspection: '2024-01-14' },
  { id: 'v10', plate: 'GP 202 EMS', make: 'Isuzu KB', type: 'ambulance', status: 'available', inspectionComplete: true, lastInspection: '2024-01-13' },
  { id: 'v11', plate: 'JHB METRO 04', make: 'Toyota Corolla', type: 'police', status: 'returning', assignedTo: 'Sergeant Botha', inspectionComplete: true, lastInspection: '2024-01-15' },
  { id: 'v12', plate: 'EKU FIRE 03', make: 'Iveco Eurocargo', type: 'fire', status: 'available', inspectionComplete: true, lastInspection: '2024-01-15' },
]

// Dummy Responders (full User shape for authentication)
export const DUMMY_RESPONDERS: User[] = [
  { 
    id: 'r1', 
    name: 'Thabo', 
    surname: 'Mokoena', 
    dateOfBirth: '1988-03-12',
    gender: 'male',
    language: 'Sotho',
    bloodType: 'A+',
    weight: 80,
    height: 178,
    medicalConditions: [],
    medications: '',
    medicalAid: 'GEMS',
    medicalAidNumber: 'GEMS987654',
    insurer: 'Old Mutual',
    preferredGP: 'Dr. Van der Berg',
    emergencyContacts: [{ name: 'Nomsa Mokoena', relationship: 'Wife', phone: '0821234567' }],
    employeeId: 'EMS001', 
    department: 'EMS/Ambulance', 
    rank: 'Paramedic', 
    certifications: ['ALS', 'BLS'] 
  },
  { 
    id: 'r2', 
    name: 'Sipho', 
    surname: 'Ndlovu', 
    dateOfBirth: '1995-07-22',
    gender: 'male',
    language: 'Zulu',
    bloodType: 'B+',
    weight: 75,
    height: 175,
    medicalConditions: [],
    medications: '',
    medicalAid: 'Bonitas',
    medicalAidNumber: 'BON123456',
    insurer: 'Sanlam',
    preferredGP: 'Dr. Khumalo',
    emergencyContacts: [{ name: 'Lindiwe Ndlovu', relationship: 'Sister', phone: '0832345678' }],
    employeeId: 'EMS002', 
    department: 'EMS/Ambulance', 
    rank: 'EMT', 
    certifications: ['EMT', 'BLS'] 
  },
  { 
    id: 'r3', 
    name: 'Nomsa', 
    surname: 'Khumalo', 
    dateOfBirth: '1990-11-05',
    gender: 'female',
    language: 'Zulu',
    bloodType: 'O-',
    weight: 62,
    height: 163,
    medicalConditions: [],
    medications: '',
    medicalAid: 'Polmed',
    medicalAidNumber: 'POL789012',
    insurer: 'Santam',
    preferredGP: 'Dr. Botha',
    emergencyContacts: [{ name: 'James Khumalo', relationship: 'Father', phone: '0843456789' }],
    employeeId: 'POL001', 
    department: 'Police/Metro', 
    rank: 'Constable', 
    certifications: ['First Responder'] 
  },
  { 
    id: 'r4', 
    name: 'Pieter', 
    surname: 'Botha', 
    dateOfBirth: '1985-01-30',
    gender: 'male',
    language: 'Afrikaans',
    bloodType: 'AB+',
    weight: 85,
    height: 182,
    medicalConditions: [],
    medications: '',
    medicalAid: 'Polmed',
    medicalAidNumber: 'POL345678',
    insurer: 'Outsurance',
    preferredGP: 'Dr. Smith',
    emergencyContacts: [{ name: 'Anna Botha', relationship: 'Wife', phone: '0854567890' }],
    employeeId: 'POL002', 
    department: 'Police/Metro', 
    rank: 'Sergeant', 
    certifications: ['First Responder', 'BLS'] 
  },
  { 
    id: 'r5', 
    name: 'Lindiwe', 
    surname: 'Dlamini', 
    dateOfBirth: '1982-09-18',
    gender: 'female',
    language: 'Swati',
    bloodType: 'A-',
    weight: 68,
    height: 170,
    medicalConditions: [],
    medications: '',
    medicalAid: 'Medihelp',
    medicalAidNumber: 'MH567890',
    insurer: 'Hollard',
    preferredGP: 'Dr. Moloi',
    emergencyContacts: [{ name: 'David Dlamini', relationship: 'Husband', phone: '0865678901' }],
    employeeId: 'FIRE001', 
    department: 'Fire & Rescue', 
    rank: 'Captain', 
    certifications: ['BLS', 'First Responder'] 
  },
]

export const DUMMY_PATIENT: User = {
  id: 'patient1',
  name: 'Lerato',
  surname: 'Mabena',
  dateOfBirth: '1990-03-18',
  gender: 'Female',
  language: 'English',
  bloodType: 'O+',
  weight: 68,
  height: 164,
  medicalConditions: ['Asthmatic'],
  medications: 'Salbutamol inhaler',
  medicalAid: 'Discovery Health',
  medicalAidNumber: 'DH123456',
  insurer: 'Discovery Insure',
  preferredGP: 'Dr. Ndlovu',
  emergencyContacts: [
    { name: 'Sipho Mabena', relationship: 'Brother', phone: '+27123456789' },
  ],
}

// Dummy Dispatchers
export const DUMMY_DISPATCHERS = [
  { id: 'd1', name: 'Sarah van der Merwe', area: 'Tembisa Central', status: 'active' as const },
  { id: 'd2', name: 'James Moloi', area: 'Kempton Park', status: 'active' as const },
  { id: 'd3', name: 'Fatima Patel', area: 'Boksburg', status: 'on-break' as const },
]

// Dummy Active Incidents
export const DUMMY_INCIDENTS: Incident[] = [
  {
    id: 'inc1',
    type: 'medical',
    incidentType: 'Chest Pain',
    severity: 'critical',
    description: 'Male, 55, experiencing severe chest pain and shortness of breath',
    patientId: 'p1',
    patientName: 'Johannes Sithole',
    patientAge: 55,
    patientBloodType: 'O+',
    patientConditions: ['Hypertensive', 'Diabetic'],
    patientLanguage: 'Zulu',
    location: { lat: -26.0089, lng: 28.2285, address: '45 Makhura Street, Tembisa' },
    timestamp: new Date(Date.now() - 5 * 60000),
    status: 'dispatched',
    assignedVehicle: 'GP 456 EMS',
    assignedResponder: 'Thabo Mokoena',
  },
  {
    id: 'inc2',
    type: 'police',
    incidentType: 'Robbery in Progress',
    severity: 'critical',
    description: 'Armed robbery at local spaza shop, suspects still on scene',
    patientId: 'p2',
    patientName: 'Shop Owner',
    location: { lat: -26.0120, lng: 28.2190, address: '12 Olifantsfontein Road, Tembisa' },
    timestamp: new Date(Date.now() - 3 * 60000),
    status: 'dispatched',
    assignedVehicle: 'JHB METRO 02',
    assignedResponder: 'Constable Khumalo',
  },
  {
    id: 'inc3',
    type: 'fire',
    incidentType: 'House Fire',
    severity: 'serious',
    description: 'Residential fire, smoke visible, occupants evacuated',
    patientId: 'p3',
    patientName: 'Community Report',
    location: { lat: -26.0045, lng: 28.2310, address: '78 Endulweni Section, Tembisa' },
    timestamp: new Date(Date.now() - 15 * 60000),
    status: 'dispatched',
    assignedVehicle: 'EKU FIRE 02',
    assignedResponder: 'Captain Dlamini',
  },
]

// Dummy News Articles
export const DUMMY_NEWS = [
  {
    id: 'n1',
    title: 'Tembisa Hospital receives new trauma unit equipment',
    category: 'Medical',
    source: 'Ekurhuleni Health Dept',
    timestamp: '2h ago',
    excerpt: 'State-of-the-art emergency equipment has been delivered to Tembisa Hospital as part of the provincial health department\'s ongoing infrastructure upgrade programme.',
    content: 'State-of-the-art emergency equipment has been delivered to Tembisa Hospital as part of the provincial health department\'s ongoing infrastructure upgrade programme. The new equipment includes advanced life support machines, modern defibrillators, and upgraded monitoring systems that will significantly improve patient care in the trauma unit. Hospital CEO Dr. Themba Mabaso expressed gratitude for the investment, noting that it will help save more lives in the community.',
  },
  {
    id: 'n2',
    title: 'Joburg Metro Police crack down on illegal firearms in Soweto',
    category: 'Police',
    source: 'JMPD Communications',
    timestamp: '4h ago',
    excerpt: 'A successful operation by Johannesburg Metro Police has resulted in the seizure of over 50 illegal firearms in Soweto over the past week.',
    content: 'A successful operation by Johannesburg Metro Police has resulted in the seizure of over 50 illegal firearms in Soweto over the past week. The operation, dubbed "Operation Firearm Free," targeted known hotspots for illegal weapon trade. JMPD spokesperson Wayne Minnaar confirmed that several arrests have been made and investigations are ongoing.',
  },
  {
    id: 'n3',
    title: 'Fire destroys 3 homes in Diepsloot, no casualties reported',
    category: 'Fire',
    source: 'City of Johannesburg',
    timestamp: '6h ago',
    excerpt: 'Emergency services responded swiftly to a fire that broke out in the early hours of this morning, destroying three informal homes.',
    content: 'Emergency services responded swiftly to a fire that broke out in the early hours of this morning, destroying three informal homes in Diepsloot. Thanks to the quick response of neighbours and Johannesburg Emergency Services, all residents were evacuated safely. The cause of the fire is under investigation, with initial reports suggesting an electrical fault.',
  },
  {
    id: 'n4',
    title: 'EMS responds to 47 road accidents over Easter weekend',
    category: 'Medical',
    source: 'Gauteng Health',
    timestamp: '1d ago',
    excerpt: 'Gauteng Emergency Medical Services attended to 47 road traffic accidents over the long Easter weekend, with 12 fatalities recorded.',
    content: 'Gauteng Emergency Medical Services attended to 47 road traffic accidents over the long Easter weekend, with 12 fatalities recorded. The majority of accidents occurred on the N1 and N12 highways. EMS spokesperson urged motorists to exercise caution and avoid driving under the influence of alcohol.',
  },
  {
    id: 'n5',
    title: 'New SAPS rapid response unit deployed in Alexandra',
    category: 'Police',
    source: 'SAPS Gauteng',
    timestamp: '1d ago',
    excerpt: 'The South African Police Service has deployed a new rapid response unit in Alexandra to combat rising crime in the township.',
    content: 'The South African Police Service has deployed a new rapid response unit in Alexandra to combat rising crime in the township. The unit, consisting of 50 specially trained officers, will focus on reducing hijackings, robberies, and violent crimes. Community leaders have welcomed the initiative.',
  },
  {
    id: 'n6',
    title: 'Community volunteers join Veld Fire awareness campaign',
    category: 'Community',
    source: 'Working on Fire',
    timestamp: '2d ago',
    excerpt: 'Over 200 community volunteers participated in a veld fire awareness campaign ahead of the dry winter season.',
    content: 'Over 200 community volunteers participated in a veld fire awareness campaign ahead of the dry winter season. The campaign, organised by Working on Fire in partnership with local municipalities, educated residents on fire prevention and emergency response procedures.',
  },
  {
    id: 'n7',
    title: 'Ambulance response times improve after new fleet deployment',
    category: 'Medical',
    source: 'Gauteng EMS',
    timestamp: '3d ago',
    excerpt: 'Average ambulance response times in Gauteng have improved by 15% following the deployment of 30 new emergency vehicles.',
    content: 'Average ambulance response times in Gauteng have improved by 15% following the deployment of 30 new emergency vehicles last month. The new ambulances are equipped with advanced life support equipment and GPS tracking systems. Gauteng Health MEC Dr. Nomantu Nkomo-Ralehoko commended the improvement.',
  },
  {
    id: 'n8',
    title: 'Ekurhuleni Fire Services complete mass casualty drill',
    category: 'Fire',
    source: 'Ekurhuleni Emergency Services',
    timestamp: '5d ago',
    excerpt: 'Ekurhuleni Fire and Emergency Services successfully completed a large-scale mass casualty incident drill at OR Tambo International Airport.',
    content: 'Ekurhuleni Fire and Emergency Services successfully completed a large-scale mass casualty incident drill at OR Tambo International Airport. The exercise tested the coordination between fire services, EMS, SAPS, and airport security in responding to a simulated aircraft emergency. Over 300 personnel participated in the drill.',
  },
]

// Dummy Notifications
export const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 'not1',
    type: 'critical',
    title: 'Critical Emergency',
    body: 'Chest pain emergency at 45 Makhura Street, Tembisa',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
  },
  {
    id: 'not2',
    type: 'inspection',
    title: 'Inspection Overdue',
    body: 'Vehicle JHB METRO 03 inspection incomplete',
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
  },
  {
    id: 'not3',
    type: 'resolved',
    title: 'Emergency Resolved',
    body: 'Road traffic incident at N1 offramp cleared',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: true,
  },
  {
    id: 'not4',
    type: 'system',
    title: 'Shift Reminder',
    body: 'Your shift ends in 30 minutes',
    timestamp: new Date(Date.now() - 3 * 3600000),
    read: true,
  },
]

// Hospitals near Tembisa
export const HOSPITALS = [
  { id: 'h1', name: 'Tembisa Hospital', lat: -26.0123, lng: 28.2267 },
  { id: 'h2', name: 'Arwyp Medical Centre', lat: -26.0345, lng: 28.2134 },
  { id: 'h3', name: 'Kempton Park Hospital', lat: -26.0789, lng: 28.2456 },
]

// Clinics near Tembisa
export const CLINICS = [
  { id: 'c1', name: 'Tembisa South Clinic', lat: -26.0167, lng: 28.2234 },
  { id: 'c2', name: 'Winnie Mandela Clinic', lat: -26.0034, lng: 28.2189 },
  { id: 'c3', name: 'Ethafeni Clinic', lat: -26.0098, lng: 28.2345 },
]

// Incident types by category
export const INCIDENT_TYPES = {
  police: [
    'Shots Fired',
    'Robbery in Progress',
    'Domestic Violence',
    'Assault',
    'Suspicious Person',
    'Accident / Road Traffic',
    'Vandalism',
    'Missing Person',
    'Other',
  ],
  medical: [
    'Unconscious / Not Breathing',
    'Chest Pain',
    'Fall / Injury',
    'Diabetic Emergency',
    'Stroke',
    'Choking',
    'Allergic Reaction',
    'Child Emergency',
    'Other',
  ],
  fire: [
    'House Fire',
    'Veld Fire',
    'Vehicle Fire',
    'Gas Leak',
    'Person Trapped',
    'Chemical Spill',
    'Building Collapse',
    'Other',
  ],
}

// Vehicle inspection checklist
export const INSPECTION_CHECKLIST = {
  exterior: ['Front', 'Rear', 'Driver side', 'Passenger side', 'Roof'],
  equipment: [
    'Oxygen cylinder',
    'Defibrillator',
    'First aid kit',
    'Stretcher',
    'Fire extinguisher',
    'PPE kit',
    'Suction unit',
    'Drug bag',
  ],
}
