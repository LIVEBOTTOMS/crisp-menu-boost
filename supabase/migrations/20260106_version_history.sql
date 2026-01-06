-- Version History System for Menu Changes
-- Tracks all menu changes with full snapshots for rollback capability

-- Create menu_versions table
CREATE TABLE IF NOT EXISTS menu_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  change_summary TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(menu_id, version_number)
);

-- Create index for fast lookups
CREATE INDEX idx_menu_versions_menu ON menu_versions(menu_id, created_at DESC);
CREATE INDEX idx_menu_versions_user ON menu_versions(created_by);

-- Function to get next version number
CREATE OR REPLACE FUNCTION get_next_version_number(p_menu_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_next_version
  FROM menu_versions
  WHERE menu_id = p_menu_id;
  
  RETURN v_next_version;
END;
$$ LANGUAGE plpgsql;

-- Function to create version snapshot
CREATE OR REPLACE FUNCTION create_version_snapshot(
  p_menu_id UUID,
  p_change_summary TEXT,
  p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_version_id UUID;
  v_version_number INTEGER;
  v_snapshot JSONB;
BEGIN
  -- Get next version number
  v_version_number := get_next_version_number(p_menu_id);
  
  -- Build snapshot from current menu state
  SELECT jsonb_build_object(
    'venue', (SELECT row_to_json(v.*) FROM venues v WHERE v.id = p_menu_id),
    'sections', (
      SELECT jsonb_agg(row_to_json(s.*))
      FROM menu_sections s
      WHERE s.venue_id = p_menu_id
      ORDER BY s.display_order
    ),
    'categories', (
      SELECT jsonb_agg(row_to_json(c.*))
      FROM menu_categories c
      WHERE c.venue_id = p_menu_id
      ORDER BY c.display_order
    ),
    'items', (
      SELECT jsonb_agg(row_to_json(i.*))
      FROM menu_items i
      WHERE i.venue_id = p_menu_id
      ORDER BY i.display_order
    )
  ) INTO v_snapshot;
  
  -- Insert version record
  INSERT INTO menu_versions (
    menu_id,
    version_number,
    snapshot,
    change_summary,
    created_by
  ) VALUES (
    p_menu_id,
    v_version_number,
    v_snapshot,
    p_change_summary,
    p_user_id
  )
  RETURNING id INTO v_version_id;
  
  RETURN v_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore from version
CREATE OR REPLACE FUNCTION restore_from_version(
  p_version_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_menu_id UUID;
  v_snapshot JSONB;
  v_venue JSONB;
  v_sections JSONB;
  v_categories JSONB;
  v_items JSONB;
BEGIN
  -- Get version snapshot
  SELECT menu_id, snapshot
  INTO v_menu_id, v_snapshot
  FROM menu_versions
  WHERE id = p_version_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Version not found';
  END IF;
  
  -- Create a new version before restoring (for safety)
  PERFORM create_version_snapshot(
    v_menu_id,
    'Pre-restore snapshot (before restoring to version)',
    p_user_id
  );
  
  -- Extract snapshot components
  v_venue := v_snapshot->'venue';
  v_sections := v_snapshot->'sections';
  v_categories := v_snapshot->'categories';
  v_items := v_snapshot->'items';
  
  -- Delete current menu data
  DELETE FROM menu_items WHERE venue_id = v_menu_id;
  DELETE FROM menu_categories WHERE venue_id = v_menu_id;
  DELETE FROM menu_sections WHERE venue_id = v_menu_id;
  
  -- Restore sections
  IF v_sections IS NOT NULL THEN
    INSERT INTO menu_sections
    SELECT * FROM jsonb_populate_recordset(null::menu_sections, v_sections);
  END IF;
  
  -- Restore categories
  IF v_categories IS NOT NULL THEN
    INSERT INTO menu_categories
    SELECT * FROM jsonb_populate_recordset(null::menu_categories, v_categories);
  END IF;
  
  -- Restore items
  IF v_items IS NOT NULL THEN
    INSERT INTO menu_items
    SELECT * FROM jsonb_populate_recordset(null::menu_items, v_items);
  END IF;
  
  -- Update venue settings if needed
  UPDATE venues
  SET
    theme = COALESCE((v_venue->>'theme')::text, theme),
    updated_at = NOW()
  WHERE id = v_menu_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE menu_versions ENABLE ROW LEVEL SECURITY;

-- Users can view versions of their own menus
CREATE POLICY "Users can view their menu versions"
  ON menu_versions FOR SELECT
  USING (
    menu_id IN (
      SELECT id FROM venues
      WHERE owner_id = auth.uid()
    )
  );

-- Users can create versions for their own menus
CREATE POLICY "Users can create versions for their menus"
  ON menu_versions FOR INSERT
  WITH CHECK (
    menu_id IN (
      SELECT id FROM venues
      WHERE owner_id = auth.uid()
    )
  );

-- Grant permissions
GRANT SELECT, INSERT ON menu_versions TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_version_number(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_version_snapshot(UUID, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION restore_from_version(UUID, UUID) TO authenticated;

-- Add comment
COMMENT ON TABLE menu_versions IS 'Stores complete snapshots of menu state for version history and rollback';
