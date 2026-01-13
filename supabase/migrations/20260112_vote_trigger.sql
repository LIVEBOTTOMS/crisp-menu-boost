-- ============================================
-- TRIGGER to Auto-Update Menu Prices based on Votes
-- ============================================

-- Ensure menu_items has original_price column
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT 0;

-- Function to handle price updates
CREATE OR REPLACE FUNCTION update_discount_on_vote()
RETURNS TRIGGER AS $$
DECLARE
    v_item_id UUID;
    v_vote_count INTEGER;
    v_discount_percent INTEGER;
    v_original_price DECIMAL;
    v_current_price DECIMAL;
    v_new_price DECIMAL;
BEGIN
    -- Try to convert item_id to UUID (it might be a composite string key)
    BEGIN
        v_item_id := NEW.item_id::UUID;
    EXCEPTION WHEN OTHERS THEN
        -- If it's not a UUID, we can't update menu_items table easily
        RETURN NEW;
    END;

    -- 1. Get vote stats
    -- We can use the view item_vote_counts which we created earlier
    -- Or calculate directly for atomicity
    SELECT COUNT(*) INTO v_vote_count 
    FROM item_votes 
    WHERE item_id = NEW.item_id;

    -- 2. Calculate discount (1% per 10 votes, max 10%)
    v_discount_percent := LEAST(FLOOR(v_vote_count / 10.0), 10);

    -- 3. Get item data
    SELECT price, original_price INTO v_current_price, v_original_price
    FROM menu_items 
    WHERE id = v_item_id;

    -- If no item found, exit
    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    -- 4. Initialize original_price if missing
    IF v_original_price IS NULL THEN
        v_original_price := v_current_price;
        UPDATE menu_items 
        SET original_price = v_current_price 
        WHERE id = v_item_id;
    END IF;

    -- 5. Calculate new price
    -- Round to nearest integer for clean prices
    v_new_price := ROUND(v_original_price * (1.0 - (v_discount_percent / 100.0)));

    -- 6. Update item if discount changed
    UPDATE menu_items 
    SET 
        discount_percent = v_discount_percent,
        price = v_new_price,
        updated_at = NOW()
    WHERE id = v_item_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition
DROP TRIGGER IF EXISTS trigger_update_discount_on_vote ON item_votes;

CREATE TRIGGER trigger_update_discount_on_vote
    AFTER INSERT ON item_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_discount_on_vote();
