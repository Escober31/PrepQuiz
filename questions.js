/**
 * Question Bank for Student Online Quiz Practice Portal
 * Categorized by topic and difficulty level (Easy, Medium, Hard).
 * Each question includes:
 *  - id: unique identifier
 *  - category: topic name
 *  - difficulty: "Easy" | "Medium" | "Hard"
 *  - question: question text
 *  - options: array of 4 choices
 *  - correctAnswer: string matching the correct choice
 *  - explanation: detailed scientific explanation for learning
 */

const QUESTION_BANK = [
  // --------------------------------------------------------------------------
  // CATEGORY: Understanding Global Warming: A Quiz (Sample Featured Quiz)
  // --------------------------------------------------------------------------
  {
    id: "gw-1",
    category: "Understanding Global Warming: A Quiz",
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
    id: "gw-2",
    category: "Understanding Global Warming: A Quiz",
    difficulty: "Easy",
    question: "What is the 'Greenhouse Effect' in the context of Earth's atmosphere?",
    options: [
      "The trapping of heat radiated from Earth by atmospheric gases, keeping the planet warmer than it would otherwise be",
      "The cooling of Earth's crust due to reflection of solar radiation by clouds",
      "The physical barrier formed by buildings and glass structures in urban areas",
      "The seasonal variation in sunlight due to the tilt of Earth's rotational axis"
    ],
    correctAnswer: "The trapping of heat radiated from Earth by atmospheric gases, keeping the planet warmer than it would otherwise be",
    explanation: "Naturally, greenhouse gases absorb infrared thermal energy radiated by Earth's surface and re-radiate it in all directions, warming the lower atmosphere. Human activities have artificially amplified this natural effect."
  },
  {
    id: "gw-3",
    category: "Understanding Global Warming: A Quiz",
    difficulty: "Easy",
    question: "Which of the following is considered a major natural 'carbon sink' that absorbs large quantities of atmospheric carbon dioxide?",
    options: [
      "Oceans and vast forest ecosystems",
      "Deserts and sand dunes",
      "Atmospheric ozone layer",
      "Active volcanic vents"
    ],
    correctAnswer: "Oceans and vast forest ecosystems",
    explanation: "Oceans absorb roughly 25-30% of anthropogenic CO₂ emissions, while terrestrial ecosystems like forests and peatlands absorb another substantial portion through photosynthesis and organic matter storage."
  },
  {
    id: "gw-4",
    category: "Understanding Global Warming: A Quiz",
    difficulty: "Medium",
    question: "How does the melting of polar sea ice create a dangerous 'positive feedback loop' accelerating climate warming?",
    options: [
      "Dark ocean water absorbs more solar heat than reflective white ice, lowering the albedo and causing further melting",
      "Melting ice releases massive amounts of dissolved helium into the upper troposphere",
      "Cold water from melted glaciers stops planetary rotation speed",
      "Melting ice directly increases the distance between Earth and the Sun"
    ],
    correctAnswer: "Dark ocean water absorbs more solar heat than reflective white ice, lowering the albedo and causing further melting",
    explanation: "This is known as the ice-albedo feedback. Ice reflects up to 80-90% of incoming solar radiation (high albedo). When it melts, darker open water (albedo ~6-10%) absorbs thermal energy, warming the ocean and causing even faster ice melting."
  },
  {
    id: "gw-5",
    category: "Understanding Global Warming: A Quiz",
    difficulty: "Medium",
    question: "Why is Methane (CH₄) considered a potent greenhouse gas even though it exists in much smaller atmospheric concentrations than CO₂?",
    options: [
      "It has a Global Warming Potential (GWP) roughly 28 to 36 times higher than CO₂ over a 100-year timescale",
      "It permanently destroys atmospheric nitrogen molecules upon release",
      "It remains in the atmosphere for tens of thousands of years without breaking down",
      "It blocks incoming ultraviolet light, causing terrestrial overheating"
    ],
    correctAnswer: "It has a Global Warming Potential (GWP) roughly 28 to 36 times higher than CO₂ over a 100-year timescale",
    explanation: "While methane has a shorter atmospheric lifetime (~12 years) compared to CO₂, it is significantly more effective at trapping infrared thermal radiation, making its warming impact over 80 times stronger than CO₂ over a 20-year span and ~28-36 times over 100 years."
  },
  {
    id: "gw-6",
    category: "Understanding Global Warming: A Quiz",
    difficulty: "Medium",
    question: "What phenomenon occurs when excessive atmospheric CO₂ dissolves into the world's oceans, threatening shellfish and coral reefs?",
    options: [
      "Ocean acidification",
      "Ocean desalinization",
      "Thermal expansion",
      "Eutrophication"
    ],
    correctAnswer: "Ocean acidification",
    explanation: "When CO₂ dissolves in seawater, it reacts with water to form carbonic acid (H₂CO₃), which lowers ocean pH and reduces available carbonate ions necessary for corals, oysters, and mollusks to build their shells and skeletons."
  },
  {
    id: "gw-7",
    category: "Understanding Global Warming: A Quiz",
    difficulty: "Hard",
    question: "Under the landmark 2015 Paris Agreement, nations agreed to pursue efforts to limit the increase in global average temperature to what threshold above pre-industrial levels?",
    options: [
      "Well below 2.0°C, with concerted efforts toward 1.5°C",
      "Exactly 3.0°C above baseline temperatures",
      "Stabilization at 0.5°C below pre-industrial levels",
      "No more than 4.5°C increase by 2100"
    ],
    correctAnswer: "Well below 2.0°C, with concerted efforts toward 1.5°C",
    explanation: "Article 2 of the Paris Agreement commits signatories to holding the global average temperature increase to well below 2°C above pre-industrial levels and to pursue efforts to limit the increase to 1.5°C to avoid irreversible ecological tipping points."
  },
  {
    id: "gw-8",
    category: "Understanding Global Warming: A Quiz",
    difficulty: "Hard",
    question: "What is the primary danger associated with thawing Arctic permafrost in relation to global atmospheric temperature rise?",
    options: [
      "Microbial decay of previously frozen organic matter releases vast reservoirs of trapped methane and carbon dioxide",
      "It causes global sea levels to instantly rise by over 50 meters due to subterranean ice collapse",
      "It alters the polarity of the Earth's geomagnetic field",
      "It cools the troposphere so abruptly that seasonal weather patterns permanently halt"
    ],
    correctAnswer: "Microbial decay of previously frozen organic matter releases vast reservoirs of trapped methane and carbon dioxide",
    explanation: "Arctic permafrost contains an estimated 1,400 to 1,600 gigatons of carbon—about twice the amount currently in the atmosphere. Thawing allows microbes to decompose ancient organic plant and animal remains, liberating huge quantities of CO₂ and CH₄."
  },

  // --------------------------------------------------------------------------
  // CATEGORY: Earth & Environmental Science
  // --------------------------------------------------------------------------
  {
    id: "es-1",
    category: "Earth & Environmental Science",
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
    id: "es-2",
    category: "Earth & Environmental Science",
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
    id: "es-3",
    category: "Earth & Environmental Science",
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
    id: "es-4",
    category: "Earth & Environmental Science",
    difficulty: "Medium",
    question: "Which term describes a species that has a disproportionately large impact on its natural environment relative to its abundance?",
    options: [
      "Keystone species",
      "Invasive species",
      "Pioneer species",
      "Indicator species"
    ],
    correctAnswer: "Keystone species",
    explanation: "A keystone species (such as sea otters in kelp forests or wolves in Yellowstone) plays a critical role in maintaining the structure and biodiversity of an ecological community. Without them, the ecosystem changes drastically or collapses."
  },
  {
    id: "es-5",
    category: "Earth & Environmental Science",
    difficulty: "Hard",
    question: "What term describes the boundary between the unsaturated zone (vadose zone) and the saturated zone beneath Earth's surface?",
    options: [
      "Water table",
      "Aquiclude",
      "Capillary fringe",
      "Artesian boundary"
    ],
    correctAnswer: "Water table",
    explanation: "The water table is the subterranean boundary where water pressure equals atmospheric pressure, separating the unsaturated upper soil zone from the saturated aquifer zone below."
  },

  // --------------------------------------------------------------------------
  // CATEGORY: Mathematics
  // --------------------------------------------------------------------------
  {
    id: "math-1",
    category: "Mathematics",
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
    category: "Mathematics",
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
    category: "Mathematics",
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
    category: "Mathematics",
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
  {
    id: "math-5",
    category: "Mathematics",
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
    category: "Mathematics",
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
    category: "Mathematics",
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
    category: "Mathematics",
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
    category: "Mathematics",
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
  }
];

// Export for module systems or attach to window for direct script tags
if (typeof window !== "undefined") {
  window.QUESTION_BANK = QUESTION_BANK;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTION_BANK };
}
