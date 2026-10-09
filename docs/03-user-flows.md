# 03 — User flows

## 1. Ingest → catalogue
1. Editor or admin opens Ingest.
2. Drops a PDF, image, video, CSV, or text file — or loads the demo packet.
3. The desk infers year, media type, expedition, and tags from the filename, MIME type, and notes.
4. Editor corrects fields and files the record.
5. Server stores the file under `/uploads` when one is attached, splits text into passages, embeds each passage, and writes an activity row.
6. The new card appears in Archive and Search.

## 2. Search → document
1. Any role types a query on Home, in the header, or in Search.
2. Chooses Keyword, Semantic, or Hybrid. Filters by report / image / video / dataset and expedition.
3. Results show a snippet, highlight ranges where the query actually occurs, and a score.
4. Opening a result lands on the document, scrolled to the matched passage.

## 3. Select → generate
1. Researcher, editor, or admin selects one or more passages.
2. Chooses website copy or social post, plus a reading level.
3. The citation-locked adapter:
   - splits selected passages into sentences
   - refuses to emit a sentence whose digits are not in the source
   - numbers citations in order of first use
   - adds glossary notes only for terms that appear, labeled as definitions
4. User saves the draft. Status becomes `draft` or `review`.

## 4. Review → publish
1. Editor submits or returns a draft with a note.
2. Admin approves, then publishes.
3. Published drafts appear on Stories with sidenote citations linking back to `#p-{passageId}`.

## 5. Schedule
1. Editor or admin drags a card onto a day, or uses the date field.
2. `scheduledAt` updates in Postgres.
3. Dashboard "On the calendar" list reflects the change.

## 6. Public reading
1. Role switches to Public.
2. Generate, ingest, approve, and reschedule controls explain the missing permission instead of failing silently.
3. Stories and the archive remain readable.

## Empty, loading, error
- Every desk has a skeleton, an empty state with the next action, and an inline error with retry.
- Search with no hits suggests a known term from the archive (black carbon, IndARC, δ18O, neutron monitor).
