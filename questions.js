/**
 * Question Bank for Student Online Quiz Practice Portal
 * Categorized by Subject and Difficulty level (Easy, Medium, Hard).
 * Each subject supports designated lesson modules matching the curriculum:
 *  - Mathematics (2 lessons)
 *  - English (1 lesson)
 *  - Science (1 lesson)
 *  - Physics (1 lesson)
 *  - Chemistry (1 lesson)
 *  - Biology (1 lesson)
 *  - Computing (1 lesson)
 */

const QUESTION_BANK = [
  // ==========================================================================
  // SUBJECT: Mathematics (Lesson 1: Algebra, Triangles & Percentages)
  // ==========================================================================
  {
    id: "math-1",
    subject: "Mathematics",
    category: "Mathematics",
    lesson: 1,
    difficulty: "Easy",
    question: "Solve for x in the linear equation: 4x - 9 = 15",
    options: [
      "x = 6",
      "x = 4",
      "x = 8",
      "x = 5"
    ],
    correctAnswer: "x = 6",
    explanation: "Add 9 to both sides: 4x = 15 + 9 = 24. Then divide both sides by 4: x = 24 / 4 = 6."
  },
  {
    id: "math-2",
    subject: "Mathematics",
    category: "Mathematics",
    lesson: 1,
    difficulty: "Easy",
    question: "What is the area of a right-angled triangle with a base of 14 cm and a perpendicular height of 6 cm?",
    options: [
      "42 cm²",
      "84 cm²",
      "20 cm²",
      "48 cm²"
    ],
    correctAnswer: "42 cm²",
    explanation: "The area of a triangle is given by A = (1/2) × base × height. Substituting the given values: A = (1/2) × 14 × 6 = 7 × 6 = 42 cm²."
  },
  {
    id: "math-3",
    subject: "Mathematics",
    category: "Mathematics",
    lesson: 1,
    difficulty: "Easy",
    question: "A winter jacket originally priced at $80 is on sale with a 25% discount. What is the sale price?",
    options: [
      "$60",
      "$65",
      "$55",
      "$70"
    ],
    correctAnswer: "$60",
    explanation: "A 25% discount on $80 is 0.25 × 80 = $20. Subtracting the discount from the original price gives $80 - $20 = $60."
  },
  {
    id: "math-4",
    subject: "Mathematics",
    category: "Mathematics",
    lesson: 1,
    difficulty: "Medium",
    question: "What are the roots of the quadratic equation: x² - 8x + 15 = 0?",
    options: [
      "x = 3 and x = 5",
      "x = -3 and x = -5",
      "x = 2 and x = 6",
      "x = 1 and x = 15"
    ],
    correctAnswer: "x = 3 and x = 5",
    explanation: "Factoring the quadratic expression gives (x - 3)(x - 5) = 0. Setting each factor equal to zero yields the solutions x = 3 and x = 5."
  },

  // ==========================================================================
  // SUBJECT: Mathematics (Lesson 2: Quadratics, Probability & Logarithms)
  // ==========================================================================
  {
    id: "math-5",
    subject: "Mathematics",
    category: "Mathematics",
    lesson: 2,
    difficulty: "Medium",
    question: "In a right triangle, the two perpendicular legs measure 9 cm and 12 cm. What is the length of the hypotenuse?",
    options: [
      "15 cm",
      "18 cm",
      "21 cm",
      "13 cm"
    ],
    correctAnswer: "15 cm",
    explanation: "By the Pythagorean Theorem (c² = a² + b²): c² = 9² + 12² = 81 + 144 = 225. Taking the square root yields c = √225 = 15 cm."
  },
  {
    id: "math-6",
    subject: "Mathematics",
    category: "Mathematics",
    lesson: 2,
    difficulty: "Medium",
    question: "Simplify the algebraic expression: (3x²y³) × (4x⁴y²)",
    options: [
      "12x⁶y⁵",
      "7x⁶y⁵",
      "12x⁸y⁶",
      "12x²y⁶"
    ],
    correctAnswer: "12x⁶y⁵",
    explanation: "Multiply the numeric coefficients: 3 × 4 = 12. Add the exponents for matching variables: x^(2 + 4) = x⁶ and y^(3 + 2) = y⁵, giving 12x⁶y⁵."
  },
  {
    id: "math-7",
    subject: "Mathematics",
    category: "Mathematics",
    lesson: 2,
    difficulty: "Hard",
    question: "If two standard six-sided dice are rolled simultaneously, what is the probability that the sum of the two faces equals 9?",
    options: [
      "1/9",
      "1/6",
      "5/36",
      "1/12"
    ],
    correctAnswer: "1/9",
    explanation: "There are 6 × 6 = 36 total outcomes. The favorable pairs summing to 9 are (3,6), (4,5), (5,4), and (6,3), which is 4 outcomes. The probability is 4/36 = 1/9."
  },
  {
    id: "math-8",
    subject: "Mathematics",
    category: "Mathematics",
    lesson: 2,
    difficulty: "Hard",
    question: "How many distinct ways can a committee of 3 members be selected from a group of 8 candidates?",
    options: [
      "56",
      "336",
      "24",
      "112"
    ],
    correctAnswer: "56",
    explanation: "Since the order of selection does not matter, this is a combination: C(8, 3) = 8! / (3! × 5!) = (8 × 7 × 6) / (3 × 2 × 1) = 336 / 6 = 56."
  },
  {
    id: "math-9",
    subject: "Mathematics",
    category: "Mathematics",
    lesson: 2,
    difficulty: "Hard",
    question: "What is the value of x that satisfies the logarithmic equation: log₂(x) + log₂(x - 2) = 3?",
    options: [
      "x = 4",
      "x = 2",
      "x = -2",
      "x = 8"
    ],
    correctAnswer: "x = 4",
    explanation: "Using logarithm product rule: log₂(x(x - 2)) = 3. In exponential form: x(x - 2) = 2³ = 8, which rearranges to x² - 2x - 8 = 0. Factoring gives (x - 4)(x + 2) = 0. Because logarithmic arguments must be positive (x > 2), the only real solution is x = 4."
  },

  // ==========================================================================
  // SUBJECT: English (Lesson 1: Grammar, Syntax & Literary Devices)
  // ==========================================================================
  {
    id: "eng-1",
    subject: "English",
    category: "English",
    lesson: 1,
    difficulty: "Easy",
    question: "Which part of speech modifies a verb, an adjective, or another adverb by indicating manner, time, degree, or place?",
    options: [
      "Adverb",
      "Preposition",
      "Conjunction",
      "Pronoun"
    ],
    correctAnswer: "Adverb",
    explanation: "An adverb qualifies or provides additional descriptive context for verbs (e.g., 'ran quickly'), adjectives ('unusually quiet'), or other adverbs ('very slowly')."
  },
  {
    id: "eng-2",
    subject: "English",
    category: "English",
    lesson: 1,
    difficulty: "Easy",
    question: "Which of the following sentences demonstrates correct subject-verb agreement?",
    options: [
      "Each of the students has submitted their assignment.",
      "Each of the students have submitted their assignment.",
      "The flock of birds were flying south for the winter.",
      "Neither the teacher nor the students was present."
    ],
    correctAnswer: "Each of the students has submitted their assignment.",
    explanation: "The indefinite pronoun 'Each' is singular and requires the singular verb 'has'. In the other sentences: 'flock' is a collective noun taking 'was', and for 'neither/nor', the verb agrees with the closer subject ('students were')."
  },
  {
    id: "eng-3",
    subject: "English",
    category: "English",
    lesson: 1,
    difficulty: "Easy",
    question: "What is the closest synonym for the word 'abundant'?",
    options: [
      "Plentiful",
      "Scattered",
      "Deficient",
      "Fragile"
    ],
    correctAnswer: "Plentiful",
    explanation: "'Abundant' means existing or available in large, copious quantities. 'Plentiful' is its direct synonym, whereas 'deficient' is its antonym."
  },
  {
    id: "eng-4",
    subject: "English",
    category: "English",
    lesson: 1,
    difficulty: "Medium",
    question: "Which literary device involves an explicit comparison between two dissimilar things using connecting words such as 'like' or 'as'?",
    options: [
      "Simile",
      "Metaphor",
      "Personification",
      "Hyperbole"
    ],
    correctAnswer: "Simile",
    explanation: "A simile makes an explicit comparison between two unlike objects or ideas using words such as 'like' or 'as' (e.g., 'as bold as brass'), unlike a metaphor which states one thing is another."
  },
  {
    id: "eng-5",
    subject: "English",
    category: "English",
    lesson: 1,
    difficulty: "Medium",
    question: "What type of sentence structure consists of exactly one independent clause and at least one dependent (subordinate) clause?",
    options: [
      "Complex sentence",
      "Compound sentence",
      "Simple sentence",
      "Compound-complex sentence"
    ],
    correctAnswer: "Complex sentence",
    explanation: "A complex sentence combines one independent clause with one or more dependent clauses introduced by subordinating conjunctions (e.g., 'Although it was raining, we continued our walk.')."
  },
  {
    id: "eng-6",
    subject: "English",
    category: "English",
    lesson: 1,
    difficulty: "Medium",
    question: "Which of the following sentences is written in the passive voice?",
    options: [
      "The landmark study was published by the research team last October.",
      "The research team published the landmark study last October.",
      "Students actively reviewed the primary sources in class.",
      "The novelist crafted a gripping resolution to the mystery."
    ],
    correctAnswer: "The landmark study was published by the research team last October.",
    explanation: "In passive voice, the grammatical subject ('The landmark study') is the recipient of the action rather than the performer ('the research team'), formulated with a form of 'to be' plus a past participle."
  },
  {
    id: "eng-7",
    subject: "English",
    category: "English",
    lesson: 1,
    difficulty: "Hard",
    question: "Which rhetorical device is characterized by the deliberate repetition of a word or phrase at the beginning of successive sentences or clauses?",
    options: [
      "Anaphora",
      "Epistrophe",
      "Chiasmus",
      "Synecdoche"
    ],
    correctAnswer: "Anaphora",
    explanation: "Anaphora is the rhetorical repetition of words at the start of adjacent clauses for rhythmic or emotional emphasis (e.g., Martin Luther King Jr.'s 'I have a dream...' or Winston Churchill's 'We shall fight...')."
  },
  {
    id: "eng-8",
    subject: "English",
    category: "English",
    lesson: 1,
    difficulty: "Hard",
    question: "What is the precise meaning of the adjective 'ephemeral'?",
    options: [
      "Lasting for a very short, transient time",
      "Having profound spiritual or ethereal significance",
      "Permanently ingrained or impossible to erase",
      "Displaying aggressive or combative behavior"
    ],
    correctAnswer: "Lasting for a very short, transient time",
    explanation: "'Ephemeral' derives from the Greek 'ephēmeros' (lasting only a day) and describes phenomena, beauty, or states that are fleeting and transitory."
  },
  {
    id: "eng-9",
    subject: "English",
    category: "English",
    lesson: 1,
    difficulty: "Hard",
    question: "In George Orwell's classic dystopian novel '1984', what term designates the totalitarian artificial language engineered by the Party to restrict the range of human thought?",
    options: [
      "Newspeak",
      "Doublethink",
      "Thoughtcrime",
      "Ingsoc"
    ],
    correctAnswer: "Newspeak",
    explanation: "Newspeak is the controlled language devised by the state of Oceania in Orwell's '1984' to limit expressive thought, eliminate nuances, and make unorthodox political ideas ('thoughtcrime') literally impossible to articulate."
  },

  // ==========================================================================
  // SUBJECT: Science (Lesson 1: Earth, Climate & Ecology)
  // ==========================================================================
  {
    id: "sci-1",
    subject: "Science",
    category: "Science",
    lesson: 1,
    difficulty: "Easy",
    question: "What is the primary greenhouse gas released by human activities such as burning coal, oil, and natural gas?",
    options: [
      "Carbon dioxide (CO₂)",
      "Methane (CH₄)",
      "Nitrous oxide (N₂O)",
      "Ozone (O₃)"
    ],
    correctAnswer: "Carbon dioxide (CO₂)",
    explanation: "Carbon dioxide (CO₂) is the primary greenhouse gas emitted through human activities, accounting for about 76% of all global anthropogenic greenhouse gas emissions, mainly from burning fossil fuels."
  },
  {
    id: "sci-2",
    subject: "Science",
    category: "Science",
    lesson: 1,
    difficulty: "Easy",
    question: "Which layer of the atmosphere contains the protective ozone layer that filters out harmful solar ultraviolet (UV) radiation?",
    options: [
      "Stratosphere",
      "Troposphere",
      "Mesosphere",
      "Thermosphere"
    ],
    correctAnswer: "Stratosphere",
    explanation: "The stratosphere extends from roughly 10 km to 50 km above the Earth's surface and houses the ozone layer (O₃), which absorbs most of the Sun's harmful biological ultraviolet-B and ultraviolet-C radiation."
  },
  {
    id: "sci-3",
    subject: "Science",
    category: "Science",
    lesson: 1,
    difficulty: "Easy",
    question: "What renewable energy source harnesses the gravitational pull of the Moon and the Sun on Earth's oceans?",
    options: [
      "Tidal energy",
      "Geothermal energy",
      "Biomass energy",
      "Hydroelectric dam energy"
    ],
    correctAnswer: "Tidal energy",
    explanation: "Tidal power converts the kinetic and potential energy of ocean tides—driven primarily by gravitational interactions between Earth, the Moon, and the Sun—into clean electrical power."
  },
  {
    id: "sci-4",
    subject: "Science",
    category: "Science",
    lesson: 1,
    difficulty: "Medium",
    question: "What process in the hydrologic cycle describes the release of water vapor into the air from plant leaves?",
    options: [
      "Transpiration",
      "Sublimation",
      "Condensation",
      "Percolation"
    ],
    correctAnswer: "Transpiration",
    explanation: "Transpiration is the biological evaporation of water from plant leaves through microscopic pores called stomata, contributing significantly to atmospheric humidity and cloud formation."
  },
  {
    id: "sci-5",
    subject: "Science",
    category: "Science",
    lesson: 1,
    difficulty: "Medium",
    question: "Which term describes a species that has a disproportionately large impact on its natural environment relative to its abundance?",
    options: [
      "Keystone species",
      "Invasive species",
      "Pioneer species",
      "Indicator species"
    ],
    correctAnswer: "Keystone species",
    explanation: "A keystone species (such as sea otters in kelp forests or wolves in Yellowstone) plays a critical role in maintaining the structure and biodiversity of an ecological community."
  },
  {
    id: "sci-6",
    subject: "Science",
    category: "Science",
    lesson: 1,
    difficulty: "Hard",
    question: "What is the primary danger associated with thawing Arctic permafrost in relation to global atmospheric temperature rise?",
    options: [
      "Microbial decay of previously frozen organic matter releases vast reservoirs of trapped methane and carbon dioxide",
      "It causes global sea levels to instantly rise by over 50 meters due to subterranean ice collapse",
      "It alters the polarity of the Earth's geomagnetic field",
      "It cools the troposphere so abruptly that seasonal weather patterns permanently halt"
    ],
    correctAnswer: "Microbial decay of previously frozen organic matter releases vast reservoirs of trapped methane and carbon dioxide",
    explanation: "Arctic permafrost contains an estimated 1,400 to 1,600 gigatons of carbon—about twice the amount currently in the atmosphere. Thawing allows microbes to decompose ancient organic remains, liberating huge quantities of CO₂ and CH₄."
  },

  // ==========================================================================
  // SUBJECT: Physics (Lesson 1: Mechanics, Energy & Waves)
  // ==========================================================================
  {
    id: "phys-1",
    subject: "Physics",
    category: "Physics",
    lesson: 1,
    difficulty: "Easy",
    question: "According to Newton's Second Law of Motion, what is the mathematical formula relating force (F), mass (m), and acceleration (a)?",
    options: [
      "F = m × a",
      "F = m / a",
      "F = m + a",
      "F = 0.5 × m × a²"
    ],
    correctAnswer: "F = m × a",
    explanation: "Newton's Second Law states that the acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass: F = ma."
  },
  {
    id: "phys-2",
    subject: "Physics",
    category: "Physics",
    lesson: 1,
    difficulty: "Easy",
    question: "What is the approximate speed of light in a vacuum?",
    options: [
      "300,000 km/s (3 × 10⁸ m/s)",
      "150,000 km/s (1.5 × 10⁸ m/s)",
      "343 m/s",
      "1,000,000 km/s"
    ],
    correctAnswer: "300,000 km/s (3 × 10⁸ m/s)",
    explanation: "The speed of light in a vacuum is universally constant at approximately 299,792,458 meters per second (~3 × 10⁸ m/s), denoted by the constant 'c'."
  },
  {
    id: "phys-3",
    subject: "Physics",
    category: "Physics",
    lesson: 1,
    difficulty: "Medium",
    question: "What happens to the kinetic energy of a moving vehicle if its velocity is doubled while its mass remains constant?",
    options: [
      "It quadruples (increases by 4x)",
      "It doubles (increases by 2x)",
      "It remains identical",
      "It triples (increases by 3x)"
    ],
    correctAnswer: "It quadruples (increases by 4x)",
    explanation: "Kinetic energy is given by KE = (1/2)mv². Because velocity is squared, doubling the speed causes (2v)² = 4v², quadrupling the kinetic energy."
  },
  {
    id: "phys-4",
    subject: "Physics",
    category: "Physics",
    lesson: 1,
    difficulty: "Medium",
    question: "Which scientific principle explains why the top curved surface of an airplane wing experiences lower air pressure than the flat bottom surface?",
    options: [
      "Bernoulli's Principle",
      "Archimedes' Principle",
      "Pascal's Principle",
      "Hooke's Law"
    ],
    correctAnswer: "Bernoulli's Principle",
    explanation: "Bernoulli's Principle states that as the speed of a moving fluid (or air) increases, internal fluid pressure decreases simultaneously, creating aerodynamic lift."
  },
  {
    id: "phys-5",
    subject: "Physics",
    category: "Physics",
    lesson: 1,
    difficulty: "Hard",
    question: "According to Ohm's Law and Joule's Law, what is the electrical power (P) dissipated as heat across a resistor of resistance R carrying current I?",
    options: [
      "P = I² × R",
      "P = I / R",
      "P = I × R²",
      "P = I² / R"
    ],
    correctAnswer: "P = I² × R",
    explanation: "Electric power is P = V × I. Substituting Ohm's Law (V = I × R) yields Joule's law of heating: P = (I × R) × I = I²R."
  },
  {
    id: "phys-6",
    subject: "Physics",
    category: "Physics",
    lesson: 1,
    difficulty: "Hard",
    question: "Which fundamental law of thermodynamics asserts that the total entropy of an isolated physical system can never decrease over time?",
    options: [
      "The Second Law of Thermodynamics",
      "The First Law of Thermodynamics",
      "The Third Law of Thermodynamics",
      "The Zeroth Law of Thermodynamics"
    ],
    correctAnswer: "The Second Law of Thermodynamics",
    explanation: "The Second Law of Thermodynamics dictates that isolated systems naturally evolve towards thermodynamic equilibrium and maximum entropy (disorder)."
  },

  // ==========================================================================
  // SUBJECT: Chemistry (Lesson 1: Atoms, Bonds & Reactions)
  // ==========================================================================
  {
    id: "chem-1",
    subject: "Chemistry",
    category: "Chemistry",
    lesson: 1,
    difficulty: "Easy",
    question: "What is the chemical symbol for the element Gold in the Periodic Table?",
    options: [
      "Au",
      "Ag",
      "Fe",
      "Gd"
    ],
    correctAnswer: "Au",
    explanation: "The chemical symbol for Gold is Au, derived from the classical Latin word 'Aurum', meaning shining dawn or glow."
  },
  {
    id: "chem-2",
    subject: "Chemistry",
    category: "Chemistry",
    lesson: 1,
    difficulty: "Easy",
    question: "A chemical solution has a measured pH reading of 3.0. How is this solution categorized?",
    options: [
      "Acidic",
      "Neutral",
      "Alkaline (Basic)",
      "Saline"
    ],
    correctAnswer: "Acidic",
    explanation: "On the pH scale (0 to 14), readings lower than 7 indicate acidity, 7 represents neutral pure water, and values higher than 7 indicate alkalinity."
  },
  {
    id: "chem-3",
    subject: "Chemistry",
    category: "Chemistry",
    lesson: 1,
    difficulty: "Medium",
    question: "Which type of chemical bond forms when valence electrons are shared between two nonmetal atoms?",
    options: [
      "Covalent bond",
      "Ionic bond",
      "Metallic bond",
      "Hydrogen bond"
    ],
    correctAnswer: "Covalent bond",
    explanation: "A covalent bond consists of the mutual sharing of one or more electron pairs between two atoms, unlike ionic bonds which involve electron transfer."
  },
  {
    id: "chem-4",
    subject: "Chemistry",
    category: "Chemistry",
    lesson: 1,
    difficulty: "Medium",
    question: "What is Avogadro's constant, specifying the number of elementary entities in exactly one mole of substance?",
    options: [
      "6.022 × 10²³",
      "3.141 × 10²³",
      "1.602 × 10⁻¹⁹",
      "9.807 × 10⁸"
    ],
    correctAnswer: "6.022 × 10²³",
    explanation: "Avogadro's constant is approximately 6.02214076 × 10²³ mol⁻¹, providing the scale factor converting individual atomic masses into grams."
  },
  {
    id: "chem-5",
    subject: "Chemistry",
    category: "Chemistry",
    lesson: 1,
    difficulty: "Hard",
    question: "What term describes a chemical reaction that releases net thermal energy to its surroundings, typically resulting in a temperature increase?",
    options: [
      "Exothermic reaction",
      "Endothermic reaction",
      "Isothermal reaction",
      "Adiabatic reaction"
    ],
    correctAnswer: "Exothermic reaction",
    explanation: "In an exothermic reaction, the standard enthalpy change (ΔH) is negative because the bond formation energy in products exceeds the bond dissociation energy in reactants."
  },
  {
    id: "chem-6",
    subject: "Chemistry",
    category: "Chemistry",
    lesson: 1,
    difficulty: "Hard",
    question: "In oxidation-reduction (redox) chemistry, what process occurs when an atom, ion, or molecule loses one or more electrons?",
    options: [
      "Oxidation",
      "Reduction",
      "Precipitation",
      "Sublimation"
    ],
    correctAnswer: "Oxidation",
    explanation: "Oxidation corresponds to the loss of electrons (or an increase in oxidation state), remembered by the standard rule: Oxidation Is Loss (OIL), Reduction Is Gain (RIG)."
  },

  // ==========================================================================
  // SUBJECT: Biology (Lesson 1: Cell Biology, Enzymes & Genetics)
  // ==========================================================================
  {
    id: "bio-1",
    subject: "Biology",
    category: "Biology",
    lesson: 1,
    difficulty: "Easy",
    question: "Which organelle is universally referred to as the 'powerhouse of the cell' due to its generation of adenosine triphosphate (ATP)?",
    options: [
      "Mitochondria",
      "Ribosome",
      "Endoplasmic Reticulum",
      "Golgi Apparatus"
    ],
    correctAnswer: "Mitochondria",
    explanation: "Mitochondria are double-membrane cellular organelles that produce the vast majority of biochemical cellular energy (ATP) through aerobic cellular respiration."
  },
  {
    id: "bio-2",
    subject: "Biology",
    category: "Biology",
    lesson: 1,
    difficulty: "Easy",
    question: "What green photosynthetic pigment inside plant chloroplasts absorbs light to energize photosynthesis?",
    options: [
      "Chlorophyll",
      "Carotenoid",
      "Anthocyanin",
      "Hemoglobin"
    ],
    correctAnswer: "Chlorophyll",
    explanation: "Chlorophyll absorbs blue and red electromagnetic wavelengths from solar radiation while reflecting green light, transferring photon energy into chemical sugars."
  },
  {
    id: "bio-3",
    subject: "Biology",
    category: "Biology",
    lesson: 1,
    difficulty: "Medium",
    question: "Which biological model describes the cell membrane as a flexible phospholipid bilayer embedded with mobile transport proteins?",
    options: [
      "Fluid Mosaic Model",
      "Lock and Key Model",
      "Double Helix Model",
      "Central Dogma Model"
    ],
    correctAnswer: "Fluid Mosaic Model",
    explanation: "The Fluid Mosaic Model describes the plasma membrane structure as a fluid mosaic of phospholipids, cholesterol, and transport proteins that can move laterally."
  },
  {
    id: "bio-4",
    subject: "Biology",
    category: "Biology",
    lesson: 1,
    difficulty: "Medium",
    question: "What biological macromolecule functions as an organic catalyst to accelerate biochemical reactions without being consumed in the process?",
    options: [
      "Enzymes",
      "Phospholipids",
      "Polysaccharides",
      "Triglycerides"
    ],
    correctAnswer: "Enzymes",
    explanation: "Enzymes are specialized protein catalysts that accelerate metabolic reactions by orders of magnitude by drastically lowering their activation energy barrier."
  },
  {
    id: "bio-5",
    subject: "Biology",
    category: "Biology",
    lesson: 1,
    difficulty: "Hard",
    question: "In eukaryotic reproduction, which specialized cell division process produces four genetically diverse haploid gametes from a single diploid cell?",
    options: [
      "Meiosis",
      "Mitosis",
      "Binary Fission",
      "Budding"
    ],
    correctAnswer: "Meiosis",
    explanation: "Meiosis consists of two successive nuclear divisions (Meiosis I and II) that reduce chromosome ploidy from diploid (2n) to haploid (n), creating gametes with genetic recombination."
  },
  {
    id: "bio-6",
    subject: "Biology",
    category: "Biology",
    lesson: 1,
    difficulty: "Hard",
    question: "According to Chargaff's rules of DNA base pairing in double-stranded DNA molecules, which nucleotide base pairs specifically with Cytosine (C)?",
    options: [
      "Guanine (G)",
      "Adenine (A)",
      "Thymine (T)",
      "Uracil (U)"
    ],
    correctAnswer: "Guanine (G)",
    explanation: "In DNA, Cytosine (C) forms three hydrogen bonds with Guanine (G), while Adenine (A) forms two hydrogen bonds with Thymine (T)."
  },

  // ==========================================================================
  // SUBJECT: Computing (Lesson 1: Data Structures, Algorithms & Web Architecture)
  // ==========================================================================
  {
    id: "comp-1",
    subject: "Computing",
    category: "Computing",
    lesson: 1,
    difficulty: "Easy",
    question: "Which primitive data type is used in programming languages to represent logical values that can only be either true or false?",
    options: [
      "Boolean",
      "Integer",
      "String",
      "Array"
    ],
    correctAnswer: "Boolean",
    explanation: "A Boolean data type represents one of two possible truth values: true or false, named after mathematician George Boole who defined an algebraic system of logic."
  },
  {
    id: "comp-2",
    subject: "Computing",
    category: "Computing",
    lesson: 1,
    difficulty: "Easy",
    question: "In modern JavaScript (ES6+), which declaration keyword creates a block-scoped variable that cannot be reassigned?",
    options: [
      "const",
      "let",
      "var",
      "static"
    ],
    correctAnswer: "const",
    explanation: "The 'const' keyword declares a block-scoped identifier whose binding cannot be reassigned. Complex objects and arrays declared with const may still have their contents mutated."
  },
  {
    id: "comp-3",
    subject: "Computing",
    category: "Computing",
    lesson: 1,
    difficulty: "Easy",
    question: "Which fundamental data structure operates strictly on a Last-In, First-Out (LIFO) operational order?",
    options: [
      "Stack",
      "Queue",
      "Linked List",
      "Hash Map"
    ],
    correctAnswer: "Stack",
    explanation: "A Stack follows the LIFO principle: elements pushed last onto the top of the stack are the first ones removed (popped), analogous to a stack of trays."
  },
  {
    id: "comp-4",
    subject: "Computing",
    category: "Computing",
    lesson: 1,
    difficulty: "Medium",
    question: "What is the average time complexity for searching, insertion, and deletion in a balanced Binary Search Tree (such as an AVL or Red-Black Tree)?",
    options: [
      "O(log n)",
      "O(n)",
      "O(1)",
      "O(n log n)"
    ],
    correctAnswer: "O(log n)",
    explanation: "In a balanced BST with height h = log₂(n), each comparison discards roughly half of the remaining subtrees at each step, yielding an average time complexity of O(log n)."
  },
  {
    id: "comp-5",
    subject: "Computing",
    category: "Computing",
    lesson: 1,
    difficulty: "Medium",
    question: "Which core Object-Oriented Programming (OOP) pillar allows a derived class to acquire properties and methods from an existing base class?",
    options: [
      "Inheritance",
      "Encapsulation",
      "Polymorphism",
      "Abstraction"
    ],
    correctAnswer: "Inheritance",
    explanation: "Inheritance enables a subclass (child) to inherit fields, attributes, and behaviors from a superclass (parent), promoting clean code reuse and modularity."
  },
  {
    id: "comp-6",
    subject: "Computing",
    category: "Computing",
    lesson: 1,
    difficulty: "Hard",
    question: "In the JavaScript runtime architecture, what mechanism is responsible for checking if the Call Stack is empty and pushing queued callbacks from the Microtask and Task Queues into execution?",
    options: [
      "The Event Loop",
      "The Garbage Collector",
      "The JIT Compiler",
      "The Thread Pool"
    ],
    correctAnswer: "The Event Loop",
    explanation: "The Event Loop continuously inspects the Call Stack. When the Call Stack is clear of running execution contexts, it dequeues pending microtasks and macrotasks onto the stack for execution."
  },
  {
    id: "comp-7",
    subject: "Computing",
    category: "Computing",
    lesson: 1,
    difficulty: "Hard",
    question: "Which algorithmic design paradigm solves complex optimization problems by breaking them down into overlapping subproblems and caching previously computed results (via memoization or tabulation)?",
    options: [
      "Dynamic Programming",
      "Greedy Algorithm",
      "Divide and Conquer",
      "Backtracking"
    ],
    correctAnswer: "Dynamic Programming",
    explanation: "Dynamic Programming (DP) is applied to problems exhibiting optimal substructure and overlapping subproblems, avoiding exponential re-computations by storing answers to smaller subproblems in a lookup table."
  }
];

// Export for module systems or attach to window for direct script tags
if (typeof window !== "undefined") {
  window.QUESTION_BANK = QUESTION_BANK;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTION_BANK };
}
