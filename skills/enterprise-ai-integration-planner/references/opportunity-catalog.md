# AI opportunity catalog

Generic categories of AI technique, each paired with the non-AI alternative it should always be
compared against. This catalog is deliberately technology-level, not feature-specific — map it onto
the target project's real workflows during planning; do not copy these generic descriptions into a
report as if they were already project-specific findings.

## 1. LLM-assisted features
Contextual assistance, summarization, explanation, content drafting, natural-language interfaces.
- **Fits when**: the task is language-heavy, tolerant of occasional imperfect phrasing, and a human
  reviews or can easily correct the output.
- **Non-AI alternative**: static help text, templated messages, canned reports, configurable rules.
- **Caution**: do not use for tasks requiring guaranteed numeric precision or legal certainty without
  a verification step.

## 2. Retrieval-augmented generation (RAG)
Search across authorized documentation, answers grounded in approved records, source-linked
explanations, contextual knowledge retrieval.
- **Fits when**: there is a stable corpus of authorized documents, a real need for natural-language
  Q&A over it, and citations can be enforced and checked.
- **Non-AI alternative**: full-text search with ranking, FAQ pages, structured knowledge bases.
- **Caution**: the retrieval layer must enforce the same access control as the underlying documents;
  RAG must never surface a document the asking user is not authorized to read.

## 3. Extraction and classification
Structured extraction from documents, classification/tagging, entity resolution, data-quality
assistance.
- **Fits when**: inputs are semi-structured/unstructured text or scans, volume is too high for manual
  processing, and some error rate is tolerable with human review of low-confidence cases.
- **Non-AI alternative**: regex/rule-based parsers, fixed-format importers, manual tagging.
- **Caution**: label confidence, route low-confidence results to a human, and track an error rate.

## 4. Predictive and analytical models
Forecasting, anomaly detection, risk scoring, classification of future outcomes.
- **Fits when**: there is enough representative historical data, a clear evaluation metric, and a
  defensible labeled outcome to predict.
- **Non-AI alternative**: statistical thresholds, business-rule scoring, simple moving averages.
- **Caution**: do not recommend without sufficient historical data and an evaluation plan; do not
  claim an accuracy figure that has not been measured on this project's data.

## 5. Tool-using agents
Multi-step workflows, cross-system assistance, preparing actions for approval, controlled tool
execution.
- **Fits when**: a well-bounded set of tools/APIs exists, each action is reversible or requires
  approval, and failure modes are observable.
- **Non-AI alternative**: a workflow engine, scripted automation, a wizard-style UI.
- **Caution**: never allow autonomous execution of irreversible or sensitive actions without a human
  approval gate; log every tool call.

## 6. Engineering intelligence
Documentation analysis, incident investigation support, change-impact analysis, test-scenario
generation, technical onboarding assistance.
- **Fits when**: the organization has enough documentation/code history to ground answers and the
  consumers are engineers who can validate output.
- **Non-AI alternative**: existing wikis, runbooks, static dependency-graph tools, code search.

## 7. Non-AI automation (always evaluate first)
Deterministic business rules, conventional search, SQL queries, workflow engines, rules-based
validation, scheduled automation.
- Use this list as the baseline. If a non-AI approach fully satisfies the user problem with lower
  cost, lower risk, and equal or better reliability, recommend it instead of AI, or recommend AI only
  as a secondary enhancement with a clearly stated reason.
