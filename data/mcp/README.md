# MCP data sync (local → admin)

The live site does not read your Desktop `run_logs` folder. To update **abramovichmedia.com/admin/pipeline**:

1. Open **Admin → Pipeline → Import**.
2. Paste the contents of a file such as:
   - `Main/Commonplace/Abramovich Media LLC/run_logs/2026-03-24_scottsdale_med_spa.json`
   - `ondeck_fu2_scottsdale_med_spa_manifest.json` (use **Import from FU2 manifest**)
3. Optionally set **Title** and **Batch run ID**, then run the matching import button.

**Import leads from run log** parses `followup_wave_log.FU1.recipients` (email + finding) and upserts by email.

**Save snapshot only** stores the full JSON in MongoDB for visualization without changing lead rows.
