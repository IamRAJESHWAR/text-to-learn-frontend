export const EXAM_CARDS = [
  {
    key: 'jee-main',
    exam: 'JEE_MAIN',
    name: 'JEE Mains',
    stream: 'MPC',
    description: 'Full syllabus with subtopics, previous year Q&A, and lectures.',
  },
  {
    key: 'neet',
    exam: 'NEET',
    name: 'NEET',
    stream: 'BIPC',
    description: 'Full syllabus with subtopics, previous year Q&A, and lectures.',
  },
  {
    key: 'eamcet-mpc',
    exam: 'EAMCET_MPC',
    name: 'EAMCET MPC',
    stream: 'MPC',
    description: 'Full syllabus with subtopics, previous year Q&A, and lectures.',
  },
  {
    key: 'eamcet-bipc',
    exam: 'EAMCET_BIPC',
    name: 'EAMCET BIPC',
    stream: 'BIPC',
    description: 'Full syllabus with subtopics, previous year Q&A, and lectures.',
  },
];

export function getExamByKey(key) {
  return EXAM_CARDS.find(card => card.key === key);
}
