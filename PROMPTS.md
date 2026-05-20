# CostPilot — LLM Prompts

## AI Summary Prompt

This is the prompt used to generate the ~100-word personalized summary paragraph on the audit results page. We use the **Gemini API** for this.

### System Prompt

```
You are a friendly, knowledgeable AI infrastructure cost advisor. You write clear, concise summaries that help engineering leaders understand their AI tool spending.

Your tone is: professional but approachable, data-driven, honest (never manufacture savings), and slightly encouraging.

Rules:
- Keep the summary to exactly 80-120 words
- Lead with the most impactful finding
- Mention specific dollar amounts and tool names
- If savings are minimal (<$100/mo), acknowledge the user is spending well
- If savings are significant (>$500/mo), mention that Credex can help capture additional savings through discounted credits
- Never use jargon the reader wouldn't understand
- End with a specific, actionable next step
```

### User Prompt Template

```
Generate a personalized audit summary for this AI spend analysis:

Team size: {teamSize} developers
Primary use case: {useCase}
Total monthly AI spend: ${totalSpend}

Tools analyzed:
{foreach tool}
- {tool.name} ({tool.plan}): ${tool.monthlySpend}/mo for {tool.seats} seats
  → Recommendation: {tool.recommendation}
  → Potential savings: ${tool.savings}/mo
  → Reason: {tool.reason}
{/foreach}

Total potential monthly savings: ${totalMonthlySavings}
Total potential annual savings: ${totalAnnualSavings}

Write a concise 80-120 word summary paragraph highlighting the key findings and recommended actions.
```

### Example Output

> "Your 12-person dev team is spending $2,340/mo across four AI tools — but you could be paying $1,660/mo. The biggest opportunity is your Cursor Business plan at $40/seat: with your team size and mixed coding/writing use case, Cursor Pro at $20/seat covers your needs and saves $240/mo alone. Your ChatGPT Team plan is well-sized, but switching your 3 Claude Team seats to Pro would save another $90/mo. Total potential savings: $680/mo ($8,160/year). For savings this significant, Credex can source discounted credits to save an additional 15-25%. Start by downgrading your Cursor plan this week."

### Why This Prompt Design

1. **System prompt sets tone and rules** — keeps output consistent across different audit profiles
2. **Structured data injection** — the user prompt uses template variables, not free text, so the LLM can't hallucinate tool names or prices
3. **Word count constraint (80-120)** — specific enough to be useful, short enough to not overwhelm
4. **Conditional Credex mention** — only surfaces Credex for high-savings cases, matching the results page behavior
5. **Actionable ending** — every summary ends with a specific next step, not generic advice

### What I Tried That Didn't Work

1. **Asking for bullet points instead of a paragraph** — the summary felt clinical and didn't flow well. Users want to read a narrative, not a list (they already have the list in the detailed results).

2. **Not specifying word count** — without the 80-120 constraint, the LLM would write 300+ word essays. Too long for the results page and reduces shareability.

3. **Including raw pricing numbers in the prompt** — the LLM would sometimes "correct" our prices or add caveats about pricing being subject to change. By providing only the audit results (not raw pricing data), we avoid this.

4. **Using a more formal tone** — "As per our analysis, your organization's expenditure..." sounded like a consulting report. The friendlier tone tested better in manual review.

## Fallback Template

When the Gemini API is unavailable (rate limit, timeout, error), we use this template-based fallback:

```typescript
function generateFallbackSummary(audit: AuditResult): string {
  const { teamSize, totalSpend, totalMonthlySavings, totalAnnualSavings, recommendations } = audit;
  
  const topSaving = recommendations
    .filter(r => r.savings > 0)
    .sort((a, b) => b.savings - a.savings)[0];
  
  if (totalMonthlySavings < 100) {
    return `Your ${teamSize}-person team is spending $${totalSpend}/mo on AI tools — and you're spending well. We analyzed your stack and found your current plans are well-matched to your team size and usage. We'll notify you when new pricing changes or alternatives could save you money.`;
  }
  
  return `Your ${teamSize}-person team is spending $${totalSpend}/mo on AI tools, but our analysis found $${totalMonthlySavings}/mo ($${totalAnnualSavings}/year) in potential savings. The biggest opportunity: ${topSaving.tool} — ${topSaving.reason.toLowerCase()}. This alone could save $${topSaving.savings}/mo. Review the detailed breakdown below and start with the highest-impact change first.`;
}
```

### Why This Fallback Works

- Covers both "you're fine" and "you can save" scenarios
- Uses real numbers from the audit (no hallucination risk)
- Reads naturally even though it's templated
- Maintains the same tone as the LLM-generated version
- Highlights the single biggest saving opportunity for actionability
