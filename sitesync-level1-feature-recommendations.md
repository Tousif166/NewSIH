# SiteSync AI | Level 1 Feature Recommendations | SIH PS 26122

---

## The Six Level 1 Recommendations

*What they add and why they matter*

| # | Recommendation | Main purpose | PS importance |
|---|----------------|--------------|---------------|
| 1 | Real Multi-Format Ingestion | Read real field reports instead of only typed updates | Very High |
| 2 | Unplanned Work Detector | Handle work that is not present in the schedule | Very High |
| 3 | Start-Progress-Finish Lifecycle Reconstruction | Build the true activity history across multiple reports | Very High |
| 4 | Granularity Mismatch Resolver | Connect many small field tasks to one planned activity | Very High |
| 5 | Real Schedule Import | Load a new schedule instead of relying only on seed data | High |
| 6 | Historical Execution Memory | Reuse actual project experience in future planning | High |

> **Important:** These features should not all be built at once. The best approach is to implement them in a sequence, because later recommendations can reuse the data and logic created by earlier ones.

**Recommended build order:** 1. Ingestion → 2. Unplanned → 3. Lifecycle → 4. Granularity → 5. Schedule Import → 6. History

---

## Level 1 – Feature 1: Real Multi-Format Ingestion

*Let SiteSync read the kinds of progress reports that real project teams already use*

### The problem in simple language

At a real construction site, every supervisor will not open SiteSync and manually type an update. One contractor may send an Excel sheet. Another may prepare a daily progress report. A site engineer may send a text note. A supervisor may speak an update. If SiteSync only understands one typed sentence at a time, it does not fully solve the data-capture problem described by Oil India.

### Real-world example

Suppose the piping contractor sends this spreadsheet at the end of the shift:

| Activity | Location | Progress | Status |
|----------|----------|----------|--------|
| Spool erection | Unit 3 | 80% | In progress |
| Hydrotest | Line 21 | 0% | Started |
| Support installation | Rack B | 100% | Completed |

Instead of a planner copying each row manually, SiteSync should read the file and create three structured execution events automatically.

### What we are recommending

> **Recommendation:** Add an "Import Progress Report" option that can read TXT, CSV and XLSX files first. Each row or report line should be converted into the same internal execution-event format already used by the manual text workflow. PDF can be added later for text-based DPRs; full OCR is not necessary for the first version.

### How it should work

`UPLOAD FILE` → `READ ROWS / TEXT` → `NORMALIZE FIELDS` → `CREATE EVENTS` → `RUN EXISTING MATCHER` → `PLANNER REVIEW`

### What needs to be implemented

- Add an upload control for TXT, CSV and XLSX files.
- Read the file locally in the browser so the demo can remain offline.
- Map common columns such as Activity, Discipline, Location, Progress, Date and Status.
- Convert each valid row into a SiteSync execution event.
- Send those events through the existing matching and review workflow.
- Show which rows were accepted, which were missing data, and which require review.

### Before vs after

| Current experience | After this improvement |
|--------------------|------------------------|
| Supervisor mainly types one update manually. | Planner can upload an entire contractor report and process many updates at once. |
| Spreadsheet data is only part of the project story. | Spreadsheet rows become real execution events that can be matched and reviewed. |

### Judge-demo example

Upload a fresh piping progress spreadsheet containing three rows. SiteSync reads the rows, creates three execution events, proposes the relevant L5/L6 matches, and sends low-confidence rows to planner review. This proves the system can handle real field reporting formats rather than only a pre-scripted sentence.

| PS Value | Demo Value | Difficulty | Recommended Stage |
|----------|------------|------------|-------------------|
| Very High | Very High | Low-Medium | Implement first |

---

## Level 1 – Feature 2: Unplanned Work Detector

*Do not force every field update into an existing schedule activity*

### The problem in simple language

Real sites often perform temporary, emergency or newly discovered work that was not included in the original schedule. If the matching engine always chooses the closest scheduled activity, the system can create incorrect progress records. A reliable system must be able to say: "I cannot confidently match this to the current plan."

### Real-world example

A supervisor reports:

> **Field update**
> "Temporary drainage channel created near Unit 4 because of flooding."

The schedule has no activity called "temporary drainage channel". SiteSync should not force this report into a vaguely similar civil activity just because something must be selected.

### What we are recommending

> **Recommendation:** Add a "Possible Unplanned Activity" path. If no schedule activity reaches a safe confidence threshold, the report should be placed in an Unplanned / Unmatched queue for planner review.

### Suggested decision logic

| Match result | System action |
|--------------|---------------|
| High confidence | Recommend normal schedule match |
| Medium confidence | Send to planner review |
| Low confidence / no credible match | Flag as possible unplanned activity |

### Planner actions

- Link the report manually to an existing activity.
- Create a new temporary/unplanned activity record.
- Mark it as supporting work that should not change the main schedule.
- Ignore/reject the report with a reason.

### Why this is especially valuable

This is not just a convenience feature. The original problem statement explicitly says unmatched or new activities should be flagged for planner review rather than silently dropped. It also strengthens the human-in-the-loop story because the system does not pretend to know something when the evidence is weak.

### Judge-demo example

Enter one normal report that matches a planned activity, then enter the drainage example above. The first report should produce a normal match. The second should be visibly separated into an "Unplanned Work" review card. The contrast makes the safety logic easy to understand.

| PS Value | Demo Value | Difficulty | Recommended Stage |
|----------|------------|------------|-------------------|
| Very High | Very High | Low-Medium | Implement second |

---

## Level 1 – Feature 3: Start-Progress-Finish Lifecycle Reconstruction

*Turn several daily updates into one trustworthy actual activity history*

### The problem in simple language

One project activity is rarely reported only once. A supervisor may report that work started on Monday, reached 40% on Tuesday, 80% on Thursday, and finished on Friday. If those reports are stored as unrelated messages, the project never gets a clean record of when the activity truly started, how progress changed, and when it actually finished.

### Real-world example

| Date | Field report |
|------|--------------|
| 1 Oct | "Excavation P101 started this morning." |
| 2 Oct | "P101 excavation reached 40%." |
| 4 Oct | "P101 excavation is now 80%." |
| 5 Oct | "P101 excavation completed." |

### What SiteSync should build from those reports

> **Reconstructed activity record**
> - Activity: Excavation P101
> - Actual Start: 1 Oct
> - Progress History: 1 Oct - Started | 2 Oct - 40% | 4 Oct - 80% | 5 Oct - 100%
> - Actual Finish: 5 Oct
> - Actual Duration: 5 days

### What we are recommending

When a new report is matched to an activity, SiteSync should look at earlier reports for that same activity and update one shared lifecycle. Start-like phrases should set the actual start. Intermediate percentages should be added to a progress timeline. Completion-like phrases or 100% progress should set the actual finish.

### How it should work

`MATCH REPORT` → `FIND SAME ACTIVITY HISTORY` → `CLASSIFY EVENT` → `UPDATE TIMELINE` → `SET ACTUAL START/FINISH` → `REFRESH GANTT`

### What needs to be implemented

- Store progress-event history per schedule activity.
- Recognize start indicators such as started, commenced, mobilized or work begun.
- Recognize completion indicators such as completed, finished, closed or 100%.
- Prevent obviously impossible sequences, such as a finish date earlier than the start date.
- Show the event timeline when a planner opens an activity.
- Use the reconstructed actual start/finish values in the Gantt and historical records.

### Why this matters to the PS

The problem statement asks for activity-level actual start/end events. That is more than a single "percent complete" number. Lifecycle reconstruction creates the trustworthy actual schedule history needed for delay analysis, forecasting and later institutional memory.

### Judge-demo example

Submit three updates for the same activity: "started", "60%", then "completed". Open the activity and show that SiteSync has reconstructed one continuous lifecycle with an actual start date, progress history and actual finish date.

| PS Value | Demo Value | Difficulty | Recommended Stage |
|----------|------------|------------|-------------------|
| Very High | High | Medium | Implement third |

---

## Level 1 – Feature 4: Granularity Mismatch Resolver

*Understand that field work is often more detailed than the official L5/L6 schedule*

### The concept in the simplest possible way

A project schedule may contain one large activity, but the site team may report many smaller tasks that together complete that activity. This difference in level of detail is called a granularity mismatch.

### Example

The official schedule may contain only:

> **Planned L5/L6 activity**
> CIV-101 - Construct Pump Foundation

But the actual site reports may be:

| Field-level task | Status |
|------------------|--------|
| Excavation | Completed |
| Reinforcement | Completed |
| Shuttering | Completed |
| Concrete pouring | Started |

All four reports describe pieces of the same planned activity. SiteSync should understand that relationship instead of pretending every field task must have its own P6 activity.

### What we are recommending

> **Recommendation:** Introduce "Execution Subtasks" (or "Field Work Packages") below a planned activity. Many field-level updates can be grouped under one L5/L6 parent. SiteSync then rolls their progress upward to the parent activity.

### How the relationship looks

`CIV-101 PARENT` → `EXCAVATION` / `REBAR` / `SHUTTERING` / `CONCRETING` → `ROLLED-UP PROGRESS`

### How progress could be calculated

The first prototype can use simple rules: equal weights, manually configured weights, or quantities when available. For example, excavation may represent 20%, reinforcement 25%, shuttering 20%, concreting 35%. The important point is not perfect earned-value mathematics; it is proving that SiteSync can reconcile detailed execution with a coarser plan.

### What needs to be implemented

- Add a way to identify/create field-level subtasks under one scheduled activity.
- Allow the matcher to attach a report either directly to the parent activity or to one of its execution subtasks.
- Store the parent-child relationship.
- Roll up subtask progress to the parent activity using a transparent rule.
- Show the planner exactly which field reports contributed to the parent progress.

### Why this is a strong SIH feature

The original problem statement explicitly warns that actual execution can be more granular than the planned WBS. Solving this shows that the team understood the real planning-to-execution mismatch, not only the text-matching problem.

### Judge-demo example

Open one planned activity such as "Construct Pump Foundation". Submit separate updates for excavation, reinforcement and concreting. Show all three being grouped under the same parent and the parent progress changing as those field tasks are completed.

| PS Value | Demo Value | Difficulty | Recommended Stage |
|----------|------------|------------|-------------------|
| Very High | Very High | Medium-High | Implement fourth |

---

## Level 1 – Feature 5: Real Schedule Import

*Prove that SiteSync can work with a new schedule instead of only preloaded demo activities*

### The current limitation

The current prototype contains synthetic schedule data inside the application. That is fine for a first demo, but it means a judge could ask: "What happens if I give you a completely different project schedule?" A stronger prototype should be able to load a schedule from a file.

### What we are recommending

Do not start by trying to support every proprietary schedule format. Build a credible, controlled first version: import a CSV exported from Primavera P6 or MS Project.

| Activity ID | WBS | Activity Name | Discipline | Baseline Start | Baseline Finish | Predecessor |
|-------------|-----|---------------|------------|----------------|-----------------|-------------|
| PIP-201 | 2.1.4 | Pipe Rack Installation | Piping | 01-10-2026 | 06-10-2026 | CIV-107 |

### How it should work

`UPLOAD SCHEDULE CSV` → `VALIDATE COLUMNS` → `CREATE WBS / ACTIVITIES` → `LOAD INTO EXPLORER` → `MATCH FIELD REPORTS` → `UPDATE ACTUALS`

### What needs to be implemented

- Create a schedule-import screen or button.
- Define a simple CSV schema for activity ID, WBS, title, discipline, dates and predecessor.
- Validate required fields and show useful errors.
- Replace or add to the current demo activities in the runtime store.
- Generate predecessor relationships from the imported file.
- Let the existing matcher work against the newly imported activities.

### Why CSV first is the right hackathon scope

CSV is easy to inspect, easy to generate from planning tools, and simple to parse offline. Native XER, MPP or full Primavera integration can remain future work. A working CSV import is more credible than a non-functional button labeled "P6 integration".

### Judge-demo example

Upload a fresh schedule file containing activities that were not preloaded in SiteSync. Then enter a field update that uses different wording. If SiteSync still finds the correct newly imported activity, the matching logic becomes far more convincing.

| PS Value | Demo Value | Difficulty | Recommended Stage |
|----------|------------|------------|-------------------|
| High | Very High | Medium | Implement fifth |

---

## Level 1 – Feature 6: Historical Execution Memory

*Turn completed project experience into reusable planning knowledge*

### The problem in simple language

When a large infrastructure project ends, the real execution knowledge often remains in spreadsheets, paper records, or the experience of individual supervisors. Future planners may therefore repeat unrealistic duration assumptions and encounter the same recurring delay causes again.

### What SiteSync should remember after an activity finishes

| Stored item | Why it matters |
|-------------|----------------|
| Planned duration vs actual duration | Shows whether the plan was realistic |
| Actual start and finish | Creates reliable historical timing |
| Discipline and activity type | Allows comparison with similar work |
| Delay reason | Reveals recurring bottlenecks |
| Quantity and productivity | Supports better future estimates |
| Location / contractor / conditions | Adds useful context |

### Real-world future-project example

A planner creates a new activity called "Pipeline Welding" and plans 5 days. SiteSync searches completed historical records and finds four similar activities that actually took 6, 7, 7 and 8 days. Instead of pretending to predict the future perfectly, SiteSync can show a grounded historical warning:

> **Historical insight**
> - Planned duration: 5 days
> - Historical actual average: 7 days
> - Most common recorded delay cause: material availability
> - Planning note: similar work has historically required about 2 additional days.

### What we are recommending

Create a historical activity repository that receives a clean record whenever an activity is completed. Add a "Similar Historical Activities" view that can search and summarize those records by activity type, discipline, location, delay cause and duration.

### How it should work

`ACTIVITY COMPLETES` → `SAVE CLEAN RECORD` → `TAG ACTIVITY TYPE` → `STORE DELAYS / DURATION` → `SEARCH SIMILAR WORK` → `SHOW HISTORICAL INSIGHT`

### What needs to be implemented

- Define the historical record fields.
- Create a completed-activity archive from lifecycle data.
- Add similarity rules based on discipline, keywords, asset type or activity category.
- Calculate simple descriptive statistics such as average actual duration and recurring delay causes.
- Clearly label results as historical evidence, not guaranteed predictions.
- Allow future project activities to query this repository.

### Why this matters to the PS

This recommendation directly addresses the "institutional memory" goal in the problem statement: real durations, real bottlenecks and real deviations should become a structured, queryable knowledge base instead of disappearing after project closeout.

### Judge-demo example

Open a newly planned pipeline activity. Click "Historical Insight" and show three or four comparable completed activities, their actual durations, and the most common delay reason. Explain that SiteSync is helping future planners learn from real execution, not only tracking the current project.

| PS Value | Demo Value | Difficulty | Recommended Stage |
|----------|------------|------------|-------------------|
| High | High | Medium-High | Implement after core workflow |

---

## Level 1 – Feature Integration: How All Six Features Work Together

*One connected planning-to-execution system, not six unrelated ideas*

The six recommendations become much stronger when viewed as one pipeline. Each stage improves the quality of the next stage.

`FIELD SOURCES` → `NORMALIZED EVENTS` → `PLANNED OR UNPLANNED?` → `GRANULARITY RESOLUTION` → `LIFECYCLE / ACTUALS` → `HISTORICAL MEMORY`

### End-to-end example

| Step | What happens |
|------|--------------|
| 1. Input | A contractor uploads an XLSX progress report. |
| 2. Normalize | SiteSync converts rows into structured execution events. |
| 3. Match safety | One row matches a planned activity; another is flagged as possible unplanned work. |
| 4. Granularity | Three small field tasks are grouped under one L5/L6 parent activity. |
| 5. Lifecycle | Reports over several days reconstruct actual start, progress and finish. |
| 6. Schedule | The imported project schedule receives trusted actual progress. |
| 7. Memory | Completed work becomes historical evidence for future planning. |

> **What SiteSync becomes**
> A system that captures heterogeneous field data, understands both planned and unplanned work, reconciles detailed execution with formal schedules, reconstructs actual activity history, and preserves execution knowledge for future projects.

---

## Level 1 – Feature Priorities: What Should the Team Actually Build?

*A practical implementation order so the scope remains realistic*

| Order | Feature | Why this order |
|-------|---------|----------------|
| 1 | Real Multi-Format Ingestion | Immediately strengthens the PS requirement for heterogeneous inputs and gives other features richer data. |
| 2 | Unplanned Work Detector | Low-to-medium effort and directly satisfies a stated PS requirement. |
| 3 | Lifecycle Reconstruction | Creates reliable actual start/finish history needed by later analytics. |
| 4 | Granularity Mismatch Resolver | Solves one of the hardest real planning-to-execution problems after the core event flow is stable. |
| 5 | Real Schedule Import | Makes the matcher believable against fresh project data. |
| 6 | Historical Execution Memory | Becomes much more meaningful after lifecycle and schedule data are trustworthy. |

### Minimum high-impact version if time is limited

> **Build these first**
> 1. CSV/XLSX/TXT ingestion
> 2. Unplanned Work Detector
> 3. Start-Progress-Finish Lifecycle Reconstruction

Those three alone would close several important gaps in the current prototype while remaining realistic for a hackathon team. Granularity resolution and schedule import would then be the strongest next additions.

### What should NOT be prioritized before these

Do not spend the first effort adding more decorative dashboards, another generic AI chat screen, or complex external integrations. The original problem is mainly about trustworthy execution data capture and schedule linking. The project becomes stronger when that core pipeline is real and defensible.

---

## Level 1 – Feature Final View: Current SiteSync vs Enhanced SiteSync

*How the story changes after Level 1 improvements*

| Current SiteSync story | Enhanced SiteSync story |
|------------------------|-------------------------|
| A supervisor enters an update. | SiteSync accepts field data from multiple real formats. |
| The app proposes an L5/L6 match. | It can also admit when work is unmatched or unplanned. |
| Progress is updated after planner approval. | Multiple reports reconstruct the full actual start-progress-finish lifecycle. |
| The matcher works against demo schedule data. | A fresh schedule can be imported and matched. |
| Historical views are largely synthetic/demo oriented. | Completed activities become a reusable execution knowledge base. |
| Field reports are treated near the schedule activity level. | Detailed field subtasks can be rolled up into coarser L5/L6 activities. |

> **One-line team vision**
> SiteSync AI should not only answer "Which schedule activity does this report belong to?" It should capture real field information, decide whether the work was planned, reconcile field detail with the schedule, reconstruct what actually happened over time, and make that execution knowledge reusable for future projects.

### Final recommendation

Use this document as a feature-discussion guide, not as a requirement to implement everything immediately. The best team decision is to choose the smallest set of improvements that most clearly demonstrates the complete Oil India problem: heterogeneous data capture, trustworthy L5/L6 linking, unmatched-work handling, actual start/end reconstruction and reusable institutional memory.

**The current prototype already has a valuable interactive foundation. The Level 1 work should strengthen that foundation rather than replace it.**
