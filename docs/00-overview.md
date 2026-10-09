# 00 — Overview

## Product
**AURORA** — Archive for Unified Research, Outreach & Repository Access.

Working title for **SIH26063**, the Integrated Polar Science Outreach, Knowledge Repository and Media Dissemination Portal for the Ministry of Earth Sciences (MoES) and the National Centre for Polar and Ocean Research (NCPOR), Goa.

## Vision
Turn India's polar record — Antarctic stations, Arctic Himadri, Southern Ocean cruises, and Himalayan cryosphere work — into a single desk where a scientist can file a source, an editor can search it without losing the sentence it came from, and the public can read a story that still points back to the ice.

## Problem
Polar knowledge currently fragments across cruise reports, station logs, raw tables, photographs, and social drafts. Outreach teams rewrite science from memory. Citations drop out. Review happens in inboxes. Nothing on the calendar is tied to the passage that justified the post.

## What this prototype proves
A single flow, clickable end to end:

**ingest → catalogue → search (keyword + semantic) → read → generate (citation-locked) → review → schedule → publish**

Every generated sentence carries a source span. If the span is not in the selected passage, the sentence is not emitted.

## Target users
- Polar researchers filing and rereading expedition records
- MoES / NCPOR editors producing public explainers and social posts
- Students and citizens in the reading room
- Portal admins who approve, publish, and schedule

## Success metrics (prototype)
- A judge can complete the full pipeline in under three minutes (see `DEMO.md`)
- Search returns highlighted snippets for keyword queries and ranked passages for semantic queries
- 100% of generated factual sentences map to a verbatim source excerpt
- Review queue and calendar mutate real rows, not local-only illusions
- Light, dark, and system themes persist; UI meets WCAG 2.2 AA contrast and keyboard access
- Seed archive contains 12 expeditions, 22 reports, 31 images, 11 videos, and 6 datasets

## Non-goals
- Real SSO, production object storage, or a live LLM key
- Claiming stock photography as official station photography (media is labeled illustrative)
- Replacing NCPOR's formal data centre

## Honesty label
All expedition narratives are realistic mock records for SIH26063. They are not official MoES publications.
