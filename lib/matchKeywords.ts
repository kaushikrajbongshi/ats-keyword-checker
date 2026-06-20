// Core matching logic for the ATS Keyword Match Checker.
// Everything here runs client-side — no server, no storage, no tracking.

const STOPWORDS = new Set([
  "a","about","above","after","again","against","all","am","an","and","any","are","as","at",
  "be","because","been","before","being","below","between","both","but","by",
  "can","could",
  "did","do","does","doing","down","during",
  "each","etc",
  "few","for","from","further",
  "had","has","have","having","he","her","here","hers","herself","him","himself","his","how",
  "i","if","in","into","is","it","its","itself",
  "just",
  "me","more","most","my","myself",
  "no","nor","not","now",
  "of","off","on","once","only","or","other","our","ours","ourselves","out","over","own",
  "same","she","should","so","some","such",
  "than","that","the","their","theirs","them","themselves","then","there","these","they","this",
  "those","through","to","too",
  "under","until","up",
  "very",
  "was","we","were","what","when","where","which","while","who","whom","why","will","with",
  "would",
  "you","your","yours","yourself","yourselves",
  "role","work","team","company","years","year","experience","experiences","including",
  "etc","strong","ability","abilities","using","use","used","new","also","within","across",
  "job","candidate","candidates","looking","required","requirements","preferred","plus",
  "ideal","please","apply","applicant","applicants",
]);

// A curated dictionary of common resume / job-description skill terms,
// spanning tech and non-tech roles. Multi-word phrases are matched first
// so "rest api" is treated as one keyword, not two.
const SKILL_DICTIONARY = [
  "javascript","typescript","python","java","react","react native","next.js","node.js",
  "express","express.js","nestjs","django","flask","spring boot","sql","mysql","postgresql",
  "mongodb","redis","graphql","rest api","restful api","aws","azure","gcp","docker",
  "kubernetes","ci/cd","git","github","gitlab","bitbucket","html","css","tailwind","bootstrap",
  "sass","webpack","vite","jest","cypress","unit testing","testing","debugging","linux","bash",
  "c++","c#","php","ruby","swift","kotlin","flutter","redux","prisma","firebase","supabase",
  "microservices","api integration","agile","scrum","kanban","jira","confluence","figma",
  "ui/ux","ui design","ux design","wireframing","prototyping","devops","data structures",
  "algorithms","machine learning","deep learning","data analysis","data science","excel",
  "power bi","tableau","powerpoint","word","google sheets","salesforce","hubspot","seo",
  "sem","content writing","copywriting","email marketing","social media marketing",
  "digital marketing","google analytics","crm","customer service","customer support",
  "negotiation","sales","lead generation","project management","product management",
  "stakeholder management","budget management","time management","problem solving",
  "critical thinking","communication","leadership","teamwork","collaboration","mentoring",
  "presentation skills","analytical skills","attention to detail","adaptability",
  "research","reporting","forecasting","accounting","bookkeeping","financial analysis",
  "supply chain","logistics","inventory management","recruiting","onboarding","payroll",
  "training","quality assurance","quality control","manufacturing","procurement",
];

export interface MatchResult {
  score: number;
  matched: string[];
  missing: string[];
  totalKeywords: number;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s+#./-]/g, " ");
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsPhrase(haystack: string, phrase: string): boolean {
  const pattern = new RegExp(`(?<![a-z0-9])${escapeRegex(phrase)}(?![a-z0-9])`, "i");
  return pattern.test(haystack);
}

/**
 * Extracts the most relevant keywords from a job description, then checks
 * which of those keywords also show up in the resume text.
 */
export function matchKeywords(jobDescription: string, resumeText: string): MatchResult {
  const jdNorm = normalize(jobDescription);
  const resumeNorm = normalize(resumeText);

  const found = new Set<string>();

  // 1. Dictionary phrases present in the job description (highest-confidence keywords).
  for (const phrase of SKILL_DICTIONARY) {
    if (containsPhrase(jdNorm, phrase)) {
      found.add(phrase);
    }
  }

  // 2. Frequent, non-stopword single words from the JD that aren't already captured,
  //    to catch domain-specific terms the dictionary doesn't know about.
  const words = jdNorm.split(/\s+/).filter((w) => w.length >= 4 && !STOPWORDS.has(w));
  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  const extraCandidates = Array.from(freq.entries())
    .filter(([w, count]) => count >= 2 && !found.has(w))
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);

  const keywords = [...found, ...extraCandidates].slice(0, 28);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of keywords) {
    if (containsPhrase(resumeNorm, kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const totalKeywords = keywords.length;
  const score = totalKeywords === 0 ? 0 : Math.round((matched.length / totalKeywords) * 100);

  return { score, matched, missing, totalKeywords };
}
