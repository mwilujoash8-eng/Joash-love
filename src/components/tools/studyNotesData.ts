import { MasterLectureChapter } from '../../types';
import { MASTER_LECTURE_CHAPTERS, generateDeepTaughtMasterLecture } from './masterLectures';

export interface DefinitionItem {
  term: string;
  definition: string;
}

export interface FormulaRuleItem {
  label: string;
  formula: string;
  application: string;
}

export interface WorkedExampleItem {
  problem: string;
  steps: string[];
  finalAnswer: string;
}

export interface FlashcardItem {
  front: string;
  back: string;
}

export interface QuizQuestionItem {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  gradeLevel: string;
  category: string;
  durationMinutes: number;
  masterLecture?: MasterLectureChapter;
  summaryBulletPoints: string[];
  coreDefinitions: DefinitionItem[];
  keyFormulasAndRules: FormulaRuleItem[];
  workedExamples: WorkedExampleItem[];
  examTips: string[];
  flashcards: FlashcardItem[];
  quizQuestions: QuizQuestionItem[];
}

export interface SubjectCurriculum {
  id: string;
  name: string;
  icon: string;
  color: string;
  topics: StudyTopic[];
}

export const VALIDATED_SUBJECT_CURRICULUM: SubjectCurriculum[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: '📐',
    color: 'emerald',
    topics: [
      {
        id: 'math_quadratics',
        title: 'Quadratic Equations & Parabolic Functions',
        gradeLevel: 'Senior Secondary (Gr 10-12)',
        category: 'Algebra & Functions',
        durationMinutes: 15,
        summaryBulletPoints: [
          'A quadratic equation is in the standard form ax² + bx + c = 0 where a ≠ 0.',
          'Solving methods include: Factorization, Completing the Square, and the Quadratic Formula.',
          'The Discriminant Δ = b² - 4ac determines the nature of roots: Δ > 0 (two distinct real roots), Δ = 0 (one repeated real root), Δ < 0 (no real roots / complex roots).',
          'The vertex of the parabola y = ax² + bx + c is located at x = -b / (2a).',
          'If a > 0, the parabola opens upwards (minimum turning point); if a < 0, it opens downwards (maximum turning point).'
        ],
        coreDefinitions: [
          {
            term: 'Discriminant (Δ)',
            definition: 'The expression b² - 4ac under the square root in the quadratic formula that dictates the number and type of roots.'
          },
          {
            term: 'Axis of Symmetry',
            definition: 'A vertical line given by x = -b / (2a) that divides the parabolic graph into two symmetrical halves.'
          },
          {
            term: 'Turning Point (Vertex)',
            definition: 'The maximum or minimum point (h, k) on a quadratic curve where the gradient equals zero.'
          }
        ],
        keyFormulasAndRules: [
          {
            label: 'Quadratic Formula',
            formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
            application: 'Used to solve any quadratic equation ax² + bx + c = 0 regardless of factorability.'
          },
          {
            label: 'Turning Point Coordinates',
            formula: 'x = -b / (2a),  y = c - b² / (4a)',
            application: 'Finds the exact coordinate of the maximum or minimum on a curve.'
          },
          {
            label: 'Sum and Product of Roots',
            formula: 'α + β = -b/a,  αβ = c/a',
            application: 'Relates the roots of a quadratic equation to its polynomial coefficients.'
          }
        ],
        workedExamples: [
          {
            problem: 'Solve 2x² - 7x + 3 = 0 using the quadratic formula.',
            steps: [
              'Identify coefficients: a = 2, b = -7, c = 3.',
              'Calculate discriminant: b² - 4ac = (-7)² - 4(2)(3) = 49 - 24 = 25.',
              'Substitute into formula: x = (7 ± √25) / (2 × 2) = (7 ± 5) / 4.',
              'Evaluate roots: x₁ = (7 + 5)/4 = 12/4 = 3;  x₂ = (7 - 5)/4 = 2/4 = 0.5.'
            ],
            finalAnswer: 'x = 3  or  x = 0.5 (1/2)'
          }
        ],
        examTips: [
          'Always state the values of a, b, and c explicitly before substituting into the quadratic formula to prevent sign errors with negative values of b.',
          'Double check that the equation is equated to ZERO before attempting to read a, b, and c.',
          'In ECZ Paper 2, remember to round to 2 decimal places when specifically instructed.'
        ],
        flashcards: [
          {
            front: 'What does a discriminant Δ > 0 signify?',
            back: 'It means the quadratic equation has two distinct real roots, and the curve crosses the x-axis twice.'
          },
          {
            front: 'What is the formula for the axis of symmetry of y = ax² + bx + c?',
            back: 'x = -b / (2a)'
          },
          {
            front: 'What happens to the graph when a < 0 in y = ax² + bx + c?',
            back: 'The parabola opens downward and has a MAXIMUM turning point (hill shape).'
          }
        ],
        quizQuestions: [
          {
            question: 'What is the nature of roots for 3x² - 2x + 5 = 0?',
            options: ['Two distinct real roots', 'One repeated real root', 'No real roots (Discriminant < 0)', 'Infinite roots'],
            correctAnswerIndex: 2,
            explanation: 'b² - 4ac = (-2)² - 4(3)(5) = 4 - 60 = -56. Since Δ < 0, there are no real roots.'
          },
          {
            question: 'What is the turning point x-coordinate for y = 2x² - 8x + 5?',
            options: ['x = 4', 'x = 2', 'x = -2', 'x = -4'],
            correctAnswerIndex: 1,
            explanation: 'x = -b / (2a) = -(-8) / (2 × 2) = 8 / 4 = 2.'
          }
        ]
      },
      {
        id: 'math_trig',
        title: 'Trigonometry: Sine, Cosine Rules & Bearings',
        gradeLevel: 'Senior Secondary (Gr 10-12)',
        category: 'Trigonometry & Geometry',
        durationMinutes: 15,
        summaryBulletPoints: [
          'Right-angled triangles use SOH CAH TOA: sin θ = O/H, cos θ = A/H, tan θ = O/A.',
          'Non-right-angled triangles use the Sine Rule: a/sin A = b/sin B = c/sin C.',
          'Use the Cosine Rule for SAS (two sides and included angle) or SSS (three sides): a² = b² + c² - 2bc cos A.',
          'Area of any triangle = 1/2 ab sin C.',
          'Three-figure bearings are measured clockwise from True North (000° to 360°).'
        ],
        coreDefinitions: [
          {
            term: 'Three-Figure Bearing',
            definition: 'An angular direction measured in degrees clockwise from True North, always written with three digits (e.g. 045°, 270°).'
          },
          {
            term: 'Angle of Elevation vs Depression',
            definition: 'Angle of elevation is measured upward from horizontal; angle of depression is measured downward from horizontal.'
          }
        ],
        keyFormulasAndRules: [
          {
            label: 'Sine Rule',
            formula: 'a / sin A = b / sin B = c / sin C',
            application: 'Finding unknown sides or angles when an opposite pair is known (AAS, SSA).'
          },
          {
            label: 'Cosine Rule (Sides)',
            formula: 'a² = b² + c² - 2bc cos A',
            application: 'Finding third side when two sides and included angle are known (SAS).'
          },
          {
            label: 'Cosine Rule (Angles)',
            formula: 'cos A = (b² + c² - a²) / (2bc)',
            application: 'Finding an unknown angle when all three sides are known (SSS).'
          },
          {
            label: 'Triangle Area Formula',
            formula: 'Area = 1/2 ab sin C',
            application: 'Calculates area of any non-right triangle given two sides and included angle.'
          }
        ],
        workedExamples: [
          {
            problem: 'In triangle ABC, b = 8 cm, c = 10 cm, and angle A = 60°. Calculate side a.',
            steps: [
              'Apply Cosine Rule: a² = b² + c² - 2bc cos A.',
              'Substitute values: a² = 8² + 10² - 2(8)(10) cos 60°.',
              'Simplify: a² = 64 + 100 - 160(0.5) = 164 - 80 = 84.',
              'Take square root: a = √84 ≈ 9.17 cm.'
            ],
            finalAnswer: 'a = 9.17 cm (to 2 d.p.)'
          }
        ],
        examTips: [
          'Ensure your scientific calculator is in DEGREE mode (D), not Radian (R) or Grad (G).',
          'When drawing bearings, always draw the North reference arrow at EVERY checkpoint.'
        ],
        flashcards: [
          {
            front: 'When should you choose the Cosine Rule over the Sine Rule?',
            back: 'When you are given SAS (two sides and the included angle) or SSS (all three sides).'
          },
          {
            front: 'What is the formula for the area of a triangle given two sides and the included angle?',
            back: 'Area = 1/2 a b sin C'
          }
        ],
        quizQuestions: [
          {
            question: 'What is the area of a triangle with sides 6 cm, 8 cm and included angle 30°?',
            options: ['24 cm²', '12 cm²', '48 cm²', '6 cm²'],
            correctAnswerIndex: 1,
            explanation: 'Area = 1/2 × 6 × 8 × sin(30°) = 24 × 0.5 = 12 cm².'
          }
        ]
      }
    ]
  },
  {
    id: 'physics',
    name: 'Physics & Science',
    icon: '⚡',
    color: 'blue',
    topics: [
      {
        id: 'phys_kinematics',
        title: "Newton's Laws of Motion & Momentum",
        gradeLevel: 'Senior Secondary (Gr 10-12)',
        category: 'Mechanics',
        durationMinutes: 15,
        summaryBulletPoints: [
          "Newton's First Law (Inertia): An object remains at rest or uniform velocity unless acted upon by a resultant net force.",
          "Newton's Second Law: Resultant force F = ma. Rate of change of momentum is proportional to the applied force: F = (mv - mu) / t.",
          "Newton's Third Law: When Body A exerts a force on Body B, Body B exerts an equal and opposite force on Body A.",
          'Law of Conservation of Linear Momentum: In an isolated system with no external forces, total initial momentum = total final momentum (m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂).',
          'Impulse = Force × time = Change in momentum (Δp = FΔt = mv - mu), measured in N·s or kg·m/s.'
        ],
        coreDefinitions: [
          {
            term: 'Inertia',
            definition: 'The resistance of an object to any change in its state of rest or uniform motion.'
          },
          {
            term: 'Linear Momentum (p)',
            definition: 'The product of an object’s mass and its velocity: p = mv. It is a vector quantity.'
          },
          {
            term: 'Impulse (J)',
            definition: 'The product of average force and the time interval over which it acts: J = FΔt.'
          }
        ],
        keyFormulasAndRules: [
          {
            label: "Newton's 2nd Law",
            formula: 'F = ma  or  F = (mv - mu) / t',
            application: 'Calculates acceleration or net force acting on a moving body.'
          },
          {
            label: 'Momentum Conservation',
            formula: 'm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂',
            application: 'Solves collision and explosion problems.'
          },
          {
            label: 'Kinetic Energy & Work',
            formula: 'W = Fd,  E_k = 1/2 mv²,  E_p = mgh',
            application: 'Calculates mechanical energy and energy transformations.'
          }
        ],
        workedExamples: [
          {
            problem: 'A car of mass 1200 kg accelerating from 10 m/s to 25 m/s in 6 seconds. Calculate the resultant force.',
            steps: [
              'Calculate acceleration: a = (v - u) / t = (25 - 10) / 6 = 15 / 6 = 2.5 m/s².',
              'Calculate force: F = ma = 1200 kg × 2.5 m/s² = 3000 N.'
            ],
            finalAnswer: 'F = 3000 N (or 3.0 kN)'
          }
        ],
        examTips: [
          'Always state SI units (Newtons N, kg·m/s, m/s²) with every final numerical answer.',
          'Remember momentum is a VECTOR: moving left vs right requires positive and negative signs.'
        ],
        flashcards: [
          {
            front: 'What is the SI unit of momentum?',
            back: 'kg·m/s or N·s (Newton-seconds).'
          },
          {
            front: "State Newton's Third Law of Motion.",
            back: 'For every action, there is an equal and opposite reaction (action and reaction forces act on different bodies).'
          }
        ],
        quizQuestions: [
          {
            question: 'What is the momentum of an 800 kg car travelling at 20 m/s?',
            options: ['40 kg·m/s', '16,000 kg·m/s', '820 kg·m/s', '160,000 kg·m/s'],
            correctAnswerIndex: 1,
            explanation: 'p = m × v = 800 kg × 20 m/s = 16,000 kg·m/s.'
          }
        ]
      },
      {
        id: 'phys_circuits',
        title: "Ohm's Law & Electric Circuits",
        gradeLevel: 'Senior Secondary (Gr 10-12)',
        category: 'Electricity & Magnetism',
        durationMinutes: 15,
        summaryBulletPoints: [
          "Ohm's Law states that current through a metallic conductor is directly proportional to the potential difference across it, provided temperature remains constant: V = IR.",
          'In a SERIES circuit: Current is the same everywhere (I = I₁ = I₂), total voltage splits (V = V₁ + V₂), and total resistance R_total = R₁ + R₂ + R₃.',
          'In a PARALLEL circuit: Voltage is identical across all branches (V = V₁ = V₂), total current splits (I = I₁ + I₂), and 1/R_total = 1/R₁ + 1/R₂.',
          'Electrical Power P = VI = I²R = V² / R. Electrical energy E = Pt = VIt (measured in Joules or kWh).'
        ],
        coreDefinitions: [
          {
            term: 'Potential Difference (Voltage)',
            definition: 'The work done per unit charge in moving a positive charge between two points in an electrical circuit: V = W / Q (Volts).'
          },
          {
            term: 'Electric Current (I)',
            definition: 'The rate of flow of electric charge: I = Q / t (Amperes).'
          },
          {
            term: 'Resistance (R)',
            definition: 'The opposition to the flow of electric charge: R = V / I (Ohms Ω).'
          }
        ],
        keyFormulasAndRules: [
          {
            label: "Ohm's Law",
            formula: 'V = I × R',
            application: 'Relates Voltage, Current, and Resistance.'
          },
          {
            label: 'Parallel Resistance',
            formula: '1/R_total = 1/R₁ + 1/R₂  or  R = (R₁R₂) / (R₁ + R₂)',
            application: 'Calculates equivalent resistance of two parallel resistors.'
          },
          {
            label: 'Electrical Power',
            formula: 'P = V × I = I²R = V² / R',
            application: 'Calculates rate of energy conversion in an electrical appliance.'
          }
        ],
        workedExamples: [
          {
            problem: 'Two resistors of 6 Ω and 3 Ω are connected in parallel to a 12 V battery. Calculate the total circuit current.',
            steps: [
              'Calculate total parallel resistance: R_total = (6 × 3) / (6 + 3) = 18 / 9 = 2 Ω.',
              'Calculate total current using Ohm’s Law: I = V / R_total = 12 V / 2 Ω = 6 A.'
            ],
            finalAnswer: 'Total Resistance = 2 Ω, Total Current = 6 A'
          }
        ],
        examTips: [
          'Ammeters must always be connected in SERIES with very low resistance.',
          'Voltmeters must always be connected in PARALLEL with very high resistance.'
        ],
        flashcards: [
          {
            front: 'How is total resistance calculated for two parallel resistors?',
            back: 'R_total = (R₁ × R₂) / (R₁ + R₂)  or  1/R_total = 1/R₁ + 1/R₂'
          },
          {
            front: "What is Ohm's Law formula?",
            back: 'V = I × R (Voltage = Current × Resistance)'
          }
        ],
        quizQuestions: [
          {
            question: 'What is the equivalent resistance of three 6 Ω resistors in parallel?',
            options: ['18 Ω', '2 Ω', '6 Ω', '0.5 Ω'],
            correctAnswerIndex: 1,
            explanation: '1/R = 1/6 + 1/6 + 1/6 = 3/6 = 1/2. Therefore R = 2 Ω.'
          }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '🧪',
    color: 'purple',
    topics: [
      {
        id: 'chem_stoichiometry',
        title: 'The Mole Concept & Stoichiometric Calculations',
        gradeLevel: 'Senior Secondary (Gr 10-12)',
        category: 'Physical & Quantitative Chemistry',
        durationMinutes: 15,
        summaryBulletPoints: [
          'One mole contains Avogadro’s number of particles: N_A = 6.022 × 10²³ particles.',
          'Number of moles n = mass (m) / molar mass (M_r).',
          'For gases at r.t.p. (room temperature & pressure): 1 mole occupies 24.0 dm³ (24,000 cm³). Volume = n × 24 dm³.',
          'For solutions: Concentration (mol/dm³) = moles (n) / Volume in dm³ (V). C = n / V.',
          'Empirical formula represents the simplest whole-number ratio of atoms in a compound; Molecular formula = (Empirical Formula) × n.'
        ],
        coreDefinitions: [
          {
            term: 'Avogadro Constant (N_A)',
            definition: 'The number of constituent particles (atoms, molecules, ions) in one mole of a substance: 6.02 × 10²³ mol⁻¹.'
          },
          {
            term: 'Molar Mass (M_r)',
            definition: 'The mass of one mole of a substance, expressed in grams per mole (g/mol).'
          },
          {
            term: 'Limiting Reagent',
            definition: 'The reactant that is completely consumed first in a chemical reaction, thereby limiting the amount of product formed.'
          }
        ],
        keyFormulasAndRules: [
          {
            label: 'Moles from Mass',
            formula: 'n = mass (g) / Molar Mass (g/mol)',
            application: 'Converts between grams and moles of any substance.'
          },
          {
            label: 'Moles of Gas at r.t.p.',
            formula: 'n = Volume (dm³) / 24 dm³',
            application: 'Calculates gas volumes and yields at standard room conditions.'
          },
          {
            label: 'Molar Concentration',
            formula: 'C = n / V (dm³) = mass (g) / (M_r × V)',
            application: 'Used for titration and solution molarity calculations.'
          }
        ],
        workedExamples: [
          {
            problem: 'Calculate the mass of magnesium oxide formed when 4.8 g of magnesium is completely burnt in excess oxygen. [Ar: Mg=24, O=16]',
            steps: [
              'Write balanced equation: 2Mg + O₂ → 2MgO.',
              'Calculate moles of Mg: n(Mg) = 4.8 g / 24 g/mol = 0.2 mol.',
              'Mole ratio from equation: 2 mol Mg produces 2 mol MgO (1:1 ratio), so n(MgO) = 0.2 mol.',
              'Calculate Molar mass of MgO: M_r(MgO) = 24 + 16 = 40 g/mol.',
              'Calculate mass of MgO: mass = 0.2 mol × 40 g/mol = 8.0 g.'
            ],
            finalAnswer: 'Mass of MgO = 8.0 g'
          }
        ],
        examTips: [
          'Always convert cm³ to dm³ by dividing by 1000 before calculating concentration: V(dm³) = V(cm³) / 1000.',
          'Always balance chemical equations before deriving mole ratios!'
        ],
        flashcards: [
          {
            front: 'What volume does 1 mole of any gas occupy at room temperature and pressure (r.t.p.)?',
            back: '24 dm³ (or 24,000 cm³).'
          },
          {
            front: 'What is the formula relating concentration, moles, and volume?',
            back: 'C = n / V (Concentration = Moles / Volume in dm³).'
          }
        ],
        quizQuestions: [
          {
            question: 'How many moles are in 88 g of carbon dioxide CO₂? [Ar: C=12, O=16]',
            options: ['1 mole', '2 moles', '0.5 moles', '4 moles'],
            correctAnswerIndex: 1,
            explanation: 'M_r(CO₂) = 12 + 2(16) = 44 g/mol. Moles = 88 g / 44 g/mol = 2.0 moles.'
          }
        ]
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: '🔬',
    color: 'emerald',
    topics: [
      {
        id: 'bio_enzymes',
        title: 'Enzymes & Biological Catalysis',
        gradeLevel: 'Junior & Senior Secondary',
        category: 'Cellular Physiology',
        durationMinutes: 15,
        summaryBulletPoints: [
          'Enzymes are biological catalysts made of proteins that speed up metabolic reactions without being consumed in the process.',
          'They operate via the "Lock and Key" hypothesis where a specific substrate fits into the complementary active site.',
          'Factors affecting enzyme activity: Temperature, pH, Substrate Concentration, and Enzyme Concentration.',
          'At optimal temperature (usually 37°C in humans), reaction rate is maximal. Above the optimum, high thermal energy breaks hydrogen bonds, causing irreversible DENATURATION.',
          'Each enzyme has an optimal pH (e.g. Pepsin in stomach pH 2, Salivary Amylase in mouth pH 7, Trypsin in duodenum pH 8).'
        ],
        coreDefinitions: [
          {
            term: 'Active Site',
            definition: 'The specific three-dimensional region on an enzyme molecule where the substrate binds.'
          },
          {
            term: 'Denaturation',
            definition: 'The irreversible structural alteration of an enzyme’s tertiary protein structure, changing the active site shape so the substrate no longer fits.'
          },
          {
            term: 'Optimum Temperature / pH',
            definition: 'The specific environmental condition at which an enzyme works at its maximum reaction velocity.'
          }
        ],
        keyFormulasAndRules: [
          {
            label: 'Enzyme-Substrate Complex',
            formula: 'Enzyme (E) + Substrate (S) ⇌ [E-S Complex] → Enzyme (E) + Products (P)',
            application: 'Describes catalytic enzyme kinetics.'
          },
          {
            label: 'Q₁₀ Temperature Coefficient',
            formula: 'Rate doubles roughly every 10°C increase up to optimum.',
            application: 'Explains kinetic energy increase before thermal denaturation.'
          }
        ],
        workedExamples: [
          {
            problem: 'Explain why boiling amylase enzyme destroys its ability to digest starch into maltose.',
            steps: [
              'Amylase is a globular protein with a specific 3D active site.',
              'Boiling exposes the enzyme to temperatures far above its optimum (~37°C).',
              'The excessive heat energy causes atomic vibrations that break intramolecular hydrogen and ionic bonds.',
              'The active site undergoes permanent structural change (denaturation), preventing substrate binding.'
            ],
            finalAnswer: 'Amylase denatures; starch can no longer bind to the active site.'
          }
        ],
        examTips: [
          'Never say an enzyme is "killed" by heat—enzymes are non-living molecules. Use the term "DENATURED".',
          'At low temperatures (e.g. 0°C), enzymes are NOT denatured—they are simply INACTIVE due to low kinetic energy.'
        ],
        flashcards: [
          {
            front: 'What happens to enzymes at extreme pH or temperatures above 60°C?',
            back: 'They undergo DENATURATION (the active site changes shape irreversibly).'
          },
          {
            front: 'What is the optimal pH for the stomach enzyme Pepsin?',
            back: 'pH 1.5 to 2.0 (strongly acidic, provided by HCl).'
          }
        ],
        quizQuestions: [
          {
            question: 'Why are enzymes described as "specific"?',
            options: [
              'They can catalyze all chemical reactions in the body',
              'Their active site only complements one particular substrate',
              'They only work inside the human stomach',
              'They are destroyed at the end of each reaction'
            ],
            correctAnswerIndex: 1,
            explanation: 'Enzyme specificity means each enzyme has a distinct active site geometry that only binds to its complementary substrate.'
          }
        ]
      }
    ]
  },
  {
    id: 'english',
    name: 'English Language & Lit',
    icon: '📖',
    color: 'amber',
    topics: [
      {
        id: 'eng_summary',
        title: 'Summary Writing Techniques & Word-Limit Precision',
        gradeLevel: 'Junior & Senior Secondary',
        category: 'Language Skills & Writing',
        durationMinutes: 15,
        summaryBulletPoints: [
          'Read the prompt carefully and underline the specific focal points (e.g. "Summarize the causes and effects of deforestation").',
          'Identify and number the key content points directly in the passage (aim for 10-12 valid points).',
          'Do NOT copy verbatim—paraphrase using concise synonyms and transitional linking devices (e.g. Furthermore, Consequently, In addition).',
          'Strictly obey the word count (usually 140-150 words). Penalties are incurred for exceeding the designated limit.',
          'Write in continuous prose in a single coherent paragraph without subtitles, bullets, or personal commentary.'
        ],
        coreDefinitions: [
          {
            term: 'Paraphrasing',
            definition: 'Restating the author’s ideas in your own words while retaining the original meaning.'
          },
          {
            term: 'Transitional Markers',
            definition: 'Cohesive connecting words (e.g., moreover, however, subsequently) that ensure smooth flow between ideas.'
          }
        ],
        keyFormulasAndRules: [
          {
            label: 'Summary Scoring Rule',
            formula: 'Total Marks = Content Points (14-16 marks) + Language & Organization (4-6 marks)',
            application: 'Maximizes grade by prioritizing factual point extraction.'
          }
        ],
        workedExamples: [
          {
            problem: 'How to reduce a 30-word descriptive clause into a 5-word summary point.',
            steps: [
              'Original text: "Due to the torrential downpours that lashed the valley for days on end, the water levels in the local reservoir escalated dangerously."',
              'Extract core idea: Heavy rains caused dangerous reservoir flooding.',
              'Refined point: "Excessive rainfall flooded local reservoirs."'
            ],
            finalAnswer: '5 words (83% reduction in word count without losing meaning).'
          }
        ],
        examTips: [
          'Count your words accurately and write the total at the end of your summary.',
          'Never include metaphors, examples (e.g., such as, for instance), quotations, or rhetorical questions in summary writing.'
        ],
        flashcards: [
          {
            front: 'Should you include examples and quotations in summary writing?',
            back: 'NO. Exclude all illustrative examples, statistics, metaphors, and quotes to preserve word count.'
          }
        ],
        quizQuestions: [
          {
            question: 'What is the recommended paragraph structure for an ECZ English summary?',
            options: [
              'Three paragraphs with subheadings',
              'One single continuous paragraph',
              'Bullet points numbered 1 to 10',
              'An introduction, body, and personal conclusion'
            ],
            correctAnswerIndex: 1,
            explanation: 'Official examination format requires a single, continuous paragraph without bullet points or subheadings.'
          }
        ]
      }
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    color: 'teal',
    topics: [
      {
        id: 'geo_mapwork',
        title: 'Topographical Map Reading & Calculation Skills',
        gradeLevel: 'Junior & Senior Secondary',
        category: 'Geographical Skills',
        durationMinutes: 15,
        summaryBulletPoints: [
          'Four-Figure Grid References locate an entire 1 km × 1 km grid square (Easting first, then Northing).',
          'Six-Figure Grid References pinpoint an exact feature to the nearest 100 meters (e.g. 342678).',
          'Gradient = Vertical Interval (VI) / Horizontal Equivalent (HE). Both must be in the same units (meters).',
          'Contour lines close together indicate a STEEP slope; widely spaced contour lines indicate a GENTLE slope.',
          'Drainage patterns: Dendritic (tree-like), Trellis (parallel tributaries), Radial (radiating outward from a central volcanic cone or hill).'
        ],
        coreDefinitions: [
          {
            term: 'Vertical Interval (VI)',
            definition: 'The difference in elevation between two adjacent contour lines on a topographical map.'
          },
          {
            term: 'Horizontal Equivalent (HE)',
            definition: 'The ground distance between two points measured along the map scale.'
          },
          {
            term: 'Representative Fraction (RF)',
            definition: 'The ratio of distance on the map to distance on the ground (e.g. 1:50,000 means 1 cm on map = 50,000 cm or 500 m on ground).'
          }
        ],
        keyFormulasAndRules: [
          {
            label: 'Gradient Formula',
            formula: 'Gradient = (Difference in Height) / (Horizontal Distance) = VI / HE',
            application: 'Expresses slope steepness as a ratio (e.g. 1 in 25).'
          },
          {
            label: 'Ground Distance Calculation',
            formula: 'Ground Distance (km) = Map Distance (cm) × (Scale / 100,000)',
            application: 'Converts measured string/ruler length to real world km.'
          }
        ],
        workedExamples: [
          {
            problem: 'Point A has an elevation of 1200 m and Point B is 1450 m. The distance between them on a 1:50,000 map is 5 cm. Find the gradient.',
            steps: [
              'Calculate Vertical Interval (VI): 1450 m - 1200 m = 250 m.',
              'Calculate Horizontal Equivalent (HE): 5 cm × 50,000 = 250,000 cm = 2,500 m.',
              'Calculate Gradient: VI / HE = 250 / 2500 = 1 / 10.'
            ],
            finalAnswer: 'Gradient = 1 in 10 (or 1:10)'
          }
        ],
        examTips: [
          'Remember the memory mnemonic: "Walk into the house (Easting across) before climbing the stairs (Northing up)".',
          'Always state gradient as a fraction reduced to "1 in X".'
        ],
        flashcards: [
          {
            front: 'What does a 1:50,000 map scale mean in terms of kilometers per centimeter?',
            back: '1 cm on the map represents 0.5 km (500 meters) on the ground.'
          }
        ],
        quizQuestions: [
          {
            question: 'What type of landform is indicated by concentric circular contours with heights increasing towards the center?',
            options: ['A depression', 'A conical hill / peak', 'A valley', 'A spur'],
            correctAnswerIndex: 1,
            explanation: 'Concentric closed contours increasing in elevation inwards depict a conical hill or mountain peak.'
          }
        ]
      }
    ]
  },
  {
    id: 'history',
    name: 'History & Civics',
    icon: '🏛️',
    color: 'rose',
    topics: [
      {
        id: 'hist_independence',
        title: 'Zambian Struggle for Independence & Nationalism',
        gradeLevel: 'Senior Secondary (Gr 10-12)',
        category: 'Central African History',
        durationMinutes: 15,
        summaryBulletPoints: [
          'Opposition to the Federation of Rhodesia and Nyasaland (1953-1963) acted as a major catalyst for African nationalism in Northern Rhodesia.',
          'Early political organizations: Northern Rhodesia African Congress (NRAC, 1948) led by Godwin Lewanika, later African National Congress (ANC) led by Harry Mwaanga Nkumbula.',
          'Formation of UNIP (United National Independence Party) in 1959 under Kenneth Kaunda, advocating non-violent positive action ("Cha Cha Cha" campaign in 1961).',
          'The 1962 General Election led to a coalition government between UNIP and ANC.',
          'Northern Rhodesia gained full sovereign independence as the Republic of Zambia on October 24, 1964, with Kenneth Kaunda as the first President.'
        ],
        coreDefinitions: [
          {
            term: 'Nationalism',
            definition: 'A political movement and consciousness demanding self-determination, sovereignty, and independence from colonial rule.'
          },
          {
            term: 'Cha Cha Cha Campaign',
            definition: 'The 1961 civil disobedience campaign organized by UNIP in Northern Province and the Copperbelt to protest against the British colonial constitution.'
          }
        ],
        keyFormulasAndRules: [
          {
            label: 'Chronological Timeline',
            formula: '1948 (NRAC) → 1951 (ANC) → 1953 (Federation) → 1958 (ZANC) → 1959 (UNIP) → 1964 (Independence)',
            application: 'Sequencing historical essay events.'
          }
        ],
        workedExamples: [
          {
            problem: 'State three main reasons why Africans in Northern Rhodesia opposed the 1953 Federation.',
            steps: [
              'Fear of Southern Rhodesian white settler domination and racial segregation policies.',
              'Drain of Northern Rhodesian Copper revenues to develop Southern Rhodesia (Salisbury).',
              'Delay in African political advancement and fear of losing customary land rights.'
            ],
            finalAnswer: 'Dominance of Southern Rhodesia, resource exploitation, and racial discrimination.'
          }
        ],
        examTips: [
          'In historical essay questions, always provide balanced analysis with clear dates, named leaders, and concrete outcomes.'
        ],
        flashcards: [
          {
            front: 'On what exact date did Zambia achieve independence?',
            back: 'October 24, 1964.'
          }
        ],
        quizQuestions: [
          {
            question: 'Who was the first president of the Republic of Zambia in 1964?',
            options: ['Harry Mwaanga Nkumbula', 'Dr. Kenneth David Kaunda', 'Simon Mwansa Kapwepwe', 'Godwin Lewanika'],
            correctAnswerIndex: 1,
            explanation: 'Dr. Kenneth David Kaunda was elected the first President of Zambia at independence on October 24, 1964.'
          }
        ]
      }
    ]
  },
  {
    id: 'accounts',
    name: 'Commerce & Accounts',
    icon: '📊',
    color: 'sky',
    topics: [
      {
        id: 'acc_double_entry',
        title: 'Double Entry Bookkeeping & The Trial Balance',
        gradeLevel: 'Junior & Senior Secondary',
        category: 'Financial Accounting',
        durationMinutes: 15,
        summaryBulletPoints: [
          'The Fundamental Accounting Equation: Assets = Capital + Liabilities (A = C + L).',
          'The Golden Rule of Double Entry: "Debit what comes in (or increases expenses/assets), Credit what goes out (or increases income/liabilities)".',
          'DEALER rule: Dividends, Expenses, Assets increase with DEBITS; Liabilities, Equity, Revenue increase with CREDITS.',
          'The Trial Balance is a statement prepared at a given date to test the mathematical accuracy of debit and credit ledger balances.',
          'Errors that do NOT affect trial balance agreement: Error of Omission, Commission, Principle, Original Entry, Reversal of Entries, and Compensating Errors.'
        ],
        coreDefinitions: [
          {
            term: 'Asset',
            definition: 'A resource controlled by an entity as a result of past events from which future economic benefits are expected to flow.'
          },
          {
            term: 'Liability',
            definition: 'A present obligation of an enterprise arising from past events, the settlement of which results in an outflow of resources.'
          },
          {
            term: 'Trial Balance',
            definition: 'A list of closing debit and credit ledger balances to check arithmetic accuracy before preparing financial statements.'
          }
        ],
        keyFormulasAndRules: [
          {
            label: 'Accounting Equation',
            formula: 'Assets = Capital + Liabilities  (or Capital = Assets - Liabilities)',
            application: 'Forms the basis of all double-entry ledger entries and Balance Sheets.'
          },
          {
            label: 'Gross Profit Calculation',
            formula: 'Gross Profit = Sales Turnover - Cost of Goods Sold (COGS)',
            application: 'Used in the Trading, Profit & Loss Account.'
          }
        ],
        workedExamples: [
          {
            problem: 'A business purchased equipment for K15,000 paying by cheque. Show the double-entry transaction.',
            steps: [
              'Equipment is an Asset that is INCREASING: Debit Equipment Account K15,000.',
              'Bank is an Asset that is DECREASING: Credit Bank Account K15,000.'
            ],
            finalAnswer: 'Dr: Equipment Account K15,000 | Cr: Bank Account K15,000'
          }
        ],
        examTips: [
          'Remember DEALER: Debit [Drawings, Expenses, Assets] | Credit [Liabilities, Equity/Capital, Revenue].'
        ],
        flashcards: [
          {
            front: 'What is the effect of purchasing goods on credit on the accounting equation?',
            back: 'Assets (Stock/Inventory) increase and Liabilities (Creditors/Trade Payables) increase by the same amount.'
          }
        ],
        quizQuestions: [
          {
            question: 'Which of the following errors will cause the Trial Balance totals to disagree?',
            options: [
              'Error of Omission',
              'Error of Principle',
              'Single entry made (Debited but not Credited)',
              'Compensating Error'
            ],
            correctAnswerIndex: 2,
            explanation: 'Entering a transaction only on the debit side without a corresponding credit creates a numerical imbalance, causing trial balance discrepancy.'
          }
        ]
      }
    ]
  },
  {
    id: 'computer',
    name: 'Computer Studies / ICT',
    icon: '💻',
    color: 'cyan',
    topics: [
      {
        id: 'ict_architecture',
        title: 'CPU Architecture, Memory & Algorithms',
        gradeLevel: 'Junior & Senior Secondary',
        category: 'Computer Systems',
        durationMinutes: 15,
        summaryBulletPoints: [
          'The Central Processing Unit (CPU) consists of: Arithmetic Logic Unit (ALU), Control Unit (CU), and internal Registers.',
          'The Von Neumann Architecture operates on the continuous Fetch-Decode-Execute (FDE) cycle.',
          'Primary Memory: RAM (Random Access Memory, volatile, read/write) vs ROM (Read Only Memory, non-volatile, stores BIOS/bootstrap).',
          'Algorithms are finite step-by-step procedures to solve a problem, represented using Flowcharts or Pseudocode.',
          'Standard Flowchart Symbols: Oval (Start/End Terminator), Parallelogram (Input/Output), Rectangle (Process/Calculation), Diamond (Decision/Condition).'
        ],
        coreDefinitions: [
          {
            term: 'Volatile Memory',
            definition: 'Memory that loses its stored contents immediately when electrical power is switched off (e.g. RAM, Cache).'
          },
          {
            term: 'Fetch-Decode-Execute Cycle',
            definition: 'The fundamental cycle where the CPU fetches an instruction from memory, decodes it into control signals, and executes it.'
          }
        ],
        keyFormulasAndRules: [
          {
            label: 'Data Storage Units',
            formula: '8 Bits = 1 Byte | 1024 Bytes = 1 KB | 1024 KB = 1 MB | 1024 MB = 1 GB | 1024 GB = 1 TB',
            application: 'Calculates storage capacity and file sizes.'
          }
        ],
        workedExamples: [
          {
            problem: 'Calculate how many 4 MB song files can be stored on a 2 GB USB Flash Drive.',
            steps: [
              'Convert 2 GB into Megabytes: 2 × 1024 MB = 2048 MB.',
              'Divide total space by individual file size: 2048 MB / 4 MB = 512 songs.'
            ],
            finalAnswer: '512 song files can be stored.'
          }
        ],
        examTips: [
          'In pseudocode questions, always initialize variables (e.g. Total ← 0, Count ← 1) before entering a loop.'
        ],
        flashcards: [
          {
            front: 'What is the main difference between RAM and ROM?',
            back: 'RAM is volatile (temporary) and read/write; ROM is non-volatile (permanent) and read-only.'
          }
        ],
        quizQuestions: [
          {
            question: 'Which flowchart symbol is used to represent a decision or condition?',
            options: ['Rectangle', 'Diamond', 'Parallelogram', 'Oval'],
            correctAnswerIndex: 1,
            explanation: 'The Diamond symbol is universally used in flowcharting for decision-making (e.g. IF condition THEN Yes/No).'
          }
        ]
      }
    ]
  }
];

export function getTopicMasterLecture(topic: StudyTopic, subjectName: string): MasterLectureChapter {
  if (topic.masterLecture) return topic.masterLecture;
  if (MASTER_LECTURE_CHAPTERS[topic.id]) return MASTER_LECTURE_CHAPTERS[topic.id];
  return generateDeepTaughtMasterLecture(topic.title, subjectName, topic.gradeLevel);
}

