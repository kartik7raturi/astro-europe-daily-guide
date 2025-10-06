// Numerology calculation utilities

export const calculateLifePathNumber = (dateOfBirth: Date): number => {
  const day = dateOfBirth.getDate();
  const month = dateOfBirth.getMonth() + 1;
  const year = dateOfBirth.getFullYear();

  const reduceToSingleDigit = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };

  const dayReduced = reduceToSingleDigit(day);
  const monthReduced = reduceToSingleDigit(month);
  const yearReduced = reduceToSingleDigit(year);

  const total = dayReduced + monthReduced + yearReduced;
  return reduceToSingleDigit(total);
};

export const calculateDestinyNumber = (fullName: string): number => {
  const letterValues: { [key: string]: number } = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };

  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;

  for (const letter of cleanName) {
    sum += letterValues[letter] || 0;
  }

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return sum;
};

export const calculateSoulUrgeNumber = (fullName: string): number => {
  const vowels = 'AEIOU';
  const letterValues: { [key: string]: number } = {
    'A': 1, 'E': 5, 'I': 9, 'O': 6, 'U': 3
  };

  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;

  for (const letter of cleanName) {
    if (vowels.includes(letter)) {
      sum += letterValues[letter] || 0;
    }
  }

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return sum;
};

export const calculatePersonalityNumber = (fullName: string): number => {
  const vowels = 'AEIOU';
  const letterValues: { [key: string]: number } = {
    'B': 2, 'C': 3, 'D': 4, 'F': 6, 'G': 7, 'H': 8,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7,
    'Q': 8, 'R': 9, 'S': 1, 'T': 2, 'V': 4, 'W': 5,
    'X': 6, 'Y': 7, 'Z': 8
  };

  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;

  for (const letter of cleanName) {
    if (!vowels.includes(letter)) {
      sum += letterValues[letter] || 0;
    }
  }

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return sum;
};

export const getLifePathMeaning = (number: number): { traits: string; challenges: string; solutions: string } => {
  const meanings: { [key: number]: { traits: string; challenges: string; solutions: string } } = {
    1: {
      traits: "Natural leader, independent, ambitious, innovative, and pioneering spirit",
      challenges: "Tendency towards aggression, impatience, and dominance. May struggle with being too self-centered",
      solutions: "Practice patience and teamwork. Balance independence with collaboration. Develop empathy and listening skills"
    },
    2: {
      traits: "Diplomatic, cooperative, sensitive, intuitive, and peacemaker",
      challenges: "Over-sensitivity, indecisiveness, and dependency on others. May avoid confrontation excessively",
      solutions: "Build self-confidence. Practice assertiveness. Trust your intuition while making independent decisions"
    },
    3: {
      traits: "Creative, expressive, optimistic, sociable, and artistic",
      challenges: "Scattered energy, superficiality, and difficulty with focus. May be prone to exaggeration",
      solutions: "Develop discipline and focus. Channel creativity into meaningful projects. Practice deeper communication"
    },
    4: {
      traits: "Practical, organized, reliable, hardworking, and systematic",
      challenges: "Rigidity, stubbornness, and resistance to change. May become overly cautious",
      solutions: "Embrace flexibility. Welcome new perspectives. Balance work with relaxation and spontaneity"
    },
    5: {
      traits: "Adventurous, versatile, freedom-loving, energetic, and adaptable",
      challenges: "Restlessness, impulsiveness, and lack of commitment. May struggle with routine",
      solutions: "Practice commitment and follow-through. Create healthy routines. Channel energy productively"
    },
    6: {
      traits: "Nurturing, responsible, caring, family-oriented, and harmonious",
      challenges: "Over-protectiveness, worry, and martyrdom. May neglect self-care",
      solutions: "Set healthy boundaries. Practice self-care. Allow others to take responsibility"
    },
    7: {
      traits: "Analytical, spiritual, introspective, wise, and truth-seeking",
      challenges: "Isolation, aloofness, and over-analyzing. May struggle with trust",
      solutions: "Balance solitude with social connection. Trust intuition alongside logic. Share wisdom with others"
    },
    8: {
      traits: "Ambitious, powerful, authoritative, material success, and business-minded",
      challenges: "Workaholism, materialism, and power struggles. May neglect spiritual/emotional needs",
      solutions: "Balance material and spiritual pursuits. Practice generosity. Develop emotional intelligence"
    },
    9: {
      traits: "Humanitarian, compassionate, idealistic, generous, and wise",
      challenges: "Self-sacrifice, difficulty letting go, and emotional drainage. May be too idealistic",
      solutions: "Set boundaries in helping others. Practice self-compassion. Accept imperfections in self and world"
    },
    11: {
      traits: "Intuitive, inspirational, spiritual teacher, visionary, and enlightened",
      challenges: "Nervous tension, impracticality, and feeling misunderstood. May struggle with high expectations",
      solutions: "Ground spiritual insights in practical action. Manage stress through meditation. Accept your unique path"
    },
    22: {
      traits: "Master builder, visionary leader, practical idealist, and transformational",
      challenges: "Overwhelming responsibilities, burnout, and high pressure. May feel burdened by potential",
      solutions: "Break large goals into manageable steps. Delegate when needed. Maintain realistic expectations"
    },
    33: {
      traits: "Master teacher, spiritual guide, universal love, and healing presence",
      challenges: "Taking on too much, emotional overwhelm, and difficulty saying no. May neglect personal needs",
      solutions: "Practice self-care and boundaries. Focus energy on sustainable service. Honor personal limitations"
    }
  };

  return meanings[number] || meanings[1];
};

export const getCareerGuidance = (lifePathNumber: number, destinyNumber: number): string => {
  const careerPaths: { [key: number]: string } = {
    1: "Leadership roles, entrepreneurship, innovation, management, or pioneering new fields",
    2: "Diplomacy, counseling, partnerships, mediation, teaching, or social work",
    3: "Creative arts, writing, entertainment, communication, marketing, or design",
    4: "Engineering, accounting, construction, organization, project management, or technical fields",
    5: "Travel, sales, marketing, journalism, public relations, or any field requiring adaptability",
    6: "Healthcare, teaching, counseling, hospitality, interior design, or community service",
    7: "Research, analysis, technology, spirituality, psychology, or scientific fields",
    8: "Business, finance, real estate, executive roles, law, or corporate leadership",
    9: "Humanitarian work, arts, healing professions, teaching, or charitable organizations",
    11: "Spiritual teaching, inspiration, counseling, psychology, or metaphysical fields",
    22: "Large-scale projects, architecture, international business, or transformative leadership",
    33: "Education, healing arts, spiritual guidance, or humanitarian leadership"
  };

  return `Primary Path: ${careerPaths[lifePathNumber] || careerPaths[1]}\nSecondary Path: ${careerPaths[destinyNumber] || careerPaths[1]}`;
};

export const getDailyNumerologyGuidance = (lifePathNumber: number): { guidance: string; luckyNumbers: number[]; challenges: string; solutions: string } => {
  const day = new Date().getDate();
  const personalDay = (lifePathNumber + day) % 9 || 9;

  const guidances: { [key: number]: { guidance: string; challenges: string; solutions: string } } = {
    1: {
      guidance: "Today favors new beginnings and taking initiative. Your leadership qualities shine. Start that project you've been planning.",
      challenges: "Impatience and tendency to rush decisions. Conflicts with authority figures possible.",
      solutions: "Take deep breaths before important decisions. Listen to others' input. Channel ambition constructively."
    },
    2: {
      guidance: "Focus on cooperation and partnerships today. Your diplomatic skills are highlighted. Collaboration brings success.",
      challenges: "Oversensitivity to criticism. Difficulty making decisions alone. Emotional vulnerability.",
      solutions: "Trust your intuition. Practice self-validation. Remember that not all criticism is personal."
    },
    3: {
      guidance: "Creative expression is favored. Share your ideas and communicate freely. Social connections bring opportunities.",
      challenges: "Scattered energy and difficulty focusing. Tendency to overcommit or exaggerate.",
      solutions: "Prioritize top 3 tasks. Stay grounded in truth. Channel creativity into one meaningful project."
    },
    4: {
      guidance: "Focus on practical matters and organization. Hard work pays off today. Build solid foundations.",
      challenges: "Rigidity and resistance to unexpected changes. Workaholic tendencies.",
      solutions: "Stay flexible. Take regular breaks. Welcome constructive change as growth opportunity."
    },
    5: {
      guidance: "Embrace change and new experiences. Your adaptability is an asset. Freedom and variety bring joy.",
      challenges: "Restlessness and impulsive decisions. Difficulty with commitment or routine.",
      solutions: "Think before acting on impulses. Honor existing commitments. Find freedom within structure."
    },
    6: {
      guidance: "Focus on relationships and responsibilities. Nurturing others brings fulfillment. Home and family matters highlighted.",
      challenges: "Overextending yourself for others. Neglecting personal needs and boundaries.",
      solutions: "Practice saying no when needed. Schedule self-care time. Remember you can't pour from empty cup."
    },
    7: {
      guidance: "Introspection and spiritual pursuits favored. Trust your intuition. Seek deeper understanding.",
      challenges: "Isolation or withdrawal from others. Overthinking and analysis paralysis.",
      solutions: "Balance alone time with connection. Trust inner wisdom over endless analysis. Share insights with trusted others."
    },
    8: {
      guidance: "Focus on material and professional goals. Your business acumen is strong. Financial opportunities may arise.",
      challenges: "Workaholism and neglecting personal relationships. Power struggles possible.",
      solutions: "Balance work with personal life. Lead with integrity. Remember success includes relationships and health."
    },
    9: {
      guidance: "Humanitarian efforts and completion of cycles. Let go of what no longer serves. Compassion opens doors.",
      challenges: "Difficulty letting go of past. Emotional overwhelm from others' problems.",
      solutions: "Practice healthy detachment. Honor endings as necessary for new beginnings. Focus self-compassion alongside compassion for others."
    }
  };

  const luckyNumbers = [
    lifePathNumber,
    personalDay,
    (lifePathNumber + personalDay) % 9 || 9,
    (lifePathNumber * 2) % 9 || 9,
    (lifePathNumber + 5) % 9 || 9
  ];

  return {
    ...guidances[personalDay],
    luckyNumbers
  };
};
