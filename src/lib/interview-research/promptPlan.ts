type PlanInput = {
  companyName: string;
  roleTitle: string;
  interviewStage: string;
  location?: string;
  jobDescriptionText: string;
  interviewerNames?: string[];
  knownUrls?: string[];
};

/**
 * Returns the research-plan prompt (v2) as provided. We keep it pure/string-only
 * so it can be used by any provider (OpenAI/Perplexity/etc.).
 */
export function buildResearchPlanPrompt({
  companyName,
  roleTitle,
  interviewStage,
  location = "",
  jobDescriptionText,
  interviewerNames = [],
  knownUrls = [],
}: PlanInput) {
  return `RESEARCH PLAN PROMPT (v2)
You plan fast, evidence-backed pre-interview research with social listening.

Inputs
Company: ${companyName}
Role: ${roleTitle}
Stage: ${interviewStage}
Location: ${location}
JD text: ${jobDescriptionText}
Known interviewer names: ${interviewerNames.join(", ") || "None provided"}
Known URLs: ${knownUrls.join(", ") || "None provided"}

Output
Return ONLY valid JSON.

JSON shape
{
  "objective": "string",
  "searchQueries": [
    {"q": "string", "sourceType": "company_site|careers|case_study|press|news|reviews|glassdoor|reddit|blind|fishbowl|linkedin|podcast|video|job_history", "priority": "high|medium|low"}
  ],
  "sourceTargets": [
    {"sourceType": "company_site|careers|case_study|press|news|reviews|glassdoor|reddit|blind|fishbowl|linkedin|podcast|video|job_history|product_docs|community", "why": "string"}
  ],
  "fetchRules": {
    "recencyDays": number,
    "maxSources": number,
    "dedupe": true,
    "perTypeMinimum": {
      "company_site": number,
      "careers": number,
      "case_study": number,
      "press": number,
      "news": number,
      "reviews": number,
      "glassdoor": number,
      "reddit": number,
      "blind": number,
      "fishbowl": number,
      "linkedin": number,
      "job_history": number
    },
    "perTypeMaximum": {
      "company_site": number,
      "careers": number,
      "case_study": number,
      "press": number,
      "news": number,
      "reviews": number,
      "glassdoor": number,
      "reddit": number,
      "blind": number,
      "fishbowl": number,
      "linkedin": number,
      "job_history": number
    },
    "socialListeningSites": [string],
    "reject": [string]
  },
  "stopRules": [string]
}

Defaults to use unless overridden by product config
- fetchRules.recencyDays: 540
- fetchRules.maxSources: 28
- perTypeMinimum:
  - company_site: 4
  - careers: 2
  - case_study: 1
  - press: 1
  - news: 3
  - reviews: 3
  - glassdoor: 4
  - reddit: 6
  - blind: 1
  - fishbowl: 1
  - linkedin: 2
  - job_history: 1
- perTypeMaximum:
  - company_site: 6
  - careers: 3
  - case_study: 3
  - press: 3
  - news: 6
  - reviews: 6
  - glassdoor: 6
  - reddit: 10
  - blind: 3
  - fishbowl: 3
  - linkedin: 4
  - job_history: 3
- socialListeningSites: ["reddit.com","glassdoor.com","teamblind.com","fishbowlapp.com"]
- reject must include: login walls, paywalls, scraped spam, irrelevant directories, duplicated pages

Rules
- Generate 18 to 24 queries.
- At least 10 queries must be social listening or interview process related.
- Use site-locked queries when relevant:
  - site:reddit.com
  - site:glassdoor.com
  - site:teamblind.com
  - site:fishbowlapp.com
  - site:linkedin.com
- Include role-linked listening queries:
  - "${roleTitle} interview questions ${companyName}"
  - "${roleTitle} day to day ${companyName}"
- Include hiring signal queries:
  - "${companyName} careers"
  - "${companyName} open roles"
  - "${companyName} hiring process"
  - "${companyName} interview process"
- Include what-matters-now queries:
  - "${companyName} news"
  - "${companyName} announcement"
  - "${companyName} partnership"
  - "${companyName} funding"
  - "${companyName} expansion"
  - "${companyName} layoffs" OR "${companyName} restructuring"
- Include interviewer queries only when interviewerNames has values.
- stopRules must include:
  - Stop when perTypeMinimum is satisfied for at least 8 source types.
  - Stop when socialListening quotas met across at least 3 distinct sites.
  - No interviewer inference without explicit source.
`;
}
