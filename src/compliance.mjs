const restrictedTerms = [
  "cbd", "cannabis", "hemp", "thc", "marijuana",
  "gambling", "casino", "lottery", "betting",
  "exploit", "malware", "phishing", "weapon",
  "洗钱", "博彩", "赌博", "大麻", "外挂", "钓鱼", "木马", "武器"
];

const cautionTerms = [
  "medical", "legal advice", "financial advice", "investment",
  "医疗", "法律意见", "投资", "理财", "贷款"
];

export function complianceCheck(text) {
  const normalized = String(text || "").toLowerCase();
  const restricted = restrictedTerms.filter((term) => normalized.includes(term.toLowerCase()));
  const caution = cautionTerms.filter((term) => normalized.includes(term.toLowerCase()));
  return {
    allowed: restricted.length === 0,
    restricted,
    caution,
    requiresHumanReview: restricted.length > 0 || caution.length > 0,
    policy: restricted.length
      ? "blocked-restricted-request"
      : caution.length
        ? "human-review-required"
        : "standard-business-workflow",
  };
}
