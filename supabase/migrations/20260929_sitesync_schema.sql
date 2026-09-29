-- ============================================================================
-- SiteSync AI: Complete Schema & RLS Policies (SIH26122 - Oil India Limited)
-- Intelligent Planning-to-Execution Bridge
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Organizations
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    country TEXT DEFAULT 'India',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('planner', 'supervisor', 'project_manager', 'admin')),
    organization_id UUID REFERENCES public.organizations(id),
    discipline TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    organization_id UUID REFERENCES public.organizations(id),
    project_type TEXT NOT NULL DEFAULT 'Refinery & Process Plant',
    location TEXT NOT NULL,
    start_date DATE NOT NULL,
    baseline_completion_date DATE NOT NULL,
    forecast_completion_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'ON_TRACK', 'AT_RISK', 'DELAYED')),
    budget_inr NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WBS Nodes
CREATE TABLE IF NOT EXISTS public.wbs_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.wbs_nodes(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('L1', 'L2', 'L3', 'L4', 'L5', 'L6')),
    discipline TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Schedule Activities (L5 / L6 Nodes)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    wbs_id UUID REFERENCES public.wbs_nodes(id),
    activity_code TEXT NOT NULL,
    name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('L5', 'L6')),
    discipline TEXT NOT NULL,
    location TEXT NOT NULL,
    contractor TEXT NOT NULL,
    
    planned_start DATE NOT NULL,
    planned_finish DATE NOT NULL,
    planned_duration_days INT NOT NULL,
    baseline_percent NUMERIC(5, 2) DEFAULT 0.00,
    
    actual_start DATE,
    actual_finish DATE,
    actual_duration_days INT,
    actual_percent NUMERIC(5, 2) DEFAULT 0.00,
    
    forecast_finish DATE NOT NULL,
    forecast_variance_days INT DEFAULT 0,
    
    quantity NUMERIC(12, 2),
    unit TEXT,
    installed_quantity NUMERIC(12, 2) DEFAULT 0.00,
    
    status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CRITICAL')),
    is_critical_path BOOLEAN DEFAULT FALSE,
    is_milestone BOOLEAN DEFAULT FALSE,
    
    historical_benchmark_days INT,
    historical_variance_days INT,
    common_delay_cause TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, activity_code)
);

-- 6. Activity Dependencies
CREATE TABLE IF NOT EXISTS public.activity_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    predecessor_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
    successor_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'FS' CHECK (type IN ('FS', 'SS', 'FF', 'SF')),
    lag_days INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Field Sources & Documents
CREATE TABLE IF NOT EXISTS public.field_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('VOICE', 'TEXT', 'DPR', 'SPREADSHEET', 'SCANNED_DIARY', 'PHOTO')),
    file_name TEXT,
    file_url TEXT,
    mime_type TEXT,
    reliability_score NUMERIC(5, 2) DEFAULT 95.0,
    uploaded_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Normalized Execution Events
CREATE TABLE IF NOT EXISTS public.field_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    source_id UUID REFERENCES public.field_sources(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES public.user_profiles(id),
    reported_date DATE NOT NULL,
    
    raw_text TEXT NOT NULL,
    activity_description TEXT NOT NULL,
    discipline TEXT NOT NULL,
    action TEXT,
    asset_or_component TEXT,
    location TEXT,
    
    start_time TIME,
    end_time TIME,
    quantity NUMERIC(12, 2),
    unit TEXT,
    percent_complete NUMERIC(5, 2),
    status_reported TEXT NOT NULL CHECK (status_reported IN ('STARTED', 'IN_PROGRESS', 'COMPLETED', 'IMPEDED')),
    
    contractor TEXT,
    equipment JSONB DEFAULT '[]'::jsonb,
    manpower_count INT,
    delay_reason TEXT,
    photo_url TEXT,
    
    extraction_confidence NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Activity Matches & Review Center
CREATE TABLE IF NOT EXISTS public.activity_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.field_events(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
    confidence NUMERIC(5, 2) NOT NULL,
    confidence_tier TEXT NOT NULL CHECK (confidence_tier IN ('HIGH', 'MEDIUM', 'LOW')),
    status TEXT NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'REASSIGNED', 'MARKED_NEW')),
    
    explanation JSONB NOT NULL DEFAULT '[]'::jsonb,
    candidates JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    reviewed_by UUID REFERENCES public.user_profiles(id),
    reviewed_at TIMESTAMPTZ,
    planner_notes TEXT,
    applied_to_schedule BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Project Terminology Memory (Project-specific vocabulary)
CREATE TABLE IF NOT EXISTS public.terminology_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    discipline TEXT NOT NULL,
    contractor TEXT,
    field_term TEXT NOT NULL,
    canonical_activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
    confidence_boost NUMERIC(5, 2) DEFAULT 0.20,
    times_applied INT DEFAULT 1,
    approved_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Data Conflicts
CREATE TABLE IF NOT EXISTS public.data_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
    conflict_type TEXT NOT NULL CHECK (conflict_type IN ('PROGRESS_CONFLICT', 'TEMPORAL_CONFLICT', 'DUPLICATE_EVENT', 'PREDECESSOR_VIOLATION')),
    severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'WARNING', 'NOTICE')),
    status TEXT NOT NULL DEFAULT 'UNRESOLVED' CHECK (status IN ('UNRESOLVED', 'RESOLVED', 'IGNORED')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    resolved_by UUID REFERENCES public.user_profiles(id),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Institutional Memory & Historical DNA
CREATE TABLE IF NOT EXISTS public.historical_activity_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type TEXT NOT NULL,
    discipline TEXT NOT NULL,
    typical_duration_days NUMERIC(6, 2) NOT NULL,
    historical_median_days NUMERIC(6, 2) NOT NULL,
    historical_variance_days NUMERIC(6, 2) NOT NULL,
    primary_delay_causes JSONB DEFAULT '[]'::jsonb,
    top_contractors JSONB DEFAULT '[]'::jsonb,
    synonyms JSONB DEFAULT '[]'::jsonb,
    sample_project_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Audit Logs (Immutable Provenance)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    role TEXT NOT NULL,
    details TEXT NOT NULL,
    model_version TEXT,
    source_doc TEXT,
    source_page INT,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wbs_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terminology_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historical_activity_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Standard RLS Access Policies for Authenticated & Anon Roles
CREATE POLICY "Allow authenticated read on projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on activities" ON public.activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update on activities" ON public.activities FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated insert on field_events" ON public.field_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated read on field_events" ON public.field_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on activity_matches" ON public.activity_matches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update on activity_matches" ON public.activity_matches FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated read on audit_logs" ON public.audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert on audit_logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes for lightning-fast matching & fuzzy retrieval
CREATE INDEX IF NOT EXISTS idx_activities_code ON public.activities(activity_code);
CREATE INDEX IF NOT EXISTS idx_activities_discipline ON public.activities(discipline);
CREATE INDEX IF NOT EXISTS idx_activities_name_trgm ON public.activities USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_field_events_date ON public.field_events(reported_date);
CREATE INDEX IF NOT EXISTS idx_activity_matches_status ON public.activity_matches(status);
