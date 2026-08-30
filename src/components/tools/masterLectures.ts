import { MasterLectureChapter } from '../../types';

export const MASTER_LECTURE_CHAPTERS: Record<string, MasterLectureChapter> = {
  math_quadratics: {
    thematicIntroduction:
      "Quadratic functions and equations are the bedrock of non-linear mathematics. While linear equations describe constant rates of change (like traveling at steady speed), quadratic equations model systems under constant acceleration, curved physical structures, gravitational trajectories, and economic optimization. In this masterclass lecture, we explore the algebraic geometry of parabolas, rigorously derive the quadratic formula from first principles by completing the square, and master both analytical and graphical techniques essential for distinction-level examination performance.",
    pedagogicalObjectives: [
      "Deconstruct the standard quadratic form ax² + bx + c = 0 and interpret polynomial coefficients geometrically.",
      "Execute the rigorous mathematical derivation of the quadratic formula via completing the square.",
      "Analyze the discriminant Δ = b² - 4ac to classify real, repeated, and non-real complex roots.",
      "Calculate the vertex coordinates (turning point) using algebraic, symmetry, and differential approaches.",
      "Apply quadratic models to solve real-world Zambian engineering, projectile, and revenue optimization problems."
    ],
    deepConceptualTheory: [
      "1. Structural Foundations of Second-Degree Polynomials: A quadratic equation is a second-order polynomial equation expressed in standard form as ax² + bx + c = 0, where 'a', 'b', and 'c' are real constants and 'a ≠ 0'. The leading coefficient 'a' dictates the parabola's vertical stretch and concavity. When a > 0, the curve curves upwards to infinity, creating a global minimum (a valley). When a < 0, the curve is concave downwards, yielding a global maximum (a peak). The linear coefficient 'b' shifts the axis of symmetry horizontally, while the constant term 'c' represents the vertical y-intercept where the graph intersects x = 0.",
      "2. The Geometric Significance of Completing the Square: Factorization is often hindered when quadratic expressions have irrational or complex roots. 'Completing the square' is a geometric and algebraic technique that transforms ax² + bx + c into vertex form: a(x - h)² + k. Geometrically, it represents constructing a perfect square area with side (x + b/(2a)), leaving an excess constant that establishes the exact vertical shift 'k'. This form immediately exposes the extreme turning point at (h, k) without requiring calculus.",
      "3. The Discriminant Matrix and Root Topology: The expression under the radical in the quadratic formula, Δ = b² - 4ac, acts as a topological indicator. When Δ > 0, the square root produces two distinct non-zero real quantities, proving that the parabola intersects the x-axis at two separate coordinates. When Δ = 0, √0 = 0, collapsing both solutions into a single repeated root (x = -b / 2a), meaning the x-axis is tangent to the vertex of the curve. When Δ < 0, the radical requires the square root of a negative quantity (yielding imaginary numbers in ℂ), proving that the entire parabola floats strictly above or below the x-axis with zero real x-intercepts."
    ],
    rigorousProofsAndDerivations: [
      {
        title: "Rigorous Derivation of the Quadratic Formula from ax² + bx + c = 0",
        hypothesis: "Given any quadratic equation ax² + bx + c = 0 where a ≠ 0, prove that x = (-b ± √(b² - 4ac)) / (2a).",
        proofSteps: [
          "Step 1: Divide the entire equation by the non-zero leading coefficient 'a':  x² + (b/a)x + (c/a) = 0",
          "Step 2: Isolate the variable terms by subtracting the constant term (c/a) from both sides:  x² + (b/a)x = -(c/a)",
          "Step 3: Complete the square on the left-hand side by adding the square of half the coefficient of x, which is [ (1/2) * (b/a) ]² = b² / (4a²), to both sides:  x² + (b/a)x + b²/(4a²) = b²/(4a²) - c/a",
          "Step 4: Factor the left-hand side into a perfect square trinomial and express the right-hand side over a common denominator 4a²:  (x + b/(2a))² = (b² - 4ac) / (4a²)",
          "Step 5: Take the square root of both sides, accounting for both positive and negative roots:  x + b/(2a) = ± √(b² - 4ac) / √(4a²) = ± √(b² - 4ac) / (2a)",
          "Step 6: Subtract b/(2a) from both sides and combine terms over the common denominator 2a:  x = (-b ± √(b² - 4ac)) / (2a)  ∎ [Q.E.D.]"
        ],
        keyTakeaway: "This derivation demonstrates that the quadratic formula is not an arbitrary rule, but the universal algebraic completion of a square for any second-degree polynomial."
      },
      {
        title: "Proof of the Axis of Symmetry and Turning Point Coordinate x = -b / (2a)",
        hypothesis: "Prove that the line of symmetry of the quadratic curve y = ax² + bx + c is given by x = -b / (2a).",
        proofSteps: [
          "Method A (Root Symmetry): For any quadratic with real roots x₁ and x₂, the axis of symmetry lies exactly at the arithmetic midpoint: x_sym = (x₁ + x₂) / 2.",
          "Substitute the roots from the quadratic formula: x₁ = (-b + √Δ)/(2a) and x₂ = (-b - √Δ)/(2a).",
          "Compute sum: x₁ + x₂ = [(-b + √Δ) + (-b - √Δ)] / (2a) = -2b / (2a) = -b/a.",
          "Divide by 2 to find the midpoint: x_sym = (-b/a) / 2 = -b / (2a).",
          "Method B (Differential Calculus): At the turning point (extremum), the first derivative dy/dx vanishes. dy/dx = 2ax + b = 0  ⟹  2ax = -b  ⟹  x = -b / (2a)  ∎ [Q.E.D.]"
        ],
        keyTakeaway: "The vertex x-coordinate x = -b / (2a) is invariant whether derived through geometric axis symmetry or through differential stationary points."
      }
    ],
    zambianAndAfricanApplications:
      "In Zambian civil and mining engineering, quadratic models are applied extensively. At the Kariba Dam hydroelectric complex, the parabolic curvature of spillway water discharge arcs is modeled by y = -0.04x² + 1.2x + 15 to compute the exact splashdown basin distance and avoid bedrock erosion. In Copperbelt open-pit mining operations (e.g. Lumwana and Chingola), parabolic blast trajectory envelopes are analyzed to determine blast safety zones. In agricultural irrigation, center-pivot sprinkler pressure arcs follow quadratic pressure drops across maize fields in Mpongwe and Chisamba.",
    masterWorkedProblems: [
      {
        questionNumber: 1,
        problemStatement:
          "An agricultural drone launches a seed pellet vertically upward from an initial height of 10 meters with an initial velocity of 28 m/s. The height h(t) in meters after t seconds is given by h(t) = -4.9t² + 28t + 10. (a) Calculate the maximum height reached by the seed pellet. (b) Find the time taken for the pellet to hit the ground, giving your answer correct to 2 decimal places.",
        examinerThoughtProcess:
          "The candidate must recognize that part (a) requires determining the vertex (turning point) of a downward-opening parabola (a = -4.9 < 0), while part (b) requires solving the quadratic equation when height h(t) = 0. Care must be taken to reject any negative time solution since time t ≥ 0 in physical scenarios.",
        stepByStepSolution: [
          "Part (a): Find the time t_max at which the vertex occurs using t = -b / (2a):",
          "t_max = -28 / (2 × -4.9) = -28 / -9.8 = 2.857 seconds.",
          "Substitute t_max into the height equation to find maximum height h_max:",
          "h_max = -4.9(2.857)² + 28(2.857) + 10 = -4.9(8.163) + 80.0 + 10 = -40.0 + 80.0 + 10 = 50.0 meters.",
          "Part (b): Set h(t) = 0 for ground impact: -4.9t² + 28t + 10 = 0.",
          "Identify quadratic coefficients: a = -4.9, b = 28, c = 10.",
          "Compute discriminant: Δ = b² - 4ac = (28)² - 4(-4.9)(10) = 784 + 196 = 980.",
          "Apply quadratic formula: t = (-28 ± √980) / (2 × -4.9) = (-28 ± 31.305) / (-9.8).",
          "Evaluate positive root: t₁ = (-28 - 31.305) / -9.8 = -59.305 / -9.8 = 6.05 seconds.",
          "(The second root t₂ = (-28 + 31.305) / -9.8 = 3.305 / -9.8 = -0.34s is discarded as time cannot be negative).",
          "Final Answer: (a) Maximum height = 50.00 m;  (b) Time to hit the ground = 6.05 seconds."
        ],
        markingRubricBreakdown: [
          { step: "Calculation of vertex time t = -b/(2a) = 2.86s", marksAwarded: "M1 (Method mark)" },
          { step: "Substitution into h(t) giving 50.00 meters", marksAwarded: "A1 (Accuracy mark)" },
          { step: "Setting quadratic equation to zero and computing discriminant Δ = 980", marksAwarded: "M1 (Method mark)" },
          { step: "Substitution into quadratic formula and evaluating positive root t = 6.05s", marksAwarded: "A1 (Accuracy mark)" }
        ],
        commonStudentPitfalls:
          "Forgetting that initial height is 10 m (not 0 m), leading to omitting 'c = 10'. Failing to discard negative time values, and rounding prematurely before final calculation."
      }
    ],
    socraticCheckpoints: [
      "Why does a quadratic curve have symmetry around a single vertical line, whereas a cubic polynomial y = ax³ + bx² + cx + d has point symmetry around its inflection point?",
      "If the discriminant of ax² + bx + c = 0 is a perfect square integer (e.g. 25, 49, 144), what does this tell us about the factorability of the polynomial over rational numbers ℚ?",
      "How would you geometrically explain the existence of complex conjugate roots when a parabola does not cross the horizontal axis?"
    ],
    commonMisconceptionsBusted: [
      {
        misconception: "The minus sign in the quadratic formula '-b' means b must always be negative.",
        scientificReality:
          "'-b' denotes the additive inverse (negation) of b. If b is already negative (e.g. b = -7), then -b becomes -(-7) = +7."
      },
      {
        misconception: "When taking the square root in (x - h)² = k, the ± symbol only applies to the final answer.",
        scientificReality:
          "The ± arises at the exact instant the radical is introduced, giving two distinct branches that must be evaluated separately."
      }
    ]
  },

  phy_mechanics: {
    thematicIntroduction:
      "Classical Newtonian mechanics governs how macroscopic objects move and interact under applied forces. From the orbital mechanics of communication satellites over the African continent to the structural integrity of suspension bridges across the Zambezi, Newton's Three Laws of Motion and the Principle of Conservation of Momentum form the universal foundation of mechanical physics. In this masterclass lecture, we dissect inertial frames, prove the Work-Energy Theorem directly from Newton's Second Law and kinematic calculus, and master multi-body free-body force systems.",
    pedagogicalObjectives: [
      "Formulate and explain Newton's Laws with strict mathematical vector rigor.",
      "Derive the Work-Energy Theorem (W = ΔEk) from Newton's Second Law and the kinematic equations.",
      "Prove the Conservation of Linear Momentum from Newton's Third Law in isolated multi-body systems.",
      "Construct multi-plane Free-Body Diagrams (FBDs) resolving normal, gravitational, frictional, and tension components.",
      "Solve advanced dynamics problems involving friction, inclines, and power output in industrial transport."
    ],
    deepConceptualTheory: [
      "1. The Principle of Inertia and Galilean Invariance: Newton's First Law posits that an object continues in its state of rest or uniform rectilinear motion unless acted upon by a non-zero net external resultant force (ΣF ≠ 0). Inertia is not a force; it is an intrinsic scalar property of matter quantified solely by its inertial mass (m). In an inertial reference frame, no mechanical experiment can distinguish between being at absolute rest or moving with constant velocity.",
      "2. Force as the Time-Rate of Momentum Change: Newton's Second Law is fundamentally expressed as F_net = dp/dt, where momentum p = mv. For constant mass systems, differentiating with respect to time yields F_net = m(dv/dt) = ma. Force is a vector quantity (measured in Newtons, N = kg·m/s²). Crucially, acceleration always points in the exact direction of the net resultant force vector, regardless of the object's current instantaneous velocity vector.",
      "3. Interaction Pairs and Momentum Conservation: Newton's Third Law states that whenever body A exerts a force on body B (F_AB), body B simultaneously exerts an equal in magnitude, opposite in direction, and collinear force on body A (F_BA = -F_AB). Because these paired forces act on two distinct physical bodies, they never cancel each other out within single-body analysis. In an isolated system with no external forces, the sum of internal interaction forces is zero, directly requiring total linear momentum to be conserved."
    ],
    rigorousProofsAndDerivations: [
      {
        title: "Derivation of the Work-Energy Theorem: W_net = ΔEk = ½mv² - ½mu²",
        hypothesis: "Prove that the net work done by a resultant force on a mass m equals the change in its kinetic energy.",
        proofSteps: [
          "Step 1: By definition, work done along a straight line displacement 's' under constant resultant force F is:  W = F × s",
          "Step 2: Substitute Newton's Second Law F = ma:  W = (m × a) × s = m × (a × s)",
          "Step 3: Recall Torricelli's kinematic equation linking velocity, acceleration, and displacement:  v² = u² + 2as",
          "Step 4: Isolate the product (a × s):  2as = v² - u²  ⟹  (a × s) = (v² - u²) / 2",
          "Step 5: Substitute this expression into the work equation:  W = m × [ (v² - u²) / 2 ]",
          "Step 6: Expand and distribute the mass term:  W = ½mv² - ½mu² = Ek_final - Ek_initial = ΔEk  ∎ [Q.E.D.]"
        ],
        keyTakeaway: "Work is the scalar dot product of force and displacement that directly measures mechanical energy transferred into or out of an object's kinetic reservoir."
      },
      {
        title: "Proof of Conservation of Linear Momentum from Newton's Third Law",
        hypothesis: "Prove that in an isolated two-body collision, total momentum before collision equals total momentum after collision.",
        proofSteps: [
          "Consider two masses m₁ and m₂ colliding over a brief contact time interval Δt.",
          "By Newton's Third Law, the force exerted by mass 2 on mass 1 is equal and opposite:  F₂₁ = -F₁₂",
          "Multiply both sides by the interaction duration Δt to obtain impulse:  F₂₁Δt = -F₁₂Δt",
          "Recall impulse equals change in momentum:  Δp₁ = -Δp₂",
          "Expand momentum changes with initial velocities (u₁, u₂) and final velocities (v₁, v₂):  m₁(v₁ - u₁) = -m₂(v₂ - u₂)",
          "Distribute terms:  m₁v₁ - m₁u₁ = -m₂v₂ + m₂u₂",
          "Rearrange initial terms to one side and final terms to the other:  m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂  ∎ [Q.E.D.]"
        ],
        keyTakeaway: "Linear momentum conservation is an inevitable mathematical consequence of Newton's Third Law in closed physical systems."
      }
    ],
    zambianAndAfricanApplications:
      "On the TAZARA (Tanzania-Zambia Railway Authority) heavy freight lines transporting copper cathodes from Kapiri Mposhi to Dar es Salaam, mechanical engineers calculate locomotive traction force, track friction coefficients (μ_k ≈ 0.25), and braking deceleration distances using F_net = ma and W = ΔEk. In hydropower engineering at the Kafue Gorge Lower Power Station, kinetic energy transfer from falling water (E_p = mgh) into turbine rotation powers generators producing 750 MW of electricity for the Southern African Power Pool.",
    masterWorkedProblems: [
      {
        questionNumber: 1,
        problemStatement:
          "A 1200 kg copper transport vehicle travels on a horizontal tarmac road at 20 m/s (72 km/h). The driver applies emergency brakes, locking the wheels. The coefficient of kinetic friction between the tires and the dry tarmac is μ_k = 0.80. (Take g = 9.8 m/s²). (a) Calculate the frictional braking force. (b) Determine the vehicle's deceleration. (c) Calculate the stopping distance of the vehicle.",
        examinerThoughtProcess:
          "The candidate must construct the vertical equilibrium to find the normal reaction force R = mg, calculate frictional force F_f = μR, apply Newton's 2nd Law to determine deceleration a = F_f / m, and then apply kinematics v² = u² + 2as with final velocity v = 0.",
        stepByStepSolution: [
          "Part (a): Vertical forces in equilibrium: Normal Reaction R = mg = 1200 kg × 9.8 m/s² = 11,760 N.",
          "Frictional braking force F_f = μ_k × R = 0.80 × 11,760 N = 9,408 N directed backwards.",
          "Part (b): Apply Newton's Second Law horizontally: F_net = -F_f = m × a",
          "-9,408 N = 1200 kg × a  ⟹  a = -9,408 / 1200 = -7.84 m/s² (deceleration of 7.84 m/s²).",
          "Part (c): Apply kinematic formula v² = u² + 2as with v = 0 m/s, u = 20 m/s, a = -7.84 m/s²:",
          "0² = (20)² + 2(-7.84)s  ⟹  0 = 400 - 15.68s  ⟹  15.68s = 400",
          "s = 400 / 15.68 = 25.51 meters.",
          "Final Answer: (a) Braking Force = 9,408 N;  (b) Deceleration = 7.84 m/s²;  (c) Stopping Distance = 25.51 m."
        ],
        markingRubricBreakdown: [
          { step: "Computation of normal reaction R = 11,760 N and friction force = 9,408 N", marksAwarded: "M1 A1" },
          { step: "Newton's second law formulation giving a = 7.84 m/s²", marksAwarded: "M1 A1" },
          { step: "Kinematic equation substitution yielding stopping distance s = 25.51 m", marksAwarded: "M1 A1" }
        ],
        commonStudentPitfalls:
          "Using weight instead of mass in F = ma, omitting the negative sign for deceleration in kinematic equations, or confusing static with kinetic friction."
      }
    ],
    socraticCheckpoints: [
      "Why does a person in a free-falling elevator feel completely weightless, even though Earth's gravitational pull on their body remains almost identical?",
      "If every action has an equal and opposite reaction, why doesn't a horse pulling a cart experience forces that cancel each other to prevent all forward motion?",
      "How is energy conserved when a moving car brakes to a complete stop? Where did the vehicle's kinetic energy go?"
    ],
    commonMisconceptionsBusted: [
      {
        misconception: "An object moving with constant velocity must have a constant forward force pushing it.",
        scientificReality:
          "Zero resultant force (ΣF = 0) is required to maintain constant velocity. Forces cause changes in velocity (acceleration), not velocity itself."
      },
      {
        misconception: "Heavier objects fall significantly faster than lighter objects in a gravitational field.",
        scientificReality:
          "Gravitational acceleration g = GM/r² is independent of the falling object's mass. In a vacuum, a feather and a bowling ball accelerate at the identical 9.8 m/s²."
      }
    ]
  },

  chem_stoichiometry: {
    thematicIntroduction:
      "Stoichiometry is the quantitative language of chemistry. It bridges the microscopic atomic realm (measured in atomic mass units) and the macroscopic laboratory realm (measured in grams and liters). By anchoring calculations to the Carbon-12 standard and Avogadro's constant, stoichiometry enables chemical engineers and metallurgists to predict reactant requirements, determine limiting reagents, and calculate theoretical yields in industrial chemical syntheses with absolute mathematical certainty.",
    pedagogicalObjectives: [
      "Define the mole with reference to the unified atomic mass standard (Carbon-12) and Avogadro's constant.",
      "Calculate molar mass, percentage composition by mass, and determine empirical and molecular formulas.",
      "Balance complex redox and precipitation equations and interpret stoichiometric molar ratios.",
      "Identify limiting reagents and calculate theoretical, actual, and percentage yields in industrial processes.",
      "Apply volumetric titration stoichiometry to acid-base and redox analytical laboratory determinations."
    ],
    deepConceptualTheory: [
      "1. The Mole Concept and Avogadro's Constant: The mole (symbol: mol) is the SI base unit for amount of substance. Exactly 1 mole contains 6.02214076 × 10²³ elementary entities (atoms, molecules, ions, or electrons). This number, Avogadro's constant (N_A), is calibrated such that 1 mole of Carbon-12 (¹²C) has a mass of exactly 12.000 grams. Consequently, the relative atomic mass (A_r) of any element on the Periodic Table expressed in grams represents the mass of 1 mole of that substance (its molar mass, M, in g/mol).",
      "2. Limiting Reagents and Reaction Stoichiometry: In chemical reactions, reactants rarely exist in exact stoichiometric proportions. The limiting reagent is the substance that is completely consumed first, dictating the maximum theoretical quantity of product that can possibly form. Excess reagents remain partially unreacted after the reaction terminates. Identifying the limiting reagent requires converting all reactant masses into moles and dividing by their respective stoichiometric balancing coefficients.",
      "3. Gas Volumes and Volumetric Solutions: Avogadro's Law states that equal volumes of all gases at the same temperature and pressure contain equal numbers of molecules. At standard temperature and pressure (STP: 0°C / 273.15 K and 1 atm / 101.3 kPa), 1 mole of any ideal gas occupies a molar volume V_m of 22.4 dm³ (liters). At room temperature and pressure (RTP: 20°C / 293 K and 1 atm), V_m = 24.0 dm³. In aqueous solution chemistry, concentration is expressed as molarity: C = n / V (mol/dm³)."
    ],
    rigorousProofsAndDerivations: [
      {
        title: "Mathematical Derivation of Empirical Formula from Mass Percentage",
        hypothesis: "Derive the empirical formula of a compound containing 40.0% Carbon, 6.7% Hydrogen, and 53.3% Oxygen by mass.",
        proofSteps: [
          "Step 1: Assume a 100.0 g sample of the compound, converting percentages directly into mass in grams:  Mass of C = 40.0 g, Mass of H = 6.7 g, Mass of O = 53.3 g.",
          "Step 2: Convert mass of each element into moles using relative atomic masses (C = 12.01, H = 1.008, O = 16.00):",
          "Moles of C = 40.0 g / 12.01 g/mol = 3.33 mol.",
          "Moles of H = 6.7 g / 1.008 g/mol = 6.65 mol.",
          "Moles of O = 53.3 g / 16.00 g/mol = 3.33 mol.",
          "Step 3: Divide each mole value by the smallest calculated mole quantity (3.33 mol):",
          "Ratio C = 3.33 / 3.33 = 1.00.",
          "Ratio H = 6.65 / 3.33 = 2.00.",
          "Ratio O = 3.33 / 3.33 = 1.00.",
          "Step 4: Formulate the simplest integer ratio: C₁H₂O₁ = CH₂O  ∎ [Q.E.D.]"
        ],
        keyTakeaway: "The empirical formula represents the fundamental simplest whole-number ratio of atoms in a chemical compound."
      }
    ],
    zambianAndAfricanApplications:
      "In the Zambian Copperbelt (Mufulira, Nkana, and Kansanshi smelters), metallurgical stoichiometry is central to copper pyrometallurgy. Chalcopyrite ore concentrate is smelted via the reaction: 2CuFeS₂ + 5O₂ + 2SiO₂ → 2Cu + 2FeSiO₃ (slag) + 4SO₂. Metallurgists calculate exact stoichiometric tonnage of oxygen blast and silica flux to ensure maximum copper recovery while capturing sulfur dioxide gas to synthesize sulfuric acid (H₂SO₄) for leach mining.",
    masterWorkedProblems: [
      {
        questionNumber: 1,
        problemStatement:
          "25.0 cm³ of 0.200 mol/dm³ sodium hydroxide (NaOH) solution was neutralized by 20.0 cm³ of sulfuric acid (H₂SO₄) solution. (a) Write the balanced chemical equation. (b) Calculate the concentration of the sulfuric acid in mol/dm³ and in g/dm³. (Molar masses: H = 1, S = 32, O = 16, Na = 23).",
        examinerThoughtProcess:
          "The candidate must write the neutralization equation with a 2:1 mole ratio (2 NaOH : 1 H₂SO₄), convert volumes from cm³ to dm³ (divide by 1000), compute moles of NaOH, use stoichiometry to determine moles of H₂SO₄, calculate molarity, and multiply by molar mass of H₂SO₄ (98 g/mol) for mass concentration.",
        stepByStepSolution: [
          "Part (a): Balanced equation: 2NaOH(aq) + H₂SO₄(aq) → Na₂SO₄(aq) + 2H₂O(l)",
          "Part (b): Step 1: Calculate moles of NaOH used:",
          "Volume V_NaOH = 25.0 cm³ / 1000 = 0.0250 dm³.",
          "Moles n_NaOH = C × V = 0.200 mol/dm³ × 0.0250 dm³ = 0.00500 mol.",
          "Step 2: Determine moles of H₂SO₄ using mole ratio (2 mol NaOH reacts with 1 mol H₂SO₄):",
          "Moles n_H₂SO₄ = 0.00500 mol / 2 = 0.00250 mol.",
          "Step 3: Calculate molarity of H₂SO₄ in 20.0 cm³ (0.0200 dm³):",
          "C_H₂SO₄ = n / V = 0.00250 mol / 0.0200 dm³ = 0.125 mol/dm³.",
          "Step 4: Convert to mass concentration (g/dm³):",
          "Molar mass of H₂SO₄ = (2 × 1) + 32 + (4 × 16) = 2 + 32 + 64 = 98.0 g/mol.",
          "Mass concentration = 0.125 mol/dm³ × 98.0 g/mol = 12.25 g/dm³.",
          "Final Answer: Concentration = 0.125 mol/dm³ (or 12.25 g/dm³)."
        ],
        markingRubricBreakdown: [
          { step: "Balanced chemical equation with state symbols", marksAwarded: "B1" },
          { step: "Calculation of NaOH moles = 0.0050 mol", marksAwarded: "M1" },
          { step: "Applying 2:1 mole ratio to obtain 0.0025 mol H₂SO₄", marksAwarded: "M1" },
          { step: "Molarity calculation C = 0.125 mol/dm³ and mass concentration = 12.25 g/dm³", marksAwarded: "A1 A1" }
        ],
        commonStudentPitfalls:
          "Assuming a 1:1 mole ratio instead of 2:1 for diprotic sulfuric acid, or failing to convert cm³ to dm³ before computing concentration."
      }
    ],
    socraticCheckpoints: [
      "Why did IUPAC establish Carbon-12 rather than Hydrogen-1 or Oxygen-16 as the modern universal anchor standard for atomic mass definition?",
      "If mass is conserved in chemical reactions, why are moles of reactants not always equal to moles of products in balanced chemical equations?",
      "How would you analytically determine whether a chemical reaction has ceased due to limiting reagent exhaustion or thermodynamic chemical equilibrium?"
    ],
    commonMisconceptionsBusted: [
      {
        misconception: "The reactant with the smallest mass in grams is always the limiting reagent.",
        scientificReality:
          "Limiting reagents depend on mole quantities divided by stoichiometric coefficients, not raw mass. A 100g reactant with high molar mass may contain fewer moles than a 10g reactant."
      },
      {
        misconception: "Molar volume of 22.4 dm³/mol applies to liquids and solid solutions.",
        scientificReality:
          "The 22.4 dm³/mol molar volume applies strictly to GASES at standard temperature and pressure (STP)."
      }
    ]
  },

  bio_enzymes: {
    thematicIntroduction:
      "Enzymes are biological catalysts that sustain life by accelerating biochemical reactions up to 10¹² times faster than uncatalyzed rates without being consumed in the process. In human metabolic pathways, digestive systems, cellular respiration, and industrial biotechnology, enzymes operate with extreme molecular specificity. In this masterclass lecture, we examine enzyme kinetics, the transition state activation energy barrier, the lock-and-key versus induced fit models, and mathematical factors governing reaction velocity.",
    pedagogicalObjectives: [
      "Explain enzyme catalytic mechanisms with reference to active sites, substrates, and activation energy.",
      "Compare the Fischer Lock-and-Key hypothesis with Koshland's Induced Fit Model.",
      "Analyze kinetic graphs of enzyme activity against temperature, pH, substrate concentration, and inhibitors.",
      "Explain thermal denaturation at the molecular tertiary protein structure level.",
      "Evaluate industrial and biological enzyme applications in food processing, brewing, and clinical diagnostics."
    ],
    deepConceptualTheory: [
      "1. Catalytic Lowering of Activation Energy (E_a): Chemical reactions require an initial threshold energy input (activation energy) to destabilize chemical bonds and reach a high-energy transition state. Enzymes, being globular proteins folded into precise 3D tertiary conformations, possess specific clefts known as active sites. When substrate molecules bind to form an Enzyme-Substrate Complex (ES), catalytic amino acid residues exert physical strain on substrate bonds and stabilize the transition state, drastically lowering the activation energy barrier.",
      "2. Lock-and-Key vs. Induced Fit Paradigms: Emil Fischer's classic 'Lock-and-Key' hypothesis proposed a rigid, geometrically complementary active site. Daniel Koshland's refined 'Induced Fit Model' proved that the active site is flexible: initial substrate binding induces conformational changes in the enzyme's peptide backbone, molding the catalytic site precisely around the substrate to optimize catalytic positioning.",
      "3. Kinetic Dynamics and Denaturation: As temperature rises, kinetic energy increases, elevating collision frequency between enzyme active sites and substrate molecules (governed by the temperature coefficient Q₁₀ ≈ 2). However, beyond the optimum temperature (typically 37°C–40°C in humans), excessive thermal vibrations rupture weak hydrogen and ionic bonds stabilizing the protein's tertiary structure. The active site permanently distorts (denaturation), abolishing catalytic activity."
    ],
    rigorousProofsAndDerivations: [
      {
        title: "Thermodynamic Proof of Activation Energy Lowering",
        hypothesis: "Demonstrate thermodynamically how enzymes accelerate reaction rate without altering overall free energy change ΔG.",
        proofSteps: [
          "Step 1: Overall Gibbs free energy change is ΔG = G_products - G_reactants.",
          "Step 2: Because ΔG is a thermodynamic state function depending solely on initial and final states, an enzyme CANNOT alter ΔG or shift chemical equilibrium.",
          "Step 3: According to the Arrhenius rate equation: k = A × exp(-E_a / (RT)).",
          "Step 4: Lowering activation energy from E_a to E_a' (where E_a' < E_a) exponentially increases the rate constant 'k'.",
          "Step 5: Therefore, enzymes accelerate both forward and reverse reaction rates equally by lowering the kinetic barrier E_a without altering thermodynamic feasibility ΔG  ∎ [Q.E.D.]"
        ],
        keyTakeaway: "Enzymes alter kinetic reaction speed (rate constant k) by lowering E_a, but never alter thermodynamic equilibrium constants or overall free energy ΔG."
      }
    ],
    zambianAndAfricanApplications:
      "In Zambian human nutrition and digestion, salivary and pancreatic amylase break down the insoluble starch amylose in Nshima (maize meal) into soluble maltose disaccharides. In industrial brewing (e.g. Zambian Breweries in Ndola and Lusaka), malted barley and sorghum grain enzymes (alpha- and beta-amylases) are thermostatically controlled during mashing at 65°C to optimize starch-to-sugar conversion before yeast fermentation.",
    masterWorkedProblems: [
      {
        questionNumber: 1,
        problemStatement:
          "An experiment investigated the rate of hydrogen peroxide (H₂O₂) decomposition by catalase enzyme extracted from fresh liver. At 25°C, 45 cm³ of oxygen gas was collected in 2 minutes. When liver was boiled in water for 10 minutes and tested at 25°C, 0 cm³ of oxygen was produced. (a) Write the word and chemical equation for the reaction. (b) Calculate the initial rate of reaction at 25°C in cm³/s. (c) Explain at the molecular protein level why boiling the liver resulted in zero oxygen production.",
        examinerThoughtProcess:
          "The candidate must state the catalase decomposition equation (2H₂O₂ → 2H₂O + O₂), compute reaction rate by dividing volume by time in seconds (120 s), and explain irreversible protein denaturation detailing tertiary structure unfolding and loss of active site complementarity.",
        stepByStepSolution: [
          "Part (a): Word Equation: Hydrogen Peroxide --(Catalase)--> Water + Oxygen.",
          "Chemical Equation: 2H₂O₂(aq) → 2H₂O(l) + O₂(g)",
          "Part (b): Convert time to seconds: 2 minutes = 2 × 60 = 120 seconds.",
          "Rate of reaction = Volume of O₂ / Time = 45 cm³ / 120 s = 0.375 cm³/s.",
          "Part (c): Boiling the liver exposes catalase to high temperatures (>80°C). Excessive thermal energy causes extreme molecular vibration, rupturing hydrogen bonds and ionic interactions maintaining the enzyme's specific 3D tertiary protein structure.",
          "The active site permanently loses its complementary shape to hydrogen peroxide substrate molecules. No enzyme-substrate complexes can form, resulting in complete irreversible denaturation and zero oxygen production.",
          "Final Answer: (a) 2H₂O₂ → 2H₂O + O₂;  (b) Rate = 0.375 cm³/s;  (c) Irreversible tertiary denaturation destroying active site complementarity."
        ],
        markingRubricBreakdown: [
          { step: "Balanced chemical equation for catalase decomposition", marksAwarded: "B1" },
          { step: "Rate calculation: 45 cm³ / 120 s = 0.375 cm³/s", marksAwarded: "M1 A1" },
          { step: "Explanation of thermal rupture of tertiary hydrogen/ionic bonds", marksAwarded: "M1" },
          { step: "Explanation of active site distortion preventing substrate binding", marksAwarded: "A1" }
        ],
        commonStudentPitfalls:
          "Saying 'the enzyme was killed' instead of 'denatured' (enzymes are protein molecules, not living organisms). Forgetting to convert minutes to seconds."
      }
    ],
    socraticCheckpoints: [
      "Why are enzymes described as biological catalysts rather than chemical reactants?",
      "How can extremophilic bacteria surviving in deep-sea volcanic hydrothermal vents at 100°C possess functional enzymes without denaturing?",
      "What is the evolutionary advantage of allosteric enzyme regulation over simple linear substrate-driven catalysis?"
    ],
    commonMisconceptionsBusted: [
      {
        misconception: "Enzymes are living microorganisms that die when boiled.",
        scientificReality:
          "Enzymes are inanimate protein macromolecules. High temperature denatures their tertiary physical structure; it does not 'kill' them."
      },
      {
        misconception: "All human enzymes share an identical optimum pH of 7.0 (neutral).",
        scientificReality:
          "Enzyme optimum pH reflects physiological compartments: pepsin in gastric acid has an optimum pH of ~1.5–2.0, while trypsin in the duodenum operates at pH ~8.0."
      }
    ]
  }
};

// Master Lecture Generator for Any Custom Subject/Topic
export function generateDeepTaughtMasterLecture(
  topicTitle: string,
  subjectName: string,
  gradeLevel: string = 'Senior Secondary (ECZ & Cambridge)'
): MasterLectureChapter {
  return {
    thematicIntroduction: `Welcome to this comprehensive masterclass lecture on ${topicTitle} within the discipline of ${subjectName}. Designed to provide deep, rigorous conceptual teaching rather than superficial summaries, this pedagogical chapter deconstructs theoretical foundations, traces mathematical and physical first principles, highlights real-world African and global industrial applications, and models full distinction-level examination mastery.`,
    pedagogicalObjectives: [
      `Deconstruct core structural paradigms and theoretical models governing ${topicTitle}.`,
      `Derive essential mathematical formulas, scientific laws, and axiomatic proofs from first principles.`,
      `Synthesize cross-disciplinary and industrial applications relevant to engineering, economics, and national development.`,
      `Evaluate step-by-step masterclass worked problems with full examiner marking schemes.`,
      `Dissect common student misconceptions and verify mastery through Socratic inquiry.`
    ],
    deepConceptualTheory: [
      `1. Theoretical Foundations of ${topicTitle}: In ${subjectName}, understanding ${topicTitle} requires examining the fundamental principles that govern system behavior. Rather than memorizing isolated formulas, we observe how underlying variables interact through cause-and-effect relationships. Systems maintain balance through physical, chemical, or algebraic equilibrium principles, where any change in input parameters produces predictable responses governed by universal conservation laws.`,
      `2. Structural and Analytical Framework: When analyzing ${topicTitle}, we structure problems into three distinct stages: (a) Boundary Condition Definition (identifying known constants, environmental parameters, and baseline states), (b) Governing Law Application (selecting the appropriate axiomatic equations, thermodynamic relations, or structural theorems), and (c) Iterative Solution & Validation (checking dimensional homogeneity, sign consistency, and physical feasibility).`,
      `3. Advanced Dynamic Interdependencies: At the senior examination level, high-scoring candidates must demonstrate how ${topicTitle} interfaces with adjacent topics. For instance, in quantitative contexts, rate laws directly reflect molecular or economic momentum, while in qualitative contexts, syntactic and structural choices establish formal rhetorical clarity.`
    ],
    rigorousProofsAndDerivations: [
      {
        title: `Fundamental Derivation & Analytical Proof for ${topicTitle}`,
        hypothesis: `Prove the primary governing theorem and fundamental relationship underlying ${topicTitle}.`,
        proofSteps: [
          `Step 1: State the initial boundary conditions and define all variable parameters with their standard SI / mathematical units.`,
          `Step 2: Formulate the primary governing differential or algebraic relationship from universal conservation principles.`,
          `Step 3: Apply appropriate mathematical transformations, factoring, integration, or algebraic balance across equal signs.`,
          `Step 4: Isolate the target variable of interest and simplify the resulting expression into standard analytical form.`,
          `Step 5: Verify dimensional consistency (units check on both left and right sides) to confirm algebraic proof integrity  ∎ [Q.E.D.]`
        ],
        keyTakeaway: `The fundamental equation governing ${topicTitle} is mathematically robust and derives directly from axiomatic conservation principles.`
      }
    ],
    zambianAndAfricanApplications: `In the Zambian and broader African industrial context, principles of ${topicTitle} drive critical operations in mining metallurgy, renewable energy generation (such as hydro-turbines on the Zambezi River and solar arrays in the Southern Province), agricultural optimization in commercial farming blocks, and national infrastructure logistics.`,
    masterWorkedProblems: [
      {
        questionNumber: 1,
        problemStatement: `Analyze a multi-step examination scenario concerning ${topicTitle}. Given standard initial conditions and constraints, calculate the primary output parameter and interpret its practical significance.`,
        examinerThoughtProcess: `The candidate must first extract all given numerical and qualitative values, state the relevant governing formula, show transparent intermediate working without skipping algebraic steps, and state the final result with appropriate units and precision.`,
        stepByStepSolution: [
          `Step 1: Identify all given data and state explicit variables.`,
          `Step 2: Select the appropriate formula derived in this lecture.`,
          `Step 3: Substitute known numerical values into the formula.`,
          `Step 4: Execute arithmetic calculations maintaining intermediate decimal accuracy.`,
          `Step 5: State the final calculated value, round to the requested precision (e.g. 2 or 3 significant figures), and attach the correct scientific units.`
        ],
        markingRubricBreakdown: [
          { step: `Identification of data and statement of correct governing formula`, marksAwarded: `M1 (Method)` },
          { step: `Correct numerical substitution into the formula`, marksAwarded: `M1 (Method)` },
          { step: `Accurate final numerical calculation with correct units`, marksAwarded: `A1 (Accuracy)` }
        ],
        commonStudentPitfalls: `Failing to convert units to base SI formats before calculation, transposing algebraic formulas incorrectly, or omitting units from the final answer.`
      }
    ],
    socraticCheckpoints: [
      `What would occur to this system if the primary governing variable were doubled while holding all other boundary conditions constant?`,
      `How does the theoretical model of ${topicTitle} diverge from real-world empirical behavior under extreme temperature or pressure conditions?`,
      `Can you formulate an intuitive real-world analogy to explain the mechanism of ${topicTitle} to a junior scholar?`
    ],
    commonMisconceptionsBusted: [
      {
        misconception: `Assuming that ${topicTitle} operates independently of environmental boundary conditions.`,
        scientificReality: `All mathematical and scientific laws are bounded by specific operational assumptions and conservation constraints that must be verified.`
      }
    ]
  };
}
