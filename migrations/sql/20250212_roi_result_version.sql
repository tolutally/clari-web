-- Migration: Add result_version column to institution_roi_runs
-- Purpose: Distinguish v1 (legacy feature ROI) from v2 (challenger readiness-debt) results
-- Existing rows default to 1 (v1); new challenger runs insert as 2.

ALTER TABLE institution_roi_runs
  ADD COLUMN IF NOT EXISTS result_version integer NOT NULL DEFAULT 1;

COMMENT ON COLUMN institution_roi_runs.result_version IS
  '1 = legacy feature-ROI model, 2 = challenger readiness-debt model';
