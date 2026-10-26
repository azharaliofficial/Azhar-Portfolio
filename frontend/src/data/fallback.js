// Fallback content. The site shows this if the API is unreachable (for example
// while the free backend is waking up). Once the Laravel API is running, the
// same content comes from MySQL and is edited from the admin panel.
// Field names match the API responses exactly.

export const profile = {
  name: 'Azhar Ali',
  role: 'Developer',
  location: 'Skardu, Pakistan',
  headline: 'Turning ideas into products.',
  bio: 'I am Azhar Ali, a Computer Science student building backend-first web applications with Laravel, MySQL, Python and React.',
  github_url: 'https://github.com/azharaliofficial',
  linkedin_url: '',
  resume_url: '',
  photo_url: null,
  gallery: [],
}

export const academics = [
  { position: 'tl', kind: 'DIPLOMA · 2022', title: 'Computer Diploma', subtitle: "Challenger's Computer Skills" },
  { position: 'tr', kind: 'EDUCATION · 2024 - 2028', title: 'BSCS, Computer Science', subtitle: 'GCU Faisalabad' },
  { position: 'bl', kind: 'TRAINING · 2025', title: 'Full-Stack Web Development', subtitle: 'Tech Zone Institute' },
  { position: 'br', kind: 'CERTIFIED · 2026', title: 'AI and Data Analytics', subtitle: 'DigiSkills.pk, VitaNova' },
]

export const timeline = [
  { date_label: 'OCT 2022', title: 'Computer Diploma', description: "Challenger's Computer Skills Centre. Windows, MS Office, typing.", is_current: false },
  { date_label: 'SEP 2024', title: 'BSCS begins', description: 'Government College University Faisalabad, Computer Science.', is_current: false },
  { date_label: 'DEC 2024', title: 'Baltistan Student Council', description: 'First certificate for teamwork and active contribution.', is_current: false },
  { date_label: 'SEP 2025', title: 'Full-Stack Web Development', description: 'Tech Zone Institute. 3-month program plus a 1-month internship.', is_current: false },
  { date_label: 'DEC 2025', title: 'Team leadership', description: 'Baltistan Student Council GCUF recognises leadership contribution.', is_current: false },
  { date_label: 'APR 2026', title: 'Hands-on AI training', description: 'VitaNova International Alliance for Sciences (VNIAS).', is_current: false },
  { date_label: 'APR - JUL 2026', title: 'DigiSkills program', description: 'Data Analytics and BI, and AI using Python.', is_current: false },
  { date_label: 'NOW', title: 'CodeAlpha backend internship', description: 'Restaurant Management, Event Registration, URL Shortener.', is_current: true },
]

export const services = [
  { code: 'S-01', title: 'Laravel web apps and admin panels', description: 'Business systems like restaurant, event and shop management, with a clean admin to run them.', stack: 'Laravel · PHP · MySQL' },
  { code: 'S-02', title: 'REST APIs and backend', description: 'Secure, documented APIs with a well designed database behind them.', stack: 'Laravel · MySQL · Sanctum' },
  { code: 'S-03', title: 'Full-stack web (Laravel + React)', description: 'Responsive websites and dashboards, from the database to the screen.', stack: 'React · Tailwind · Laravel' },
  { code: 'S-04', title: 'Python automation and data', description: 'Scripts that save time, data dashboards and small AI features.', stack: 'Python · Analytics · AI basics' },
]

export const skills = [
  { name: 'Laravel', level: 70, group: 'Backend' },
  { name: 'PHP', level: 70, group: 'Backend' },
  { name: 'HTML, CSS and Tailwind', level: 70, group: 'Frontend' },
  { name: 'MySQL', level: 65, group: 'Database' },
  { name: 'Python', level: 65, group: 'Backend' },
  { name: 'JavaScript', level: 60, group: 'Frontend' },
  { name: 'C++ and OOP', level: 60, group: 'Core' },
  { name: 'React', level: 55, group: 'Frontend' },
  { name: 'Data Analytics and BI', level: 55, group: 'Data' },
  { name: 'AI and Machine Learning', level: 50, group: 'Data' },
]

export const projects = [
  { code: 'CASE 01', tag: 'CODEALPHA INTERNSHIP', slug: 'restaurant-management-system', title: 'Restaurant Management System', case_study: '', cover_url: null, gallery: [], problem: '[One line: what a restaurant needed to manage.]', built_with: '[Stack and database design.]', result: '[Demo video, tables and reservations.]', github_url: 'https://github.com/azharaliofficial', demo_url: '' },
  { code: 'CASE 02', tag: 'CODEALPHA INTERNSHIP', slug: 'event-registration', title: 'Event Registration', case_study: '', cover_url: null, gallery: [], problem: '[One line: how people sign up for events.]', built_with: '[Stack and database design.]', result: '[Screenshot or demo.]', github_url: 'https://github.com/azharaliofficial', demo_url: '' },
  { code: 'CASE 03', tag: 'CODEALPHA INTERNSHIP', slug: 'url-shortener', title: 'URL Shortener', case_study: '', cover_url: null, gallery: [], problem: '[One line: why short links.]', built_with: '[Stack and database design.]', result: '[Screenshot or demo.]', github_url: 'https://github.com/azharaliofficial', demo_url: '' },
  { code: 'CASE 04', tag: 'PERSONAL PROJECT', slug: 'e-shop-dashboard', title: 'E-shop Dashboard', case_study: '', cover_url: null, gallery: [], problem: '[One line: what the shop owner sees.]', built_with: '[Stack and database design.]', result: '[Screenshot or demo.]', github_url: 'https://github.com/azharaliofficial', demo_url: '' },
]

export const experiences = [
  { type: 'INTERNSHIP', role: 'Backend Development Intern', org: 'CodeAlpha', summary: 'Built three backend projects: Restaurant Management, Event Registration and URL Shortener.' },
  { type: 'INTERNSHIP', role: 'Full-Stack Web Development Intern', org: 'Tech Zone Institute', summary: 'One month applying full-stack skills in real project environments after a 3-month program.' },
  { type: 'LEADERSHIP', role: 'Baltistan Student Council', org: 'GCUF · 2024 and 2025', summary: 'Recognised for teamwork in 2024 and team leadership in 2025.' },
]

export const certificates = [
  { title: 'Full-Stack Web Development', issuer: 'Tech Zone Institute', date_label: 'Sep 2025', link_label: 'VIEW', url: '' },
  { title: 'Hands-On AI Training', issuer: 'VitaNova (VNIAS)', date_label: 'Apr 2026', link_label: 'VIEW', url: '' },
  { title: 'Data Analytics and Business Intelligence', issuer: 'DigiSkills.pk', date_label: 'Jul 2026', link_label: 'VERIFY', url: '' },
  { title: 'Artificial Intelligence using Python', issuer: 'DigiSkills.pk', date_label: 'Jul 2026', link_label: 'VERIFY', url: '' },
  { title: 'Teamwork and Team Leadership', issuer: 'Baltistan Student Council GCUF', date_label: '2024, 2025', link_label: 'VIEW', url: '' },
  { title: 'Computer Diploma', issuer: "Challenger's Computer Skills Centre", date_label: 'Oct 2022', link_label: 'VIEW', url: '' },
]

export const fallback = {
  profile,
  academics,
  timeline,
  services,
  skills,
  projects,
  experiences,
  certificates,
}
