const EXAM_SYLLABUS = {
  'jee-main': {
    exam: 'JEE_MAIN',
    name: 'JEE Mains',
    stream: 'MPC',
    modules: [
      {
        title: 'Physics: Mechanics',
        lessons: [
          'Units and Dimensions',
          'Kinematics',
          'Laws of Motion',
          'Work, Energy and Power',
          'Rotational Motion',
          'Gravitation',
          'Properties of Solids and Fluids',
          'Oscillations and Waves',
        ],
      },
      {
        title: 'Physics: Heat, Electricity and Magnetism',
        lessons: [
          'Thermal Properties of Matter',
          'Thermodynamics',
          'Kinetic Theory of Gases',
          'Electrostatics',
          'Current Electricity',
          'Magnetic Effects of Current',
          'Electromagnetic Induction',
          'Alternating Current',
        ],
      },
      {
        title: 'Physics: Optics and Modern Physics',
        lessons: [
          'Ray Optics',
          'Wave Optics',
          'Dual Nature of Matter and Radiation',
          'Atoms and Nuclei',
          'Semiconductors',
        ],
      },
      {
        title: 'Chemistry: Physical Chemistry',
        lessons: [
          'Basic Concepts of Chemistry',
          'Atomic Structure',
          'Chemical Bonding',
          'States of Matter',
          'Thermodynamics',
          'Equilibrium',
          'Redox Reactions',
          'Electrochemistry',
          'Chemical Kinetics',
          'Solutions',
          'Surface Chemistry',
        ],
      },
      {
        title: 'Chemistry: Inorganic Chemistry',
        lessons: [
          'Periodic Table and Periodicity',
          'Hydrogen',
          's-Block Elements',
          'p-Block Elements',
          'd- and f-Block Elements',
          'Coordination Compounds',
          'Environmental Chemistry',
        ],
      },
      {
        title: 'Chemistry: Organic Chemistry',
        lessons: [
          'General Organic Chemistry',
          'Hydrocarbons',
          'Haloalkanes and Haloarenes',
          'Alcohols, Phenols and Ethers',
          'Aldehydes, Ketones and Carboxylic Acids',
          'Amines',
          'Biomolecules',
          'Polymers',
          'Chemistry in Everyday Life',
        ],
      },
      {
        title: 'Mathematics: Algebra',
        lessons: [
          'Sets, Relations and Functions',
          'Complex Numbers',
          'Quadratic Equations',
          'Sequences and Series',
          'Permutations and Combinations',
          'Binomial Theorem',
          'Matrices and Determinants',
          'Probability',
        ],
      },
      {
        title: 'Mathematics: Calculus',
        lessons: [
          'Limits and Continuity',
          'Differentiation',
          'Applications of Derivatives',
          'Integrals',
          'Applications of Integrals',
          'Differential Equations',
        ],
      },
      {
        title: 'Mathematics: Coordinate Geometry & Vectors',
        lessons: [
          'Straight Lines',
          'Circle',
          'Parabola',
          'Ellipse',
          'Hyperbola',
          'Vectors',
          '3D Geometry',
        ],
      },
    ],
  },
  'neet': {
    exam: 'NEET',
    name: 'NEET',
    stream: 'BIPC',
    modules: [
      {
        title: 'Biology: Botany',
        lessons: [
          'Diversity in Living World',
          'Plant Anatomy',
          'Plant Morphology',
          'Plant Physiology',
          'Photosynthesis',
          'Respiration in Plants',
          'Growth and Development',
        ],
      },
      {
        title: 'Biology: Zoology',
        lessons: [
          'Animal Kingdom',
          'Structural Organisation in Animals',
          'Human Physiology',
          'Human Reproduction',
          'Genetics and Evolution',
          'Biotechnology',
          'Ecology and Environment',
        ],
      },
      {
        title: 'Physics',
        lessons: [
          'Units and Dimensions',
          'Kinematics',
          'Laws of Motion',
          'Work, Energy and Power',
          'Thermodynamics',
          'Electrostatics',
          'Current Electricity',
          'Magnetism',
          'Optics',
          'Modern Physics',
        ],
      },
      {
        title: 'Chemistry',
        lessons: [
          'Basic Concepts of Chemistry',
          'Atomic Structure',
          'Chemical Bonding',
          'Thermodynamics',
          'Equilibrium',
          'Electrochemistry',
          'Chemical Kinetics',
          'Organic Chemistry Basics',
          'Biomolecules',
        ],
      },
    ],
  },
  'eamcet-mpc': {
    exam: 'EAMCET_MPC',
    name: 'EAMCET MPC',
    stream: 'MPC',
    modules: [
      {
        title: 'Mathematics',
        lessons: [
          'Algebra',
          'Trigonometry',
          'Coordinate Geometry',
          'Calculus',
          'Vectors and 3D Geometry',
        ],
      },
      {
        title: 'Physics',
        lessons: [
          'Units and Dimensions',
          'Kinematics',
          'Laws of Motion',
          'Thermodynamics',
          'Electrostatics',
          'Current Electricity',
          'Optics',
          'Modern Physics',
        ],
      },
      {
        title: 'Chemistry',
        lessons: [
          'Atomic Structure',
          'Chemical Bonding',
          'Thermodynamics',
          'Equilibrium',
          'Electrochemistry',
          'Organic Chemistry',
        ],
      },
    ],
  },
  'eamcet-bipc': {
    exam: 'EAMCET_BIPC',
    name: 'EAMCET BIPC',
    stream: 'BIPC',
    modules: [
      {
        title: 'Biology',
        lessons: [
          'Cell: Structure and Function',
          'Genetics and Evolution',
          'Human Physiology',
          'Plant Physiology',
          'Ecology and Environment',
        ],
      },
      {
        title: 'Physics',
        lessons: [
          'Units and Dimensions',
          'Kinematics',
          'Laws of Motion',
          'Electrostatics',
          'Current Electricity',
          'Optics',
        ],
      },
      {
        title: 'Chemistry',
        lessons: [
          'Atomic Structure',
          'Chemical Bonding',
          'Thermodynamics',
          'Equilibrium',
          'Organic Chemistry',
        ],
      },
    ],
  },
};

function getExamSyllabus(examKey) {
  return EXAM_SYLLABUS[examKey];
}

module.exports = { EXAM_SYLLABUS, getExamSyllabus };
