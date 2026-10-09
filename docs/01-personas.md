# 01 — Personas

## Dr. Ananya Rao — Researcher
- **Context:** Ice-core and aerosol scientist rotating between Goa and Bharati.
- **Job:** File a report, find a prior passage, generate a researcher note that does not invent numbers.
- **Frictions:** PDF inboxes, lost figure captions, social teams asking for "a simple version" by evening.
- **Success:** Selects two passages, gets a note where every numeral still exists in the source.

## Imran Desai — Editor
- **Context:** Outreach editor at NCPOR. Writes for the website, schools, and social channels.
- **Job:** Turn a locked passage into public copy, submit it, and park it on the calendar.
- **Frictions:** Scientists do not have time to re-check paraphrases; inbox review loses versions.
- **Success:** Draft enters Review, comes back with a note, and lands on a Tuesday school briefing.

## Public reader — Student / citizen
- **Context:** A Class 11 student, a journalist, or a visitor after a science festival.
- **Job:** Search in plain language, open a story, follow a citation back to the passage.
- **Frictions:** Jargon, dead links, posts with no source.
- **Success:** Reads a published story, opens the cited passage, understands the glossary without being told a new "fact".

## Command admin — Portal admin
- **Context:** Knowledge-portal owner inside MoES communications.
- **Job:** Approve, publish, reschedule, and watch the funnel.
- **Frictions:** No single view of what is stuck in review versus what is on the calendar.
- **Success:** Approves a card, publishes it to Stories, drags it to a new day. Dashboard counts move.

## Role matrix
| Action | Public | Researcher | Editor | Admin |
| --- | --- | --- | --- | --- |
| Search and read | yes | yes | yes | yes |
| Open passages | yes | yes | yes | yes |
| Generate | no | yes | yes | yes |
| Ingest | no | no | yes | yes |
| Submit / return draft | no | submit own | yes | yes |
| Approve / publish | no | no | no | yes |
| Reschedule | no | no | yes | yes |

Mock auth is a persisted role switcher. Mutations send `x-aurora-role`. This is a prototype gate, not a security boundary.
