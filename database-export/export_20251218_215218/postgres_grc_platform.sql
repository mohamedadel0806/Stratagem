--
-- PostgreSQL database dump
--

\restrict heVMQzsDiWfiJfm7iU0A3e7KpQ89GokNu6H33c3yLap8y1ef1HD1epoVWNI3r9Z

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: applicability_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.applicability_status_enum AS ENUM (
    'applicable',
    'not_applicable',
    'under_review'
);


ALTER TYPE public.applicability_status_enum OWNER TO postgres;

--
-- Name: assessment_result_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assessment_result_enum AS ENUM (
    'compliant',
    'non_compliant',
    'partially_compliant',
    'not_applicable',
    'not_tested'
);


ALTER TYPE public.assessment_result_enum OWNER TO postgres;

--
-- Name: assessment_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assessment_status_enum AS ENUM (
    'not_started',
    'in_progress',
    'under_review',
    'completed',
    'cancelled'
);


ALTER TYPE public.assessment_status_enum OWNER TO postgres;

--
-- Name: assessment_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assessment_type_enum AS ENUM (
    'inherent',
    'current',
    'target'
);


ALTER TYPE public.assessment_type_enum OWNER TO postgres;

--
-- Name: asset_audit_logs_action_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_audit_logs_action_enum AS ENUM (
    'create',
    'update',
    'delete'
);


ALTER TYPE public.asset_audit_logs_action_enum OWNER TO postgres;

--
-- Name: asset_audit_logs_asset_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_audit_logs_asset_type_enum AS ENUM (
    'physical',
    'information',
    'application',
    'software',
    'supplier'
);


ALTER TYPE public.asset_audit_logs_asset_type_enum OWNER TO postgres;

--
-- Name: asset_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_category_enum AS ENUM (
    'physical',
    'information',
    'application',
    'software',
    'supplier'
);


ALTER TYPE public.asset_category_enum OWNER TO postgres;

--
-- Name: asset_dependencies_relationship_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_dependencies_relationship_type_enum AS ENUM (
    'depends_on',
    'uses',
    'contains',
    'hosts',
    'processes',
    'stores',
    'other'
);


ALTER TYPE public.asset_dependencies_relationship_type_enum OWNER TO postgres;

--
-- Name: asset_dependencies_source_asset_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_dependencies_source_asset_type_enum AS ENUM (
    'physical',
    'information',
    'application',
    'software',
    'supplier'
);


ALTER TYPE public.asset_dependencies_source_asset_type_enum OWNER TO postgres;

--
-- Name: asset_dependencies_target_asset_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_dependencies_target_asset_type_enum AS ENUM (
    'physical',
    'information',
    'application',
    'software',
    'supplier'
);


ALTER TYPE public.asset_dependencies_target_asset_type_enum OWNER TO postgres;

--
-- Name: asset_requirement_mapping_compliance_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_requirement_mapping_compliance_status_enum AS ENUM (
    'not_assessed',
    'compliant',
    'non_compliant',
    'partially_compliant',
    'not_applicable',
    'requires_review'
);


ALTER TYPE public.asset_requirement_mapping_compliance_status_enum OWNER TO postgres;

--
-- Name: asset_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_type_enum AS ENUM (
    'physical',
    'information',
    'application',
    'software',
    'supplier'
);


ALTER TYPE public.asset_type_enum OWNER TO postgres;

--
-- Name: asset_types_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_types_category_enum AS ENUM (
    'physical',
    'information',
    'application',
    'software',
    'supplier'
);


ALTER TYPE public.asset_types_category_enum OWNER TO postgres;

--
-- Name: authentication_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.authentication_type AS ENUM (
    'api_key',
    'bearer_token',
    'basic_auth',
    'oauth2'
);


ALTER TYPE public.authentication_type OWNER TO postgres;

--
-- Name: baseline_compliance_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.baseline_compliance_status_enum AS ENUM (
    'compliant',
    'non_compliant',
    'partially_compliant',
    'not_assessed',
    'exception_approved'
);


ALTER TYPE public.baseline_compliance_status_enum OWNER TO postgres;

--
-- Name: business_applications_applicationtype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.business_applications_applicationtype_enum AS ENUM (
    'web_application',
    'mobile_app',
    'desktop_app',
    'api_service',
    'database',
    'cloud_service',
    'other'
);


ALTER TYPE public.business_applications_applicationtype_enum OWNER TO postgres;

--
-- Name: business_applications_criticalitylevel_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.business_applications_criticalitylevel_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low'
);


ALTER TYPE public.business_applications_criticalitylevel_enum OWNER TO postgres;

--
-- Name: business_applications_data_classification_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.business_applications_data_classification_enum AS ENUM (
    'public',
    'internal',
    'confidential',
    'restricted',
    'secret'
);


ALTER TYPE public.business_applications_data_classification_enum OWNER TO postgres;

--
-- Name: business_applications_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.business_applications_status_enum AS ENUM (
    'active',
    'inactive',
    'deprecated',
    'planned'
);


ALTER TYPE public.business_applications_status_enum OWNER TO postgres;

--
-- Name: compliance_assessments_assessment_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.compliance_assessments_assessment_type_enum AS ENUM (
    'automatic',
    'manual',
    'scheduled'
);


ALTER TYPE public.compliance_assessments_assessment_type_enum OWNER TO postgres;

--
-- Name: compliance_assessments_new_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.compliance_assessments_new_status_enum AS ENUM (
    'not_assessed',
    'compliant',
    'non_compliant',
    'partially_compliant',
    'not_applicable',
    'requires_review'
);


ALTER TYPE public.compliance_assessments_new_status_enum OWNER TO postgres;

--
-- Name: compliance_assessments_previous_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.compliance_assessments_previous_status_enum AS ENUM (
    'not_assessed',
    'compliant',
    'non_compliant',
    'partially_compliant',
    'not_applicable',
    'requires_review'
);


ALTER TYPE public.compliance_assessments_previous_status_enum OWNER TO postgres;

--
-- Name: compliance_requirements_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.compliance_requirements_status_enum AS ENUM (
    'not_started',
    'in_progress',
    'compliant',
    'non_compliant',
    'partially_compliant'
);


ALTER TYPE public.compliance_requirements_status_enum OWNER TO postgres;

--
-- Name: compliance_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.compliance_status_enum AS ENUM (
    'not_assessed',
    'compliant',
    'non_compliant',
    'partially_compliant',
    'not_applicable',
    'requires_review'
);


ALTER TYPE public.compliance_status_enum OWNER TO postgres;

--
-- Name: confidence_level_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.confidence_level_enum AS ENUM (
    'high',
    'medium',
    'low'
);


ALTER TYPE public.confidence_level_enum OWNER TO postgres;

--
-- Name: control_complexity_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.control_complexity_enum AS ENUM (
    'high',
    'medium',
    'low'
);


ALTER TYPE public.control_complexity_enum OWNER TO postgres;

--
-- Name: control_cost_impact_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.control_cost_impact_enum AS ENUM (
    'high',
    'medium',
    'low'
);


ALTER TYPE public.control_cost_impact_enum OWNER TO postgres;

--
-- Name: control_relationship_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.control_relationship_type_enum AS ENUM (
    'depends_on',
    'compensates_for',
    'supports',
    'related_to'
);


ALTER TYPE public.control_relationship_type_enum OWNER TO postgres;

--
-- Name: control_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.control_status_enum AS ENUM (
    'draft',
    'active',
    'deprecated'
);


ALTER TYPE public.control_status_enum OWNER TO postgres;

--
-- Name: control_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.control_type_enum AS ENUM (
    'preventive',
    'detective',
    'corrective',
    'compensating',
    'administrative',
    'technical',
    'physical'
);


ALTER TYPE public.control_type_enum OWNER TO postgres;

--
-- Name: evidence_link_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.evidence_link_type_enum AS ENUM (
    'control',
    'assessment',
    'finding',
    'asset',
    'policy',
    'standard'
);


ALTER TYPE public.evidence_link_type_enum OWNER TO postgres;

--
-- Name: evidence_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.evidence_status_enum AS ENUM (
    'draft',
    'under_review',
    'approved',
    'expired',
    'rejected'
);


ALTER TYPE public.evidence_status_enum OWNER TO postgres;

--
-- Name: evidence_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.evidence_type_enum AS ENUM (
    'policy_document',
    'configuration_screenshot',
    'system_log',
    'scan_report',
    'test_result',
    'certification',
    'training_record',
    'meeting_minutes',
    'email_correspondence',
    'contract',
    'other'
);


ALTER TYPE public.evidence_type_enum OWNER TO postgres;

--
-- Name: exception_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.exception_status_enum AS ENUM (
    'requested',
    'under_review',
    'approved',
    'rejected',
    'expired',
    'revoked'
);


ALTER TYPE public.exception_status_enum OWNER TO postgres;

--
-- Name: execution_outcome_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.execution_outcome_enum AS ENUM (
    'successful',
    'failed',
    'partially_completed',
    'cancelled'
);


ALTER TYPE public.execution_outcome_enum OWNER TO postgres;

--
-- Name: field_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.field_type_enum AS ENUM (
    'text',
    'number',
    'date',
    'boolean',
    'select',
    'multi_select',
    'textarea',
    'email',
    'url'
);


ALTER TYPE public.field_type_enum OWNER TO postgres;

--
-- Name: finding_severity_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.finding_severity_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low',
    'informational'
);


ALTER TYPE public.finding_severity_enum OWNER TO postgres;

--
-- Name: finding_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.finding_status_enum AS ENUM (
    'open',
    'in_progress',
    'closed',
    'risk_accepted',
    'false_positive',
    'resolved'
);


ALTER TYPE public.finding_status_enum OWNER TO postgres;

--
-- Name: framework_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.framework_status_enum AS ENUM (
    'active',
    'draft',
    'deprecated'
);


ALTER TYPE public.framework_status_enum OWNER TO postgres;

--
-- Name: impact_level_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.impact_level_enum AS ENUM (
    'negligible',
    'minor',
    'moderate',
    'major',
    'catastrophic'
);


ALTER TYPE public.impact_level_enum OWNER TO postgres;

--
-- Name: implementation_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.implementation_status_enum AS ENUM (
    'not_implemented',
    'planned',
    'in_progress',
    'implemented',
    'not_applicable'
);


ALTER TYPE public.implementation_status_enum OWNER TO postgres;

--
-- Name: import_logs_filetype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.import_logs_filetype_enum AS ENUM (
    'csv',
    'excel'
);


ALTER TYPE public.import_logs_filetype_enum OWNER TO postgres;

--
-- Name: import_logs_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.import_logs_status_enum AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'partial'
);


ALTER TYPE public.import_logs_status_enum OWNER TO postgres;

--
-- Name: influencer_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.influencer_category_enum AS ENUM (
    'internal',
    'contractual',
    'statutory',
    'regulatory',
    'industry_standard'
);


ALTER TYPE public.influencer_category_enum OWNER TO postgres;

--
-- Name: influencer_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.influencer_status_enum AS ENUM (
    'active',
    'pending',
    'superseded',
    'retired'
);


ALTER TYPE public.influencer_status_enum OWNER TO postgres;

--
-- Name: information_assets_criticalitylevel_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.information_assets_criticalitylevel_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low'
);


ALTER TYPE public.information_assets_criticalitylevel_enum OWNER TO postgres;

--
-- Name: information_assets_dataclassification_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.information_assets_dataclassification_enum AS ENUM (
    'public',
    'internal',
    'confidential',
    'restricted',
    'top_secret'
);


ALTER TYPE public.information_assets_dataclassification_enum OWNER TO postgres;

--
-- Name: integration_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.integration_status AS ENUM (
    'active',
    'inactive',
    'error'
);


ALTER TYPE public.integration_status OWNER TO postgres;

--
-- Name: integration_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.integration_type AS ENUM (
    'cmdb',
    'asset_management_system',
    'rest_api',
    'webhook'
);


ALTER TYPE public.integration_type OWNER TO postgres;

--
-- Name: kci_data_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kci_data_type_enum AS ENUM (
    'percentage',
    'count',
    'rating',
    'yes_no',
    'custom'
);


ALTER TYPE public.kci_data_type_enum OWNER TO postgres;

--
-- Name: kri_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kri_status_enum AS ENUM (
    'green',
    'amber',
    'red'
);


ALTER TYPE public.kri_status_enum OWNER TO postgres;

--
-- Name: kri_trend_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kri_trend_enum AS ENUM (
    'improving',
    'stable',
    'worsening'
);


ALTER TYPE public.kri_trend_enum OWNER TO postgres;

--
-- Name: mapping_coverage_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.mapping_coverage_enum AS ENUM (
    'full',
    'partial',
    'not_applicable'
);


ALTER TYPE public.mapping_coverage_enum OWNER TO postgres;

--
-- Name: measurement_frequency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.measurement_frequency_enum AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'annually'
);


ALTER TYPE public.measurement_frequency_enum OWNER TO postgres;

--
-- Name: notifications_priority_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notifications_priority_enum AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE public.notifications_priority_enum OWNER TO postgres;

--
-- Name: notifications_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notifications_type_enum AS ENUM (
    'workflow_approval_required',
    'workflow_approved',
    'workflow_rejected',
    'workflow_completed',
    'task_assigned',
    'task_due_soon',
    'deadline_approaching',
    'deadline_passed',
    'risk_escalated',
    'policy_review_required',
    'general'
);


ALTER TYPE public.notifications_type_enum OWNER TO postgres;

--
-- Name: obligation_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.obligation_status_enum AS ENUM (
    'met',
    'not_met',
    'in_progress',
    'not_applicable'
);


ALTER TYPE public.obligation_status_enum OWNER TO postgres;

--
-- Name: physical_assets_assettype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.physical_assets_assettype_enum AS ENUM (
    'server',
    'workstation',
    'network_device',
    'mobile_device',
    'iot_device',
    'printer',
    'storage_device',
    'other'
);


ALTER TYPE public.physical_assets_assettype_enum OWNER TO postgres;

--
-- Name: physical_assets_connectivitystatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.physical_assets_connectivitystatus_enum AS ENUM (
    'connected',
    'disconnected',
    'unknown'
);


ALTER TYPE public.physical_assets_connectivitystatus_enum OWNER TO postgres;

--
-- Name: physical_assets_criticalitylevel_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.physical_assets_criticalitylevel_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low'
);


ALTER TYPE public.physical_assets_criticalitylevel_enum OWNER TO postgres;

--
-- Name: physical_assets_networkapprovalstatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.physical_assets_networkapprovalstatus_enum AS ENUM (
    'approved',
    'pending',
    'rejected',
    'not_required'
);


ALTER TYPE public.physical_assets_networkapprovalstatus_enum OWNER TO postgres;

--
-- Name: policies_policytype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.policies_policytype_enum AS ENUM (
    'security',
    'compliance',
    'operational',
    'it',
    'hr',
    'finance'
);


ALTER TYPE public.policies_policytype_enum OWNER TO postgres;

--
-- Name: policies_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.policies_status_enum AS ENUM (
    'draft',
    'active',
    'under_review',
    'archived'
);


ALTER TYPE public.policies_status_enum OWNER TO postgres;

--
-- Name: policy_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.policy_status_enum AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published',
    'archived'
);


ALTER TYPE public.policy_status_enum OWNER TO postgres;

--
-- Name: report_templates_format_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.report_templates_format_enum AS ENUM (
    'excel',
    'pdf',
    'csv'
);


ALTER TYPE public.report_templates_format_enum OWNER TO postgres;

--
-- Name: report_templates_report_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.report_templates_report_type_enum AS ENUM (
    'asset_inventory',
    'compliance_report',
    'security_test_report',
    'software_inventory',
    'contract_expiration',
    'supplier_criticality',
    'custom'
);


ALTER TYPE public.report_templates_report_type_enum OWNER TO postgres;

--
-- Name: report_templates_schedule_frequency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.report_templates_schedule_frequency_enum AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'yearly'
);


ALTER TYPE public.report_templates_schedule_frequency_enum OWNER TO postgres;

--
-- Name: review_frequency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.review_frequency_enum AS ENUM (
    'annual',
    'biennial',
    'triennial',
    'quarterly',
    'monthly',
    'as_needed'
);


ALTER TYPE public.review_frequency_enum OWNER TO postgres;

--
-- Name: risk_asset_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risk_asset_type_enum AS ENUM (
    'physical',
    'information',
    'software',
    'application',
    'supplier'
);


ALTER TYPE public.risk_asset_type_enum OWNER TO postgres;

--
-- Name: risk_level_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risk_level_enum AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


ALTER TYPE public.risk_level_enum OWNER TO postgres;

--
-- Name: risk_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risk_status_enum AS ENUM (
    'active',
    'monitoring',
    'closed',
    'accepted'
);


ALTER TYPE public.risk_status_enum OWNER TO postgres;

--
-- Name: risk_tolerance_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risk_tolerance_enum AS ENUM (
    'low',
    'medium',
    'high'
);


ALTER TYPE public.risk_tolerance_enum OWNER TO postgres;

--
-- Name: risk_velocity_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risk_velocity_enum AS ENUM (
    'slow',
    'medium',
    'fast',
    'immediate'
);


ALTER TYPE public.risk_velocity_enum OWNER TO postgres;

--
-- Name: risks_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risks_category_enum AS ENUM (
    'cybersecurity',
    'data_privacy',
    'compliance',
    'operational',
    'financial',
    'strategic',
    'reputational'
);


ALTER TYPE public.risks_category_enum OWNER TO postgres;

--
-- Name: risks_impact_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risks_impact_enum AS ENUM (
    '1',
    '2',
    '3',
    '4',
    '5'
);


ALTER TYPE public.risks_impact_enum OWNER TO postgres;

--
-- Name: risks_likelihood_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risks_likelihood_enum AS ENUM (
    '1',
    '2',
    '3',
    '4',
    '5'
);


ALTER TYPE public.risks_likelihood_enum OWNER TO postgres;

--
-- Name: risks_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risks_status_enum AS ENUM (
    'identified',
    'assessed',
    'mitigated',
    'accepted',
    'closed'
);


ALTER TYPE public.risks_status_enum OWNER TO postgres;

--
-- Name: security_test_results_asset_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.security_test_results_asset_type_enum AS ENUM (
    'application',
    'software'
);


ALTER TYPE public.security_test_results_asset_type_enum OWNER TO postgres;

--
-- Name: severity_level_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.severity_level_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low',
    'info',
    'passed'
);


ALTER TYPE public.severity_level_enum OWNER TO postgres;

--
-- Name: software_assets_criticalitylevel_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.software_assets_criticalitylevel_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low'
);


ALTER TYPE public.software_assets_criticalitylevel_enum OWNER TO postgres;

--
-- Name: software_assets_softwaretype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.software_assets_softwaretype_enum AS ENUM (
    'operating_system',
    'application_software',
    'development_tool',
    'database_software',
    'security_software',
    'utility',
    'other'
);


ALTER TYPE public.software_assets_softwaretype_enum OWNER TO postgres;

--
-- Name: sop_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sop_category_enum AS ENUM (
    'operational',
    'security',
    'compliance',
    'third_party',
    'incident_response',
    'business_continuity',
    'other'
);


ALTER TYPE public.sop_category_enum OWNER TO postgres;

--
-- Name: sop_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sop_status_enum AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published',
    'archived'
);


ALTER TYPE public.sop_status_enum OWNER TO postgres;

--
-- Name: standard_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.standard_status_enum AS ENUM (
    'draft',
    'in_review',
    'approved',
    'published',
    'archived'
);


ALTER TYPE public.standard_status_enum OWNER TO postgres;

--
-- Name: suppliers_criticalitylevel_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.suppliers_criticalitylevel_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low'
);


ALTER TYPE public.suppliers_criticalitylevel_enum OWNER TO postgres;

--
-- Name: suppliers_suppliertype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.suppliers_suppliertype_enum AS ENUM (
    'vendor',
    'consultant',
    'service_provider',
    'contractor',
    'partner',
    'other'
);


ALTER TYPE public.suppliers_suppliertype_enum OWNER TO postgres;

--
-- Name: sync_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sync_status AS ENUM (
    'pending',
    'running',
    'completed',
    'failed',
    'partial'
);


ALTER TYPE public.sync_status OWNER TO postgres;

--
-- Name: tasks_priority_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tasks_priority_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low'
);


ALTER TYPE public.tasks_priority_enum OWNER TO postgres;

--
-- Name: tasks_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tasks_status_enum AS ENUM (
    'todo',
    'in_progress',
    'review',
    'completed',
    'cancelled'
);


ALTER TYPE public.tasks_status_enum OWNER TO postgres;

--
-- Name: tasks_tasktype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tasks_tasktype_enum AS ENUM (
    'policy_review',
    'risk_mitigation',
    'compliance_requirement',
    'audit',
    'vendor_assessment'
);


ALTER TYPE public.tasks_tasktype_enum OWNER TO postgres;

--
-- Name: test_frequency_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.test_frequency_enum AS ENUM (
    'weekly',
    'monthly',
    'quarterly',
    'semi_annually',
    'annually',
    'ad_hoc'
);


ALTER TYPE public.test_frequency_enum OWNER TO postgres;

--
-- Name: test_result_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.test_result_enum AS ENUM (
    'pass',
    'fail',
    'not_tested',
    'inconclusive'
);


ALTER TYPE public.test_result_enum OWNER TO postgres;

--
-- Name: test_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.test_status_enum AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'failed',
    'cancelled'
);


ALTER TYPE public.test_status_enum OWNER TO postgres;

--
-- Name: test_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.test_type_enum AS ENUM (
    'penetration_test',
    'vulnerability_scan',
    'code_review',
    'compliance_audit',
    'security_assessment',
    'other'
);


ALTER TYPE public.test_type_enum OWNER TO postgres;

--
-- Name: threat_source_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.threat_source_enum AS ENUM (
    'internal',
    'external',
    'natural'
);


ALTER TYPE public.threat_source_enum OWNER TO postgres;

--
-- Name: treatment_priority_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.treatment_priority_enum AS ENUM (
    'critical',
    'high',
    'medium',
    'low'
);


ALTER TYPE public.treatment_priority_enum OWNER TO postgres;

--
-- Name: treatment_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.treatment_status_enum AS ENUM (
    'planned',
    'in_progress',
    'completed',
    'deferred',
    'cancelled'
);


ALTER TYPE public.treatment_status_enum OWNER TO postgres;

--
-- Name: treatment_strategy_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.treatment_strategy_enum AS ENUM (
    'mitigate',
    'transfer',
    'avoid',
    'accept'
);


ALTER TYPE public.treatment_strategy_enum OWNER TO postgres;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'super_admin',
    'admin',
    'compliance_officer',
    'risk_manager',
    'auditor',
    'user'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

--
-- Name: users_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_status_enum AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending'
);


ALTER TYPE public.users_status_enum OWNER TO postgres;

--
-- Name: validation_rules_asset_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.validation_rules_asset_type_enum AS ENUM (
    'physical',
    'information',
    'application',
    'software',
    'supplier',
    'all'
);


ALTER TYPE public.validation_rules_asset_type_enum OWNER TO postgres;

--
-- Name: validation_rules_severity_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.validation_rules_severity_enum AS ENUM (
    'error',
    'warning'
);


ALTER TYPE public.validation_rules_severity_enum OWNER TO postgres;

--
-- Name: validation_rules_validation_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.validation_rules_validation_type_enum AS ENUM (
    'required',
    'regex',
    'min_length',
    'max_length',
    'min_value',
    'max_value',
    'email',
    'url',
    'date',
    'custom'
);


ALTER TYPE public.validation_rules_validation_type_enum OWNER TO postgres;

--
-- Name: workflow_approvals_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.workflow_approvals_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);


ALTER TYPE public.workflow_approvals_status_enum OWNER TO postgres;

--
-- Name: workflow_executions_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.workflow_executions_status_enum AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'failed',
    'cancelled'
);


ALTER TYPE public.workflow_executions_status_enum OWNER TO postgres;

--
-- Name: workflows_entitytype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.workflows_entitytype_enum AS ENUM (
    'risk',
    'policy',
    'compliance_requirement',
    'task'
);


ALTER TYPE public.workflows_entitytype_enum OWNER TO postgres;

--
-- Name: workflows_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.workflows_status_enum AS ENUM (
    'active',
    'inactive',
    'archived'
);


ALTER TYPE public.workflows_status_enum OWNER TO postgres;

--
-- Name: workflows_trigger_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.workflows_trigger_enum AS ENUM (
    'manual',
    'on_create',
    'on_update',
    'on_status_change',
    'on_deadline_approaching',
    'on_deadline_passed',
    'scheduled'
);


ALTER TYPE public.workflows_trigger_enum OWNER TO postgres;

--
-- Name: workflows_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.workflows_type_enum AS ENUM (
    'approval',
    'notification',
    'escalation',
    'status_change',
    'deadline_reminder'
);


ALTER TYPE public.workflows_type_enum OWNER TO postgres;

--
-- Name: calculate_assessment_risk_score(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_assessment_risk_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        NEW.risk_score := NEW.likelihood * NEW.impact;
        NEW.risk_level := calculate_risk_level(NEW.risk_score);
        RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.calculate_assessment_risk_score() OWNER TO postgres;

--
-- Name: calculate_kri_status(numeric, numeric, numeric, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_kri_status(p_value numeric, p_threshold_green numeric, p_threshold_amber numeric, p_direction character varying) RETURNS public.kri_status_enum
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF p_value IS NULL OR p_threshold_green IS NULL OR p_threshold_amber IS NULL THEN
          RETURN NULL;
        END IF;
        
        IF p_direction = 'lower_better' THEN
          IF p_value <= p_threshold_green THEN
            RETURN 'green';
          ELSIF p_value <= p_threshold_amber THEN
            RETURN 'amber';
          ELSE
            RETURN 'red';
          END IF;
        ELSE -- higher_better
          IF p_value >= p_threshold_green THEN
            RETURN 'green';
          ELSIF p_value >= p_threshold_amber THEN
            RETURN 'amber';
          ELSE
            RETURN 'red';
          END IF;
        END IF;
      END;
      $$;


ALTER FUNCTION public.calculate_kri_status(p_value numeric, p_threshold_green numeric, p_threshold_amber numeric, p_direction character varying) OWNER TO postgres;

--
-- Name: calculate_risk_level(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_risk_level(score integer) RETURNS public.risk_level_enum
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF score >= 20 THEN
          RETURN 'critical';
        ELSIF score >= 12 THEN
          RETURN 'high';
        ELSIF score >= 6 THEN
          RETURN 'medium';
        ELSE
          RETURN 'low';
        END IF;
      END;
      $$;


ALTER FUNCTION public.calculate_risk_level(score integer) OWNER TO postgres;

--
-- Name: calculate_treatment_residual_score(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_treatment_residual_score() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF NEW.residual_likelihood IS NOT NULL AND NEW.residual_impact IS NOT NULL THEN
          NEW.residual_risk_score := NEW.residual_likelihood * NEW.residual_impact;
        END IF;
        RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.calculate_treatment_residual_score() OWNER TO postgres;

--
-- Name: generate_kri_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_kri_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF NEW.kri_id IS NULL THEN
          NEW.kri_id := 'KRI-' || LPAD(nextval('kri_id_seq')::TEXT, 4, '0');
        END IF;
        RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.generate_kri_id() OWNER TO postgres;

--
-- Name: generate_risk_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_risk_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF NEW.risk_id IS NULL THEN
          NEW.risk_id := 'RISK-' || LPAD(nextval('risk_id_seq')::TEXT, 4, '0');
        END IF;
        RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.generate_risk_id() OWNER TO postgres;

--
-- Name: generate_treatment_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_treatment_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF NEW.treatment_id IS NULL THEN
          NEW.treatment_id := 'TRT-' || LPAD(nextval('treatment_id_seq')::TEXT, 4, '0');
        END IF;
        RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.generate_treatment_id() OWNER TO postgres;

--
-- Name: mark_previous_assessments_not_latest(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.mark_previous_assessments_not_latest() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        IF NEW.is_latest = true THEN
          UPDATE risk_assessments
          SET is_latest = false
          WHERE risk_id = NEW.risk_id
            AND assessment_type = NEW.assessment_type
            AND id != NEW.id
            AND is_latest = true;
        END IF;
        RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.mark_previous_assessments_not_latest() OWNER TO postgres;

--
-- Name: update_kri_on_measurement(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_kri_on_measurement() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      DECLARE
        kri_record RECORD;
        new_status kri_status_enum;
        prev_value DECIMAL;
        new_trend kri_trend_enum;
      BEGIN
        -- Get KRI details
        SELECT * INTO kri_record FROM kris WHERE id = NEW.kri_id;
        
        -- Calculate status
        new_status := calculate_kri_status(
          NEW.value,
          kri_record.threshold_green,
          kri_record.threshold_amber,
          kri_record.threshold_direction
        );
        
        -- Update measurement status
        NEW.status := new_status;
        
        -- Get previous value for trend calculation
        SELECT value INTO prev_value
        FROM kri_measurements
        WHERE kri_id = NEW.kri_id
          AND measurement_date < NEW.measurement_date
        ORDER BY measurement_date DESC
        LIMIT 1;
        
        -- Calculate trend
        IF prev_value IS NOT NULL THEN
          IF kri_record.threshold_direction = 'lower_better' THEN
            IF NEW.value < prev_value THEN
              new_trend := 'improving';
            ELSIF NEW.value > prev_value THEN
              new_trend := 'worsening';
            ELSE
              new_trend := 'stable';
            END IF;
          ELSE
            IF NEW.value > prev_value THEN
              new_trend := 'improving';
            ELSIF NEW.value < prev_value THEN
              new_trend := 'worsening';
            ELSE
              new_trend := 'stable';
            END IF;
          END IF;
        END IF;
        
        -- Update KRI record
        UPDATE kris
        SET current_value = NEW.value,
            current_status = new_status,
            trend = COALESCE(new_trend, trend),
            last_measured_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.kri_id;
        
        RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.update_kri_on_measurement() OWNER TO postgres;

--
-- Name: update_risk_scores(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_risk_scores() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      BEGIN
        -- Calculate inherent risk score
        IF NEW.inherent_likelihood IS NOT NULL AND NEW.inherent_impact IS NOT NULL THEN
          NEW.inherent_risk_score := NEW.inherent_likelihood * NEW.inherent_impact;
          NEW.inherent_risk_level := calculate_risk_level(NEW.inherent_risk_score);
        END IF;
        
        -- Calculate current risk score
        IF NEW.current_likelihood IS NOT NULL AND NEW.current_impact IS NOT NULL THEN
          NEW.current_risk_score := NEW.current_likelihood * NEW.current_impact;
          NEW.current_risk_level := calculate_risk_level(NEW.current_risk_score);
        END IF;
        
        -- Calculate target risk score
        IF NEW.target_likelihood IS NOT NULL AND NEW.target_impact IS NOT NULL THEN
          NEW.target_risk_score := NEW.target_likelihood * NEW.target_impact;
          NEW.target_risk_level := calculate_risk_level(NEW.target_risk_score);
        END IF;
        
        RETURN NEW;
      END;
      $$;


ALTER FUNCTION public.update_risk_scores() OWNER TO postgres;

--
-- Name: update_treatment_progress(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_treatment_progress() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
      DECLARE
        total_tasks INTEGER;
        completed_tasks INTEGER;
        progress INTEGER;
      BEGIN
        SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
        INTO total_tasks, completed_tasks
        FROM treatment_tasks
        WHERE treatment_id = COALESCE(NEW.treatment_id, OLD.treatment_id);
        
        IF total_tasks > 0 THEN
          progress := (completed_tasks * 100 / total_tasks);
        ELSE
          progress := 0;
        END IF;
        
        UPDATE risk_treatments
        SET progress_percentage = progress,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = COALESCE(NEW.treatment_id, OLD.treatment_id);
        
        RETURN COALESCE(NEW, OLD);
      END;
      $$;


ALTER FUNCTION public.update_treatment_progress() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assessment_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_results (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    assessment_id uuid NOT NULL,
    unified_control_id uuid NOT NULL,
    assessor_id uuid,
    assessment_date date,
    assessment_procedure_followed text,
    result public.assessment_result_enum NOT NULL,
    effectiveness_rating integer,
    findings text,
    observations text,
    recommendations text,
    evidence_collected jsonb,
    requires_remediation boolean DEFAULT false NOT NULL,
    remediation_due_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT effectiveness_rating_range CHECK (((effectiveness_rating IS NULL) OR ((effectiveness_rating >= 1) AND (effectiveness_rating <= 5))))
);


ALTER TABLE public.assessment_results OWNER TO postgres;

--
-- Name: assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    assessment_identifier character varying(100) NOT NULL,
    name character varying(500) NOT NULL,
    description text,
    scope_description text,
    selected_control_ids uuid[],
    selected_framework_ids uuid[],
    start_date date,
    end_date date,
    status public.assessment_status_enum DEFAULT 'not_started'::public.assessment_status_enum NOT NULL,
    lead_assessor_id uuid,
    assessor_ids uuid[],
    controls_assessed integer DEFAULT 0 NOT NULL,
    controls_total integer,
    findings_critical integer DEFAULT 0 NOT NULL,
    findings_high integer DEFAULT 0 NOT NULL,
    findings_medium integer DEFAULT 0 NOT NULL,
    findings_low integer DEFAULT 0 NOT NULL,
    overall_score numeric(5,2),
    assessment_procedures text,
    report_path text,
    approved_by uuid,
    approval_date date,
    tags character varying[],
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    assessment_type character varying(50) DEFAULT 'compliance'::character varying
);


ALTER TABLE public.assessments OWNER TO postgres;

--
-- Name: asset_audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    asset_type public.asset_audit_logs_asset_type_enum NOT NULL,
    asset_id uuid NOT NULL,
    action public.asset_audit_logs_action_enum NOT NULL,
    field_name character varying(255),
    old_value text,
    new_value text,
    changed_by_id uuid,
    change_reason text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.asset_audit_logs OWNER TO postgres;

--
-- Name: asset_dependencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_dependencies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    source_asset_type public.asset_dependencies_source_asset_type_enum NOT NULL,
    source_asset_id uuid NOT NULL,
    target_asset_type public.asset_dependencies_target_asset_type_enum NOT NULL,
    target_asset_id uuid NOT NULL,
    relationship_type public.asset_dependencies_relationship_type_enum DEFAULT 'depends_on'::public.asset_dependencies_relationship_type_enum NOT NULL,
    description text,
    created_by_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.asset_dependencies OWNER TO postgres;

--
-- Name: asset_field_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_field_configs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    asset_type public.asset_type_enum NOT NULL,
    field_name character varying(100) NOT NULL,
    display_name character varying(200) NOT NULL,
    field_type public.field_type_enum NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    display_order integer,
    validation_rule text,
    validation_message text,
    select_options jsonb,
    default_value text,
    help_text text,
    field_dependencies jsonb,
    created_by_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.asset_field_configs OWNER TO postgres;

--
-- Name: asset_requirement_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_requirement_mapping (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    requirement_id uuid NOT NULL,
    assessed_by uuid,
    notes text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    asset_type character varying(50) NOT NULL,
    asset_id uuid NOT NULL,
    compliance_status public.asset_requirement_mapping_compliance_status_enum DEFAULT 'not_assessed'::public.asset_requirement_mapping_compliance_status_enum NOT NULL,
    last_assessed_at timestamp without time zone,
    evidence_urls jsonb DEFAULT '[]'::jsonb NOT NULL,
    auto_assessed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.asset_requirement_mapping OWNER TO postgres;

--
-- Name: asset_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_types (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category public.asset_types_category_enum NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.asset_types OWNER TO postgres;

--
-- Name: business_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.business_applications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description text,
    version_number character varying(100),
    vendor character varying(255),
    owner_id uuid,
    department character varying(255),
    status public.business_applications_status_enum DEFAULT 'active'::public.business_applications_status_enum NOT NULL,
    url text,
    notes text,
    created_by_id uuid,
    updated_by_id uuid,
    unique_identifier character varying(255) NOT NULL,
    application_name character varying(255) NOT NULL,
    application_type public.business_applications_applicationtype_enum DEFAULT 'other'::public.business_applications_applicationtype_enum NOT NULL,
    patch_level character varying(100),
    "vendorContact" character varying(255),
    "vendorEmail" character varying(255),
    "vendorPhone" character varying(50),
    "ownerId" uuid,
    business_unit character varying(255),
    criticality_level public.business_applications_criticalitylevel_enum DEFAULT 'medium'::public.business_applications_criticalitylevel_enum NOT NULL,
    "dataTypesProcessed" text,
    "processesPII" boolean DEFAULT false NOT NULL,
    "processesPHI" boolean DEFAULT false NOT NULL,
    "processesFinancialData" boolean DEFAULT false NOT NULL,
    "hostingLocation" character varying(255),
    compliance_requirements text,
    "customAttributes" jsonb,
    deleted_at timestamp without time zone,
    deleted_by uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    business_unit_id uuid,
    business_purpose text,
    data_processed jsonb,
    data_classification public.business_applications_data_classification_enum,
    vendor_name character varying(200),
    vendor_contact jsonb,
    license_type character varying(100),
    license_count integer,
    license_expiry date,
    hosting_type character varying(100),
    hosting_location text,
    access_url text,
    security_test_results jsonb,
    last_security_test_date date,
    authentication_method character varying(100)
);


ALTER TABLE public.business_applications OWNER TO postgres;

--
-- Name: business_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.business_units (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    code character varying(50),
    parent_id uuid,
    description text,
    manager_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.business_units OWNER TO postgres;

--
-- Name: compliance_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compliance_assessments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    requirement_id uuid NOT NULL,
    assessed_by uuid,
    notes text,
    asset_type character varying(50) NOT NULL,
    asset_id uuid NOT NULL,
    assessment_type public.compliance_assessments_assessment_type_enum DEFAULT 'automatic'::public.compliance_assessments_assessment_type_enum NOT NULL,
    previous_status public.compliance_assessments_previous_status_enum,
    new_status public.compliance_assessments_new_status_enum NOT NULL,
    validation_results jsonb,
    assessed_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.compliance_assessments OWNER TO postgres;

--
-- Name: compliance_frameworks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compliance_frameworks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50),
    description text,
    region character varying(50),
    "organizationId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.compliance_frameworks OWNER TO postgres;

--
-- Name: compliance_obligations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compliance_obligations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    influencer_id uuid NOT NULL,
    obligation_text text NOT NULL,
    obligation_category character varying(200),
    priority character varying(50),
    responsible_party_id uuid,
    status public.obligation_status_enum DEFAULT 'not_met'::public.obligation_status_enum NOT NULL,
    due_date date,
    completion_date date,
    notes text,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.compliance_obligations OWNER TO postgres;

--
-- Name: compliance_requirements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compliance_requirements (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "requirementCode" character varying(50),
    status public.compliance_requirements_status_enum DEFAULT 'not_started'::public.compliance_requirements_status_enum NOT NULL,
    "organizationId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    framework_id uuid NOT NULL,
    category character varying(255),
    "complianceDeadline" character varying(255),
    applicability character varying(255)
);


ALTER TABLE public.compliance_requirements OWNER TO postgres;

--
-- Name: compliance_validation_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compliance_validation_rules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    requirement_id uuid NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    created_by uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    asset_type character varying(50) NOT NULL,
    rule_name character varying(255) NOT NULL,
    rule_description text,
    validation_logic jsonb NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.compliance_validation_rules OWNER TO postgres;

--
-- Name: control_asset_mappings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.control_asset_mappings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unified_control_id uuid NOT NULL,
    asset_type character varying(100) NOT NULL,
    asset_id uuid NOT NULL,
    implementation_date date,
    implementation_status public.implementation_status_enum DEFAULT 'not_implemented'::public.implementation_status_enum NOT NULL,
    implementation_notes text,
    last_test_date date,
    last_test_result character varying(100),
    effectiveness_score integer,
    is_automated boolean DEFAULT false NOT NULL,
    mapped_by uuid,
    mapped_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT effectiveness_score_range CHECK (((effectiveness_score IS NULL) OR ((effectiveness_score >= 1) AND (effectiveness_score <= 5))))
);


ALTER TABLE public.control_asset_mappings OWNER TO postgres;

--
-- Name: control_dependencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.control_dependencies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    source_control_id uuid NOT NULL,
    target_control_id uuid NOT NULL,
    relationship_type public.control_relationship_type_enum NOT NULL,
    description text,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT no_self_dependency CHECK ((source_control_id <> target_control_id))
);


ALTER TABLE public.control_dependencies OWNER TO postgres;

--
-- Name: control_objectives; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.control_objectives (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    objective_identifier character varying(100) NOT NULL,
    policy_id uuid NOT NULL,
    statement text NOT NULL,
    rationale text,
    domain character varying(200),
    priority character varying(50),
    mandatory boolean DEFAULT true NOT NULL,
    responsible_party_id uuid,
    implementation_status public.implementation_status_enum DEFAULT 'not_implemented'::public.implementation_status_enum NOT NULL,
    target_implementation_date date,
    actual_implementation_date date,
    linked_influencers uuid[],
    display_order integer,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.control_objectives OWNER TO postgres;

--
-- Name: distribution_list_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.distribution_list_users (
    distribution_list_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.distribution_list_users OWNER TO postgres;

--
-- Name: email_distribution_lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_distribution_lists (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    email_addresses text[] NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.email_distribution_lists OWNER TO postgres;

--
-- Name: evidence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evidence (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    evidence_identifier character varying(100) NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    evidence_type public.evidence_type_enum NOT NULL,
    filename character varying(500),
    file_path text NOT NULL,
    file_size bigint,
    mime_type character varying(200),
    file_hash character varying(128),
    collection_date date DEFAULT CURRENT_DATE NOT NULL,
    valid_from_date date,
    valid_until_date date,
    collector_id uuid,
    status public.evidence_status_enum DEFAULT 'draft'::public.evidence_status_enum NOT NULL,
    approved_by uuid,
    approval_date date,
    rejection_reason text,
    tags character varying[],
    custom_metadata jsonb,
    confidential boolean DEFAULT false NOT NULL,
    restricted_to_roles uuid[],
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.evidence OWNER TO postgres;

--
-- Name: evidence_linkages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evidence_linkages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    evidence_id uuid NOT NULL,
    link_type public.evidence_link_type_enum NOT NULL,
    linked_entity_id uuid NOT NULL,
    link_description text,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.evidence_linkages OWNER TO postgres;

--
-- Name: findings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.findings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    finding_identifier character varying(100) NOT NULL,
    assessment_id uuid,
    assessment_result_id uuid,
    source_type character varying(100),
    source_name character varying(300),
    unified_control_id uuid,
    asset_type character varying(100),
    asset_id uuid,
    title character varying(500) NOT NULL,
    description text NOT NULL,
    severity public.finding_severity_enum NOT NULL,
    finding_date date DEFAULT CURRENT_DATE NOT NULL,
    status public.finding_status_enum DEFAULT 'open'::public.finding_status_enum NOT NULL,
    remediation_owner_id uuid,
    remediation_plan text,
    remediation_due_date date,
    remediation_completed_date date,
    remediation_evidence jsonb,
    risk_accepted_by uuid,
    risk_acceptance_justification text,
    risk_acceptance_date date,
    risk_acceptance_expiry date,
    retest_required boolean DEFAULT false NOT NULL,
    retest_date date,
    retest_result character varying(100),
    tags character varying[],
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.findings OWNER TO postgres;

--
-- Name: framework_control_mappings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.framework_control_mappings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    framework_requirement_id uuid NOT NULL,
    unified_control_id uuid NOT NULL,
    coverage_level public.mapping_coverage_enum DEFAULT 'full'::public.mapping_coverage_enum NOT NULL,
    mapping_notes text,
    mapped_by uuid,
    mapped_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.framework_control_mappings OWNER TO postgres;

--
-- Name: framework_requirements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.framework_requirements (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    framework_id uuid NOT NULL,
    requirement_identifier character varying(200) NOT NULL,
    requirement_text text NOT NULL,
    domain character varying(200),
    category character varying(200),
    sub_category character varying(200),
    priority character varying(50),
    requirement_type character varying(100),
    display_order integer,
    notes text,
    reference_links text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.framework_requirements OWNER TO postgres;

--
-- Name: governance_metric_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.governance_metric_snapshots (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    snapshot_date date NOT NULL,
    compliance_rate double precision DEFAULT 0 NOT NULL,
    implemented_controls integer DEFAULT 0 NOT NULL,
    total_controls integer DEFAULT 0 NOT NULL,
    open_findings integer DEFAULT 0 NOT NULL,
    critical_findings integer DEFAULT 0 NOT NULL,
    assessment_completion_rate double precision DEFAULT 0 NOT NULL,
    risk_closure_rate double precision DEFAULT 0 NOT NULL,
    completed_assessments integer DEFAULT 0 NOT NULL,
    total_assessments integer DEFAULT 0 NOT NULL,
    approved_evidence integer DEFAULT 0 NOT NULL,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.governance_metric_snapshots OWNER TO postgres;

--
-- Name: import_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.import_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "fileName" character varying(255) NOT NULL,
    "fileType" public.import_logs_filetype_enum NOT NULL,
    "assetType" character varying(50) NOT NULL,
    status public.import_logs_status_enum DEFAULT 'pending'::public.import_logs_status_enum NOT NULL,
    "totalRecords" integer DEFAULT 0 NOT NULL,
    "successfulImports" integer DEFAULT 0 NOT NULL,
    "failedImports" integer DEFAULT 0 NOT NULL,
    "errorReport" text,
    "fieldMapping" jsonb,
    "importedById" uuid NOT NULL,
    notes text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "completedAt" timestamp without time zone,
    imported_by_id uuid
);


ALTER TABLE public.import_logs OWNER TO postgres;

--
-- Name: influencers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.influencers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(500) NOT NULL,
    category public.influencer_category_enum NOT NULL,
    sub_category character varying(200),
    issuing_authority character varying(300),
    jurisdiction character varying(200),
    reference_number character varying(200),
    description text,
    publication_date date,
    effective_date date,
    last_revision_date date,
    next_review_date date,
    status public.influencer_status_enum DEFAULT 'active'::public.influencer_status_enum NOT NULL,
    applicability_status public.applicability_status_enum DEFAULT 'under_review'::public.applicability_status_enum NOT NULL,
    applicability_justification text,
    applicability_assessment_date date,
    applicability_criteria jsonb,
    source_url text,
    source_document_path text,
    owner_id uuid,
    business_units_affected uuid[],
    tags character varying[],
    custom_fields jsonb,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    CONSTRAINT valid_dates CHECK ((((effective_date IS NULL) OR (publication_date IS NULL) OR (effective_date >= publication_date)) AND ((last_revision_date IS NULL) OR (publication_date IS NULL) OR (last_revision_date >= publication_date))))
);


ALTER TABLE public.influencers OWNER TO postgres;

--
-- Name: information_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.information_assets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description text,
    information_owner_id uuid,
    asset_custodian_id uuid,
    notes text,
    created_by_id uuid,
    updated_by_id uuid,
    unique_identifier character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    classification_date date,
    reclassification_date date,
    "ownerId" uuid,
    "custodianId" uuid,
    criticality_level public.information_assets_criticalitylevel_enum DEFAULT 'medium'::public.information_assets_criticalitylevel_enum NOT NULL,
    compliance_requirements text,
    "storageLocation" character varying(255),
    "storageType" character varying(255),
    "retentionPolicy" text,
    "retentionExpiryDate" date,
    deleted_at timestamp without time zone,
    deleted_by uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    information_type character varying(200),
    business_unit_id uuid,
    reclassification_reminder_sent boolean DEFAULT false NOT NULL,
    asset_location text,
    storage_medium character varying(200),
    retention_period character varying(100),
    classification_level character varying(50)
);


ALTER TABLE public.information_assets OWNER TO postgres;

--
-- Name: integration_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.integration_configs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    integration_type public.integration_type NOT NULL,
    endpoint_url character varying(500) NOT NULL,
    authentication_type public.authentication_type NOT NULL,
    api_key text,
    bearer_token text,
    username character varying(255),
    password text,
    field_mapping jsonb,
    sync_interval character varying(50),
    status public.integration_status DEFAULT 'inactive'::public.integration_status NOT NULL,
    last_sync_error text,
    last_sync_at timestamp without time zone,
    next_sync_at timestamp without time zone,
    created_by_id uuid NOT NULL,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.integration_configs OWNER TO postgres;

--
-- Name: integration_sync_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.integration_sync_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    integration_config_id uuid NOT NULL,
    status public.sync_status DEFAULT 'pending'::public.sync_status NOT NULL,
    total_records integer DEFAULT 0 NOT NULL,
    successful_syncs integer DEFAULT 0 NOT NULL,
    failed_syncs integer DEFAULT 0 NOT NULL,
    skipped_records integer DEFAULT 0 NOT NULL,
    error_message text,
    sync_details jsonb,
    started_at timestamp without time zone,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.integration_sync_logs OWNER TO postgres;

--
-- Name: kri_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kri_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kri_id_seq OWNER TO postgres;

--
-- Name: kri_measurements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kri_measurements (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    kri_id uuid NOT NULL,
    measurement_date date NOT NULL,
    value numeric(15,4) NOT NULL,
    status public.kri_status_enum,
    notes text,
    measured_by uuid,
    evidence_attachments jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.kri_measurements OWNER TO postgres;

--
-- Name: kri_risk_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kri_risk_links (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    kri_id uuid NOT NULL,
    risk_id uuid NOT NULL,
    relationship_type character varying(50) DEFAULT 'indicator'::character varying NOT NULL,
    notes text,
    linked_by uuid,
    linked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.kri_risk_links OWNER TO postgres;

--
-- Name: COLUMN kri_risk_links.relationship_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kri_risk_links.relationship_type IS 'indicator, leading, lagging';


--
-- Name: kris; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kris (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    kri_id character varying(20),
    name character varying(300) NOT NULL,
    description text,
    category_id uuid,
    measurement_unit character varying(100),
    measurement_frequency public.measurement_frequency_enum DEFAULT 'monthly'::public.measurement_frequency_enum NOT NULL,
    data_source character varying(300),
    calculation_method text,
    threshold_green numeric(15,4),
    threshold_amber numeric(15,4),
    threshold_red numeric(15,4),
    threshold_direction character varying(20) DEFAULT 'lower_better'::character varying NOT NULL,
    current_value numeric(15,4),
    current_status public.kri_status_enum,
    trend public.kri_trend_enum,
    kri_owner_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    last_measured_at timestamp without time zone,
    next_measurement_due date,
    target_value numeric(15,4),
    baseline_value numeric(15,4),
    tags character varying[],
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.kris OWNER TO postgres;

--
-- Name: COLUMN kris.measurement_unit; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kris.measurement_unit IS 'e.g., %, count, days, $';


--
-- Name: COLUMN kris.threshold_green; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kris.threshold_green IS 'Upper bound for green status';


--
-- Name: COLUMN kris.threshold_amber; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kris.threshold_amber IS 'Upper bound for amber status (values above this are red)';


--
-- Name: COLUMN kris.threshold_red; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kris.threshold_red IS 'Upper bound for red status (optional, for inverted thresholds)';


--
-- Name: COLUMN kris.threshold_direction; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.kris.threshold_direction IS 'lower_better or higher_better';


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    type public.notifications_type_enum DEFAULT 'general'::public.notifications_type_enum NOT NULL,
    priority public.notifications_priority_enum DEFAULT 'medium'::public.notifications_priority_enum NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "entityType" character varying(100),
    "entityId" uuid,
    "actionUrl" character varying(500),
    metadata jsonb,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "readAt" timestamp without time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: physical_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.physical_assets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    unique_identifier character varying(255) NOT NULL,
    asset_description character varying(255) NOT NULL,
    manufacturer character varying(255),
    model character varying(255),
    serial_number character varying(100),
    location character varying(255),
    building character varying(255),
    floor character varying(255),
    room character varying(255),
    ip_addresses jsonb,
    mac_addresses jsonb,
    connectivity_status public.physical_assets_connectivitystatus_enum DEFAULT 'unknown'::public.physical_assets_connectivitystatus_enum NOT NULL,
    network_approval_status public.physical_assets_networkapprovalstatus_enum DEFAULT 'not_required'::public.physical_assets_networkapprovalstatus_enum NOT NULL,
    network_approval_date timestamp without time zone,
    "ownerId" uuid,
    department character varying(255),
    criticality_level public.physical_assets_criticalitylevel_enum DEFAULT 'medium'::public.physical_assets_criticalitylevel_enum NOT NULL,
    compliance_requirements text,
    purchase_date date,
    "warrantyExpiryDate" date,
    vendor character varying(255),
    notes text,
    deleted_at timestamp without time zone,
    deleted_by uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    owner_id uuid,
    created_by_id uuid,
    updated_by_id uuid,
    asset_type_id uuid,
    business_unit_id uuid,
    business_purpose text,
    physical_location text,
    installed_software jsonb,
    active_ports_services jsonb,
    last_connectivity_check timestamp without time zone,
    asset_tag character varying(100),
    warranty_expiry date,
    security_test_results jsonb
);


ALTER TABLE public.physical_assets OWNER TO postgres;

--
-- Name: policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.policies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "policyType" public.policies_policytype_enum DEFAULT 'compliance'::public.policies_policytype_enum NOT NULL,
    status public.policy_status_enum DEFAULT 'draft'::public.policy_status_enum NOT NULL,
    version character varying(50),
    "organizationId" uuid,
    "ownerId" uuid,
    "effectiveDate" timestamp without time zone,
    "reviewDate" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "documentUrl" character varying(500),
    "documentName" character varying(255),
    "documentMimeType" character varying(50),
    version_number integer DEFAULT 1 NOT NULL,
    content text,
    purpose text,
    scope text,
    business_units uuid[],
    approval_date date,
    review_frequency public.review_frequency_enum DEFAULT 'annual'::public.review_frequency_enum,
    next_review_date date,
    published_date date,
    linked_influencers uuid[],
    supersedes_policy_id uuid,
    attachments jsonb,
    tags character varying[],
    custom_fields jsonb,
    requires_acknowledgment boolean DEFAULT true NOT NULL,
    acknowledgment_due_days integer DEFAULT 30 NOT NULL,
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp without time zone,
    policy_type character varying(200),
    owner_id uuid,
    effective_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.policies OWNER TO postgres;

--
-- Name: policy_acknowledgments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.policy_acknowledgments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    policy_id uuid NOT NULL,
    user_id uuid NOT NULL,
    policy_version character varying(50),
    acknowledged_at timestamp without time zone,
    ip_address inet,
    user_agent text,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    due_date date,
    reminder_sent_count integer DEFAULT 0 NOT NULL,
    last_reminder_sent timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.policy_acknowledgments OWNER TO postgres;

--
-- Name: remediation_trackers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.remediation_trackers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    finding_id uuid NOT NULL,
    remediation_priority character varying(50) DEFAULT 'medium'::character varying NOT NULL,
    sla_due_date date NOT NULL,
    remediation_steps text,
    assigned_to_id uuid,
    progress_percent integer DEFAULT 0 NOT NULL,
    progress_notes text,
    completion_date date,
    sla_met boolean DEFAULT false NOT NULL,
    days_to_completion integer,
    completion_evidence jsonb,
    completion_notes text,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.remediation_trackers OWNER TO postgres;

--
-- Name: report_template_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_template_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_id uuid NOT NULL,
    version_number integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    report_type character varying(50) NOT NULL,
    format character varying(20) DEFAULT 'excel'::character varying NOT NULL,
    field_selection jsonb DEFAULT '[]'::jsonb,
    filters jsonb,
    "grouping" jsonb,
    is_scheduled boolean DEFAULT false NOT NULL,
    schedule_frequency character varying(20),
    schedule_cron character varying(50),
    schedule_time time without time zone,
    distribution_list_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    version_comment text,
    created_by_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.report_template_versions OWNER TO postgres;

--
-- Name: report_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report_templates (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    report_type public.report_templates_report_type_enum NOT NULL,
    format public.report_templates_format_enum DEFAULT 'excel'::public.report_templates_format_enum NOT NULL,
    field_selection jsonb DEFAULT '[]'::jsonb,
    filters jsonb,
    "grouping" jsonb,
    is_scheduled boolean DEFAULT false NOT NULL,
    schedule_frequency public.report_templates_schedule_frequency_enum,
    schedule_cron character varying(50),
    schedule_time time without time zone,
    distribution_list_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    last_run_at timestamp without time zone,
    next_run_at timestamp without time zone,
    created_by_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_system_template boolean DEFAULT false NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    is_shared boolean DEFAULT false NOT NULL,
    shared_with_user_ids jsonb DEFAULT '[]'::jsonb,
    shared_with_team_ids jsonb DEFAULT '[]'::jsonb,
    is_organization_wide boolean DEFAULT false NOT NULL
);


ALTER TABLE public.report_templates OWNER TO postgres;

--
-- Name: risk_assessment_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_assessment_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    request_identifier character varying(100) NOT NULL,
    risk_id uuid NOT NULL,
    requested_by_id uuid NOT NULL,
    requested_for_id uuid,
    assessment_type character varying(50) NOT NULL,
    priority character varying(20) DEFAULT 'medium'::character varying NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    due_date date,
    justification text,
    notes text,
    approval_workflow_id uuid,
    approved_by_id uuid,
    approved_at timestamp without time zone,
    rejected_by_id uuid,
    rejected_at timestamp without time zone,
    rejection_reason text,
    completed_at timestamp without time zone,
    resulting_assessment_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.risk_assessment_requests OWNER TO postgres;

--
-- Name: COLUMN risk_assessment_requests.requested_for_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessment_requests.requested_for_id IS 'Assessor/analyst who should perform the assessment';


--
-- Name: COLUMN risk_assessment_requests.assessment_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessment_requests.assessment_type IS 'inherent, current, or target';


--
-- Name: COLUMN risk_assessment_requests.priority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessment_requests.priority IS 'critical, high, medium, low';


--
-- Name: COLUMN risk_assessment_requests.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessment_requests.status IS 'pending, approved, rejected, in_progress, completed, cancelled';


--
-- Name: COLUMN risk_assessment_requests.justification; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessment_requests.justification IS 'Why this assessment is needed';


--
-- Name: COLUMN risk_assessment_requests.approval_workflow_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessment_requests.approval_workflow_id IS 'Linked workflow execution for approval';


--
-- Name: COLUMN risk_assessment_requests.resulting_assessment_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessment_requests.resulting_assessment_id IS 'Link to the risk_assessment created from this request';


--
-- Name: risk_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_assessments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    risk_id uuid NOT NULL,
    likelihood integer NOT NULL,
    impact integer NOT NULL,
    risk_score integer,
    risk_level public.risk_level_enum,
    financial_impact public.impact_level_enum,
    financial_impact_amount numeric(15,2),
    operational_impact public.impact_level_enum,
    reputational_impact public.impact_level_enum,
    compliance_impact public.impact_level_enum,
    safety_impact public.impact_level_enum,
    assessment_date date DEFAULT CURRENT_DATE NOT NULL,
    assessor_id uuid,
    assessment_method character varying(100) DEFAULT 'qualitative_5x5'::character varying NOT NULL,
    assessment_notes text,
    assumptions text,
    confidence_level public.confidence_level_enum DEFAULT 'medium'::public.confidence_level_enum NOT NULL,
    evidence_attachments jsonb,
    is_latest boolean DEFAULT true NOT NULL,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    assessment_type public.assessment_type_enum DEFAULT 'current'::public.assessment_type_enum NOT NULL
);


ALTER TABLE public.risk_assessments OWNER TO postgres;

--
-- Name: COLUMN risk_assessments.likelihood; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessments.likelihood IS '1-5 scale';


--
-- Name: COLUMN risk_assessments.impact; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessments.impact IS '1-5 scale';


--
-- Name: COLUMN risk_assessments.risk_score; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_assessments.risk_score IS 'Calculated: likelihood * impact';


--
-- Name: risk_asset_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_asset_links (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    risk_id uuid NOT NULL,
    asset_type public.risk_asset_type_enum NOT NULL,
    asset_id uuid NOT NULL,
    impact_description text,
    asset_criticality_at_link character varying(50),
    linked_by uuid,
    linked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.risk_asset_links OWNER TO postgres;

--
-- Name: COLUMN risk_asset_links.asset_criticality_at_link; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_asset_links.asset_criticality_at_link IS 'Snapshot of asset criticality when linked';


--
-- Name: risk_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    parent_category_id uuid,
    risk_tolerance public.risk_tolerance_enum DEFAULT 'medium'::public.risk_tolerance_enum NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    color character varying(20),
    icon character varying(50),
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.risk_categories OWNER TO postgres;

--
-- Name: risk_control_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_control_links (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    risk_id uuid NOT NULL,
    control_id uuid NOT NULL,
    effectiveness_rating integer,
    effectiveness_type character varying(20) DEFAULT 'scale'::character varying NOT NULL,
    control_type_for_risk character varying(50),
    notes text,
    linked_by uuid,
    linked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_effectiveness_review date,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.risk_control_links OWNER TO postgres;

--
-- Name: COLUMN risk_control_links.effectiveness_rating; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_control_links.effectiveness_rating IS '1-5 scale or percentage (0-100)';


--
-- Name: COLUMN risk_control_links.effectiveness_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_control_links.effectiveness_type IS 'scale (1-5) or percentage (0-100)';


--
-- Name: COLUMN risk_control_links.control_type_for_risk; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_control_links.control_type_for_risk IS 'How this control mitigates the risk: preventive, detective, corrective';


--
-- Name: risk_finding_links; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_finding_links (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    risk_id uuid NOT NULL,
    finding_id uuid NOT NULL,
    relationship_type character varying(50),
    notes text,
    linked_by uuid,
    linked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.risk_finding_links OWNER TO postgres;

--
-- Name: COLUMN risk_finding_links.relationship_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_finding_links.relationship_type IS 'How the finding relates to the risk: identified, contributes_to, mitigates, etc.';


--
-- Name: risk_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.risk_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.risk_id_seq OWNER TO postgres;

--
-- Name: risk_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    organization_id uuid,
    risk_levels jsonb DEFAULT '[{"color": "#22c55e", "level": "low", "maxScore": 5, "minScore": 1, "escalation": false, "description": "Acceptable risk - monitor periodically", "responseTime": "90 days"}, {"color": "#eab308", "level": "medium", "maxScore": 11, "minScore": 6, "escalation": false, "description": "Moderate risk - implement controls", "responseTime": "30 days"}, {"color": "#f97316", "level": "high", "maxScore": 19, "minScore": 12, "escalation": true, "description": "Significant risk - prioritize treatment", "responseTime": "7 days"}, {"color": "#dc2626", "level": "critical", "maxScore": 25, "minScore": 20, "escalation": true, "description": "Unacceptable risk - immediate action required", "responseTime": "24 hours"}]'::jsonb NOT NULL,
    assessment_methods jsonb DEFAULT '[{"id": "qualitative_5x5", "name": "Qualitative 5x5 Matrix", "isActive": true, "isDefault": true, "description": "Standard 5-point scales for likelihood and impact", "impactScale": 5, "likelihoodScale": 5}, {"id": "qualitative_3x3", "name": "Simplified 3x3 Matrix", "isActive": true, "isDefault": false, "description": "Basic 3-point scales for quick assessments", "impactScale": 3, "likelihoodScale": 3}, {"id": "bowtie", "name": "Bowtie Analysis", "isActive": false, "isDefault": false, "description": "Cause-consequence analysis with barriers", "impactScale": 5, "likelihoodScale": 5}]'::jsonb NOT NULL,
    likelihood_scale jsonb DEFAULT '[{"label": "Rare", "value": 1, "description": "Highly unlikely to occur (< 5% chance)"}, {"label": "Unlikely", "value": 2, "description": "Not expected but possible (5-20% chance)"}, {"label": "Possible", "value": 3, "description": "Could occur at some point (20-50% chance)"}, {"label": "Likely", "value": 4, "description": "More likely than not (50-80% chance)"}, {"label": "Almost Certain", "value": 5, "description": "Expected to occur (> 80% chance)"}]'::jsonb NOT NULL,
    impact_scale jsonb DEFAULT '[{"label": "Negligible", "value": 1, "description": "Minimal impact on operations or objectives"}, {"label": "Minor", "value": 2, "description": "Limited impact, easily recoverable"}, {"label": "Moderate", "value": 3, "description": "Noticeable impact requiring management attention"}, {"label": "Major", "value": 4, "description": "Significant impact on key objectives"}, {"label": "Catastrophic", "value": 5, "description": "Severe impact threatening organizational survival"}]'::jsonb NOT NULL,
    max_acceptable_risk_score integer DEFAULT 11 NOT NULL,
    risk_acceptance_authority character varying(50) DEFAULT 'executive'::character varying NOT NULL,
    default_review_period_days integer DEFAULT 90 NOT NULL,
    auto_calculate_risk_score boolean DEFAULT true NOT NULL,
    require_assessment_evidence boolean DEFAULT false NOT NULL,
    enable_risk_appetite boolean DEFAULT true NOT NULL,
    default_assessment_method character varying(50) DEFAULT 'qualitative_5x5'::character varying NOT NULL,
    notify_on_high_risk boolean DEFAULT true NOT NULL,
    notify_on_critical_risk boolean DEFAULT true NOT NULL,
    notify_on_review_due boolean DEFAULT true NOT NULL,
    review_reminder_days integer DEFAULT 7 NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    created_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.risk_settings OWNER TO postgres;

--
-- Name: risk_treatments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_treatments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    treatment_id character varying(20),
    risk_id uuid NOT NULL,
    strategy public.treatment_strategy_enum NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    treatment_owner_id uuid,
    status public.treatment_status_enum DEFAULT 'planned'::public.treatment_status_enum NOT NULL,
    priority public.treatment_priority_enum DEFAULT 'medium'::public.treatment_priority_enum NOT NULL,
    start_date date,
    target_completion_date date,
    actual_completion_date date,
    estimated_cost numeric(15,2),
    actual_cost numeric(15,2),
    expected_risk_reduction text,
    residual_likelihood integer,
    residual_impact integer,
    residual_risk_score integer,
    progress_percentage integer DEFAULT 0 NOT NULL,
    progress_notes text,
    implementation_notes text,
    linked_control_ids uuid[],
    attachments jsonb,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.risk_treatments OWNER TO postgres;

--
-- Name: COLUMN risk_treatments.linked_control_ids; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risk_treatments.linked_control_ids IS 'Controls created or enhanced as part of this treatment';


--
-- Name: risks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category public.risks_category_enum DEFAULT 'compliance'::public.risks_category_enum NOT NULL,
    status public.risks_status_enum DEFAULT 'identified'::public.risks_status_enum NOT NULL,
    likelihood public.risks_likelihood_enum DEFAULT '3'::public.risks_likelihood_enum NOT NULL,
    impact public.risks_impact_enum DEFAULT '3'::public.risks_impact_enum NOT NULL,
    "organizationId" uuid,
    "ownerId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    risk_id character varying(20),
    risk_statement text,
    category_id uuid,
    sub_category_id uuid,
    risk_analyst_id uuid,
    date_identified date,
    threat_source public.threat_source_enum,
    risk_velocity public.risk_velocity_enum,
    early_warning_signs text,
    status_notes text,
    tags character varying[],
    business_process text,
    version_number integer DEFAULT 1 NOT NULL,
    next_review_date date,
    last_review_date date,
    business_unit_ids uuid[],
    inherent_likelihood integer,
    inherent_impact integer,
    inherent_risk_score integer,
    inherent_risk_level public.risk_level_enum,
    current_likelihood integer,
    current_impact integer,
    current_risk_score integer,
    current_risk_level public.risk_level_enum,
    target_likelihood integer,
    target_impact integer,
    target_risk_score integer,
    target_risk_level public.risk_level_enum,
    control_effectiveness integer,
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp without time zone
);


ALTER TABLE public.risks OWNER TO postgres;

--
-- Name: COLUMN risks.risk_statement; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risks.risk_statement IS 'If [cause], then [event], resulting in [impact]';


--
-- Name: COLUMN risks.control_effectiveness; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.risks.control_effectiveness IS 'Overall control effectiveness percentage (0-100)';


--
-- Name: security_test_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.security_test_results (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    asset_type public.security_test_results_asset_type_enum NOT NULL,
    asset_id uuid NOT NULL,
    test_type public.test_type_enum NOT NULL,
    test_date date NOT NULL,
    status public.test_status_enum DEFAULT 'completed'::public.test_status_enum NOT NULL,
    tester_name character varying(200),
    tester_company character varying(200),
    findings_critical integer DEFAULT 0 NOT NULL,
    findings_high integer DEFAULT 0 NOT NULL,
    findings_medium integer DEFAULT 0 NOT NULL,
    findings_low integer DEFAULT 0 NOT NULL,
    findings_info integer DEFAULT 0 NOT NULL,
    severity public.severity_level_enum,
    overall_score numeric(5,2),
    passed boolean DEFAULT false NOT NULL,
    summary text,
    findings text,
    recommendations text,
    report_file_id uuid,
    report_url text,
    remediation_due_date date,
    remediation_completed boolean DEFAULT false NOT NULL,
    retest_required boolean DEFAULT false NOT NULL,
    retest_date date,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.security_test_results OWNER TO postgres;

--
-- Name: software_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.software_assets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description text,
    version_number character varying(100),
    vendor character varying(255),
    owner_id uuid,
    notes text,
    created_by_id uuid,
    updated_by_id uuid,
    unique_identifier character varying(255) NOT NULL,
    software_name character varying(255) NOT NULL,
    software_type public.software_assets_softwaretype_enum DEFAULT 'other'::public.software_assets_softwaretype_enum NOT NULL,
    patch_level character varying(100),
    "vendorContact" character varying(255),
    "vendorEmail" character varying(255),
    "vendorPhone" character varying(50),
    license_type character varying(255),
    license_key character varying(255),
    "numberOfLicenses" integer,
    "licensesInUse" integer,
    "licenseExpiryDate" date,
    "ownerId" uuid,
    business_unit character varying(255),
    "criticalityLevel" public.software_assets_criticalitylevel_enum DEFAULT 'medium'::public.software_assets_criticalitylevel_enum NOT NULL,
    compliance_requirements text,
    "customAttributes" jsonb,
    deleted_at timestamp without time zone,
    deleted_by uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    business_unit_id uuid,
    business_purpose text,
    vendor_name character varying(200),
    vendor_contact jsonb,
    license_count integer,
    license_expiry date,
    installation_count integer DEFAULT 0 NOT NULL,
    security_test_results jsonb,
    last_security_test_date date,
    known_vulnerabilities jsonb,
    support_end_date date
);


ALTER TABLE public.software_assets OWNER TO postgres;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description text,
    address character varying(255),
    city character varying(100),
    country character varying(100),
    website character varying(255),
    notes text,
    created_by_id uuid,
    updated_by_id uuid,
    unique_identifier character varying(255) NOT NULL,
    supplier_name character varying(255) NOT NULL,
    type public.suppliers_suppliertype_enum DEFAULT 'other'::public.suppliers_suppliertype_enum NOT NULL,
    primary_contact_name character varying(255),
    primary_contact_email character varying(255),
    primary_contact_phone character varying(50),
    postal_code character varying(50),
    criticality_level public.suppliers_criticalitylevel_enum DEFAULT 'medium'::public.suppliers_criticalitylevel_enum NOT NULL,
    business_unit character varying(255),
    contract_reference character varying(255),
    contract_start_date date,
    contract_end_date date,
    goods_services_provided text,
    compliance_requirements text,
    additional_contacts text,
    custom_attributes jsonb,
    deleted_at timestamp without time zone,
    deleted_by uuid,
    created_by uuid,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    business_unit_id uuid,
    business_purpose text,
    goods_services_type jsonb,
    contract_value numeric(15,2),
    currency character varying(10),
    auto_renewal boolean DEFAULT false NOT NULL,
    primary_contact jsonb,
    secondary_contact jsonb,
    tax_id character varying(100),
    registration_number character varying(100),
    risk_assessment_date date,
    risk_level character varying(50),
    compliance_certifications jsonb,
    insurance_verified boolean DEFAULT false NOT NULL,
    background_check_date date,
    performance_rating numeric(3,2),
    last_review_date date,
    owner_id uuid,
    supplier_type character varying(100)
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    "taskType" public.tasks_tasktype_enum DEFAULT 'compliance_requirement'::public.tasks_tasktype_enum NOT NULL,
    priority public.tasks_priority_enum DEFAULT 'medium'::public.tasks_priority_enum NOT NULL,
    status public.tasks_status_enum DEFAULT 'todo'::public.tasks_status_enum NOT NULL,
    "dueDate" timestamp without time zone,
    "assignedToId" uuid,
    "relatedEntityType" character varying(50),
    "relatedEntityId" uuid,
    "organizationId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    assigned_to_id uuid
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: treatment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.treatment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.treatment_id_seq OWNER TO postgres;

--
-- Name: treatment_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.treatment_tasks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    treatment_id uuid NOT NULL,
    title character varying(300) NOT NULL,
    description text,
    assignee_id uuid,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    due_date date,
    completed_date date,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.treatment_tasks OWNER TO postgres;

--
-- Name: unified_controls; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unified_controls (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    control_identifier character varying(100) NOT NULL,
    title character varying(500) NOT NULL,
    description text,
    control_type public.control_type_enum,
    control_category character varying(200),
    domain character varying(200),
    complexity public.control_complexity_enum,
    cost_impact public.control_cost_impact_enum,
    status public.control_status_enum DEFAULT 'draft'::public.control_status_enum NOT NULL,
    implementation_status public.implementation_status_enum DEFAULT 'not_implemented'::public.implementation_status_enum NOT NULL,
    control_owner_id uuid,
    control_procedures text,
    testing_procedures text,
    tags character varying[],
    custom_fields jsonb,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.unified_controls OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    phone character varying,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    "avatarUrl" character varying,
    email_verified boolean DEFAULT false NOT NULL,
    phone_verified boolean DEFAULT false NOT NULL,
    last_login_at timestamp without time zone,
    password_changed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    role public.users_role_enum DEFAULT 'user'::public.users_role_enum NOT NULL,
    status public.users_status_enum DEFAULT 'active'::public.users_status_enum NOT NULL,
    password character varying NOT NULL,
    business_unit_id uuid
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: validation_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.validation_rules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    asset_type public.validation_rules_asset_type_enum NOT NULL,
    field_name character varying(255) NOT NULL,
    validation_type public.validation_rules_validation_type_enum NOT NULL,
    regex_pattern text,
    min_length integer,
    max_length integer,
    min_value numeric,
    max_value numeric,
    custom_validation_script text,
    error_message text,
    severity public.validation_rules_severity_enum DEFAULT 'error'::public.validation_rules_severity_enum NOT NULL,
    dependencies jsonb,
    is_active boolean DEFAULT true NOT NULL,
    apply_to_import boolean DEFAULT false NOT NULL,
    created_by_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.validation_rules OWNER TO postgres;

--
-- Name: vw_kri_dashboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_kri_dashboard AS
 SELECT k.id,
    k.kri_id,
    k.name,
    k.description,
    k.measurement_unit,
    k.measurement_frequency,
    k.current_value,
    k.current_status,
    k.trend,
    k.threshold_green,
    k.threshold_amber,
    k.target_value,
    k.last_measured_at,
    k.next_measurement_due,
    rc.name AS category_name,
    (((u.first_name)::text || ' '::text) || (u.last_name)::text) AS owner_name,
    ( SELECT count(*) AS count
           FROM public.kri_risk_links
          WHERE (kri_risk_links.kri_id = k.id)) AS linked_risks_count,
        CASE
            WHEN (k.next_measurement_due < CURRENT_DATE) THEN 'overdue'::text
            WHEN (k.next_measurement_due <= (CURRENT_DATE + '7 days'::interval)) THEN 'due_soon'::text
            ELSE 'on_track'::text
        END AS measurement_due_status
   FROM ((public.kris k
     LEFT JOIN public.risk_categories rc ON ((k.category_id = rc.id)))
     LEFT JOIN public.users u ON ((k.kri_owner_id = u.id)))
  WHERE ((k.deleted_at IS NULL) AND (k.is_active = true));


ALTER TABLE public.vw_kri_dashboard OWNER TO postgres;

--
-- Name: vw_risk_asset_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_risk_asset_summary AS
 SELECT r.id AS risk_id,
    r.risk_id AS risk_identifier,
    r.title AS risk_title,
    count(DISTINCT ral.id) AS total_linked_assets,
    count(DISTINCT
        CASE
            WHEN (ral.asset_type = 'physical'::public.risk_asset_type_enum) THEN ral.id
            ELSE NULL::uuid
        END) AS physical_assets,
    count(DISTINCT
        CASE
            WHEN (ral.asset_type = 'information'::public.risk_asset_type_enum) THEN ral.id
            ELSE NULL::uuid
        END) AS information_assets,
    count(DISTINCT
        CASE
            WHEN (ral.asset_type = 'software'::public.risk_asset_type_enum) THEN ral.id
            ELSE NULL::uuid
        END) AS software_assets,
    count(DISTINCT
        CASE
            WHEN (ral.asset_type = 'application'::public.risk_asset_type_enum) THEN ral.id
            ELSE NULL::uuid
        END) AS application_assets,
    count(DISTINCT
        CASE
            WHEN (ral.asset_type = 'supplier'::public.risk_asset_type_enum) THEN ral.id
            ELSE NULL::uuid
        END) AS supplier_assets
   FROM (public.risks r
     LEFT JOIN public.risk_asset_links ral ON ((r.id = ral.risk_id)))
  WHERE (r.deleted_at IS NULL)
  GROUP BY r.id, r.risk_id, r.title;


ALTER TABLE public.vw_risk_asset_summary OWNER TO postgres;

--
-- Name: vw_risk_control_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_risk_control_summary AS
 SELECT r.id AS risk_id,
    r.risk_id AS risk_identifier,
    r.title AS risk_title,
    count(DISTINCT rcl.id) AS total_linked_controls,
    COALESCE((avg(
        CASE
            WHEN ((rcl.effectiveness_type)::text = 'scale'::text) THEN (rcl.effectiveness_rating * 20)
            ELSE rcl.effectiveness_rating
        END))::integer, 0) AS average_control_effectiveness,
        CASE
            WHEN (count(rcl.id) = 0) THEN 'no_controls'::text
            WHEN (avg(
            CASE
                WHEN ((rcl.effectiveness_type)::text = 'scale'::text) THEN (rcl.effectiveness_rating * 20)
                ELSE rcl.effectiveness_rating
            END) >= (80)::numeric) THEN 'well_controlled'::text
            WHEN (avg(
            CASE
                WHEN ((rcl.effectiveness_type)::text = 'scale'::text) THEN (rcl.effectiveness_rating * 20)
                ELSE rcl.effectiveness_rating
            END) >= (50)::numeric) THEN 'partially_controlled'::text
            ELSE 'weakly_controlled'::text
        END AS control_status
   FROM (public.risks r
     LEFT JOIN public.risk_control_links rcl ON ((r.id = rcl.risk_id)))
  WHERE (r.deleted_at IS NULL)
  GROUP BY r.id, r.risk_id, r.title;


ALTER TABLE public.vw_risk_control_summary OWNER TO postgres;

--
-- Name: vw_treatment_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_treatment_summary AS
 SELECT rt.id,
    rt.treatment_id,
    rt.title,
    rt.strategy,
    rt.status,
    rt.priority,
    rt.progress_percentage,
    rt.target_completion_date,
    rt.actual_completion_date,
    rt.risk_id,
    r.risk_id AS risk_identifier,
    r.title AS risk_title,
    r.current_risk_level,
    u.id AS owner_id,
    (((u.first_name)::text || ' '::text) || (u.last_name)::text) AS owner_name,
        CASE
            WHEN (rt.status = 'completed'::public.treatment_status_enum) THEN 'completed'::text
            WHEN ((rt.target_completion_date < CURRENT_DATE) AND (rt.status <> ALL (ARRAY['completed'::public.treatment_status_enum, 'cancelled'::public.treatment_status_enum]))) THEN 'overdue'::text
            WHEN (rt.target_completion_date <= (CURRENT_DATE + '7 days'::interval)) THEN 'due_soon'::text
            ELSE 'on_track'::text
        END AS due_status,
    ( SELECT count(*) AS count
           FROM public.treatment_tasks
          WHERE (treatment_tasks.treatment_id = rt.id)) AS total_tasks,
    ( SELECT count(*) AS count
           FROM public.treatment_tasks
          WHERE ((treatment_tasks.treatment_id = rt.id) AND ((treatment_tasks.status)::text = 'completed'::text))) AS completed_tasks
   FROM ((public.risk_treatments rt
     JOIN public.risks r ON ((rt.risk_id = r.id)))
     LEFT JOIN public.users u ON ((rt.treatment_owner_id = u.id)))
  WHERE (rt.deleted_at IS NULL);


ALTER TABLE public.vw_treatment_summary OWNER TO postgres;

--
-- Name: workflow_approvals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_approvals (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "workflowExecutionId" uuid NOT NULL,
    "approverId" uuid NOT NULL,
    status public.workflow_approvals_status_enum DEFAULT 'pending'::public.workflow_approvals_status_enum NOT NULL,
    comments text,
    "stepOrder" integer NOT NULL,
    "respondedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    signature_data text,
    signature_timestamp timestamp without time zone,
    signature_method character varying(20),
    signature_metadata jsonb
);


ALTER TABLE public.workflow_approvals OWNER TO postgres;

--
-- Name: workflow_executions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_executions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "workflowId" uuid NOT NULL,
    "entityType" character varying(255) NOT NULL,
    "entityId" uuid NOT NULL,
    status public.workflow_executions_status_enum DEFAULT 'pending'::public.workflow_executions_status_enum NOT NULL,
    "inputData" jsonb,
    "outputData" jsonb,
    "errorMessage" text,
    "assignedToId" uuid,
    "startedAt" timestamp without time zone,
    "completedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.workflow_executions OWNER TO postgres;

--
-- Name: workflows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflows (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    type public.workflows_type_enum NOT NULL,
    status public.workflows_status_enum DEFAULT 'active'::public.workflows_status_enum NOT NULL,
    trigger public.workflows_trigger_enum NOT NULL,
    entity_type public.workflows_entitytype_enum NOT NULL,
    conditions jsonb,
    actions jsonb,
    days_before_deadline integer,
    organization_id uuid,
    created_by_id uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.workflows OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: assessment_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessment_results (id, assessment_id, unified_control_id, assessor_id, assessment_date, assessment_procedure_followed, result, effectiveness_rating, findings, observations, recommendations, evidence_collected, requires_remediation, remediation_due_date, created_at, updated_at) FROM stdin;
2d05cfa6-632d-4b00-9977-ca71f13d4d6c	0394f18b-7355-40ca-9865-2dfbd72c98a3	ccc179a0-95c4-4d0b-9073-fd5321875893	b5525c73-c26a-48d4-a90a-582fa451e518	2025-11-13	Tested MFA configuration and user access	partially_compliant	3	MFA not fully implemented for all privileged accounts	Some legacy systems still use password-only authentication	Complete MFA rollout for all privileged accounts within 60 days	\N	t	2026-02-01	2025-12-03 09:51:31.081886	2025-12-03 09:51:31.081886
bb3fd425-105f-40e9-9898-7c1f096125e1	61301a69-4892-49cb-bc95-8887a10bfca0	4f26dfa5-2e88-4160-9741-e8d4753fd703	b5525c73-c26a-48d4-a90a-582fa451e518	2025-10-19	Verified encryption configuration and key management	compliant	5	\N	Encryption properly implemented and keys managed securely	Continue current practices	\N	f	\N	2025-12-03 09:51:31.081886	2025-12-03 09:51:31.081886
6dce9d45-c158-4697-8c2e-e9b23007380a	61301a69-4892-49cb-bc95-8887a10bfca0	b5ee8b21-32b5-49ce-9214-4a23ec0cd419	b5525c73-c26a-48d4-a90a-582fa451e518	2025-10-24	Reviewed RBAC implementation and tested access	compliant	4	\N	RBAC properly implemented with regular access reviews	Continue quarterly access reviews	\N	f	\N	2025-12-03 09:51:31.081886	2025-12-03 09:51:31.081886
\.


--
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assessments (id, assessment_identifier, name, description, scope_description, selected_control_ids, selected_framework_ids, start_date, end_date, status, lead_assessor_id, assessor_ids, controls_assessed, controls_total, findings_critical, findings_high, findings_medium, findings_low, overall_score, assessment_procedures, report_path, approved_by, approval_date, tags, created_by, created_at, updated_by, updated_at, deleted_at, assessment_type) FROM stdin;
0394f18b-7355-40ca-9865-2dfbd72c98a3	ASSESS-2024-Q1	Q1 2024 Security Controls Assessment	Quarterly assessment of key security controls	Assessment of IAM and encryption controls	{ccc179a0-95c4-4d0b-9073-fd5321875893,4f26dfa5-2e88-4160-9741-e8d4753fd703,b5ee8b21-32b5-49ce-9214-4a23ec0cd419}	\N	2025-11-03	2026-01-02	in_progress	b5525c73-c26a-48d4-a90a-582fa451e518	{b5525c73-c26a-48d4-a90a-582fa451e518,01180d49-d38b-4421-a130-b1ce4b7c34fa}	1	3	0	1	0	0	75.00	1. Review control documentation\n2. Test control effectiveness\n3. Interview control owners\n4. Review evidence	\N	\N	\N	{quarterly,security,iam}	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-03 09:51:31.077966	\N	2025-12-03 09:51:31.077966	\N	compliance
61301a69-4892-49cb-bc95-8887a10bfca0	ASSESS-2024-ISO	ISO 27001 Compliance Assessment	Annual ISO 27001 compliance assessment	Full ISO 27001 control set assessment	{ccc179a0-95c4-4d0b-9073-fd5321875893,4f26dfa5-2e88-4160-9741-e8d4753fd703,99df57a6-1efc-4693-bd96-222a0e1d72bb,b5ee8b21-32b5-49ce-9214-4a23ec0cd419,e40a782a-a26d-423e-8a17-5488f9cdfb88,57ab59e4-0a22-47ca-9f63-90b1cb2d5ad0}	\N	2025-10-04	2025-11-03	completed	b5525c73-c26a-48d4-a90a-582fa451e518	{b5525c73-c26a-48d4-a90a-582fa451e518,01180d49-d38b-4421-a130-b1ce4b7c34fa}	6	6	0	2	3	1	85.00	ISO 27001 audit procedures	\N	\N	\N	{iso27001,annual,compliance}	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-03 09:51:31.077966	\N	2025-12-03 09:51:31.077966	\N	compliance
af6524c4-d095-41d6-a28e-e5ddfc0e923d	TEST-ASSESS-001	Test Assessment	Updated test assessment description	\N	\N	\N	\N	\N	not_started	\N	\N	0	\N	0	0	0	0	\N	\N	\N	\N	\N	\N	\N	2025-12-03 10:57:14.363345	\N	2025-12-03 10:57:14.413373	2025-12-03 10:57:14.413373	compliance
9e161063-be2e-4aca-b300-5d983c3ebce8	TEST-001	Test	\N	\N	\N	\N	\N	\N	not_started	\N	\N	0	\N	0	0	0	0	\N	\N	\N	\N	\N	\N	\N	2025-12-03 10:57:46.921806	\N	2025-12-03 10:57:46.921806	\N	compliance
8ab9cc48-0529-49f9-a30b-029a61443576	TEST-ASSESS-1764759497	Test Assessment 1764759497	Updated test assessment description	\N	\N	\N	\N	\N	not_started	\N	\N	0	\N	0	0	0	0	\N	\N	\N	\N	\N	\N	\N	2025-12-03 10:58:17.608257	\N	2025-12-03 10:58:17.664956	2025-12-03 10:58:17.664956	compliance
535bd936-2f62-48a1-8498-1ec0a9a7866a	ASSESS-1765644084424	E2E Test Assessment 1765644084424	Test assessment description for E2E testing	Test assessment scope description	\N	\N	2025-12-13	2026-01-12	not_started	\N	\N	0	\N	0	0	0	0	\N	Test assessment procedures description	\N	\N	\N	\N	\N	2025-12-13 16:41:46.115567	\N	2025-12-13 16:41:46.115567	\N	operating_effectiveness
de4e73d0-0955-4e39-9754-a31d60f06c85	ASSESS-1765644195549	E2E Test Assessment 1765644195549	Test assessment description for E2E testing	Test assessment scope description	\N	\N	2025-12-13	2026-01-12	not_started	\N	\N	0	\N	0	0	0	0	\N	Test assessment procedures description	\N	\N	\N	\N	\N	2025-12-13 16:43:22.371651	\N	2025-12-13 16:43:22.371651	\N	operating_effectiveness
63638f6b-1cca-48f0-9574-0d1b0fe525d5	ASSESS-1765644251499	E2E Test Assessment 1765644251499	Test assessment description for E2E testing	Test assessment scope description	\N	\N	2025-12-13	2026-01-12	not_started	\N	\N	0	\N	0	0	0	0	\N	Test assessment procedures description	\N	\N	\N	\N	\N	2025-12-13 16:44:21.272065	\N	2025-12-13 16:44:21.272065	\N	operating_effectiveness
7ca68a04-6245-41cc-93fa-4f1470297e0a	ASSESS-1765644327527	E2E Test Assessment 1765644327527	Test assessment description for E2E testing	Test assessment scope description	\N	\N	2025-12-13	2026-01-12	not_started	\N	\N	0	\N	0	0	0	0	\N	Test assessment procedures description	\N	\N	\N	\N	\N	2025-12-13 16:45:44.770323	\N	2025-12-13 16:45:44.770323	\N	operating_effectiveness
\.


--
-- Data for Name: asset_audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_audit_logs (id, asset_type, asset_id, action, field_name, old_value, new_value, changed_by_id, change_reason, created_at) FROM stdin;
2a6780fc-7184-4d7a-9915-e87a64b3ecf7	physical	e1001531-a2e5-4859-a2a8-94ea78d5839c	update	assetName	Old Production Database Server - Primary	Production Database Server - Primary	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated asset name during inventory review	2025-11-29 17:21:31.106
76f6daf3-2f7e-4ebd-832f-b999ef868129	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	update	assetName	Old Production Application Server	Production Application Server	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated asset name during inventory review	2025-11-28 17:21:31.106
3451ae84-df41-479d-89c0-95e49525ae4c	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	update	assetName	Old Finance Department Workstation	Finance Department Workstation	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated asset name during inventory review	2025-11-27 17:21:31.106
e9a4cc02-f122-4e79-b5a1-da5b7b5ddaa1	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	update	dataClassification	Internal	confidential	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated classification during compliance audit	2025-11-28 17:21:31.106
fed7942b-2fcc-4f16-b490-40ec3fc732f0	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	update	dataClassification	Internal	restricted	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated classification during compliance audit	2025-11-27 17:21:31.106
dc06cef2-142e-4780-930d-af4ce651f971	information	af209445-43d1-4248-9670-99d29e885778	update	dataClassification	Internal	confidential	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated classification during compliance audit	2025-11-26 17:21:31.106
3088bf7b-038c-43fc-9f08-717bedd8c08f	application	2d4b7be2-aed0-472d-ae18-0e8e2383564a	update	criticalityLevel	Low	critical	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated criticality based on business impact analysis	2025-11-27 17:21:31.106
e5e8f00f-868d-466e-aa6d-9aff0a69f47e	application	87e75e00-f423-4b9f-8c6f-1db2a756c4ac	update	criticalityLevel	Low	high	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated criticality based on business impact analysis	2025-11-26 17:21:31.106
4d4ce78a-7f62-4d8f-88ff-6396f9770fe0	application	fff5ad75-327b-477d-93f8-ea364d670b45	update	criticalityLevel	Low	high	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated criticality based on business impact analysis	2025-11-25 17:21:31.106
a2fc26ff-0ac7-4126-90b2-375d39b4d475	software	137cc455-d836-4ebe-be95-01e16b3149c4	update	licenseType	Perpetual	Volume License	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated license type during software audit	2025-11-26 17:21:31.106
8eef4307-9c48-489d-b921-4e5584880e9b	software	abfa002a-e188-4ee8-91ae-7ae28009c8db	update	licenseType	Perpetual	Subscription	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated license type during software audit	2025-11-25 17:21:31.106
05cddf3a-7293-494b-ad95-e193fd17925f	software	0fd5cffa-ad68-44c1-9dc5-a7cb93aa7cc1	update	licenseType	Perpetual	Subscription	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated license type during software audit	2025-11-24 17:21:31.106
6c30d999-cd19-414e-b0c3-71b65ce64657	supplier	f726d45e-fc2a-4071-a7a0-6d32ecd0c3ed	update	contractStatus	Draft	Active	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated supplier information after contract review	2025-11-25 17:21:31.106
03a98a70-cb43-4eaf-b61d-f5d40f837a51	supplier	313e9e47-4bb4-4585-b6e8-2617e4f705bd	update	contractStatus	Draft	Active	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated supplier information after contract review	2025-11-24 17:21:31.106
0145a1b6-53ee-4018-b018-0a33c614e6b4	supplier	ee92b760-068f-4078-a8dc-4f4a3052255b	update	contractStatus	Draft	Active	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Updated supplier information after contract review	2025-11-23 17:21:31.106
09ac5812-5cfb-4121-90ce-64086278bc82	physical	e1001531-a2e5-4859-a2a8-94ea78d5839c	create	\N	\N	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Initial asset registration	2025-11-20 17:21:31.106
0ef0bb2c-e589-4ae7-893f-2b1051464820	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	create	\N	\N	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Initial asset registration	2025-11-19 17:21:31.106
ef020104-ce86-442a-9db0-e310939591d1	physical	9d81c212-b5fa-4243-a2bc-6ed35227af76	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.241422
18a739a9-e642-45a6-81d6-df8c05cdda50	physical	e1b290b8-f99b-4979-ae73-c8b0b15a46a6	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.24899
5a19d925-26a5-49ab-bcd4-1418e0766cca	physical	accb5cbf-1ce2-49a5-8a3a-d09efe9a302b	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.255038
39b68f37-ed33-4bad-9db9-f5836c13a9cb	physical	9e4f04c3-e627-4c96-8020-10d30566cf41	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.262486
97592a01-e443-4716-af99-0535aacc0314	physical	3952fafa-9387-4ae7-8bb0-7d4a3d8df389	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.267895
cacd1b97-3ec8-4299-bdc8-cac764cd0b51	physical	f4317441-602a-42fb-99f8-6faf85617db3	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.27343
8ada69b5-7f38-44f4-9532-2eb71a2cf0fb	physical	5fed39ea-6829-482e-adeb-4e99f0070295	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.278631
9e223e4a-d650-4b76-8570-f3f387f181c2	physical	7c4799e4-9771-48bd-844c-d47e9fabf9d5	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.283233
c17a7580-8117-4db9-8fac-e639d342a623	physical	0631d19e-a39d-4e6a-afe8-f26f1abec69f	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.287317
3c9a4377-6929-4cec-a806-b320a3c80bfc	physical	aa5dd238-0694-4852-908b-e785853c5bda	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.291698
fd942c69-a937-4536-a9d0-a038342289b4	physical	286ee346-a379-4417-a4db-e8e130b0c4ea	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:57.968727
0c56c55d-e819-456a-ad8e-5f6c6a168f31	physical	9e328ad8-6215-431e-bd53-4fac875c4024	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:57.977293
24d30343-b68c-4551-bfb1-99459e0424e1	physical	fc3fa203-1d0c-4d8c-b9ec-4924adf4e7c7	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:57.982435
a7872c4b-7c83-4c64-b739-989861f99adf	physical	03492671-410f-4c20-97b8-9a1d5445b480	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:57.986867
e2efa24d-46ce-43b3-a60e-6e41c8e44103	physical	73a04969-7c36-4f02-87e4-06ae2f34651d	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:57.99185
d54161b5-4276-4289-91c8-075d79bf0550	physical	b1da08bb-b45c-469c-9a50-3d461aaf92d7	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:57.995923
d91769c2-57e0-4d2b-8e23-86ee35415a9d	physical	b5e69311-54ba-4b26-9641-1b488ed0547d	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:58.000966
f9841148-201e-4a4b-b4e2-b9bff0f0211a	physical	6f1ad9f5-9c0d-4d3e-9201-4892c6b3d837	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:58.005846
4f939260-9d06-4afb-b24b-98185dd9d3a8	physical	1a2e1629-8971-4f54-8aa3-f908eca7d21e	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:58.010367
dc52b29a-002f-4969-8474-4b2b91278f19	physical	b674dae7-b704-4d0c-a033-037fe3e1a109	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:58.014714
ca38dcdf-47af-419c-bed7-2147c3a2a9de	physical	b91f9de7-81e7-4544-9a0a-9de6b085f8b6	create	\N	\N	\N	\N	\N	2025-12-10 18:08:49.14662
47803189-acd0-4177-a319-acdce216d2c2	information	2cab5e71-9db8-4342-a52a-b57feed8ef32	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:45:02.71624
d98e7893-9ddc-45d1-b0ef-a9ed3b8fdd4c	information	73e8f1c6-4e1e-4541-9f9c-b1c9209eb779	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:45:02.72428
1f8e4aeb-6194-4cf3-bc06-0f4f3f7e4339	information	9bd90513-4071-488b-95cb-10f16bfd1a30	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:45:02.731482
c267a83b-da9a-4750-9f47-1acc2e53f06c	application	3000c76b-1f69-426c-923c-e386ef122855	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:51:44.580364
0d9dd0cb-5fc8-4041-8b46-1447671cb878	application	b4c6c6fa-2d95-4d84-83c3-3245496feeca	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:51:44.590352
5a2b302b-590a-4eb2-b001-04dba56128d8	application	d75ddc27-ea1b-444f-924d-6ca314d6789a	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:51:44.599567
1b84b448-c70b-46fa-9402-e2212ce71a28	software	2eb97664-3f35-436d-9ba4-92c69b2dc259	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:52:06.815369
d132d3fe-83d5-47ae-8c5b-b7c3045cabfe	software	5c72b1dc-dadd-4f58-a570-18357777c2de	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:52:06.822102
145aa0ab-cf19-4cb2-943a-663c98bde7f6	software	071c96e0-575c-43c7-9652-81e92978c0b7	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:52:06.8285
0409176e-f41f-4dba-8633-f72f7ccbfcf2	supplier	f87d985e-92ee-4690-b186-780e75e5bb49	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:58:33.328066
fe0a96b9-7644-4ba5-9245-2816b5543cf0	supplier	71fd9ee6-0b0f-4b94-bd23-b67b2eeff1f7	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:58:33.335767
5a559a83-c27d-4a56-8e6f-41fb2c0703f4	supplier	8439ab1e-ac92-4967-8516-3b8259dbb7f1	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:58:33.341717
951da367-5347-4a80-b469-35d838b92d10	physical	29562b88-ce27-4d9d-86d7-95ed4921cabd	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 21:29:41.750077
58f3d8a2-da1c-4784-affb-469d8ffeb37b	physical	106eafae-913c-4419-89bc-f76dcc7327cb	create	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 21:29:41.759175
c002b14e-1d73-4383-8c1d-173e909bdaf4	physical	a6f4f177-1b77-49ae-82f8-11c1b37aee87	create	\N	\N	\N	\N	\N	2025-12-12 20:37:25.711399
cb3c832f-8f5a-4a19-8bc7-440b0491e58e	physical	16261bf4-000b-4006-8aee-d251cfd3184e	create	\N	\N	\N	\N	\N	2025-12-13 08:54:04.625463
db48a3c6-3113-4e45-b1bf-a9e62611e5ab	physical	84a67ecb-4247-4391-aa2d-3115f13f71d2	create	\N	\N	\N	\N	\N	2025-12-13 08:55:47.742775
92732e7d-3621-4bb0-8d35-e525e6972cc5	physical	d41bedf6-dea6-4421-b0c1-807020a6baa3	create	\N	\N	\N	\N	\N	2025-12-13 09:38:24.542473
801ea189-705d-4799-bd5e-76f559fed5bb	information	3356bd1d-ef7f-4e80-8758-f30a1313a853	create	\N	\N	\N	\N	\N	2025-12-13 09:40:53.934877
307c5750-b65d-48de-9e02-7581ef2585a5	software	f1f72753-9679-4b1b-b441-9682ab046512	create	\N	\N	\N	\N	\N	2025-12-13 10:31:04.43647
c4807633-ad25-4e64-8d69-2774f3f4ca88	software	b4eea249-d2ea-40a0-a0e2-3acb4085fe11	create	\N	\N	\N	\N	\N	2025-12-13 10:31:41.881834
27e78850-88f8-4338-8b0b-f98ada884204	supplier	67ac5f10-6fac-4f6b-8b06-6df32ae48451	create	\N	\N	\N	\N	\N	2025-12-13 10:49:44.107205
c2f75866-21b7-415c-97f8-49acc62ed26b	application	7d64d4ec-99e3-435b-85de-fbbbbd81dc34	create	\N	\N	\N	\N	\N	2025-12-13 12:27:06.321061
669ed22b-e4d5-4e43-bec1-d7e8c46b4ee1	application	d57d50a2-b1d6-4254-9d05-daef69f7604e	create	\N	\N	\N	\N	\N	2025-12-13 12:37:33.076017
be73ccab-4d53-4ff1-b80b-4f579bb16271	application	82b177b6-cafc-44e7-949f-408b2b3842d4	create	\N	\N	\N	\N	\N	2025-12-13 13:45:58.865439
3ee6addc-f77e-4d6b-9a8b-b35076915d42	application	2e545f92-507f-46e8-a1b3-9574ec231431	create	\N	\N	\N	\N	\N	2025-12-13 13:46:42.483689
7657d5d9-8c29-4733-8380-a74fba326510	software	cd9499d5-c507-4575-b758-361499e06305	create	\N	\N	\N	\N	\N	2025-12-13 13:53:51.214254
9b046055-6f7f-4b0b-a320-2ece014e38c1	physical	beec46c6-395a-49a7-8829-16a8bcecb8aa	create	\N	\N	\N	\N	\N	2025-12-13 13:58:21.132738
d80bb503-3124-4f59-9c61-8c1f521cc57b	information	654a2238-7860-4d61-9563-fb06dbb5b2c8	create	\N	\N	\N	\N	\N	2025-12-13 14:00:11.970066
313cef83-3edd-48ca-9ae9-d85cf6de52c0	supplier	b36ea0af-e791-4c3e-af8a-c373448c9fea	create	\N	\N	\N	\N	\N	2025-12-13 14:36:09.535161
c1eb3f92-2ee7-4603-9dfe-c2ee5357f868	software	35b4e032-d33b-403e-b3fe-684839370130	create	\N	\N	\N	\N	\N	2025-12-14 12:45:08.572146
\.


--
-- Data for Name: asset_dependencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_dependencies (id, source_asset_type, source_asset_id, target_asset_type, target_asset_id, relationship_type, description, created_by_id, created_at, updated_at) FROM stdin;
134adf7d-fe67-4964-8ba6-f15da49329ec	physical	e1001531-a2e5-4859-a2a8-94ea78d5839c	supplier	f726d45e-fc2a-4071-a7a0-6d32ecd0c3ed	depends_on	Physical asset depends on supplier for maintenance	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.084342	2025-11-30 17:21:31.084342
e10064cb-3e04-42f2-aae4-076e92bf4fe6	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	supplier	f726d45e-fc2a-4071-a7a0-6d32ecd0c3ed	depends_on	Physical asset depends on supplier for maintenance	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.097442	2025-11-30 17:21:31.097442
7b29b2c5-652d-473e-8124-6d760dc871df	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	physical	e1001531-a2e5-4859-a2a8-94ea78d5839c	stores	Information asset is stored on physical server	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.098499	2025-11-30 17:21:31.098499
63334078-e518-4302-b9d9-400edd33f0dc	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	physical	e1001531-a2e5-4859-a2a8-94ea78d5839c	stores	Information asset is stored on physical server	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.099493	2025-11-30 17:21:31.099493
4b476fd5-1661-47a3-bf2f-1da5479a4cdc	application	2d4b7be2-aed0-472d-ae18-0e8e2383564a	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	uses	Business application processes customer data	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.100312	2025-11-30 17:21:31.100312
2d141815-a0af-4825-acc4-668b451725e1	application	87e75e00-f423-4b9f-8c6f-1db2a756c4ac	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	uses	Business application processes customer data	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.101211	2025-11-30 17:21:31.101211
28190eeb-9df6-44f0-88f0-de217be24004	application	2d4b7be2-aed0-472d-ae18-0e8e2383564a	software	137cc455-d836-4ebe-be95-01e16b3149c4	depends_on	Application requires specific software to run	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.101882	2025-11-30 17:21:31.101882
78db969b-3acf-4a34-9710-45c6ef797d85	application	87e75e00-f423-4b9f-8c6f-1db2a756c4ac	software	137cc455-d836-4ebe-be95-01e16b3149c4	depends_on	Application requires specific software to run	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.1026	2025-11-30 17:21:31.1026
ef167708-79ac-4dd6-a46d-993ff7465e06	software	137cc455-d836-4ebe-be95-01e16b3149c4	physical	e1001531-a2e5-4859-a2a8-94ea78d5839c	hosts	Software is installed on physical server	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.10346	2025-11-30 17:21:31.10346
c8c20bb4-44e2-4ae4-ad35-fc11be8034d8	software	abfa002a-e188-4ee8-91ae-7ae28009c8db	physical	e1001531-a2e5-4859-a2a8-94ea78d5839c	hosts	Software is installed on physical server	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.10455	2025-11-30 17:21:31.10455
120e5340-8153-49bf-9a4b-d364996f38f2	software	137cc455-d836-4ebe-be95-01e16b3149c4	supplier	f726d45e-fc2a-4071-a7a0-6d32ecd0c3ed	depends_on	Software vendor provides support and updates	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.105371	2025-11-30 17:21:31.105371
66ffa871-5bfa-4c74-994b-4f0c1b0a28cb	software	137cc455-d836-4ebe-be95-01e16b3149c4	supplier	313e9e47-4bb4-4585-b6e8-2617e4f705bd	depends_on	Software vendor provides support and updates	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-30 17:21:31.10609	2025-11-30 17:21:31.10609
\.


--
-- Data for Name: asset_field_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_field_configs (id, asset_type, field_name, display_name, field_type, is_required, is_enabled, display_order, validation_rule, validation_message, select_options, default_value, help_text, field_dependencies, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: asset_requirement_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_requirement_mapping (id, requirement_id, assessed_by, notes, created_at, updated_at, asset_type, asset_id, compliance_status, last_assessed_at, evidence_urls, auto_assessed) FROM stdin;
9eeff7cd-3227-4a90-8931-5c5ac2baf29b	b6bf9d6c-6199-4696-8547-c54430551952	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
b365e822-4f9d-408e-a7f7-101ce7fe36f9	b6bf9d6c-6199-4696-8547-c54430551952	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
a881631a-2227-4d06-9c4a-e9becd159945	b6bf9d6c-6199-4696-8547-c54430551952	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
33bab834-fb9a-4b4d-887b-58c2e27dac2f	b6bf9d6c-6199-4696-8547-c54430551952	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
61216b23-f8e1-47e7-b481-f3e2b6df66f0	b6bf9d6c-6199-4696-8547-c54430551952	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
9db245bf-e09b-4754-af86-4ab89b1485df	6c1d2b26-aae6-45b6-bddf-7e5147f820db	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
f8fb2607-6b8e-4d05-b5df-f39c4b142946	6c1d2b26-aae6-45b6-bddf-7e5147f820db	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
03faa52b-47c1-43e0-a6b9-12af1b61088b	6c1d2b26-aae6-45b6-bddf-7e5147f820db	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
55780b96-db26-4276-b355-f98709c4184a	6c1d2b26-aae6-45b6-bddf-7e5147f820db	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
a2d1aac1-6312-4650-bea8-8a3e5a62dcb3	6c1d2b26-aae6-45b6-bddf-7e5147f820db	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
05c21ac2-c3a2-4201-8b0a-18709939a27e	339cac28-03da-431d-aaa3-d5d421f5b863	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
84f56530-25b5-49b7-bf81-9e02fd6bf100	339cac28-03da-431d-aaa3-d5d421f5b863	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
d5c0fd07-98f6-45cb-966f-196c39ac1872	339cac28-03da-431d-aaa3-d5d421f5b863	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
641b82a0-b0d8-415b-85f1-88173bc9cb49	339cac28-03da-431d-aaa3-d5d421f5b863	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
40ee7f03-18e4-4f06-a9cb-56eb96b78ede	339cac28-03da-431d-aaa3-d5d421f5b863	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
8efb986b-15dc-406d-8328-9575d97b17e8	9cd43185-97b3-451d-89d1-7aacc8fdc016	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
e745da88-93ba-4640-9621-d28e1574af25	9cd43185-97b3-451d-89d1-7aacc8fdc016	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
9fd1b279-1981-4706-8bad-456fc2573cc0	9cd43185-97b3-451d-89d1-7aacc8fdc016	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
1abe3d3c-8487-4aab-bba2-1b2fb97da591	9cd43185-97b3-451d-89d1-7aacc8fdc016	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
70df953e-74aa-445c-9c2a-e5a68c0f1145	9cd43185-97b3-451d-89d1-7aacc8fdc016	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
548a4b6b-9aeb-4bec-bdb1-b8ac594e9e79	1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
c3682c4b-6082-4c07-84ac-2168f3e6dd68	1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
947e58a5-9090-4d78-9458-ab5e97df4bfe	1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
3c722c4c-7c48-4fa0-a103-b895f74bed03	1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
e9f73837-7063-49bf-b102-b1fb95aa1d4b	1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
fd6112c6-66c0-47a0-97df-c67a7f37e836	1bd85d31-c2d1-4a69-9fbd-4785781631e0	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
b5f1f177-e1b0-4736-b971-b056738dd633	1bd85d31-c2d1-4a69-9fbd-4785781631e0	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
a761ccc3-8422-4192-ba2b-a09da63064f3	1bd85d31-c2d1-4a69-9fbd-4785781631e0	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
8514a539-2be7-44a5-89fe-b206797e867f	1bd85d31-c2d1-4a69-9fbd-4785781631e0	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
f5114ae1-4cd3-438b-9456-f68b47d4cfcf	1bd85d31-c2d1-4a69-9fbd-4785781631e0	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
02b8fed3-addb-4992-af10-85c9b60debf2	a98b2c14-9ae5-4020-8b92-36bc3499bf54	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
6bf3b91b-075c-44fe-a0fb-94a9acea9a99	a98b2c14-9ae5-4020-8b92-36bc3499bf54	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
30de62a8-4d41-4e3b-a9e7-c29538aab470	a98b2c14-9ae5-4020-8b92-36bc3499bf54	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
475bbbe4-b49c-4b46-88c4-41115c787a60	a98b2c14-9ae5-4020-8b92-36bc3499bf54	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
39344002-c387-4fba-af8c-6eddd11f7dbd	a98b2c14-9ae5-4020-8b92-36bc3499bf54	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
a7296e73-cf96-465d-9ce5-18b1855c552a	b1f53242-f29c-461a-aad8-ebd7d8288d4b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
9b5c31bf-5d87-4483-a6ab-67de07bf2609	b1f53242-f29c-461a-aad8-ebd7d8288d4b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
95ed6e49-8d47-4c87-b60d-4a45bda4b2d9	b1f53242-f29c-461a-aad8-ebd7d8288d4b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
85cec9c7-91c0-4a55-a4e0-57448ff68c0e	b1f53242-f29c-461a-aad8-ebd7d8288d4b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
223474e2-8ace-4013-bdf5-477fd2d04da6	b1f53242-f29c-461a-aad8-ebd7d8288d4b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
a2b3cbbd-e591-46cf-8812-6d7d58113549	7bb93adb-2a81-44f9-a535-796f9226c47b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
5f6d4fd1-f925-4a35-bdd3-1c235f8d2ee4	7bb93adb-2a81-44f9-a535-796f9226c47b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
3c994944-7d67-49f8-a579-6a8fcbbf84bd	7bb93adb-2a81-44f9-a535-796f9226c47b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
c944b1f0-fc6d-4704-ad18-3564f90439e8	7bb93adb-2a81-44f9-a535-796f9226c47b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
1d60d5bc-f32a-4ef3-a16e-134157dc700a	7bb93adb-2a81-44f9-a535-796f9226c47b	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
a5158dd5-e83a-4df4-9838-4e75932f7b34	a3ead258-c172-40ab-be32-04eb24e8a676	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	f5415b83-9f7e-484f-8230-528bb43a47ed	compliant	2025-12-05 18:09:27.400342	[]	f
ff23da2e-c27a-4903-a85f-db130b56a2fc	a3ead258-c172-40ab-be32-04eb24e8a676	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	07e48687-de8a-4fa3-875b-7d40d761a4c6	compliant	2025-12-05 18:09:27.400342	[]	f
2e693c55-e3ea-4079-9bb1-f54675ee934e	a3ead258-c172-40ab-be32-04eb24e8a676	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	53356679-b3af-4f8a-b405-b5200ea8b462	compliant	2025-12-05 18:09:27.400342	[]	f
39921d32-e113-4c9b-8724-98f7655ae333	a3ead258-c172-40ab-be32-04eb24e8a676	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	5f5a5b3e-776a-45c9-8474-3f262c85fb87	compliant	2025-12-05 18:09:27.400342	[]	f
714d0f1f-12fd-442e-b5ea-1edd57397dae	a3ead258-c172-40ab-be32-04eb24e8a676	\N	Sample mapping for testing	2025-12-05 18:09:27.400342	2025-12-05 18:09:27.400342	physical	815965ef-0dac-41fc-90e2-ed0c91c1e66f	compliant	2025-12-05 18:09:27.400342	[]	f
25523d3f-4657-423a-ad0a-6ff1a431ca03	b6bf9d6c-6199-4696-8547-c54430551952	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
9079d1af-e3bf-4756-98ee-89b3caaba8f9	b6bf9d6c-6199-4696-8547-c54430551952	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
1fa68a83-937c-4159-9ecb-f98472658569	b6bf9d6c-6199-4696-8547-c54430551952	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
7ef557f8-a082-417f-a4b8-c9f01f6e7516	6c1d2b26-aae6-45b6-bddf-7e5147f820db	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
c31fb2d0-bafe-4a1b-ba10-3827f09dcd09	6c1d2b26-aae6-45b6-bddf-7e5147f820db	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
92326409-86db-4ad6-a1ce-1b510052b32a	6c1d2b26-aae6-45b6-bddf-7e5147f820db	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
d79c6172-8f5b-483f-9948-d8a638c0f60f	339cac28-03da-431d-aaa3-d5d421f5b863	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
094b9924-7970-4060-93bf-d8da37a2339e	339cac28-03da-431d-aaa3-d5d421f5b863	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
2f1f1e7d-48d3-4889-994a-b6859d65a343	339cac28-03da-431d-aaa3-d5d421f5b863	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
045effa0-59b6-48c0-9f79-4d8f3c3c8a68	9cd43185-97b3-451d-89d1-7aacc8fdc016	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
a68faa86-f861-4aa1-ba75-729cc922cf90	9cd43185-97b3-451d-89d1-7aacc8fdc016	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
8fca0905-b59a-45ec-8893-85b6b860c7ff	9cd43185-97b3-451d-89d1-7aacc8fdc016	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
99fdbd03-10b8-420e-a206-eb73179bf11d	1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
face8375-a405-479e-9c9e-4fb0af194fc3	1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
5d522ae4-f0b4-4b8d-b115-77ef2ca96be6	1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
36d43ba7-c105-4e26-a80b-e3a6cccdc122	1bd85d31-c2d1-4a69-9fbd-4785781631e0	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
7eee8a97-58a4-433c-ad8a-0086ee6e10b9	1bd85d31-c2d1-4a69-9fbd-4785781631e0	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
37ca238b-06ce-4ffc-8de4-427ffaf5b680	1bd85d31-c2d1-4a69-9fbd-4785781631e0	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
d3525860-56a1-461c-ac4a-93b93bd4e0f0	a98b2c14-9ae5-4020-8b92-36bc3499bf54	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
8faf2250-d60e-497f-a852-0468dab10e78	a98b2c14-9ae5-4020-8b92-36bc3499bf54	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
2669ebf7-9a2d-458c-98e9-c2036385840f	a98b2c14-9ae5-4020-8b92-36bc3499bf54	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
4c38c95c-cc0d-4c97-9dd2-8889769a2046	b1f53242-f29c-461a-aad8-ebd7d8288d4b	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
f3992b7b-49c6-4cd0-80b8-a698793405c5	b1f53242-f29c-461a-aad8-ebd7d8288d4b	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
d333b18f-e708-4138-99ce-32727ccacaee	b1f53242-f29c-461a-aad8-ebd7d8288d4b	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
50717e7a-f726-4e7e-b08f-60c8febc16d3	7bb93adb-2a81-44f9-a535-796f9226c47b	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
6a158d26-039d-4de3-8f64-28b12016e8da	7bb93adb-2a81-44f9-a535-796f9226c47b	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
5f4a9ce0-a05c-4e0f-936d-3221ac8abefd	7bb93adb-2a81-44f9-a535-796f9226c47b	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
7cbffcbd-9ce4-4b90-ac4b-3dbca8988ea7	a3ead258-c172-40ab-be32-04eb24e8a676	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	non_compliant	2025-12-05 18:09:27.411434	[]	f
b707188c-099d-4f96-885c-e871d5809f34	a3ead258-c172-40ab-be32-04eb24e8a676	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	f3f41c64-b580-41e8-b1e4-f59b17bcaf85	non_compliant	2025-12-05 18:09:27.411434	[]	f
435e2f4a-0183-4246-a217-d77b64d44555	a3ead258-c172-40ab-be32-04eb24e8a676	\N	Sample mapping for testing	2025-12-05 18:09:27.411434	2025-12-05 18:09:27.411434	information	af209445-43d1-4248-9670-99d29e885778	non_compliant	2025-12-05 18:09:27.411434	[]	f
\.


--
-- Data for Name: asset_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_types (id, category, name, description, is_active, created_at, updated_at) FROM stdin;
ac8f2319-ac30-40f3-8a2a-2c08688f4000	physical	Network Equipment	Routers, switches, firewalls, and network infrastructure	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
71479ea7-b65d-4a15-8371-279a70ffeddf	physical	IT Hardware	Servers, workstations, laptops, and computing devices	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
129313d7-ece1-4e33-88c5-7690824f94ea	physical	Specialized Equipment	IoT devices, printers, storage devices, and specialized hardware	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
0cf4440a-251a-4972-92ea-7e3b88655675	information	Customer Data	Customer PII, contact information, and personal data	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
98ed722f-5df7-4a71-a56b-36d055482693	information	Financial Data	Financial records, transactions, and accounting data	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
f0283420-8226-46bc-9acf-7f3f5af8ec4a	information	Intellectual Property	Patents, trade secrets, and proprietary information	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
6a063612-ed2a-4930-ab49-57048fbc0cec	information	Health Information	PHI and medical records	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
40d931b8-6cab-4e49-af07-186688cacf03	application	CRM	Customer Relationship Management systems	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
2822ce03-5ee6-45e7-9e1d-38c6e0d3be90	application	ERP	Enterprise Resource Planning systems	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
f2ddfbb9-173f-41a6-a130-36c06055f8b4	application	Collaboration	Email, chat, and collaboration tools	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
20cc9b8d-7747-47cd-ac8d-10ae37747970	application	Database	Database management systems	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
550e5b03-3eb5-4b4b-b925-b25baa27e62e	application	Web Application	Web-based applications and services	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
af284959-5ce7-4ecd-8971-3539ce6904ce	software	Operating System	OS software and system software	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
00141cd0-6bd0-4691-8b37-6ece819d2f60	software	Productivity	Office suites, productivity tools	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
7386aa21-1a74-461c-830d-afcabf5b6932	software	Development Tools	IDEs, compilers, and development software	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
0bbf909a-103c-4202-9c8e-3062dfed9d94	software	Security Software	Antivirus, firewalls, and security tools	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
8253aeaa-2b14-4041-b014-6ea43189c4dc	supplier	Vendor	Product and service vendors	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
50a1f1ad-cf4f-4a25-91b9-453578879e08	supplier	Consultant	Consulting services providers	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
545d250c-af51-4a0c-8a65-0d7cc9a17c2d	supplier	Service Provider	Managed service providers	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
2ba0966c-688f-4bc1-b53b-a59755cd4475	supplier	Contractor	Contract workers and contractors	t	2025-12-01 19:51:54.198594	2025-12-01 19:51:54.198594
\.


--
-- Data for Name: business_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.business_applications (id, description, version_number, vendor, owner_id, department, status, url, notes, created_by_id, updated_by_id, unique_identifier, application_name, application_type, patch_level, "vendorContact", "vendorEmail", "vendorPhone", "ownerId", business_unit, criticality_level, "dataTypesProcessed", "processesPII", "processesPHI", "processesFinancialData", "hostingLocation", compliance_requirements, "customAttributes", deleted_at, deleted_by, created_by, updated_by, created_at, updated_at, business_unit_id, business_purpose, data_processed, data_classification, vendor_name, vendor_contact, license_type, license_count, license_expiry, hosting_type, hosting_location, access_url, security_test_results, last_security_test_date, authentication_method) FROM stdin;
2d4b7be2-aed0-472d-ae18-0e8e2383564a	Core ERP system managing finance, HR, supply chain, and operations.	12.5	Oracle Corporation	\N	Enterprise Applications	active	https://erp.company.internal	Critical business system. Requires 99.9% uptime SLA.	\N	\N	APP-ERP-001	Enterprise Resource Planning System	web_application	12.5.3	John Smith	support@oracle.com	+1-800-ORACLE-1	b1b35a04-894c-4b77-b209-8d79bee05ec9	IT Operations	critical	["financial","hr","inventory","customer"]	t	f	t	on_premise	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.029116	2025-11-30 09:52:00.029116	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
87e75e00-f423-4b9f-8c6f-1db2a756c4ac	CRM system for managing customer interactions, sales pipeline, and marketing campaigns.	2024.1	Salesforce	\N	Sales Operations	active	https://company.salesforce.com	Cloud-hosted SaaS application. Regular security reviews required.	\N	\N	APP-CRM-001	Customer Relationship Management	web_application	2024.1.2	Sarah Johnson	support@salesforce.com	+1-800-SALESFORCE	b1b35a04-894c-4b77-b209-8d79bee05ec9	Sales	high	["customer","sales","marketing"]	t	f	f	cloud	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.029116	2025-11-30 09:52:00.029116	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fff5ad75-327b-477d-93f8-ea364d670b45	Mobile application for customers to access services, make payments, and manage accounts.	3.2	Internal Development	\N	Mobile Development	active	https://apps.apple.com/company-app	Public-facing mobile application. Security and privacy critical.	\N	\N	APP-MOBILE-001	Customer Mobile App	mobile_app	3.2.1	Development Team	dev@company.com	+966-50-123-4567	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Product Development	high	["customer","payment","transaction"]	t	f	t	cloud	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.029116	2025-11-30 09:52:00.029116	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9fb220bc-95ad-4156-bcd0-39e9cd3dc1d7	Central API gateway managing authentication, rate limiting, and routing for microservices.	2.0	Internal Development	\N	Platform Engineering	active	https://api.company.com	Critical infrastructure component. All API traffic flows through this.	\N	\N	APP-API-GATEWAY-001	API Gateway Service	api_service	2.0.5	Platform Team	platform@company.com	+966-50-123-4568	b1b35a04-894c-4b77-b209-8d79bee05ec9	IT Operations	critical	["api","authentication","routing"]	t	f	t	cloud	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.029116	2025-11-30 09:52:00.029116	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4187ef95-5122-444a-bb75-ae96297002d2	Primary production database hosting all critical business data.	15.2	Oracle Corporation	\N	Database Administration	active	\N	Most critical system. Requires continuous monitoring and backup.	\N	\N	APP-DB-PROD-001	Production Database	database	15.2.3	Database Support	db-support@oracle.com	+1-800-ORACLE-1	b1b35a04-894c-4b77-b209-8d79bee05ec9	IT Operations	critical	["all"]	t	f	t	on_premise	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.029116	2025-11-30 09:52:00.029116	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5d23652e-8c45-48e7-a8c2-57ecb9a736ef	Analytics and business intelligence platform for reporting and data visualization.	10.5	Tableau Software	\N	Analytics	active	https://analytics.company.com	Used for executive reporting and business insights.	\N	\N	APP-ANALYTICS-001	Business Analytics Platform	web_application	10.5.1	Support Team	support@tableau.com	+1-800-TABLEAU	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Business Intelligence	medium	["analytics","reporting","visualization"]	f	f	t	cloud	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.029116	2025-11-30 09:52:00.029116	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3000c76b-1f69-426c-923c-e386ef122855	\N	2.5.1	\N	\N	\N	active	\N	\N	\N	\N	APP-MJ0HISDJ-92SG	Customer Portal	web_application	2.5.1.3	\N	\N	\N	\N	\N	critical	\N	f	f	f	\N	["GDPR","PCI-DSS"]	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:51:44.557005	2025-12-10 20:51:44.557005	\N	Customer self-service portal for account management	["Customer Data", "Payment Information"]	confidential	Internal Development	{"name": "Dev Team", "email": "dev@company.com", "phone": "+1-555-0100"}	Internal	1	\N	cloud	AWS	https://portal.company.com	\N	2023-11-15	OAuth 2.0
b4c6c6fa-2d95-4d84-83c3-3245496feeca	\N	3.2.0	\N	\N	\N	active	\N	\N	\N	\N	APP-MJ0HISEF-OSA2	HR Management System	web_application	3.2.0.1	\N	\N	\N	\N	\N	high	\N	f	f	f	\N	["GDPR","HIPAA"]	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:51:44.58424	2025-12-10 20:51:44.58424	\N	Human resources management and employee records	["Employee Data", "Personal Information"]	restricted	Workday	{"name": "Workday Support", "email": "support@workday.com", "phone": "1-866-967-5293"}	SaaS	1	2024-12-31	cloud	Workday Cloud	https://company.workday.com	\N	2023-10-01	SAML
d75ddc27-ea1b-444f-924d-6ca314d6789a	\N	1.8.2	\N	\N	\N	active	\N	\N	\N	\N	APP-MJ0HISEN-2WFZ	Internal Wiki	web_application	1.8.2.5	\N	\N	\N	\N	\N	medium	\N	f	f	f	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:51:44.59331	2025-12-10 20:51:44.59331	\N	Internal knowledge base and documentation	["Internal Documentation"]	internal	Confluence	{"name": "Atlassian Support", "email": "support@atlassian.com", "phone": "1-800-425-9379"}	Subscription	1	2024-08-31	cloud	Atlassian Cloud	https://company.atlassian.net	\N	2023-09-10	SSO
7d64d4ec-99e3-435b-85de-fbbbbd81dc34	\N	\N	\N	\N	\N	active	\N	\N	\N	\N	APP-MJ49TDGT-J0S2	Test App 1765628821878	web_application	\N	\N	\N	\N	\N	\N	medium	\N	f	f	f	\N	[]	\N	\N	\N	\N	\N	2025-12-13 12:27:06.268863	2025-12-13 12:27:06.268863	\N	Test business application for verification	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
d57d50a2-b1d6-4254-9d05-daef69f7604e	\N	\N	\N	\N	\N	active	\N	\N	\N	\N	APP-MJ4A6T4B-CLDC	Test App 1765629449815	web_application	\N	\N	\N	\N	\N	\N	medium	\N	f	f	f	\N	[]	\N	\N	\N	\N	\N	2025-12-13 12:37:33.051817	2025-12-13 12:37:33.051817	\N	Test business application for verification	[]	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
82b177b6-cafc-44e7-949f-408b2b3842d4	\N	1.0.0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	active	\N	\N	\N	\N	APP-MJ4CMT59-O3Z8	Test App 1765633542191	web_application	1.0.1	\N	\N	\N	\N	\N	high	\N	f	f	f	\N	[]	\N	\N	\N	\N	\N	2025-12-13 13:45:58.819301	2025-12-13 13:45:58.819301	81b33af4-d7b4-48a3-9bca-8817c3b88873	Test business application for verification	[]	\N	Test Vendor Corp.	{}	\N	\N	\N	\N	on_premise	https://test-app.example.com	\N	\N	\N
2e545f92-507f-46e8-a1b3-9574ec231431	\N	1.0.0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	active	\N	\N	\N	\N	APP-MJ4CNQTI-UT9B	Test App 1765633586020	web_application	1.0.1	\N	\N	\N	\N	\N	high	\N	f	f	f	\N	[]	\N	\N	\N	\N	\N	2025-12-13 13:46:42.466654	2025-12-13 13:46:42.466654	81b33af4-d7b4-48a3-9bca-8817c3b88873	Test business application for verification	[]	\N	Test Vendor Corp.	{}	\N	\N	\N	\N	on_premise	https://test-app.example.com	\N	\N	\N
\.


--
-- Data for Name: business_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.business_units (id, name, code, parent_id, description, manager_id, created_at, updated_at, deleted_at) FROM stdin;
930a22cb-8f5a-44f8-90b5-a95dbcbe9f4f	IT Operations	IT-OPERATIONS	\N	IT Operations business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
7e60f030-2606-419c-8f8a-76e186f13497	Finance	FINANCE	\N	Finance business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
6773b366-7890-4085-9f3c-a1ea31150ee7	Human Resources	HUMAN-RESOURCES	\N	Human Resources business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
09404771-5ec9-47f1-9d63-5261f4c739f0	Executive	EXECUTIVE	\N	Executive business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
35f2a415-a549-4b3e-9caa-33983adab09b	Customer Relations	CUSTOMER-RELATIONS	\N	Customer Relations business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
c8366c0d-a8ec-49fe-9bd2-f50130bd1d9d	Legal	LEGAL	\N	Legal business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
d7445a9c-6627-4aee-8121-babd4c2c0bfa	Marketing	MARKETING	\N	Marketing business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
af6ec7a7-be05-4a17-90e3-fe5fddcda175	Compliance	COMPLIANCE	\N	Compliance business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
aaecc0f2-1c06-4fcc-bb86-e830999848df	Sales	SALES	\N	Sales business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
3439dc08-9496-474c-865d-eb9cb7327b4a	Product Development	PRODUCT-DEVELOPMENT	\N	Product Development business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
81b33af4-d7b4-48a3-9bca-8817c3b88873	Business Intelligence	BUSINESS-INTELLIGENCE	\N	Business Intelligence business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
956c79fa-6cf6-4e65-9f92-d52d5bc1a4e1	IT Security	IT-SECURITY	\N	IT Security business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
6d0aab8a-d9a4-4a5d-a0e7-131de0305f3f	Facilities	FACILITIES	\N	Facilities business unit	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-12 20:01:23.766515	2025-12-12 20:01:23.766515	\N
\.


--
-- Data for Name: compliance_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compliance_assessments (id, requirement_id, assessed_by, notes, asset_type, asset_id, assessment_type, previous_status, new_status, validation_results, assessed_at) FROM stdin;
\.


--
-- Data for Name: compliance_frameworks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compliance_frameworks (id, name, code, description, region, "organizationId", "createdAt", "updatedAt") FROM stdin;
37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	NCA	NCA	National Cybersecurity Authority Framework	Saudi Arabia	\N	2025-11-29 16:22:22.883659	2025-11-29 16:22:22.883659
59d51a64-e356-475c-9f62-e78a30e18471	SAMA	SAMA	Saudi Arabian Monetary Authority Framework	Saudi Arabia	\N	2025-11-29 16:22:22.883659	2025-11-29 16:22:22.883659
08f2bc40-f8e5-4931-9277-6a7afe706d22	ADGM	ADGM	Abu Dhabi Global Market Framework	UAE	\N	2025-11-29 16:22:22.883659	2025-11-29 16:22:22.883659
\.


--
-- Data for Name: compliance_obligations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compliance_obligations (id, influencer_id, obligation_text, obligation_category, priority, responsible_party_id, status, due_date, completion_date, notes, created_by, created_at, updated_by, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: compliance_requirements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compliance_requirements (id, title, description, "requirementCode", status, "organizationId", "createdAt", "updatedAt", framework_id, category, "complianceDeadline", applicability) FROM stdin;
b6bf9d6c-6199-4696-8547-c54430551952	Secure Integration	Secure integration between applications.	1-6-3-4	not_started	\N	2025-11-29 18:34:50.145193	2025-11-29 18:34:50.145193	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
6c1d2b26-aae6-45b6-bddf-7e5147f820db	Configuration Review Before Launch	Reviewing secure configuration and hardening and updates packages before launching software products.	1-6-3-5	not_started	\N	2025-11-29 18:34:50.14609	2025-11-29 18:34:50.14609	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
339cac28-03da-431d-aaa3-d5d421f5b863	Project Requirements Review	The cybersecurity requirements for project management within the entity shall be periodically reviewed.	1-6-4	not_started	\N	2025-11-29 18:34:50.146905	2025-11-29 18:34:50.146905	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
9cd43185-97b3-451d-89d1-7aacc8fdc016	International Agreements Compliance	If there are nationally approved international agreements or commitments that include cybersecurity requirements the entity shall identify and comply with these requirements.	1-7-1	not_started	\N	2025-11-29 18:34:50.147945	2025-11-29 18:34:50.147945	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Compliance with Standards Laws and Regulations	\N	All entities
1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	Internal Review	The cybersecurity department of the entity shall periodically review the implementation of cybersecurity controls by the entity.	1-8-1	not_started	\N	2025-11-29 18:34:50.148783	2025-11-29 18:34:50.148783	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Periodical Review and Audit	\N	All entities
1bd85d31-c2d1-4a69-9fbd-4785781631e0	Independent Audit	The implementation of cybersecurity controls by the entity shall be reviewed and audited by parties other than the cybersecurity department at the entity provided that the audit and review are to be conducted independently while considering the principle of conflict of interest as per the Generally Accepted Auditing Standards and the relevant legislative and regulatory requirements.	1-8-2	not_started	\N	2025-11-29 18:34:50.150401	2025-11-29 18:34:50.150401	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Periodical Review and Audit	\N	All entities
a98b2c14-9ae5-4020-8b92-36bc3499bf54	Audit Documentation and Reporting	The results of cybersecurity audits and reviews shall be documented and presented to the cybersecurity supervisory committee and the Authorized Official. Results shall include the audit and review scope observations recommendations corrective actions and remediation plans.	1-8-3	not_started	\N	2025-11-29 18:34:50.151426	2025-11-29 18:34:50.151426	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Periodical Review and Audit	\N	All entities
b1f53242-f29c-461a-aad8-ebd7d8288d4b	HR Cybersecurity Requirements	Cybersecurity requirements for personnel of the entity shall be identified documented and approved prior to during and upon the end or termination of their employment.	1-9-1	not_started	\N	2025-11-29 18:34:50.152318	2025-11-29 18:34:50.152318	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
7bb93adb-2a81-44f9-a535-796f9226c47b	HR Requirements Implementation	Cybersecurity requirements for personnel of the entity shall be implemented.	1-9-2	not_started	\N	2025-11-29 18:34:50.153181	2025-11-29 18:34:50.153181	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
a3ead258-c172-40ab-be32-04eb24e8a676	Pre-Employment Requirements	Cybersecurity requirements prior to the commencement of the employment relationship between personnel and the entity shall include the following as a minimum.	1-9-3	not_started	\N	2025-11-29 18:34:50.154174	2025-11-29 18:34:50.154174	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
c81712c7-73a6-477b-b698-9080f9d43bba	Employment Contract Clauses	Incorporating the personnel's cybersecurity responsibilities clauses and non-disclosure clauses in their employment contracts with the entity (including during and after employment end/termination with the entity).	1-9-3-1	not_started	\N	2025-11-29 18:34:50.15504	2025-11-29 18:34:50.15504	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
bd067e35-4cdf-4ee4-87a2-effdc6e65bdb	Personnel Screening	Conducting screening or vetting for personnel in cybersecurity positions and technical positions with critical and privileged powers.	1-9-3-2	not_started	\N	2025-11-29 18:34:50.156048	2025-11-29 18:34:50.156048	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
4ec6dd84-d569-4992-9986-1f269b2e4afa	During Employment Requirements	Cybersecurity requirements for personnel during their employment relationship with the entity shall include the following as a minimum.	1-9-4	not_started	\N	2025-11-29 18:34:50.157528	2025-11-29 18:34:50.157528	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
d9a81df5-a907-4cb5-b1e8-69baa64ef413	Cybersecurity Awareness	Cybersecurity awareness (during on-boarding and during employment).	1-9-4-1	not_started	\N	2025-11-29 18:34:50.158334	2025-11-29 18:34:50.158334	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
7a36d6e8-4b6c-467a-8985-1c6844c98108	Policy Compliance	Implementation and compliance with cybersecurity requirements as per the entity's cybersecurity policies procedures and operations.	1-9-4-2	not_started	\N	2025-11-29 18:34:50.16033	2025-11-29 18:34:50.16033	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
056788ce-afc8-4aff-a1a5-d04f6c8d6f99	Access Revocation	The personnel's powers shall be reviewed and revoked immediately upon the end/termination of their employment with the entity.	1-9-5	not_started	\N	2025-11-29 18:34:50.162193	2025-11-29 18:34:50.162193	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
166ee906-9e25-4ffb-a365-acac2413475a	HR Requirements Review	Cybersecurity requirements for personnel of the entity shall be periodically reviewed.	1-9-6	not_started	\N	2025-11-29 18:34:50.163587	2025-11-29 18:34:50.163587	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Human Resources	\N	All entities
3419f238-b607-4e68-8cc3-59efb39df00a	Cybersecurity Strategy Documentation	The cybersecurity strategy of the entity shall be identified documented and approved and it shall be supported by the head of the entity or his/her delegate. The strategy goals shall be in line with the relevant legislative and regulatory requirements.	1-1-1	not_started	\N	2025-11-29 18:34:49.451234	2025-11-29 18:34:49.451234	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Strategy	\N	All entities
f6067562-54f4-40b8-b040-cb40b0f1101d	Strategy Execution Plan	The entity shall execute an action plan to apply the cybersecurity strategy.	1-1-2	not_started	\N	2025-11-29 18:34:49.542213	2025-11-29 18:34:49.542213	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Strategy	\N	All entities
d9060736-d1c4-4206-af08-483af674a32f	Strategy Review	The cybersecurity strategy shall be reviewed at planned intervals or in case of changes to the relevant legislative and regulatory requirements.	1-1-3	not_started	\N	2025-11-29 18:34:49.80375	2025-11-29 18:34:49.80375	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Strategy	\N	All entities
1cfaf4ab-d0a0-44fa-810c-33e50da8514e	Cybersecurity Department Establishment	A department for cybersecurity shall be established within the entity. This department shall be independent from the Information Technology and Communications Department. It is recommended that the Cybersecurity Department reports directly to the head of the entity or his/her delegate while ensuring that this does not result in a conflict of interests.	1-2-1	not_started	\N	2025-11-29 18:34:50.094502	2025-11-29 18:34:50.094502	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Management	\N	All entities
03d5c82c-71f5-46e1-bb9f-5f7948555a6a	Cybersecurity Staffing	All cybersecurity positions shall be filled out with full-time and qualified Saudi cybersecurity professionals.	1-2-2	not_started	\N	2025-11-29 18:34:50.11009	2025-11-29 18:34:50.11009	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Management	\N	All entities
7d9edfb6-8df7-4a7f-9dd5-5d3eb2503f6c	Cybersecurity Supervisory Committee	A cybersecurity supervisory committee shall be established pursuant to the instruction of the entity's Authorized Official to ensure compliance with support for and monitoring of the implementation of the cybersecurity programs and regulations. The committee's members responsibilities and governance framework shall be identified documented and approved.	1-2-3	not_started	\N	2025-11-29 18:34:50.114168	2025-11-29 18:34:50.114168	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Management	\N	All entities
612fb31e-ee3e-4f77-9141-5c5821a044f4	Policy Documentation	The cybersecurity department of the entity shall identify and document cybersecurity policies and procedures including the cybersecurity controls and requirements and have them approved by the entity's Authorized Official and communicate them to the relevant personnel and parties inside the entity.	1-3-1	not_started	\N	2025-11-29 18:34:50.115665	2025-11-29 18:34:50.115665	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Policies and Procedures	\N	All entities
4ea1bf46-5bcf-48f6-a98a-254b1911c5ed	Policy Implementation	The cybersecurity department shall ensure that the cybersecurity policies and procedures including the relevant controls and requirements are implemented at the entity.	1-3-2	not_started	\N	2025-11-29 18:34:50.117462	2025-11-29 18:34:50.117462	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Policies and Procedures	\N	All entities
adcb204f-69fa-4201-8778-988534e67676	Technical Security Standards	The cybersecurity policies and procedures shall be supported by technical security standards (e.g. technical security standards for firewall databases operating systems etc.).	1-3-3	not_started	\N	2025-11-29 18:34:50.119857	2025-11-29 18:34:50.119857	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Policies and Procedures	\N	All entities
f2cc5cbd-ef5f-48de-bde4-0fa0020394fe	Policy Review and Update	The cybersecurity policies and procedures shall be reviewed and updated at planned intervals or in case of changes to the relevant legislative and regulatory requirements and standards. Changes shall be documented and approved.	1-3-4	not_started	\N	2025-11-29 18:34:50.120974	2025-11-29 18:34:50.120974	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Policies and Procedures	\N	All entities
3d460101-e4ec-4315-bd70-423d0bb9c342	Roles and Responsibilities Documentation	The Authorized Official shall identify document and approve the governance organizational structure roles and responsibilities of the entity's cybersecurity and assign the persons concerned therewith. The necessary support shall be provided for the implementation thereof while ensuring that this does not result in a conflict of interests.	1-4-1	not_started	\N	2025-11-29 18:34:50.122098	2025-11-29 18:34:50.122098	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Roles and Responsibilities	\N	All entities
86a8fb50-3af6-4b9c-9231-5bd4315a0c1c	Roles Review	The cybersecurity roles and responsibilities within the entity shall be reviewed and updated at planned intervals or in case of changes to the relevant legislative and regulatory requirements.	1-4-2	not_started	\N	2025-11-29 18:34:50.123065	2025-11-29 18:34:50.123065	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Roles and Responsibilities	\N	All entities
7c82ab04-d94b-444c-83e9-b47f0a311fe7	Risk Management Methodology	The cybersecurity department of the entity shall identify document and approve the cybersecurity risk management methodology and procedures within the entity in accordance with considerations of confidentiality and the integrity and availability of information and technology assets.	1-5-1	not_started	\N	2025-11-29 18:34:50.124777	2025-11-29 18:34:50.124777	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Risk Management	\N	All entities
ffb28957-18be-4051-8ebf-3f8942fb6158	Risk Management Implementation	The cybersecurity department shall implement the cybersecurity risk management methodology and procedures within the entity.	1-5-2	not_started	\N	2025-11-29 18:34:50.126145	2025-11-29 18:34:50.126145	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Risk Management	\N	All entities
82856c64-da89-4d36-94d7-e6c7605bb9a2	Risk Assessment Procedures	The cybersecurity risk assessment procedures shall be implemented at least in the following cases.	1-5-3	not_started	\N	2025-11-29 18:34:50.127667	2025-11-29 18:34:50.127667	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Risk Management	\N	All entities
e8dc6124-815a-45f3-b4da-ad5843800f22	Risk Assessment - Early Stage Projects	At early stage of technology projects.	1-5-3-1	not_started	\N	2025-11-29 18:34:50.129195	2025-11-29 18:34:50.129195	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Risk Management	\N	All entities
8dab4ffa-f5bd-42d8-883b-d7e6d6f5e692	Risk Assessment - Infrastructure Changes	Before making major changes to technology infrastructure.	1-5-3-2	not_started	\N	2025-11-29 18:34:50.131259	2025-11-29 18:34:50.131259	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Risk Management	\N	All entities
25a87947-a282-48c4-807d-e082f2c0b839	Risk Assessment - Third Party Services	During planning to obtain third party services.	1-5-3-3	not_started	\N	2025-11-29 18:34:50.132926	2025-11-29 18:34:50.132926	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Risk Management	\N	All entities
a37d80e3-6944-4e3d-b1e9-ace9fb5942a2	Risk Assessment - New Services	During planning and before the release of new technology services and products.	1-5-3-4	not_started	\N	2025-11-29 18:34:50.134202	2025-11-29 18:34:50.134202	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Risk Management	\N	All entities
fbc14f3b-d711-4e2e-95e7-8a6f2daad123	Risk Management Review	The cybersecurity risk management methodology and procedures shall be reviewed and updated at planned intervals or in case of changes to the relevant legislative and regulatory requirements and standards. Changes shall be documented and approved.	1-5-4	not_started	\N	2025-11-29 18:34:50.135466	2025-11-29 18:34:50.135466	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity Risk Management	\N	All entities
319032e1-98a1-4631-b217-71a90487f69c	IAM Review	The implementation of cybersecurity requirements for identity and access management of the entity shall be periodically reviewed.	2-2-4	not_started	\N	2025-11-29 18:34:50.190574	2025-11-29 18:34:50.190574	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Identity and Access Management	\N	All entities
e094cdad-036d-4cba-9006-581882798602	SAMA Requirement 1	Compliance requirement 1 for SAMA	SAMA-REQ-001	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
14137f74-08f4-4526-9188-e9773976ff45	SAMA Requirement 2	Compliance requirement 2 for SAMA	SAMA-REQ-002	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
28b87f71-db27-45dc-95f4-c8aa42f0f38f	SAMA Requirement 3	Compliance requirement 3 for SAMA	SAMA-REQ-003	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
dfa689f5-bb89-4168-8ff8-5c81bea68aea	SAMA Requirement 4	Compliance requirement 4 for SAMA	SAMA-REQ-004	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
8307d8b5-4daf-4ee5-a3fb-a520adc24766	SAMA Requirement 5	Compliance requirement 5 for SAMA	SAMA-REQ-005	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
76100cea-376f-4a1e-9c62-8080e30667c4	SAMA Requirement 6	Compliance requirement 6 for SAMA	SAMA-REQ-006	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
77206220-7977-4728-b273-ac750248e30e	SAMA Requirement 7	Compliance requirement 7 for SAMA	SAMA-REQ-007	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
f20331b5-eac4-4b5c-be49-3ce4a25c9e15	SAMA Requirement 8	Compliance requirement 8 for SAMA	SAMA-REQ-008	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
e11af82a-1157-4312-b2be-6ec20f2589d6	SAMA Requirement 9	Compliance requirement 9 for SAMA	SAMA-REQ-009	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
dc641f47-00ad-4d32-a8d7-a70f42beff7a	SAMA Requirement 10	Compliance requirement 10 for SAMA	SAMA-REQ-010	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
53563b7c-d912-415f-a493-f126b7a4fcb4	SAMA Requirement 11	Compliance requirement 11 for SAMA	SAMA-REQ-011	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
31ad8397-b6b9-4e63-98d3-8515c5225bb2	SAMA Requirement 12	Compliance requirement 12 for SAMA	SAMA-REQ-012	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
d014fe03-f1c0-4d05-8085-95cafb9cc4dc	SAMA Requirement 13	Compliance requirement 13 for SAMA	SAMA-REQ-013	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
eff30632-f5f5-4259-9af3-b49e662299b1	SAMA Requirement 14	Compliance requirement 14 for SAMA	SAMA-REQ-014	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
a743563b-0c47-4ed2-98d5-2f09c7f946cc	SAMA Requirement 15	Compliance requirement 15 for SAMA	SAMA-REQ-015	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
314f61ad-e2e1-4df1-88c1-6e907054d793	SAMA Requirement 16	Compliance requirement 16 for SAMA	SAMA-REQ-016	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
ae68e86b-2099-4086-a628-c161e05dcd1a	SAMA Requirement 17	Compliance requirement 17 for SAMA	SAMA-REQ-017	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
4bb0c272-60b0-4d20-9604-90de7f643be8	SAMA Requirement 18	Compliance requirement 18 for SAMA	SAMA-REQ-018	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
82b5a11b-19d0-481e-b05c-f8484c449fc3	SAMA Requirement 19	Compliance requirement 19 for SAMA	SAMA-REQ-019	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
5c730b39-b5a6-4594-b3ca-8be5c19b22dd	SAMA Requirement 20	Compliance requirement 20 for SAMA	SAMA-REQ-020	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
e91700c7-0ee3-4f85-bb8e-beaa3cf56274	SAMA Requirement 21	Compliance requirement 21 for SAMA	SAMA-REQ-021	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
eba1690d-9602-45e9-a4f5-1cf7d59bcced	SAMA Requirement 22	Compliance requirement 22 for SAMA	SAMA-REQ-022	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
3dca2a70-edf0-43b7-9191-6425b87b1a57	SAMA Requirement 23	Compliance requirement 23 for SAMA	SAMA-REQ-023	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
000c4433-5a11-4aeb-b687-f730b17d45ad	SAMA Requirement 24	Compliance requirement 24 for SAMA	SAMA-REQ-024	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
58fb94cf-c630-4c60-8542-8b43be5f6e36	SAMA Requirement 25	Compliance requirement 25 for SAMA	SAMA-REQ-025	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
4f07b5a7-aba0-40a3-beb9-ac9f43c587e5	SAMA Requirement 26	Compliance requirement 26 for SAMA	SAMA-REQ-026	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
153f06ac-f2c5-4304-8f07-d3ffbcf0baa7	SAMA Requirement 27	Compliance requirement 27 for SAMA	SAMA-REQ-027	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
c69260d1-9e65-428f-a96c-80b0e950aa2c	SAMA Requirement 28	Compliance requirement 28 for SAMA	SAMA-REQ-028	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
396f83df-6806-4711-b1aa-6b2530b525af	SAMA Requirement 29	Compliance requirement 29 for SAMA	SAMA-REQ-029	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
3f825c21-df60-41b9-b895-b7982949a5a4	SAMA Requirement 30	Compliance requirement 30 for SAMA	SAMA-REQ-030	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
2a89e7fb-477d-4e84-bda8-685c27736040	SAMA Requirement 31	Compliance requirement 31 for SAMA	SAMA-REQ-031	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
3f4ccf58-e5e1-4776-96a1-b67dfe54fe56	SAMA Requirement 32	Compliance requirement 32 for SAMA	SAMA-REQ-032	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
ba640724-18d1-4417-bfa2-65759405a604	SAMA Requirement 33	Compliance requirement 33 for SAMA	SAMA-REQ-033	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
dbe786cc-4e09-4dcc-bd77-01ef2a1235b0	SAMA Requirement 34	Compliance requirement 34 for SAMA	SAMA-REQ-034	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
1fc5f757-d613-43d8-ae67-bdb163692631	SAMA Requirement 35	Compliance requirement 35 for SAMA	SAMA-REQ-035	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
9bbcfadc-07d4-41ab-8faf-80efa91852ea	SAMA Requirement 36	Compliance requirement 36 for SAMA	SAMA-REQ-036	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
091b02c4-a9cd-43fe-b9c6-843ef8876013	SAMA Requirement 37	Compliance requirement 37 for SAMA	SAMA-REQ-037	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
5d31dbce-32cf-425f-b9a2-ffcb4e8ecbd3	SAMA Requirement 38	Compliance requirement 38 for SAMA	SAMA-REQ-038	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
4835e910-e3b9-4f2d-a51d-c74b80baead4	SAMA Requirement 39	Compliance requirement 39 for SAMA	SAMA-REQ-039	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
c9f853b1-7714-4a22-9bb9-95d2ee7ff17c	SAMA Requirement 40	Compliance requirement 40 for SAMA	SAMA-REQ-040	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
2a6547db-8960-487c-9f99-83be67a21891	SAMA Requirement 41	Compliance requirement 41 for SAMA	SAMA-REQ-041	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
6b74aafe-2c41-4535-aa60-79a13c57a3b1	SAMA Requirement 42	Compliance requirement 42 for SAMA	SAMA-REQ-042	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
8c935676-0400-4e9b-928e-2fcf19f06ba3	SAMA Requirement 43	Compliance requirement 43 for SAMA	SAMA-REQ-043	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
ba16bb08-20ce-4445-8671-2aa2d385c5d9	SAMA Requirement 44	Compliance requirement 44 for SAMA	SAMA-REQ-044	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
cf48effa-6f21-4a72-b4d9-dedd54c008d7	SAMA Requirement 45	Compliance requirement 45 for SAMA	SAMA-REQ-045	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
2b32b90d-8cfe-48e4-be45-95973e84dba6	SAMA Requirement 46	Compliance requirement 46 for SAMA	SAMA-REQ-046	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
3a28ff23-dc1d-4af8-a5d2-fa6c122ec5a1	SAMA Requirement 47	Compliance requirement 47 for SAMA	SAMA-REQ-047	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
1e2188d8-7e97-48b4-9d4d-a34688a18f2d	SAMA Requirement 48	Compliance requirement 48 for SAMA	SAMA-REQ-048	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
29dfde16-5cf5-4571-b880-862cb0ea5cf6	SAMA Requirement 49	Compliance requirement 49 for SAMA	SAMA-REQ-049	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
30fbed7d-7166-4c18-a875-1095917c5157	SAMA Requirement 50	Compliance requirement 50 for SAMA	SAMA-REQ-050	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
0903dc5b-1d47-4518-a296-3fc5e4c7f931	SAMA Requirement 51	Compliance requirement 51 for SAMA	SAMA-REQ-051	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
9431945f-67e0-4874-8a6d-75aa48973d59	SAMA Requirement 52	Compliance requirement 52 for SAMA	SAMA-REQ-052	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
f24e2404-5998-4ea7-9f1a-fc8661a32870	SAMA Requirement 53	Compliance requirement 53 for SAMA	SAMA-REQ-053	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
044b65cc-fc2f-44b0-926a-359fd2a409a8	SAMA Requirement 54	Compliance requirement 54 for SAMA	SAMA-REQ-054	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
813094c6-1e14-4a7b-9851-1a35dd931a38	SAMA Requirement 55	Compliance requirement 55 for SAMA	SAMA-REQ-055	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
abc71b75-7ff5-45f2-894f-983f0b6d0eb6	SAMA Requirement 56	Compliance requirement 56 for SAMA	SAMA-REQ-056	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
c8278787-475e-469e-8e88-8346ca86b134	SAMA Requirement 57	Compliance requirement 57 for SAMA	SAMA-REQ-057	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
bbcd3aae-c5d4-4250-8e75-b59059e4a8c5	SAMA Requirement 58	Compliance requirement 58 for SAMA	SAMA-REQ-058	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
49dfd616-0dc7-49c6-831e-29992093f187	SAMA Requirement 59	Compliance requirement 59 for SAMA	SAMA-REQ-059	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
24965f6f-9dad-4ead-8d74-f71570bbb355	SAMA Requirement 60	Compliance requirement 60 for SAMA	SAMA-REQ-060	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
7155a93e-dd59-4347-ac0e-a993ae32f7fc	SAMA Requirement 61	Compliance requirement 61 for SAMA	SAMA-REQ-061	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
618109f5-3e04-44e1-a049-4e7b70ae2562	SAMA Requirement 62	Compliance requirement 62 for SAMA	SAMA-REQ-062	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
73d6a0c9-8ea5-4ded-a4bf-6d9bb7e5a686	SAMA Requirement 63	Compliance requirement 63 for SAMA	SAMA-REQ-063	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
ee4d383f-a6ec-42ef-a077-87c2ea728890	SAMA Requirement 64	Compliance requirement 64 for SAMA	SAMA-REQ-064	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
e6f6eb14-feb9-4b7a-85eb-cedc1e3f9ab2	SAMA Requirement 65	Compliance requirement 65 for SAMA	SAMA-REQ-065	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
daf4f2aa-dc69-45e8-880f-1c8d73789325	SAMA Requirement 66	Compliance requirement 66 for SAMA	SAMA-REQ-066	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
92552e0a-08ce-4cbd-9977-fc5e66d1f698	SAMA Requirement 67	Compliance requirement 67 for SAMA	SAMA-REQ-067	compliant	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
34c7a532-45ed-4f94-a33d-f28b539f8729	SAMA Requirement 68	Compliance requirement 68 for SAMA	SAMA-REQ-068	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
616e4eb2-90ee-44d3-8822-9ff4cdc8279d	SAMA Requirement 69	Compliance requirement 69 for SAMA	SAMA-REQ-069	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
8f2063a4-181f-43cf-a4c4-aa50bf386a7c	SAMA Requirement 70	Compliance requirement 70 for SAMA	SAMA-REQ-070	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
40da179e-9d08-4011-9168-1f250cd38bfd	SAMA Requirement 71	Compliance requirement 71 for SAMA	SAMA-REQ-071	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
1a02092e-d37e-49c8-8128-c2acfa81ffed	SAMA Requirement 72	Compliance requirement 72 for SAMA	SAMA-REQ-072	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
bfe86db6-7c54-414c-9d63-74d8373bb622	SAMA Requirement 73	Compliance requirement 73 for SAMA	SAMA-REQ-073	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
2e4ff64d-3313-4d7c-89b4-822e33f4e400	SAMA Requirement 74	Compliance requirement 74 for SAMA	SAMA-REQ-074	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
36284db5-86fa-4243-80ce-d82e05cae0f0	SAMA Requirement 75	Compliance requirement 75 for SAMA	SAMA-REQ-075	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
296845c4-44c8-459f-abd3-6b6cb0c0a6da	SAMA Requirement 76	Compliance requirement 76 for SAMA	SAMA-REQ-076	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
f9373a3d-fe19-4392-acd2-f7dc77ab1355	SAMA Requirement 77	Compliance requirement 77 for SAMA	SAMA-REQ-077	in_progress	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
38dc17cd-af1a-4144-b37f-08789c9bb0aa	SAMA Requirement 78	Compliance requirement 78 for SAMA	SAMA-REQ-078	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
d42c3fbd-ad46-43d9-bf49-be8991db19c6	SAMA Requirement 79	Compliance requirement 79 for SAMA	SAMA-REQ-079	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
416f4374-bf05-43a2-9ada-b9f7810f6c03	SAMA Requirement 80	Compliance requirement 80 for SAMA	SAMA-REQ-080	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
d933068a-ec11-44ee-a813-b734c7fe72ce	SAMA Requirement 81	Compliance requirement 81 for SAMA	SAMA-REQ-081	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
a4cf3dec-7a75-441d-9914-75c9bbd550b6	SAMA Requirement 82	Compliance requirement 82 for SAMA	SAMA-REQ-082	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
953fbbcd-5a49-4738-be17-81c5a75d77da	SAMA Requirement 83	Compliance requirement 83 for SAMA	SAMA-REQ-083	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
708065c5-55b6-4529-88ff-b077d880c690	SAMA Requirement 84	Compliance requirement 84 for SAMA	SAMA-REQ-084	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
0ec70013-70df-4a1b-80bd-fac060e47327	SAMA Requirement 85	Compliance requirement 85 for SAMA	SAMA-REQ-085	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
0132bc50-e484-49c0-9998-31f1e98b1345	SAMA Requirement 86	Compliance requirement 86 for SAMA	SAMA-REQ-086	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
2c46c795-57e8-4bcd-b00d-514b7f7e8f3e	SAMA Requirement 87	Compliance requirement 87 for SAMA	SAMA-REQ-087	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
d89b4f75-59d4-4655-b3d8-9d723ccc8e61	SAMA Requirement 88	Compliance requirement 88 for SAMA	SAMA-REQ-088	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
f5dfd202-aaba-4d80-8be7-22e63daae758	SAMA Requirement 89	Compliance requirement 89 for SAMA	SAMA-REQ-089	not_started	\N	2025-11-29 16:24:30.160384	2025-11-29 16:24:30.160384	59d51a64-e356-475c-9f62-e78a30e18471	\N	\N	\N
ab9d8ff1-b96e-4e50-b9d1-90f3f7a254e4	Cyber Risk Management Framework (CRMF)	Establish and maintain a written board-approved CRMF to identify assess and manage cyber risks effectively. Must be reviewed annually and tailored to firm's risk profile.	ADGM-1	not_started	\N	2025-11-29 18:51:42.704795	2025-11-29 18:51:42.704795	08f2bc40-f8e5-4931-9277-6a7afe706d22	Governance	January 31 2026	All Authorised Persons and Recognised Bodies
075f5f85-26a1-49cc-a54e-65777b1177e1	Board and Senior Management Accountability	Governing bodies and senior management must ensure cyber risks are identified addressed and managed by qualified individuals. Cybersecurity must be treated as a strategic business risk.	ADGM-2	not_started	\N	2025-11-29 18:51:42.713092	2025-11-29 18:51:42.713092	08f2bc40-f8e5-4931-9277-6a7afe706d22	Governance	January 31 2026	All Authorised Persons and Recognised Bodies
fe396e9f-d471-4889-ac04-51321dbc11ea	Integration with Risk Frameworks	Integrate cyber risk management requirements into existing risk management frameworks.	ADGM-3	not_started	\N	2025-11-29 18:51:42.714073	2025-11-29 18:51:42.714073	08f2bc40-f8e5-4931-9277-6a7afe706d22	Governance	January 31 2026	All Authorised Persons and Recognised Bodies
10528342-5196-4264-823e-e87e2c3cc308	Risk-Based Approach	Apply proportionate measures reflecting the nature scale and complexity of the firm's business activities.	ADGM-4	not_started	\N	2025-11-29 18:51:42.714941	2025-11-29 18:51:42.714941	08f2bc40-f8e5-4931-9277-6a7afe706d22	Governance	January 31 2026	All Authorised Persons and Recognised Bodies
25d27a14-637f-4787-8fd3-acd8ffbef744	Cyber Risk Identification	Identify and assess cyber risks considering both probability and impact of cyber incidents.	ADGM-5	not_started	\N	2025-11-29 18:51:42.715932	2025-11-29 18:51:42.715932	08f2bc40-f8e5-4931-9277-6a7afe706d22	Identification	January 31 2026	All Authorised Persons and Recognised Bodies
696db01a-a9e1-4f98-8a70-f5abfdf05264	Information Asset Inventory	Know what information assets exist including locations where sensitive data is stored and inherent vulnerabilities and threats.	ADGM-6	not_started	\N	2025-11-29 18:51:42.716775	2025-11-29 18:51:42.716775	08f2bc40-f8e5-4931-9277-6a7afe706d22	Identification	January 31 2026	All Authorised Persons and Recognised Bodies
50af7741-83ec-4e29-bf64-655ee9cef530	Periodic Risk Assessments	Conduct periodic cyber risk assessments to evaluate threats and vulnerabilities.	ADGM-7	not_started	\N	2025-11-29 18:51:42.717851	2025-11-29 18:51:42.717851	08f2bc40-f8e5-4931-9277-6a7afe706d22	Identification	January 31 2026	All Authorised Persons and Recognised Bodies
1ad10149-bc71-4fd3-adad-48ba8657034d	ICT Asset Protection	Implement controls to protect ICT assets including access controls data encryption and network security.	ADGM-8	not_started	\N	2025-11-29 18:51:42.71855	2025-11-29 18:51:42.71855	08f2bc40-f8e5-4931-9277-6a7afe706d22	Protection	January 31 2026	All Authorised Persons and Recognised Bodies
e4cd7d1c-3086-4cde-b4bd-94977b10c573	Access Management	Implement access management controls and multi-factor authentication.	ADGM-9	not_started	\N	2025-11-29 18:51:42.719452	2025-11-29 18:51:42.719452	08f2bc40-f8e5-4931-9277-6a7afe706d22	Protection	January 31 2026	All Authorised Persons and Recognised Bodies
60697426-b482-4f8c-8a67-4719b8041add	Data Encryption	Encrypt data in transit at rest and at destruction.	ADGM-10	not_started	\N	2025-11-29 18:51:42.720353	2025-11-29 18:51:42.720353	08f2bc40-f8e5-4931-9277-6a7afe706d22	Protection	January 31 2026	All Authorised Persons and Recognised Bodies
2972b3be-d656-4c6d-b6e6-a87343917f09	Anti-Malware Software	Deploy anti-malware software and network security controls.	ADGM-11	not_started	\N	2025-11-29 18:51:42.721238	2025-11-29 18:51:42.721238	08f2bc40-f8e5-4931-9277-6a7afe706d22	Protection	January 31 2026	All Authorised Persons and Recognised Bodies
3f03e5e6-704d-41ac-b51a-2716385b6b14	Physical Access Controls	Implement physical access restrictions to data centers.	ADGM-12	not_started	\N	2025-11-29 18:51:42.722051	2025-11-29 18:51:42.722051	08f2bc40-f8e5-4931-9277-6a7afe706d22	Protection	January 31 2026	All Authorised Persons and Recognised Bodies
7d332e34-21d3-4956-94ee-b098eba3abe2	Cybersecurity Training	Provide annual cybersecurity awareness training for all staff.	ADGM-13	not_started	\N	2025-11-29 18:51:42.722855	2025-11-29 18:51:42.722855	08f2bc40-f8e5-4931-9277-6a7afe706d22	Protection	January 31 2026	All Authorised Persons and Recognised Bodies
c9e7823d-a5bb-4be0-bb99-69a0d6657d68	Due Diligence	Undertake due diligence to ensure selection of suitable third-party providers of ICT Services that comply with appropriate cyber security standards.	ADGM-14	not_started	\N	2025-11-29 18:51:42.723588	2025-11-29 18:51:42.723588	08f2bc40-f8e5-4931-9277-6a7afe706d22	Third-Party Risk	January 31 2026	All Authorised Persons and Recognised Bodies
0b2141be-c96c-439f-8763-f731e70e02c4	Contractual Requirements	Enter into appropriate contracts with third-party ICT service providers with security obligations.	ADGM-15	not_started	\N	2025-11-29 18:51:42.724233	2025-11-29 18:51:42.724233	08f2bc40-f8e5-4931-9277-6a7afe706d22	Third-Party Risk	January 31 2026	All Authorised Persons and Recognised Bodies
2a55473f-e1cb-4151-a767-399da177f430	Continuous Monitoring	Effectively supervise the provision of ICT Services through ongoing monitoring.	ADGM-16	not_started	\N	2025-11-29 18:51:42.724908	2025-11-29 18:51:42.724908	08f2bc40-f8e5-4931-9277-6a7afe706d22	Third-Party Risk	January 31 2026	All Authorised Persons and Recognised Bodies
f7c24d4e-7f48-4e2d-a525-9d9c4c88c6f5	ICT Provider Inventory	Maintain an inventory of ICT providers and assess their risk exposure.	ADGM-17	not_started	\N	2025-11-29 18:51:42.72601	2025-11-29 18:51:42.72601	08f2bc40-f8e5-4931-9277-6a7afe706d22	Third-Party Risk	January 31 2026	All Authorised Persons and Recognised Bodies
dadcee64-cc08-4d72-93ee-5ebec4fc2437	Third-Party Incident Notification	Require third-party providers to notify about all cyber incidents that have or are likely to have material impact on the firm.	ADGM-18	not_started	\N	2025-11-29 18:51:42.727223	2025-11-29 18:51:42.727223	08f2bc40-f8e5-4931-9277-6a7afe706d22	Third-Party Risk	January 31 2026	All Authorised Persons and Recognised Bodies
8eb2c1d2-bb0c-4f20-9d48-3a45d36d53c2	Incident Remediation Cooperation	Require third-party providers to cooperate in remediating the impact of cyber incidents.	ADGM-19	not_started	\N	2025-11-29 18:51:42.728894	2025-11-29 18:51:42.728894	08f2bc40-f8e5-4931-9277-6a7afe706d22	Third-Party Risk	January 31 2026	All Authorised Persons and Recognised Bodies
013e1a5e-413e-4b7c-82fd-f10a8354df45	Data Return and Destruction	Set appropriate requirements for deletion or return of firm's information at end of contract.	ADGM-20	not_started	\N	2025-11-29 18:51:42.730021	2025-11-29 18:51:42.730021	08f2bc40-f8e5-4931-9277-6a7afe706d22	Third-Party Risk	January 31 2026	All Authorised Persons and Recognised Bodies
f461f691-994a-401a-a932-98f8009be3aa	Ongoing Monitoring	Implement a system to conduct ongoing monitoring of systems and controls.	ADGM-21	not_started	\N	2025-11-29 18:51:42.730958	2025-11-29 18:51:42.730958	08f2bc40-f8e5-4931-9277-6a7afe706d22	Monitoring and Testing	January 31 2026	All Authorised Persons and Recognised Bodies
d53c088b-7bda-4405-aa38-857c57ed5974	Regular Testing	Conduct regular testing of systems and controls such as vulnerability assessments and scenario-based testing.	ADGM-22	not_started	\N	2025-11-29 18:51:42.731737	2025-11-29 18:51:42.731737	08f2bc40-f8e5-4931-9277-6a7afe706d22	Monitoring and Testing	January 31 2026	All Authorised Persons and Recognised Bodies
ae430c3f-e013-449d-b5a6-38c8f7a04b4d	Penetration Testing	Conduct penetration testing and vulnerability assessments regularly with internet-facing systems tested at least once a year.	ADGM-23	not_started	\N	2025-11-29 18:51:42.732701	2025-11-29 18:51:42.732701	08f2bc40-f8e5-4931-9277-6a7afe706d22	Monitoring and Testing	January 31 2026	All Authorised Persons and Recognised Bodies
9760f548-ed63-4bad-b80f-01f5bcd65d13	Issue Remediation	Remediate issues identified through testing and assessments.	ADGM-24	not_started	\N	2025-11-29 18:51:42.73335	2025-11-29 18:51:42.73335	08f2bc40-f8e5-4931-9277-6a7afe706d22	Monitoring and Testing	January 31 2026	All Authorised Persons and Recognised Bodies
085cc877-42e6-4598-b123-2d7c428d5a9c	Incident Response Plan	Establish maintain and regularly test a robust cyber incident response plan to ensure timely recovery from incidents.	ADGM-25	not_started	\N	2025-11-29 18:51:42.733989	2025-11-29 18:51:42.733989	08f2bc40-f8e5-4931-9277-6a7afe706d22	Response and Recovery	January 31 2026	All Authorised Persons and Recognised Bodies
39f30e77-7768-4fb7-bf24-102e1619c711	Crisis Management Integration	Integrate incident response plan into overall crisis management and disaster recovery plans.	ADGM-26	not_started	\N	2025-11-29 18:51:42.734564	2025-11-29 18:51:42.734564	08f2bc40-f8e5-4931-9277-6a7afe706d22	Response and Recovery	January 31 2026	All Authorised Persons and Recognised Bodies
2a3ea0b0-1a2b-4311-9f59-c016d7b1b34d	Plan Testing	Regularly test incident response plan and update as needed.	ADGM-27	not_started	\N	2025-11-29 18:51:42.735393	2025-11-29 18:51:42.735393	08f2bc40-f8e5-4931-9277-6a7afe706d22	Response and Recovery	January 31 2026	All Authorised Persons and Recognised Bodies
ae79176b-ee43-41db-a9d0-fb77aa0672f8	24-Hour Notification to FSRA	Notify FSRA of material cyber incidents within 24 hours of detection.	ADGM-28	not_started	\N	2025-11-29 18:51:42.736071	2025-11-29 18:51:42.736071	08f2bc40-f8e5-4931-9277-6a7afe706d22	Incident Notification	January 31 2026	All Authorised Persons and Recognised Bodies
7501bc81-7a4b-42a4-8e15-2e5552457c2e	Initial Incident Report	Submit initial incident report using Template A via email to incidents.fsra@adgm.com.	ADGM-29	not_started	\N	2025-11-29 18:51:42.736903	2025-11-29 18:51:42.736903	08f2bc40-f8e5-4931-9277-6a7afe706d22	Incident Notification	January 31 2026	All Authorised Persons and Recognised Bodies
441d9285-e3fd-4f76-8ea5-4adeef091fcf	Progressive Reporting	Submit updated information through progressive reports using Template B.	ADGM-30	not_started	\N	2025-11-29 18:51:42.737717	2025-11-29 18:51:42.737717	08f2bc40-f8e5-4931-9277-6a7afe706d22	Incident Notification	January 31 2026	All Authorised Persons and Recognised Bodies
6a14281c-98a6-4080-a499-3978b9aab950	Materiality Assessment	Assess materiality of cyber incidents to determine notification requirements.	ADGM-31	not_started	\N	2025-11-29 18:51:42.739013	2025-11-29 18:51:42.739013	08f2bc40-f8e5-4931-9277-6a7afe706d22	Incident Notification	January 31 2026	All Authorised Persons and Recognised Bodies
82867865-705a-4f87-9ff7-48fbe61dd1f0	Written Policies and Procedures	Document cybersecurity policies procedures and processes that define how information assets are managed and protected.	ADGM-32	not_started	\N	2025-11-29 18:51:42.739767	2025-11-29 18:51:42.739767	08f2bc40-f8e5-4931-9277-6a7afe706d22	Documentation	January 31 2026	All Authorised Persons and Recognised Bodies
b947dd53-0d18-45ec-9f4b-d918a47ee437	Roles and Responsibilities	Clearly define roles and responsibilities related to cybersecurity within the organization.	ADGM-33	not_started	\N	2025-11-29 18:51:42.740316	2025-11-29 18:51:42.740316	08f2bc40-f8e5-4931-9277-6a7afe706d22	Documentation	January 31 2026	All Authorised Persons and Recognised Bodies
47f116ab-5821-4557-b9fe-36d4a9310b12	Annual Cyber Risk Return	Submit annual return providing visibility over how firms are adapting to evolving threats and maturing cyber controls.	ADGM-34	not_started	\N	2025-11-29 18:51:42.740935	2025-11-29 18:51:42.740935	08f2bc40-f8e5-4931-9277-6a7afe706d22	Reporting	January 31 2026	All Authorised Persons and Recognised Bodies
10c96858-345a-4fe1-982e-dd3e242681ef	Network Services Management	Restricting and managing network services protocols and ports.	2-5-3-5	not_started	\N	2025-11-29 18:34:50.222091	2025-11-29 18:34:50.222091	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
831c9212-0d67-4006-b1e9-03360a0be0ad	Cybersecurity in Projects	Cybersecurity requirements shall be included in the project management methodology and procedures and in the information and technology asset change management within the entity to ensure identifying and managing cybersecurity risks as part of the technology project lifecycle. The cybersecurity requirements shall be a key part of the requirements for technology projects.	1-6-1	not_started	\N	2025-11-29 18:34:50.136391	2025-11-29 18:34:50.136391	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
94bee9f6-843a-4d54-aaf5-6c5ebb92aadd	Project Cybersecurity Requirements	The cybersecurity requirements for project management and information and technology asset changes within the entity shall include the following as a minimum.	1-6-2	not_started	\N	2025-11-29 18:34:50.137378	2025-11-29 18:34:50.137378	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
51ed6871-0764-4bb5-ac15-0edcbc39f868	Vulnerability Assessment and Remediation	Vulnerability assessment and remediation.	1-6-2-1	not_started	\N	2025-11-29 18:34:50.138515	2025-11-29 18:34:50.138515	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
caf32aed-3b4b-469b-af25-3cd33109afeb	Secure Configuration Review	Reviewing secure configuration and hardening and updates packages before launching projects and changes.	1-6-2-2	not_started	\N	2025-11-29 18:34:50.139567	2025-11-29 18:34:50.139567	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
3b39d2c1-ae74-4a45-84cd-ea7c641c744a	Software Development Requirements	The cybersecurity requirements for software and application development projects within the entity shall include the following as a minimum.	1-6-3	not_started	\N	2025-11-29 18:34:50.14045	2025-11-29 18:34:50.14045	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
c0b1abf5-a8f5-4fe1-87f0-4a8c95de2c6a	Secure Coding Standards	Using the secure coding standards.	1-6-3-1	not_started	\N	2025-11-29 18:34:50.141449	2025-11-29 18:34:50.141449	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
2a706737-4c08-4e23-a96f-4ce266c1769d	Trusted Development Tools	Using trusted and licensed sources for software development tools and libraries.	1-6-3-2	not_started	\N	2025-11-29 18:34:50.143182	2025-11-29 18:34:50.143182	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
98995647-a90a-4e31-8dfd-468d4ac853ae	Compliance Testing	Conducting compliance test for software against the cybersecurity requirements within the entity.	1-6-3-3	not_started	\N	2025-11-29 18:34:50.14422	2025-11-29 18:34:50.14422	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Cybersecurity in Project Management	\N	All entities
d415c576-7a73-4a8d-b24b-3e90ffc93e78	Awareness Program Development	A cybersecurity awareness program delivered through multiple channels shall be periodically developed and approved by the entity to strengthen the awareness about cybersecurity cyber threats and risks and to build a positive cybersecurity awareness culture.	1-10-1	not_started	\N	2025-11-29 18:34:50.164878	2025-11-29 18:34:50.164878	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
adbfecbe-e3b2-4082-b955-b155414827b5	Awareness Program Implementation	The approved cybersecurity awareness program shall be implemented within the entity.	1-10-2	not_started	\N	2025-11-29 18:34:50.166352	2025-11-29 18:34:50.166352	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
a5b3a7d0-dfd2-4abd-9a3e-b09e1ac1f8f0	Awareness Program Content	The cybersecurity awareness program shall include how to protect the entity against the most important and latest cyber risks and threats including.	1-10-3	not_started	\N	2025-11-29 18:34:50.167886	2025-11-29 18:34:50.167886	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
1e19b377-71cb-4e05-b76c-d30e192bcd2c	Email Security Awareness	Secure handling of email services especially phishing emails.	1-10-3-1	not_started	\N	2025-11-29 18:34:50.169061	2025-11-29 18:34:50.169061	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
a50fa52f-1d64-4992-854d-8c8d8e6e9b6a	Mobile Device Awareness	Secure handling of mobile devices and storage media.	1-10-3-2	not_started	\N	2025-11-29 18:34:50.17005	2025-11-29 18:34:50.17005	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
d9fd72d9-db13-4b73-9b72-8b49ddf7ee06	Internet Browsing Awareness	Secure Internet browsing.	1-10-3-3	not_started	\N	2025-11-29 18:34:50.170929	2025-11-29 18:34:50.170929	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
a79cc8c9-d1c4-47f1-ae45-c2b2b5c43999	Social Media Awareness	Secure usage of social media.	1-10-3-4	not_started	\N	2025-11-29 18:34:50.171832	2025-11-29 18:34:50.171832	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
1311776c-625d-458e-8484-9a10214dca29	Specialized Training	Specialized skills and necessary training shall be provided to personnel in positions that are linked directly to cybersecurity within the entity. Such skills and training shall be classified in line with their cybersecurity responsibilities including.	1-10-4	not_started	\N	2025-11-29 18:34:50.17293	2025-11-29 18:34:50.17293	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
d17f6f69-5931-4fe2-9c77-17257daa8dbd	Cybersecurity Department Training	Cybersecurity department personnel.	1-10-4-1	not_started	\N	2025-11-29 18:34:50.173643	2025-11-29 18:34:50.173643	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
4e3f2bca-b34f-4866-98d7-1d5a108340f1	Technical Personnel Training	Personnel working on software/application development and those working on information and technology assets of the entity.	1-10-4-2	not_started	\N	2025-11-29 18:34:50.175005	2025-11-29 18:34:50.175005	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
f8beda87-7e0a-4e85-8922-74e01c32f5fd	Executive Training	Executive and supervisory positions.	1-10-4-3	not_started	\N	2025-11-29 18:34:50.175819	2025-11-29 18:34:50.175819	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
e871a3a8-90e1-446e-abd1-2e07b8fff043	Program Review	The implementation of cybersecurity awareness program within the entity shall be periodically reviewed.	1-10-5	not_started	\N	2025-11-29 18:34:50.176928	2025-11-29 18:34:50.176928	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Governance - Awareness and Training Program	\N	All entities
f2e662ae-abdf-40d6-9863-13a5e92e2386	Asset Management Requirements	Cybersecurity requirements for managing information and technology assets of the entity shall be identified documented and approved.	2-1-1	not_started	\N	2025-11-29 18:34:50.177765	2025-11-29 18:34:50.177765	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Asset Management	\N	All entities
3ebabcaf-d854-4cb5-a565-413c4123bd4d	Asset Management Implementation	Cybersecurity requirements for managing information and technology assets of the entity shall be implemented.	2-1-2	not_started	\N	2025-11-29 18:34:50.178501	2025-11-29 18:34:50.178501	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Asset Management	\N	All entities
a7f1aabe-ae82-48cf-9568-cd12dd42c3b1	Acceptable Use Policy	The policy of acceptable use of information and technology assets of the entity shall be identified documented approved and communicated.	2-1-3	not_started	\N	2025-11-29 18:34:50.179496	2025-11-29 18:34:50.179496	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Asset Management	\N	All entities
77d3a30e-810a-417f-b932-c2c605853e18	Acceptable Use Implementation	The policy of acceptable use of information and technology assets of the entity shall be implemented.	2-1-4	not_started	\N	2025-11-29 18:34:50.180368	2025-11-29 18:34:50.180368	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Asset Management	\N	All entities
a1f1a8d0-ed7f-4fc7-896b-ffa42b9e6660	Asset Classification	Information and technology assets of the entity shall be classified labeled and handled as per the relevant legislative and regulatory requirements.	2-1-5	not_started	\N	2025-11-29 18:34:50.18169	2025-11-29 18:34:50.18169	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Asset Management	\N	All entities
819c18cc-df51-46f0-8ce1-5c7e7c601e29	Asset Management Review	Cybersecurity requirements for managing information and technology assets of the entity shall be periodically reviewed.	2-1-6	not_started	\N	2025-11-29 18:34:50.18251	2025-11-29 18:34:50.18251	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Asset Management	\N	All entities
4c34c87d-5f9d-4d32-9d76-9f650a48113e	IAM Requirements	Cybersecurity requirements for identity and access management of the entity shall be identified documented and approved.	2-2-1	not_started	\N	2025-11-29 18:34:50.183452	2025-11-29 18:34:50.183452	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Identity and Access Management	\N	All entities
589f29c5-b7be-4c41-a71f-9cae51b56ebe	IAM Implementation	Cybersecurity requirements for identity and access management of the entity shall be implemented.	2-2-2	not_started	\N	2025-11-29 18:34:50.184291	2025-11-29 18:34:50.184291	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Identity and Access Management	\N	All entities
b7fb732e-4eab-48df-a214-b1af05717f13	IAM Minimum Requirements	Cybersecurity requirements for identity and access management of the entity shall include the following as a minimum.	2-2-3	not_started	\N	2025-11-29 18:34:50.1852	2025-11-29 18:34:50.1852	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Identity and Access Management	\N	All entities
c29d2471-27d7-4a39-8ec9-bb7f65d49819	Single-Factor Authentication	Single-factor authentication based on username and password.	2-2-3-1	not_started	\N	2025-11-29 18:34:50.186012	2025-11-29 18:34:50.186012	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Identity and Access Management	\N	All entities
fc65bfea-791f-4c29-9549-f6f5ecaf2137	Multi-Factor Authentication	Multi-factor authentication and defining the suitable authentication factors and their numbers as well as the suitable authentication techniques based on the result of impact assessment of authentication failure and bypass for remote access and for privileged accounts.	2-2-3-2	not_started	\N	2025-11-29 18:34:50.18676	2025-11-29 18:34:50.18676	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Identity and Access Management	\N	All entities
735e8d0c-09be-4136-a20a-50baabedda11	User Authorization	User authorization based on identity and access control principles (Need-to-Know and Need-to-Use principle Least Privilege principle and Segregation of Duties principle).	2-2-3-3	not_started	\N	2025-11-29 18:34:50.187834	2025-11-29 18:34:50.187834	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Identity and Access Management	\N	All entities
bf5fa3e3-380e-48ca-8c0d-56426d75b113	Privileged Access Management	Privileged access management.	2-2-3-4	not_started	\N	2025-11-29 18:34:50.188717	2025-11-29 18:34:50.188717	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Identity and Access Management	\N	All entities
24b3efd7-3317-4179-9e83-e9294285ce2d	Periodic Access Review	Periodic review of identities and access rights.	2-2-3-5	not_started	\N	2025-11-29 18:34:50.189672	2025-11-29 18:34:50.189672	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Identity and Access Management	\N	All entities
982bd651-dce0-49be-885e-cd233b638e08	Intrusion Prevention	Intrusion Prevention Systems (IPS).	2-5-3-6	not_started	\N	2025-11-29 18:34:50.224405	2025-11-29 18:34:50.224405	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
615264bd-ee2f-491a-a04e-6d33a29ca6b5	System Protection Requirements	Cybersecurity requirements for protection of information system and processing facilities of the entity shall be identified documented and approved.	2-3-1	not_started	\N	2025-11-29 18:34:50.191872	2025-11-29 18:34:50.191872	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Information Systems Protection	\N	All entities
96a7d1cf-1fee-4a64-bd7e-ae5fbe56aaa7	System Protection Implementation	Cybersecurity requirements for protection of information systems and processing facilities of the entity shall be implemented.	2-3-2	not_started	\N	2025-11-29 18:34:50.193566	2025-11-29 18:34:50.193566	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Information Systems Protection	\N	All entities
daaa36fd-9387-4c59-83c1-4adaa6750921	System Protection Minimum Requirements	Cybersecurity requirements for protection of information systems and processing facilities of the entity shall include the following as a minimum.	2-3-3	not_started	\N	2025-11-29 18:34:50.194535	2025-11-29 18:34:50.194535	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Information Systems Protection	\N	All entities
00154837-36e0-411d-88ce-932e3da94f12	Anti-Malware Protection	Protection from viruses suspicious programs and activities and malware on workstations and servers using modern and advanced protection technologies and mechanisms and securely managing them.	2-3-3-1	not_started	\N	2025-11-29 18:34:50.195828	2025-11-29 18:34:50.195828	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Information Systems Protection	\N	All entities
1b106a5f-0436-4fda-aef8-5e67e51e9558	External Storage Media Control	Strict restriction on the use of external storage media and their security.	2-3-3-2	not_started	\N	2025-11-29 18:34:50.196677	2025-11-29 18:34:50.196677	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Information Systems Protection	\N	All entities
3bc0ff85-7a8e-4348-b243-f9eb1e96effb	Patch Management	Patch management for systems applications and devices.	2-3-3-3	not_started	\N	2025-11-29 18:34:50.1977	2025-11-29 18:34:50.1977	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Information Systems Protection	\N	All entities
0212f4ff-6524-4126-a651-d73848e38d77	Clock Synchronization	Centralized clock synchronization with an accurate and trusted source such as sources provided by the Saudi Standards Metrology and Quality Organization.	2-3-3-4	not_started	\N	2025-11-29 18:34:50.198585	2025-11-29 18:34:50.198585	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Information Systems Protection	\N	All entities
53894ac2-553f-40ad-b971-a065fc63cc18	System Protection Review	The implementation of cybersecurity requirements for protection of the information system and processing facilities of the entity shall be periodically reviewed.	2-3-4	not_started	\N	2025-11-29 18:34:50.199419	2025-11-29 18:34:50.199419	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Information Systems Protection	\N	All entities
f2f12e7b-a762-45db-b66f-85b115a00954	Email Protection Requirements	Cybersecurity requirements for protection of the email service of the entity shall be identified documented and approved.	2-4-1	not_started	\N	2025-11-29 18:34:50.200437	2025-11-29 18:34:50.200437	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Email Protection	\N	All entities
9eee4e8f-bd22-4b32-8954-b91365fbf6a0	Email Protection Implementation	Cybersecurity requirements for protection of email service of the entity shall be implemented.	2-4-2	not_started	\N	2025-11-29 18:34:50.201516	2025-11-29 18:34:50.201516	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Email Protection	\N	All entities
dc84cdd0-8d15-4ca4-92a7-53b19827503d	Email Protection Minimum Requirements	Cybersecurity requirements for protection of the email service of the entity shall include the following as a minimum.	2-4-3	not_started	\N	2025-11-29 18:34:50.203364	2025-11-29 18:34:50.203364	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Email Protection	\N	All entities
2d396566-99b5-4aa7-9a61-fa7c2bffbb68	Email Filtering	Analyzing and filtering email messages (specifically phishing emails and spam emails) using modern and advanced email protection techniques and mechanisms.	2-4-3-1	not_started	\N	2025-11-29 18:34:50.204366	2025-11-29 18:34:50.204366	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Email Protection	\N	All entities
908860e5-3076-4643-9cce-be81cfab9463	Email MFA	Multi-factor authentication and defining the suitable authentication factors and their numbers as well as the suitable authentication techniques based on the result of impact assessment of authentication failure and bypass for remote and webmail access.	2-4-3-2	not_started	\N	2025-11-29 18:34:50.205255	2025-11-29 18:34:50.205255	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Email Protection	\N	All entities
c04c482d-14eb-4289-ae20-f5889aec74c3	Email Archiving	Email archiving and backup.	2-4-3-3	not_started	\N	2025-11-29 18:34:50.206698	2025-11-29 18:34:50.206698	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Email Protection	\N	All entities
3837a5b2-923b-4f13-8eb6-be7727892351	APT Protection	Secure management and protection against Advanced Persistent Threats which normally utilize zero-day malware and viruses.	2-4-3-4	not_started	\N	2025-11-29 18:34:50.207992	2025-11-29 18:34:50.207992	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Email Protection	\N	All entities
b5c422e8-9fc2-47e5-b2a7-7780ac92f630	Email Domain Validation	Validation of the entity's email service domains by using Sender Policy Framework (SPF) Domain Keys Identified Mail (DKIM) and Domain Message Authentication Reporting and Conformance (DMARC).	2-4-3-5	not_started	\N	2025-11-29 18:34:50.20944	2025-11-29 18:34:50.20944	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Email Protection	\N	All entities
3f9983ff-0fcd-4846-9e60-32f6e9b5de72	Email Protection Review	The implementation of cybersecurity requirements for email service of the entity shall be periodically reviewed.	2-4-4	not_started	\N	2025-11-29 18:34:50.211248	2025-11-29 18:34:50.211248	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Email Protection	\N	All entities
b9c591d5-f5fb-4963-8e05-8dd2e51bfd6b	Network Security Requirements	Cybersecurity requirements for the entity's network security management shall be identified documented and approved.	2-5-1	not_started	\N	2025-11-29 18:34:50.213497	2025-11-29 18:34:50.213497	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
297254b0-3a36-40be-848c-364579880694	Network Security Implementation	Cybersecurity requirements for the entity's network security management shall be implemented.	2-5-2	not_started	\N	2025-11-29 18:34:50.21492	2025-11-29 18:34:50.21492	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
b07526fb-3d2b-49cf-81fb-eee808a36b56	Network Security Minimum Requirements	Cybersecurity requirements for the entity's network security management shall include the following as a minimum.	2-5-3	not_started	\N	2025-11-29 18:34:50.216055	2025-11-29 18:34:50.216055	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
5fe77e3d-af26-4d0f-8307-7d1fc0b8e167	Network Segmentation	Logical or physical isolation and segmentation of network segments in a secure manner which is required to control relevant cybersecurity risks using firewall and defense-in-depth principle.	2-5-3-1	not_started	\N	2025-11-29 18:34:50.217072	2025-11-29 18:34:50.217072	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
12f0b630-ef59-4007-98bb-a4f4473e882c	Environment Isolation	Isolation of production network from testing and development environment networks.	2-5-3-2	not_started	\N	2025-11-29 18:34:50.218088	2025-11-29 18:34:50.218088	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
a6f35fde-5de1-4b04-ba90-9ca1552a4c76	Secure Internet Browsing	Secure browsing and internet connectivity including strict restrictions on suspicious websites file storage/sharing websites and remote access websites.	2-5-3-3	not_started	\N	2025-11-29 18:34:50.219413	2025-11-29 18:34:50.219413	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
508aee49-b3c6-4208-b331-82153814fa3c	Wireless Network Security	Wireless network security and protection using secure authentication and encryption techniques and avoiding the connection of wireless networks to the entity's internal network except after a comprehensive assessment of subsequent risks with handling them in a way that protects the technology assets of the entity.	2-5-3-4	not_started	\N	2025-11-29 18:34:50.220782	2025-11-29 18:34:50.220782	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
7980333d-5f22-4b2f-a6cf-44acc902d924	DNS Security	Security of Domain Name Service (DNS).	2-5-3-7	not_started	\N	2025-11-29 18:34:50.225996	2025-11-29 18:34:50.225996	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
50818efc-a0e2-4aeb-a275-d4b444086445	Browsing APT Protection	Secure management and protection of Internet browsing channel against Advanced Persistent Threats which normally utilize zero-day malware and viruses.	2-5-3-8	not_started	\N	2025-11-29 18:34:50.228272	2025-11-29 18:34:50.228272	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
4cfe3ea0-1e52-4c5e-96f0-1772e4cfa3ac	DDoS Protection	Protecting against Distributed Denial of Service (DDoS) attacks to limit risks arising from these attacks.	2-5-3-9	not_started	\N	2025-11-29 18:34:50.229785	2025-11-29 18:34:50.229785	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
5590c3f4-8b6e-4f7d-9389-d8d40fbc3876	Network Security Review	The implementation of cybersecurity requirements for the entity's network security management shall be periodically reviewed.	2-5-4	not_started	\N	2025-11-29 18:34:50.231445	2025-11-29 18:34:50.231445	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Network Security Management	\N	All entities
237ddbfc-ff8e-4660-bc8b-68311f980b76	Mobile Security Requirements	Cybersecurity requirements for mobile devices and BYOD security when connected to the entity's network shall be identified documented and approved.	2-6-1	not_started	\N	2025-11-29 18:34:50.23329	2025-11-29 18:34:50.23329	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Mobile Devices Security	\N	All entities
973b2dc2-da9c-4a7e-b6df-81dd9c68fa24	Mobile Security Implementation	Cybersecurity requirements for mobile devices and BYOD security of the entity shall be implemented.	2-6-2	not_started	\N	2025-11-29 18:34:50.235314	2025-11-29 18:34:50.235314	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Mobile Devices Security	\N	All entities
d40c6b3a-af02-4e50-8559-731ddeea8fa5	Mobile Security Minimum Requirements	Cybersecurity requirements for mobile devices and BYOD security of the entity shall include the following as a minimum.	2-6-3	not_started	\N	2025-11-29 18:34:50.236776	2025-11-29 18:34:50.236776	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Mobile Devices Security	\N	All entities
6f8f1613-3f78-401a-9a31-0f5092d47b1b	Data Separation and Encryption	Separation and encryption of the entity's data and information stored on mobile devices and BYODs.	2-6-3-1	not_started	\N	2025-11-29 18:34:50.238561	2025-11-29 18:34:50.238561	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Mobile Devices Security	\N	All entities
22db4a94-8cbd-4944-8a9a-a8ee8e22ad65	Controlled Use	Controlled and restricted use based on the requirements of the interest of the entity's business.	2-6-3-2	not_started	\N	2025-11-29 18:34:50.239856	2025-11-29 18:34:50.239856	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Mobile Devices Security	\N	All entities
69261ad5-2996-49a4-a012-f9349aa657f2	Remote Data Deletion	Deletion of the entity's data and information stored on mobile devices and BYOD in cases of device loss or after the ending/termination of employment with the entity.	2-6-3-3	not_started	\N	2025-11-29 18:34:50.241142	2025-11-29 18:34:50.241142	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Mobile Devices Security	\N	All entities
8d4b95f3-8b54-4989-b942-b31b2daadec0	User Security Awareness	Security awareness for users.	2-6-3-4	not_started	\N	2025-11-29 18:34:50.242631	2025-11-29 18:34:50.242631	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Mobile Devices Security	\N	All entities
25d013f7-fdf0-45cd-85ba-ea4d00bf2b63	Mobile Security Review	The implementation of cybersecurity requirements for mobile devices and BYOD security of the entity shall be periodically reviewed.	2-6-4	not_started	\N	2025-11-29 18:34:50.244451	2025-11-29 18:34:50.244451	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Mobile Devices Security	\N	All entities
c6fb0218-6d19-474c-b339-652870795179	Data Protection Requirements	Cybersecurity requirements for protecting and handling data and information of the entity shall be identified documented and approved as per the relevant legislative and regulatory requirements.	2-7-1	not_started	\N	2025-11-29 18:34:50.248817	2025-11-29 18:34:50.248817	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Data and Information Protection	\N	All entities
a40293c0-b0c1-43ab-8531-14bbac458b34	Data Protection Implementation	Cybersecurity requirements for protecting data and information of the entity shall be implemented based on its classification level.	2-7-2	not_started	\N	2025-11-29 18:34:50.250007	2025-11-29 18:34:50.250007	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Data and Information Protection	\N	All entities
efea9d6f-87ca-41e3-9ca5-4f2040836114	Data Protection Review	The implementation of cybersecurity requirements for protecting data and information of the entity shall be periodically reviewed.	2-7-3	not_started	\N	2025-11-29 18:34:50.251066	2025-11-29 18:34:50.251066	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Data and Information Protection	\N	All entities
262c3793-462a-4957-899f-ae0ef1bf503e	Cryptography Requirements	Cybersecurity requirements for cryptography within the entity shall be identified documented and approved.	2-8-1	not_started	\N	2025-11-29 18:34:50.252044	2025-11-29 18:34:50.252044	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Cryptography	\N	All entities
df2e5f31-b750-43da-bba0-3f3bc18e29aa	Cryptography Implementation	Cybersecurity requirements for cryptography within the entity shall be implemented.	2-8-2	not_started	\N	2025-11-29 18:34:50.253022	2025-11-29 18:34:50.253022	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Cryptography	\N	All entities
665fd0e4-837f-498d-b9d5-5be03795ae17	Cryptography Minimum Requirements	Cybersecurity requirements for cryptography shall include at least the requirements in the National Cryptographic Standards published by NCA. The appropriate cryptographic standard level shall be implemented based on the nature and sensitivity of the data systems and networks to be protected as well as the entity's risk assessment and as per the relevant legislative and regulatory requirements as follows.	2-8-3	not_started	\N	2025-11-29 18:34:50.253896	2025-11-29 18:34:50.253896	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Cryptography	\N	All entities
74efa19b-67b9-4424-b437-62b9e42b41aa	Approved Cryptographic Standards	Approved cryptographic systems and solutions standards and their technical and regulatory restrictions.	2-8-3-1	not_started	\N	2025-11-29 18:34:50.254664	2025-11-29 18:34:50.254664	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Cryptography	\N	All entities
ad9384c4-dab6-492a-9a8f-3026783d5e6b	Cryptographic Key Management	Secure management of cryptographic keys during their lifecycles.	2-8-3-2	not_started	\N	2025-11-29 18:34:50.25535	2025-11-29 18:34:50.25535	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Cryptography	\N	All entities
90093f15-1c60-4453-80d9-47cb25c4aa14	Data Encryption	Encryption of data in-transit and at-rest as per their classification and the relevant legislative and regulatory requirements.	2-8-3-3	not_started	\N	2025-11-29 18:34:50.256344	2025-11-29 18:34:50.256344	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Cryptography	\N	All entities
4fb6fbc2-cbd7-42c4-b989-81d6ab067261	Cryptography Review	The implementation of cybersecurity requirements for cryptography within the entity shall be periodically reviewed.	2-8-4	not_started	\N	2025-11-29 18:34:50.257395	2025-11-29 18:34:50.257395	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Cryptography	\N	All entities
bbff7d94-b8a2-4518-bbd7-5e7b816b196d	Backup Requirements	Cybersecurity requirements for backup and recovery management within the entity shall be identified documented and approved.	2-9-1	not_started	\N	2025-11-29 18:34:50.258756	2025-11-29 18:34:50.258756	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Backup and Recovery Management	\N	All entities
2403696f-7244-4227-b167-c858d9729513	Backup Implementation	Cybersecurity requirements for backup and recovery management within the entity shall be implemented.	2-9-2	not_started	\N	2025-11-29 18:34:50.25997	2025-11-29 18:34:50.25997	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Backup and Recovery Management	\N	All entities
9332d255-c97e-4950-baa6-cd946022462d	Backup Minimum Requirements	Cybersecurity requirements for backup and recovery management shall include the following as a minimum.	2-9-3	not_started	\N	2025-11-29 18:34:50.260989	2025-11-29 18:34:50.260989	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Backup and Recovery Management	\N	All entities
f113faa4-00ac-46ed-be11-455aef99e299	Backup Scope	Scope of backups to cover critical technology and information assets.	2-9-3-1	not_started	\N	2025-11-29 18:34:50.261762	2025-11-29 18:34:50.261762	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Backup and Recovery Management	\N	All entities
5f9146da-a306-4db0-b014-f88dd6b0a625	Quick Recovery	Ability to perform quick recovery of data and systems after cybersecurity incidents.	2-9-3-2	not_started	\N	2025-11-29 18:34:50.264945	2025-11-29 18:34:50.264945	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Backup and Recovery Management	\N	All entities
97b6f0c0-c0c1-43e1-83b3-11d0ca8d9fa7	Backup Testing	Periodic testing for the effectiveness of backup recovery.	2-9-3-3	not_started	\N	2025-11-29 18:34:50.266353	2025-11-29 18:34:50.266353	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Backup and Recovery Management	\N	All entities
14b6d19e-4df2-4ba9-8141-3af07e26207c	Backup Review	The implementation of cybersecurity requirements for backup and recovery management within the entity shall be periodically reviewed.	2-9-4	not_started	\N	2025-11-29 18:34:50.267322	2025-11-29 18:34:50.267322	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Backup and Recovery Management	\N	All entities
b9e79616-6e77-4885-b645-ea7d8822a3cf	Vulnerability Management Requirements	Cybersecurity requirements for technical vulnerabilities management within the entity shall be identified documented and approved.	2-10-1	not_started	\N	2025-11-29 18:34:50.268285	2025-11-29 18:34:50.268285	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Vulnerability Management	\N	All entities
0b81108a-b177-48fd-90bb-d224cd7fbc8c	Vulnerability Management Implementation	Cybersecurity requirements for technical vulnerabilities management within the entity shall be implemented.	2-10-2	not_started	\N	2025-11-29 18:34:50.269392	2025-11-29 18:34:50.269392	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Vulnerability Management	\N	All entities
f0d76532-df5e-43fc-817e-fcda50df37ae	Vulnerability Management Minimum Requirements	Cybersecurity requirements for technical vulnerabilities management shall include the following as a minimum.	2-10-3	not_started	\N	2025-11-29 18:34:50.27074	2025-11-29 18:34:50.27074	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Vulnerability Management	\N	All entities
8480c190-0b14-4673-b673-6beb4059b564	Periodic Vulnerability Assessment	Periodic vulnerabilities assessment and detection.	2-10-3-1	not_started	\N	2025-11-29 18:34:50.271719	2025-11-29 18:34:50.271719	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Vulnerability Management	\N	All entities
937c92a8-1bbc-484a-8d09-f52aa51476f2	Vulnerability Classification	Vulnerabilities classification based on their severities.	2-10-3-2	not_started	\N	2025-11-29 18:34:50.272524	2025-11-29 18:34:50.272524	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Vulnerability Management	\N	All entities
42021727-b8fe-47ea-b3fb-23c449d49e6b	Vulnerability Remediation	Vulnerabilities remediation based on their classification and the associated cyber risks.	2-10-3-3	not_started	\N	2025-11-29 18:34:50.27337	2025-11-29 18:34:50.27337	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Vulnerability Management	\N	All entities
a616341a-3e67-47e4-a08d-28f1aad31a97	Patch Management for Vulnerabilities	Patch management to remediate vulnerabilities and ensuring the integrity and effectiveness of these updates and fixes are verified using a non-production environment before being applied.	2-10-3-4	not_started	\N	2025-11-29 18:34:50.27421	2025-11-29 18:34:50.27421	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Vulnerability Management	\N	All entities
de383247-c538-4e8f-b145-85c48b200991	Vulnerability Intelligence	Communication and subscription with trusted resources for new and up-to-date vulnerabilities.	2-10-3-5	not_started	\N	2025-11-29 18:34:50.274832	2025-11-29 18:34:50.274832	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Vulnerability Management	\N	All entities
49a460e5-4830-4bc0-97eb-1a33ad058729	Vulnerability Management Review	The implementation of cybersecurity requirements for technical vulnerabilities management within the entity shall be periodically reviewed.	2-10-4	not_started	\N	2025-11-29 18:34:50.275601	2025-11-29 18:34:50.275601	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Vulnerability Management	\N	All entities
e94389ed-a1d9-40c5-a601-aa1499a86bdb	Penetration Testing Requirements	Cybersecurity requirements for penetration testing within the entity shall be identified documented and approved.	2-11-1	not_started	\N	2025-11-29 18:34:50.276512	2025-11-29 18:34:50.276512	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Penetration Testing	\N	All entities
6b748c61-1953-4bd5-aa8c-d16bc7c81865	Penetration Testing Implementation	Cybersecurity requirements for penetration testing within the entity shall be implemented.	2-11-2	not_started	\N	2025-11-29 18:34:50.277287	2025-11-29 18:34:50.277287	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Penetration Testing	\N	All entities
fcd8cbf3-94c9-4fd5-adbb-61dfa4d49673	Penetration Testing Minimum Requirements	Cybersecurity requirements for penetration testing shall include the following as a minimum.	2-11-3	not_started	\N	2025-11-29 18:34:50.281304	2025-11-29 18:34:50.281304	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Penetration Testing	\N	All entities
0076c663-7680-4456-b965-7cc809a0a524	Penetration Testing Scope	Scope of penetration testing to include all externally provided services (via the Internet) and their technical components including infrastructure websites web applications smartphone and tablet applications email and remote access.	2-11-3-1	not_started	\N	2025-11-29 18:34:50.282362	2025-11-29 18:34:50.282362	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Penetration Testing	\N	All entities
1aa24128-d471-4e65-8372-5955c9725abd	Periodic Penetration Testing	Conducting penetration tests periodically.	2-11-3-2	not_started	\N	2025-11-29 18:34:50.283257	2025-11-29 18:34:50.283257	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Penetration Testing	\N	All entities
45e7c908-c39f-40c0-8212-64a57d2becc5	Penetration Testing Review	The implementation of cybersecurity requirements for penetration testing shall be periodically reviewed.	2-11-4	not_started	\N	2025-11-29 18:34:50.284143	2025-11-29 18:34:50.284143	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Penetration Testing	\N	All entities
9b9ea4b0-e54c-4a1b-92ac-2fd18bf680f5	Event Logs Requirements	Cybersecurity requirements for cybersecurity event logs and monitoring management within the entity shall be identified documented and approved.	2-12-1	not_started	\N	2025-11-29 18:34:50.285554	2025-11-29 18:34:50.285554	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Event Logs and Monitoring	\N	All entities
ae921741-fc91-4310-908e-61b85cfb6a57	Event Logs Implementation	Cybersecurity requirements for cybersecurity event logs and monitoring management within the entity shall be implemented.	2-12-2	not_started	\N	2025-11-29 18:34:50.286662	2025-11-29 18:34:50.286662	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Event Logs and Monitoring	\N	All entities
a2a347e3-47a2-4e1e-9845-a17edd0f81ea	Event Logs Minimum Requirements	Cybersecurity requirements for cybersecurity event logs and monitoring management shall include the following as a minimum.	2-12-3	not_started	\N	2025-11-29 18:34:50.28748	2025-11-29 18:34:50.28748	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Event Logs and Monitoring	\N	All entities
e124857c-fbd1-4421-b075-9e6a9bf1f122	Event Logs Activation	Activation of cybersecurity event logs for critical information assets within the entity.	2-12-3-1	not_started	\N	2025-11-29 18:34:50.288425	2025-11-29 18:34:50.288425	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Event Logs and Monitoring	\N	All entities
ef12fa14-09fa-44a5-8c8b-f20e91a709c8	Privileged Account Logging	Activation of cybersecurity event logs for critical and privileged accounts accessing information assets as well as for remote access events within the entity.	2-12-3-2	not_started	\N	2025-11-29 18:34:50.289272	2025-11-29 18:34:50.289272	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Event Logs and Monitoring	\N	All entities
8f32118c-02a9-4de9-a9b9-5c6378891b18	SIEM Implementation	Identification of Security Information and Event Management (SIEM) techniques required for cybersecurity event logs collection.	2-12-3-3	not_started	\N	2025-11-29 18:34:50.290183	2025-11-29 18:34:50.290183	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Event Logs and Monitoring	\N	All entities
b442ac51-87c0-47b7-9c9f-01bc94e4c37e	Continuous Monitoring	Continuous monitoring of cybersecurity event logs.	2-12-3-4	not_started	\N	2025-11-29 18:34:50.291304	2025-11-29 18:34:50.291304	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Event Logs and Monitoring	\N	All entities
5fe49c6d-ecba-4215-98ca-bf1bb8b75212	Log Retention	Retention period of cybersecurity event logs (shall be at least 12 months).	2-12-3-5	not_started	\N	2025-11-29 18:34:50.292455	2025-11-29 18:34:50.292455	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Event Logs and Monitoring	\N	All entities
df77b392-607b-4eb2-9ca2-4271796d70c8	Event Logs Review	The implementation of cybersecurity requirements for cybersecurity event logs and monitoring management within the entity shall be periodically reviewed.	2-12-4	not_started	\N	2025-11-29 18:34:50.293391	2025-11-29 18:34:50.293391	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Event Logs and Monitoring	\N	All entities
d26e71cc-35f2-41f2-b520-42d4a7b17f16	Incident Management Requirements	Requirements for cybersecurity incident and threat management within the entity shall be identified documented and approved.	2-13-1	not_started	\N	2025-11-29 18:34:50.294882	2025-11-29 18:34:50.294882	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Incident and Threat Management	\N	All entities
9084e52b-c6bd-46c0-ad2f-b0a1096c0554	Incident Management Implementation	Requirements for cybersecurity incident and threat management within the entity shall be implemented.	2-13-2	not_started	\N	2025-11-29 18:34:50.461754	2025-11-29 18:34:50.461754	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Incident and Threat Management	\N	All entities
46b24a97-f06c-4d16-add0-f89d7d8905cc	Incident Management Minimum Requirements	Requirements for cybersecurity incident and threat management shall include the following as a minimum.	2-13-3	not_started	\N	2025-11-29 18:34:50.808729	2025-11-29 18:34:50.808729	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Incident and Threat Management	\N	All entities
0fae125f-42c4-49c1-acb8-b54c0f1569d1	Incident Response Plans	Cybersecurity incident response plans and escalation procedures.	2-13-3-1	not_started	\N	2025-11-29 18:34:51.085594	2025-11-29 18:34:51.085594	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Incident and Threat Management	\N	All entities
beec56c0-fe57-4a6c-9a8c-1d81e34b9514	Incident Classification	Cybersecurity incident classification.	2-13-3-2	not_started	\N	2025-11-29 18:34:51.092655	2025-11-29 18:34:51.092655	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Incident and Threat Management	\N	All entities
69c2f274-bedb-4614-8b74-3a80d886bd6d	Incident Reporting to NCA	Reporting cybersecurity incidents to the NCA.	2-13-3-3	not_started	\N	2025-11-29 18:34:51.094008	2025-11-29 18:34:51.094008	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Incident and Threat Management	\N	All entities
8735c8f1-94bf-4c6f-bdc5-693441063e89	Threat Intelligence Sharing	Sharing cybersecurity incident notifications threat intelligence penetration indicators and incident reports with the NCA.	2-13-3-4	not_started	\N	2025-11-29 18:34:51.09549	2025-11-29 18:34:51.09549	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Incident and Threat Management	\N	All entities
4f389f47-9184-41a9-ba35-0420630eee7a	Threat Intelligence Collection	Collecting and handling threat intelligence feeds.	2-13-3-5	not_started	\N	2025-11-29 18:34:51.096835	2025-11-29 18:34:51.096835	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Incident and Threat Management	\N	All entities
536ec170-01a6-4a03-a5df-81347ef02ac8	Incident Management Review	The implementation of cybersecurity requirements for incident and threat management within the entity shall be periodically reviewed.	2-13-4	not_started	\N	2025-11-29 18:34:51.097882	2025-11-29 18:34:51.097882	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Incident and Threat Management	\N	All entities
0914ff17-59d9-4ccc-90cb-ddd38892224e	Physical Security Requirements	Cybersecurity requirements for protection of information and technology assets of the entity against unauthorized physical access loss theft and damage shall be identified documented and approved.	2-14-1	not_started	\N	2025-11-29 18:34:51.099151	2025-11-29 18:34:51.099151	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Physical Security	\N	All entities
3d79f6c5-fd85-450c-ab86-a1f27425fe2f	Physical Security Implementation	Cybersecurity requirements for protection of information and technology assets of the entity against unauthorized physical access loss theft and damage shall be implemented.	2-14-2	not_started	\N	2025-11-29 18:34:51.10062	2025-11-29 18:34:51.10062	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Physical Security	\N	All entities
0a30833f-f339-45f1-bb11-24cfcc60e9ce	Physical Security Minimum Requirements	Cybersecurity requirements for protection of information and technology assets of the entity against unauthorized physical access loss theft and damage shall include the following as a minimum.	2-14-3	not_started	\N	2025-11-29 18:34:51.102013	2025-11-29 18:34:51.102013	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Physical Security	\N	All entities
067fa02e-085b-485a-a1dc-fc019227a911	Authorized Access to Critical Areas	Authorized access to critical areas within the entity (e.g. the entity's data center disaster recovery center critical information processing facilities security surveillance center network connection rooms technical device and equipment supply areas etc.).	2-14-3-1	not_started	\N	2025-11-29 18:34:51.103612	2025-11-29 18:34:51.103612	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Physical Security	\N	All entities
abc67ffa-798d-497d-b63c-15d66810a279	Access and Monitoring Logs	Access and monitoring logs (CCTV).	2-14-3-2	not_started	\N	2025-11-29 18:34:51.10502	2025-11-29 18:34:51.10502	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Physical Security	\N	All entities
318fc97a-7749-466e-a8ca-bdbc2ef3f459	Log Information Protection	Protection of access and monitoring log information.	2-14-3-3	not_started	\N	2025-11-29 18:34:51.106636	2025-11-29 18:34:51.106636	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Physical Security	\N	All entities
87ba95dd-e3dd-4b10-8403-90ea50033442	Secure Destruction	Security of the destruction and re-use of physical assets that hold classified information (including paper documents and storage media).	2-14-3-4	not_started	\N	2025-11-29 18:34:51.111947	2025-11-29 18:34:51.111947	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Physical Security	\N	All entities
835b4489-0025-451f-b97f-0979651719f0	Device Security	Security of devices and equipment inside and outside the entity's facilities.	2-14-3-5	not_started	\N	2025-11-29 18:34:51.113827	2025-11-29 18:34:51.113827	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Physical Security	\N	All entities
f12d4495-ddca-498b-9515-7c064d61365f	Physical Security Review	Cybersecurity requirements for protection of information and technology assets of the entity against unauthorized physical access loss theft and damage shall be periodically reviewed.	2-14-4	not_started	\N	2025-11-29 18:34:51.114883	2025-11-29 18:34:51.114883	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Physical Security	\N	All entities
b4b4001f-1bf1-40a0-9dd5-0b4f023fc500	Web Application Security Requirements	Cybersecurity requirements for protection of external web applications of the entity shall be identified documented and approved.	2-15-1	not_started	\N	2025-11-29 18:34:51.11593	2025-11-29 18:34:51.11593	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Web Application Security	\N	All entities
5d3fd2fd-99a8-4095-b769-a98afaa46cf7	Web Application Security Implementation	Cybersecurity requirements for protection of external web applications of the entity shall be implemented.	2-15-2	not_started	\N	2025-11-29 18:34:51.116869	2025-11-29 18:34:51.116869	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Web Application Security	\N	All entities
d81ea8ce-0d47-4667-aeaf-84e14196f5b2	Web Application Security Minimum Requirements	Cybersecurity requirements for protection of external web applications of the entity shall include the following as a minimum.	2-15-3	not_started	\N	2025-11-29 18:34:51.118109	2025-11-29 18:34:51.118109	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Web Application Security	\N	All entities
2fc260cf-c72e-4a38-90aa-5b61f73c175b	Web Application Firewall	Use of web application firewall.	2-15-3-1	not_started	\N	2025-11-29 18:34:51.119294	2025-11-29 18:34:51.119294	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Web Application Security	\N	All entities
f5cd3c15-2202-404b-bfaf-6c19e82b0599	Multi-Tier Architecture	Adoption of the multi-tier architecture principle.	2-15-3-2	not_started	\N	2025-11-29 18:34:51.120352	2025-11-29 18:34:51.120352	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Web Application Security	\N	All entities
2babebd9-6481-44c8-8c06-f719bac794cc	Secure Protocols	Use of secure protocols (e.g. HTTPS).	2-15-3-3	not_started	\N	2025-11-29 18:34:51.121499	2025-11-29 18:34:51.121499	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Web Application Security	\N	All entities
d5da88e3-7e8c-432e-8b03-d2c73a2a4195	Secure Usage Policy	Clarification of the secure usage policy for users.	2-15-3-4	not_started	\N	2025-11-29 18:34:51.122648	2025-11-29 18:34:51.122648	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Web Application Security	\N	All entities
d1c72b30-6fcb-48ca-a923-d6673e46e6ac	User Authentication	User authentication and the suitable authentication factors and their numbers as well as the authentication techniques shall be defined based on the result of impact assessment of authentication failure and bypass for users' access.	2-15-3-5	not_started	\N	2025-11-29 18:34:51.123677	2025-11-29 18:34:51.123677	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Web Application Security	\N	All entities
c943ddbb-5b09-4717-a4c3-ccac36bd9975	Web Application Security Review	Cybersecurity requirements for protection of web applications of the entity shall be periodically reviewed.	2-15-4	not_started	\N	2025-11-29 18:34:51.125289	2025-11-29 18:34:51.125289	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Defense - Web Application Security	\N	All entities
325494d2-701c-4f97-ad39-0588f37a2c6a	BCM Cybersecurity Requirements	Cybersecurity requirements for business continuity management within the entity shall be identified documented and approved.	3-1-1	not_started	\N	2025-11-29 18:34:51.126415	2025-11-29 18:34:51.126415	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Resilience - Business Continuity Management	\N	All entities
59145741-5b66-43d2-bcab-00eb29fbc8ac	BCM Implementation	Cybersecurity requirements for business continuity management within the entity shall be implemented.	3-1-2	not_started	\N	2025-11-29 18:34:51.127458	2025-11-29 18:34:51.127458	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Resilience - Business Continuity Management	\N	All entities
a2c4b212-44df-41bc-b384-ccce15064d09	BCM Minimum Requirements	Cybersecurity requirements for business continuity management within the entity shall include the following as a minimum.	3-1-3	not_started	\N	2025-11-29 18:34:51.128721	2025-11-29 18:34:51.128721	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Resilience - Business Continuity Management	\N	All entities
11bf0f2b-4a5b-47a9-a3c9-d62b198f6652	Cybersecurity Systems Continuity	Ensuring the continuity of cybersecurity systems and procedures.	3-1-3-1	not_started	\N	2025-11-29 18:34:51.129693	2025-11-29 18:34:51.129693	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Resilience - Business Continuity Management	\N	All entities
a4918f75-82c1-4bca-b864-034d838dfebf	Incident Response Plans	Developing plans for response to cybersecurity incidents that may affect the entity's business continuity.	3-1-3-2	not_started	\N	2025-11-29 18:34:51.130647	2025-11-29 18:34:51.130647	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Resilience - Business Continuity Management	\N	All entities
00be26be-5a29-4972-a162-22b468e92f1a	Disaster Recovery Plans	Developing disaster recovery plans.	3-1-3-3	not_started	\N	2025-11-29 18:34:51.131764	2025-11-29 18:34:51.131764	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Resilience - Business Continuity Management	\N	All entities
9bfc1ab8-a228-444b-8b00-d5106d4119ed	BCM Review	Cybersecurity requirements for business continuity management within the entity shall be periodically reviewed.	3-1-4	not_started	\N	2025-11-29 18:34:51.132815	2025-11-29 18:34:51.132815	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Cybersecurity Resilience - Business Continuity Management	\N	All entities
1fc3f29c-55cb-4035-bd64-8d81e1e63782	Third-Party Requirements	Cybersecurity requirements for the entity's contracts and agreements with third parties shall be identified documented and approved.	4-1-1	not_started	\N	2025-11-29 18:34:51.134023	2025-11-29 18:34:51.134023	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Third-Party Cybersecurity	\N	All entities
1deeee67-9ecb-497d-9f6f-4ec6dbc60ba8	Third-Party Contract Requirements	Cybersecurity requirements for contracts and agreements with third parties e.g. Service Level Agreement which if impaired may affect the entity's data or services shall include the following as a minimum.	4-1-2	not_started	\N	2025-11-29 18:34:51.135745	2025-11-29 18:34:51.135745	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Third-Party Cybersecurity	\N	All entities
02427747-0e21-4fa3-bcd5-22850ae48dc3	Non-Disclosure Clauses	Clauses of non-disclosure and the secure removal of the entity's data by the third party upon the end of service.	4-1-2-1	not_started	\N	2025-11-29 18:34:51.13734	2025-11-29 18:34:51.13734	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Third-Party Cybersecurity	\N	All entities
c3320d9d-7108-4726-aabe-82732944ff2b	Incident Communication Procedures	Communication procedures in case of the occurrence of a cybersecurity incident.	4-1-2-2	not_started	\N	2025-11-29 18:34:51.138489	2025-11-29 18:34:51.138489	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Third-Party Cybersecurity	\N	All entities
d11fde08-3174-476f-8225-86b854da641e	Third-Party Compliance Obligation	Obligating the third party to apply the entity's cybersecurity requirements and policies and the relevant legislative and regulatory requirements.	4-1-2-3	not_started	\N	2025-11-29 18:34:51.140176	2025-11-29 18:34:51.140176	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Third-Party Cybersecurity	\N	All entities
47d12e2a-103f-4482-b64b-e69a610505a2	Outsourcing Requirements	Cybersecurity requirements for contracts and agreements with third parties providing IT or cybersecurity outsourcing or managed services shall include the following as a minimum.	4-1-3	not_started	\N	2025-11-29 18:34:51.1416	2025-11-29 18:34:51.1416	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Third-Party Cybersecurity	\N	All entities
b6617dfa-0c29-4dea-8b98-8bd29f9435cf	Third-Party Risk Assessment	Conducting a cybersecurity risk assessment and ensuring the availability of risk mitigation controls before signing contracts and agreements or upon making changes to the relevant legislative and regulatory requirements.	4-1-3-1	not_started	\N	2025-11-29 18:34:51.14276	2025-11-29 18:34:51.14276	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Third-Party Cybersecurity	\N	All entities
c51e7b29-8ec8-4a11-9582-690a27bd6752	Service Center Location	Cybersecurity managed service centers for monitoring and operations which use remote access shall be fully located in the Kingdom of Saudi Arabia.	4-1-3-2	not_started	\N	2025-11-29 18:34:51.143791	2025-11-29 18:34:51.143791	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Third-Party Cybersecurity	\N	All entities
9c7e02a9-aef8-4b7b-9265-694dfdcb63f7	Third-Party Requirements Review	Cybersecurity requirements for third parties shall be periodically reviewed.	4-1-4	not_started	\N	2025-11-29 18:34:51.144802	2025-11-29 18:34:51.144802	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Third-Party Cybersecurity	\N	All entities
e6b052e4-88b6-4209-a584-7c5ef86f837a	Cloud Requirements	Cybersecurity requirements for use of cloud computing and hosting services shall be identified documented and approved.	4-2-1	not_started	\N	2025-11-29 18:34:51.145917	2025-11-29 18:34:51.145917	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Cloud Computing and Hosting	\N	Cloud users
e68ee4ec-0bff-429c-afb0-48d4e833b607	Cloud Implementation	Cybersecurity requirements for the cloud computing and hosting services within the entity shall be implemented.	4-2-2	not_started	\N	2025-11-29 18:34:51.146785	2025-11-29 18:34:51.146785	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Cloud Computing and Hosting	\N	Cloud users
152fa70f-5160-4205-a367-8701257edf26	Cloud Minimum Requirements	In accordance with the relevant legislative and regulatory requirements and in addition to the applicable controls in the Main Domains (1) (2) and (3) and Subdomain (4.1) that are necessary to protect the entity's data or services provided thereto cybersecurity requirements for use of cloud computing and hosting services shall include the following as a minimum.	4-2-3	not_started	\N	2025-11-29 18:34:51.147565	2025-11-29 18:34:51.147565	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Cloud Computing and Hosting	\N	Cloud users
768cf827-d2a6-4793-ad89-49851c3e7f98	Cloud Data Protection	Protection of entity's data by cloud and hosting service providers in accordance with its classification level and returning data (in a usable format) upon service completion.	4-2-3-1	not_started	\N	2025-11-29 18:34:51.148554	2025-11-29 18:34:51.148554	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Cloud Computing and Hosting	\N	Cloud users
4f552f44-44a0-4094-abe3-fdd3fd112ae1	Environment Separation	Separation of the entity's environment (especially virtual servers) from environments of other entities within the cloud computing service provider.	4-2-3-2	not_started	\N	2025-11-29 18:34:51.14947	2025-11-29 18:34:51.14947	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Cloud Computing and Hosting	\N	Cloud users
1e705d25-ade3-44c2-bf2d-ffe9f06d8748	Cloud Requirements Review	Cybersecurity requirements for cloud computing and hosting services shall be periodically reviewed.	4-2-4	not_started	\N	2025-11-29 18:34:51.150443	2025-11-29 18:34:51.150443	37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a	Third-Party and Cloud Cybersecurity - Cloud Computing and Hosting	\N	Cloud users
\.


--
-- Data for Name: compliance_validation_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compliance_validation_rules (id, requirement_id, priority, created_by, "createdAt", "updatedAt", asset_type, rule_name, rule_description, validation_logic, is_active) FROM stdin;
6f92736f-a31c-4aa4-9b59-fa3d1f8287d4	6c1d2b26-aae6-45b6-bddf-7e5147f820db	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.589484	2025-12-01 08:44:17.589484	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
713e7604-f567-4cb6-b5de-833be266eed1	339cac28-03da-431d-aaa3-d5d421f5b863	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.605049	2025-12-01 08:44:17.605049	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
55f64196-e091-495a-9dee-773988ae9466	9cd43185-97b3-451d-89d1-7aacc8fdc016	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.606445	2025-12-01 08:44:17.606445	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
6bf4f1ca-e16b-4aef-ae04-2c9e4bdd7971	1ea1f7da-38f0-4e1d-a0ae-8720acac76b4	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.608095	2025-12-01 08:44:17.608095	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
c7d0d953-98d0-4059-a3a0-591d61779d5e	1bd85d31-c2d1-4a69-9fbd-4785781631e0	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.60945	2025-12-01 08:44:17.60945	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
c27bc6f3-9277-4c64-be2f-ebb1bdf47a8b	1bd85d31-c2d1-4a69-9fbd-4785781631e0	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.610511	2025-12-01 08:44:17.610511	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
181b250d-5cb4-4327-9fa4-078487a4f376	a98b2c14-9ae5-4020-8b92-36bc3499bf54	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.611479	2025-12-01 08:44:17.611479	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
70711912-95ce-4e7f-99dc-1005fbd633a3	a98b2c14-9ae5-4020-8b92-36bc3499bf54	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.612446	2025-12-01 08:44:17.612446	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
18f5cad9-0ec7-41c9-9e0e-58c7ae314fb6	b1f53242-f29c-461a-aad8-ebd7d8288d4b	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.613841	2025-12-01 08:44:17.613841	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
65e4a698-1493-4e3d-9092-675c752e0f27	7bb93adb-2a81-44f9-a535-796f9226c47b	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.615139	2025-12-01 08:44:17.615139	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
f9071a54-cce5-4257-ad16-bcdb9805854b	a3ead258-c172-40ab-be32-04eb24e8a676	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.616038	2025-12-01 08:44:17.616038	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
dc0dfd87-7687-4d9a-9dc9-df045004f868	c81712c7-73a6-477b-b698-9080f9d43bba	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.61691	2025-12-01 08:44:17.61691	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
a8cb14a1-9391-4da0-ac97-2b9095610806	c81712c7-73a6-477b-b698-9080f9d43bba	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.617839	2025-12-01 08:44:17.617839	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
e95ac19c-e6f0-4e94-89e0-dfab4337944d	bd067e35-4cdf-4ee4-87a2-effdc6e65bdb	8	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.618683	2025-12-01 08:44:17.618683	physical	Criticality Level Required	Physical assets must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
367fd345-87ab-422c-ad0c-5127a1711aa5	bd067e35-4cdf-4ee4-87a2-effdc6e65bdb	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.619531	2025-12-01 08:44:17.619531	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
09a1e660-ee34-41c9-9c1f-8b22a7897fde	bd067e35-4cdf-4ee4-87a2-effdc6e65bdb	6	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.620376	2025-12-01 08:44:17.620376	supplier	Criticality Level Required	Suppliers must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
494115b7-052c-4261-b734-38259806c1ed	4ec6dd84-d569-4992-9986-1f269b2e4afa	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.621158	2025-12-01 08:44:17.621158	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
870b4a40-ceb0-45c0-adf5-2085d86bdf2d	d9a81df5-a907-4cb5-b1e8-69baa64ef413	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.621946	2025-12-01 08:44:17.621946	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
dcfa272d-fead-4e3f-b58c-90c87e8faea8	7a36d6e8-4b6c-467a-8985-1c6844c98108	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.623111	2025-12-01 08:44:17.623111	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
80e6bdf4-fdff-4d37-8b8c-23ae95852ef4	166ee906-9e25-4ffb-a365-acac2413475a	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.623944	2025-12-01 08:44:17.623944	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
8fb872b5-fca8-4095-b067-192f2c258156	3419f238-b607-4e68-8cc3-59efb39df00a	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.632916	2025-12-01 08:44:17.632916	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
bbc3ba2d-261c-4cb6-9180-8bede44c79de	f6067562-54f4-40b8-b040-cb40b0f1101d	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.635627	2025-12-01 08:44:17.635627	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
4645c79e-4954-4489-b8fa-fce296c9c832	d9060736-d1c4-4206-af08-483af674a32f	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.63718	2025-12-01 08:44:17.63718	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
186d3a49-620c-42ae-9273-69f9e0e0dba0	1cfaf4ab-d0a0-44fa-810c-33e50da8514e	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.639158	2025-12-01 08:44:17.639158	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
56ff267a-0d8b-4c02-99f7-546424b8d95c	03d5c82c-71f5-46e1-bb9f-5f7948555a6a	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.640584	2025-12-01 08:44:17.640584	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
aca5ba7f-8a47-428e-85c2-82aaa82c1551	7d9edfb6-8df7-4a7f-9dd5-5d3eb2503f6c	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.641826	2025-12-01 08:44:17.641826	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
30112691-b840-4d2b-8f87-1df38b3e955f	612fb31e-ee3e-4f77-9141-5c5821a044f4	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.642999	2025-12-01 08:44:17.642999	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
218f0427-fb41-44e6-ae99-ecf4b52be673	4ea1bf46-5bcf-48f6-a98a-254b1911c5ed	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.643967	2025-12-01 08:44:17.643967	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
59de30c0-979d-4124-b56f-6d2a1a9ff41a	adcb204f-69fa-4201-8778-988534e67676	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.645036	2025-12-01 08:44:17.645036	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
2e635416-5481-49ae-899d-854b977b2a3c	adcb204f-69fa-4201-8778-988534e67676	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.646585	2025-12-01 08:44:17.646585	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
b8f11c0c-a249-42dd-a1d9-45daf3888fdd	f2cc5cbd-ef5f-48de-bde4-0fa0020394fe	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.64802	2025-12-01 08:44:17.64802	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
af54257c-ff41-4821-820c-b0050711cf4b	f2cc5cbd-ef5f-48de-bde4-0fa0020394fe	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.648871	2025-12-01 08:44:17.648871	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
22c9bff7-c455-4931-bca2-e283f399e5b1	f2cc5cbd-ef5f-48de-bde4-0fa0020394fe	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.649566	2025-12-01 08:44:17.649566	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
b8124281-1d8e-4d33-997b-8464805d6e33	3d460101-e4ec-4315-bd70-423d0bb9c342	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.650196	2025-12-01 08:44:17.650196	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ec9f4ba7-1502-4fdb-a351-e415af9513a0	86a8fb50-3af6-4b9c-9231-5bd4315a0c1c	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.650779	2025-12-01 08:44:17.650779	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
f39d999d-4e94-4d6a-a1bc-34bfe8f6e9a7	86a8fb50-3af6-4b9c-9231-5bd4315a0c1c	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.652036	2025-12-01 08:44:17.652036	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
c4f45bae-44d5-42c3-9ae4-295c25debb29	7c82ab04-d94b-444c-83e9-b47f0a311fe7	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.652736	2025-12-01 08:44:17.652736	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
03c62d80-b8b3-4945-8ee7-d8840f7a4ee7	7c82ab04-d94b-444c-83e9-b47f0a311fe7	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.653607	2025-12-01 08:44:17.653607	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
47a4c38f-8400-4f49-a400-62e0ef05a545	ffb28957-18be-4051-8ebf-3f8942fb6158	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.654646	2025-12-01 08:44:17.654646	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
3fdca7b0-3da6-4683-8ed4-ed14cf70123a	82856c64-da89-4d36-94d7-e6c7605bb9a2	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.65549	2025-12-01 08:44:17.65549	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
a58e944f-1c1a-44c6-b650-2f2ee48188ba	82856c64-da89-4d36-94d7-e6c7605bb9a2	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.656304	2025-12-01 08:44:17.656304	supplier	Security Assessment Required	Suppliers with data access must have security assessment completed	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "hasSecurityAssessment", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "hasSecurityAssessment", "value": false, "operator": "equals"}]}	t
c744ff5d-8036-46e8-91d4-2cd02c940910	25a87947-a282-48c4-807d-e082f2c0b839	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.657232	2025-12-01 08:44:17.657232	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
86ec43e7-c11a-44f5-9d1c-42c2f36e0f45	25a87947-a282-48c4-807d-e082f2c0b839	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.658053	2025-12-01 08:44:17.658053	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
8cb7ba9e-384e-47b8-81e5-78b51108158d	fbc14f3b-d711-4e2e-95e7-8a6f2daad123	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.659327	2025-12-01 08:44:17.659327	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
f93c7482-de05-46db-880f-04b6613654e1	fbc14f3b-d711-4e2e-95e7-8a6f2daad123	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.659985	2025-12-01 08:44:17.659985	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
9de8e28a-5596-4b86-b426-2fba509c459e	fbc14f3b-d711-4e2e-95e7-8a6f2daad123	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.660622	2025-12-01 08:44:17.660622	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
7411f68a-845b-4f6f-b660-65a7a95054e1	319032e1-98a1-4631-b217-71a90487f69c	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.661302	2025-12-01 08:44:17.661302	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
892e8ea7-995c-4fdc-9032-f27158210532	831c9212-0d67-4006-b1e9-03360a0be0ad	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.662461	2025-12-01 08:44:17.662461	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
9386c96f-97fa-4fb6-ade9-1bc65ce00289	94bee9f6-843a-4d54-aaf5-6c5ebb92aadd	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.66346	2025-12-01 08:44:17.66346	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
8f081c37-6e0f-49ce-8ed7-aa65f3746b55	51ed6871-0764-4bb5-ac15-0edcbc39f868	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.664319	2025-12-01 08:44:17.664319	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
acb5e737-2e61-4b24-a39e-70d9baeceb0e	caf32aed-3b4b-469b-af25-3cd33109afeb	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.664957	2025-12-01 08:44:17.664957	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
8009d333-7162-41eb-bcbd-31367dc9711a	3b39d2c1-ae74-4a45-84cd-ea7c641c744a	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.665706	2025-12-01 08:44:17.665706	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
df1b2fc1-629a-4486-87c6-82455f3e5231	c0b1abf5-a8f5-4fe1-87f0-4a8c95de2c6a	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.66645	2025-12-01 08:44:17.66645	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
aa63e488-aa7d-499f-bfe2-c985e0a1f2f8	2a706737-4c08-4e23-a96f-4ce266c1769d	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.667085	2025-12-01 08:44:17.667085	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
d66a3c66-def6-45eb-885a-198936176d75	98995647-a90a-4e31-8dfd-468d4ac853ae	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.667689	2025-12-01 08:44:17.667689	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
5cb79aac-c891-4931-ac4b-b080f21ae3f1	d415c576-7a73-4a8d-b24b-3e90ffc93e78	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.66832	2025-12-01 08:44:17.66832	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
a332a1f5-3772-4786-af80-8fb4e7dafad3	adbfecbe-e3b2-4082-b955-b155414827b5	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.669032	2025-12-01 08:44:17.669032	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
abdd69cc-b766-4764-9d65-24a276135c2c	a5b3a7d0-dfd2-4abd-9a3e-b09e1ac1f8f0	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.669664	2025-12-01 08:44:17.669664	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
c2d3e813-c985-42fa-a0e0-251328df14ff	1e19b377-71cb-4e05-b76c-d30e192bcd2c	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.670501	2025-12-01 08:44:17.670501	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
0bbbedf9-db76-4f09-bce5-a6508af986ba	1311776c-625d-458e-8484-9a10214dca29	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.671154	2025-12-01 08:44:17.671154	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
a9b1760b-1762-4238-be0f-af91a4abeea1	d17f6f69-5931-4fe2-9c77-17257daa8dbd	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.671748	2025-12-01 08:44:17.671748	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
9d75967c-42b5-40db-9914-817736c50e91	e871a3a8-90e1-446e-abd1-2e07b8fff043	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.672359	2025-12-01 08:44:17.672359	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
35ef288b-1f75-4410-92d2-325f628f1188	f2e662ae-abdf-40d6-9863-13a5e92e2386	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.67344	2025-12-01 08:44:17.67344	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ee04777f-9487-4466-b884-5fe0507b45d5	3ebabcaf-d854-4cb5-a565-413c4123bd4d	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.674088	2025-12-01 08:44:17.674088	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
31754dd3-fb2a-41c3-bd06-aa317bd450ea	a1f1a8d0-ed7f-4fc7-896b-ffa42b9e6660	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.67486	2025-12-01 08:44:17.67486	information	Data Classification Required	Information assets must have a data classification assigned	{"conditions": [], "complianceCriteria": [{"field": "dataClassification", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": null, "operator": "not_exists"}]}	t
78479d5d-f51d-40d3-9942-2ab63bc8dabd	819c18cc-df51-46f0-8ce1-5c7e7c601e29	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.675588	2025-12-01 08:44:17.675588	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
a69ad68f-1c64-4b8e-9a47-bc945fcb1bb0	4c34c87d-5f9d-4d32-9d76-9f650a48113e	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.676359	2025-12-01 08:44:17.676359	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
3ee8f508-d779-4388-8269-837c85902a93	589f29c5-b7be-4c41-a71f-9cae51b56ebe	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.677167	2025-12-01 08:44:17.677167	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
e749ea76-96ff-4392-a3a1-e6a891fb29a2	b7fb732e-4eab-48df-a214-b1af05717f13	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.67853	2025-12-01 08:44:17.67853	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
78187f89-6f56-49fd-bdcf-36b5737ecd8b	c29d2471-27d7-4a39-8ec9-bb7f65d49819	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.679882	2025-12-01 08:44:17.679882	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
e0d81463-83de-42a7-989c-db84f290f4f6	fc65bfea-791f-4c29-9549-f6f5ecaf2137	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.680987	2025-12-01 08:44:17.680987	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
50650e8e-29ca-4745-b159-ee8d5f522c4e	735e8d0c-09be-4136-a20a-50baabedda11	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.681892	2025-12-01 08:44:17.681892	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
76fd8a8a-82dd-47f6-a7eb-e95e89f1fd3d	735e8d0c-09be-4136-a20a-50baabedda11	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.682779	2025-12-01 08:44:17.682779	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
fbea619a-51cb-4766-be9f-e36e060722f5	615264bd-ee2f-491a-a04e-6d33a29ca6b5	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.683477	2025-12-01 08:44:17.683477	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
46b94ce4-3f70-428c-9780-9e3db04fd605	96a7d1cf-1fee-4a64-bd7e-ae5fbe56aaa7	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.68428	2025-12-01 08:44:17.68428	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
90986f84-c824-499c-9767-98643067e726	daaa36fd-9387-4c59-83c1-4adaa6750921	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.684827	2025-12-01 08:44:17.684827	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
6a9dd625-d86c-4436-80fb-6d91c83c7e73	1b106a5f-0436-4fda-aef8-5e67e51e9558	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.685505	2025-12-01 08:44:17.685505	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
2ee2b873-759c-4953-a117-88d6d1fbf4cf	3bc0ff85-7a8e-4348-b243-f9eb1e96effb	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.686133	2025-12-01 08:44:17.686133	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
78d274db-9537-4b43-88ae-1836a5132136	0212f4ff-6524-4126-a651-d73848e38d77	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.68682	2025-12-01 08:44:17.68682	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
f10aacec-90f8-4c6e-801d-8a78a97dad59	53894ac2-553f-40ad-b971-a065fc63cc18	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.68741	2025-12-01 08:44:17.68741	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
9e6644af-ce72-40d1-be06-a8ac4da8cc31	f2f12e7b-a762-45db-b66f-85b115a00954	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.687985	2025-12-01 08:44:17.687985	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
83df96f8-db63-42a3-9328-f24489fb503c	9eee4e8f-bd22-4b32-8954-b91365fbf6a0	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.688714	2025-12-01 08:44:17.688714	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
35b1f39a-4965-4a6c-88b8-99698f4e5806	dc84cdd0-8d15-4ca4-92a7-53b19827503d	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.689421	2025-12-01 08:44:17.689421	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
a246c6e5-367b-4f90-9327-69aaab548925	908860e5-3076-4643-9cce-be81cfab9463	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.690098	2025-12-01 08:44:17.690098	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
1b71f300-da70-45d8-8e9d-9693724be7be	b5c422e8-9fc2-47e5-b2a7-7780ac92f630	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.691015	2025-12-01 08:44:17.691015	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
57e10182-8bce-460b-8ae5-8650d74dbf71	3f9983ff-0fcd-4846-9e60-32f6e9b5de72	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.69162	2025-12-01 08:44:17.69162	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
e419b0bc-7338-4766-af09-ed666e4a52f3	b9c591d5-f5fb-4963-8e05-8dd2e51bfd6b	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.6923	2025-12-01 08:44:17.6923	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
eca19285-ea2f-4ac3-a157-82561f733caa	297254b0-3a36-40be-848c-364579880694	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.692889	2025-12-01 08:44:17.692889	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
d50e1949-c1d5-449e-83ed-cad152b7b432	b07526fb-3d2b-49cf-81fb-eee808a36b56	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.693496	2025-12-01 08:44:17.693496	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
369e7565-7c10-4e2b-ae29-b74857e15417	5fe77e3d-af26-4d0f-8307-7d1fc0b8e167	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.694042	2025-12-01 08:44:17.694042	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
8d880d24-b68d-4810-abc1-8bcce885115f	5fe77e3d-af26-4d0f-8307-7d1fc0b8e167	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.696403	2025-12-01 08:44:17.696403	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
fed7047a-13c1-457f-9ef3-921ad1c9fac7	a6f35fde-5de1-4b04-ba90-9ca1552a4c76	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.697356	2025-12-01 08:44:17.697356	physical	Network Approval Required	Physical assets connected to network must have network approval	{"conditions": [{"field": "connectivityStatus", "value": "connected", "operator": "equals"}], "complianceCriteria": [{"field": "networkApprovalStatus", "value": "approved", "operator": "equals"}], "nonComplianceCriteria": [{"field": "networkApprovalStatus", "value": ["pending", "rejected"], "operator": "in"}]}	t
f0fe5501-f6ef-4377-b529-a0ae60f6ef95	508aee49-b3c6-4208-b331-82153814fa3c	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.698358	2025-12-01 08:44:17.698358	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
a8fc0a46-64b5-45c8-aaf6-ee3e742469a4	508aee49-b3c6-4208-b331-82153814fa3c	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.69903	2025-12-01 08:44:17.69903	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
7c5a62fd-1402-45d7-a112-155a887d9af0	508aee49-b3c6-4208-b331-82153814fa3c	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.699582	2025-12-01 08:44:17.699582	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
1f3f2193-8f02-4670-ba11-dfe62efcebb7	508aee49-b3c6-4208-b331-82153814fa3c	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.700169	2025-12-01 08:44:17.700169	supplier	Security Assessment Required	Suppliers with data access must have security assessment completed	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "hasSecurityAssessment", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "hasSecurityAssessment", "value": false, "operator": "equals"}]}	t
adb864d8-b7a1-49cb-8641-e08b313e4acf	7980333d-5f22-4b2f-a6cf-44acc902d924	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.700761	2025-12-01 08:44:17.700761	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ff365c5a-40a1-4d35-9673-68d4b6bf7de8	5590c3f4-8b6e-4f7d-9389-d8d40fbc3876	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.701651	2025-12-01 08:44:17.701651	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ecd25f9e-1099-486a-8667-f0d800d9007a	237ddbfc-ff8e-4660-bc8b-68311f980b76	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.702253	2025-12-01 08:44:17.702253	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
7f8a4189-b548-4de3-9ded-e3197f93499d	973b2dc2-da9c-4a7e-b6df-81dd9c68fa24	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.703001	2025-12-01 08:44:17.703001	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
7e83a8ec-cdd6-41a0-a881-d76e9af3e362	d40c6b3a-af02-4e50-8559-731ddeea8fa5	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.703743	2025-12-01 08:44:17.703743	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
d2165fdc-2d5d-4ffc-b604-a76d831c3521	6f8f1613-3f78-401a-9a31-0f5092d47b1b	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.704419	2025-12-01 08:44:17.704419	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
71ac620a-d8ca-4d21-8f43-82feaeb6252b	6f8f1613-3f78-401a-9a31-0f5092d47b1b	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.705108	2025-12-01 08:44:17.705108	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
392964b5-6d4a-41c3-9b35-493d5406180c	8d4b95f3-8b54-4989-b942-b31b2daadec0	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.705888	2025-12-01 08:44:17.705888	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
6d990379-2399-451d-a990-4d56255b3292	25d013f7-fdf0-45cd-85ba-ea4d00bf2b63	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.706578	2025-12-01 08:44:17.706578	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
08e08878-346b-46e0-8a01-abb3828f7ce1	c6fb0218-6d19-474c-b339-652870795179	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.707202	2025-12-01 08:44:17.707202	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
fc641985-2cfe-4657-af38-a9ba39feeb6e	c6fb0218-6d19-474c-b339-652870795179	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.70775	2025-12-01 08:44:17.70775	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
93e74152-2c24-43db-9757-d3ea80ffb3c6	c6fb0218-6d19-474c-b339-652870795179	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.708293	2025-12-01 08:44:17.708293	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ee4a1901-1be1-4a42-81b3-bb1ee37848cf	a40293c0-b0c1-43ab-8531-14bbac458b34	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.708833	2025-12-01 08:44:17.708833	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
af29e90b-4be8-4aac-b87f-79d8a68b43d4	a40293c0-b0c1-43ab-8531-14bbac458b34	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.709627	2025-12-01 08:44:17.709627	information	Data Classification Required	Information assets must have a data classification assigned	{"conditions": [], "complianceCriteria": [{"field": "dataClassification", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": null, "operator": "not_exists"}]}	t
441db5b7-8444-425a-af7e-c7514fd14c48	a40293c0-b0c1-43ab-8531-14bbac458b34	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.710178	2025-12-01 08:44:17.710178	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
f3546538-bd72-466e-aea2-8b4e7b02135e	a40293c0-b0c1-43ab-8531-14bbac458b34	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.710891	2025-12-01 08:44:17.710891	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
1430e688-f9eb-483e-b037-9931be8ffb44	efea9d6f-87ca-41e3-9ca5-4f2040836114	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.711501	2025-12-01 08:44:17.711501	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
39b47782-c9ca-4e0f-bb38-12d2bc411a23	efea9d6f-87ca-41e3-9ca5-4f2040836114	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.712063	2025-12-01 08:44:17.712063	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
2aaa63f4-bbde-406f-a956-51ab323ae33f	efea9d6f-87ca-41e3-9ca5-4f2040836114	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.712663	2025-12-01 08:44:17.712663	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
b49ae6a7-2225-4716-b9d0-063c959b1b39	262c3793-462a-4957-899f-ae0ef1bf503e	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.713268	2025-12-01 08:44:17.713268	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ddd1236e-e7ab-47f5-a43d-f671df9a1471	df2e5f31-b750-43da-bba0-3f3bc18e29aa	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.713862	2025-12-01 08:44:17.713862	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
d702c7ac-6f4b-430b-a2d5-75e5fc891d29	665fd0e4-837f-498d-b9d5-5be03795ae17	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.714439	2025-12-01 08:44:17.714439	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
d194959a-bd45-4386-b2d7-d4d19f892f32	665fd0e4-837f-498d-b9d5-5be03795ae17	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.715033	2025-12-01 08:44:17.715033	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
45a2ca85-2fa9-4969-acca-809342fd6f05	665fd0e4-837f-498d-b9d5-5be03795ae17	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.715663	2025-12-01 08:44:17.715663	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
9bb69a12-4b48-42b4-a3d4-7691a6e9156a	665fd0e4-837f-498d-b9d5-5be03795ae17	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.716307	2025-12-01 08:44:17.716307	supplier	Security Assessment Required	Suppliers with data access must have security assessment completed	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "hasSecurityAssessment", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "hasSecurityAssessment", "value": false, "operator": "equals"}]}	t
3c61c276-8c3d-4093-8ba9-1d9acb5e94a7	665fd0e4-837f-498d-b9d5-5be03795ae17	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.716854	2025-12-01 08:44:17.716854	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
4a3984e9-0b69-4d8c-8d79-087913714cfa	74efa19b-67b9-4424-b437-62b9e42b41aa	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.717593	2025-12-01 08:44:17.717593	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
cccf8753-1cc8-4baf-981f-601b15ab9665	90093f15-1c60-4453-80d9-47cb25c4aa14	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.718211	2025-12-01 08:44:17.718211	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
b9ddf7c6-3237-475d-aedd-5926d26b449d	90093f15-1c60-4453-80d9-47cb25c4aa14	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.720226	2025-12-01 08:44:17.720226	information	Data Classification Required	Information assets must have a data classification assigned	{"conditions": [], "complianceCriteria": [{"field": "dataClassification", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": null, "operator": "not_exists"}]}	t
259890ad-6154-484e-99c0-3e3f3e1cb412	90093f15-1c60-4453-80d9-47cb25c4aa14	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.720915	2025-12-01 08:44:17.720915	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
0d69ce7c-a3b2-47f1-9acb-d08c038ea66b	4fb6fbc2-cbd7-42c4-b989-81d6ab067261	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.722403	2025-12-01 08:44:17.722403	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
469f01f2-9595-46c5-8021-ba04cb909071	bbff7d94-b8a2-4518-bbd7-5e7b816b196d	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.723607	2025-12-01 08:44:17.723607	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
a8e79bf3-87a9-461c-9a98-220181861b72	2403696f-7244-4227-b167-c858d9729513	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.724172	2025-12-01 08:44:17.724172	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
195b960b-dffe-45af-b7ad-57552181909f	9332d255-c97e-4950-baa6-cd946022462d	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.72479	2025-12-01 08:44:17.72479	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ed4e6f86-448b-4d9d-a2af-7b126512e115	f113faa4-00ac-46ed-be11-455aef99e299	8	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.725395	2025-12-01 08:44:17.725395	physical	Criticality Level Required	Physical assets must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
b26a020b-0cc9-44fa-aefb-354f19272ab1	f113faa4-00ac-46ed-be11-455aef99e299	6	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.726066	2025-12-01 08:44:17.726066	supplier	Criticality Level Required	Suppliers must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
5d48aff3-b85f-4281-a570-5ae29045a2e2	5f9146da-a306-4db0-b014-f88dd6b0a625	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.726611	2025-12-01 08:44:17.726611	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
e4276ce3-ab7c-4c0a-b2ff-4de7ef2289ff	14b6d19e-4df2-4ba9-8141-3af07e26207c	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.727202	2025-12-01 08:44:17.727202	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
3d943ced-e397-4086-905b-3cff37b2d0e8	b9e79616-6e77-4885-b645-ea7d8822a3cf	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.727769	2025-12-01 08:44:17.727769	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
b710c2b9-fc6c-43b2-8db6-954f3dae6405	b9e79616-6e77-4885-b645-ea7d8822a3cf	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.728578	2025-12-01 08:44:17.728578	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
2ca95180-9a29-48e1-962a-59d80a8b7330	0b81108a-b177-48fd-90bb-d224cd7fbc8c	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.729129	2025-12-01 08:44:17.729129	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
6bae3cc4-99c6-4eb5-bb78-1d19d66fced7	0b81108a-b177-48fd-90bb-d224cd7fbc8c	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.729787	2025-12-01 08:44:17.729787	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
0214e030-5c6a-4bbb-80e5-1c8a66491cb6	f0d76532-df5e-43fc-817e-fcda50df37ae	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.730411	2025-12-01 08:44:17.730411	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
2dbe09a3-23a8-4eae-a354-95660ae5f438	f0d76532-df5e-43fc-817e-fcda50df37ae	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.730902	2025-12-01 08:44:17.730902	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
e5cd9748-945a-4164-9e06-c1cc37552fdc	8480c190-0b14-4673-b673-6beb4059b564	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.731419	2025-12-01 08:44:17.731419	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
59d018d0-2519-44c9-b4b5-77843d9b4061	937c92a8-1bbc-484a-8d09-f52aa51476f2	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.731933	2025-12-01 08:44:17.731933	information	Data Classification Required	Information assets must have a data classification assigned	{"conditions": [], "complianceCriteria": [{"field": "dataClassification", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": null, "operator": "not_exists"}]}	t
ea2df1e2-67cd-4674-a469-1b56df6097f9	937c92a8-1bbc-484a-8d09-f52aa51476f2	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.732553	2025-12-01 08:44:17.732553	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
ef25b480-b411-48e1-a40c-53508bba021c	42021727-b8fe-47ea-b3fb-23c449d49e6b	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.733088	2025-12-01 08:44:17.733088	information	Data Classification Required	Information assets must have a data classification assigned	{"conditions": [], "complianceCriteria": [{"field": "dataClassification", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": null, "operator": "not_exists"}]}	t
254c4527-7e15-4acf-977b-bbf0e148fadd	42021727-b8fe-47ea-b3fb-23c449d49e6b	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.733642	2025-12-01 08:44:17.733642	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
91d46b97-80b6-41ea-a4d3-b9504484e25f	a616341a-3e67-47e4-a08d-28f1aad31a97	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.734229	2025-12-01 08:44:17.734229	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
d8325c69-45b5-42e8-8124-3b283c7348da	de383247-c538-4e8f-b145-85c48b200991	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.734757	2025-12-01 08:44:17.734757	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
f1bf2dcd-8092-4dd3-a2a3-71bc4f868b50	5fe49c6d-ecba-4215-98ca-bf1bb8b75212	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.745508	2025-12-01 08:44:17.745508	information	Retention Policy Required	Information assets must have a retention policy defined	{"conditions": [], "complianceCriteria": [{"field": "retentionPolicy", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "retentionPolicy", "value": null, "operator": "not_exists"}]}	t
65928bc4-4179-4419-aaa5-94efc40631fe	49a460e5-4830-4bc0-97eb-1a33ad058729	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.735435	2025-12-01 08:44:17.735435	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
35b0c3fb-49a3-4423-90db-095930c73a07	49a460e5-4830-4bc0-97eb-1a33ad058729	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.736047	2025-12-01 08:44:17.736047	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
77c783cd-9305-4445-b130-8172c303259a	e94389ed-a1d9-40c5-a601-aa1499a86bdb	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.736616	2025-12-01 08:44:17.736616	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
8f194879-043d-451c-8f45-9b336855aed9	6b748c61-1953-4bd5-aa8c-d16bc7c81865	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.737124	2025-12-01 08:44:17.737124	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
8a50d73d-3754-4918-b8f4-11d99bc7b747	fcd8cbf3-94c9-4fd5-adbb-61dfa4d49673	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.737595	2025-12-01 08:44:17.737595	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
58a98c0f-882b-4e74-8e5f-45c9d7adb240	45e7c908-c39f-40c0-8212-64a57d2becc5	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.738298	2025-12-01 08:44:17.738298	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
b5bac619-0cef-4067-a20b-b7e6d91a6729	9b9ea4b0-e54c-4a1b-92ac-2fd18bf680f5	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.738806	2025-12-01 08:44:17.738806	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
228222a7-66ef-4ed1-9a4f-e513ce2f6ea3	ae921741-fc91-4310-908e-61b85cfb6a57	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.739396	2025-12-01 08:44:17.739396	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
7f5f1393-1c40-4dd4-bab1-cc52d28c8125	a2a347e3-47a2-4e1e-9845-a17edd0f81ea	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.739973	2025-12-01 08:44:17.739973	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
7e2fdbf2-3103-44c7-a174-ebe24f317fa5	e124857c-fbd1-4421-b075-9e6a9bf1f122	8	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.740602	2025-12-01 08:44:17.740602	physical	Criticality Level Required	Physical assets must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
8282ba32-d8fa-4259-b5ac-caa0b622a585	e124857c-fbd1-4421-b075-9e6a9bf1f122	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.741233	2025-12-01 08:44:17.741233	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
21ab3869-dbf7-4ce1-b1bc-33b0401b013a	e124857c-fbd1-4421-b075-9e6a9bf1f122	6	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.741804	2025-12-01 08:44:17.741804	supplier	Criticality Level Required	Suppliers must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
2d94e644-cd74-463e-90c2-1575af2cbac4	ef12fa14-09fa-44a5-8c8b-f20e91a709c8	8	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.742618	2025-12-01 08:44:17.742618	physical	Criticality Level Required	Physical assets must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
c3f22d27-261d-4649-afec-7c0496aa3a27	ef12fa14-09fa-44a5-8c8b-f20e91a709c8	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.743298	2025-12-01 08:44:17.743298	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
4b1396a6-bae0-4fac-b8b8-9bcc7d19eecd	ef12fa14-09fa-44a5-8c8b-f20e91a709c8	6	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.743854	2025-12-01 08:44:17.743854	supplier	Criticality Level Required	Suppliers must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
21cde022-e219-46af-87bd-2d13a82b977b	8f32118c-02a9-4de9-a9b9-5c6378891b18	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.744472	2025-12-01 08:44:17.744472	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
7928ca1f-d8cf-4ebc-89a9-93ea36c07aac	b442ac51-87c0-47b7-9c9f-01bc94e4c37e	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.744972	2025-12-01 08:44:17.744972	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
5c83ff89-4f0b-43a0-9b29-9fdef7bd0200	5fe49c6d-ecba-4215-98ca-bf1bb8b75212	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.746012	2025-12-01 08:44:17.746012	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
db947b10-d8a9-4f28-a9e9-56fc8589b540	df77b392-607b-4eb2-9ca2-4271796d70c8	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.746629	2025-12-01 08:44:17.746629	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
2c01edb8-1b27-4749-8465-be3a9c53a561	d26e71cc-35f2-41f2-b520-42d4a7b17f16	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.747516	2025-12-01 08:44:17.747516	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
29c61f91-4698-49df-b077-0d39c0e4e588	9084e52b-c6bd-46c0-ad2f-b0a1096c0554	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.748098	2025-12-01 08:44:17.748098	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
fe2ef4c1-114a-412d-9771-2ba3b75238d7	46b24a97-f06c-4d16-add0-f89d7d8905cc	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.748935	2025-12-01 08:44:17.748935	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
8672ea31-7ee4-44c7-81b8-beed8a95d16f	0fae125f-42c4-49c1-acb8-b54c0f1569d1	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.749713	2025-12-01 08:44:17.749713	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
0cd16591-9fb0-4f4a-9363-f908be131541	beec56c0-fe57-4a6c-9a8c-1d81e34b9514	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.75044	2025-12-01 08:44:17.75044	information	Data Classification Required	Information assets must have a data classification assigned	{"conditions": [], "complianceCriteria": [{"field": "dataClassification", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": null, "operator": "not_exists"}]}	t
5b58e381-0e57-4a08-919a-c687e1b119df	beec56c0-fe57-4a6c-9a8c-1d81e34b9514	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.750929	2025-12-01 08:44:17.750929	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
e691f9d9-a2d0-4e9a-aedf-f463f0d84c1f	69c2f274-bedb-4614-8b74-3a80d886bd6d	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.751523	2025-12-01 08:44:17.751523	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
8233e9c5-70c8-440c-9d70-43192f8f9441	8735c8f1-94bf-4c6f-bdc5-693441063e89	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.752047	2025-12-01 08:44:17.752047	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
194c9f74-8fc0-4429-95ba-258839f5844b	536ec170-01a6-4a03-a5df-81347ef02ac8	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.752571	2025-12-01 08:44:17.752571	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
87046fdb-3004-473f-898a-d598b6bb7f6d	0914ff17-59d9-4ccc-90cb-ddd38892224e	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.753051	2025-12-01 08:44:17.753051	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
9d79d85b-1007-43ac-a463-65f7469e2b9e	0914ff17-59d9-4ccc-90cb-ddd38892224e	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.75362	2025-12-01 08:44:17.75362	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ab64b974-42da-4787-ba00-5f5e7fd1837e	3d79f6c5-fd85-450c-ab86-a1f27425fe2f	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.754218	2025-12-01 08:44:17.754218	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
8efbc333-64d5-468f-b5c1-abc082450c0c	3d79f6c5-fd85-450c-ab86-a1f27425fe2f	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.754943	2025-12-01 08:44:17.754943	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
805dc836-9824-4f21-a3d9-8a419bfb643e	0a30833f-f339-45f1-bb11-24cfcc60e9ce	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.75553	2025-12-01 08:44:17.75553	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
51c49afe-85af-4d16-aae9-e0b0b22b234e	0a30833f-f339-45f1-bb11-24cfcc60e9ce	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.756075	2025-12-01 08:44:17.756075	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
65df4011-8671-4b83-9035-7be13490881f	067fa02e-085b-485a-a1dc-fc019227a911	8	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.756648	2025-12-01 08:44:17.756648	physical	Criticality Level Required	Physical assets must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
29cceb67-1dad-417e-8ae2-4403c8724ae7	067fa02e-085b-485a-a1dc-fc019227a911	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.75722	2025-12-01 08:44:17.75722	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
4de4646f-a767-4c27-89cb-6a6f518abb9d	067fa02e-085b-485a-a1dc-fc019227a911	6	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.757717	2025-12-01 08:44:17.757717	supplier	Criticality Level Required	Suppliers must have a criticality level assigned	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
9a370e41-5145-47a7-9596-10f142c07b92	87ba95dd-e3dd-4b10-8403-90ea50033442	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.758323	2025-12-01 08:44:17.758323	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
5901e081-a6dc-4a37-ba0e-112cf0ad0d10	835b4489-0025-451f-b97f-0979651719f0	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.75885	2025-12-01 08:44:17.75885	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
b9ce36b9-e900-4a6d-97a3-fadc499a9093	f12d4495-ddca-498b-9515-7c064d61365f	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.759481	2025-12-01 08:44:17.759481	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
30867ddc-59ed-4099-a757-d465d8a0cd19	f12d4495-ddca-498b-9515-7c064d61365f	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.759995	2025-12-01 08:44:17.759995	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
c5afbf22-a528-40ce-828c-d54aa72c148a	b4b4001f-1bf1-40a0-9dd5-0b4f023fc500	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.760511	2025-12-01 08:44:17.760511	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
331aa126-1af0-4928-aea1-bfe8639b9d9e	5d3fd2fd-99a8-4095-b769-a98afaa46cf7	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.761028	2025-12-01 08:44:17.761028	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
343c0e67-2661-4ec4-86d0-67707bbead2f	d81ea8ce-0d47-4667-aeaf-84e14196f5b2	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.761546	2025-12-01 08:44:17.761546	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
741b7a5c-fe2c-46c9-92a6-bf2cf8184233	d1c72b30-6fcb-48ca-a923-d6673e46e6ac	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.762123	2025-12-01 08:44:17.762123	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
4249ea8a-ce4b-4b42-95c9-82bf22684ca2	c943ddbb-5b09-4717-a4c3-ccac36bd9975	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.762858	2025-12-01 08:44:17.762858	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
003c7003-f91f-4828-b13a-32a72fe6ac5d	325494d2-701c-4f97-ad39-0588f37a2c6a	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.763569	2025-12-01 08:44:17.763569	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
3e04d857-7af5-4a0a-959e-69d91d6c5537	59145741-5b66-43d2-bcab-00eb29fbc8ac	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.764074	2025-12-01 08:44:17.764074	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
cdf5cbe1-9fbc-48c4-a828-9767e85a6f9c	a2c4b212-44df-41bc-b384-ccce15064d09	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.764641	2025-12-01 08:44:17.764641	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
9274d0c5-39b3-45a7-9135-afe88fcbad96	11bf0f2b-4a5b-47a9-a3c9-d62b198f6652	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.765173	2025-12-01 08:44:17.765173	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
e5c696f0-4ba5-4c60-9e22-67dbc1b2e536	a4918f75-82c1-4bca-b864-034d838dfebf	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.765673	2025-12-01 08:44:17.765673	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
58fe8b3e-9045-4e67-b635-c380217af7e0	9bfc1ab8-a228-444b-8b00-d5106d4119ed	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.766222	2025-12-01 08:44:17.766222	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
578ef825-8099-47f1-a36d-76086fb0c549	1fc3f29c-55cb-4035-bd64-8d81e1e63782	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.766786	2025-12-01 08:44:17.766786	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
807e7124-3434-4fb5-80b1-df4daf2efc3c	1fc3f29c-55cb-4035-bd64-8d81e1e63782	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.767346	2025-12-01 08:44:17.767346	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
50653982-8049-4984-9e3e-daf3f83e723d	1fc3f29c-55cb-4035-bd64-8d81e1e63782	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.7679	2025-12-01 08:44:17.7679	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
1a6a8273-1612-4dc5-98ff-0113a30f6c00	1deeee67-9ecb-497d-9f6f-4ec6dbc60ba8	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.768658	2025-12-01 08:44:17.768658	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
5757e64c-8176-4a1a-af93-c4d0d7efa4f6	1deeee67-9ecb-497d-9f6f-4ec6dbc60ba8	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.769228	2025-12-01 08:44:17.769228	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
a3744710-9f29-4d48-800a-8d00482ea833	1deeee67-9ecb-497d-9f6f-4ec6dbc60ba8	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.769712	2025-12-01 08:44:17.769712	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
dd50f6ec-340c-4679-b8d7-eef3fe5e244a	02427747-0e21-4fa3-bcd5-22850ae48dc3	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.770481	2025-12-01 08:44:17.770481	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
a76e8076-11eb-46cd-80be-522891670f5b	02427747-0e21-4fa3-bcd5-22850ae48dc3	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.771013	2025-12-01 08:44:17.771013	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
d4ba3283-2f58-496a-aa3e-86feaaa9433c	02427747-0e21-4fa3-bcd5-22850ae48dc3	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.771647	2025-12-01 08:44:17.771647	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
f58c9882-b42a-4a09-85b5-fbb0a436f1ae	c3320d9d-7108-4726-aabe-82732944ff2b	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.772149	2025-12-01 08:44:17.772149	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ecde9cc0-62b5-4e51-b8bd-b9cf3d2a9784	d11fde08-3174-476f-8225-86b854da641e	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.772632	2025-12-01 08:44:17.772632	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
4929183f-5925-4d95-a029-d44cc03655a8	d11fde08-3174-476f-8225-86b854da641e	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.773117	2025-12-01 08:44:17.773117	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
bf2471d5-44be-4857-b325-4cb9c67ccec1	d11fde08-3174-476f-8225-86b854da641e	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.773607	2025-12-01 08:44:17.773607	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
2ecffd6b-2895-4877-9c82-26a8ae037808	47d12e2a-103f-4482-b64b-e69a610505a2	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.774152	2025-12-01 08:44:17.774152	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
51bea9c4-9fcf-43ad-a69a-037b95c94174	b6617dfa-0c29-4dea-8b98-8bd29f9435cf	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.774711	2025-12-01 08:44:17.774711	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
4871b40e-fec9-4a46-88f8-2c4a626c5633	b6617dfa-0c29-4dea-8b98-8bd29f9435cf	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.775287	2025-12-01 08:44:17.775287	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
e54f0b8a-48f4-4bf6-9824-3a0754f10ee9	b6617dfa-0c29-4dea-8b98-8bd29f9435cf	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.775777	2025-12-01 08:44:17.775777	supplier	Security Assessment Required	Suppliers with data access must have security assessment completed	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "hasSecurityAssessment", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "hasSecurityAssessment", "value": false, "operator": "equals"}]}	t
070cc70b-0ff7-4198-9bbf-5ee32ffebfd4	b6617dfa-0c29-4dea-8b98-8bd29f9435cf	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.7763	2025-12-01 08:44:17.7763	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
70c39c0e-3a11-486b-9ae8-eb8edc677380	c51e7b29-8ec8-4a11-9582-690a27bd6752	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.776881	2025-12-01 08:44:17.776881	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
ece33daf-54d7-4b26-b52c-9ac0de8b4da5	c51e7b29-8ec8-4a11-9582-690a27bd6752	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.777584	2025-12-01 08:44:17.777584	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
426bcda6-da2f-47fa-8bf8-1f18f0631526	9c7e02a9-aef8-4b7b-9265-694dfdcb63f7	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.778214	2025-12-01 08:44:17.778214	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
76a5a68a-ae57-48fa-bb0c-62383403be52	9c7e02a9-aef8-4b7b-9265-694dfdcb63f7	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.77876	2025-12-01 08:44:17.77876	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
b3f6b266-111b-4104-8d19-6dae8519b5e3	9c7e02a9-aef8-4b7b-9265-694dfdcb63f7	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.779251	2025-12-01 08:44:17.779251	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
1933505c-313b-4780-9e91-8590cf4f6c5b	e6b052e4-88b6-4209-a584-7c5ef86f837a	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.780029	2025-12-01 08:44:17.780029	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
e11bb3b9-b7f5-4790-abdd-2aa792ff282f	e68ee4ec-0bff-429c-afb0-48d4e833b607	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.780608	2025-12-01 08:44:17.780608	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
a73085d3-6053-460a-b777-ceddec3be9e0	152fa70f-5160-4205-a367-8701257edf26	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.781222	2025-12-01 08:44:17.781222	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
04cb5452-5445-4a81-b0c3-46bf76c2efef	768cf827-d2a6-4793-ad89-49851c3e7f98	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.781773	2025-12-01 08:44:17.781773	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
c74bb666-5f80-4fbe-a6eb-68fc39792537	768cf827-d2a6-4793-ad89-49851c3e7f98	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.782347	2025-12-01 08:44:17.782347	information	Data Classification Required	Information assets must have a data classification assigned	{"conditions": [], "complianceCriteria": [{"field": "dataClassification", "value": null, "operator": "exists"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": null, "operator": "not_exists"}]}	t
8513be46-be32-4601-9836-d83f5a8426cc	768cf827-d2a6-4793-ad89-49851c3e7f98	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.78287	2025-12-01 08:44:17.78287	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
3caf3884-b32c-4614-ba65-540884ed2bed	1e705d25-ade3-44c2-bf2d-ffe9f06d8748	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.783401	2025-12-01 08:44:17.783401	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
ac699019-b4f8-48e9-b17d-19f1152b4616	075f5f85-26a1-49cc-a54e-65777b1177e1	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.785373	2025-12-01 08:44:17.785373	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
975f8b9e-ecff-4ce0-a3c0-7f8aabe4800d	696db01a-a9e1-4f98-8a70-f5abfdf05264	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.785944	2025-12-01 08:44:17.785944	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
e51d8cd9-e9ee-4fd2-968d-1addfc3498d0	696db01a-a9e1-4f98-8a70-f5abfdf05264	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.786743	2025-12-01 08:44:17.786743	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
f4d89ec2-ff46-4ab5-b084-cffce85da5d2	696db01a-a9e1-4f98-8a70-f5abfdf05264	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.787285	2025-12-01 08:44:17.787285	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
8e52c7ee-e228-4114-9a20-b49e23ae8168	1ad10149-bc71-4fd3-adad-48ba8657034d	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.787814	2025-12-01 08:44:17.787814	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
d56cafdb-b57b-4f9d-8f8a-40fed4c164ec	1ad10149-bc71-4fd3-adad-48ba8657034d	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.788382	2025-12-01 08:44:17.788382	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
dd533acf-f33e-4e35-86d8-406614a2237a	1ad10149-bc71-4fd3-adad-48ba8657034d	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.78887	2025-12-01 08:44:17.78887	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
f0805f48-a48f-4eba-976d-819d02a824f9	1ad10149-bc71-4fd3-adad-48ba8657034d	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.78936	2025-12-01 08:44:17.78936	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
0f8f55d3-90f7-4615-8f61-b29e692e5a48	e4cd7d1c-3086-4cde-b4bd-94977b10c573	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.789882	2025-12-01 08:44:17.789882	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
5020a169-ef8d-455a-9701-3f6dd58787ea	e4cd7d1c-3086-4cde-b4bd-94977b10c573	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.790465	2025-12-01 08:44:17.790465	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
d2216deb-4970-4b6a-9ab9-4813e6501709	60697426-b482-4f8c-8a67-4719b8041add	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.791211	2025-12-01 08:44:17.791211	information	Data Classification for Sensitive Data	Information assets containing sensitive data (PII, PHI, Financial) must have appropriate classification	{"conditions": [{"field": "containsPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "dataClassification", "value": ["confidential", "restricted", "top_secret"], "operator": "in"}], "nonComplianceCriteria": [{"field": "dataClassification", "value": ["public", "internal"], "operator": "in"}]}	t
e3febd12-1129-4ae8-bec3-0ccd53c74ea4	60697426-b482-4f8c-8a67-4719b8041add	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.791759	2025-12-01 08:44:17.791759	application	Criticality Level for Sensitive Data Processing	Applications processing sensitive data (PII, PHI, Financial) must have appropriate criticality level	{"conditions": [{"field": "processesPII", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "criticalityLevel", "value": ["critical", "high"], "operator": "in"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": "medium", "operator": "equals"}]}	t
d48de76f-9f07-48ae-a2bb-bfe845cd5dcc	2972b3be-d656-4c6d-b6e6-a87343917f09	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.792335	2025-12-01 08:44:17.792335	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
585ebec6-996e-471b-9295-e6e2c1294c09	3f03e5e6-704d-41ac-b51a-2716385b6b14	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.792909	2025-12-01 08:44:17.792909	physical	Physical Location Required	Physical assets must have location information recorded	{"conditions": [], "complianceCriteria": [{"field": "location", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "location", "value": null, "operator": "not_exists"}]}	t
1bd37939-2ef5-4ba2-bd44-ae53d5372e88	3f03e5e6-704d-41ac-b51a-2716385b6b14	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.793451	2025-12-01 08:44:17.793451	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
873ba9b1-2cfa-43f7-a11b-82716957333a	7d332e34-21d3-4956-94ee-b098eba3abe2	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.794366	2025-12-01 08:44:17.794366	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
9c7242fe-597b-4430-bd2c-5d3d3c0a1989	c9e7823d-a5bb-4be0-bb99-69a0d6657d68	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.794915	2025-12-01 08:44:17.794915	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
6e10d509-5a8a-41d4-b8e4-47b4c6e62030	c9e7823d-a5bb-4be0-bb99-69a0d6657d68	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.795475	2025-12-01 08:44:17.795475	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
262d63a3-265a-4691-b984-3d76a85e8573	c9e7823d-a5bb-4be0-bb99-69a0d6657d68	10	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.796382	2025-12-01 08:44:17.796382	supplier	Security Assessment Required	Suppliers with data access must have security assessment completed	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "hasSecurityAssessment", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "hasSecurityAssessment", "value": false, "operator": "equals"}]}	t
fe28baae-1899-4334-800e-eaf21f0de685	c9e7823d-a5bb-4be0-bb99-69a0d6657d68	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.797228	2025-12-01 08:44:17.797228	supplier	NDA Required for Data Access	Suppliers with data access must have NDA in place	{"conditions": [{"field": "hasDataAccess", "value": true, "operator": "equals"}], "complianceCriteria": [{"field": "requiresNDA", "value": true, "operator": "equals"}], "nonComplianceCriteria": [{"field": "requiresNDA", "value": false, "operator": "equals"}]}	t
81eea8e4-08c8-42af-a05a-b0de9d610075	c9e7823d-a5bb-4be0-bb99-69a0d6657d68	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.797998	2025-12-01 08:44:17.797998	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
17b32353-3145-40e6-9283-7dad139d12dd	0b2141be-c96c-439f-8763-f731e70e02c4	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.800051	2025-12-01 08:44:17.800051	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
f70ce68b-c5b7-4469-8032-4542e0f9896e	0b2141be-c96c-439f-8763-f731e70e02c4	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.801257	2025-12-01 08:44:17.801257	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
5cd9fe70-0626-4310-95c5-24811e78e2d1	0b2141be-c96c-439f-8763-f731e70e02c4	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.80279	2025-12-01 08:44:17.80279	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
083a6748-6fca-4b09-b2f2-4f50a2330b8d	dadcee64-cc08-4d72-93ee-5ebec4fc2437	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.803578	2025-12-01 08:44:17.803578	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
2bc83430-163d-444f-b373-bbf90c35d1c4	dadcee64-cc08-4d72-93ee-5ebec4fc2437	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.804363	2025-12-01 08:44:17.804363	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
93845d2c-ce80-44c1-9fb6-884b27b97d7a	8eb2c1d2-bb0c-4f20-9d48-3a45d36d53c2	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.808814	2025-12-01 08:44:17.808814	application	Vendor Information Required	Applications must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
4821e0ae-3118-4b6e-ae6e-ac997e86f060	8eb2c1d2-bb0c-4f20-9d48-3a45d36d53c2	5	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.80947	2025-12-01 08:44:17.80947	software	Vendor Information Required	Software assets must have vendor information recorded	{"conditions": [], "complianceCriteria": [{"field": "vendor", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "vendor", "value": null, "operator": "not_exists"}]}	t
593b9007-3a66-457d-906f-22660be3c236	d53c088b-7bda-4405-aa38-857c57ed5974	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.810252	2025-12-01 08:44:17.810252	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
ed3bf4e2-c967-4f4b-9d10-7c36edeb05a2	ae430c3f-e013-449d-b5a6-38c8f7a04b4d	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.810783	2025-12-01 08:44:17.810783	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
262bf523-cc4c-42f6-ad1b-c5a9c5bbd29f	2a3ea0b0-1a2b-4311-9f59-c016d7b1b34d	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.811314	2025-12-01 08:44:17.811314	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
b504063b-1c84-4c98-8b3c-c2d96beff00b	441d9285-e3fd-4f76-8ea5-4adeef091fcf	7	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.811812	2025-12-01 08:44:17.811812	software	Version Information Required	Software assets must have version information recorded	{"conditions": [], "complianceCriteria": [{"field": "version", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "version", "value": null, "operator": "not_exists"}]}	t
c9ac71a2-acec-48cb-bf36-72ef4e2b370b	82867865-705a-4f87-9ff7-48fbe61dd1f0	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.812406	2025-12-01 08:44:17.812406	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
80a5cb47-9b57-4590-a924-a901a2fa776f	b947dd53-0d18-45ec-9f4b-d918a47ee437	9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-01 08:44:17.812996	2025-12-01 08:44:17.812996	application	Criticality Level Required	Applications must have a criticality level assigned for security assessment	{"conditions": [], "complianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "exists"}], "partialComplianceCriteria": [{"field": "criticalityLevel", "value": null, "operator": "not_exists"}]}	t
\.


--
-- Data for Name: control_asset_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.control_asset_mappings (id, unified_control_id, asset_type, asset_id, implementation_date, implementation_status, implementation_notes, last_test_date, last_test_result, effectiveness_score, is_automated, mapped_by, mapped_at, updated_at) FROM stdin;
425dc166-70be-4c3a-95cc-1752adf92646	05e9dc0a-3415-4ff4-8531-04cf9bd95794	physical	b674dae7-b704-4d0c-a033-037fe3e1a109	2025-12-01	implemented	Successfully linked!	\N	\N	\N	f	\N	2025-12-04 20:54:49.584769	2025-12-04 20:54:49.584769
801136fd-e610-4893-830c-2ace0dba88b2	05e9dc0a-3415-4ff4-8531-04cf9bd95794	physical	1a2e1629-8971-4f54-8aa3-f908eca7d21e	2025-12-01	implemented	MFA implemented via Okta	\N	\N	5	t	\N	2025-12-04 20:58:49.461159	2025-12-04 20:58:49.461159
4232899b-d8cc-43e7-965a-cba5eaa974e5	05e9dc0a-3415-4ff4-8531-04cf9bd95794	physical	6f1ad9f5-9c0d-4d3e-9201-4892c6b3d837	2025-12-01	in_progress	MFA pilot - 70% configured	\N	\N	3	f	\N	2025-12-04 20:58:49.494335	2025-12-04 20:58:49.494335
b8973b07-92ef-41b0-89a5-69f0834b00ab	05e9dc0a-3415-4ff4-8531-04cf9bd95794	physical	b5e69311-54ba-4b26-9641-1b488ed0547d	2025-12-01	in_progress	MFA rollout planned Q1 2026	\N	\N	2	f	\N	2025-12-04 20:58:49.520398	2025-12-04 20:58:49.520398
4751451a-015f-41e2-a5fd-bceaf0aac36f	05e9dc0a-3415-4ff4-8531-04cf9bd95794	physical	b1da08bb-b45c-469c-9a50-3d461aaf92d7	2025-12-01	not_implemented	MFA not yet started	\N	\N	1	f	\N	2025-12-04 20:58:49.548269	2025-12-04 20:58:49.548269
02a40c42-ddd1-4454-9d44-8f3c205da89a	f4b89f75-b20a-46c5-949e-350a3bdd1f53	physical	04f69495-3a77-40fc-bf6b-6c8b63afa299	\N	not_implemented	\N	\N	\N	2	f	\N	2025-12-05 08:02:28.811086	2025-12-05 08:02:28.811086
591040c6-cc11-4749-8a96-f5462184b6cd	f4b89f75-b20a-46c5-949e-350a3bdd1f53	information	7324894a-85f5-44fa-9499-a0305bbb5910	\N	in_progress	\N	\N	\N	2	f	\N	2025-12-05 08:02:28.821077	2025-12-05 08:02:28.821077
6e1f7c1f-81d5-412d-8b40-bd3bfa26be2c	f4b89f75-b20a-46c5-949e-350a3bdd1f53	application	e153dc7f-3f92-44f7-914a-d8f1147775f0	\N	implemented	\N	\N	\N	1	f	\N	2025-12-05 08:02:28.821945	2025-12-05 08:02:28.821945
058bb45a-4421-4def-a509-81390dfde11b	f4b89f75-b20a-46c5-949e-350a3bdd1f53	physical	145fb736-353a-4ad6-97ba-34d7f63b7f5c	\N	not_implemented	\N	\N	\N	3	f	\N	2025-12-05 08:02:56.13022	2025-12-05 08:02:56.13022
13aef9eb-c24f-446f-a10a-52f76bfec826	f4b89f75-b20a-46c5-949e-350a3bdd1f53	information	33275a55-0122-4c02-8b1f-f292cab4b19e	\N	planned	\N	\N	\N	2	f	\N	2025-12-05 08:02:56.135903	2025-12-05 08:02:56.135903
40480ab6-da99-4f9d-8e17-69e2e13f9a7c	f4b89f75-b20a-46c5-949e-350a3bdd1f53	application	9ce9b538-0e9a-41a4-8dff-5804a97776ce	\N	in_progress	\N	\N	\N	1	f	\N	2025-12-05 08:02:56.136432	2025-12-05 08:02:56.136432
05b01834-3440-411a-a0c7-e9f1522e622d	f4b89f75-b20a-46c5-949e-350a3bdd1f53	software	e6c35ae8-6daf-426a-90e0-a7a0f5eb87d2	\N	implemented	\N	\N	\N	4	f	\N	2025-12-05 08:02:56.136859	2025-12-05 08:02:56.136859
56717b49-8914-44d1-8fa4-1e8a2481277c	f4b89f75-b20a-46c5-949e-350a3bdd1f53	supplier	fa53f601-0f5d-4b6f-8227-d5ff4f2a4fde	\N	not_applicable	\N	\N	\N	4	f	\N	2025-12-05 08:02:56.137379	2025-12-05 08:02:56.137379
fa6406b4-5c8e-4dcc-92b6-277cc8e379d2	21850ae0-0d3d-4255-b763-f3be1bbc0f97	physical	213f8e57-b089-4bc3-87cb-4ef8db58f559	\N	not_implemented	\N	\N	\N	1	f	\N	2025-12-05 08:02:56.138053	2025-12-05 08:02:56.138053
72441602-cdc8-4476-ba4a-dc41364aa3fa	21850ae0-0d3d-4255-b763-f3be1bbc0f97	information	f73479e9-3cd9-4e54-983a-597b107dc340	\N	planned	\N	\N	\N	2	f	\N	2025-12-05 08:02:56.138844	2025-12-05 08:02:56.138844
2aeb82ca-93b5-4a25-9145-18f19c017bad	21850ae0-0d3d-4255-b763-f3be1bbc0f97	application	a4824906-17a5-4c00-bcd8-a6d70fb4f189	\N	in_progress	\N	\N	\N	4	f	\N	2025-12-05 08:02:56.139352	2025-12-05 08:02:56.139352
bff24240-07b4-49c0-838d-1e2199b46b1f	21850ae0-0d3d-4255-b763-f3be1bbc0f97	software	1145485b-0ef5-45fc-ab68-96eea992c319	\N	implemented	\N	\N	\N	2	f	\N	2025-12-05 08:02:56.139697	2025-12-05 08:02:56.139697
62a83383-8ccc-4d83-b2f4-0a4f910a46a2	21850ae0-0d3d-4255-b763-f3be1bbc0f97	supplier	294d1540-0bce-4e2f-a192-2783ea1df11d	\N	not_applicable	\N	\N	\N	5	f	\N	2025-12-05 08:02:56.140108	2025-12-05 08:02:56.140108
12ec3f87-1d46-4f5d-a19e-95f6ba504aa2	b5ee8b21-32b5-49ce-9214-4a23ec0cd419	physical	8121cb81-59e1-450e-a735-0550df388c1b	\N	not_implemented	\N	\N	\N	4	f	\N	2025-12-05 08:02:56.140524	2025-12-05 08:02:56.140524
acb4e68a-e694-4871-a345-a715c180d391	b5ee8b21-32b5-49ce-9214-4a23ec0cd419	information	976708cc-4814-4134-bd20-63f13aafa030	\N	planned	\N	\N	\N	1	f	\N	2025-12-05 08:02:56.140989	2025-12-05 08:02:56.140989
389252af-1dc4-41f6-bb8c-5f52cec1d441	b5ee8b21-32b5-49ce-9214-4a23ec0cd419	application	3ffebeb0-4553-4632-8ac7-993a5d05f965	\N	in_progress	\N	\N	\N	3	f	\N	2025-12-05 08:02:56.14139	2025-12-05 08:02:56.14139
5641a2df-97ce-47c5-bba4-b143085d1c6b	b5ee8b21-32b5-49ce-9214-4a23ec0cd419	software	323d79fb-5584-497c-aa69-e56bbb59342b	\N	implemented	\N	\N	\N	3	f	\N	2025-12-05 08:02:56.141652	2025-12-05 08:02:56.141652
b0d5402a-e773-4d6b-b584-a7900b14debc	b5ee8b21-32b5-49ce-9214-4a23ec0cd419	supplier	0b1cc56f-fe71-4f6c-8ab5-fbb1240a46e4	\N	not_applicable	\N	\N	\N	2	f	\N	2025-12-05 08:02:56.142058	2025-12-05 08:02:56.142058
12e76316-37c2-455f-abdb-c2ec6e48e546	ccc179a0-95c4-4d0b-9073-fd5321875893	physical	1b81e7ce-1149-4d97-961e-8158a12c47ec	\N	not_implemented	\N	\N	\N	5	f	\N	2025-12-05 08:02:56.142569	2025-12-05 08:02:56.142569
6f74e39b-ccb2-433b-b2ec-7c0ca9451fe0	ccc179a0-95c4-4d0b-9073-fd5321875893	information	90629f95-76ff-4aca-aa7c-b84060f6f676	\N	planned	\N	\N	\N	3	f	\N	2025-12-05 08:02:56.143367	2025-12-05 08:02:56.143367
9f264c5f-36bd-4ecf-b6ef-1c53d6f31520	ccc179a0-95c4-4d0b-9073-fd5321875893	application	14b5c2ab-e141-49cc-a71e-2b9c4aeb98ff	\N	in_progress	\N	\N	\N	1	f	\N	2025-12-05 08:02:56.143848	2025-12-05 08:02:56.143848
41e80df9-8a88-4c5c-9a08-197f210c64d9	ccc179a0-95c4-4d0b-9073-fd5321875893	software	3e8533e3-373e-48ea-9977-53d70b03d276	\N	implemented	\N	\N	\N	3	f	\N	2025-12-05 08:02:56.144163	2025-12-05 08:02:56.144163
ca0c1cb4-68d0-4545-9947-1d0807a249b0	ccc179a0-95c4-4d0b-9073-fd5321875893	supplier	3f03a71d-91d5-46f3-8564-a953fd8dc2c3	\N	not_applicable	\N	\N	\N	4	f	\N	2025-12-05 08:02:56.144781	2025-12-05 08:02:56.144781
61916537-cecc-4a3a-9004-16401472ee24	57ab59e4-0a22-47ca-9f63-90b1cb2d5ad0	physical	39ecb402-146b-4bac-a387-7f0aef6cfba9	\N	not_implemented	\N	\N	\N	1	f	\N	2025-12-05 08:02:56.145083	2025-12-05 08:02:56.145083
51bc0548-cc43-45e9-bbb1-167ecb6fab1c	57ab59e4-0a22-47ca-9f63-90b1cb2d5ad0	information	632c7704-e031-42fa-91e4-06b22d18e886	\N	planned	\N	\N	\N	2	f	\N	2025-12-05 08:02:56.145548	2025-12-05 08:02:56.145548
6aa9d7dc-86d1-440a-9224-2173eb90bc48	57ab59e4-0a22-47ca-9f63-90b1cb2d5ad0	application	a5088950-db6c-4f32-995e-2670757fbd98	\N	in_progress	\N	\N	\N	2	f	\N	2025-12-05 08:02:56.145801	2025-12-05 08:02:56.145801
8cf61a51-075a-4f84-9be6-a8337172fde7	57ab59e4-0a22-47ca-9f63-90b1cb2d5ad0	software	a4f9d7f8-2e8b-49d3-a4ec-80e7505a6a95	\N	implemented	\N	\N	\N	4	f	\N	2025-12-05 08:02:56.146031	2025-12-05 08:02:56.146031
4aaf6145-4362-4287-a775-a933e164cf81	57ab59e4-0a22-47ca-9f63-90b1cb2d5ad0	supplier	c90dd640-13ff-4aef-a7f3-505c1de389d2	\N	not_applicable	\N	\N	\N	1	f	\N	2025-12-05 08:02:56.146586	2025-12-05 08:02:56.146586
3ef5d86e-5a7b-41a8-ac1f-5a2892c13d87	e40a782a-a26d-423e-8a17-5488f9cdfb88	physical	d4da49a2-99df-4201-bb0c-db2608621f03	\N	not_implemented	\N	\N	\N	1	f	\N	2025-12-05 08:02:56.147118	2025-12-05 08:02:56.147118
d131ddaf-84aa-4929-a378-403375ea2f88	e40a782a-a26d-423e-8a17-5488f9cdfb88	information	25d1df3f-1d40-4484-9628-b09b71caf84e	\N	planned	\N	\N	\N	5	f	\N	2025-12-05 08:02:56.14752	2025-12-05 08:02:56.14752
dd2ec14b-560b-4dc1-8f1b-390b8d529e3d	e40a782a-a26d-423e-8a17-5488f9cdfb88	application	cb6f1d3c-18ff-44c9-9652-8b9158267a19	\N	in_progress	\N	\N	\N	3	f	\N	2025-12-05 08:02:56.147923	2025-12-05 08:02:56.147923
868d836c-cf1e-45e2-91df-cc8d7878ac27	e40a782a-a26d-423e-8a17-5488f9cdfb88	software	1f43b5fa-dd20-438b-a4eb-6023ad1ccf19	\N	implemented	\N	\N	\N	5	f	\N	2025-12-05 08:02:56.14824	2025-12-05 08:02:56.14824
8aba29d8-7d60-48ea-9cfc-1f2baa9fe1dd	e40a782a-a26d-423e-8a17-5488f9cdfb88	supplier	2dc919b5-d7d6-46be-a4da-1df9566beb67	\N	not_applicable	\N	\N	\N	5	f	\N	2025-12-05 08:02:56.148644	2025-12-05 08:02:56.148644
1c96395f-9a63-4b31-a481-39a3021202f0	4f26dfa5-2e88-4160-9741-e8d4753fd703	physical	ea6f6522-28ab-4be0-880c-f9de5a4c57ec	\N	not_implemented	\N	\N	\N	4	f	\N	2025-12-05 08:02:56.148997	2025-12-05 08:02:56.148997
28649b4c-6a6e-4979-9b0b-edf44418e904	4f26dfa5-2e88-4160-9741-e8d4753fd703	information	d4684303-f3da-42de-a919-9c034120e6a8	\N	planned	\N	\N	\N	2	f	\N	2025-12-05 08:02:56.149694	2025-12-05 08:02:56.149694
3e56fce1-8a61-4d31-8790-1c9c739688b2	4f26dfa5-2e88-4160-9741-e8d4753fd703	application	0743e6e9-bb1c-4fdf-a9b8-a3579ad20822	\N	in_progress	\N	\N	\N	5	f	\N	2025-12-05 08:02:56.150146	2025-12-05 08:02:56.150146
dc31ca45-390d-42c7-a666-eaa261977806	4f26dfa5-2e88-4160-9741-e8d4753fd703	software	64126ae5-7955-4a80-a64a-9e20e7cb5177	\N	implemented	\N	\N	\N	2	f	\N	2025-12-05 08:02:56.150435	2025-12-05 08:02:56.150435
343d3de7-900b-423d-bff3-bd9c9bb05b92	4f26dfa5-2e88-4160-9741-e8d4753fd703	supplier	82611626-a0a2-4beb-9495-651e0fb42534	\N	not_applicable	\N	\N	\N	1	f	\N	2025-12-05 08:02:56.150795	2025-12-05 08:02:56.150795
c2132e76-5975-47a5-a8e7-ba29e9013ab4	99df57a6-1efc-4693-bd96-222a0e1d72bb	physical	ea0bd2ad-732b-4b98-a3f3-19cf2fa899e1	\N	not_implemented	\N	\N	\N	2	f	\N	2025-12-05 08:02:56.151485	2025-12-05 08:02:56.151485
d2a4110f-482a-46a4-aa14-33f97e468a7c	99df57a6-1efc-4693-bd96-222a0e1d72bb	information	93721587-6a6b-43d1-917b-15dcbaf9e8e2	\N	planned	\N	\N	\N	3	f	\N	2025-12-05 08:02:56.152024	2025-12-05 08:02:56.152024
f3db6881-e632-4b04-a506-bc3e538360c8	99df57a6-1efc-4693-bd96-222a0e1d72bb	application	2962196a-2521-4d93-b48c-d46b5c61b295	\N	in_progress	\N	\N	\N	4	f	\N	2025-12-05 08:02:56.152819	2025-12-05 08:02:56.152819
6e7234be-7504-4fc5-bdd5-28f4759a7012	99df57a6-1efc-4693-bd96-222a0e1d72bb	software	21259081-5936-4b85-9ab2-7c751c46d2ba	\N	implemented	\N	\N	\N	3	f	\N	2025-12-05 08:02:56.153339	2025-12-05 08:02:56.153339
44b07a73-4937-4045-b036-efe238b2a6f2	99df57a6-1efc-4693-bd96-222a0e1d72bb	supplier	ee09463b-d0f9-47e5-9eb9-42748c2b84ae	\N	not_applicable	\N	\N	\N	5	f	\N	2025-12-05 08:02:56.153866	2025-12-05 08:02:56.153866
75b50132-4ab9-4a24-b92a-416625be7e9e	05e9dc0a-3415-4ff4-8531-04cf9bd95794	physical	fc3fa203-1d0c-4d8c-b9ec-4924adf4e7c7	\N	not_implemented	\N	\N	\N	\N	f	\N	2025-12-05 19:41:49.429309	2025-12-05 19:41:49.429309
\.


--
-- Data for Name: control_dependencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.control_dependencies (id, source_control_id, target_control_id, relationship_type, description, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: control_objectives; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.control_objectives (id, objective_identifier, policy_id, statement, rationale, domain, priority, mandatory, responsible_party_id, implementation_status, target_implementation_date, actual_implementation_date, linked_influencers, display_order, created_by, created_at, updated_by, updated_at, deleted_at) FROM stdin;
c426c483-e4e6-44e7-8662-53d63fb8cbc4	CO-IS-001	8fb03509-e748-4789-83c6-2c397cf1bdf3	Ensure all information assets are classified and protected according to their classification level	Proper classification enables appropriate security controls	Information Security	high	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	implemented	2025-06-06	2025-06-11	{f5f75141-2e48-4988-b85a-6a8e5f7e9966}	1	\N	2025-12-03 09:42:25.442973	\N	2025-12-03 09:42:25.442973	\N
4b45b393-d744-4b23-a424-70948d1fd2c3	CO-IS-002	8fb03509-e748-4789-83c6-2c397cf1bdf3	Implement encryption for data at rest and in transit	Encryption protects data confidentiality	Information Security	high	t	b1b35a04-894c-4b77-b209-8d79bee05ec9	implemented	2025-08-05	2025-08-10	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	2	\N	2025-12-03 09:42:25.442973	\N	2025-12-03 09:42:25.442973	\N
9b3c97de-637b-4a5a-86e7-249c3c79b2eb	CO-AC-001	41e1675f-d1b0-4884-b324-6e88a66a306a	Implement role-based access control (RBAC) for all systems	RBAC ensures users have appropriate access based on their roles	Access Control	high	t	b1b35a04-894c-4b77-b209-8d79bee05ec9	implemented	2025-05-17	2025-05-22	{f716f9c4-e558-453b-ba53-41b3c8d225e0,e851d527-3f07-4201-98d0-602a3b5f6572}	1	\N	2025-12-03 09:42:25.442973	\N	2025-12-03 09:42:25.442973	\N
6ba877d3-841d-4132-9850-08d28517758c	CO-AC-002	41e1675f-d1b0-4884-b324-6e88a66a306a	Conduct quarterly access reviews for all privileged accounts	Regular reviews ensure access remains appropriate	Access Control	medium	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	in_progress	2026-01-02	\N	{e851d527-3f07-4201-98d0-602a3b5f6572}	2	\N	2025-12-03 09:42:25.442973	\N	2025-12-03 09:42:25.442973	\N
df673401-2bdc-45b1-963c-21bad60bd0f0	CO-PM-001	2eb6f7bc-7cd4-4079-97ab-7ef6fe6e5d4e	Enforce strong password requirements (minimum 12 characters, complexity)	Strong passwords reduce risk of unauthorized access	Authentication	high	t	b1b35a04-894c-4b77-b209-8d79bee05ec9	implemented	2025-10-04	2025-10-09	{f716f9c4-e558-453b-ba53-41b3c8d225e0}	1	\N	2025-12-03 09:42:25.442973	\N	2025-12-03 09:42:25.442973	\N
59a7c200-967f-4c53-a8da-d23ba79a92d2	CO-PM-002	2eb6f7bc-7cd4-4079-97ab-7ef6fe6e5d4e	Implement multi-factor authentication (MFA) for all privileged accounts	MFA provides additional security layer beyond passwords	Authentication	high	t	b1b35a04-894c-4b77-b209-8d79bee05ec9	in_progress	2026-02-01	\N	{f716f9c4-e558-453b-ba53-41b3c8d225e0,e851d527-3f07-4201-98d0-602a3b5f6572}	2	\N	2025-12-03 09:42:25.442973	\N	2025-12-03 09:42:25.442973	\N
\.


--
-- Data for Name: distribution_list_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.distribution_list_users (distribution_list_id, user_id) FROM stdin;
\.


--
-- Data for Name: email_distribution_lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_distribution_lists (id, name, description, email_addresses, is_active, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: evidence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evidence (id, evidence_identifier, title, description, evidence_type, filename, file_path, file_size, mime_type, file_hash, collection_date, valid_from_date, valid_until_date, collector_id, status, approved_by, approval_date, rejection_reason, tags, custom_metadata, confidential, restricted_to_roles, created_by, created_at, updated_at, deleted_at) FROM stdin;
5eac004a-d384-4b49-af57-834398706650	EVID-2024-001	MFA Configuration Screenshot	Screenshot showing MFA configuration for privileged accounts	configuration_screenshot	mfa-config-2024-01.png	/uploads/evidence/mfa-config-2024-01.png	245760	image/png	\N	2025-11-08	\N	2026-11-03	b5525c73-c26a-48d4-a90a-582fa451e518	approved	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-13	\N	{mfa,configuration,iam}	\N	f	\N	\N	2025-12-03 09:51:31.087369	2025-12-03 09:51:31.087369	\N
d7f30d36-8a02-41f3-b17c-b5543f7d6ec5	EVID-2024-002	Encryption Key Management Policy	Documentation of encryption key management procedures	policy_document	encryption-key-mgmt-policy.pdf	/uploads/evidence/encryption-key-mgmt-policy.pdf	524288	application/pdf	\N	2025-10-14	\N	2026-10-14	01180d49-d38b-4421-a130-b1ce4b7c34fa	approved	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-10-19	\N	{encryption,key-management,policy}	\N	t	\N	\N	2025-12-03 09:51:31.087369	2025-12-03 09:51:31.087369	\N
4b1b8197-4c5d-4a9a-b7ab-5905ce251fa4	EVID-2024-003	Access Review Report - Q1 2024	Quarterly access review report showing RBAC compliance	scan_report	access-review-q1-2024.pdf	/uploads/evidence/access-review-q1-2024.pdf	1048576	application/pdf	\N	2025-11-23	\N	2026-02-21	01180d49-d38b-4421-a130-b1ce4b7c34fa	approved	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-28	\N	{access-review,rbac,quarterly}	\N	f	\N	\N	2025-12-03 09:51:31.087369	2025-12-03 09:51:31.087369	\N
1b01928a-0c34-4904-a3ab-120be12e0877	TEST-EVID-001	Test Evidence	Updated test evidence description	other	\N	/uploads/test.pdf	\N	\N	\N	2025-12-03	\N	\N	\N	draft	\N	\N	\N	\N	\N	f	\N	\N	2025-12-03 10:57:14.427471	2025-12-03 10:57:14.471376	2025-12-03 10:57:14.471376
ba646500-72df-4047-8476-2cc3268b670f	TEST-EVID-1764759497	Test Evidence 1764759497	Updated test evidence description	other	\N	/uploads/test-1764759497.pdf	\N	\N	\N	2025-12-03	\N	\N	\N	draft	\N	\N	\N	\N	\N	f	\N	\N	2025-12-03 10:58:17.682905	2025-12-03 10:58:17.750096	2025-12-03 10:58:17.750096
e7d940f9-406e-4f66-95c6-1f29a16cbc78	EVID-1765639773243	E2E Test Evidence 1765639773243	Test evidence description for E2E testing	policy_document	test-evidence-1765639788311.pdf	/uploads/evidence/test-1765639788088.pdf	\N	\N	\N	2025-12-13	2025-12-13	2026-12-13	\N	draft	\N	\N	\N	\N	\N	f	\N	\N	2025-12-13 15:29:49.538277	2025-12-13 15:29:49.538277	\N
63e76c2a-0920-4bef-bfa6-ab09bdc122cb	EVID-1765639934287	E2E Test Evidence 1765639934287	Test evidence description for E2E testing	policy_document	test-evidence-1765639937955.pdf	/uploads/evidence/test-1765639937734.pdf	\N	\N	\N	2025-12-13	2025-12-13	2026-12-13	\N	draft	\N	\N	\N	\N	\N	f	\N	\N	2025-12-13 15:32:19.072904	2025-12-13 15:32:19.072904	\N
9ca12acb-ffe0-48a2-a1c2-61964bf9029c	EVID-1765644196512	E2E Test Evidence 1765644196512	Test evidence description for E2E testing	policy_document	test-evidence-1765644201848.pdf	/uploads/evidence/test-1765644201626.pdf	\N	\N	\N	2025-12-13	2025-12-13	2026-12-13	\N	draft	\N	\N	\N	\N	\N	f	\N	\N	2025-12-13 16:43:22.981393	2025-12-13 16:43:22.981393	\N
c8101a41-81c5-43b2-a8d8-3ef572663501	EVID-1765644251501	E2E Test Evidence 1765644251501	Test evidence description for E2E testing	policy_document	test-evidence-1765644260395.pdf	/uploads/evidence/test-1765644260167.pdf	\N	\N	\N	2025-12-13	2025-12-13	2026-12-13	\N	draft	\N	\N	\N	\N	\N	f	\N	\N	2025-12-13 16:44:21.729764	2025-12-13 16:44:21.729764	\N
cdbcef6b-b2ee-4417-bb52-d20ede741477	EVID-1765644327631	E2E Test Evidence 1765644327631	Test evidence description for E2E testing	policy_document	test-evidence-1765644343914.pdf	/uploads/evidence/test-1765644343687.pdf	\N	\N	\N	2025-12-13	2025-12-13	2026-12-13	\N	draft	\N	\N	\N	\N	\N	f	\N	\N	2025-12-13 16:45:44.964656	2025-12-13 16:45:44.964656	\N
\.


--
-- Data for Name: evidence_linkages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evidence_linkages (id, evidence_id, link_type, linked_entity_id, link_description, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: findings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.findings (id, finding_identifier, assessment_id, assessment_result_id, source_type, source_name, unified_control_id, asset_type, asset_id, title, description, severity, finding_date, status, remediation_owner_id, remediation_plan, remediation_due_date, remediation_completed_date, remediation_evidence, risk_accepted_by, risk_acceptance_justification, risk_acceptance_date, risk_acceptance_expiry, retest_required, retest_date, retest_result, tags, created_by, created_at, updated_by, updated_at, deleted_at) FROM stdin;
bf1b1b07-9058-485a-9bc6-7817b21b3ed4	FIND-2024-001	0394f18b-7355-40ca-9865-2dfbd72c98a3	2d05cfa6-632d-4b00-9977-ca71f13d4d6c	\N	\N	ccc179a0-95c4-4d0b-9073-fd5321875893	\N	\N	MFA not fully implemented for all privileged accounts	During the assessment, it was discovered that MFA is not fully implemented for all privileged accounts. Some legacy systems still use password-only authentication, which poses a security risk.	high	2025-11-13	open	b1b35a04-894c-4b77-b209-8d79bee05ec9	Complete MFA rollout for all privileged accounts within 60 days. Prioritize critical systems first, then migrate legacy systems.	2026-02-01	\N	\N	\N	\N	\N	\N	t	\N	\N	{mfa,authentication,privileged-access}	\N	2025-12-03 10:53:41.876538	\N	2025-12-03 10:53:41.876538	\N
b0f46052-1742-454b-80a2-742755f8dba8	FIND-2024-002	0394f18b-7355-40ca-9865-2dfbd72c98a3	\N	\N	\N	4f26dfa5-2e88-4160-9741-e8d4753fd703	\N	\N	Encryption key rotation not documented	While encryption is properly implemented, the key rotation procedures are not fully documented. This could lead to compliance issues during audits.	medium	2025-11-18	in_progress	01180d49-d38b-4421-a130-b1ce4b7c34fa	Document encryption key rotation procedures and schedule. Ensure all key management activities are logged.	2026-01-02	\N	\N	\N	\N	\N	\N	f	\N	\N	{encryption,key-management,documentation}	\N	2025-12-03 10:53:41.876538	\N	2025-12-03 10:53:41.876538	\N
700d18a1-ce95-4c1e-a9db-67a5b8ad05ef	FIND-2024-003	0394f18b-7355-40ca-9865-2dfbd72c98a3	\N	\N	\N	b5ee8b21-32b5-49ce-9214-4a23ec0cd419	\N	\N	Access review process needs automation	Access reviews are being conducted manually, which is time-consuming and error-prone. Automation would improve efficiency and accuracy.	low	2025-11-23	open	b1b35a04-894c-4b77-b209-8d79bee05ec9	Implement automated access review system. Set up quarterly automated reviews with approval workflow.	2026-03-03	\N	\N	\N	\N	\N	\N	f	\N	\N	{access-review,automation,rbac}	\N	2025-12-03 10:53:41.876538	\N	2025-12-03 10:53:41.876538	\N
1db1132d-1260-4903-8eef-38a6bb769f1b	TEST-FIND-001	\N	\N	\N	\N	\N	\N	\N	Test Finding	Updated test finding description	medium	2025-12-03	open	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2025-12-03 10:57:14.485267	\N	2025-12-03 10:57:14.544147	2025-12-03 10:57:14.544147
49fd0d4b-fc0a-45e9-97e5-f05fedc85e3e	TEST-FIND-1764759497	\N	\N	\N	\N	\N	\N	\N	Test Finding 1764759497	Updated test finding description	medium	2025-12-03	open	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2025-12-03 10:58:17.77509	\N	2025-12-03 10:58:17.856848	2025-12-03 10:58:17.856848
23148b2a-bd8d-4c7e-b70e-cb060c32a0ef	FIND-1765643966743	\N	\N	\N	\N	\N	\N	\N	E2E Test Finding 1765643966743	Test finding description for E2E testing. This is a detailed description of the finding.	medium	2025-12-13	open	\N	Test remediation plan for E2E testing	2026-01-12	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2025-12-13 16:39:51.717343	\N	2025-12-13 16:39:51.717343	\N
2ddc2e78-0ddf-4f42-8acd-7fbea904fc9f	FIND-1765644094608	\N	\N	\N	\N	\N	\N	\N	E2E Test Finding 1765644094608	Test finding description for E2E testing. This is a detailed description of the finding.	medium	2025-12-13	open	\N	Test remediation plan for E2E testing	2026-01-12	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2025-12-13 16:41:46.851138	\N	2025-12-13 16:41:46.851138	\N
358db419-58f5-4862-9a2a-c44b46e4db59	FIND-1765644201026	\N	\N	\N	\N	\N	\N	\N	E2E Test Finding 1765644201026	Test finding description for E2E testing. This is a detailed description of the finding.	medium	2025-12-13	open	\N	Test remediation plan for E2E testing	2026-01-12	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2025-12-13 16:43:25.380047	\N	2025-12-13 16:43:25.380047	\N
278d9ecc-3147-459e-8dc7-99301791cc63	FIND-1765644260176	\N	\N	\N	\N	\N	\N	\N	E2E Test Finding 1765644260176	Test finding description for E2E testing. This is a detailed description of the finding.	medium	2025-12-13	open	\N	Test remediation plan for E2E testing	2026-01-12	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2025-12-13 16:44:25.339768	\N	2025-12-13 16:44:25.339768	\N
087bd99e-316a-4519-9aff-8887260e2f77	FIND-1765644345136	\N	\N	\N	\N	\N	\N	\N	E2E Test Finding 1765644345136	Test finding description for E2E testing. This is a detailed description of the finding.	medium	2025-12-13	open	\N	Test remediation plan for E2E testing	2026-01-12	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	2025-12-13 16:45:49.50785	\N	2025-12-13 16:45:49.50785	\N
\.


--
-- Data for Name: framework_control_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.framework_control_mappings (id, framework_requirement_id, unified_control_id, coverage_level, mapping_notes, mapped_by, mapped_at, created_at) FROM stdin;
\.


--
-- Data for Name: framework_requirements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.framework_requirements (id, framework_id, requirement_identifier, requirement_text, domain, category, sub_category, priority, requirement_type, display_order, notes, reference_links, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: governance_metric_snapshots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.governance_metric_snapshots (id, snapshot_date, compliance_rate, implemented_controls, total_controls, open_findings, critical_findings, assessment_completion_rate, risk_closure_rate, completed_assessments, total_assessments, approved_evidence, metadata, created_at, updated_at) FROM stdin;
b4e2a508-c893-4f40-b09f-cb917ed97545	2025-11-04	55	20	50	30	6	0	0	0	10	20	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
2d167f7d-9db7-488a-a5bc-7b45b16adf4f	2025-11-05	55.8	21	50	29	6	0	2.3	0	10	21	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
3b26f8a0-4608-4f66-be13-924ef14e4f22	2025-11-06	56.7	21	50	29	6	10	4.7	1	10	22	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
663de4a9-ea68-4e59-b255-4fd0f8773c6a	2025-11-07	57.5	22	50	28	6	10	7	1	10	23	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
e57b7218-95b9-4f18-a64b-d5d6e7861ef2	2025-11-08	58.3	23	50	27	5	10	9.3	1	10	24	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
36d9e9cd-d7e4-446f-9a12-56ee7baaf9c0	2025-11-09	59.2	23	50	27	5	20	11.7	2	10	25	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
885b091e-1fcd-4d15-9f25-a83dd68ce3da	2025-11-10	60	24	50	26	5	20	14	2	10	26	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
5031a787-fbf4-4fdd-aa45-08597468c99b	2025-11-11	60.8	25	50	25	5	20	16.3	2	10	27	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
95282993-b6cc-4e18-aa11-ad80bd29e673	2025-11-12	61.7	25	50	24	5	20	18.7	2	10	28	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
51092ec0-01af-4daf-b50e-524da5f0c2a0	2025-11-13	62.5	26	50	24	5	30	21	3	10	29	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.344Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
c66f9f5c-8664-4530-be9a-d8c4c086237d	2025-11-14	63.3	27	50	23	5	30	23.3	3	10	30	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
b4b5848d-1add-4f38-b0c6-7169e30303c5	2025-11-15	64.2	27	50	22	4	30	25.7	3	10	31	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
ec3db06d-32d0-415e-aa26-8c2cbc5cd7bc	2025-11-16	65	28	50	22	4	40	28	4	10	32	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
7a0eab42-9849-440e-80f9-65aefda170f3	2025-11-17	65.8	29	50	21	4	40	30.3	4	10	33	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
a57882b6-1140-4038-9d0c-8dcbd5926c6b	2025-11-18	66.7	29	50	20	4	40	32.7	4	10	34	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
69010313-5c45-499d-abe2-cb417ca32053	2025-11-19	67.5	30	50	20	4	50	35	5	10	35	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
2bbf9618-e49f-4600-af50-cfef62270729	2025-11-20	68.3	31	50	19	4	50	37.3	5	10	36	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
86be4528-1d23-4196-a76a-c596393181b9	2025-11-21	69.2	31	50	18	4	50	39.7	5	10	37	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
4b660093-a2f3-43b6-8151-1ad26ce633c5	2025-11-22	70	32	50	17	3	50	42	5	10	38	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
0e254229-6db8-4ff1-aafd-2b3226d8a02f	2025-11-23	70.8	33	50	17	3	60	44.3	6	10	39	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
97d848a8-7433-4cf0-8a76-e5db1b3647e0	2025-11-24	71.7	33	50	16	3	60	46.7	6	10	40	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
54b66ca8-0a53-42e7-a7b7-3c5d32cd2748	2025-11-25	72.5	34	50	15	3	60	49	6	10	41	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
421b4d02-720a-4f94-a470-278c9f563761	2025-11-26	73.3	35	50	15	3	70	51.3	7	10	42	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
704ff052-e9c8-4e8d-93f9-399510981ece	2025-11-27	74.2	35	50	14	3	70	53.7	7	10	43	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
7272bda6-fbec-449c-af84-ce9fa611788e	2025-11-28	75	36	50	13	3	70	56	7	10	44	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
a305e622-4aaa-4d91-9f2f-5e65caa9f184	2025-11-29	75.8	37	50	12	2	80	58.3	8	10	45	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
18a4dd27-8b16-488d-bf2d-c514e11b24bb	2025-11-30	76.7	37	50	12	2	80	60.7	8	10	46	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
68fb2825-3782-4ed9-a7e0-f4c6290395f3	2025-12-01	77.5	38	50	11	2	80	63	8	10	47	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
23149179-d476-44fe-9348-1a8b57a508e9	2025-12-02	78.3	39	50	10	2	80	65.3	8	10	48	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
92b93cd1-322b-447f-af09-be1bca7ce41c	2025-12-03	79.2	39	50	10	2	90	67.7	9	10	49	{"seeded": true, "comment": "Baseline historical data for trend chart", "seedDate": "2025-12-04T19:48:02.345Z"}	2025-12-04 19:48:02.346054	2025-12-04 19:48:02.346054
ef0ac5fe-0a4e-4472-b7cc-8482d93347b7	2025-12-04	55.6	5	9	2	0	33.3	33.3	1	3	3	{"timestamp": "2025-12-04T20:46:11.878Z", "policiesUnderReview": 1}	2025-12-04 19:48:02.346054	2025-12-04 20:46:11.889669
12dcf076-f74e-4eae-8038-a2011886649d	2025-12-05	55.6	5	9	2	0	33.3	33.3	1	3	3	{"timestamp": "2025-12-05T19:25:08.947Z", "policiesUnderReview": 1}	2025-12-05 19:03:57.379382	2025-12-05 19:25:08.949878
c33db746-2bd5-437e-8e3e-8e76a36c1b92	2025-12-06	55.6	5	9	2	0	33.3	33.3	1	3	3	{"timestamp": "2025-12-06T20:16:27.276Z", "policiesUnderReview": 1}	2025-12-06 10:44:46.627027	2025-12-06 20:16:27.285283
08716a9a-f607-4743-a9b7-7ec3ae40efb6	2025-12-08	55.6	5	9	2	0	33.3	33.3	1	3	3	{"timestamp": "2025-12-08T10:31:28.800Z", "policiesUnderReview": 1}	2025-12-08 10:31:28.808158	2025-12-08 10:31:28.808158
1c781baa-c6d3-4101-a5d7-94bcb6771ede	2025-12-11	55.6	5	9	2	0	33.3	33.3	1	3	3	{"timestamp": "2025-12-11T20:07:31.735Z", "policiesUnderReview": 1}	2025-12-11 20:07:31.74431	2025-12-11 20:07:31.74431
1e2a0037-2a61-4566-a1b5-848ba0c7582d	2025-12-12	55.6	5	9	2	0	33.3	33.3	1	3	3	{"timestamp": "2025-12-12T14:02:41.543Z", "policiesUnderReview": 1}	2025-12-12 14:02:41.550057	2025-12-12 14:02:41.550057
bf116482-0ba4-44cc-84ca-df007e0b573b	2025-12-15	31.3	5	16	7	0	14.3	12.5	1	7	3	{"timestamp": "2025-12-15T09:42:26.623Z", "policiesUnderReview": 1}	2025-12-15 09:42:26.628975	2025-12-15 09:42:26.628975
a6b3e632-1f60-4dc8-b9ad-b9af7ea89e69	2025-12-18	31.3	5	16	7	0	14.3	12.5	1	7	3	{"timestamp": "2025-12-18T17:49:45.590Z", "policiesUnderReview": 1}	2025-12-18 17:31:50.927585	2025-12-18 17:49:45.599069
\.


--
-- Data for Name: import_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.import_logs (id, "fileName", "fileType", "assetType", status, "totalRecords", "successfulImports", "failedImports", "errorReport", "fieldMapping", "importedById", notes, "createdAt", "completedAt", imported_by_id) FROM stdin;
161564e3-bbee-4d63-abb8-a3f28a114fe8	sample-physical-assets-import.csv	csv	physical	completed	10	10	0	[]	{"Room": "room", "Floor": "floor", "Model": "model", "Notes": "notes", "Vendor": "vendor", "Building": "building", "Location": "location", "Asset Type": "assetType", "Department": "department", "Contains PHI": "containsPHI", "Contains PII": "containsPII", "IP Addresses": "ipAddresses", "Manufacturer": "manufacturer", "Business Unit": "businessUnit", "MAC Addresses": "macAddresses", "Purchase Date": "purchaseDate", "Serial Number": "serialNumber", "Asset Description": "assetDescription", "Criticality Level": "criticalityLevel", "Unique Identifier": "uniqueIdentifier", "Connectivity Status": "connectivityStatus", "Data Classification": "dataClassification", "Warranty Expiry Date": "warrantyExpiryDate", "Contains Financial Data": "containsFinancialData"}	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.216904	2025-12-02 11:34:35.292	\N
79838390-cbe3-4aaf-8480-454f915e6efc	sample-physical-assets-import.csv	csv	physical	failed	10	0	10	[{"row":2,"errors":["Asset with identifier PHY-SRV-001 already exists"]},{"row":3,"errors":["Asset with identifier PHY-WS-001 already exists"]},{"row":4,"errors":["Asset with identifier PHY-NET-001 already exists"]},{"row":5,"errors":["Asset with identifier PHY-MOB-001 already exists"]},{"row":6,"errors":["Asset with identifier PHY-IOT-001 already exists"]},{"row":7,"errors":["Asset with identifier PHY-PRT-001 already exists"]},{"row":8,"errors":["Asset with identifier PHY-STR-001 already exists"]},{"row":9,"errors":["Asset with identifier PHY-WS-002 already exists"]},{"row":10,"errors":["Asset with identifier PHY-NET-002 already exists"]},{"row":11,"errors":["Asset with identifier PHY-SRV-002 already exists"]}]	{"Room": "room", "Floor": "floor", "Model": "model", "Notes": "notes", "Vendor": "vendor", "Building": "building", "Location": "location", "Asset Type": "assetType", "Department": "department", "Contains PHI": "containsPHI", "Contains PII": "containsPII", "IP Addresses": "ipAddresses", "Manufacturer": "manufacturer", "Business Unit": "businessUnit", "MAC Addresses": "macAddresses", "Purchase Date": "purchaseDate", "Serial Number": "serialNumber", "Asset Description": "assetDescription", "Criticality Level": "criticalityLevel", "Unique Identifier": "uniqueIdentifier", "Connectivity Status": "connectivityStatus", "Data Classification": "dataClassification", "Warranty Expiry Date": "warrantyExpiryDate", "Contains Financial Data": "containsFinancialData"}	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:34:35.308877	2025-12-02 11:34:35.317	\N
f8b1de9b-6348-49ae-9e03-b95b37eab2c3	sample-physical-assets-import-new.csv	csv	physical	completed	10	10	0	[]	{"Room": "room", "Floor": "floor", "Model": "model", "Notes": "notes", "Vendor": "vendor", "Building": "building", "Location": "location", "Asset Type": "assetType", "Department": "department", "Contains PHI": "containsPHI", "Contains PII": "containsPII", "IP Addresses": "ipAddresses", "Manufacturer": "manufacturer", "Business Unit": "businessUnit", "MAC Addresses": "macAddresses", "Purchase Date": "purchaseDate", "Serial Number": "serialNumber", "Asset Description": "assetDescription", "Criticality Level": "criticalityLevel", "Connectivity Status": "connectivityStatus", "Data Classification": "dataClassification", "Warranty Expiry Date": "warrantyExpiryDate", "Contains Financial Data": "containsFinancialData"}	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-02 11:42:57.943653	2025-12-02 11:42:58.015	\N
458e4a6b-28d5-4f49-a017-a08a62bda848	sample-information-import-template.xlsx	excel	information	failed	3	0	3	[{"row":2,"errors":["null value in column \\"unique_identifier\\" of relation \\"information_assets\\" violates not-null constraint"]},{"row":3,"errors":["null value in column \\"unique_identifier\\" of relation \\"information_assets\\" violates not-null constraint"]},{"row":4,"errors":["null value in column \\"unique_identifier\\" of relation \\"information_assets\\" violates not-null constraint"]}]	{"Name": "name", "Description": "description", "Asset Location": "assetLocation", "Storage Medium": "storageMedium", "Business Unit ID": "businessUnitId", "Information Type": "informationType", "Retention Period": "retentionPeriod", "Asset Custodian ID": "assetCustodianId", "Classification Date": "classificationDate", "Classification Level": "classificationLevel", "Information Owner ID": "informationOwnerId", "Compliance Requirements": "complianceRequirements"}	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:37:49.025301	2025-12-10 20:37:49.07	\N
0253f278-3d89-4e19-9639-3a4cfb35477d	sample-information-import-template.xlsx	excel	information	completed	3	3	0	[]	{"Name": "name", "Description": "description", "Asset Location": "assetLocation", "Storage Medium": "storageMedium", "Business Unit ID": "businessUnitId", "Information Type": "informationType", "Retention Period": "retentionPeriod", "Asset Custodian ID": "assetCustodianId", "Classification Date": "classificationDate", "Classification Level": "classificationLevel", "Information Owner ID": "informationOwnerId", "Compliance Requirements": "complianceRequirements"}	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:45:02.675959	2025-12-10 20:45:02.732	\N
4c57a66f-0525-4f08-98b8-0534225685cb	sample-application-import-template.xlsx	excel	application	completed	3	3	0	[]	{"Owner ID": "ownerId", "Access URL": "accessUrl", "Patch Level": "patchLevel", "Vendor Name": "vendorName", "Hosting Type": "hostingType", "License Type": "licenseType", "License Count": "licenseCount", "Data Processed": "dataProcessed", "License Expiry": "licenseExpiry", "Vendor Contact": "vendorContact", "Version Number": "versionNumber", "Application Name": "applicationName", "Application Type": "applicationType", "Business Purpose": "businessPurpose", "Business Unit ID": "businessUnitId", "Hosting Location": "hostingLocation", "Criticality Level": "criticalityLevel", "Data Classification": "dataClassification", "Authentication Method": "authenticationMethod", "Compliance Requirements": "complianceRequirements", "Last Security Test Date": "lastSecurityTestDate"}	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:51:44.528845	2025-12-10 20:51:44.6	\N
fc79bd63-4ab3-46f3-9c71-fb95d6cc8a0e	sample-software-import-template.xlsx	excel	software	completed	3	3	0	[]	{"Owner ID": "ownerId", "License Key": "licenseKey", "Patch Level": "patchLevel", "Vendor Name": "vendorName", "License Type": "licenseType", "License Count": "licenseCount", "Software Name": "softwareName", "Software Type": "softwareType", "License Expiry": "licenseExpiry", "Vendor Contact": "vendorContact", "Version Number": "versionNumber", "Business Purpose": "businessPurpose", "Business Unit ID": "businessUnitId", "Support End Date": "supportEndDate", "Installation Count": "installationCount", "Last Security Test Date": "lastSecurityTestDate"}	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:52:06.779139	2025-12-10 20:52:06.829	\N
755af99c-2a7d-41f1-954b-65d2212b3be5	sample-supplier-import-template.xlsx	excel	supplier	completed	3	3	0	[]	{"Tax ID": "taxId", "Address": "address", "Country": "country", "Website": "website", "Currency": "currency", "Owner ID": "ownerId", "Risk Level": "riskLevel", "Auto Renewal": "autoRenewal", "Supplier Name": "supplierName", "Supplier Type": "supplierType", "Contract Value": "contractValue", "Primary Contact": "primaryContact", "Business Purpose": "businessPurpose", "Business Unit ID": "businessUnitId", "Last Review Date": "lastReviewDate", "Contract End Date": "contractEndDate", "Criticality Level": "criticalityLevel", "Secondary Contact": "secondaryContact", "Unique Identifier": "uniqueIdentifier", "Contract Reference": "contractReference", "Insurance Verified": "insuranceVerified", "Performance Rating": "performanceRating", "Contract Start Date": "contractStartDate", "Goods/Services Type": "goodsServicesType", "Registration Number": "registrationNumber", "Risk Assessment Date": "riskAssessmentDate", "Background Check Date": "backgroundCheckDate", "Compliance Certifications": "complianceCertifications"}	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 20:58:33.302934	2025-12-10 20:58:33.342	\N
5b050e27-9cc2-4aff-a473-d7dad85b322a	sample-physical-import-template.xlsx	excel	physical	partial	3	2	1	[{"row":2,"errors":["Asset with identifier SRV-PROD-001 already exists"]}]	{"Model": "model", "Asset Tag": "assetTag", "IP Addresses": "ipAddresses", "Manufacturer": "manufacturer", "MAC Addresses": "macAddresses", "Purchase Date": "purchaseDate", "Serial Number": "serialNumber", "Owner ID (UUID)": "ownerId", "Warranty Expiry": "warrantyExpiry", "Business Purpose": "businessPurpose", "Asset Description": "assetDescription", "Criticality Level": "criticalityLevel", "Physical Location": "physicalLocation", "Unique Identifier": "uniqueIdentifier", "Installed Software": "installedSoftware", "Connectivity Status": "connectivityStatus", "Asset Type ID (UUID)": "assetTypeId", "Active Ports/Services": "activePortsServices", "Security Test Results": "securityTestResults", "Business Unit ID (UUID)": "businessUnitId", "Compliance Requirements": "complianceRequirements", "Last Connectivity Check": "lastConnectivityCheck", "Network Approval Status": "networkApprovalStatus"}	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 21:29:41.681211	2025-12-10 21:29:41.76	\N
\.


--
-- Data for Name: influencers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.influencers (id, name, category, sub_category, issuing_authority, jurisdiction, reference_number, description, publication_date, effective_date, last_revision_date, next_review_date, status, applicability_status, applicability_justification, applicability_assessment_date, applicability_criteria, source_url, source_document_path, owner_id, business_units_affected, tags, custom_fields, created_by, created_at, updated_by, updated_at, deleted_at) FROM stdin;
f716f9c4-e558-453b-ba53-41b3c8d225e0	NCA Cybersecurity Framework	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	NCA-CSF-2023	National Cybersecurity Authority Cybersecurity Framework for critical infrastructure protection.	2023-01-15	2023-03-01	2023-01-15	2024-12-31	active	applicable	Organization operates critical infrastructure in Saudi Arabia	\N	\N	https://nca.gov.sa/frameworks	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	{cybersecurity,critical-infrastructure,saudi-arabia}	\N	\N	2025-12-03 09:12:53.880214	\N	2025-12-03 09:12:53.880214	\N
e851d527-3f07-4201-98d0-602a3b5f6572	SAMA Cybersecurity Framework	regulatory	Financial Services	Saudi Arabian Monetary Authority	Saudi Arabia	SAMA-CSF-2022	SAMA Cybersecurity Framework for financial institutions operating in Saudi Arabia.	2022-06-01	2022-09-01	2022-06-01	2024-12-31	active	applicable	Organization is a financial services provider	\N	\N	https://sama.gov.sa/cybersecurity	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	{cybersecurity,financial-services,sama}	\N	\N	2025-12-03 09:12:53.880214	\N	2025-12-03 09:12:53.880214	\N
4df7d618-679b-4ff6-a261-8947bf4cbdab	ADGM Data Protection Regulations	regulatory	Data Protection	Abu Dhabi Global Market	UAE	ADGM-DPR-2021	Data Protection Regulations for entities operating in ADGM.	2021-02-14	2021-02-14	2021-02-14	2024-12-31	active	applicable	Organization has operations in ADGM	\N	\N	https://www.adgm.com/data-protection	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	{data-protection,privacy,adgm,uae}	\N	\N	2025-12-03 09:12:53.880214	\N	2025-12-03 09:12:53.880214	\N
f5f75141-2e48-4988-b85a-6a8e5f7e9966	ISO 27001:2022	industry_standard	Information Security	International Organization for Standardization	International	ISO/IEC 27001:2022	Information security management systems - Requirements.	2022-10-25	2022-10-25	2022-10-25	2027-10-25	active	applicable	Organization maintains ISO 27001 certification	\N	\N	https://www.iso.org/standard/27001	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	{iso27001,information-security,certification}	\N	\N	2025-12-03 09:12:53.880214	\N	2025-12-03 09:12:53.880214	\N
54dba754-3846-4563-8331-814125daee40	PCI DSS v4.0	industry_standard	Payment Security	PCI Security Standards Council	International	PCI-DSS-4.0	Payment Card Industry Data Security Standard version 4.0.	2022-03-31	2024-03-31	2022-03-31	2025-03-31	active	applicable	Organization processes payment card data	\N	\N	https://www.pcisecuritystandards.org	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	{pci-dss,payment-security,card-data}	\N	\N	2025-12-03 09:12:53.880214	\N	2025-12-03 09:12:53.880214	\N
e1480453-f333-4582-8ee1-889721af3428	GDPR	statutory	Data Protection	European Union	EU/EEA	EU-2016/679	General Data Protection Regulation for processing personal data of EU residents.	2016-04-27	2018-05-25	2016-04-27	2024-12-31	active	applicable	Organization processes personal data of EU residents	\N	\N	https://gdpr.eu	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	{gdpr,data-protection,privacy,eu}	\N	\N	2025-12-03 09:12:53.880214	\N	2025-12-03 09:12:53.880214	\N
a4ca8437-6e49-439d-aea8-1a26327baf92	Test Influencer	regulatory	\N	\N	\N	TEST-INF-001	Updated test influencer description	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-03 10:57:14.189712	\N	2025-12-03 10:57:14.263803	2025-12-03 10:57:14.263803
62ea0a6d-b8bf-411c-b922-9b3ed282c876	Test Influencer 1764759497	regulatory	\N	\N	\N	TEST-INF-1764759497	Updated test influencer description	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-03 10:58:17.398557	\N	2025-12-03 10:58:17.463155	2025-12-03 10:58:17.463155
4bfd2139-082a-4123-a8a0-c88e39600595	E2E Test Influencer 1764855623057	regulatory	\N	\N	\N	\N	\N	\N	\N	\N	\N	active	under_review	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-04 13:40:23.785257	\N	2025-12-04 13:40:23.785257	\N
dac5cf8e-31d5-4c12-a42f-6eb98e9be160	E2E Test Influencer 1765638959481	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765638963260	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 15:16:07.822965	\N	2025-12-13 15:16:07.822965	\N
4911a0f7-0275-468b-b873-54e09ec43bc5	E2E Test Influencer 1765638975598	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765638979438	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 15:16:23.643468	\N	2025-12-13 15:16:23.643468	\N
9ca07eb4-2f62-49c1-879c-d1ce2ce63892	E2E Test Influencer 1765638993831	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765638997538	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 15:16:41.724487	\N	2025-12-13 15:16:41.724487	\N
fd3c609d-5a75-4dd0-95ea-b880bb5bbe6e	E2E Test Influencer 1765639221331	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765639225291	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 15:20:29.518435	\N	2025-12-13 15:20:29.518435	\N
debc7356-7569-4ca4-9930-e4bbd473e3e7	E2E Test Influencer 1765639279441	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765639283085	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 15:21:27.199978	\N	2025-12-13 15:21:27.199978	\N
5b7a34c1-f112-48bf-8fc4-a60b77b37e98	E2E Test Influencer 1765639292917	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765639296661	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 15:21:41.012792	\N	2025-12-13 15:21:41.012792	\N
f76da095-5238-4bd5-b12e-3c8ab77a9c47	E2E Test Influencer 1765639307655	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765639311402	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 15:21:55.673841	\N	2025-12-13 15:21:55.673841	\N
049fd9bb-a664-4e2f-adc7-8fa01a6bcbe9	E2E Test Influencer 1765639471997	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765639475850	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 15:24:40.109358	\N	2025-12-13 15:24:40.109358	\N
69d51829-08e3-425a-8100-b3ef7e5a372c	E2E Test Influencer 1765640001342	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765640005048	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 15:33:29.162176	\N	2025-12-13 15:33:29.162176	\N
70bccc42-03db-4db9-84b3-334ecf6dd30d	E2E Test Influencer 1765644104808	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765644110463	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 16:41:54.478647	\N	2025-12-13 16:41:54.478647	\N
e893c23e-d185-4737-8a4d-4c0e02a55ffd	E2E Test Influencer 1765644203083	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765644207105	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 16:43:34.367481	\N	2025-12-13 16:43:34.367481	\N
dafb56ad-48ee-4a60-a2f5-5db0d3cfa29f	E2E Test Influencer 1765644263328	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765644271465	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 16:44:37.054143	\N	2025-12-13 16:44:37.054143	\N
eed24d4f-c159-48cf-bf66-da7d3b9097c0	E2E Test Influencer 1765644347100	regulatory	Cybersecurity	National Cybersecurity Authority	Saudi Arabia	REF-1765644352441	Test influencer description for E2E testing	\N	\N	\N	\N	active	applicable	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 16:45:56.834804	\N	2025-12-13 16:45:56.834804	\N
\.


--
-- Data for Name: information_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.information_assets (id, description, information_owner_id, asset_custodian_id, notes, created_by_id, updated_by_id, unique_identifier, name, classification_date, reclassification_date, "ownerId", "custodianId", criticality_level, compliance_requirements, "storageLocation", "storageType", "retentionPolicy", "retentionExpiryDate", deleted_at, deleted_by, created_by, updated_by, created_at, updated_at, information_type, business_unit_id, reclassification_reminder_sent, asset_location, storage_medium, retention_period, classification_level) FROM stdin;
6ad5adea-bb0d-494e-8a54-0407b5ca0f7f	Primary customer database containing personal information, purchase history, and preferences.	\N	\N	Contains sensitive customer data. Requires encryption at rest and in transit.	\N	\N	INFO-CUST-DB-001	Customer Database	2024-11-30	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	01180d49-d38b-4421-a130-b1ce4b7c34fa	critical	[]	Production Database Server	database	7 years from last transaction	\N	\N	\N	\N	\N	2025-11-30 09:52:00.017705	2025-11-30 09:52:00.017705	\N	\N	f	\N	\N	\N	\N
f3f41c64-b580-41e8-b1e4-f59b17bcaf85	Comprehensive employee records including personal information, employment history, and performance data.	\N	\N	Highly sensitive data. Access restricted to HR personnel only.	\N	\N	INFO-EMP-HR-001	Employee HR Records	2023-12-01	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	01180d49-d38b-4421-a130-b1ce4b7c34fa	high	[]	HR System Database	database	10 years post-employment	\N	\N	\N	\N	\N	2025-11-30 09:52:00.017705	2025-11-30 09:52:00.017705	\N	\N	f	\N	\N	\N	\N
af209445-43d1-4248-9670-99d29e885778	Historical financial reports, statements, and audit documentation.	\N	\N	Required for regulatory compliance and audit purposes.	\N	\N	INFO-FIN-REPORTS-001	Financial Reports Archive	2022-12-01	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	high	[]	Finance File Server	file_server	7 years for tax records, 10 years for audit records	\N	\N	\N	\N	\N	2025-11-30 09:52:00.017705	2025-11-30 09:52:00.017705	\N	\N	f	\N	\N	\N	\N
16a0a95a-062f-479d-bafc-04ffe713f41b	Intellectual property including patents, trademarks, and proprietary technology documentation.	\N	\N	Critical intellectual property. Maximum security required.	\N	\N	INFO-IP-PATENTS-001	Patent Documentation	2024-07-18	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	critical	[]	Secure Document Repository	file_server	Permanent - until patent expiration	\N	\N	\N	\N	\N	2025-11-30 09:52:00.017705	2025-11-30 09:52:00.017705	\N	\N	f	\N	\N	\N	\N
d02b647a-16b7-4836-9594-419f10dd5110	Market analysis, competitor intelligence, and customer research data.	\N	\N	Used for strategic planning and competitive analysis.	\N	\N	INFO-MKT-RESEARCH-001	Market Research Data	2025-06-03	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	medium	[]	Marketing File Server	file_server	3 years	2028-06-02	\N	\N	\N	\N	2025-11-30 09:52:00.017705	2025-11-30 09:52:00.017705	\N	\N	f	\N	\N	\N	\N
2224dc96-049f-4832-8ef4-bfcd59613111	Records of compliance audits, assessments, and remediation activities.	\N	\N	Required for regulatory reporting and audit trail.	\N	\N	INFO-COMPLIANCE-AUDIT-001	Compliance Audit Records	2025-05-14	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	01180d49-d38b-4421-a130-b1ce4b7c34fa	high	[]	Compliance Document Management System	database	7 years	\N	\N	\N	\N	\N	2025-11-30 09:52:00.017705	2025-11-30 09:52:00.017705	\N	\N	f	\N	\N	\N	\N
2cab5e71-9db8-4342-a52a-b57feed8ef32	Primary customer information database	\N	\N	\N	\N	\N	INFO-MJ0HA6AU-7B4Y	Customer Database	2023-01-10	\N	\N	\N	medium	["GDPR","PCI-DSS"]	\N	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:45:02.700172	2025-12-10 20:45:02.700172	Customer Records	\N	f	Cloud - AWS S3	database	7 years	confidential
73e8f1c6-4e1e-4541-9f9c-b1c9209eb779	Company employee handbook and policies	\N	\N	\N	\N	\N	INFO-MJ0HA6BI-2I1C	Employee Handbook	2023-03-15	\N	\N	\N	medium	\N	\N	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:45:02.719492	2025-12-10 20:45:02.719492	Policy Document	\N	f	SharePoint	file_server	Indefinite	internal
9bd90513-4071-488b-95cb-10f16bfd1a30	Quarterly financial reports and statements	\N	\N	\N	\N	\N	INFO-MJ0HA6BP-AGNY	Financial Reports Q4	2023-12-31	\N	\N	\N	medium	["SOX","GDPR"]	\N	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:45:02.726281	2025-12-10 20:45:02.726281	Financial Data	\N	f	Secure File Server	file_server	10 years	restricted
3356bd1d-ef7f-4e80-8758-f30a1313a853	Test information asset description for E2E testing	e4a2a06a-e399-4efb-895e-f607075a50a9	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	\N	INFO-MJ43VMRF-8303	Test Information Asset 1765618841753	2025-12-13	2026-12-13	\N	\N	medium	[]	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 09:40:53.90881	2025-12-13 09:40:53.90881	Customer Records	81b33af4-d7b4-48a3-9bca-8817c3b88873	f	Primary Database Server	database	7 years from last transaction date	confidential
654a2238-7860-4d61-9563-fb06dbb5b2c8	Test information asset description for E2E testing	e4a2a06a-e399-4efb-895e-f607075a50a9	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	\N	INFO-MJ4D53FA-NF7X	Test Information Asset 1765634400430	2025-12-13	2026-12-13	\N	\N	medium	[]	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 14:00:11.950234	2025-12-13 14:00:11.950234	Customer Records	81b33af4-d7b4-48a3-9bca-8817c3b88873	f	Primary Database Server	database	7 years from last transaction date	confidential
\.


--
-- Data for Name: integration_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.integration_configs (id, name, integration_type, endpoint_url, authentication_type, api_key, bearer_token, username, password, field_mapping, sync_interval, status, last_sync_error, last_sync_at, next_sync_at, created_by_id, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: integration_sync_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.integration_sync_logs (id, integration_config_id, status, total_records, successful_syncs, failed_syncs, skipped_records, error_message, sync_details, started_at, completed_at) FROM stdin;
\.


--
-- Data for Name: kri_measurements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kri_measurements (id, kri_id, measurement_date, value, status, notes, measured_by, evidence_attachments, created_at) FROM stdin;
ed805689-5f2a-488f-96ce-a90b17ba13dd	505b76c6-f116-41eb-8cc9-5def867664b0	2025-09-28	84.6512	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.21136
854e76f9-db0f-44dd-8acd-b0f9998ffb47	505b76c6-f116-41eb-8cc9-5def867664b0	2025-10-05	98.5536	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.215359
87780944-0252-41bc-ac79-10958b949c1c	505b76c6-f116-41eb-8cc9-5def867664b0	2025-10-12	71.9830	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.216339
7720ed25-0d7b-4f1d-84ab-75b2a5b7e10b	505b76c6-f116-41eb-8cc9-5def867664b0	2025-10-19	90.7280	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.217016
5a98155f-2edc-4b9b-be35-17782fcb5fa5	505b76c6-f116-41eb-8cc9-5def867664b0	2025-10-26	85.6695	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.217963
4e0a1f2e-22f8-4189-ba32-71aa37c6df24	505b76c6-f116-41eb-8cc9-5def867664b0	2025-11-02	75.9760	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.218714
daac4be7-c758-4290-a2cc-12d1849a449e	505b76c6-f116-41eb-8cc9-5def867664b0	2025-11-09	56.8082	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.219719
1a7e7e5d-54ed-46c1-9300-174828c19761	505b76c6-f116-41eb-8cc9-5def867664b0	2025-11-16	82.3314	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.220651
40ff65c1-6218-4996-aec8-2212ea1584b6	505b76c6-f116-41eb-8cc9-5def867664b0	2025-11-23	57.2973	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.221574
0d6e94ae-895c-4aa7-8d81-eee84cae98c5	505b76c6-f116-41eb-8cc9-5def867664b0	2025-11-30	78.3992	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:01:51.222368
a5ac415a-ecbd-4dea-9a2b-98497b204e2b	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-09-28	75.1671	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.22596
314c51a4-25d2-45f8-8b88-b240d4f214a3	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-10-05	76.4741	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.227449
83693f2c-2d48-4e48-a5c9-e8391b5537f8	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-10-12	78.6334	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.228541
e2e75f1d-c495-401a-9ca9-ae43ccef6a1b	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-10-19	84.9546	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.230174
9c31f5af-2d63-448f-9685-f8fd7beee4ef	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-10-26	87.3426	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.230945
d419984c-0767-4b5d-afa5-531fed0a621b	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-11-02	86.9006	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.231398
cba05851-b03e-4f96-98d6-d2bd44f0a51d	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-11-09	85.4397	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.232011
77393db9-8cc4-45bc-8bb9-e434be016dc2	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-11-16	86.6230	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.23335
2a94972d-2ed7-4426-8938-000c4c383bd5	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-11-23	88.8143	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.234105
a9f781de-f362-4d8c-b236-5ced75b26bf4	05d5c158-78a0-47f7-aea3-7f3e7b125230	2025-11-30	86.0653	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.234971
84ec71dc-776b-4b3b-b839-a3021bc7961d	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-09-28	8.7452	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.239951
febf1124-6abd-453a-b18d-f6cfd6d18da7	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-10-05	9.7774	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.241269
2f44c6b8-d9d3-4f58-8074-1954b3cf2341	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-10-12	5.1416	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.242266
e3913266-9e32-4397-9b2d-ae843eddc4f1	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-10-19	6.1336	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.243432
0622ffea-7782-4d88-9cd1-9ec46c083954	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-10-26	7.8638	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.244759
30396181-5348-4e45-ab18-756fad88060b	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-11-02	8.7990	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.245877
c96fa1a0-f218-4c44-80c5-814074f81480	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-11-09	6.3074	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.246951
c32f5693-0096-44ca-93de-1c618b1a5c16	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-11-16	9.8867	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.247929
de0fbd7d-d0d1-43d8-948b-5881a60c4215	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-11-23	5.1904	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.248734
3fa5e6ee-4fb2-4a12-afc1-fb599a86a0f3	a6e64e25-474c-47a2-80dc-f1d9ff35920c	2025-11-30	8.1763	red	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	2025-12-07 20:01:51.249901
04bdc749-55da-47b9-9706-23681c3ed75f	494f84b3-a033-4080-824e-bea089ede845	2025-09-28	99.5075	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.254235
c80539d4-ff65-492c-b9d9-c1f13211ab90	494f84b3-a033-4080-824e-bea089ede845	2025-10-05	99.6636	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.255417
f2f34a11-0dbc-4114-8be2-93b24e239720	494f84b3-a033-4080-824e-bea089ede845	2025-10-12	99.8565	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.256163
c154daaf-b209-4629-b948-bd75cad17b38	494f84b3-a033-4080-824e-bea089ede845	2025-10-19	99.8140	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.256677
f57a037e-adf8-480f-a550-8a69fb7a5b93	494f84b3-a033-4080-824e-bea089ede845	2025-10-26	99.7378	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.25746
2e3c884d-4cf1-423b-a64d-e93a2fbd2c8c	494f84b3-a033-4080-824e-bea089ede845	2025-11-02	99.7010	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.258275
8366613e-452c-47b5-97e3-94cdf4896395	494f84b3-a033-4080-824e-bea089ede845	2025-11-09	99.8308	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.258895
55c95924-3fa2-4b30-823e-30cc65d2e081	494f84b3-a033-4080-824e-bea089ede845	2025-11-16	99.6207	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.259464
0bbd8ad4-ea62-4066-93e7-052b69d88b5f	494f84b3-a033-4080-824e-bea089ede845	2025-11-23	99.6351	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.260094
b6232c4c-b426-4bc6-b1ae-d471cb77076c	494f84b3-a033-4080-824e-bea089ede845	2025-11-30	99.5302	amber	\N	550e8400-e29b-41d4-a716-446655440001	\N	2025-12-07 20:01:51.26089
e25c82f1-1917-4ff0-893c-9acd9736e031	a589dc6c-3017-434e-9a38-6d39a190966c	2025-09-28	57.2237	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.864322
7df77fce-3e60-4a8e-9aa2-3a6b0290439b	a589dc6c-3017-434e-9a38-6d39a190966c	2025-10-05	91.5213	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.86698
6c79525d-c3a5-4b2b-a6bd-7d6ed3822135	a589dc6c-3017-434e-9a38-6d39a190966c	2025-10-12	99.2116	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.867945
231956d5-005c-46a6-b16b-4440a7602d25	a589dc6c-3017-434e-9a38-6d39a190966c	2025-10-19	72.9040	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.86917
9ed090a4-4878-4aeb-98c6-6c3943a7da19	a589dc6c-3017-434e-9a38-6d39a190966c	2025-10-26	65.7878	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.87016
6bff6f02-ae69-4877-8e7f-ea72980684d8	a589dc6c-3017-434e-9a38-6d39a190966c	2025-11-02	75.1207	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.871015
cd4b6032-20f5-4b49-94f1-edf6e5dbfccf	a589dc6c-3017-434e-9a38-6d39a190966c	2025-11-09	91.2264	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.872047
2bcd4b80-b891-4168-b995-e7327b5604dd	a589dc6c-3017-434e-9a38-6d39a190966c	2025-11-16	59.4259	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.872824
39f4258b-aeb8-4ec3-91fb-e0276ec518c2	a589dc6c-3017-434e-9a38-6d39a190966c	2025-11-23	72.9382	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.873354
d1bb6611-7604-48a9-99cf-587ed7747518	a589dc6c-3017-434e-9a38-6d39a190966c	2025-11-30	92.4123	red	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-07 20:02:03.873843
20370bb2-2a14-4dbf-be8c-035c5f87e682	33e70f22-66b4-4a82-9b86-857d9387e279	2025-09-28	75.0410	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.877351
2c195d57-bdfe-42a9-a6e5-661c8d6ff03f	33e70f22-66b4-4a82-9b86-857d9387e279	2025-10-05	86.2765	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.878334
d14140d2-df36-4f95-894a-a1727579b5dc	33e70f22-66b4-4a82-9b86-857d9387e279	2025-10-12	81.2439	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.879403
eacaaea4-9d17-4225-99c9-c904e2955163	33e70f22-66b4-4a82-9b86-857d9387e279	2025-10-19	78.9408	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.880645
1c6ffd53-7006-4a76-974f-eccd104a4ab8	33e70f22-66b4-4a82-9b86-857d9387e279	2025-10-26	89.5275	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.881345
2d391375-d8f6-406f-a212-d84392cd4530	33e70f22-66b4-4a82-9b86-857d9387e279	2025-11-02	85.5744	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.882124
a3e8516c-c494-4222-8f97-b31100698187	33e70f22-66b4-4a82-9b86-857d9387e279	2025-11-09	81.5017	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.88268
64c7241a-5c14-450b-af46-ccad502fe0cb	33e70f22-66b4-4a82-9b86-857d9387e279	2025-11-16	79.1601	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.883665
3d5552f9-423c-4c18-9219-ea03706c43a7	33e70f22-66b4-4a82-9b86-857d9387e279	2025-11-23	75.9605	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.884282
8fc4e323-756e-4bc6-9a14-9dbf78368db6	33e70f22-66b4-4a82-9b86-857d9387e279	2025-11-30	76.1844	amber	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	2025-12-07 20:02:03.884926
f150a3d2-80bb-4eab-90bd-9f275f156016	d56badae-40f1-463b-8a85-2f9e57d64464	2025-09-28	8.3147	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.887436
c9a69686-23fe-4fca-addf-d0fc395af658	d56badae-40f1-463b-8a85-2f9e57d64464	2025-10-05	7.0571	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.888089
ce51087d-12e6-4aac-b881-368755eec024	d56badae-40f1-463b-8a85-2f9e57d64464	2025-10-12	5.7469	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.888843
2f617173-4901-46b6-870a-ee50ffe36666	d56badae-40f1-463b-8a85-2f9e57d64464	2025-10-19	7.4353	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.889357
dc8a7fa0-af22-44ef-b246-485cb2cfe7d7	d56badae-40f1-463b-8a85-2f9e57d64464	2025-10-26	7.7745	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.889895
4912a145-15b3-40e0-a066-9839c5d1f900	d56badae-40f1-463b-8a85-2f9e57d64464	2025-11-02	9.2102	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.890467
1fda588f-3ca4-4859-a370-d7eb9a65d642	d56badae-40f1-463b-8a85-2f9e57d64464	2025-11-09	8.4618	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.890967
6a6dbe03-b4ac-432b-8b37-0f56832cc2e9	d56badae-40f1-463b-8a85-2f9e57d64464	2025-11-16	5.8991	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.891435
7f080be5-7ade-444d-8abb-ee44f366676d	d56badae-40f1-463b-8a85-2f9e57d64464	2025-11-23	8.3493	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.892017
27c61f78-ae34-4f9f-b511-4e6de2fae2d2	d56badae-40f1-463b-8a85-2f9e57d64464	2025-11-30	8.9464	red	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	2025-12-07 20:02:03.892873
eace12a3-314b-42ae-990d-7d5d9099827c	b2a29264-bbf2-4f51-9925-d796bf501744	2025-09-28	99.7137	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.895204
f85c9442-be37-47f5-88ca-288a5884b44a	b2a29264-bbf2-4f51-9925-d796bf501744	2025-10-05	99.7193	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.89603
c8bcce08-e11c-4866-8093-b9062297d744	b2a29264-bbf2-4f51-9925-d796bf501744	2025-10-12	99.6978	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.896609
b7a3f7c5-db16-4a85-aa4f-b4ddda283956	b2a29264-bbf2-4f51-9925-d796bf501744	2025-10-19	99.7646	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.897034
13787509-0443-4e50-942b-ee2a5168b61f	b2a29264-bbf2-4f51-9925-d796bf501744	2025-10-26	99.7591	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.897459
9613d373-4988-4f22-961e-22067260f849	b2a29264-bbf2-4f51-9925-d796bf501744	2025-11-02	99.5113	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.897895
c876b84c-cf2e-4bf7-8788-be516d7b39d1	b2a29264-bbf2-4f51-9925-d796bf501744	2025-11-09	99.5591	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.898403
6d68fe12-bf1b-4a85-8d06-4563f4871f57	b2a29264-bbf2-4f51-9925-d796bf501744	2025-11-16	99.6655	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.898833
05923582-79f4-4f1c-8017-c9f82670aa7f	b2a29264-bbf2-4f51-9925-d796bf501744	2025-11-23	99.5805	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.899198
a2ab2a3e-d1bd-4fdf-af69-1a0d705a7c56	b2a29264-bbf2-4f51-9925-d796bf501744	2025-11-30	99.7761	amber	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	2025-12-07 20:02:03.899918
\.


--
-- Data for Name: kri_risk_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kri_risk_links (id, kri_id, risk_id, relationship_type, notes, linked_by, linked_at) FROM stdin;
c3723075-d63d-4355-b130-cb8f51e193b5	505b76c6-f116-41eb-8cc9-5def867664b0	5a560cb8-7536-4f0b-b414-82b91e6a7504	indicator	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:01:51.223
c90ee2dc-e976-4534-8b87-649ca0f2099e	05d5c158-78a0-47f7-aea3-7f3e7b125230	ed178ab4-0fd5-432b-b7dd-9e37c6dc089d	indicator	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:01:51.235
3d2952db-8dc6-4557-a30a-39867e6b59ae	a6e64e25-474c-47a2-80dc-f1d9ff35920c	33f6eccf-5f7a-4cc7-bc1c-b1e5c8fc9380	indicator	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:51.251
65f97ba7-ec16-46c5-a9cc-2e3760cb0e79	494f84b3-a033-4080-824e-bea089ede845	e247319a-b7fd-4e8b-8b74-a92187d95344	indicator	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:01:51.261
f239e175-b592-4834-b072-16fe27c981fa	a589dc6c-3017-434e-9a38-6d39a190966c	d8f95727-444a-4c54-bbfe-42d961964622	indicator	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:02:03.874
4ebc2ac0-ebfb-4455-96ab-1b25266e11ef	33e70f22-66b4-4a82-9b86-857d9387e279	998f72eb-b679-46aa-b224-9a3eadf3d400	indicator	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:02:03.885
140995f7-1f15-49e7-86ac-a2d2826ca6d2	d56badae-40f1-463b-8a85-2f9e57d64464	7d20459f-4d3a-4dfa-b43d-210625fa01b8	indicator	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:02:03.893
e3cc2fcb-6722-4aa8-b2f1-4fcf6a061665	b2a29264-bbf2-4f51-9925-d796bf501744	06a6ccaa-2e9f-4334-9a15-6d084f751827	indicator	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:02:03.9
6b0e9570-6e99-45ff-8828-f55ece24cfa3	a6e64e25-474c-47a2-80dc-f1d9ff35920c	95d8a18a-1e1c-44ed-9eaa-25dfadac75b5	indicator	\N	\N	2025-12-14 16:22:17.437134
7b2dcb4d-6de9-4b7c-8458-e85da984ab6d	d56badae-40f1-463b-8a85-2f9e57d64464	8546665c-d856-4641-b97f-7e20f1dcbfac	indicator	\N	\N	2025-12-14 19:18:35.9557
b032f923-e4c1-4028-ba39-c3834e03e002	a6e64e25-474c-47a2-80dc-f1d9ff35920c	8546665c-d856-4641-b97f-7e20f1dcbfac	indicator	\N	\N	2025-12-14 19:29:05.672005
e4e7e8f4-bec8-487b-ab19-c68d41624c65	505b76c6-f116-41eb-8cc9-5def867664b0	8546665c-d856-4641-b97f-7e20f1dcbfac	indicator	\N	\N	2025-12-14 19:31:26.431958
edeb0d55-10e4-42cb-b55c-c19cbf499d9f	a589dc6c-3017-434e-9a38-6d39a190966c	8546665c-d856-4641-b97f-7e20f1dcbfac	indicator	\N	\N	2025-12-14 19:34:17.015697
665aec62-7dcb-4895-bfcc-7f02a9448965	494f84b3-a033-4080-824e-bea089ede845	8546665c-d856-4641-b97f-7e20f1dcbfac	indicator	\N	\N	2025-12-14 19:36:37.003304
c374d3f7-38ae-4d19-a090-ded38e4231f8	d56badae-40f1-463b-8a85-2f9e57d64464	94280df5-b679-4b5b-bf6c-8500a719f183	indicator	\N	\N	2025-12-14 19:59:37.973917
192e9f18-52d7-4e14-b7d8-8d00be74c06e	a6e64e25-474c-47a2-80dc-f1d9ff35920c	94280df5-b679-4b5b-bf6c-8500a719f183	indicator	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:21:32.717573
b7d464ab-4470-4d06-9f80-5311d1829e0a	505b76c6-f116-41eb-8cc9-5def867664b0	94280df5-b679-4b5b-bf6c-8500a719f183	indicator	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:25:39.468415
67742c29-8445-490a-8bce-844b2cde68e1	a589dc6c-3017-434e-9a38-6d39a190966c	94280df5-b679-4b5b-bf6c-8500a719f183	indicator	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:34:02.13161
b82a90f3-35d3-4c77-95bb-e0ec7a198138	494f84b3-a033-4080-824e-bea089ede845	94280df5-b679-4b5b-bf6c-8500a719f183	indicator	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:37:38.538751
3e8b5803-d80b-41e4-b9bb-55ca04ec5006	b2a29264-bbf2-4f51-9925-d796bf501744	94280df5-b679-4b5b-bf6c-8500a719f183	indicator	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:48:02.407183
e08e26dc-0a3b-4890-b6f3-02e08ed8e40d	b2a29264-bbf2-4f51-9925-d796bf501744	8546665c-d856-4641-b97f-7e20f1dcbfac	indicator	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:53:22.417285
248da0c3-e197-4730-9bdf-5e2c5b9a8492	05d5c158-78a0-47f7-aea3-7f3e7b125230	94280df5-b679-4b5b-bf6c-8500a719f183	indicator	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:56:20.191328
47dff840-a92d-44df-a9c4-a61a8e64e808	aab90b03-9fc6-42cb-8a73-f9f60b702016	8546665c-d856-4641-b97f-7e20f1dcbfac	indicator	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-15 08:44:25.097715
\.


--
-- Data for Name: kris; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kris (id, kri_id, name, description, category_id, measurement_unit, measurement_frequency, data_source, calculation_method, threshold_green, threshold_amber, threshold_red, threshold_direction, current_value, current_status, trend, kri_owner_id, is_active, last_measured_at, next_measurement_due, target_value, baseline_value, tags, created_by, created_at, updated_by, updated_at, deleted_at) FROM stdin;
b2a29264-bbf2-4f51-9925-d796bf501744	KRI-0008	System Uptime Percentage	Percentage of time critical systems are available	be91f319-0d65-435f-9997-edd1be2a0b40	%	daily	\N	\N	99.9000	99.5000	99.0000	higher_better	99.7761	amber	improving	580d01e1-da18-49be-84aa-957ee84719ab	t	2025-12-07 20:02:03.899918	2025-12-14	\N	\N	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:02:03.894108	\N	2025-12-07 20:02:03.899918	\N
0c38142d-1b80-459d-93c0-df62339e94a7	KRI-0009	E2E Test KRI 1765746038346	E2E Test KRI Description - Testing KRI creation	\N	\N	monthly	\N	\N	0.0000	0.0000	0.0000	above	\N	\N	\N	\N	t	\N	2026-01-14	0.0000	0.0000	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 21:00:52.280612	\N	2025-12-14 21:00:52.280612	\N
9ce4f918-4eed-49ea-90c8-98020fe455a5	KRI-0010	E2E Test KRI 1765746174919	E2E Test KRI Description - Testing KRI creation	\N	\N	monthly	\N	\N	0.0000	0.0000	0.0000	above	\N	\N	\N	\N	t	\N	2026-01-14	0.0000	0.0000	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 21:03:08.771319	\N	2025-12-14 21:03:08.771319	\N
e412fe2b-07a4-46bd-a387-455595b7d1c0	KRI-0011	E2E Test KRI 1765746478499	E2E Test KRI Description - Testing KRI creation	\N	\N	monthly	\N	\N	0.0000	0.0000	0.0000	above	\N	\N	\N	\N	t	\N	2026-01-14	0.0000	0.0000	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 21:08:12.36196	\N	2025-12-14 21:08:12.36196	\N
4235f99f-11db-442e-8370-1d2730275eb5	KRI-0012	E2E Test KRI 1765746542898	E2E Test KRI Description - Testing KRI creation	\N	\N	monthly	\N	\N	0.0000	0.0000	0.0000	above	\N	\N	\N	\N	t	\N	2026-01-14	0.0000	0.0000	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 21:09:16.965415	\N	2025-12-14 21:09:16.965415	\N
a589dc6c-3017-434e-9a38-6d39a190966c	KRI-0005	Failed Authentication Attempts	Number of failed login attempts per day	ef25794f-0c38-44dd-b530-8a3ae17460c0	count	daily	\N	\N	10.0000	50.0000	100.0000	lower_better	92.4123	red	worsening	b1b35a04-894c-4b77-b209-8d79bee05ec9	t	2025-12-07 20:02:03.873843	2025-12-14	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:02:03.861915	\N	2025-12-07 20:02:03.873843	\N
a6e64e25-474c-47a2-80dc-f1d9ff35920c	KRI-0003	Compliance Control Gap Count	Number of compliance controls with identified gaps	4a777674-67f4-40db-adc2-753c5a8edb18	count	monthly	\N	\N	0.0000	5.0000	10.0000	lower_better	8.1763	red	worsening	b5525c73-c26a-48d4-a90a-582fa451e518	t	2025-12-07 20:01:51.249901	2025-12-14	\N	\N	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:51.236507	\N	2025-12-07 20:01:51.249901	\N
505b76c6-f116-41eb-8cc9-5def867664b0	KRI-0001	Failed Authentication Attempts	Number of failed login attempts per day	ef25794f-0c38-44dd-b530-8a3ae17460c0	count	daily	\N	\N	10.0000	50.0000	100.0000	lower_better	78.3992	red	worsening	e7f8a16b-c291-4696-8be0-992c381c8013	t	2025-12-07 20:01:51.222368	2025-12-14	\N	\N	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:01:51.20743	\N	2025-12-07 20:01:51.222368	\N
2a8aa1f2-5a85-414c-ae1d-6e84b0afb51d	KRI-0013	E2E Test KRI 1765746732291	E2E Test KRI Description - Testing KRI creation	\N	\N	monthly	\N	\N	0.0000	0.0000	0.0000	above	\N	\N	\N	\N	t	\N	2026-01-14	0.0000	0.0000	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 21:12:26.397593	\N	2025-12-14 21:12:26.397593	\N
6fb7e306-b734-41f0-b78a-ebabf55fda63	KRI-0014	E2E Test KRI 1765746800329	E2E Test KRI Description - Testing KRI creation	\N	\N	monthly	\N	\N	0.0000	0.0000	0.0000	above	\N	\N	\N	\N	t	\N	2026-01-14	0.0000	0.0000	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 21:13:34.19513	\N	2025-12-14 21:13:34.19513	\N
d56badae-40f1-463b-8a85-2f9e57d64464	KRI-0007	Compliance Control Gap Count	Number of compliance controls with identified gaps	4a777674-67f4-40db-adc2-753c5a8edb18	count	monthly	\N	\N	0.0000	5.0000	10.0000	lower_better	8.9464	red	worsening	e7f8a16b-c291-4696-8be0-992c381c8013	t	2025-12-07 20:02:03.892873	2025-12-14	\N	\N	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:02:03.886513	\N	2025-12-07 20:02:03.892873	\N
05d5c158-78a0-47f7-aea3-7f3e7b125230	KRI-0002	Vendor Security Assessment Completion Rate	Percentage of vendors with completed security assessments	be91f319-0d65-435f-9997-edd1be2a0b40	%	monthly	\N	\N	90.0000	75.0000	60.0000	higher_better	86.0653	amber	worsening	550e8400-e29b-41d4-a716-446655440001	t	2025-12-07 20:01:51.234971	2025-12-14	\N	\N	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:01:51.224736	\N	2025-12-07 20:01:51.234971	\N
96625fa6-52ca-4326-a7ca-55ca2d336966	KRI-0015	E2E Test KRI 1765747281104	E2E Test KRI Description - Testing KRI creation	\N	\N	monthly	\N	\N	0.0000	0.0000	0.0000	above	\N	\N	\N	\N	t	\N	2026-01-14	0.0000	0.0000	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 21:21:35.056472	\N	2025-12-14 21:21:35.056472	\N
3452d8ae-403b-4c91-8523-6ae630987d25	KRI-0016	E2E Test KRI 1765747346625	E2E Test KRI Description - Testing KRI creation	\N	\N	monthly	\N	\N	0.0000	0.0000	0.0000	above	\N	\N	\N	\N	t	\N	2026-01-14	0.0000	0.0000	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 21:22:40.534926	\N	2025-12-14 21:22:40.534926	\N
aab90b03-9fc6-42cb-8a73-f9f60b702016	KRI-0017	E2E Test KRI 1765747421679	E2E Test KRI Description - Testing KRI creation	\N	\N	monthly	\N	\N	0.0000	0.0000	0.0000	above	\N	\N	\N	\N	t	\N	2026-01-14	0.0000	0.0000	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 21:23:55.802793	\N	2025-12-14 21:23:55.802793	\N
494f84b3-a033-4080-824e-bea089ede845	KRI-0004	System Uptime Percentage	Percentage of time critical systems are available	be91f319-0d65-435f-9997-edd1be2a0b40	%	daily	\N	\N	99.9000	99.5000	99.0000	higher_better	99.5302	amber	worsening	550e8400-e29b-41d4-a716-446655440001	t	2025-12-07 20:01:51.26089	2025-12-14	\N	\N	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:01:51.252439	\N	2025-12-07 20:01:51.26089	\N
33e70f22-66b4-4a82-9b86-857d9387e279	KRI-0006	Vendor Security Assessment Completion Rate	Percentage of vendors with completed security assessments	be91f319-0d65-435f-9997-edd1be2a0b40	%	monthly	\N	\N	90.0000	75.0000	60.0000	higher_better	76.1844	amber	improving	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	t	2025-12-07 20:02:03.884926	2025-12-14	\N	\N	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:02:03.876075	\N	2025-12-07 20:02:03.884926	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
6	1700000000001	CreateUsersTable1700000000001
7	1700000000002	CreateOrganizationsTable1700000000002
8	1700000000003	CreateTasksTable1700000000003
9	1700000000004	CreateComplianceTables1700000000004
10	1700000000005	CreatePoliciesTable1700000000005
11	1700000000006	CreateRisksTable1700000000006
12	1700000000007	AddComplianceRequirementFields1700000000007
13	1700000000008	AddPolicyDocumentFields1700000000008
14	1700000000009	CreateWorkflowTables1700000000009
15	1700000000010	CreatePhysicalAssetsTable1700000000010
16	1700000000011	CreateImportLogsTable1700000000011
17	1700000000012	CreateAdditionalAssetTables1700000000012
18	1700000000013	CreateAssetDependenciesTable1700000000013
19	1700000000014	CreateAssetAuditLogsTable1700000000014
20	1700000000015	CreateNotificationsTable1700000000015
21	1700000000016	CreateComplianceAssessmentTables1700000000016
22	1700000000017	UpdateAssetsToMatchPlan1700000000017
23	1700000000018	RenameCamelCaseColumns1700000000018
24	1700000000019	RenameRemainingCamelCaseColumns1700000000019
25	1700000000020	FixInformationAssetsColumns1700000000020
26	1700000000021	FixBusinessApplicationsColumns1700000000021
27	1700000000022	FixSoftwareAssetsColumns1700000000022
28	1700000000023	FixSuppliersColumns1700000000023
29	1700000000024	CreateIntegrationConfigsTable1700000000024
30	1700000000025	CreateIntegrationSyncLogsTable1700000000025
31	1700000000026	CreateAssetFieldConfigsTable1700000000026
34	1701000000001	CreateGovernanceEnums1701000000001
35	1701000000002	CreateInfluencersTable1701000000002
36	1701000000003	CreatePoliciesTable1701000000003
37	1701000000004	CreateControlObjectivesTable1701000000004
38	1701000000005	CreateUnifiedControlsTables1701000000005
39	1701000000006	CreateControlMappingsTables1701000000006
40	1701000000007	CreateAssessmentsAndEvidenceTables1701000000007
41	1701000000008	CreateFindingsTable1701000000008
42	1701000000009	FixGovernanceSchemaIssues1701000000009
43	1701000000010	AddResolvedToFindingStatusEnum1701000000010
44	1701000000011	FixPolicyStatusEnumMismatch1701000000011
45	1701000000012	AddSignatureFieldsToWorkflowApprovals1701000000012
46	1701000000100	FixWorkflowColumnNames1701000000100
47	1701000000101	CreateGovernanceMetricSnapshotsTable1701000000101
48	1701000000102	CreateRemediationTrackersTable1701000000102
49	1702000000001	CreateRiskCategoriesTable1702000000001
50	1702000000002	EnhanceRisksTable1702000000002
51	1702000000003	CreateRiskAssessmentsTable1702000000003
52	1702000000004	CreateRiskAssetAndControlLinks1702000000004
53	1702000000005	CreateRiskTreatmentsTable1702000000005
54	1702000000006	CreateKRIsTable1702000000006
55	1702156800000	CreateRiskSettingsTable1702156800000
56	1702000000006	CreateRiskFindingLinks1702000000006
57	1702156800001	AddAssessmentTypeColumn1702156800001
58	1702160000000	CreateRiskAssessmentRequestsTable1702160000000
59	1703000000001	CreateSecurityTestResultsTable1703000000001
60	1704000000001	CreateReportTemplatesAndValidationRules1704000000001
61	1704000000002	FixReportTemplateFieldSelection1704000000002
62	1705000000001	AddBusinessUnitToUsers1705000000001
63	1705000000002	AddIsSystemTemplateToReportTemplates1705000000002
64	1705000000003	CreateReportTemplateVersionsTable1705000000003
65	1705000000004	AddSharingFieldsToReportTemplates1705000000004
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", type, priority, title, message, "isRead", "entityType", "entityId", "actionUrl", metadata, "createdAt", "updatedAt", "readAt") FROM stdin;
\.


--
-- Data for Name: physical_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.physical_assets (id, unique_identifier, asset_description, manufacturer, model, serial_number, location, building, floor, room, ip_addresses, mac_addresses, connectivity_status, network_approval_status, network_approval_date, "ownerId", department, criticality_level, compliance_requirements, purchase_date, "warrantyExpiryDate", vendor, notes, deleted_at, deleted_by, created_by, updated_by, created_at, updated_at, owner_id, created_by_id, updated_by_id, asset_type_id, business_unit_id, business_purpose, physical_location, installed_software, active_ports_services, last_connectivity_check, asset_tag, warranty_expiry, security_test_results) FROM stdin;
f5415b83-9f7e-484f-8230-528bb43a47ed	SRV-PROD-002	Production Application Server	HP	ProLiant DL380 Gen10	HP-DL380-2023-002	Data Center A	HQ Building	Basement	DC-A-02	["10.0.1.20"]	["00:1B:44:11:3A:C7"]	connected	approved	2025-07-03 09:51:59.982	b1b35a04-894c-4b77-b209-8d79bee05ec9	Infrastructure	critical	[]	2025-02-03	2026-02-03	Hewlett Packard Enterprise	Hosts critical business applications.	\N	\N	\N	\N	2025-11-30 09:51:59.985337	2025-11-30 09:51:59.985337	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
07e48687-de8a-4fa3-875b-7d40d761a4c6	WS-FIN-001	Finance Department Workstation	Lenovo	ThinkCentre M90q	LC-M90Q-2024-001	Office Floor 3	HQ Building	3rd Floor	Finance Office	["192.168.1.101"]	["00:1B:44:11:3A:D7"]	connected	approved	2025-10-31 09:51:59.982	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Accounting	high	[]	2025-10-01	2027-10-01	Lenovo	Used for financial reporting and analysis.	\N	\N	\N	\N	2025-11-30 09:51:59.985337	2025-11-30 09:51:59.985337	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53356679-b3af-4f8a-b405-b5200ea8b462	WS-HR-001	HR Department Workstation	Dell	OptiPlex 7090	DL-7090-2024-002	Office Floor 2	HQ Building	2nd Floor	HR Office	["192.168.1.102"]	["00:1B:44:11:3A:E7"]	connected	approved	2025-11-05 09:51:59.982	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	HR Operations	high	[]	2025-10-16	2027-10-16	Dell Technologies	Handles sensitive employee data. Requires encryption.	\N	\N	\N	\N	2025-11-30 09:51:59.985337	2025-11-30 09:51:59.985337	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5f5a5b3e-776a-45c9-8474-3f262c85fb87	NET-SW-001	Core Network Switch - Main Distribution	Cisco	Catalyst 9300	CS-9300-2023-001	Data Center A	HQ Building	Basement	DC-A-Network	["10.0.0.1"]	["00:1B:44:11:3A:F7"]	connected	approved	2025-05-14 09:51:59.982	b1b35a04-894c-4b77-b209-8d79bee05ec9	Network Infrastructure	critical	[]	2024-10-26	2026-01-04	Cisco Systems	Core network infrastructure. Critical for all operations.	\N	\N	\N	\N	2025-11-30 09:51:59.985337	2025-11-30 09:51:59.985337	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
815965ef-0dac-41fc-90e2-ed0c91c1e66f	MOB-EXEC-001	Executive Mobile Device	Apple	iPhone 15 Pro	AP-IP15P-2024-001	Mobile	\N	\N	\N	[]	["00:1B:44:11:3A:G7"]	connected	approved	2025-11-20 09:51:59.982	b1b35a04-894c-4b77-b209-8d79bee05ec9	C-Suite	high	[]	2025-11-10	2026-11-10	Apple Inc.	MDM managed device. Encrypted storage required.	\N	\N	\N	\N	2025-11-30 09:51:59.985337	2025-11-30 09:51:59.985337	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
154c7d20-4be2-4ef0-a5eb-919c9ffcb617	PRT-FLOOR2-001	Multifunction Printer - Floor 2	HP	LaserJet Pro MFP M430	HP-M430-2023-001	Office Floor 2	HQ Building	2nd Floor	Print Room	["192.168.1.201"]	["00:1B:44:11:3A:H7"]	connected	approved	2025-09-01 09:51:59.982	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Facilities	low	[]	2025-06-03	2026-06-03	HP Inc.	Shared printer for floor 2. Regular maintenance required.	\N	\N	\N	\N	2025-11-30 09:51:59.985337	2025-11-30 09:51:59.985337	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3b2502d4-b7cd-44f9-84a1-c563cf277b8b	STRG-BACKUP-001	Backup Storage Array	NetApp	FAS8300	NT-FAS8300-2023-001	Data Center B	HQ Building	Basement	DC-B-01	["10.0.2.10"]	["00:1B:44:11:3A:I7"]	connected	approved	2025-08-02 09:51:59.982	b1b35a04-894c-4b77-b209-8d79bee05ec9	Infrastructure	critical	[]	2025-03-25	2026-03-25	NetApp	Primary backup storage. Critical for disaster recovery.	\N	\N	\N	\N	2025-11-30 09:51:59.985337	2025-11-30 09:51:59.985337	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e1001531-a2e5-4859-a2a8-94ea78d5839c	SRV-PROD-001	Production Database Server - Primary	Dell	PowerEdge R740	DL-R740-2023-001	Data Center A	HQ Building	Basement	DC-A-01	["10.0.1.10", "10.0.1.11"]	["00:1B:44:11:3A:B7", "00:1B:44:11:3A:B8"]	connected	approved	2025-06-03 09:51:59.982	b1b35a04-894c-4b77-b209-8d79bee05ec9	Infrastructure	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a","59d51a64-e356-475c-9f62-e78a30e18471","08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2024-11-30	2027-11-30	Dell Technologies	Primary database server. Requires 24/7 monitoring.	\N	\N	\N	\N	2025-11-30 09:51:59.985337	2025-12-01 17:06:22.652067	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9d81c212-b5fa-4243-a2bc-6ed35227af76	PHY-SRV-001	Production Web Server 01	Dell	PowerEdge R740	SN-DELL-001	\N	\N	\N	\N	["192.168.1.10", "192.168.1.11"]	["00:1B:44:11:3A:B7", "00:1B:44:11:3A:B8"]	connected	not_required	\N	\N	\N	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2023-01-15	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.228293	2025-12-02 11:34:35.228293	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
e1b290b8-f99b-4979-ae73-c8b0b15a46a6	PHY-WS-001	Development Workstation 01	HP	EliteDesk 800 G6	SN-HP-DEV-001	\N	\N	\N	\N	["192.168.2.50"]	["00:50:56:12:34:56"]	connected	not_required	\N	\N	\N	medium	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2023-06-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.244597	2025-12-02 11:34:35.244597	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
accb5cbf-1ce2-49a5-8a3a-d09efe9a302b	PHY-NET-001	Network Switch Core 01	Cisco	Catalyst 9300	SN-CISCO-001	\N	\N	\N	\N	["192.168.1.1"]	["00:1E:13:7F:8A:01"]	connected	not_required	\N	\N	\N	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2022-11-20	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.250789	2025-12-02 11:34:35.250789	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9e4f04c3-e627-4c96-8020-10d30566cf41	PHY-MOB-001	Mobile Device - Sales Team 01	Apple	iPhone 14 Pro	SN-APPLE-001	\N	\N	\N	\N	["10.0.0.15"]	["02:00:00:00:00:01"]	connected	not_required	\N	\N	\N	high	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2023-09-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.256858	2025-12-02 11:34:35.256858	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3952fafa-9387-4ae7-8bb0-7d4a3d8df389	PHY-IOT-001	IoT Sensor - Temperature 01	Arduino	Arduino Uno	SN-ARDUINO-001	\N	\N	\N	\N	["192.168.3.100"]	["00:1A:2B:3C:4D:5E"]	connected	not_required	\N	\N	\N	low	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2023-03-15	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.264109	2025-12-02 11:34:35.264109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
f4317441-602a-42fb-99f8-6faf85617db3	PHY-PRT-001	Printer - Marketing Dept	Canon	imageRUNNER ADVANCE C5535i	SN-CANON-001	\N	\N	\N	\N	["192.168.2.100"]	["00:21:5E:12:34:56"]	connected	not_required	\N	\N	\N	low	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2022-08-10	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.269645	2025-12-02 11:34:35.269645	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5fed39ea-6829-482e-adeb-4e99f0070295	PHY-STR-001	Storage Array - Backup 01	NetApp	FAS8300	SN-NETAPP-001	\N	\N	\N	\N	["192.168.1.20"]	["00:50:56:AB:CD:EF"]	connected	not_required	\N	\N	\N	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2022-05-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.274868	2025-12-02 11:34:35.274868	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7c4799e4-9771-48bd-844c-d47e9fabf9d5	PHY-WS-002	Workstation - Finance 01	Lenovo	ThinkCentre M90q	SN-LENOVO-001	\N	\N	\N	\N	["192.168.2.75"]	["00:1C:42:12:34:56"]	connected	not_required	\N	\N	\N	high	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2023-02-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.280117	2025-12-02 11:34:35.280117	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
0631d19e-a39d-4e6a-afe8-f26f1abec69f	PHY-NET-002	Network Firewall 01	Fortinet	FortiGate 600E	SN-FORTINET-001	\N	\N	\N	\N	["192.168.1.2"]	["00:09:0F:12:34:56"]	connected	not_required	\N	\N	\N	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2022-12-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.284364	2025-12-02 11:34:35.284364	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
aa5dd238-0694-4852-908b-e785853c5bda	PHY-SRV-002	Server - Database 01	IBM	Power System S922	SN-IBM-001	\N	\N	\N	\N	["192.168.1.15"]	["00:1A:2B:3C:4D:5F"]	connected	not_required	\N	\N	\N	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2023-04-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:34:35.288598	2025-12-02 11:34:35.288598	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
286ee346-a379-4417-a4db-e8e130b0c4ea	PA-MIOIE8PU-1R8I	Application Server - Production	IBM	PowerEdge R750	SN-IBM-APP-001	\N	\N	\N	\N	["10.0.1.20", "10.0.1.21"]	["AA:BB:CC:DD:EE:01", "AA:BB:CC:DD:EE:02"]	connected	not_required	\N	\N	\N	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2024-01-10	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:57.958051	2025-12-02 11:42:57.958051	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9e328ad8-6215-431e-bd53-4fac875c4024	PA-MIOIE8QB-SV3E	Security Workstation - IT	Dell	OptiPlex 7090	SN-DELL-SEC-001	\N	\N	\N	\N	["192.168.5.100"]	["BB:CC:DD:EE:FF:01"]	connected	not_required	\N	\N	\N	high	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2024-02-15	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:57.972704	2025-12-02 11:42:57.972704	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
fc3fa203-1d0c-4d8c-b9ec-4924adf4e7c7	PA-MIOIE8QI-ZWZO	Network Router - Edge	Juniper	MX204	SN-JUNIPER-001	\N	\N	\N	\N	["10.0.0.1"]	["CC:DD:EE:FF:AA:01"]	connected	not_required	\N	\N	\N	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2023-12-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:57.979104	2025-12-02 11:42:57.979104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
03492671-410f-4c20-97b8-9a1d5445b480	PA-MIOIE8QN-B2J1	Tablet Device - Field Service	Samsung	Galaxy Tab S9	SN-SAMSUNG-001	\N	\N	\N	\N	["172.16.0.50"]	["DD:EE:FF:AA:BB:01"]	connected	not_required	\N	\N	\N	medium	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2024-03-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:57.983804	2025-12-02 11:42:57.983804	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
73a04969-7c36-4f02-87e4-06ae2f34651d	PA-MIOIE8QR-JHJC	Smart Camera - Parking Lot	Axis	AXIS P3245-LVE	SN-AXIS-001	\N	\N	\N	\N	["192.168.10.50"]	["EE:FF:AA:BB:CC:01"]	connected	not_required	\N	\N	\N	medium	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2024-01-20	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:57.988659	2025-12-02 11:42:57.988659	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
b1da08bb-b45c-469c-9a50-3d461aaf92d7	PA-MIOIE8QW-RP50	Multifunction Printer - Finance	Konica Minolta	bizhub C658	SN-KONICA-001	\N	\N	\N	\N	["192.168.6.150"]	["FF:AA:BB:CC:DD:01"]	connected	not_required	\N	\N	\N	high	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2023-11-15	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:57.993288	2025-12-02 11:42:57.993288	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
b5e69311-54ba-4b26-9641-1b488ed0547d	PA-MIOIE8R0-SAMO	SAN Storage - Database	NetApp	AFF A250	SN-NETAPP-SAN-001	\N	\N	\N	\N	["10.0.2.10"]	["AA:11:22:33:44:01"]	connected	not_required	\N	\N	\N	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2023-10-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:57.997649	2025-12-02 11:42:57.997649	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6f1ad9f5-9c0d-4d3e-9201-4892c6b3d837	PA-MIOIE8R5-TVII	Backup Server - Secondary	HPE	ProLiant DL380 Gen11	SN-HPE-BKP-002	\N	\N	\N	\N	["10.10.1.10"]	["11:22:33:44:55:01"]	connected	not_required	\N	\N	\N	critical	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2024-04-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:58.002369	2025-12-02 11:42:58.002369	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1a2e1629-8971-4f54-8aa3-f908eca7d21e	PA-MIOIE8RA-Q6FK	Development Laptop - Engineering	Apple	MacBook Pro 16	SN-APPLE-LAP-001	\N	\N	\N	\N	["192.168.4.75"]	["22:33:44:55:66:01"]	connected	not_required	\N	\N	\N	medium	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2024-05-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:58.0074	2025-12-02 11:42:58.0074	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
b674dae7-b704-4d0c-a033-037fe3e1a109	PA-MIOIE8RF-T7S3	Network Access Point - Warehouse	Aruba	AP-635	SN-ARUBA-001	\N	\N	\N	\N	["192.168.3.200"]	["33:44:55:66:77:01"]	connected	not_required	\N	\N	\N	medium	["37b8ada8-8c00-4bf5-80ab-bd5a5aafea3a", "59d51a64-e356-475c-9f62-e78a30e18471", "08f2bc40-f8e5-4931-9277-6a7afe706d22"]	2024-02-01	\N	\N	\N	\N	\N	\N	\N	2025-12-02 11:42:58.011806	2025-12-02 11:42:58.011806	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
b91f9de7-81e7-4544-9a0a-9de6b085f8b6	ASSET-1765390129057-lmpj8mcau	Production Database Server - Primary	Dell	PowerEdge R740	DL-R740-2023-001	\N	\N	\N	\N	[]	[]	unknown	not_required	\N	\N	\N	medium	[]	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-10 18:08:49.122611	2025-12-10 18:08:49.122611	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
29562b88-ce27-4d9d-86d7-95ed4921cabd	WS-FIN-042	Workstation - Finance Dept	HP	EliteDesk 800 G6	HP987654321	\N	\N	\N	\N	["192.168.2.42"]	["00:1A:2B:3C:4D:5E"]	connected	approved	\N	\N	\N	high	["SOX","GDPR"]	2023-06-01	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 21:29:41.728477	2025-12-10 21:29:41.728477	\N	\N	\N	\N	\N	Finance department workstation for accounting operations	HQ Building, 2nd Floor, Finance Office	[{"name": "Windows 11", "version": "22H2", "patch_level": "KB123789"}]	[]	2024-12-01 00:00:00	TAG-042	2026-06-01	\N
106eafae-913c-4419-89bc-f76dcc7327cb	NET-CORE-001	Network Switch - Core	Cisco	Catalyst 9300	CS123456789	\N	\N	\N	\N	["192.168.1.1"]	["00:1E:7A:12:34:56"]	connected	approved	\N	\N	\N	critical	["ISO 27001"]	2022-11-20	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-10 21:29:41.754095	2025-12-10 21:29:41.754095	\N	\N	\N	\N	\N	Core network switch for data center connectivity	HQ Building, 3rd Floor, Network Closet	[{"name": "IOS", "version": "16.12.04", "patch_level": "Latest"}]	[{"port": 22, "service": "SSH", "protocol": "TCP"}, {"port": 161, "service": "SNMP", "protocol": "UDP"}]	2024-12-01 00:00:00	TAG-CORE-001	2025-11-20	{"findings": "Firmware updated to latest version", "severity": "Low", "last_test_date": "2024-10-20"}
a6f4f177-1b77-49ae-82f8-11c1b37aee87	TEST-1765571830604	Complete Test Asset	Dell	PowerEdge R740	SN-12345	\N	\N	\N	\N	["192.168.1.100"]	["00:1B:44:11:3A:B7"]	connected	approved	\N	\N	\N	high	["GDPR"]	2025-12-12	\N	\N	\N	\N	\N	\N	\N	2025-12-12 20:37:25.67324	2025-12-12 20:37:25.67324	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	71479ea7-b65d-4a15-8371-279a70ffeddf	81b33af4-d7b4-48a3-9bca-8817c3b88873	\N	Building A, Floor 3, Room 301	[]	[]	\N	TAG-001	2026-12-12	{}
16261bf4-000b-4006-8aee-d251cfd3184e	TEST-1765616029445	Complete Test Asset	Dell	PowerEdge R740	SN-12345	\N	\N	\N	\N	["192.168.1.100"]	["00:1B:44:11:3A:B7"]	connected	approved	\N	\N	\N	high	["GDPR"]	2025-12-13	\N	\N	\N	\N	\N	\N	\N	2025-12-13 08:54:04.584753	2025-12-13 08:54:04.584753	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	71479ea7-b65d-4a15-8371-279a70ffeddf	81b33af4-d7b4-48a3-9bca-8817c3b88873	\N	Building A, Floor 3, Room 301	[]	[]	\N	TAG-001	2026-12-13	{}
84a67ecb-4247-4391-aa2d-3115f13f71d2	TEST-1765616132680	Complete Test Asset	Dell	PowerEdge R740	SN-12345	\N	\N	\N	\N	["192.168.1.100"]	["00:1B:44:11:3A:B7"]	connected	approved	\N	\N	\N	high	["GDPR"]	2025-12-13	\N	\N	\N	\N	\N	\N	\N	2025-12-13 08:55:47.729305	2025-12-13 08:55:47.729305	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	71479ea7-b65d-4a15-8371-279a70ffeddf	81b33af4-d7b4-48a3-9bca-8817c3b88873	\N	Building A, Floor 3, Room 301	[]	[]	\N	TAG-001	2026-12-13	{}
d41bedf6-dea6-4421-b0c1-807020a6baa3	TEST-1765618690974	Complete Test Asset	Dell	PowerEdge R740	SN-12345	\N	\N	\N	\N	["192.168.1.100"]	["00:1B:44:11:3A:B7"]	connected	approved	\N	\N	\N	high	["GDPR"]	2025-12-13	\N	\N	\N	\N	\N	\N	\N	2025-12-13 09:38:24.524014	2025-12-13 09:38:24.524014	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	71479ea7-b65d-4a15-8371-279a70ffeddf	81b33af4-d7b4-48a3-9bca-8817c3b88873	\N	Building A, Floor 3, Room 301	[]	[]	\N	TAG-001	2026-12-13	{}
beec46c6-395a-49a7-8829-16a8bcecb8aa	TEST-1765634288201	Complete Test Asset	Dell	PowerEdge R740	SN-12345	\N	\N	\N	\N	["192.168.1.100"]	["00:1B:44:11:3A:B7"]	connected	approved	\N	\N	\N	high	["GDPR"]	2025-12-13	\N	\N	\N	\N	\N	\N	\N	2025-12-13 13:58:21.100374	2025-12-13 13:58:21.100374	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	71479ea7-b65d-4a15-8371-279a70ffeddf	81b33af4-d7b4-48a3-9bca-8817c3b88873	\N	Building A, Floor 3, Room 301	[]	[]	\N	TAG-001	2026-12-13	{}
\.


--
-- Data for Name: policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.policies (id, title, description, "policyType", status, version, "organizationId", "ownerId", "effectiveDate", "reviewDate", "createdAt", "updatedAt", "documentUrl", "documentName", "documentMimeType", version_number, content, purpose, scope, business_units, approval_date, review_frequency, next_review_date, published_date, linked_influencers, supersedes_policy_id, attachments, tags, custom_fields, requires_acknowledgment, acknowledgment_due_days, created_by, updated_by, deleted_at, policy_type, owner_id, effective_date, created_at, updated_at) FROM stdin;
88f5db99-936b-4474-a9c3-82ccd76c96d6	Remote Work Policy	Guidelines for remote work arrangements, including security requirements, equipment standards, and communication expectations.	operational	draft	0.9	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	2025-12-14 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
41e32c9f-94a0-48bf-ba29-d003e629341b	Test Policy	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-03 10:57:37.568028	2025-12-03 10:57:37.568028	\N	\N	\N	1	Updated test policy content	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	2025-12-03 10:57:37.645285	test	\N	\N	2025-12-03 10:57:37.568028	2025-12-03 10:57:37.645285
4e06fba3-6b58-4fa5-8e57-50583da947f5	Test Policy	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-03 10:58:17.478718	2025-12-03 10:58:17.478718	\N	\N	\N	1	Updated test policy content	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	2025-12-03 10:58:17.531006	test	\N	\N	2025-12-03 10:58:17.478718	2025-12-03 10:58:17.531006
d5ec6b9f-fdd5-4826-92c2-6d79ca7a15af	Information Security Policy	Comprehensive information security policy covering data protection, access controls, and incident response. This policy establishes the framework for protecting organizational information assets.	security	published	2.1	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-08-31 17:00:26.937	2026-08-31 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
947f447f-d282-4465-9f31-c4cd565845ed	Data Privacy and Protection Policy	Policy governing the collection, use, and protection of personal data in compliance with GDPR, PDPL, and local regulations. Ensures proper handling of sensitive information.	compliance	published	1.5	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-09-30 17:00:26.937	2026-09-30 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
9d55e855-d323-4fe8-912a-2a95e76524ac	Acceptable Use Policy	Guidelines for acceptable use of company IT resources, systems, and networks. Defines acceptable and prohibited activities for all users.	it	published	3.0	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-08-01 17:00:26.937	2026-08-01 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
2406a98f-2b92-4cf6-87d9-e6634d4b8171	Business Continuity Policy	Policy outlining procedures for maintaining business operations during disruptions and disasters. Includes disaster recovery and business resumption plans.	operational	published	2.0	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-10-15 17:00:26.937	2026-10-15 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
40a6176b-c204-46bb-860f-dafc1e638193	Password Management Policy	Establishes requirements for password creation, storage, and management. Includes password complexity requirements and rotation policies.	security	published	1.8	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-10-30 17:00:26.937	2026-10-30 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
871fc56d-7410-4355-97ac-3a4e328b3b5d	Incident Response Policy	Defines procedures for detecting, responding to, and recovering from security incidents. Includes escalation procedures and communication protocols.	security	published	1.3	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-09-15 17:00:26.937	2026-09-15 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
b841132a-555d-4f63-a288-3d27e6c267b4	Access Control Policy	Governs user access to systems, applications, and data. Includes principles of least privilege and regular access reviews.	security	published	2.2	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-08-21 17:00:26.937	2026-08-21 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
93065f76-68e0-4af8-a5a4-a43a46972cc7	Code of Conduct	Establishes ethical standards and behavioral expectations for all employees. Covers professional conduct, conflicts of interest, and reporting mechanisms.	hr	published	1.0	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-06-02 17:00:26.937	2026-06-02 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
daa93cf9-d847-450d-814c-9c1d18b97e36	Financial Controls Policy	Establishes financial controls, approval processes, and reporting requirements. Ensures proper financial governance and compliance.	finance	published	1.4	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-10-10 17:00:26.937	2026-10-10 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
d7d15a69-37c5-46f7-b07a-4e66eadf20dd	Data Retention Policy	Defines how long different types of data should be retained and procedures for secure disposal. Ensures compliance with legal and regulatory requirements.	compliance	published	1.1	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-04 17:00:26.937	2026-11-04 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
8fb03509-e748-4789-83c6-2c397cf1bdf3	Information Security Policy	\N	compliance	published	2.1	\N	\N	\N	\N	2025-12-03 09:42:25.407765	2025-12-03 09:42:25.407765	\N	\N	\N	2	This policy establishes the framework for protecting organizational information assets...	To ensure the confidentiality, integrity, and availability of information assets	All employees, contractors, and third parties with access to organizational information	\N	2025-09-04	annual	2026-09-04	2025-09-04	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{security,information-security,iso27001}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:42:25.407765	2025-12-03 09:42:25.407765
4a20ca8c-4c2b-4dd1-b1a9-dd1a6dfc4818	Data Privacy and Protection Policy	\N	compliance	published	1.5	\N	\N	\N	\N	2025-12-03 09:42:25.432311	2025-12-03 09:42:25.432311	\N	\N	\N	1	This policy governs the collection, use, and protection of personal data...	To ensure compliance with data protection regulations including GDPR, PDPL, and ADGM DPR	All personal data processing activities	\N	2025-10-04	annual	2026-10-04	2025-10-04	{e1480453-f333-4582-8ee1-889721af3428}	\N	\N	{privacy,data-protection,gdpr}	\N	t	30	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N	compliance	\N	\N	2025-12-03 09:42:25.432311	2025-12-03 09:42:25.432311
41e1675f-d1b0-4884-b324-6e88a66a306a	Access Control Policy	\N	compliance	published	2.2	\N	\N	\N	\N	2025-12-03 09:42:25.435997	2025-12-03 09:42:25.435997	\N	\N	\N	2	This policy governs user access to systems, applications, and data...	To implement principles of least privilege and ensure appropriate access controls	All information systems and data	\N	2025-08-25	annual	2026-08-25	2025-08-25	{f716f9c4-e558-453b-ba53-41b3c8d225e0,e851d527-3f07-4201-98d0-602a3b5f6572,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{access-control,iam,security}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:42:25.435997	2025-12-03 09:42:25.435997
2eb6f7bc-7cd4-4079-97ab-7ef6fe6e5d4e	Password Management Policy	\N	compliance	published	1.8	\N	\N	\N	\N	2025-12-03 09:42:25.439647	2025-12-03 09:42:25.439647	\N	\N	\N	1	This policy establishes requirements for password creation, storage, and management...	To ensure strong password practices and prevent unauthorized access	All users with system access	\N	2025-11-03	annual	2026-11-03	2025-11-03	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{password,authentication,security}	\N	t	14	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:42:25.439647	2025-12-03 09:42:25.439647
149e819a-44b1-4416-9bf2-105b8319f195	Information Security Policy	\N	compliance	published	2.1	\N	\N	\N	\N	2025-12-03 09:42:42.086527	2025-12-03 09:42:42.086527	\N	\N	\N	2	This policy establishes the framework for protecting organizational information assets...	To ensure the confidentiality, integrity, and availability of information assets	All employees, contractors, and third parties with access to organizational information	\N	2025-09-04	annual	2026-09-04	2025-09-04	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{security,information-security,iso27001}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:42:42.086527	2025-12-03 09:42:42.086527
6b394653-a61e-4c61-abbd-ec4150f9afad	Data Privacy and Protection Policy	\N	compliance	published	1.5	\N	\N	\N	\N	2025-12-03 09:42:42.099064	2025-12-03 09:42:42.099064	\N	\N	\N	1	This policy governs the collection, use, and protection of personal data...	To ensure compliance with data protection regulations including GDPR, PDPL, and ADGM DPR	All personal data processing activities	\N	2025-10-04	annual	2026-10-04	2025-10-04	{e1480453-f333-4582-8ee1-889721af3428}	\N	\N	{privacy,data-protection,gdpr}	\N	t	30	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N	compliance	\N	\N	2025-12-03 09:42:42.099064	2025-12-03 09:42:42.099064
22c782bb-c63b-4d6b-a8f5-bfec140d6ca1	Access Control Policy	\N	compliance	published	2.2	\N	\N	\N	\N	2025-12-03 09:42:42.102725	2025-12-03 09:42:42.102725	\N	\N	\N	2	This policy governs user access to systems, applications, and data...	To implement principles of least privilege and ensure appropriate access controls	All information systems and data	\N	2025-08-25	annual	2026-08-25	2025-08-25	{f716f9c4-e558-453b-ba53-41b3c8d225e0,e851d527-3f07-4201-98d0-602a3b5f6572,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{access-control,iam,security}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:42:42.102725	2025-12-03 09:42:42.102725
58786dfc-1c6a-46d3-8c4d-c13496a32916	Password Management Policy	\N	compliance	published	1.8	\N	\N	\N	\N	2025-12-03 09:42:42.106448	2025-12-03 09:42:42.106448	\N	\N	\N	1	This policy establishes requirements for password creation, storage, and management...	To ensure strong password practices and prevent unauthorized access	All users with system access	\N	2025-11-03	annual	2026-11-03	2025-11-03	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{password,authentication,security}	\N	t	14	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:42:42.106448	2025-12-03 09:42:42.106448
da901065-35df-4fb4-a4e3-932a6f6bac1c	Information Security Policy	\N	compliance	published	2.1	\N	\N	\N	\N	2025-12-03 09:43:48.439182	2025-12-03 09:43:48.439182	\N	\N	\N	2	This policy establishes the framework for protecting organizational information assets...	To ensure the confidentiality, integrity, and availability of information assets	All employees, contractors, and third parties with access to organizational information	\N	2025-09-04	annual	2026-09-04	2025-09-04	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{security,information-security,iso27001}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:43:48.439182	2025-12-03 09:43:48.439182
95c21677-ab53-4d3e-a87c-040a81a7722b	Data Privacy and Protection Policy	\N	compliance	published	1.5	\N	\N	\N	\N	2025-12-03 09:43:48.471516	2025-12-03 09:43:48.471516	\N	\N	\N	1	This policy governs the collection, use, and protection of personal data...	To ensure compliance with data protection regulations including GDPR, PDPL, and ADGM DPR	All personal data processing activities	\N	2025-10-04	annual	2026-10-04	2025-10-04	{e1480453-f333-4582-8ee1-889721af3428}	\N	\N	{privacy,data-protection,gdpr}	\N	t	30	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N	compliance	\N	\N	2025-12-03 09:43:48.471516	2025-12-03 09:43:48.471516
34bcf81c-89f9-4eb1-8a89-13b6244476b8	Access Control Policy	\N	compliance	published	2.2	\N	\N	\N	\N	2025-12-03 09:43:48.479627	2025-12-03 09:43:48.479627	\N	\N	\N	2	This policy governs user access to systems, applications, and data...	To implement principles of least privilege and ensure appropriate access controls	All information systems and data	\N	2025-08-25	annual	2026-08-25	2025-08-25	{f716f9c4-e558-453b-ba53-41b3c8d225e0,e851d527-3f07-4201-98d0-602a3b5f6572,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{access-control,iam,security}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:43:48.479627	2025-12-03 09:43:48.479627
2a32134a-5ce5-4d73-a7ca-b4b972fe20c6	Password Management Policy	\N	compliance	published	1.8	\N	\N	\N	\N	2025-12-03 09:43:48.485257	2025-12-03 09:43:48.485257	\N	\N	\N	1	This policy establishes requirements for password creation, storage, and management...	To ensure strong password practices and prevent unauthorized access	All users with system access	\N	2025-11-03	annual	2026-11-03	2025-11-03	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{password,authentication,security}	\N	t	14	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:43:48.485257	2025-12-03 09:43:48.485257
42d7bc27-7af4-42c1-bcb2-4fb7183bc8e6	Information Security Policy	\N	compliance	published	2.1	\N	\N	\N	\N	2025-12-03 09:51:31.039307	2025-12-03 09:51:31.039307	\N	\N	\N	2	This policy establishes the framework for protecting organizational information assets...	To ensure the confidentiality, integrity, and availability of information assets	All employees, contractors, and third parties with access to organizational information	\N	2025-09-04	annual	2026-09-04	2025-09-04	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{security,information-security,iso27001}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:51:31.039307	2025-12-03 09:51:31.039307
b8b50827-78f6-41c1-ba89-308ab9d6120c	Data Privacy and Protection Policy	\N	compliance	published	1.5	\N	\N	\N	\N	2025-12-03 09:51:31.062302	2025-12-03 09:51:31.062302	\N	\N	\N	1	This policy governs the collection, use, and protection of personal data...	To ensure compliance with data protection regulations including GDPR, PDPL, and ADGM DPR	All personal data processing activities	\N	2025-10-04	annual	2026-10-04	2025-10-04	{e1480453-f333-4582-8ee1-889721af3428}	\N	\N	{privacy,data-protection,gdpr}	\N	t	30	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N	compliance	\N	\N	2025-12-03 09:51:31.062302	2025-12-03 09:51:31.062302
053f9283-9831-4dd5-a91b-e816ee841e03	Access Control Policy	\N	compliance	published	2.2	\N	\N	\N	\N	2025-12-03 09:51:31.065943	2025-12-03 09:51:31.065943	\N	\N	\N	2	This policy governs user access to systems, applications, and data...	To implement principles of least privilege and ensure appropriate access controls	All information systems and data	\N	2025-08-25	annual	2026-08-25	2025-08-25	{f716f9c4-e558-453b-ba53-41b3c8d225e0,e851d527-3f07-4201-98d0-602a3b5f6572,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{access-control,iam,security}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:51:31.065943	2025-12-03 09:51:31.065943
026ff053-6b7b-426d-826b-668be25a7b64	Password Management Policy	\N	compliance	published	1.8	\N	\N	\N	\N	2025-12-03 09:51:31.069721	2025-12-03 09:51:31.069721	\N	\N	\N	1	This policy establishes requirements for password creation, storage, and management...	To ensure strong password practices and prevent unauthorized access	All users with system access	\N	2025-11-03	annual	2026-11-03	2025-11-03	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{password,authentication,security}	\N	t	14	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 09:51:31.069721	2025-12-03 09:51:31.069721
e84369de-1fb1-401c-adcb-e2c43b6b7769	Information Security Policy	\N	compliance	published	2.1	\N	\N	\N	\N	2025-12-03 10:53:17.688624	2025-12-03 10:53:17.688624	\N	\N	\N	2	This policy establishes the framework for protecting organizational information assets...	To ensure the confidentiality, integrity, and availability of information assets	All employees, contractors, and third parties with access to organizational information	\N	2025-09-04	annual	2026-09-04	2025-09-04	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{security,information-security,iso27001}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 10:53:17.688624	2025-12-03 10:53:17.688624
ef3f2e5b-2f6f-407d-aa3b-83ea3038b0f6	Data Privacy and Protection Policy	\N	compliance	published	1.5	\N	\N	\N	\N	2025-12-03 10:53:17.711787	2025-12-03 10:53:17.711787	\N	\N	\N	1	This policy governs the collection, use, and protection of personal data...	To ensure compliance with data protection regulations including GDPR, PDPL, and ADGM DPR	All personal data processing activities	\N	2025-10-04	annual	2026-10-04	2025-10-04	{e1480453-f333-4582-8ee1-889721af3428}	\N	\N	{privacy,data-protection,gdpr}	\N	t	30	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N	compliance	\N	\N	2025-12-03 10:53:17.711787	2025-12-03 10:53:17.711787
aeb65b02-95ff-49b6-8a73-a904cf28744d	Access Control Policy	\N	compliance	published	2.2	\N	\N	\N	\N	2025-12-03 10:53:17.715684	2025-12-03 10:53:17.715684	\N	\N	\N	2	This policy governs user access to systems, applications, and data...	To implement principles of least privilege and ensure appropriate access controls	All information systems and data	\N	2025-08-25	annual	2026-08-25	2025-08-25	{f716f9c4-e558-453b-ba53-41b3c8d225e0,e851d527-3f07-4201-98d0-602a3b5f6572,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{access-control,iam,security}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 10:53:17.715684	2025-12-03 10:53:17.715684
c887898e-acb1-46f0-95d3-5deac3ab3e58	Password Management Policy	\N	compliance	published	1.8	\N	\N	\N	\N	2025-12-03 10:53:17.720578	2025-12-03 10:53:17.720578	\N	\N	\N	1	This policy establishes requirements for password creation, storage, and management...	To ensure strong password practices and prevent unauthorized access	All users with system access	\N	2025-11-03	annual	2026-11-03	2025-11-03	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{password,authentication,security}	\N	t	14	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 10:53:17.720578	2025-12-03 10:53:17.720578
206f57c0-9a68-45cd-80e6-0d7e599bef24	Information Security Policy	\N	compliance	published	2.1	\N	\N	\N	\N	2025-12-03 10:53:41.812164	2025-12-03 10:53:41.812164	\N	\N	\N	2	This policy establishes the framework for protecting organizational information assets...	To ensure the confidentiality, integrity, and availability of information assets	All employees, contractors, and third parties with access to organizational information	\N	2025-09-04	annual	2026-09-04	2025-09-04	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{security,information-security,iso27001}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 10:53:41.812164	2025-12-03 10:53:41.812164
15dc86ac-1191-4139-9a30-85a727a2d534	Data Privacy and Protection Policy	\N	compliance	published	1.5	\N	\N	\N	\N	2025-12-03 10:53:41.840729	2025-12-03 10:53:41.840729	\N	\N	\N	1	This policy governs the collection, use, and protection of personal data...	To ensure compliance with data protection regulations including GDPR, PDPL, and ADGM DPR	All personal data processing activities	\N	2025-10-04	annual	2026-10-04	2025-10-04	{e1480453-f333-4582-8ee1-889721af3428}	\N	\N	{privacy,data-protection,gdpr}	\N	t	30	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N	compliance	\N	\N	2025-12-03 10:53:41.840729	2025-12-03 10:53:41.840729
84bcd4c1-61ea-4888-b957-18a1377d7cc7	Access Control Policy	\N	compliance	published	2.2	\N	\N	\N	\N	2025-12-03 10:53:41.845563	2025-12-03 10:53:41.845563	\N	\N	\N	2	This policy governs user access to systems, applications, and data...	To implement principles of least privilege and ensure appropriate access controls	All information systems and data	\N	2025-08-25	annual	2026-08-25	2025-08-25	{f716f9c4-e558-453b-ba53-41b3c8d225e0,e851d527-3f07-4201-98d0-602a3b5f6572,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{access-control,iam,security}	\N	t	30	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	\N	2025-12-03 10:53:41.845563	2025-12-03 10:53:41.845563
75e28611-39f0-4333-b17e-c88ba7ac63ff	Vendor Management Policy	Policy for managing third-party vendors, including due diligence, contracts, and ongoing monitoring. Ensures vendor relationships meet security and compliance standards.	operational	in_review	1.2	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	2025-12-29 17:00:26.937	2025-11-29 17:00:26.947482	2025-11-29 17:00:26.947482	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-03 09:41:52.851376	2025-12-03 09:41:52.855635
e55484d2-6280-4ec5-81f8-9a95d391f14f	Password Management Policy	\N	compliance	published	1.8	\N	\N	\N	\N	2025-12-03 10:53:41.850989	2025-12-03 10:53:41.850989	\N	\N	\N	1	This policy establishes requirements for password creation, storage, and management...	To ensure strong password practices and prevent unauthorized access	All users with system access	\N	2025-11-03	annual	2026-12-26	2025-11-03	{f716f9c4-e558-453b-ba53-41b3c8d225e0,f5f75141-2e48-4988-b85a-6a8e5f7e9966}	\N	\N	{password,authentication,security}	\N	t	14	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	security	\N	2025-12-04	2025-12-03 10:53:41.850989	2025-12-04 08:35:27.292545
c3aecd91-f668-4713-a047-c4e89e1680b4	E2E Test Policy 1764854075367	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-04 13:14:36.393189	2025-12-04 13:14:36.393189	\N	\N	\N	1	<p>&lt;p&gt;E2E test policy content&lt;/p&gt;</p>	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Information Security	\N	2025-12-04	2025-12-04 13:14:36.393189	2025-12-04 13:14:36.393189
6d7e269c-1443-4694-b26a-1c0a40b72756	E2E Test Policy 1764854518383	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-04 13:21:59.422671	2025-12-04 13:21:59.422671	\N	\N	\N	1	<p>&lt;p&gt;E2E test policy content&lt;/p&gt;</p>	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Information Security	\N	2025-12-04	2025-12-04 13:21:59.422671	2025-12-04 13:21:59.422671
be63ce8a-2936-4fa8-9be6-c024291ccf6f	E2E Test Policy 1764855640436	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-04 13:40:41.503691	2025-12-04 13:40:41.503691	\N	\N	\N	1	<p>&lt;p&gt;E2E test policy content&lt;/p&gt;</p>	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Information Security	\N	2025-12-04	2025-12-04 13:40:41.503691	2025-12-04 13:40:41.503691
bdce65a7-d0c9-4f91-9185-210b53e1588e	Test Digital Signature Policy	This is a test policy for testing digital signature functionality	compliance	draft	\N	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N	2025-12-04 16:33:33.568031	2025-12-04 16:33:33.568031	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	\N	\N	\N	2025-12-04 16:33:33.568031	2025-12-04 16:33:33.568031
e4800db7-6a2d-4c64-b224-017c749c015e	E2E Test Policy for CO 1765639771299	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 15:29:48.29347	2025-12-13 15:29:48.29347	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765639771299	\N	2025-12-13	2025-12-13 15:29:48.29347	2025-12-13 15:29:48.29347
d9ff502f-41fb-47ca-ba58-60462a3407fb	E2E Test Policy for CO 1765639918941	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 15:32:01.318375	2025-12-13 15:32:01.318375	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765639918941	\N	2025-12-13	2025-12-13 15:32:01.318375	2025-12-13 15:32:01.318375
5a08c213-998a-42c4-99fd-89982cf01231	E2E Test Policy 1765640019043	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 15:33:44.708008	2025-12-13 15:33:44.708008	\N	\N	\N	1	<p>Test policy content for E2E testing</p>	Test policy purpose for E2E testing	Test policy scope description	\N	\N	annual	2026-12-13	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765640019043	\N	2025-12-13	2025-12-13 15:33:44.708008	2025-12-13 15:33:44.708008
894ddab3-f72e-4c62-bd81-c6da8b7db19d	E2E Test Policy 1765644105866	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 16:41:52.601681	2025-12-13 16:41:52.601681	\N	\N	\N	1	<p>Test policy content for E2E testing</p>	Test policy purpose for E2E testing	Test policy scope description	\N	\N	annual	2026-12-13	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765644105866	\N	2025-12-13	2025-12-13 16:41:52.601681	2025-12-13 16:41:52.601681
a176817d-d358-47ba-8879-e7ef16455e12	E2E Test Policy for CO 1765644195756	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 16:43:20.47417	2025-12-13 16:43:20.47417	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765644195756	\N	2025-12-13	2025-12-13 16:43:20.47417	2025-12-13 16:43:20.47417
5320520e-74af-4db7-8ba1-49519f21733b	E2E Test Policy 1765644210589	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 16:43:43.352815	2025-12-13 16:43:43.352815	\N	\N	\N	1	<p>Test policy content for E2E testing</p>	Test policy purpose for E2E testing	Test policy scope description	\N	\N	annual	2026-12-13	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765644210589	\N	2025-12-13	2025-12-13 16:43:43.352815	2025-12-13 16:43:43.352815
b4a6f353-3ee1-41e9-9a5b-1d8209ffa973	E2E Test Policy for CO 1765644249363	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 16:44:19.56552	2025-12-13 16:44:19.56552	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765644249363	\N	2025-12-13	2025-12-13 16:44:19.56552	2025-12-13 16:44:19.56552
d15270d3-ea04-4fca-a6e7-13045158b317	E2E Test Policy 1765644270548	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 16:44:40.734994	2025-12-13 16:44:40.734994	\N	\N	\N	1	<p>Test policy content for E2E testing</p>	Test policy purpose for E2E testing	Test policy scope description	\N	\N	annual	2026-12-13	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765644270548	\N	2025-12-13	2025-12-13 16:44:40.734994	2025-12-13 16:44:40.734994
1ee5e1ba-2379-4fa3-8228-6420aa657a54	E2E Test Policy for CO 1765644327540	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 16:45:43.517813	2025-12-13 16:45:43.517813	\N	\N	\N	1	\N	\N	\N	\N	\N	annual	\N	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765644327540	\N	2025-12-13	2025-12-13 16:45:43.517813	2025-12-13 16:45:43.517813
f0dffdc9-4806-429c-a37a-670488caa6d8	E2E Test Policy 1765644351444	\N	compliance	draft	\N	\N	\N	\N	\N	2025-12-13 16:46:00.250965	2025-12-13 16:46:00.250965	\N	\N	\N	1	<p>Test policy content for E2E testing</p>	Test policy purpose for E2E testing	Test policy scope description	\N	\N	annual	2026-12-13	\N	\N	\N	\N	\N	\N	t	30	\N	\N	\N	Test Policy Type 1765644351444	\N	2025-12-13	2025-12-13 16:46:00.250965	2025-12-13 16:46:00.250965
\.


--
-- Data for Name: policy_acknowledgments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.policy_acknowledgments (id, policy_id, user_id, policy_version, acknowledged_at, ip_address, user_agent, assigned_at, due_date, reminder_sent_count, last_reminder_sent, created_at) FROM stdin;
\.


--
-- Data for Name: remediation_trackers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.remediation_trackers (id, finding_id, remediation_priority, sla_due_date, remediation_steps, assigned_to_id, progress_percent, progress_notes, completion_date, sla_met, days_to_completion, completion_evidence, completion_notes, created_by, created_at, updated_by, updated_at) FROM stdin;
c233d4f3-6cba-4fde-b1b1-f237895e6338	bf1b1b07-9058-485a-9bc6-7817b21b3ed4	critical	2025-12-09	\N	\N	0	\N	\N	f	\N	\N	\N	\N	2025-12-04 20:06:34	\N	2025-12-04 20:06:34
d679f458-2ea3-49dc-8494-e0ac95a63d8d	b0f46052-1742-454b-80a2-742755f8dba8	high	2025-12-12	\N	\N	20	\N	\N	f	\N	\N	\N	\N	2025-12-04 20:06:34	\N	2025-12-04 20:06:34
4401a519-e034-4326-880b-1341c71f38c2	700d18a1-ce95-4c1e-a9db-67a5b8ad05ef	medium	2025-12-15	\N	\N	40	\N	\N	f	\N	\N	\N	\N	2025-12-04 20:06:34	\N	2025-12-04 20:06:34
6a53b637-574d-4754-8af4-1dae3c0a37e6	1db1132d-1260-4903-8eef-38a6bb769f1b	low	2025-12-18	\N	\N	60	\N	\N	f	\N	\N	\N	\N	2025-12-04 20:06:34	\N	2025-12-04 20:06:34
a26de81e-9813-47dd-8079-13bb5a757a37	49fd0d4b-fc0a-45e9-97e5-f05fedc85e3e	critical	2025-12-21	\N	\N	80	\N	\N	f	\N	\N	\N	\N	2025-12-04 20:06:34	\N	2025-12-04 20:06:34
\.


--
-- Data for Name: report_template_versions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report_template_versions (id, template_id, version_number, name, description, report_type, format, field_selection, filters, "grouping", is_scheduled, schedule_frequency, schedule_cron, schedule_time, distribution_list_id, is_active, version_comment, created_by_id, created_at) FROM stdin;
e839a533-d65b-4e17-8394-3fa70cbce42d	82238d6e-26b8-4e60-8d71-d5082c903029	1	Audit Trail Report (Copy)	Complete audit trail of all asset changes and activities	asset_inventory	excel	["uniqueIdentifier", "assetDescription", "assetTypeId", "manufacturer", "model", "serialNumber", "assetTag", "ownerId", "businessUnitId", "physicalLocation", "businessPurpose", "criticalityLevel", "complianceRequirements"]	{}	{}	f	\N	\N	\N	\N	f	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 18:58:33.045482+00
\.


--
-- Data for Name: report_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report_templates (id, name, description, report_type, format, field_selection, filters, "grouping", is_scheduled, schedule_frequency, schedule_cron, schedule_time, distribution_list_id, is_active, last_run_at, next_run_at, created_by_id, created_at, updated_at, is_system_template, version, is_shared, shared_with_user_ids, shared_with_team_ids, is_organization_wide) FROM stdin;
55f202e2-b5f6-4ae8-bb6c-24a6b7f6ff83	Executive Summary Report	High-level overview of asset inventory, compliance status, and key metrics for executive review	asset_inventory	pdf	["uniqueIdentifier", "assetDescription", "criticalityLevel", "ownerId", "businessUnitId", "complianceRequirements"]	{}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.093189	2025-12-17 16:13:23.093189	t	1	f	[]	[]	f
e1c9a71c-79bb-4f8d-a32e-8fdadc4d1946	Asset Inventory Report	Complete inventory of all physical assets with key details	asset_inventory	excel	["uniqueIdentifier", "assetDescription", "manufacturer", "model", "serialNumber", "assetTag", "criticalityLevel", "ownerId", "businessUnitId", "physicalLocation", "purchaseDate", "warrantyExpiry"]	{}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.115019	2025-12-17 16:13:23.115019	t	1	f	[]	[]	f
da46d051-fc94-4311-b1f3-6ee4c5eea8d5	Compliance Status Report	Overview of compliance status across all assets and frameworks	compliance_report	excel	[]	{}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.117256	2025-12-17 16:13:23.117256	t	1	f	[]	[]	f
ebfab17c-51d3-4e44-9e6b-23524bcd6e5b	Security Test Summary	Summary of security test results for all assets	security_test_report	excel	[]	{}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.119369	2025-12-17 16:13:23.119369	t	1	f	[]	[]	f
93ee2ced-6d0d-4e9f-818b-f9161c4b3a8a	Assets Without Owners	List of all assets that do not have assigned owners	asset_inventory	excel	["uniqueIdentifier", "assetDescription", "assetTypeId", "criticalityLevel", "businessUnitId", "physicalLocation"]	{"ownerId": null}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.121337	2025-12-17 16:13:23.121337	t	1	f	[]	[]	f
0ff4bb62-65b0-4294-a65e-6dc591ba7b26	Assets Missing Information	Assets with missing critical information fields	asset_inventory	excel	["uniqueIdentifier", "assetDescription", "ownerId", "businessUnitId", "criticalityLevel"]	{}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.122949	2025-12-17 16:13:23.122949	t	1	f	[]	[]	f
ce394663-3f50-4fe6-99c3-aaeefdc12049	Assets by Compliance Scope	Assets grouped by compliance framework and scope	asset_inventory	excel	["uniqueIdentifier", "assetDescription", "complianceRequirements", "criticalityLevel", "ownerId"]	{}	{"groupBy": "complianceScope"}	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.124617	2025-12-17 16:13:23.124617	t	1	f	[]	[]	f
14576710-50af-4ee8-b6d1-2b32cf0d4253	Software Inventory Report	Complete inventory of all software assets	software_inventory	excel	[]	{}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.126091	2025-12-17 16:13:23.126091	t	1	f	[]	[]	f
aab7a958-2fe7-4704-8ac0-a977a95d6dfb	Contract Expiration Report	Contracts and agreements expiring within the next 90 days	contract_expiration	excel	[]	{"days": 90}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.128001	2025-12-17 16:13:23.128001	t	1	f	[]	[]	f
9073f86a-8f49-41b3-ad49-c6b71f87cd75	Supplier Criticality Report	Suppliers ranked by criticality and risk level	supplier_criticality	excel	[]	{}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.130223	2025-12-17 16:13:23.130223	t	1	f	[]	[]	f
168bf3a2-d76b-46e5-baca-20e85fe23d2c	Risk Assessment Summary	Summary of risk assessments for all assets	asset_inventory	pdf	["uniqueIdentifier", "assetDescription", "criticalityLevel", "complianceRequirements"]	{}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.131467	2025-12-17 16:13:23.131467	t	1	f	[]	[]	f
51516224-4488-482c-93bf-cc652a2847af	Audit Trail Report	Complete audit trail of all asset changes and activities	asset_inventory	csv	[]	{}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.132686	2025-12-17 16:13:23.132686	t	1	f	[]	[]	f
c59ee72e-2649-431e-8a0a-8cd325f87102	High Criticality Assets	All assets with high or critical criticality levels	asset_inventory	excel	["uniqueIdentifier", "assetDescription", "criticalityLevel", "ownerId", "businessUnitId", "complianceRequirements"]	{"criticalityLevel": ["high", "critical"]}	\N	f	\N	\N	\N	\N	t	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:13:23.133977	2025-12-17 16:13:23.133977	t	1	f	[]	[]	f
82238d6e-26b8-4e60-8d71-d5082c903029	Audit Trail Report (Copy)	Complete audit trail of all asset changes and activities	asset_inventory	excel	["uniqueIdentifier", "assetDescription", "assetTypeId", "manufacturer", "model", "serialNumber", "assetTag", "ownerId", "businessUnitId", "physicalLocation", "businessPurpose", "criticalityLevel", "complianceRequirements"]	{}	{}	f	\N	\N	\N	\N	f	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 16:36:03.03651	2025-12-17 18:58:33.055669	f	2	t	["b1b35a04-894c-4b77-b209-8d79bee05ec9", "01180d49-d38b-4421-a130-b1ce4b7c34fa"]	[]	f
\.


--
-- Data for Name: risk_assessment_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risk_assessment_requests (id, request_identifier, risk_id, requested_by_id, requested_for_id, assessment_type, priority, status, due_date, justification, notes, approval_workflow_id, approved_by_id, approved_at, rejected_by_id, rejected_at, rejection_reason, completed_at, resulting_assessment_id, created_at, updated_at) FROM stdin;
7989e35f-d32d-4854-a833-bb1f744de4b8	REQ-202512-0001	8546665c-d856-4641-b97f-7e20f1dcbfac	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13	E2E testing of assessment request functionality - ensuring all fields are properly filled	E2E Test Assessment Request - Testing all form fields	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 20:20:49.288157	2025-12-14 20:20:49.288157
6460dd74-5a84-4c3a-83b0-218024687617	REQ-202512-0002	94280df5-b679-4b5b-bf6c-8500a719f183	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13		E2E Test Assessment Request - Created by comprehensive test	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 20:21:43.606705	2025-12-14 20:21:43.606705
ae9cea92-5276-426e-a5d7-c79d3e7452d4	REQ-202512-0003	8546665c-d856-4641-b97f-7e20f1dcbfac	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13	E2E testing of assessment request functionality - ensuring all fields are properly filled	E2E Test Assessment Request - Testing all form fields	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 20:23:44.50532	2025-12-14 20:23:44.50532
65ba57e7-d59f-4240-9224-d6c842d818bf	REQ-202512-0004	94280df5-b679-4b5b-bf6c-8500a719f183	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13		E2E Test Assessment Request - Created by comprehensive test	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 20:25:50.297928	2025-12-14 20:25:50.297928
37db74ee-4aaf-4217-8893-41a3757cf781	REQ-202512-0005	94280df5-b679-4b5b-bf6c-8500a719f183	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13		E2E Test Assessment Request - Created by comprehensive test	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 20:34:13.024495	2025-12-14 20:34:13.024495
55c444ca-78d0-4854-bec4-9893f366eb20	REQ-202512-0006	94280df5-b679-4b5b-bf6c-8500a719f183	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13		E2E Test Assessment Request - Created by comprehensive test	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 20:37:49.597441	2025-12-14 20:37:49.597441
0f71c2ff-e5b0-42bf-bcc7-7b45ec66bfc7	REQ-202512-0007	94280df5-b679-4b5b-bf6c-8500a719f183	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13		E2E Test Assessment Request - Created by comprehensive test	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 20:48:21.460289	2025-12-14 20:48:21.460289
6c798eae-2921-4da7-89a8-55027eb8258d	REQ-202512-0008	8546665c-d856-4641-b97f-7e20f1dcbfac	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13		E2E Test Assessment Request - Created by comprehensive test	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 20:53:41.573876	2025-12-14 20:53:41.573876
0c7b2a3c-4226-4055-a040-9132a46e9c60	REQ-202512-0009	94280df5-b679-4b5b-bf6c-8500a719f183	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13		E2E Test Assessment Request - Created by comprehensive test	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 20:56:39.335696	2025-12-14 20:56:39.335696
34049196-c071-41cd-a03f-195efbaaa9a0	REQ-202512-0010	94280df5-b679-4b5b-bf6c-8500a719f183	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-13	E2E Test Assessment Request - Testing assessment request creation	E2E Test Notes - Testing assessment request creation from standalone page	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-14 21:39:49.999598	2025-12-14 21:39:49.999598
e0d4e8ea-109e-4878-ad7f-299417a075db	REQ-202512-0011	94280df5-b679-4b5b-bf6c-8500a719f183	b1b35a04-894c-4b77-b209-8d79bee05ec9	550e8400-e29b-41d4-a716-446655440001	inherent	medium	pending	2025-12-11			\N	\N	\N	\N	\N	\N	\N	\N	2025-12-15 08:37:12.34982	2025-12-15 08:37:12.34982
ebdcf2c9-be22-4b01-b5ac-38a5a5f929ff	REQ-202512-0012	8546665c-d856-4641-b97f-7e20f1dcbfac	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	current	medium	pending	2026-01-14		E2E Test Assessment Request - Created by comprehensive test	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-15 08:44:44.425064	2025-12-15 08:44:44.425064
\.


--
-- Data for Name: risk_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risk_assessments (id, risk_id, likelihood, impact, risk_score, risk_level, financial_impact, financial_impact_amount, operational_impact, reputational_impact, compliance_impact, safety_impact, assessment_date, assessor_id, assessment_method, assessment_notes, assumptions, confidence_level, evidence_attachments, is_latest, created_by, created_at, updated_at, assessment_type) FROM stdin;
d840aaac-8d5b-47a6-a7e0-0dd094feaca0	5a560cb8-7536-4f0b-b414-82b91e6a7504	4	5	20	critical	moderate	\N	moderate	minor	minor	\N	2025-10-11	580d01e1-da18-49be-84aa-957ee84719ab	qualitative_5x5	\N	\N	medium	\N	t	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.120902	2025-12-07 20:01:51.120902	inherent
8f5ac795-95ed-4fbb-bb51-59893a204453	5a560cb8-7536-4f0b-b414-82b91e6a7504	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-12-07	580d01e1-da18-49be-84aa-957ee84719ab	qualitative_5x5	\N	\N	medium	\N	t	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.124483	2025-12-07 20:01:51.124483	current
48bfb4be-9069-40d9-ab8f-bb48789c65fe	5a560cb8-7536-4f0b-b414-82b91e6a7504	2	3	6	medium	minor	\N	minor	negligible	negligible	\N	2025-12-07	580d01e1-da18-49be-84aa-957ee84719ab	qualitative_5x5	\N	\N	high	\N	t	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.125838	2025-12-07 20:01:51.125838	target
37c4c813-dfca-4923-92a0-e0fe17a60ea4	ed178ab4-0fd5-432b-b7dd-9e37c6dc089d	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-09-13	580d01e1-da18-49be-84aa-957ee84719ab	qualitative_5x5	\N	\N	medium	\N	t	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.127201	2025-12-07 20:01:51.127201	inherent
da0672c2-5fba-4555-aa9b-fb5201d20ab5	ed178ab4-0fd5-432b-b7dd-9e37c6dc089d	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-12-07	580d01e1-da18-49be-84aa-957ee84719ab	qualitative_5x5	\N	\N	medium	\N	t	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.128504	2025-12-07 20:01:51.128504	current
cc4f6eac-d2ee-47ce-8e5f-360bea3dbc15	ed178ab4-0fd5-432b-b7dd-9e37c6dc089d	2	3	6	medium	minor	\N	minor	negligible	negligible	\N	2025-12-07	580d01e1-da18-49be-84aa-957ee84719ab	qualitative_5x5	\N	\N	high	\N	t	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.129523	2025-12-07 20:01:51.129523	target
3259656e-3590-4ce1-b66f-ba6b66403d4d	33f6eccf-5f7a-4cc7-bc1c-b1e5c8fc9380	2	5	10	medium	moderate	\N	moderate	minor	minor	\N	2025-09-16	e4a2a06a-e399-4efb-895e-f607075a50a9	qualitative_5x5	\N	\N	medium	\N	t	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-07 20:01:51.130808	2025-12-07 20:01:51.130808	inherent
0ac4d8a2-119c-4a59-9f5b-6619e6bc66a2	33f6eccf-5f7a-4cc7-bc1c-b1e5c8fc9380	2	5	10	medium	moderate	\N	moderate	minor	minor	\N	2025-12-07	e4a2a06a-e399-4efb-895e-f607075a50a9	qualitative_5x5	\N	\N	medium	\N	t	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-07 20:01:51.131865	2025-12-07 20:01:51.131865	current
9ddd8de5-11a9-41c8-8967-823ea9b55da5	33f6eccf-5f7a-4cc7-bc1c-b1e5c8fc9380	1	4	4	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	e4a2a06a-e399-4efb-895e-f607075a50a9	qualitative_5x5	\N	\N	high	\N	t	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-07 20:01:51.132597	2025-12-07 20:01:51.132597	target
904b575b-2b98-44b3-8886-ab6a2f7303c2	e247319a-b7fd-4e8b-8b74-a92187d95344	2	5	10	medium	moderate	\N	moderate	minor	minor	\N	2025-09-29	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	qualitative_5x5	\N	\N	medium	\N	t	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:01:51.133776	2025-12-07 20:01:51.133776	inherent
69a7a17c-d15e-429b-a1fa-33690aa29e7b	e247319a-b7fd-4e8b-8b74-a92187d95344	1	4	4	low	moderate	\N	moderate	minor	minor	\N	2025-12-07	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	qualitative_5x5	\N	\N	medium	\N	t	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:01:51.134856	2025-12-07 20:01:51.134856	current
b76dd577-69e2-4e3a-813f-8a92a4f3e126	e247319a-b7fd-4e8b-8b74-a92187d95344	1	3	3	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	qualitative_5x5	\N	\N	high	\N	t	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:01:51.136117	2025-12-07 20:01:51.136117	target
aadbd3c3-90f9-48f3-90a5-0279f8e88f1d	75e18228-b8ab-4fa4-9668-2c667050a24a	3	3	9	medium	moderate	\N	moderate	minor	minor	\N	2025-12-01	b5525c73-c26a-48d4-a90a-582fa451e518	qualitative_5x5	\N	\N	medium	\N	t	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:51.137325	2025-12-07 20:01:51.137325	inherent
668b350a-0834-45e2-a98f-b53bcf9bb0ea	75e18228-b8ab-4fa4-9668-2c667050a24a	3	3	9	medium	moderate	\N	moderate	minor	minor	\N	2025-12-07	b5525c73-c26a-48d4-a90a-582fa451e518	qualitative_5x5	\N	\N	medium	\N	t	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:51.1384	2025-12-07 20:01:51.1384	current
02e46fa2-47ae-4593-aa25-ccdc0ca97b75	75e18228-b8ab-4fa4-9668-2c667050a24a	2	2	4	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	b5525c73-c26a-48d4-a90a-582fa451e518	qualitative_5x5	\N	\N	high	\N	t	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:51.139356	2025-12-07 20:01:51.139356	target
a5ce94d1-5451-4011-b8ea-9c43e2ec331f	bb4f3dee-958c-4687-b4c7-85e7e9561356	2	4	8	medium	moderate	\N	moderate	minor	minor	\N	2025-10-13	01180d49-d38b-4421-a130-b1ce4b7c34fa	qualitative_5x5	\N	\N	medium	\N	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:01:51.140159	2025-12-07 20:01:51.140159	inherent
55cab3b1-b704-41f2-895d-96ea025d6682	bb4f3dee-958c-4687-b4c7-85e7e9561356	2	4	8	medium	moderate	\N	moderate	minor	minor	\N	2025-12-07	01180d49-d38b-4421-a130-b1ce4b7c34fa	qualitative_5x5	\N	\N	medium	\N	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:01:51.140847	2025-12-07 20:01:51.140847	current
13e5e735-e2d1-496d-9e3f-daaaf8c18c3e	bb4f3dee-958c-4687-b4c7-85e7e9561356	1	3	3	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	01180d49-d38b-4421-a130-b1ce4b7c34fa	qualitative_5x5	\N	\N	high	\N	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:01:51.141406	2025-12-07 20:01:51.141406	target
a518dfa3-8994-4d6a-9d54-4f84b3be7805	1e4eae01-4f38-4798-a557-22f29a066bfe	1	5	5	low	moderate	\N	moderate	minor	minor	\N	2025-12-06	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	qualitative_5x5	\N	\N	medium	\N	t	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:01:51.142249	2025-12-07 20:01:51.142249	inherent
b5a001a9-8974-424d-9e69-a799a2cb50d6	1e4eae01-4f38-4798-a557-22f29a066bfe	1	5	5	low	moderate	\N	moderate	minor	minor	\N	2025-12-07	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	qualitative_5x5	\N	\N	medium	\N	t	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:01:51.143086	2025-12-07 20:01:51.143086	current
9ccebabc-b4e8-445f-b823-d9ee76780bf1	1e4eae01-4f38-4798-a557-22f29a066bfe	1	4	4	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	qualitative_5x5	\N	\N	high	\N	t	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:01:51.144058	2025-12-07 20:01:51.144058	target
11128c90-79e4-423d-9ef5-7e8e2277b815	66e8a0a2-ef3e-47f0-945c-faa96545458b	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-10-14	e7f8a16b-c291-4696-8be0-992c381c8013	qualitative_5x5	\N	\N	medium	\N	t	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:01:51.144772	2025-12-07 20:01:51.144772	inherent
0c95d287-c84b-46d0-8a3c-1b0b33752cc1	66e8a0a2-ef3e-47f0-945c-faa96545458b	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-12-07	e7f8a16b-c291-4696-8be0-992c381c8013	qualitative_5x5	\N	\N	medium	\N	t	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:01:51.145812	2025-12-07 20:01:51.145812	current
efdcf269-9483-4ece-86b6-6a6e600ff7bc	66e8a0a2-ef3e-47f0-945c-faa96545458b	2	3	6	medium	minor	\N	minor	negligible	negligible	\N	2025-12-07	e7f8a16b-c291-4696-8be0-992c381c8013	qualitative_5x5	\N	\N	high	\N	t	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:01:51.147076	2025-12-07 20:01:51.147076	target
239e4af9-62dc-4192-80c2-59ca17a7d8dd	d8f95727-444a-4c54-bbfe-42d961964622	4	5	20	critical	moderate	\N	moderate	minor	minor	\N	2025-11-08	01180d49-d38b-4421-a130-b1ce4b7c34fa	qualitative_5x5	\N	\N	medium	\N	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:02:03.782581	2025-12-07 20:02:03.782581	inherent
403230fa-7d95-4dd3-ac6c-7a300b932ff1	d8f95727-444a-4c54-bbfe-42d961964622	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-12-07	01180d49-d38b-4421-a130-b1ce4b7c34fa	qualitative_5x5	\N	\N	medium	\N	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:02:03.786128	2025-12-07 20:02:03.786128	current
a0cdc155-2d1f-4fce-a18f-dc4ad96bf89c	d8f95727-444a-4c54-bbfe-42d961964622	2	3	6	medium	minor	\N	minor	negligible	negligible	\N	2025-12-07	01180d49-d38b-4421-a130-b1ce4b7c34fa	qualitative_5x5	\N	\N	high	\N	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:02:03.787938	2025-12-07 20:02:03.787938	target
b1907852-31e0-4d83-ae1a-4a88c0cd5e67	998f72eb-b679-46aa-b224-9a3eadf3d400	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-09-26	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	qualitative_5x5	\N	\N	medium	\N	t	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:02:03.789203	2025-12-07 20:02:03.789203	inherent
51578200-1cdd-4894-97f7-8895f9ee424e	998f72eb-b679-46aa-b224-9a3eadf3d400	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-12-07	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	qualitative_5x5	\N	\N	medium	\N	t	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:02:03.790392	2025-12-07 20:02:03.790392	current
a3a8bba2-ae1f-4294-a553-5884748c66fc	998f72eb-b679-46aa-b224-9a3eadf3d400	2	3	6	medium	minor	\N	minor	negligible	negligible	\N	2025-12-07	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	qualitative_5x5	\N	\N	high	\N	t	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:02:03.791368	2025-12-07 20:02:03.791368	target
402d97b4-995d-4810-b8be-225cf26dca7b	7d20459f-4d3a-4dfa-b43d-210625fa01b8	2	5	10	medium	moderate	\N	moderate	minor	minor	\N	2025-10-13	b5525c73-c26a-48d4-a90a-582fa451e518	qualitative_5x5	\N	\N	medium	\N	t	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:02:03.792114	2025-12-07 20:02:03.792114	inherent
42c2ebfb-2824-4957-bc3b-b6320f122e31	7d20459f-4d3a-4dfa-b43d-210625fa01b8	2	5	10	medium	moderate	\N	moderate	minor	minor	\N	2025-12-07	b5525c73-c26a-48d4-a90a-582fa451e518	qualitative_5x5	\N	\N	medium	\N	t	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:02:03.792834	2025-12-07 20:02:03.792834	current
f0c0c8f6-cae7-4d78-96a2-3543f4e6c8f5	7d20459f-4d3a-4dfa-b43d-210625fa01b8	1	4	4	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	b5525c73-c26a-48d4-a90a-582fa451e518	qualitative_5x5	\N	\N	high	\N	t	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:02:03.794059	2025-12-07 20:02:03.794059	target
37493690-83a1-4a39-b18f-07f7f12ee302	06a6ccaa-2e9f-4334-9a15-6d084f751827	2	5	10	medium	moderate	\N	moderate	minor	minor	\N	2025-10-10	e7f8a16b-c291-4696-8be0-992c381c8013	qualitative_5x5	\N	\N	medium	\N	t	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:02:03.795535	2025-12-07 20:02:03.795535	inherent
ed1e27fe-691d-47a3-b562-ede7f8c876ac	06a6ccaa-2e9f-4334-9a15-6d084f751827	1	4	4	low	moderate	\N	moderate	minor	minor	\N	2025-12-07	e7f8a16b-c291-4696-8be0-992c381c8013	qualitative_5x5	\N	\N	medium	\N	t	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:02:03.796823	2025-12-07 20:02:03.796823	current
97510cf0-3ce0-43e2-b1ea-54039ac5863e	06a6ccaa-2e9f-4334-9a15-6d084f751827	1	3	3	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	e7f8a16b-c291-4696-8be0-992c381c8013	qualitative_5x5	\N	\N	high	\N	t	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:02:03.797824	2025-12-07 20:02:03.797824	target
400c744c-1564-4d59-9ce5-274bdbe9a207	ed5fbbd4-b818-4453-bc61-f30b969543e9	3	3	9	medium	moderate	\N	moderate	minor	minor	\N	2025-10-16	b1b35a04-894c-4b77-b209-8d79bee05ec9	qualitative_5x5	\N	\N	medium	\N	t	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:02:03.798958	2025-12-07 20:02:03.798958	inherent
7ff52f45-5a9d-4fba-ad74-ac19564d99cd	ed5fbbd4-b818-4453-bc61-f30b969543e9	3	3	9	medium	moderate	\N	moderate	minor	minor	\N	2025-12-07	b1b35a04-894c-4b77-b209-8d79bee05ec9	qualitative_5x5	\N	\N	medium	\N	t	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:02:03.79993	2025-12-07 20:02:03.79993	current
7f1ff65b-3b5d-4ba7-b8db-472f9dacac96	ed5fbbd4-b818-4453-bc61-f30b969543e9	2	2	4	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	b1b35a04-894c-4b77-b209-8d79bee05ec9	qualitative_5x5	\N	\N	high	\N	t	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:02:03.800734	2025-12-07 20:02:03.800734	target
2142a7e9-d713-4f64-ac4b-51792c4766a5	1a76d30f-97a2-4f36-aa19-46875e94d171	2	4	8	medium	moderate	\N	moderate	minor	minor	\N	2025-10-16	01180d49-d38b-4421-a130-b1ce4b7c34fa	qualitative_5x5	\N	\N	medium	\N	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:02:03.801832	2025-12-07 20:02:03.801832	inherent
c872ddfb-e3b9-471b-b0bd-4cc5395dfe08	1a76d30f-97a2-4f36-aa19-46875e94d171	2	4	8	medium	moderate	\N	moderate	minor	minor	\N	2025-12-07	01180d49-d38b-4421-a130-b1ce4b7c34fa	qualitative_5x5	\N	\N	medium	\N	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:02:03.802839	2025-12-07 20:02:03.802839	current
f4598bd7-5dd1-490e-b299-1b902df927f9	1a76d30f-97a2-4f36-aa19-46875e94d171	1	3	3	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	01180d49-d38b-4421-a130-b1ce4b7c34fa	qualitative_5x5	\N	\N	high	\N	t	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:02:03.803944	2025-12-07 20:02:03.803944	target
985a90df-216b-45b6-9d42-9a666ba3b351	9655d605-6eae-4568-bce9-498b6c2efc51	1	5	5	low	moderate	\N	moderate	minor	minor	\N	2025-11-08	550e8400-e29b-41d4-a716-446655440001	qualitative_5x5	\N	\N	medium	\N	t	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:02:03.805105	2025-12-07 20:02:03.805105	inherent
5fde89d9-1deb-40f9-b249-fb4c72750d89	9655d605-6eae-4568-bce9-498b6c2efc51	1	5	5	low	moderate	\N	moderate	minor	minor	\N	2025-12-07	550e8400-e29b-41d4-a716-446655440001	qualitative_5x5	\N	\N	medium	\N	t	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:02:03.806505	2025-12-07 20:02:03.806505	current
91cb2866-1392-4a7b-afaa-67cf08f67038	9655d605-6eae-4568-bce9-498b6c2efc51	1	4	4	low	minor	\N	minor	negligible	negligible	\N	2025-12-07	550e8400-e29b-41d4-a716-446655440001	qualitative_5x5	\N	\N	high	\N	t	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:02:03.80721	2025-12-07 20:02:03.80721	target
66bb04ff-59ae-48f8-8944-37ca652ed0fa	e6e37740-e4d6-40c1-bd5b-595f5dff9ae1	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-09-24	e7f8a16b-c291-4696-8be0-992c381c8013	qualitative_5x5	\N	\N	medium	\N	t	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:02:03.807783	2025-12-07 20:02:03.807783	inherent
2a9175e6-f5a4-465e-ad26-4c694a13f4b8	e6e37740-e4d6-40c1-bd5b-595f5dff9ae1	3	4	12	high	moderate	\N	moderate	minor	minor	\N	2025-12-07	e7f8a16b-c291-4696-8be0-992c381c8013	qualitative_5x5	\N	\N	medium	\N	t	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:02:03.808673	2025-12-07 20:02:03.808673	current
e829671d-fe0c-47ad-b63d-88183605bbce	e6e37740-e4d6-40c1-bd5b-595f5dff9ae1	2	3	6	medium	minor	\N	minor	negligible	negligible	\N	2025-12-07	e7f8a16b-c291-4696-8be0-992c381c8013	qualitative_5x5	\N	\N	high	\N	t	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:02:03.810322	2025-12-07 20:02:03.810322	target
72077cfa-9a58-48a5-9208-31b60ae5b663	95d8a18a-1e1c-44ed-9eaa-25dfadac75b5	3	3	9	medium	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	t	\N	2025-12-14 16:08:43.518473	2025-12-14 16:08:43.518473	current
b2c153f0-d7e4-45ef-817b-93a5f8194312	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 17:59:14.877643	2025-12-14 17:59:14.877643	current
01ac92a4-e42c-4255-9979-00c72c7b3357	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:11:15.179736	2025-12-14 18:11:15.179736	current
0c9cdca6-1a58-44f3-a452-efaea7c7b8e8	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:15:43.688327	2025-12-14 18:15:43.688327	current
6b922aad-2d49-4ed7-9697-97b4a772ba75	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:19:50.240761	2025-12-14 18:19:50.240761	current
ed7bde3a-e9b1-4c6a-9641-767a5a0aa22c	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:24:27.341335	2025-12-14 18:24:27.341335	current
cf84b917-db1a-49a9-8797-0c0ec1b3d752	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:29:21.080292	2025-12-14 18:29:21.080292	current
15c8599f-a68f-4c11-965a-2e118c05aefa	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:33:00.367283	2025-12-14 18:33:00.367283	current
6cd5dd5d-ac9d-4918-8996-97357fe55634	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:36:11.116888	2025-12-14 18:36:11.116888	current
1e5fe7a4-003c-45ec-8bbf-449f7464c7df	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:39:56.766284	2025-12-14 18:39:56.766284	current
78befa3c-152d-4608-ae33-ad657641f22a	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:41:15.845334	2025-12-14 18:41:15.845334	current
167dc2f9-613f-4f54-8b4d-841c56c411b0	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:42:23.324752	2025-12-14 18:42:23.324752	current
6bd96377-c1e8-4658-b605-1c4e55e5bfca	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:43:36.632495	2025-12-14 18:43:36.632495	current
1457cee7-df6e-4af4-8de7-0dc2aa265238	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:45:06.244792	2025-12-14 18:45:06.244792	current
c12417d6-690d-4713-8706-3d8917f326ae	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:49:09.810797	2025-12-14 18:49:09.810797	current
6071b196-6c72-4c4c-aca3-0afbfaf6a6e7	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 18:50:35.761218	2025-12-14 18:50:35.761218	current
26ff5950-71a3-4e73-b647-49f9df1211ec	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 19:07:32.499899	2025-12-14 19:07:32.499899	current
c58a44f6-b3f3-406b-9578-4a015d0712e4	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 19:12:19.002798	2025-12-14 19:12:19.002798	current
6778b898-b90e-4bab-b0c3-46350dd9e744	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 19:17:59.807875	2025-12-14 19:17:59.807875	current
ca947af0-307b-484a-95e2-ea95c5d77589	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 19:26:04.154197	2025-12-14 19:26:04.154197	current
891baa81-2e79-4732-93a4-27bb064bb233	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 19:28:22.936583	2025-12-14 19:28:22.936583	current
e304bb4d-1108-43f0-a447-14d6b7437f3c	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 19:30:43.569406	2025-12-14 19:30:43.569406	current
09afdb25-880f-4a53-bedc-94faca7ed43e	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 19:32:07.248376	2025-12-14 19:32:07.248376	current
185a15ff-29b6-4e33-b458-0551a1fecf1d	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	t	\N	2025-12-14 19:35:46.505155	2025-12-14 19:35:46.505155	current
fac5294d-f277-4488-9ba4-20f391f0f182	8546665c-d856-4641-b97f-7e20f1dcbfac	4	4	16	high	\N	\N	\N	\N	\N	\N	2025-12-14	\N	qualitative_5x5	\N	\N	medium	\N	f	\N	2025-12-14 19:33:34.854867	2025-12-14 19:33:34.854867	current
\.


--
-- Data for Name: risk_asset_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risk_asset_links (id, risk_id, asset_type, asset_id, impact_description, asset_criticality_at_link, linked_by, linked_at, updated_at) FROM stdin;
e64c2263-8436-4fa5-997b-117d2f5d26b8	998f72eb-b679-46aa-b224-9a3eadf3d400	physical	b674dae7-b704-4d0c-a033-037fe3e1a109	\N	\N	\N	2025-12-08 16:32:43.481892	2025-12-08 16:32:43.481892
6899aa51-0d73-4e8c-9dea-2d2e9477e714	95d8a18a-1e1c-44ed-9eaa-25dfadac75b5	physical	beec46c6-395a-49a7-8829-16a8bcecb8aa	\N	\N	\N	2025-12-14 16:21:51.822714	2025-12-14 16:21:51.822714
beed6dfa-ce50-41d5-80d7-d7b9fdc9a848	95d8a18a-1e1c-44ed-9eaa-25dfadac75b5	physical	d41bedf6-dea6-4421-b0c1-807020a6baa3	\N	\N	\N	2025-12-14 17:16:04.950471	2025-12-14 17:16:04.950471
e2d1b5a5-1546-4be6-aeda-b1556e4a4df1	8546665c-d856-4641-b97f-7e20f1dcbfac	physical	beec46c6-395a-49a7-8829-16a8bcecb8aa	\N	\N	\N	2025-12-14 19:18:10.014044	2025-12-14 19:18:10.014044
\.


--
-- Data for Name: risk_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risk_categories (id, name, code, description, parent_category_id, risk_tolerance, is_active, display_order, color, icon, created_by, created_at, updated_by, updated_at, deleted_at) FROM stdin;
e3bbcbf3-803a-468a-8960-2d9bdd9c64d2	Strategic Risks	STRATEGIC	Risks related to business strategy, market positioning, and competitive landscape	\N	medium	t	1	#6366f1	target	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
be91f319-0d65-435f-9997-edd1be2a0b40	Operational Risks	OPERATIONAL	Risks arising from internal processes, people, and systems failures	\N	medium	t	2	#f59e0b	cog	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
ef25794f-0c38-44dd-b530-8a3ae17460c0	Technology/Cybersecurity Risks	CYBERSECURITY	Risks related to information technology, cyber threats, and data security	\N	low	t	3	#ef4444	shield	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
0e372d00-dc3d-431e-b939-af0c51f12873	Financial Risks	FINANCIAL	Risks related to financial losses, market fluctuations, and liquidity	\N	medium	t	4	#10b981	dollar-sign	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
4a777674-67f4-40db-adc2-753c5a8edb18	Compliance & Legal Risks	COMPLIANCE	Risks arising from regulatory requirements, legal obligations, and contractual commitments	\N	low	t	5	#8b5cf6	scale	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
cbe10848-9b4d-4631-8e3f-1c1f6ca777ea	Reputational Risks	REPUTATIONAL	Risks that could damage the organization's reputation and stakeholder trust	\N	low	t	6	#ec4899	users	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
7da82021-e205-4c57-a5c3-ca40af87bd3d	Third-Party/Vendor Risks	VENDOR	Risks arising from relationships with suppliers, partners, and service providers	\N	medium	t	7	#14b8a6	link	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
5d860e13-b95c-4309-ba94-52afb1edde68	Human Resources Risks	HR	Risks related to workforce, talent management, and employee conduct	\N	medium	t	8	#f97316	user-group	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
c41e4a1d-f0f0-422e-a979-3dd668c2690c	Environmental/Physical Risks	ENVIRONMENTAL	Risks from natural disasters, climate change, and physical security	\N	medium	t	9	#22c55e	globe	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
d6deca49-4446-42a7-983e-5590eb3fc249	Project Risks	PROJECT	Risks specific to project execution, delivery, and management	\N	medium	t	10	#3b82f6	clipboard-list	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
d0e3026d-9c20-4ba0-bfc1-4a7bbafaeb3e	Data Privacy Risks	PRIVACY	Risks related to personal data protection and privacy regulations	\N	low	t	11	#a855f7	lock	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
19b2a663-94f2-44db-9d2c-c3a59d2b908b	Business Continuity Risks	CONTINUITY	Risks that could disrupt business operations and service delivery	\N	low	t	12	#0ea5e9	refresh	\N	2025-12-07 18:56:00.215638	\N	2025-12-07 18:56:00.215638	\N
\.


--
-- Data for Name: risk_control_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risk_control_links (id, risk_id, control_id, effectiveness_rating, effectiveness_type, control_type_for_risk, notes, linked_by, linked_at, last_effectiveness_review, updated_at) FROM stdin;
bb5972c1-5374-4255-923a-03a966215378	d8f95727-444a-4c54-bbfe-42d961964622	4f26dfa5-2e88-4160-9741-e8d4753fd703	4	scale	\N	Control UCL-ENC-001 mitigates this risk	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:02:03.900863	\N	2025-12-07 20:02:03.900863
7e58e40a-6081-4909-8250-ac5c368057fe	998f72eb-b679-46aa-b224-9a3eadf3d400	57ab59e4-0a22-47ca-9f63-90b1cb2d5ad0	4	scale	\N	Control UCL-PW-001 mitigates this risk	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:02:03.902137	\N	2025-12-07 20:02:03.902137
4ade47ea-8c99-435c-b501-8efba7f28ed2	ed5fbbd4-b818-4453-bc61-f30b969543e9	99df57a6-1efc-4693-bd96-222a0e1d72bb	4	scale	\N	Control UCL-ENC-002 mitigates this risk	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:02:03.902713	\N	2025-12-07 20:02:03.902713
106082b1-7db0-4d9a-8268-579acee152aa	d8f95727-444a-4c54-bbfe-42d961964622	05e9dc0a-3415-4ff4-8531-04cf9bd95794	\N	scale	\N	\N	\N	2025-12-08 19:38:26.763995	\N	2025-12-08 19:38:26.763995
60232f72-e449-4a29-a01d-69039c6df4fd	95d8a18a-1e1c-44ed-9eaa-25dfadac75b5	606b8372-9eea-49d7-a1af-e218c66eed54	\N	scale	\N	\N	\N	2025-12-14 16:15:54.787112	\N	2025-12-14 16:15:54.787112
b0b5a81e-7823-4529-9bbb-4665116e7410	8546665c-d856-4641-b97f-7e20f1dcbfac	606b8372-9eea-49d7-a1af-e218c66eed54	\N	scale	\N	\N	\N	2025-12-14 19:18:19.256538	\N	2025-12-14 19:18:19.256538
cc6ed5d5-49ae-4eac-9699-49e44436f8f0	8546665c-d856-4641-b97f-7e20f1dcbfac	88594ffe-9df0-44e8-9ab7-37a127f843a1	\N	scale	\N	\N	\N	2025-12-14 19:28:47.85441	\N	2025-12-14 19:28:47.85441
4b090f98-dc81-4b7a-83bb-370095fe90ca	8546665c-d856-4641-b97f-7e20f1dcbfac	0ef50dde-9a16-433b-973e-15cff9f635e1	\N	scale	\N	\N	\N	2025-12-14 19:31:08.561549	\N	2025-12-14 19:31:08.561549
52a6fcb0-0cf0-46d4-85b3-e2ae20924bbd	8546665c-d856-4641-b97f-7e20f1dcbfac	3646bd34-7d9b-46f6-bba0-fe289d90ec43	\N	scale	\N	\N	\N	2025-12-14 19:33:59.735116	\N	2025-12-14 19:33:59.735116
bfc1ecb0-ae97-4f9f-80a2-cebbc0426016	8546665c-d856-4641-b97f-7e20f1dcbfac	c3fd3ef6-5db1-4bd7-b1a8-88b34fdd3c42	\N	scale	\N	\N	\N	2025-12-14 19:36:11.833498	\N	2025-12-14 19:36:11.833498
\.


--
-- Data for Name: risk_finding_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risk_finding_links (id, risk_id, finding_id, relationship_type, notes, linked_by, linked_at, updated_at) FROM stdin;
\.


--
-- Data for Name: risk_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risk_settings (id, organization_id, risk_levels, assessment_methods, likelihood_scale, impact_scale, max_acceptable_risk_score, risk_acceptance_authority, default_review_period_days, auto_calculate_risk_score, require_assessment_evidence, enable_risk_appetite, default_assessment_method, notify_on_high_risk, notify_on_critical_risk, notify_on_review_due, review_reminder_days, version, created_by, created_at, updated_by, updated_at) FROM stdin;
8f7f187c-0483-4885-992b-191bcf06caaf	\N	[{"color": "#22c55e", "level": "low", "maxScore": 5, "minScore": 1, "escalation": false, "description": "Acceptable risk - monitor periodically", "responseTime": "90 days"}, {"color": "#eab308", "level": "medium", "maxScore": 11, "minScore": 6, "escalation": false, "description": "Moderate risk - implement controls", "responseTime": "30 days"}, {"color": "#f97316", "level": "high", "maxScore": 19, "minScore": 12, "escalation": true, "description": "Significant risk - prioritize treatment", "responseTime": "7 days"}, {"color": "#dc2626", "level": "critical", "maxScore": 25, "minScore": 20, "escalation": true, "description": "Unacceptable risk - immediate action required", "responseTime": "24 hours"}]	[{"id": "qualitative_5x5", "name": "Qualitative 5x5 Matrix", "isActive": true, "isDefault": true, "description": "Standard 5-point scales for likelihood and impact", "impactScale": 5, "likelihoodScale": 5}, {"id": "qualitative_3x3", "name": "Simplified 3x3 Matrix", "isActive": true, "isDefault": false, "description": "Basic 3-point scales for quick assessments", "impactScale": 3, "likelihoodScale": 3}, {"id": "bowtie", "name": "Bowtie Analysis", "isActive": false, "isDefault": false, "description": "Cause-consequence analysis with barriers", "impactScale": 5, "likelihoodScale": 5}]	[{"label": "Rare", "value": 1, "description": "Highly unlikely to occur (< 5% chance)"}, {"label": "Unlikely", "value": 2, "description": "Not expected but possible (5-20% chance)"}, {"label": "Possible", "value": 3, "description": "Could occur at some point (20-50% chance)"}, {"label": "Likely", "value": 4, "description": "More likely than not (50-80% chance)"}, {"label": "Almost Certain", "value": 5, "description": "Expected to occur (> 80% chance)"}]	[{"label": "Negligible", "value": 1, "description": "Minimal impact on operations or objectives"}, {"label": "Minor", "value": 2, "description": "Limited impact, easily recoverable"}, {"label": "Moderate", "value": 3, "description": "Noticeable impact requiring management attention"}, {"label": "Major", "value": 4, "description": "Significant impact on key objectives"}, {"label": "Catastrophic", "value": 5, "description": "Severe impact threatening organizational survival"}]	11	executive	90	t	f	t	qualitative_5x5	t	t	t	7	1	\N	2025-12-09 20:30:03.968013	\N	2025-12-09 20:30:03.968013
\.


--
-- Data for Name: risk_treatments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risk_treatments (id, treatment_id, risk_id, strategy, title, description, treatment_owner_id, status, priority, start_date, target_completion_date, actual_completion_date, estimated_cost, actual_cost, expected_risk_reduction, residual_likelihood, residual_impact, residual_risk_score, progress_percentage, progress_notes, implementation_notes, linked_control_ids, attachments, created_by, created_at, updated_by, updated_at, deleted_at) FROM stdin;
3b4303a8-9a66-4c20-b22e-7ec219a05386	TRT-0018	0a7d5894-7a9a-48c4-88ea-44588a588225	mitigate	E2E Test Treatment 1765713482546	Test treatment description for E2E testing. This treatment will mitigate the identified risk.	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	high	2025-12-14	2026-03-14	\N	5000.00	\N	Expected to reduce risk score from High to Medium through enhanced controls.	2	2	4	0	\N	Implementation will require coordination between IT and Security teams. Timeline is 90 days.	\N	\N	\N	2025-12-14 11:58:09.057533	\N	2025-12-14 11:58:09.057533	\N
1b719e51-6a57-416b-9ee3-90701e38e739	TRT-0019	0a7d5894-7a9a-48c4-88ea-44588a588225	mitigate	E2E Test Treatment 1765715702161	Test treatment description for E2E testing. This treatment will mitigate the identified risk.	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	high	2025-12-14	2026-03-14	\N	5000.00	\N	Expected to reduce risk score from High to Medium through enhanced controls.	2	2	4	0	\N	Implementation will require coordination between IT and Security teams. Timeline is 90 days.	\N	\N	\N	2025-12-14 12:35:09.317867	\N	2025-12-14 12:35:09.317867	\N
b25a6ad2-ea45-4cff-8f6e-efc39c8785fc	TRT-0008	66e8a0a2-ef3e-47f0-945c-faa96545458b	mitigate	Incident Response Plan	Develop and test comprehensive incident response procedures.	580d01e1-da18-49be-84aa-957ee84719ab	planned	medium	2025-11-19	2026-02-05	\N	28900.00	\N	Reduce likelihood by 1-2 points	2	3	6	40	\N	\N	\N	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.200035	\N	2025-12-07 20:01:51.20621	\N
31acee8c-c613-46a7-95ad-8e2f623f5b80	TRT-0001	5a560cb8-7536-4f0b-b414-82b91e6a7504	mitigate	Implement Multi-Factor Authentication	Deploy MFA across all critical systems to reduce unauthorized access risk.	e7f8a16b-c291-4696-8be0-992c381c8013	in_progress	high	2025-11-23	2026-02-05	\N	17119.00	\N	Reduce likelihood by 1-2 points	2	3	6	40	\N	\N	\N	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:01:51.14796	\N	2025-12-07 20:01:51.162765	\N
905649eb-5428-4282-acec-bd70c2887064	TRT-0005	75e18228-b8ab-4fa4-9668-2c667050a24a	mitigate	Knowledge Management Program	Document critical processes and establish succession planning.	b5525c73-c26a-48d4-a90a-582fa451e518	planned	medium	2025-12-01	2026-02-05	\N	17601.00	\N	Reduce likelihood by 1-2 points	2	2	4	40	\N	\N	\N	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:51.182043	\N	2025-12-07 20:01:51.186057	\N
00016130-51f1-4497-a94f-f6ba44243c81	TRT-0013	ed5fbbd4-b818-4453-bc61-f30b969543e9	mitigate	Knowledge Management Program	Document critical processes and establish succession planning.	b5525c73-c26a-48d4-a90a-582fa451e518	planned	medium	2025-11-27	2026-02-05	\N	38600.00	\N	Reduce likelihood by 1-2 points	2	2	4	40	\N	\N	\N	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:02:03.839223	\N	2025-12-07 20:02:03.843619	\N
69b4716f-b9d4-464f-822d-3b686856918f	TRT-0002	ed178ab4-0fd5-432b-b7dd-9e37c6dc089d	mitigate	Vendor Security Assessment Program	Establish regular security assessments for all third-party vendors.	b5525c73-c26a-48d4-a90a-582fa451e518	planned	medium	2025-11-08	2026-02-05	\N	23880.00	\N	Reduce likelihood by 1-2 points	2	3	6	40	\N	\N	\N	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:51.164721	\N	2025-12-07 20:01:51.169596	\N
70fe1bad-35b0-493f-8039-78fe0c3f9f86	TRT-0011	7d20459f-4d3a-4dfa-b43d-210625fa01b8	mitigate	Compliance Monitoring System	Implement automated compliance monitoring and reporting.	01180d49-d38b-4421-a130-b1ce4b7c34fa	in_progress	high	2025-12-05	2026-02-05	\N	50599.00	\N	Reduce likelihood by 1-2 points	1	4	4	40	\N	\N	\N	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:02:03.827857	\N	2025-12-07 20:02:03.83239	\N
bc0fee44-fcca-4462-b940-2418ec9e6812	TRT-0006	bb4f3dee-958c-4687-b4c7-85e7e9561356	transfer	Cloud Service Level Agreements	Negotiate enhanced SLAs with cloud providers including penalties.	580d01e1-da18-49be-84aa-957ee84719ab	planned	medium	2025-11-22	2026-02-05	\N	34367.00	\N	Reduce likelihood by 1-2 points	1	3	3	40	\N	\N	\N	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.187046	\N	2025-12-07 20:01:51.191699	\N
407407c3-2df7-4d69-a170-dd2b733398b4	TRT-0003	33f6eccf-5f7a-4cc7-bc1c-b1e5c8fc9380	mitigate	Compliance Monitoring System	Implement automated compliance monitoring and reporting.	b5525c73-c26a-48d4-a90a-582fa451e518	in_progress	high	2025-12-01	2026-02-05	\N	37511.00	\N	Reduce likelihood by 1-2 points	1	4	4	40	\N	\N	\N	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:51.170963	\N	2025-12-07 20:01:51.175931	\N
f17aa871-7b54-4973-ab3b-e7c108877b5c	TRT-0009	d8f95727-444a-4c54-bbfe-42d961964622	mitigate	Implement Multi-Factor Authentication	Deploy MFA across all critical systems to reduce unauthorized access risk.	580d01e1-da18-49be-84aa-957ee84719ab	in_progress	high	2025-12-03	2026-02-05	\N	56329.00	\N	Reduce likelihood by 1-2 points	2	3	6	40	\N	\N	\N	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:02:03.811325	\N	2025-12-07 20:02:03.819005	\N
284e1508-021d-4e7e-adaf-8b6a38dd8f7a	TRT-0015	9655d605-6eae-4568-bce9-498b6c2efc51	mitigate	Enhanced Financial Controls	Implement additional approval workflows and transaction monitoring.	e4a2a06a-e399-4efb-895e-f607075a50a9	in_progress	high	2025-11-30	2026-02-05	\N	58993.00	\N	Reduce likelihood by 1-2 points	0	4	0	40	\N	\N	\N	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-07 20:02:03.851587	\N	2025-12-07 20:02:03.856411	\N
28facc7a-add6-48dc-878c-ff4d0277b6e1	TRT-0004	e247319a-b7fd-4e8b-8b74-a92187d95344	mitigate	Infrastructure Redundancy	Deploy redundant systems and failover mechanisms.	e7f8a16b-c291-4696-8be0-992c381c8013	completed	critical	2025-12-06	2026-02-05	\N	54546.00	\N	Reduce likelihood by 1-2 points	0	3	0	40	\N	\N	\N	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:01:51.176616	\N	2025-12-07 20:01:51.181081	\N
7f581dcf-72a5-40af-9b83-58b246451956	TRT-0007	1e4eae01-4f38-4798-a557-22f29a066bfe	mitigate	Enhanced Financial Controls	Implement additional approval workflows and transaction monitoring.	e7f8a16b-c291-4696-8be0-992c381c8013	in_progress	high	2025-12-02	2026-02-05	\N	45068.00	\N	Reduce likelihood by 1-2 points	0	4	0	40	\N	\N	\N	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:01:51.192249	\N	2025-12-07 20:01:51.198671	\N
2496f386-04a5-4028-9ea8-872d95bba605	TRT-0020	63832318-1990-4434-bbd2-c02ef93ab33f	mitigate	E2E Test Treatment 1765716252750	Test treatment description for E2E testing. This treatment will mitigate the identified risk.	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	high	2025-12-14	2026-03-14	\N	5000.00	\N	Expected to reduce risk score from High to Medium through enhanced controls.	2	2	4	0	\N	Implementation will require coordination between IT and Security teams. Timeline is 90 days.	\N	\N	\N	2025-12-14 12:44:19.779782	\N	2025-12-14 12:44:19.779782	\N
9ad2340a-6191-4767-9b7f-59100a897067	TRT-0021	760ff8bc-5ed1-4282-b1cf-796a46bb56de	mitigate	E2E Test Treatment 1765716468709	Test treatment description for E2E testing. This treatment will mitigate the identified risk.	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	high	2025-12-14	2026-03-14	\N	5000.00	\N	Expected to reduce risk score from High to Medium through enhanced controls.	2	2	4	0	\N	Implementation will require coordination between IT and Security teams. Timeline is 90 days.	\N	\N	\N	2025-12-14 12:48:00.703956	\N	2025-12-14 12:48:00.703956	\N
6fab7f22-3fc8-4708-baa3-1e17fd70dd71	TRT-0012	06a6ccaa-2e9f-4334-9a15-6d084f751827	mitigate	Infrastructure Redundancy	Deploy redundant systems and failover mechanisms.	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	critical	2025-11-29	2026-02-05	\N	19923.00	\N	Reduce likelihood by 1-2 points	0	3	0	40	\N	\N	\N	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:02:03.833156	\N	2025-12-07 20:02:03.838433	\N
5ffecc9a-e030-4ed5-b578-f9ff44a49264	TRT-0010	998f72eb-b679-46aa-b224-9a3eadf3d400	mitigate	Vendor Security Assessment Program	Establish regular security assessments for all third-party vendors.	01180d49-d38b-4421-a130-b1ce4b7c34fa	planned	medium	2025-12-03	2026-02-05	\N	54891.00	\N	Reduce likelihood by 1-2 points	2	3	6	40	\N	\N	\N	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:02:03.820821	\N	2025-12-07 20:02:03.826914	\N
a447f4f4-43a0-45a9-b89a-0e9a65e23833	TRT-0014	1a76d30f-97a2-4f36-aa19-46875e94d171	transfer	Cloud Service Level Agreements	Negotiate enhanced SLAs with cloud providers including penalties.	550e8400-e29b-41d4-a716-446655440001	planned	medium	2025-11-27	2026-02-05	\N	21320.00	\N	Reduce likelihood by 1-2 points	1	3	3	40	\N	\N	\N	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:02:03.844903	\N	2025-12-07 20:02:03.850301	\N
c25407b6-ebdb-4a2a-818b-03597b539d20	TRT-0022	3a70b50f-5a19-4585-916d-3c5cd8fb48f1	mitigate	E2E Test Treatment 1765725958646	Test treatment description for E2E testing. This treatment will mitigate the identified risk.	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	high	2025-12-14	2026-03-14	\N	5000.00	\N	Expected to reduce risk score from High to Medium through enhanced controls.	2	2	4	0	\N	Implementation will require coordination between IT and Security teams. Timeline is 90 days.	\N	\N	\N	2025-12-14 15:26:11.7918	\N	2025-12-14 15:26:11.7918	\N
533ac569-0251-43af-a44a-d475a0733158	TRT-0023	3a70b50f-5a19-4585-916d-3c5cd8fb48f1	mitigate	E2E Test Treatment 1765726025357	Test treatment description for E2E testing. This treatment will mitigate the identified risk.	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	high	2025-12-14	2026-03-14	\N	5000.00	\N	Expected to reduce risk score from High to Medium through enhanced controls.	2	2	4	0	\N	Implementation will require coordination between IT and Security teams. Timeline is 90 days.	\N	\N	\N	2025-12-14 15:27:18.359647	\N	2025-12-14 15:27:18.359647	\N
6c2eaf4e-8d73-4793-a559-d14fc7210fb7	TRT-0016	e6e37740-e4d6-40c1-bd5b-595f5dff9ae1	mitigate	Incident Response Plan	Develop and test comprehensive incident response procedures.	550e8400-e29b-41d4-a716-446655440001	planned	medium	2025-11-19	2026-02-05	\N	16132.00	\N	Reduce likelihood by 1-2 points	2	3	6	40	\N	\N	\N	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:02:03.857054	\N	2025-12-07 20:02:03.860707	\N
e816c8f5-4336-45e7-81a0-1c490dc5bb47	TRT-0017	0a7d5894-7a9a-48c4-88ea-44588a588225	mitigate	E2E Test Treatment 1765713417117	Test treatment description for E2E testing. This treatment will mitigate the identified risk.	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	high	2025-12-14	2026-03-14	\N	5000.00	\N	Expected to reduce risk score from High to Medium through enhanced controls.	2	2	4	0	\N	Implementation will require coordination between IT and Security teams. Timeline is 90 days.	\N	\N	\N	2025-12-14 11:57:02.820339	\N	2025-12-14 11:57:02.820339	\N
51ae68e8-20af-455d-abdb-c572a9e7dd00	TRT-0024	15792e9a-6d7b-469f-8d19-8e0259c55c71	mitigate	E2E Test Treatment 1765726318029	Test treatment description for E2E testing. This treatment will mitigate the identified risk.	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	high	2025-12-14	2026-03-14	\N	5000.00	\N	Expected to reduce risk score from High to Medium through enhanced controls.	2	2	4	0	\N	Implementation will require coordination between IT and Security teams. Timeline is 90 days.	\N	\N	\N	2025-12-14 15:32:10.147458	\N	2025-12-14 15:32:10.147458	\N
4e3acb01-3289-4a4f-a06b-d9457c715797	TRT-0025	28b40a98-e07b-4836-91f3-2ff30b50c16f	mitigate	E2E Test Treatment 1765726418323	Test treatment description for E2E testing. This treatment will mitigate the identified risk.	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	high	2025-12-14	2026-03-14	\N	5000.00	\N	Expected to reduce risk score from High to Medium through enhanced controls.	2	2	4	0	\N	Implementation will require coordination between IT and Security teams. Timeline is 90 days.	\N	\N	\N	2025-12-14 15:33:50.589327	\N	2025-12-14 15:33:50.589327	\N
1bd543f1-0d75-449f-a525-3cfdbebf48a4	TRT-0026	95d8a18a-1e1c-44ed-9eaa-25dfadac75b5	mitigate	E2E Treatment Submit Test 1765728396656	E2E Test Treatment for submit button testing.	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 16:06:38.462561	\N	2025-12-14 16:06:38.462561	\N
b1b65a51-be27-4f18-ba08-9e2037150500	TRT-0027	95d8a18a-1e1c-44ed-9eaa-25dfadac75b5	mitigate	E2E Treatment Submit Test 1765730557870	E2E Test Treatment for submit button testing.	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 16:42:39.713291	\N	2025-12-14 16:42:39.713291	\N
806bb41d-3237-4bb5-a054-159b3955c3ae	TRT-0033	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Slow Treatment 1765732694888	E2E Test Treatment Description - This is a slow careful fill test to ensure data persistence.	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 17:18:30.666887	\N	2025-12-14 17:24:59.027995	2025-12-14 17:24:59.027995
5531ec07-c369-4259-a2ee-5540b262decc	TRT-0032	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Test Treatment 1765732545585	E2E Test Treatment Description	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 17:15:45.989444	\N	2025-12-14 17:25:03.762527	2025-12-14 17:25:03.762527
34e4538a-1050-41df-9eaa-0b833c7aabd2	TRT-0031	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Test Treatment 1765732444167	E2E Test Treatment Description - This is a comprehensive test to verify the treatment form workflow functionality across all risk IDs.	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 17:14:05.224942	\N	2025-12-14 17:25:08.360325	2025-12-14 17:25:08.360325
2a818566-80df-49c9-8d79-47a70e17e55f	TRT-0030	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Test Treatment 1765732429683	E2E Test Treatment Description	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 17:13:50.019424	\N	2025-12-14 17:25:11.871181	2025-12-14 17:25:11.871181
f73699e6-3feb-4908-9620-079316e54f4d	TRT-0029	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Test Treatment 1765732411774	E2E Test Treatment Description	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 17:13:32.125512	\N	2025-12-14 17:25:15.100927	2025-12-14 17:25:15.100927
b2a494c3-c20c-4ab6-9ce2-ec8d32944360	TRT-0034	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Slow Treatment 1765732743296	E2E Test Treatment Description - This is a slow careful fill test to ensure data persistence.	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 17:19:19.11072	\N	2025-12-14 17:25:18.757556	2025-12-14 17:25:18.757556
cb2d1d29-3f62-4427-8ace-9dd8a1b36d88	TRT-0028	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Test Treatment 1765732251971	E2E Test Treatment Description - This is a comprehensive test to verify the treatment form workflow functionality across all risk IDs.	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 17:10:53.006187	\N	2025-12-14 17:25:27.253011	2025-12-14 17:25:27.253011
f01b659c-7436-4199-a152-7c440fc5cf4a	TRT-0035	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Test Treatment 1765740978632	E2E Test Treatment Description - Testing treatment form submission	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 19:36:27.334392	\N	2025-12-14 19:36:27.334392	\N
38772b09-0ba3-4151-85a0-15282bae47db	TRT-0036	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765742358678	E2E Test Treatment Description - Testing treatment creation from comprehensive test	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 19:59:27.347963	\N	2025-12-14 19:59:27.347963	\N
43daf1ed-c1b2-41de-a394-6e4ae2e9e126	TRT-0037	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Test Treatment 1765742792677	E2E Test Treatment Description	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	\N	2025-12-14 20:06:42.141655	\N	2025-12-14 20:06:42.141655	\N
bd8246db-c794-43d3-a0e4-3784f175ecab	TRT-0038	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765743673290	E2E Test Treatment Description - Testing treatment creation from comprehensive test	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:21:22.094773	\N	2025-12-14 20:21:22.094773	\N
247ca4e7-304c-4b24-9f8d-6a912748a58b	TRT-0039	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765743919957	E2E Test Treatment Description - Testing treatment creation from comprehensive test	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:25:28.796594	\N	2025-12-14 20:25:28.796594	\N
5ff168a6-1d8f-4943-a8f9-8206fbb327c9	TRT-0040	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765744422717	E2E Test Treatment Description - Testing treatment creation from comprehensive test	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:33:51.377233	\N	2025-12-14 20:33:51.377233	\N
4159e075-9160-45c8-a522-4a4070e7087f	TRT-0041	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765744639102	E2E Test Treatment Description - Testing treatment creation from comprehensive test	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:37:27.671686	\N	2025-12-14 20:37:27.671686	\N
a4a3bd20-dd58-4b55-9988-0769fe44ea1f	TRT-0042	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765745250234	E2E Test Treatment Description - Testing treatment creation from comprehensive test	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:47:51.523182	\N	2025-12-14 20:47:51.523182	\N
70661afb-27fa-455a-ba3b-9f8b3452d690	TRT-0043	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Test Treatment 1765745570298	E2E Test Treatment Description - Testing treatment creation from comprehensive test	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:53:11.6363	\N	2025-12-14 20:53:11.6363	\N
874f6f70-5dad-46c2-ba4f-3dc05e00145b	TRT-0044	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765745629426	E2E Test Treatment Description - Testing treatment creation from standalone page	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:54:14.025207	\N	2025-12-14 20:54:14.025207	\N
2665e16b-f6e6-4ebe-94b5-4033d1959bef	TRT-0045	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765745747673	E2E Test Treatment Description - Testing treatment creation from comprehensive test	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:56:09.00525	\N	2025-12-14 20:56:09.00525	\N
34762532-716b-4440-8c75-4c1125517976	TRT-0046	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765745807235	E2E Test Treatment Description - Testing treatment creation from standalone page	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:57:11.930915	\N	2025-12-14 20:57:11.930915	\N
249a65f5-60b5-465d-991e-64a49a9c4016	TRT-0047	8546665c-d856-4641-b97f-7e20f1dcbfac	mitigate	E2E Test Treatment 1765788232843	E2E Test Treatment Description - Testing treatment creation from comprehensive test	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-15 08:44:14.328355	\N	2025-12-15 08:44:14.328355	\N
977d97f8-bf84-44cc-a58a-1ceab8e5cb7a	TRT-0048	94280df5-b679-4b5b-bf6c-8500a719f183	mitigate	E2E Test Treatment 1765788294972	E2E Test Treatment Description - Testing treatment creation from standalone page	\N	planned	medium	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-15 08:45:19.645891	\N	2025-12-15 08:45:19.645891	\N
\.


--
-- Data for Name: risks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.risks (id, title, description, category, status, likelihood, impact, "organizationId", "ownerId", "createdAt", "updatedAt", risk_id, risk_statement, category_id, sub_category_id, risk_analyst_id, date_identified, threat_source, risk_velocity, early_warning_signs, status_notes, tags, business_process, version_number, next_review_date, last_review_date, business_unit_ids, inherent_likelihood, inherent_impact, inherent_risk_score, inherent_risk_level, current_likelihood, current_impact, current_risk_score, current_risk_level, target_likelihood, target_impact, target_risk_score, target_risk_level, control_effectiveness, created_by, updated_by, deleted_at) FROM stdin;
0c8fade9-131b-4b29-a93c-2de4b6318b8b	Ransomware Attack	Risk of ransomware attack on critical systems causing business disruption. Could result in operational shutdown, data loss, and financial extortion.	cybersecurity	identified	4	5	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
407861b0-9d3c-4da2-8b49-4c19a7496f10	Reputation Damage	Risk of reputation damage from security incidents, data breaches, or negative publicity. Could impact customer trust and business relationships.	reputational	identified	2	5	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28fb3a44-c9b8-463d-85e9-f10812a881dc	Business Continuity Failure	Risk of business continuity and disaster recovery plans failing during actual incidents, leading to extended operational disruption.	operational	assessed	2	5	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4f730396-33b4-4857-be90-e9f7dfaef410	Critical System Compromise	Risk of complete compromise of critical business systems leading to total operational shutdown and data loss.	cybersecurity	identified	3	5	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
a17571bf-240a-4b0d-93ae-c9136ca4110a	Major Data Breach	Risk of large-scale data breach exposing millions of customer records, resulting in massive regulatory fines and legal liability.	data_privacy	assessed	3	5	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2c35a1df-7015-4dc9-8e7f-0aa55155991b	License Revocation	Risk of regulatory license revocation due to severe compliance violations, resulting in complete business shutdown.	compliance	identified	1	5	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
70b62393-3a82-4a55-bfaa-34a295883d9c	Data Breach Risk	Risk of unauthorized access to sensitive customer data leading to data breach. Potential impact includes regulatory fines, reputation damage, and customer loss.	data_privacy	assessed	3	4	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
beb18e7d-60d7-433d-93d3-3ddf30e5d084	Regulatory Non-Compliance	Risk of failing to meet regulatory requirements (NCA, SAMA, ADGM) resulting in fines, penalties, and potential license revocation.	compliance	assessed	2	4	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
aefbb1f6-33e7-4475-ac93-ce948cbd8b6f	Insider Threat	Risk of malicious or negligent actions by employees or contractors leading to data theft, system compromise, or operational disruption.	cybersecurity	assessed	3	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
a16ffaf3-e52f-4062-b768-199686e65573	Cloud Service Outage	Risk of extended cloud service provider outage affecting critical business applications and customer-facing services.	operational	identified	2	4	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7dc64ed1-8a0e-49fd-8c6a-e43c358a8e65	Treatment Test Risk 1765713686318		strategic	identified	3	3	\N	\N	2025-12-14 12:01:27.664518	2025-12-14 12:01:27.664518	RISK-0069	\N	e3bbcbf3-803a-468a-8960-2d9bdd9c64d2	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
e16ba352-62ef-424a-9350-23c08a175020	Minimal Risk Test 1765715993310		compliance	identified	3	3	\N	\N	2025-12-14 12:40:08.490033	2025-12-14 12:40:08.490033	RISK-0073	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
3e87a67e-6bd9-4050-a6a5-2a1eb7eaa279	Financial Fraud	Risk of financial fraud through payment processing, accounting systems, or unauthorized transactions. Could result in significant financial losses.	financial	assessed	2	4	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8ea771af-5af6-402d-957c-dd4751d1ac15	Supply Chain Compromise	Risk of supply chain compromise through compromised third-party software, hardware, or services. Could introduce backdoors or vulnerabilities.	cybersecurity	identified	2	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
d0c07afa-2e55-460d-9d63-ef5debb4cd47	Advanced Persistent Threat	Risk of sophisticated APT attack remaining undetected for extended periods, causing significant data exfiltration and system compromise.	cybersecurity	assessed	3	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
b7e548bb-359b-428f-b715-980190ea6384	Payment System Failure	Risk of critical payment processing system failure resulting in inability to process transactions and significant revenue loss.	operational	identified	2	4	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42fd7975-29fa-4234-8ade-e20ffb47aea3	Compliance Audit Failure	Risk of failing external compliance audit resulting in regulatory penalties, mandatory remediation, and increased oversight.	compliance	assessed	3	4	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
a98ce5b3-df74-46e1-98c7-971b9baf5869	DDoS Attack	Risk of large-scale DDoS attack causing extended service unavailability and customer impact.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
f0951166-80ab-4601-b8e6-ce414ad0995f	Third-Party Vendor Failure	Risk of critical vendor service failure impacting business operations. Includes cloud service providers, payment processors, and key suppliers.	operational	mitigated	2	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
06bc974c-f07c-4709-95cf-016eaaf07752	System Downtime	Risk of extended system downtime affecting customer service and revenue. Could result from infrastructure failures, cyber attacks, or natural disasters.	operational	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
385c87b2-1a31-46f6-b810-b6cfa1424b98	Key Personnel Departure	Risk of losing key personnel with critical knowledge or skills, potentially disrupting operations or strategic initiatives.	strategic	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9d1d49c0-4142-4c19-be9e-071ab328ce15	API Security Vulnerability	Risk of API security vulnerabilities leading to unauthorized access, data exposure, or service disruption. Includes authentication and authorization flaws.	cybersecurity	assessed	3	3	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
ebd1003e-4dff-4a52-af3b-39f3c963468e	Market Competition	Risk of losing market share to competitors offering superior products, services, or pricing. Could impact revenue and growth objectives.	strategic	assessed	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
b490cb0d-091f-43fd-b000-9d276a6529f5	Technology Obsolescence	Risk of technology stack becoming obsolete, requiring expensive migrations or losing competitive advantage. Includes legacy system dependencies.	strategic	identified	2	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
a0a2de45-0325-479d-a6d2-881c783301de	Phishing Attack	Risk of successful phishing attack leading to credential compromise and potential unauthorized access to systems.	cybersecurity	identified	4	3	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
21b211d6-19ba-494b-9526-c0d30b561fef	Data Loss	Risk of accidental or malicious data loss affecting business operations and requiring recovery efforts.	operational	assessed	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36f335fb-0eb5-493c-a630-efb97f986d38	Software Vulnerability	Risk of unpatched software vulnerabilities being exploited, leading to system compromise or data exposure.	cybersecurity	identified	4	3	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
85f0ccb5-3639-47bb-ba3d-6564452af7ef	Network Outage	Risk of network infrastructure failure causing connectivity issues and service disruption.	operational	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
df61d08d-c54d-4492-98da-082776a8f768	Project Delay	Risk of critical project delays impacting business objectives and strategic initiatives.	strategic	assessed	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
f0a7161c-bf6c-4dfa-b751-fe0cb78c0b04	Minor Policy Violation	Risk of minor policy violations requiring corrective action but not resulting in significant impact.	compliance	identified	3	2	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9c32542c-9059-4af8-ac5c-7c9b333e0820	Equipment Failure	Risk of non-critical equipment failure causing minor operational disruption.	operational	identified	3	2	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2c164100-d66d-4ebe-a099-f9e3e803fada	Staff Turnover	Risk of higher than expected staff turnover in non-critical roles.	operational	assessed	4	2	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cd06922c-57d6-4fd1-b39d-747dd42dcc5c	Budget Overrun	Risk of minor budget overruns on non-critical projects.	financial	identified	3	2	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
622ddc51-1bef-4c02-81c4-0518a839a480	Documentation Gap	Risk of incomplete documentation requiring updates but not impacting operations.	compliance	identified	4	2	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
91bc5fc4-8b49-4cce-ad8b-07f71fea1e2d	Training Delay	Risk of minor delays in employee training programs with minimal business impact.	operational	identified	3	1	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
24956c92-ae5c-453a-a3be-d4f5d1ad3ebd	Minor Process Inefficiency	Risk of minor process inefficiencies requiring optimization but not causing significant issues.	operational	assessed	4	1	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29 19:15:20.367609	2025-11-29 19:15:20.367609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
95d8a18a-1e1c-44ed-9eaa-25dfadac75b5	Data Breach from Unauthorized Access	Risk of unauthorized access to sensitive customer data leading to data breach and regulatory penalties.	cybersecurity	identified	4	4	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:00:37.166339	2025-12-07 20:00:37.166339	RISK-0001	If malicious actors exploit weak authentication controls, then customer PII may be exposed, resulting in GDPR violations and reputational damage.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-12	external	fast	Multiple failed login attempts, unusual access patterns, security alerts from SIEM	\N	{GDPR,"Customer Data",Authentication}	\N	1	2026-01-06	\N	\N	4	5	20	critical	3	4	12	high	2	3	6	medium	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N
abc9fcb3-1f93-41d2-a9b6-dabb4c11adb4	Data Breach from Unauthorized Access	Risk of unauthorized access to sensitive customer data leading to data breach and regulatory penalties.	cybersecurity	identified	4	4	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:00:52.162763	2025-12-07 20:00:52.162763	RISK-0002	If malicious actors exploit weak authentication controls, then customer PII may be exposed, resulting in GDPR violations and reputational damage.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-10-04	external	fast	Multiple failed login attempts, unusual access patterns, security alerts from SIEM	\N	{GDPR,"Customer Data",Authentication}	\N	1	2026-01-06	\N	\N	4	5	20	critical	3	4	12	high	2	3	6	medium	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
453eee87-ca9e-4673-895d-b534d1ee5e42	Data Breach from Unauthorized Access	Risk of unauthorized access to sensitive customer data leading to data breach and regulatory penalties.	cybersecurity	identified	4	4	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:10.16519	2025-12-07 20:01:10.16519	RISK-0003	If malicious actors exploit weak authentication controls, then customer PII may be exposed, resulting in GDPR violations and reputational damage.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-01	external	fast	Multiple failed login attempts, unusual access patterns, security alerts from SIEM	\N	{GDPR,"Customer Data",Authentication}	\N	1	2026-01-06	\N	\N	4	5	20	critical	3	4	12	high	2	3	6	medium	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	\N
93398665-ca38-4a4d-a496-341881de1dc1	Treatment Test Risk 1765713732454		strategic	identified	3	3	\N	\N	2025-12-14 12:02:13.539279	2025-12-14 12:02:13.539279	RISK-0070	\N	e3bbcbf3-803a-468a-8960-2d9bdd9c64d2	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
775a0a76-bb34-4351-a3af-06648265e7c6	Third-Party Vendor Data Leak	Risk of data exposure through third-party vendor systems or services.	operational	assessed	3	4	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:01:10.18929	2025-12-07 20:01:10.18929	RISK-0004	If vendor security controls fail, then sensitive business data may be leaked, resulting in competitive disadvantage and customer trust loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	550e8400-e29b-41d4-a716-446655440001	2025-11-07	external	medium	\N	\N	{Vendor,"Data Privacy",Third-Party}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	550e8400-e29b-41d4-a716-446655440001	\N	\N
d3a3fcf1-f414-4eb2-9206-7d1724c05410	Regulatory Non-Compliance Penalties	Risk of financial penalties and sanctions due to non-compliance with industry regulations.	compliance	assessed	2	5	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:01:10.194227	2025-12-07 20:01:10.194227	RISK-0005	If compliance controls are not properly implemented, then regulatory violations may occur, resulting in fines and operational restrictions.	4a777674-67f4-40db-adc2-753c5a8edb18	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-10-01	internal	slow	\N	\N	{Compliance,Regulatory,Fines}	\N	1	2026-01-06	\N	\N	2	5	10	medium	2	5	10	medium	1	4	4	low	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
13dd505b-2ab2-43b7-9f25-44b9d159a39b	Critical System Downtime	Risk of extended downtime of critical business systems affecting operations.	operational	mitigated	1	5	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:10.197702	2025-12-07 20:01:10.197702	RISK-0006	If infrastructure fails without proper redundancy, then critical systems may be unavailable, resulting in business disruption and revenue loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-30	internal	immediate	\N	\N	{Infrastructure,Availability,"Business Continuity"}	\N	1	2026-01-06	\N	\N	2	5	10	medium	1	4	4	low	1	3	3	low	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
5ee2d925-7557-4b33-9bdb-bb02a4fdbabc	Key Personnel Departure	Risk of losing critical knowledge and expertise due to key employee departure.	operational	identified	3	3	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:10.200348	2025-12-07 20:01:10.200348	RISK-0007	If key personnel leave without knowledge transfer, then critical business processes may be disrupted, resulting in operational inefficiencies.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-11-13	internal	slow	\N	\N	{HR,"Knowledge Management","Succession Planning"}	\N	1	2026-01-06	\N	\N	3	3	9	medium	3	3	9	medium	2	2	4	low	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
4652c6b6-3a25-4816-9b7f-62f3c96c4dbf	Cloud Service Provider Outage	Risk of extended cloud service provider outage affecting business operations.	cybersecurity	assessed	2	4	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:10.203418	2025-12-07 20:01:10.203418	RISK-0008	If cloud provider experiences extended outage, then cloud-hosted applications may be unavailable, resulting in service disruption.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-29	external	fast	\N	\N	{Cloud,Infrastructure,Vendor}	\N	1	2026-01-06	\N	\N	2	4	8	medium	2	4	8	medium	1	3	3	low	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
10d2c6ef-16a8-4886-b7c1-c66f481f30a5	Financial Fraud Through System Manipulation	Risk of financial loss due to fraudulent transactions or system manipulation.	financial	assessed	1	5	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-12-07 20:01:10.205195	2025-12-07 20:01:10.205195	RISK-0009	If financial controls are bypassed, then fraudulent transactions may occur, resulting in financial loss and regulatory scrutiny.	0e372d00-dc3d-431e-b939-af0c51f12873	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-09-19	internal	medium	\N	\N	{Financial,Fraud,Controls}	\N	1	2026-01-06	\N	\N	1	5	5	low	1	5	5	low	1	4	4	low	\N	e7f8a16b-c291-4696-8be0-992c381c8013	\N	\N
90bd0a55-688c-4b80-bab5-e20ca1e71c0a	Reputational Damage from Data Incident	Risk of reputational damage following a data security incident.	reputational	identified	3	4	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:10.20764	2025-12-07 20:01:10.20764	RISK-0010	If data breach becomes public, then customer trust may be lost, resulting in brand damage and customer churn.	cbe10848-9b4d-4631-8e3f-1c1f6ca777ea	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-09-14	external	fast	\N	\N	{Reputation,"Data Breach","Public Relations"}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
faa489b1-af7f-458d-bb4b-5bc16c473d37	Data Breach from Unauthorized Access	Risk of unauthorized access to sensitive customer data leading to data breach and regulatory penalties.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-07 20:01:32.535772	2025-12-07 20:01:32.535772	RISK-0011	If malicious actors exploit weak authentication controls, then customer PII may be exposed, resulting in GDPR violations and reputational damage.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-10-08	external	fast	Multiple failed login attempts, unusual access patterns, security alerts from SIEM	\N	{GDPR,"Customer Data",Authentication}	\N	1	2026-01-06	\N	\N	4	5	20	critical	3	4	12	high	2	3	6	medium	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N
13054c36-8bfd-420b-88c2-0f23c48c1ebb	Third-Party Vendor Data Leak	Risk of data exposure through third-party vendor systems or services.	operational	assessed	3	4	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:32.545297	2025-12-07 20:01:32.545297	RISK-0012	If vendor security controls fail, then sensitive business data may be leaked, resulting in competitive disadvantage and customer trust loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	550e8400-e29b-41d4-a716-446655440001	2025-11-09	external	medium	\N	\N	{Vendor,"Data Privacy",Third-Party}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
84fd0674-34af-4684-b31d-c31130dd6f0c	Regulatory Non-Compliance Penalties	Risk of financial penalties and sanctions due to non-compliance with industry regulations.	compliance	assessed	2	5	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:01:32.547081	2025-12-07 20:01:32.547081	RISK-0013	If compliance controls are not properly implemented, then regulatory violations may occur, resulting in fines and operational restrictions.	4a777674-67f4-40db-adc2-753c5a8edb18	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-10-22	internal	slow	\N	\N	{Compliance,Regulatory,Fines}	\N	1	2026-01-06	\N	\N	2	5	10	medium	2	5	10	medium	1	4	4	low	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	\N
701b0b91-783a-49d0-a44f-3e0d6920cfc5	Critical System Downtime	Risk of extended downtime of critical business systems affecting operations.	operational	mitigated	1	5	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:01:32.5489	2025-12-07 20:01:32.5489	RISK-0014	If infrastructure fails without proper redundancy, then critical systems may be unavailable, resulting in business disruption and revenue loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-10-18	internal	immediate	\N	\N	{Infrastructure,Availability,"Business Continuity"}	\N	1	2026-01-06	\N	\N	2	5	10	medium	1	4	4	low	1	3	3	low	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N
03b85403-38b8-46c4-8f05-483da39cef1e	Key Personnel Departure	Risk of losing critical knowledge and expertise due to key employee departure.	operational	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:01:32.550803	2025-12-07 20:01:32.550803	RISK-0015	If key personnel leave without knowledge transfer, then critical business processes may be disrupted, resulting in operational inefficiencies.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-10-02	internal	slow	\N	\N	{HR,"Knowledge Management","Succession Planning"}	\N	1	2026-01-06	\N	\N	3	3	9	medium	3	3	9	medium	2	2	4	low	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
41408ae5-aadc-4306-a4d6-c3f2003a6b19	Cloud Service Provider Outage	Risk of extended cloud service provider outage affecting business operations.	cybersecurity	assessed	2	4	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:32.55221	2025-12-07 20:01:32.55221	RISK-0016	If cloud provider experiences extended outage, then cloud-hosted applications may be unavailable, resulting in service disruption.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-11-24	external	fast	\N	\N	{Cloud,Infrastructure,Vendor}	\N	1	2026-01-06	\N	\N	2	4	8	medium	2	4	8	medium	1	3	3	low	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	\N
75fe89b6-e5eb-48e7-aaf7-17094841fd64	Financial Fraud Through System Manipulation	Risk of financial loss due to fraudulent transactions or system manipulation.	financial	assessed	1	5	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:01:32.553386	2025-12-07 20:01:32.553386	RISK-0017	If financial controls are bypassed, then fraudulent transactions may occur, resulting in financial loss and regulatory scrutiny.	0e372d00-dc3d-431e-b939-af0c51f12873	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-09-10	internal	medium	\N	\N	{Financial,Fraud,Controls}	\N	1	2026-01-06	\N	\N	1	5	5	low	1	5	5	low	1	4	4	low	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N
8ba23cf5-fb6e-4d5f-b659-4d40d9ff204f	Treatment Test Risk 1765713759200		strategic	identified	3	3	\N	\N	2025-12-14 12:02:40.361642	2025-12-14 12:02:40.361642	RISK-0071	\N	e3bbcbf3-803a-468a-8960-2d9bdd9c64d2	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
c0ccd611-1d26-4d5b-a19b-e169f9442750	Reputational Damage from Data Incident	Risk of reputational damage following a data security incident.	reputational	identified	3	4	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:32.554553	2025-12-07 20:01:32.554553	RISK-0018	If data breach becomes public, then customer trust may be lost, resulting in brand damage and customer churn.	cbe10848-9b4d-4631-8e3f-1c1f6ca777ea	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-11-29	external	fast	\N	\N	{Reputation,"Data Breach","Public Relations"}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
526a9d92-1390-4e0a-8f65-98abc389eaff	Data Breach from Unauthorized Access	Risk of unauthorized access to sensitive customer data leading to data breach and regulatory penalties.	cybersecurity	identified	4	4	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:01:41.550801	2025-12-07 20:01:41.550801	RISK-0019	If malicious actors exploit weak authentication controls, then customer PII may be exposed, resulting in GDPR violations and reputational damage.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-22	external	fast	Multiple failed login attempts, unusual access patterns, security alerts from SIEM	\N	{GDPR,"Customer Data",Authentication}	\N	1	2026-01-06	\N	\N	4	5	20	critical	3	4	12	high	2	3	6	medium	\N	550e8400-e29b-41d4-a716-446655440001	\N	\N
68a8b06e-d63f-45ba-bddf-34364f271cca	Third-Party Vendor Data Leak	Risk of data exposure through third-party vendor systems or services.	operational	assessed	3	4	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-07 20:01:41.565425	2025-12-07 20:01:41.565425	RISK-0020	If vendor security controls fail, then sensitive business data may be leaked, resulting in competitive disadvantage and customer trust loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-11-18	external	medium	\N	\N	{Vendor,"Data Privacy",Third-Party}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	\N	\N
7853cf10-3f42-4553-8d10-b709919e4e75	Regulatory Non-Compliance Penalties	Risk of financial penalties and sanctions due to non-compliance with industry regulations.	compliance	assessed	2	5	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:01:41.56738	2025-12-07 20:01:41.56738	RISK-0021	If compliance controls are not properly implemented, then regulatory violations may occur, resulting in fines and operational restrictions.	4a777674-67f4-40db-adc2-753c5a8edb18	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-10-14	internal	slow	\N	\N	{Compliance,Regulatory,Fines}	\N	1	2026-01-06	\N	\N	2	5	10	medium	2	5	10	medium	1	4	4	low	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
6e2c8592-7a4c-40bf-98bc-ab2bd8afde2b	Critical System Downtime	Risk of extended downtime of critical business systems affecting operations.	operational	mitigated	1	5	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:01:41.56956	2025-12-07 20:01:41.56956	RISK-0022	If infrastructure fails without proper redundancy, then critical systems may be unavailable, resulting in business disruption and revenue loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-09-15	internal	immediate	\N	\N	{Infrastructure,Availability,"Business Continuity"}	\N	1	2026-01-06	\N	\N	2	5	10	medium	1	4	4	low	1	3	3	low	\N	550e8400-e29b-41d4-a716-446655440001	\N	\N
f361ebd9-66e7-4d6d-b646-f2442b033f78	Key Personnel Departure	Risk of losing critical knowledge and expertise due to key employee departure.	operational	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:01:41.571568	2025-12-07 20:01:41.571568	RISK-0023	If key personnel leave without knowledge transfer, then critical business processes may be disrupted, resulting in operational inefficiencies.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-09-11	internal	slow	\N	\N	{HR,"Knowledge Management","Succession Planning"}	\N	1	2026-01-06	\N	\N	3	3	9	medium	3	3	9	medium	2	2	4	low	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
2dcadef6-433d-4752-90f4-53b4caaf1a65	Cloud Service Provider Outage	Risk of extended cloud service provider outage affecting business operations.	cybersecurity	assessed	2	4	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:01:41.573317	2025-12-07 20:01:41.573317	RISK-0024	If cloud provider experiences extended outage, then cloud-hosted applications may be unavailable, resulting in service disruption.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-10-20	external	fast	\N	\N	{Cloud,Infrastructure,Vendor}	\N	1	2026-01-06	\N	\N	2	4	8	medium	2	4	8	medium	1	3	3	low	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
436251cc-6dc1-4b1c-8d93-2243b9015e86	Financial Fraud Through System Manipulation	Risk of financial loss due to fraudulent transactions or system manipulation.	financial	assessed	1	5	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:01:41.574779	2025-12-07 20:01:41.574779	RISK-0025	If financial controls are bypassed, then fraudulent transactions may occur, resulting in financial loss and regulatory scrutiny.	0e372d00-dc3d-431e-b939-af0c51f12873	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-09-27	internal	medium	\N	\N	{Financial,Fraud,Controls}	\N	1	2026-01-06	\N	\N	1	5	5	low	1	5	5	low	1	4	4	low	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	\N
18c68ee3-7af4-49bc-bf94-0792b117aa47	Reputational Damage from Data Incident	Risk of reputational damage following a data security incident.	reputational	identified	3	4	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:01:41.576079	2025-12-07 20:01:41.576079	RISK-0026	If data breach becomes public, then customer trust may be lost, resulting in brand damage and customer churn.	cbe10848-9b4d-4631-8e3f-1c1f6ca777ea	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-09-12	external	fast	\N	\N	{Reputation,"Data Breach","Public Relations"}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	550e8400-e29b-41d4-a716-446655440001	\N	\N
5a560cb8-7536-4f0b-b414-82b91e6a7504	Data Breach from Unauthorized Access	Risk of unauthorized access to sensitive customer data leading to data breach and regulatory penalties.	cybersecurity	identified	4	4	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:01:51.099217	2025-12-07 20:01:51.099217	RISK-0027	If malicious actors exploit weak authentication controls, then customer PII may be exposed, resulting in GDPR violations and reputational damage.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-10-11	external	fast	Multiple failed login attempts, unusual access patterns, security alerts from SIEM	\N	{GDPR,"Customer Data",Authentication}	\N	1	2026-01-06	\N	\N	4	5	20	critical	3	4	12	high	2	3	6	medium	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
ed178ab4-0fd5-432b-b7dd-9e37c6dc089d	Third-Party Vendor Data Leak	Risk of data exposure through third-party vendor systems or services.	operational	assessed	3	4	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.108908	2025-12-07 20:01:51.108908	RISK-0028	If vendor security controls fail, then sensitive business data may be leaked, resulting in competitive disadvantage and customer trust loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-09-13	external	medium	\N	\N	{Vendor,"Data Privacy",Third-Party}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
33f6eccf-5f7a-4cc7-bc1c-b1e5c8fc9380	Regulatory Non-Compliance Penalties	Risk of financial penalties and sanctions due to non-compliance with industry regulations.	compliance	assessed	2	5	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-07 20:01:51.110591	2025-12-07 20:01:51.110591	RISK-0029	If compliance controls are not properly implemented, then regulatory violations may occur, resulting in fines and operational restrictions.	4a777674-67f4-40db-adc2-753c5a8edb18	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-09-16	internal	slow	\N	\N	{Compliance,Regulatory,Fines}	\N	1	2026-01-06	\N	\N	2	5	10	medium	2	5	10	medium	1	4	4	low	\N	b5525c73-c26a-48d4-a90a-582fa451e518	\N	\N
e247319a-b7fd-4e8b-8b74-a92187d95344	Critical System Downtime	Risk of extended downtime of critical business systems affecting operations.	operational	mitigated	1	5	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-07 20:01:51.112718	2025-12-07 20:01:51.112718	RISK-0030	If infrastructure fails without proper redundancy, then critical systems may be unavailable, resulting in business disruption and revenue loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-09-29	internal	immediate	\N	\N	{Infrastructure,Availability,"Business Continuity"}	\N	1	2026-01-06	\N	\N	2	5	10	medium	1	4	4	low	1	3	3	low	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N
75e18228-b8ab-4fa4-9668-2c667050a24a	Key Personnel Departure	Risk of losing critical knowledge and expertise due to key employee departure.	operational	identified	3	3	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:01:51.114859	2025-12-07 20:01:51.114859	RISK-0031	If key personnel leave without knowledge transfer, then critical business processes may be disrupted, resulting in operational inefficiencies.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-01	internal	slow	\N	\N	{HR,"Knowledge Management","Succession Planning"}	\N	1	2026-01-06	\N	\N	3	3	9	medium	3	3	9	medium	2	2	4	low	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
bb4f3dee-958c-4687-b4c7-85e7e9561356	Cloud Service Provider Outage	Risk of extended cloud service provider outage affecting business operations.	cybersecurity	assessed	2	4	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:01:51.116575	2025-12-07 20:01:51.116575	RISK-0032	If cloud provider experiences extended outage, then cloud-hosted applications may be unavailable, resulting in service disruption.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	550e8400-e29b-41d4-a716-446655440001	2025-10-13	external	fast	\N	\N	{Cloud,Infrastructure,Vendor}	\N	1	2026-01-06	\N	\N	2	4	8	medium	2	4	8	medium	1	3	3	low	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
1e4eae01-4f38-4798-a557-22f29a066bfe	Financial Fraud Through System Manipulation	Risk of financial loss due to fraudulent transactions or system manipulation.	financial	assessed	1	5	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-07 20:01:51.118034	2025-12-07 20:01:51.118034	RISK-0033	If financial controls are bypassed, then fraudulent transactions may occur, resulting in financial loss and regulatory scrutiny.	0e372d00-dc3d-431e-b939-af0c51f12873	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-12-06	internal	medium	\N	\N	{Financial,Fraud,Controls}	\N	1	2026-01-06	\N	\N	1	5	5	low	1	5	5	low	1	4	4	low	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N
66e8a0a2-ef3e-47f0-945c-faa96545458b	Reputational Damage from Data Incident	Risk of reputational damage following a data security incident.	reputational	identified	3	4	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:01:51.119207	2025-12-07 20:01:51.119207	RISK-0034	If data breach becomes public, then customer trust may be lost, resulting in brand damage and customer churn.	cbe10848-9b4d-4631-8e3f-1c1f6ca777ea	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-10-14	external	fast	\N	\N	{Reputation,"Data Breach","Public Relations"}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	\N
d8f95727-444a-4c54-bbfe-42d961964622	Data Breach from Unauthorized Access	Risk of unauthorized access to sensitive customer data leading to data breach and regulatory penalties.	cybersecurity	identified	4	4	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:02:03.751013	2025-12-07 20:02:03.751013	RISK-0035	If malicious actors exploit weak authentication controls, then customer PII may be exposed, resulting in GDPR violations and reputational damage.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-11-08	external	fast	Multiple failed login attempts, unusual access patterns, security alerts from SIEM	\N	{GDPR,"Customer Data",Authentication}	\N	1	2026-01-06	\N	\N	4	5	20	critical	3	4	12	high	2	3	6	medium	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
998f72eb-b679-46aa-b224-9a3eadf3d400	Third-Party Vendor Data Leak	Risk of data exposure through third-party vendor systems or services.	operational	assessed	3	4	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:02:03.768794	2025-12-07 20:02:03.768794	RISK-0036	If vendor security controls fail, then sensitive business data may be leaked, resulting in competitive disadvantage and customer trust loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	b5525c73-c26a-48d4-a90a-582fa451e518	2025-09-26	external	medium	\N	\N	{Vendor,"Data Privacy",Third-Party}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	\N
7d20459f-4d3a-4dfa-b43d-210625fa01b8	Regulatory Non-Compliance Penalties	Risk of financial penalties and sanctions due to non-compliance with industry regulations.	compliance	assessed	2	5	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-12-07 20:02:03.771448	2025-12-07 20:02:03.771448	RISK-0037	If compliance controls are not properly implemented, then regulatory violations may occur, resulting in fines and operational restrictions.	4a777674-67f4-40db-adc2-753c5a8edb18	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-10-13	internal	slow	\N	\N	{Compliance,Regulatory,Fines}	\N	1	2026-01-06	\N	\N	2	5	10	medium	2	5	10	medium	1	4	4	low	\N	580d01e1-da18-49be-84aa-957ee84719ab	\N	\N
06a6ccaa-2e9f-4334-9a15-6d084f751827	Critical System Downtime	Risk of extended downtime of critical business systems affecting operations.	operational	mitigated	1	5	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	2025-12-07 20:02:03.773463	2025-12-07 20:02:03.773463	RISK-0038	If infrastructure fails without proper redundancy, then critical systems may be unavailable, resulting in business disruption and revenue loss.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-10-10	internal	immediate	\N	\N	{Infrastructure,Availability,"Business Continuity"}	\N	1	2026-01-06	\N	\N	2	5	10	medium	1	4	4	low	1	3	3	low	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	\N	\N
ed5fbbd4-b818-4453-bc61-f30b969543e9	Key Personnel Departure	Risk of losing critical knowledge and expertise due to key employee departure.	operational	identified	3	3	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-07 20:02:03.775131	2025-12-07 20:02:03.775131	RISK-0039	If key personnel leave without knowledge transfer, then critical business processes may be disrupted, resulting in operational inefficiencies.	be91f319-0d65-435f-9997-edd1be2a0b40	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-10-16	internal	slow	\N	\N	{HR,"Knowledge Management","Succession Planning"}	\N	1	2026-01-06	\N	\N	3	3	9	medium	3	3	9	medium	2	2	4	low	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N
1a76d30f-97a2-4f36-aa19-46875e94d171	Cloud Service Provider Outage	Risk of extended cloud service provider outage affecting business operations.	cybersecurity	assessed	2	4	\N	550e8400-e29b-41d4-a716-446655440001	2025-12-07 20:02:03.777368	2025-12-07 20:02:03.777368	RISK-0040	If cloud provider experiences extended outage, then cloud-hosted applications may be unavailable, resulting in service disruption.	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	580d01e1-da18-49be-84aa-957ee84719ab	2025-10-16	external	fast	\N	\N	{Cloud,Infrastructure,Vendor}	\N	1	2026-01-06	\N	\N	2	4	8	medium	2	4	8	medium	1	3	3	low	\N	550e8400-e29b-41d4-a716-446655440001	\N	\N
9655d605-6eae-4568-bce9-498b6c2efc51	Financial Fraud Through System Manipulation	Risk of financial loss due to fraudulent transactions or system manipulation.	financial	assessed	1	5	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:02:03.779107	2025-12-07 20:02:03.779107	RISK-0041	If financial controls are bypassed, then fraudulent transactions may occur, resulting in financial loss and regulatory scrutiny.	0e372d00-dc3d-431e-b939-af0c51f12873	\N	550e8400-e29b-41d4-a716-446655440001	2025-11-08	internal	medium	\N	\N	{Financial,Fraud,Controls}	\N	1	2026-01-06	\N	\N	1	5	5	low	1	5	5	low	1	4	4	low	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
e6e37740-e4d6-40c1-bd5b-595f5dff9ae1	Reputational Damage from Data Incident	Risk of reputational damage following a data security incident.	reputational	identified	3	4	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-07 20:02:03.781134	2025-12-07 20:02:03.781134	RISK-0042	If data breach becomes public, then customer trust may be lost, resulting in brand damage and customer churn.	cbe10848-9b4d-4631-8e3f-1c1f6ca777ea	\N	e7f8a16b-c291-4696-8be0-992c381c8013	2025-09-24	external	fast	\N	\N	{Reputation,"Data Breach","Public Relations"}	\N	1	2026-01-06	\N	\N	3	4	12	high	3	4	12	high	2	3	6	medium	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
054e7568-bca9-4731-a0c4-f768ca6a65a1	Minimal Risk Test 1765645143502		compliance	identified	3	3	\N	\N	2025-12-13 16:59:06.09367	2025-12-13 16:59:06.09367	RISK-0043	\N	\N	\N	\N	2025-12-13	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
7c392daf-a087-4792-a657-71b4d14b49d7	E2E Test Risk 1765645159645	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	\N	2025-12-13 16:59:31.42428	2025-12-13 16:59:31.42428	RISK-0044	If unauthorized users exploit weak authentication, then data breach may occur	\N	\N	\N	2025-12-13	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-13	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
f67c1119-adf5-4edd-a90b-19d7d1d89d04	E2E Test Risk 1765646232751	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	\N	2025-12-13 17:17:24.457211	2025-12-13 17:17:24.457211	RISK-0045	If unauthorized users exploit weak authentication, then data breach may occur	\N	\N	\N	2025-12-13	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-13	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
9816b8a8-d1f7-4ccb-83b0-155d07999515	Minimal Risk Test 1765646265789		compliance	identified	3	3	\N	\N	2025-12-13 17:17:48.473776	2025-12-13 17:17:48.473776	RISK-0046	\N	\N	\N	\N	2025-12-13	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
5f358c7d-b8a4-49ff-ba74-d8af0f08677b	Treatment Test Risk 1765713980740		strategic	identified	3	3	\N	\N	2025-12-14 12:06:21.755064	2025-12-14 12:06:21.755064	RISK-0072	\N	e3bbcbf3-803a-468a-8960-2d9bdd9c64d2	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
c50b424b-c3b4-44f8-b35a-62700a6821f3	E2E Test Risk 1765646279822	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	\N	2025-12-13 17:18:11.496214	2025-12-13 17:18:11.496214	RISK-0047	If unauthorized users exploit weak authentication, then data breach may occur	\N	\N	\N	2025-12-13	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-13	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
a3f4c6f6-9836-48ed-b065-9cc5778602d4	Minimal Risk Test 1765646312424		compliance	identified	3	3	\N	\N	2025-12-13 17:18:34.885985	2025-12-13 17:18:34.885985	RISK-0048	\N	\N	\N	\N	2025-12-13	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
c9d97d4b-30ad-4fa3-9f2a-539b150882b0	Minimal Risk Test 1765646393607		compliance	identified	3	3	\N	\N	2025-12-13 17:19:56.169852	2025-12-13 17:19:56.169852	RISK-0049	\N	\N	\N	\N	2025-12-13	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
1f6b1e48-daae-4db5-8918-203fdb9f584d	E2E Test Risk 1765647212989	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	\N	2025-12-13 17:33:54.81729	2025-12-13 17:33:54.81729	RISK-0050	If unauthorized users exploit weak authentication, then data breach may occur	\N	\N	\N	2025-12-13	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-13	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
e1e36f24-4167-4a29-9e89-36bd353318de	Minimal Risk Test 1765647273101		compliance	identified	3	3	\N	\N	2025-12-13 17:34:35.607329	2025-12-13 17:34:35.607329	RISK-0051	\N	\N	\N	\N	2025-12-13	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
38d4ea73-7010-4e13-9d66-cc1c13b116f1	E2E Test Risk 1765647283743	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	\N	2025-12-13 17:34:55.218887	2025-12-13 17:34:55.218887	RISK-0052	If unauthorized users exploit weak authentication, then data breach may occur	\N	\N	\N	2025-12-13	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-13	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
34b7ee8c-13e7-490e-9d04-b9dd71286943	Minimal Risk Test 1765647316467		compliance	identified	3	3	\N	\N	2025-12-13 17:35:18.942066	2025-12-13 17:35:18.942066	RISK-0053	\N	\N	\N	\N	2025-12-13	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
382b20a9-65e0-4ede-9e4a-3e42f15498e6	Minimal Risk Test 1765647350789		compliance	identified	3	3	\N	\N	2025-12-13 17:35:53.368685	2025-12-13 17:35:53.368685	RISK-0054	\N	\N	\N	\N	2025-12-13	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
32ac80d4-4e9e-4ba6-8628-8a25d24fb593	E2E Test Risk 1765647367817	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	\N	2025-12-13 17:36:19.441628	2025-12-13 17:36:19.441628	RISK-0055	If unauthorized users exploit weak authentication, then data breach may occur	\N	\N	\N	2025-12-13	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-13	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
d917fed5-7f3a-418c-92a5-a87c261b8611	Minimal Risk Test 1765647399852		compliance	identified	3	3	\N	\N	2025-12-13 17:36:42.262887	2025-12-13 17:36:42.262887	RISK-0056	\N	\N	\N	\N	2025-12-13	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
3692739b-e5f5-43e5-95a4-a9b5f66751a6	Minimal Risk Test 1765647488064		compliance	identified	3	3	\N	\N	2025-12-13 17:38:16.963535	2025-12-13 17:38:16.963535	RISK-0057	\N	\N	\N	\N	2025-12-13	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
db8c37a3-1bec-4ae0-959f-f6c71e17f858	E2E Test Risk 1765647489839	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	\N	2025-12-13 17:38:26.613317	2025-12-13 17:38:26.613317	RISK-0058	If unauthorized users exploit weak authentication, then data breach may occur	\N	\N	\N	2025-12-13	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-13	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
29f7ac4d-22ff-4d5b-aa40-4476015fa91c	E2E Test Risk 1765711666176	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 11:28:00.156492	2025-12-14 11:28:00.156492	RISK-0059	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
e66f0802-2d7e-4334-881e-7d1580e567c3	Minimal Risk Test 1765711700079		compliance	identified	3	3	\N	\N	2025-12-14 11:28:22.656231	2025-12-14 11:28:22.656231	RISK-0060	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
ae871768-0f18-4530-a630-4b2c5af07ef0	E2E Test Risk 1765711957738	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 11:32:53.443615	2025-12-14 11:32:53.443615	RISK-0061	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
6c225235-1546-4ed5-b01f-c7043736e2f5	Minimal Risk Test 1765711993856		compliance	identified	3	3	\N	\N	2025-12-14 11:33:16.239376	2025-12-14 11:33:16.239376	RISK-0062	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
ff85067c-9a30-4a80-bde5-4cc007a09b38	E2E Test Risk 1765711992396	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 11:33:25.238897	2025-12-14 11:33:25.238897	RISK-0063	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
97e176a2-a6e9-4c40-940b-17a5f7a0dd8e	E2E Test Risk 1765712273400	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 11:38:19.985681	2025-12-14 11:38:19.985681	RISK-0064	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
6b8753ec-9047-4219-99ed-6b675afc2d3b	Minimal Risk Test 1765712322863		compliance	identified	3	3	\N	\N	2025-12-14 11:38:45.384753	2025-12-14 11:38:45.384753	RISK-0065	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
0a7d5894-7a9a-48c4-88ea-44588a588225	E2E Test Risk 1765712682637	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 11:44:56.122487	2025-12-14 11:44:56.122487	RISK-0066	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
5cb8f9a2-be73-496b-b43e-0f3fd6dc9256	Minimal Risk Test 1765712719914		compliance	identified	3	3	\N	\N	2025-12-14 11:45:22.975806	2025-12-14 11:45:22.975806	RISK-0067	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
7e06694e-cf43-457f-9043-4feb8cae5e88	Treatment Test Risk 1765712767912		strategic	identified	3	3	\N	\N	2025-12-14 11:46:09.088339	2025-12-14 11:46:09.088339	RISK-0068	\N	e3bbcbf3-803a-468a-8960-2d9bdd9c64d2	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
63832318-1990-4434-bbd2-c02ef93ab33f	E2E Test Risk 1765715997418	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 12:40:20.069642	2025-12-14 12:40:20.069642	RISK-0074	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
760ff8bc-5ed1-4282-b1cf-796a46bb56de	E2E Test Risk 1765716387843	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 12:46:43.687241	2025-12-14 12:46:43.687241	RISK-0075	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
df174fd7-3e8a-4d60-985d-7d585338f5d8	E2E Test Risk 1765716527939	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 12:49:11.967338	2025-12-14 12:49:11.967338	RISK-0076	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
c28971a8-2e64-4a31-a0ea-e6100459c2f2	E2E Test Risk 1765725337899	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 15:16:03.059173	2025-12-14 15:16:03.059173	RISK-0077	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
2f9f2356-e9b4-47e5-b6ae-1222618de2ba	E2E Test Risk 1765725429679	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 15:17:34.594463	2025-12-14 15:17:34.594463	RISK-0078	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
257d5845-f0e4-40e9-8516-78387876c9a0	E2E Test Risk 1765725469531	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 15:18:14.451671	2025-12-14 15:18:14.451671	RISK-0079	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
3a70b50f-5a19-4585-916d-3c5cd8fb48f1	E2E Test Risk 1765725512646	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 15:18:58.069355	2025-12-14 15:18:58.069355	RISK-0080	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
e4e0b8a2-6e54-4a16-a3d5-dbcb74680aaf	Minimal Risk Test 1765725569761		compliance	identified	3	3	\N	\N	2025-12-14 15:19:34.56397	2025-12-14 15:19:34.56397	RISK-0081	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
aed5f783-053f-47fb-b570-862342dff429	Minimal Risk Test 1765726196376		compliance	identified	3	3	\N	\N	2025-12-14 15:30:01.273232	2025-12-14 15:30:01.273232	RISK-0083	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
15792e9a-6d7b-469f-8d19-8e0259c55c71	E2E Test Risk 1765726268402	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 15:31:33.605774	2025-12-14 15:31:33.605774	RISK-0084	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
28b40a98-e07b-4836-91f3-2ff30b50c16f	E2E Test Risk 1765726341451	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 15:32:46.463197	2025-12-14 15:32:46.463197	RISK-0085	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
6c60dd89-da7b-4765-b888-e0fb8a825fce	Minimal Risk Test 1765726397536		compliance	identified	3	3	\N	\N	2025-12-14 15:33:22.30497	2025-12-14 15:33:22.30497	RISK-0086	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
868fb51b-a9ab-4a9d-8ecd-6d0a093cdecc	E2E Test Risk 1765726574290	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 15:36:39.515904	2025-12-14 15:36:39.515904	RISK-0087	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
35c73c31-f6b9-48d2-80c6-f3cbd14af879	Minimal Risk Test 1765726635334		compliance	identified	3	3	\N	\N	2025-12-14 15:37:20.00832	2025-12-14 15:37:20.00832	RISK-0088	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
94280df5-b679-4b5b-bf6c-8500a719f183	E2E Test Risk 1765731615040	Test risk description for E2E testing. This risk needs to be mitigated.	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 17:00:40.150215	2025-12-14 17:00:40.150215	RISK-0089	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	1	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
1535ebe5-9264-472e-ae08-b373f757b722	Minimal Risk Test 1765731671458		compliance	identified	3	3	\N	\N	2025-12-14 17:01:16.377243	2025-12-14 17:01:16.377243	RISK-0090	\N	4a777674-67f4-40db-adc2-753c5a8edb18	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	\N	\N	\N
8546665c-d856-4641-b97f-7e20f1dcbfac	E2E Test Risk 1765726157825	E2E Test - Updated description at 2025-12-14T19:30:26.185Z	cybersecurity	identified	4	4	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14 15:29:43.198997	2025-12-14 19:30:29.012462	RISK-0082	If unauthorized users exploit weak authentication, then data breach may occur	ef25794f-0c38-44dd-b530-8a3ae17460c0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	2025-12-14	external	fast	Multiple failed login attempts, unusual network activity, security alerts	Risk identified during security assessment. Immediate action required.	{GDPR,PCI-DSS,"Test Tag"}	Customer Data Processing and Authentication	2	2026-03-14	\N	\N	5	5	25	critical	4	4	16	high	2	2	4	low	\N	\N	\N	\N
39abf05b-2603-47f8-aa09-bad590aa5ce1	E2E Test Risk 1765744409701	E2E Test Risk Description - Testing risk creation from comprehensive test	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:33:32.081613	2025-12-14 20:33:32.081613	RISK-0091	\N	\N	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
3dcbb9b4-c522-484b-8add-3d04bcd9ce2a	E2E Test Risk 1765744626967	E2E Test Risk Description - Testing risk creation from comprehensive test	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:37:09.313662	2025-12-14 20:37:09.313662	RISK-0092	\N	\N	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
93897852-6f6a-40ba-9acb-1f2ab9a37d5d	E2E Test Risk 1765745226736	E2E Test Risk Description - Testing risk creation from comprehensive test	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:47:19.268854	2025-12-14 20:47:19.268854	RISK-0093	\N	\N	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
dc4f74a1-a117-400f-b831-1c5b32209730	E2E Test Risk 1765745534892	E2E Test Risk Description - Testing risk creation from comprehensive test	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:52:27.290887	2025-12-14 20:52:27.290887	RISK-0094	\N	\N	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
7173af30-a0aa-4c65-93c0-14111ce0e90e	E2E Test Risk 1765745724448	E2E Test Risk Description - Testing risk creation from comprehensive test	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-14 20:55:36.914179	2025-12-14 20:55:36.914179	RISK-0095	\N	\N	\N	\N	2025-12-14	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
deb28da8-d33f-41a2-9421-fef5033dcd0b	E2E Test Risk 1765788193097	E2E Test Risk Description - Testing risk creation from comprehensive test	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-15 08:43:25.247613	2025-12-15 08:43:25.247613	RISK-0096	\N	\N	\N	\N	2025-12-15	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
6d2b4795-5f65-4446-9182-c8aaabf00d96	E2E Test Risk 1765959707043	E2E Test Risk Description - Testing risk creation functionality	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 08:22:01.38813	2025-12-17 08:22:01.38813	RISK-0097	\N	\N	\N	\N	2025-12-17	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
66d631a2-2a15-49a6-a03c-76f5b11c5ecd	E2E Test Risk 1765959778086	E2E Test Risk Description - Testing risk creation functionality	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 08:23:12.670699	2025-12-17 08:23:12.670699	RISK-0098	\N	\N	\N	\N	2025-12-17	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
0f608fdd-ecc0-402b-be37-1ccb5d814636	E2E Test Risk 1765960248686	E2E Test Risk Description - Testing risk creation functionality	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 08:31:02.975897	2025-12-17 08:31:02.975897	RISK-0099	\N	\N	\N	\N	2025-12-17	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
f04aa3c9-4f99-45d9-bcba-0263ee26cad3	E2E Test Risk 1765961655176	E2E Test Risk Description - Testing risk creation functionality	compliance	identified	3	3	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-17 08:54:29.730503	2025-12-17 08:54:29.730503	RISK-0100	\N	\N	\N	\N	2025-12-17	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	\N	\N	\N	3	3	9	medium	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N
\.


--
-- Data for Name: security_test_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.security_test_results (id, asset_type, asset_id, test_type, test_date, status, tester_name, tester_company, findings_critical, findings_high, findings_medium, findings_low, findings_info, severity, overall_score, passed, summary, findings, recommendations, report_file_id, report_url, remediation_due_date, remediation_completed, retest_required, retest_date, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: software_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.software_assets (id, description, version_number, vendor, owner_id, notes, created_by_id, updated_by_id, unique_identifier, software_name, software_type, patch_level, "vendorContact", "vendorEmail", "vendorPhone", license_type, license_key, "numberOfLicenses", "licensesInUse", "licenseExpiryDate", "ownerId", business_unit, "criticalityLevel", compliance_requirements, "customAttributes", deleted_at, deleted_by, created_by, updated_by, created_at, updated_at, business_unit_id, business_purpose, vendor_name, vendor_contact, license_count, license_expiry, installation_count, security_test_results, last_security_test_date, known_vulnerabilities, support_end_date) FROM stdin;
137cc455-d836-4ebe-be95-01e16b3149c4	Windows Server operating system for production servers.	2022	Microsoft Corporation	\N	Standard server OS. Regular security updates required.	\N	\N	SW-OS-WIN-001	Microsoft Windows Server	operating_system	2022 Build 20348.2113	Microsoft Support	support@microsoft.com	+1-800-MICROSOFT	Volume License	XXXXX-XXXXX-XXXXX-XXXXX-XXXXX	50	45	2026-11-30	b1b35a04-894c-4b77-b209-8d79bee05ec9	IT Operations	critical	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.040812	2025-11-30 09:52:00.040812	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N
abfa002a-e188-4ee8-91ae-7ae28009c8db	Enterprise Linux distribution for production servers.	9.2	Red Hat Inc.	\N	Primary OS for Linux servers. Subscription includes support.	\N	\N	SW-OS-LINUX-001	Red Hat Enterprise Linux	operating_system	9.2.0	Red Hat Support	support@redhat.com	+1-888-REDHAT1	Subscription	\N	100	78	2026-05-29	b1b35a04-894c-4b77-b209-8d79bee05ec9	IT Operations	critical	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.040812	2025-11-30 09:52:00.040812	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N
0fd5cffa-ad68-44c1-9dc5-a7cb93aa7cc1	Office productivity suite including Word, Excel, PowerPoint, and Outlook.	2024	Microsoft Corporation	\N	Standard productivity suite for all employees.	\N	\N	SW-APP-OFFICE-001	Microsoft Office 365	application_software	Version 2401	Microsoft Support	support@microsoft.com	+1-800-MICROSOFT	Subscription	\N	500	487	2026-02-28	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	IT Operations	high	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.040812	2025-11-30 09:52:00.040812	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N
d16b4ca8-c4d3-4261-8119-400f337df3a5	Enterprise antivirus and endpoint security solution.	14.3	Broadcom (Symantec)	\N	Critical security software. Must be kept up to date.	\N	\N	SW-SEC-ANTIVIRUS-001	Symantec Endpoint Protection	security_software	14.3.8269.5000	Symantec Support	support@symantec.com	+1-800-SYMANETC	Subscription	\N	1000	950	2026-03-30	b1b35a04-894c-4b77-b209-8d79bee05ec9	IT Security	critical	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.040812	2025-11-30 09:52:00.040812	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N
3103e72b-dff2-40c9-a9d1-00730d363a74	Enterprise database management system.	19c	Oracle Corporation	\N	Core database software. Processor-based licensing.	\N	\N	SW-DB-ORACLE-001	Oracle Database	database_software	19.21.0.0	Oracle Support	support@oracle.com	+1-800-ORACLE-1	Processor License	\N	8	8	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	IT Operations	critical	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.040812	2025-11-30 09:52:00.040812	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N
76ea9891-3388-4174-be6f-38fa38dd200f	Code editor for development teams.	1.85	Microsoft Corporation	\N	Free open-source editor. Widely used by development team.	\N	\N	SW-DEV-VSCODE-001	Visual Studio Code	development_tool	1.85.2	\N	\N	\N	Open Source (MIT)	\N	\N	\N	\N	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	Product Development	medium	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.040812	2025-11-30 09:52:00.040812	\N	\N	\N	\N	\N	\N	0	\N	\N	\N	\N
2eb97664-3f35-436d-9ba4-92c69b2dc259	\N	2023	\N	\N	\N	\N	\N	SW-MJ0HJ9JL-RBQQ	Microsoft Office 365	application_software	Latest	\N	\N	\N	Subscription	\N	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:52:06.804601	2025-12-10 20:52:06.804601	\N	Productivity suite for all employees	Microsoft	{"name": "Microsoft Support", "email": "support@microsoft.com", "phone": "1-800-642-7676"}	500	2024-12-31	485	\N	2023-11-01	\N	2024-12-31
5c72b1dc-dadd-4f58-a570-18357777c2de	\N	19c	\N	\N	\N	\N	\N	SW-MJ0HJ9K1-O0V6	Oracle Database Enterprise	database_software	19.17.0.0	\N	\N	\N	Perpetual	\N	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:52:06.817935	2025-12-10 20:52:06.817935	\N	Primary database for critical applications	Oracle	{"name": "Oracle Support", "email": "support@oracle.com", "phone": "1-800-633-0753"}	10	\N	8	\N	2023-10-15	\N	2025-12-31
071c96e0-575c-43c7-9652-81e92978c0b7	\N	2024	\N	\N	\N	\N	\N	SW-MJ0HJ9K7-PRXS	Adobe Creative Cloud	application_software	Latest	\N	\N	\N	Subscription	\N	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:52:06.824363	2025-12-10 20:52:06.824363	\N	Design and creative tools for marketing team	Adobe	{"name": "Adobe Support", "email": "support@adobe.com", "phone": "1-800-833-6687"}	25	2024-06-30	23	\N	2023-09-20	\N	2024-06-30
f1f72753-9679-4b1b-b441-9682ab046512	\N	1.0.0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	\N	SW-MJ45O5OT-QWZ3	Test Software Asset 1765621854952	application_software	1.0.1	\N	\N	\N	commercial	TEST-LICENSE-KEY-12345	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	\N	\N	2025-12-13 10:31:04.416215	2025-12-13 10:31:04.416215	81b33af4-d7b4-48a3-9bca-8817c3b88873	Test software asset description for E2E testing	Test Vendor Inc.	{}	10	2026-12-13	0	\N	\N	\N	\N
b4eea249-d2ea-40a0-a0e2-3acb4085fe11	\N	1.0.0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	\N	SW-MJ45OYL8-T3PP	Test Software Asset 1765621892378	application_software	1.0.1	\N	\N	\N	commercial	TEST-LICENSE-KEY-12345	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	\N	\N	2025-12-13 10:31:41.868904	2025-12-13 10:31:41.868904	81b33af4-d7b4-48a3-9bca-8817c3b88873	Test software asset description for E2E testing	Test Vendor Inc.	{}	10	2026-12-13	0	\N	\N	\N	\N
cd9499d5-c507-4575-b758-361499e06305	\N	1.0.0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	\N	SW-MJ4CWXMA-656H	Test Software Asset 1765634022588	application_software	1.0.1	\N	\N	\N	commercial	TEST-LICENSE-KEY-12345	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	\N	\N	2025-12-13 13:53:51.176569	2025-12-13 13:53:51.176569	81b33af4-d7b4-48a3-9bca-8817c3b88873	Test software asset description for E2E testing	Test Vendor Inc.	{}	\N	2026-12-13	0	\N	\N	\N	\N
35b4e032-d33b-403e-b3fe-684839370130	\N	1.0.0	\N	e4a2a06a-e399-4efb-895e-f607075a50a9	\N	\N	\N	SW-MJ5PWF8Z-54E0	Test Software Asset 1765716300005	application_software	1.0.1	\N	\N	\N	commercial	TEST-LICENSE-KEY-12345	\N	\N	\N	\N	\N	medium	\N	\N	\N	\N	\N	\N	2025-12-14 12:45:08.541126	2025-12-14 12:45:08.541126	81b33af4-d7b4-48a3-9bca-8817c3b88873	Test software asset description for E2E testing	Test Vendor Inc.	{}	\N	2026-12-14	0	\N	\N	\N	\N
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, description, address, city, country, website, notes, created_by_id, updated_by_id, unique_identifier, supplier_name, type, primary_contact_name, primary_contact_email, primary_contact_phone, postal_code, criticality_level, business_unit, contract_reference, contract_start_date, contract_end_date, goods_services_provided, compliance_requirements, additional_contacts, custom_attributes, deleted_at, deleted_by, created_by, updated_by, created_at, updated_at, business_unit_id, business_purpose, goods_services_type, contract_value, currency, auto_renewal, primary_contact, secondary_contact, tax_id, registration_number, risk_assessment_date, risk_level, compliance_certifications, insurance_verified, background_check_date, performance_rating, last_review_date, owner_id, supplier_type) FROM stdin;
f726d45e-fc2a-4071-a7a0-6d32ecd0c3ed	Hardware vendor providing servers, workstations, and storage solutions.	King Fahd Road, Al Olaya	Riyadh	Saudi Arabia	https://www.dell.com	Primary hardware vendor. Annual security assessment completed.	\N	\N	SUP-IT-001	Dell Technologies	vendor	Ahmed Al-Mansouri	ahmed.almansouri@dell.com	+966-11-234-5678	12211	high	IT Operations	CTR-DELL-2023-001	2024-11-30	2026-11-30	Server hardware, workstations, storage arrays, maintenance services	[]	[{"name":"Support Team","email":"support@dell.com","phone":"+966-11-234-5679"}]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.059635	2025-11-30 09:52:00.059635	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N
313e9e47-4bb4-4585-b6e8-2617e4f705bd	Cloud service provider for infrastructure and platform services.	King Abdullah Financial District	Riyadh	Saudi Arabia	https://aws.amazon.com	Critical cloud provider. Hosts production workloads. SOC 2 Type II certified.	\N	\N	SUP-CLOUD-001	Amazon Web Services	service_provider	Mohammed Al-Rashid	m.alrashid@aws.com	+966-11-345-6789	13519	critical	IT Operations	CTR-AWS-2023-002	2023-12-01	2027-11-30	Cloud infrastructure, compute, storage, networking, managed services	[]	[{"name":"Technical Support","email":"support@aws.com","phone":"+966-11-345-6790"},{"name":"Account Manager","email":"account@aws.com","phone":"+966-11-345-6791"}]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.059635	2025-11-30 09:52:00.059635	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N
ee92b760-068f-4078-a8dc-4f4a3052255b	Cybersecurity consulting and penetration testing services.	Al Tahlia Street	Riyadh	Saudi Arabia	https://www.cybersec-consulting.com	Engaged for quarterly security assessments and incident response.	\N	\N	SUP-SEC-001	Cybersecurity Consulting Group	consultant	Fatima Al-Zahra	fatima@cybersec-consulting.com	+966-11-456-7890	12211	high	IT Security	CTR-CYBER-2024-001	2025-09-01	2026-09-01	Penetration testing, security assessments, incident response, security consulting	[]	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.059635	2025-11-30 09:52:00.059635	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N
39a2eded-e3bf-420c-b82b-73621dcd9405	Software vendor providing operating systems, productivity software, and cloud services.	One Microsoft Way	Redmond	United States	https://www.microsoft.com	Major software vendor. Enterprise Agreement in place.	\N	\N	SUP-SOFT-001	Microsoft Corporation	vendor	Sarah Johnson	sarah.johnson@microsoft.com	+1-425-882-8080	98052	critical	IT Operations	CTR-MSFT-2023-003	2024-11-30	2026-11-30	Windows Server, Office 365, Azure cloud services, software licenses	[]	[{"name":"Volume Licensing","email":"licensing@microsoft.com","phone":"+1-800-MICROSOFT"}]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.059635	2025-11-30 09:52:00.059635	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N
a3376e51-c174-448a-8a67-3d7026c1921d	Facilities maintenance and cleaning services.	Prince Sultan Road	Riyadh	Saudi Arabia	https://www.facilities-mgmt.com	Non-IT vendor. No data access required.	\N	\N	SUP-FAC-001	Facilities Management Co.	contractor	Khalid Al-Saud	khalid@facilities-mgmt.com	+966-11-567-8901	11564	low	Facilities	CTR-FAC-2024-002	2025-06-03	2026-06-03	Cleaning services, maintenance, facility management	[]	[]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.059635	2025-11-30 09:52:00.059635	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N
9dd1d876-01f6-47c2-b41b-79777ba15490	Offshore software development and maintenance services.	IT Park, Electronic City	Bangalore	India	https://www.offshore-dev.com	Offshore development team. Has access to development environments. Regular security reviews.	\N	\N	SUP-DEV-001	Offshore Development Team	contractor	Rajesh Kumar	rajesh@offshore-dev.com	+91-80-1234-5678	560100	high	Product Development	CTR-DEV-2023-004	2024-06-03	2026-07-08	Software development, code maintenance, testing services	[]	[{"name":"Project Manager","email":"pm@offshore-dev.com","phone":"+91-80-1234-5679"}]	\N	\N	\N	\N	\N	2025-11-30 09:52:00.059635	2025-11-30 09:52:00.059635	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N
f87d985e-92ee-4690-b186-780e75e5bb49	\N	123 Cloud Street, San Francisco, CA 94105	\N	United States	https://www.cloudprovider.com	\N	\N	\N	SUP-001	Cloud Services Provider Inc	other	\N	\N	\N	\N	critical	\N	CONTRACT-2023-001	2023-01-01	2025-12-31	\N	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:58:33.317802	2025-12-10 20:58:33.317802	\N	Cloud infrastructure and hosting services	["Cloud Services", "Infrastructure"]	500000.00	USD	t	{"name": "John Smith", "email": "john.smith@cloudprovider.com", "phone": "+1-555-1000", "title": "Account Manager"}	{"name": "Jane Doe", "email": "jane.doe@cloudprovider.com", "phone": "+1-555-1001", "title": "Technical Support"}	12-3456789	REG-123456	2023-01-15	low	["ISO 27001", "SOC 2 Type II"]	t	2023-01-10	4.80	2023-12-01	\N	service_provider
71fd9ee6-0b0f-4b94-bd23-b67b2eeff1f7	\N	456 Security Blvd, New York, NY 10001	\N	United States	https://www.securitygroup.com	\N	\N	\N	SUP-002	Security Consulting Group	other	\N	\N	\N	\N	high	\N	CONTRACT-2023-045	2023-06-01	2024-05-31	\N	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:58:33.331811	2025-12-10 20:58:33.331811	\N	Cybersecurity consulting and penetration testing	["Consulting Services", "Security Assessments"]	150000.00	USD	f	{"name": "Mike Johnson", "email": "mike.j@securitygroup.com", "phone": "+1-555-2000", "title": "Senior Consultant"}	\N	98-7654321	REG-789012	2023-05-20	low	["ISO 27001"]	t	2023-05-15	4.90	2023-11-15	\N	consultant
8439ab1e-ac92-4967-8516-3b8259dbb7f1	\N	789 Supply Avenue, Chicago, IL 60601	\N	United States	https://www.officesupplies.com	\N	\N	\N	SUP-003	Office Supplies Co	other	\N	\N	\N	\N	low	\N	CONTRACT-2023-089	2023-01-01	2023-12-31	\N	\N	\N	\N	\N	\N	b1b35a04-894c-4b77-b209-8d79bee05ec9	b1b35a04-894c-4b77-b209-8d79bee05ec9	2025-12-10 20:58:33.337647	2025-12-10 20:58:33.337647	\N	Office supplies and equipment	["Office Supplies", "Equipment"]	50000.00	USD	t	{"name": "Sarah Williams", "email": "sarah.w@officesupplies.com", "phone": "+1-555-3000", "title": "Sales Representative"}	\N	11-2233445	REG-345678	2022-12-15	low	\N	t	2022-12-10	4.50	2023-10-01	\N	vendor
67ac5f10-6fac-4f6b-8b06-6df32ae48451	\N	123 Business Street	\N	United States	https://www.supplier.com	\N	\N	\N	SUP-1765622983970-acxom0nv7	Test Supplier 1765622975764	other	\N	\N	\N	\N	high	\N	CONTRACT-2024-001	2025-12-13	2026-12-13	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 10:49:44.091548	2025-12-13 10:49:44.091548	\N	Complete test supplier for E2E testing	["Cloud infrastructure services and support"]	\N	\N	f	{}	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	vendor
b36ea0af-e791-4c3e-af8a-c373448c9fea	\N	123 Business Street	\N	United States	https://www.supplier.com	\N	\N	\N	SUP-1765636569275-2ldzngju0	Test Supplier 1765636561604	other	\N	\N	\N	\N	high	\N	CONTRACT-2024-001	2025-12-13	2026-12-13	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-13 14:36:09.500553	2025-12-13 14:36:09.500553	\N	Complete test supplier for E2E testing	["Cloud infrastructure services and support"]	\N	\N	f	{}	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	vendor
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, description, "taskType", priority, status, "dueDate", "assignedToId", "relatedEntityType", "relatedEntityId", "organizationId", "createdAt", "updatedAt", assigned_to_id) FROM stdin;
4c3c7d9b-6804-4003-bfec-6668a648e20d	Review Access Policy	Review and update the organization access control policy	policy_review	high	todo	2025-11-29 16:22:22.926	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	\N	2025-11-29 16:22:22.926793	2025-11-29 16:22:22.926793	\N
f5f70a3d-c52d-4f58-b98a-92ec9fca2cdd	Update Risk Assessment	Complete quarterly risk assessment update	risk_mitigation	medium	todo	2025-11-30 16:22:22.926	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	\N	2025-11-29 16:22:22.926793	2025-11-29 16:22:22.926793	\N
2135572c-36ca-4500-850d-43e599031f12	Approve New Vendor	Review and approve new vendor compliance documentation	compliance_requirement	low	todo	2025-12-06 16:22:22.926	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	\N	2025-11-29 16:22:22.926793	2025-11-29 16:22:22.926793	\N
2aeef744-f281-4056-9915-9f296e27c4f3	Complete NCA Compliance Review	Annual NCA framework compliance review	compliance_requirement	high	in_progress	2025-12-02 16:22:22.926	b1b35a04-894c-4b77-b209-8d79bee05ec9	\N	\N	\N	2025-11-29 16:22:22.926793	2025-11-29 16:22:22.926793	\N
\.


--
-- Data for Name: treatment_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.treatment_tasks (id, treatment_id, title, description, assignee_id, status, due_date, completed_date, display_order, created_at, updated_at) FROM stdin;
6d2bba28-8c46-4a32-959e-11965558c9c5	31acee8c-c613-46a7-95ad-8e2f623f5b80	Conduct risk assessment	Task for Implement Multi-Factor Authentication	b5525c73-c26a-48d4-a90a-582fa451e518	completed	2025-12-15	\N	0	2025-12-07 20:01:51.153193	2025-12-07 20:01:51.153193
4e9a880b-fefd-4d54-ab35-e644453fc0ba	31acee8c-c613-46a7-95ad-8e2f623f5b80	Develop implementation plan	Task for Implement Multi-Factor Authentication	550e8400-e29b-41d4-a716-446655440001	completed	2025-12-28	\N	1	2025-12-07 20:01:51.158406	2025-12-07 20:01:51.158406
752f1ad7-d9da-4d11-904f-98db4263bbcd	31acee8c-c613-46a7-95ad-8e2f623f5b80	Obtain management approval	Task for Implement Multi-Factor Authentication	550e8400-e29b-41d4-a716-446655440001	in_progress	2025-12-24	\N	2	2025-12-07 20:01:51.159662	2025-12-07 20:01:51.159662
64c5e795-e1d0-4de4-8d4f-605d6a3d499f	31acee8c-c613-46a7-95ad-8e2f623f5b80	Execute implementation	Task for Implement Multi-Factor Authentication	e7f8a16b-c291-4696-8be0-992c381c8013	planned	2025-12-16	\N	3	2025-12-07 20:01:51.160951	2025-12-07 20:01:51.160951
978d0742-c584-44e2-95c7-ec942fdf2774	31acee8c-c613-46a7-95ad-8e2f623f5b80	Test and validate	Task for Implement Multi-Factor Authentication	580d01e1-da18-49be-84aa-957ee84719ab	planned	2025-12-28	\N	4	2025-12-07 20:01:51.162765	2025-12-07 20:01:51.162765
c5a9544e-5488-4333-a08b-d112a74c4d9a	69b4716f-b9d4-464f-822d-3b686856918f	Conduct risk assessment	Task for Vendor Security Assessment Program	b5525c73-c26a-48d4-a90a-582fa451e518	completed	2026-01-01	\N	0	2025-12-07 20:01:51.166297	2025-12-07 20:01:51.166297
d34b79ec-7d04-4312-ab32-2509c9892d40	69b4716f-b9d4-464f-822d-3b686856918f	Develop implementation plan	Task for Vendor Security Assessment Program	580d01e1-da18-49be-84aa-957ee84719ab	completed	2025-12-29	\N	1	2025-12-07 20:01:51.167548	2025-12-07 20:01:51.167548
b6e5d668-c88a-4548-a803-a24ffed8ce8f	69b4716f-b9d4-464f-822d-3b686856918f	Obtain management approval	Task for Vendor Security Assessment Program	b1b35a04-894c-4b77-b209-8d79bee05ec9	in_progress	2025-12-16	\N	2	2025-12-07 20:01:51.168402	2025-12-07 20:01:51.168402
d8b4921d-ddf2-4946-a102-7da9757021b1	69b4716f-b9d4-464f-822d-3b686856918f	Execute implementation	Task for Vendor Security Assessment Program	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	2025-12-31	\N	3	2025-12-07 20:01:51.168992	2025-12-07 20:01:51.168992
cab3cce3-e11d-460e-8bd2-7d0fbc0db781	69b4716f-b9d4-464f-822d-3b686856918f	Test and validate	Task for Vendor Security Assessment Program	b5525c73-c26a-48d4-a90a-582fa451e518	planned	2025-12-09	\N	4	2025-12-07 20:01:51.169596	2025-12-07 20:01:51.169596
045c0a3c-52b6-490a-9d97-63a326843159	407407c3-2df7-4d69-a170-dd2b733398b4	Conduct risk assessment	Task for Compliance Monitoring System	e7f8a16b-c291-4696-8be0-992c381c8013	completed	2025-12-22	\N	0	2025-12-07 20:01:51.172388	2025-12-07 20:01:51.172388
195e9692-4c03-4151-a9cc-c3d446e9a774	407407c3-2df7-4d69-a170-dd2b733398b4	Develop implementation plan	Task for Compliance Monitoring System	e7f8a16b-c291-4696-8be0-992c381c8013	completed	2025-12-31	\N	1	2025-12-07 20:01:51.173248	2025-12-07 20:01:51.173248
4c7d735e-75cb-4777-8216-eecebf51ce54	407407c3-2df7-4d69-a170-dd2b733398b4	Obtain management approval	Task for Compliance Monitoring System	b1b35a04-894c-4b77-b209-8d79bee05ec9	in_progress	2025-12-07	\N	2	2025-12-07 20:01:51.174252	2025-12-07 20:01:51.174252
02add063-69b7-464a-a958-e719fc52eacb	407407c3-2df7-4d69-a170-dd2b733398b4	Execute implementation	Task for Compliance Monitoring System	550e8400-e29b-41d4-a716-446655440001	planned	2025-12-15	\N	3	2025-12-07 20:01:51.175038	2025-12-07 20:01:51.175038
263377f0-d5a6-461d-8097-f25f173dcfbb	407407c3-2df7-4d69-a170-dd2b733398b4	Test and validate	Task for Compliance Monitoring System	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	2025-12-28	\N	4	2025-12-07 20:01:51.175931	2025-12-07 20:01:51.175931
d3f8b67c-a5b7-44ca-aa8e-7ce78ef723e1	28facc7a-add6-48dc-878c-ff4d0277b6e1	Conduct risk assessment	Task for Infrastructure Redundancy	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	2025-12-20	\N	0	2025-12-07 20:01:51.17756	2025-12-07 20:01:51.17756
2b862037-516b-438f-872b-48d016445242	28facc7a-add6-48dc-878c-ff4d0277b6e1	Develop implementation plan	Task for Infrastructure Redundancy	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	2025-12-27	\N	1	2025-12-07 20:01:51.178417	2025-12-07 20:01:51.178417
5e94d52e-d43f-47dd-b94b-6af915551546	28facc7a-add6-48dc-878c-ff4d0277b6e1	Obtain management approval	Task for Infrastructure Redundancy	550e8400-e29b-41d4-a716-446655440001	in_progress	2025-12-20	\N	2	2025-12-07 20:01:51.179215	2025-12-07 20:01:51.179215
4d7dee40-899f-4e47-8218-ea7464ebd779	28facc7a-add6-48dc-878c-ff4d0277b6e1	Execute implementation	Task for Infrastructure Redundancy	01180d49-d38b-4421-a130-b1ce4b7c34fa	planned	2025-12-15	\N	3	2025-12-07 20:01:51.18026	2025-12-07 20:01:51.18026
a21e6516-0191-4612-abdb-d174867bca75	28facc7a-add6-48dc-878c-ff4d0277b6e1	Test and validate	Task for Infrastructure Redundancy	b5525c73-c26a-48d4-a90a-582fa451e518	planned	2026-01-04	\N	4	2025-12-07 20:01:51.181081	2025-12-07 20:01:51.181081
ef18fb85-4b37-449a-b6e3-5ed42ba63ada	905649eb-5428-4282-acec-bd70c2887064	Conduct risk assessment	Task for Knowledge Management Program	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	2025-12-18	\N	0	2025-12-07 20:01:51.182907	2025-12-07 20:01:51.182907
f0d85f11-9dcd-4e3d-8bc5-0682c248ca56	905649eb-5428-4282-acec-bd70c2887064	Develop implementation plan	Task for Knowledge Management Program	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	2025-12-16	\N	1	2025-12-07 20:01:51.18371	2025-12-07 20:01:51.18371
f247e14e-cb01-44fc-aedc-ef599e02d7c4	905649eb-5428-4282-acec-bd70c2887064	Obtain management approval	Task for Knowledge Management Program	e7f8a16b-c291-4696-8be0-992c381c8013	in_progress	2025-12-27	\N	2	2025-12-07 20:01:51.184451	2025-12-07 20:01:51.184451
1305369c-4765-4e3e-a099-00dbc70fe813	905649eb-5428-4282-acec-bd70c2887064	Execute implementation	Task for Knowledge Management Program	550e8400-e29b-41d4-a716-446655440001	planned	2025-12-15	\N	3	2025-12-07 20:01:51.185377	2025-12-07 20:01:51.185377
8bbd7047-f954-4faa-9455-61dddb81671f	905649eb-5428-4282-acec-bd70c2887064	Test and validate	Task for Knowledge Management Program	580d01e1-da18-49be-84aa-957ee84719ab	planned	2025-12-18	\N	4	2025-12-07 20:01:51.186057	2025-12-07 20:01:51.186057
dccf9ec1-79df-4aa4-add0-15f0976de7f3	bc0fee44-fcca-4462-b940-2418ec9e6812	Conduct risk assessment	Task for Cloud Service Level Agreements	e4a2a06a-e399-4efb-895e-f607075a50a9	completed	2025-12-29	\N	0	2025-12-07 20:01:51.188115	2025-12-07 20:01:51.188115
c09e0923-d161-489a-b695-3b42c060fad7	bc0fee44-fcca-4462-b940-2418ec9e6812	Develop implementation plan	Task for Cloud Service Level Agreements	b5525c73-c26a-48d4-a90a-582fa451e518	completed	2026-01-01	\N	1	2025-12-07 20:01:51.189394	2025-12-07 20:01:51.189394
53b90d11-38d0-4766-a817-c2a48933c3d8	bc0fee44-fcca-4462-b940-2418ec9e6812	Obtain management approval	Task for Cloud Service Level Agreements	b1b35a04-894c-4b77-b209-8d79bee05ec9	in_progress	2025-12-29	\N	2	2025-12-07 20:01:51.190226	2025-12-07 20:01:51.190226
125fecce-62cd-446b-aca0-a851f6f025d9	bc0fee44-fcca-4462-b940-2418ec9e6812	Execute implementation	Task for Cloud Service Level Agreements	01180d49-d38b-4421-a130-b1ce4b7c34fa	planned	2026-01-02	\N	3	2025-12-07 20:01:51.190992	2025-12-07 20:01:51.190992
41d864d3-b7b3-4f1f-9d17-f6f4af16826d	bc0fee44-fcca-4462-b940-2418ec9e6812	Test and validate	Task for Cloud Service Level Agreements	b1b35a04-894c-4b77-b209-8d79bee05ec9	planned	2025-12-16	\N	4	2025-12-07 20:01:51.191699	2025-12-07 20:01:51.191699
363fd3f3-edb0-4094-a517-cf6b0bd71a3f	7f581dcf-72a5-40af-9b83-58b246451956	Conduct risk assessment	Task for Enhanced Financial Controls	e4a2a06a-e399-4efb-895e-f607075a50a9	completed	2026-01-01	\N	0	2025-12-07 20:01:51.193251	2025-12-07 20:01:51.193251
6058b1a7-b2cb-409f-b5a1-1e3eeafaefe8	7f581dcf-72a5-40af-9b83-58b246451956	Develop implementation plan	Task for Enhanced Financial Controls	b5525c73-c26a-48d4-a90a-582fa451e518	completed	2025-12-31	\N	1	2025-12-07 20:01:51.194628	2025-12-07 20:01:51.194628
178c53f3-e7d7-420e-83c7-177ed2008c91	7f581dcf-72a5-40af-9b83-58b246451956	Obtain management approval	Task for Enhanced Financial Controls	b5525c73-c26a-48d4-a90a-582fa451e518	in_progress	2026-01-05	\N	2	2025-12-07 20:01:51.196047	2025-12-07 20:01:51.196047
54ea58d2-32cd-4105-903d-7ea9ca1cfab8	7f581dcf-72a5-40af-9b83-58b246451956	Execute implementation	Task for Enhanced Financial Controls	b5525c73-c26a-48d4-a90a-582fa451e518	planned	2025-12-14	\N	3	2025-12-07 20:01:51.19726	2025-12-07 20:01:51.19726
e9266381-e2d5-4ab7-869e-3a61ae74a37d	7f581dcf-72a5-40af-9b83-58b246451956	Test and validate	Task for Enhanced Financial Controls	b1b35a04-894c-4b77-b209-8d79bee05ec9	planned	2025-12-28	\N	4	2025-12-07 20:01:51.198671	2025-12-07 20:01:51.198671
3e1a7b7d-5f19-4590-b68f-d39648d73398	b25a6ad2-ea45-4cff-8f6e-efc39c8785fc	Conduct risk assessment	Task for Incident Response Plan	550e8400-e29b-41d4-a716-446655440001	completed	2025-12-26	\N	0	2025-12-07 20:01:51.20139	2025-12-07 20:01:51.20139
cf05e7a0-7b60-4e6b-9ecc-7414347042c5	b25a6ad2-ea45-4cff-8f6e-efc39c8785fc	Develop implementation plan	Task for Incident Response Plan	b5525c73-c26a-48d4-a90a-582fa451e518	completed	2025-12-16	\N	1	2025-12-07 20:01:51.202607	2025-12-07 20:01:51.202607
a5e135a9-2afa-49a6-bd5c-0b7671f34258	b25a6ad2-ea45-4cff-8f6e-efc39c8785fc	Obtain management approval	Task for Incident Response Plan	b5525c73-c26a-48d4-a90a-582fa451e518	in_progress	2025-12-08	\N	2	2025-12-07 20:01:51.20386	2025-12-07 20:01:51.20386
3ba0bcd8-734e-4ffd-9b25-e68ebc01a538	b25a6ad2-ea45-4cff-8f6e-efc39c8785fc	Execute implementation	Task for Incident Response Plan	e7f8a16b-c291-4696-8be0-992c381c8013	planned	2026-01-03	\N	3	2025-12-07 20:01:51.204922	2025-12-07 20:01:51.204922
9e4b92d8-2fd5-46ba-8ef6-292ea4f2aaab	b25a6ad2-ea45-4cff-8f6e-efc39c8785fc	Test and validate	Task for Incident Response Plan	b5525c73-c26a-48d4-a90a-582fa451e518	planned	2026-01-03	\N	4	2025-12-07 20:01:51.20621	2025-12-07 20:01:51.20621
3d9bd966-18b8-4c00-b828-3c6bcbf2b837	f17aa871-7b54-4973-ab3b-e7c108877b5c	Conduct risk assessment	Task for Implement Multi-Factor Authentication	550e8400-e29b-41d4-a716-446655440001	completed	2025-12-16	\N	0	2025-12-07 20:02:03.813399	2025-12-07 20:02:03.813399
b7d87279-b9bf-4d80-a950-5bf614759733	f17aa871-7b54-4973-ab3b-e7c108877b5c	Develop implementation plan	Task for Implement Multi-Factor Authentication	01180d49-d38b-4421-a130-b1ce4b7c34fa	completed	2025-12-09	\N	1	2025-12-07 20:02:03.816081	2025-12-07 20:02:03.816081
0fdbf4c0-7057-4211-b98e-650507f994fb	f17aa871-7b54-4973-ab3b-e7c108877b5c	Obtain management approval	Task for Implement Multi-Factor Authentication	e4a2a06a-e399-4efb-895e-f607075a50a9	in_progress	2025-12-16	\N	2	2025-12-07 20:02:03.817151	2025-12-07 20:02:03.817151
3a0808e8-ca87-4afd-a94d-576bc350e369	f17aa871-7b54-4973-ab3b-e7c108877b5c	Execute implementation	Task for Implement Multi-Factor Authentication	b5525c73-c26a-48d4-a90a-582fa451e518	planned	2025-12-08	\N	3	2025-12-07 20:02:03.817972	2025-12-07 20:02:03.817972
24efb5f6-7787-4618-a587-731b50930cc5	f17aa871-7b54-4973-ab3b-e7c108877b5c	Test and validate	Task for Implement Multi-Factor Authentication	01180d49-d38b-4421-a130-b1ce4b7c34fa	planned	2025-12-08	\N	4	2025-12-07 20:02:03.819005	2025-12-07 20:02:03.819005
c47b9718-5dc2-423c-b129-34208dce5754	5ffecc9a-e030-4ed5-b578-f9ff44a49264	Conduct risk assessment	Task for Vendor Security Assessment Program	01180d49-d38b-4421-a130-b1ce4b7c34fa	completed	2025-12-10	\N	0	2025-12-07 20:02:03.82245	2025-12-07 20:02:03.82245
79c73be7-e6a9-4b7d-8d19-68e4644d1c25	5ffecc9a-e030-4ed5-b578-f9ff44a49264	Develop implementation plan	Task for Vendor Security Assessment Program	e4a2a06a-e399-4efb-895e-f607075a50a9	completed	2025-12-28	\N	1	2025-12-07 20:02:03.823958	2025-12-07 20:02:03.823958
b362f376-1545-4c91-bdb0-1a44f8d1ae1e	5ffecc9a-e030-4ed5-b578-f9ff44a49264	Obtain management approval	Task for Vendor Security Assessment Program	b5525c73-c26a-48d4-a90a-582fa451e518	in_progress	2026-01-05	\N	2	2025-12-07 20:02:03.825104	2025-12-07 20:02:03.825104
520cead3-8b88-4ddb-9837-2a01d0051842	5ffecc9a-e030-4ed5-b578-f9ff44a49264	Execute implementation	Task for Vendor Security Assessment Program	e7f8a16b-c291-4696-8be0-992c381c8013	planned	2025-12-29	\N	3	2025-12-07 20:02:03.825996	2025-12-07 20:02:03.825996
a777690b-4d86-4d99-a2bc-392baf4f4d9a	5ffecc9a-e030-4ed5-b578-f9ff44a49264	Test and validate	Task for Vendor Security Assessment Program	e7f8a16b-c291-4696-8be0-992c381c8013	planned	2025-12-13	\N	4	2025-12-07 20:02:03.826914	2025-12-07 20:02:03.826914
5c263d64-c2c8-444f-988b-47c469a6c9a5	70fe1bad-35b0-493f-8039-78fe0c3f9f86	Conduct risk assessment	Task for Compliance Monitoring System	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	2026-01-02	\N	0	2025-12-07 20:02:03.829212	2025-12-07 20:02:03.829212
e5eebe7f-81d0-4f24-bde8-668f309103a4	70fe1bad-35b0-493f-8039-78fe0c3f9f86	Develop implementation plan	Task for Compliance Monitoring System	b5525c73-c26a-48d4-a90a-582fa451e518	completed	2025-12-25	\N	1	2025-12-07 20:02:03.830113	2025-12-07 20:02:03.830113
fe8fbb06-8180-4f75-b91f-86350567192d	70fe1bad-35b0-493f-8039-78fe0c3f9f86	Obtain management approval	Task for Compliance Monitoring System	01180d49-d38b-4421-a130-b1ce4b7c34fa	in_progress	2026-01-02	\N	2	2025-12-07 20:02:03.830852	2025-12-07 20:02:03.830852
cc44eb55-9d98-4568-b091-621e17c03941	70fe1bad-35b0-493f-8039-78fe0c3f9f86	Execute implementation	Task for Compliance Monitoring System	b5525c73-c26a-48d4-a90a-582fa451e518	planned	2025-12-12	\N	3	2025-12-07 20:02:03.831699	2025-12-07 20:02:03.831699
3b8779a5-139e-45a0-a5ad-d1e585e7978e	70fe1bad-35b0-493f-8039-78fe0c3f9f86	Test and validate	Task for Compliance Monitoring System	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	2026-01-04	\N	4	2025-12-07 20:02:03.83239	2025-12-07 20:02:03.83239
ef644cd2-c0f1-48e0-851d-5f3239131d56	6fab7f22-3fc8-4708-baa3-1e17fd70dd71	Conduct risk assessment	Task for Infrastructure Redundancy	e4a2a06a-e399-4efb-895e-f607075a50a9	completed	2025-12-11	\N	0	2025-12-07 20:02:03.834073	2025-12-07 20:02:03.834073
5d4ea49c-128b-4fa3-b5ec-0d2bab66758c	6fab7f22-3fc8-4708-baa3-1e17fd70dd71	Develop implementation plan	Task for Infrastructure Redundancy	b1b35a04-894c-4b77-b209-8d79bee05ec9	completed	2025-12-11	\N	1	2025-12-07 20:02:03.835474	2025-12-07 20:02:03.835474
230ba362-a34c-40c9-a10d-46dba4bc8c03	6fab7f22-3fc8-4708-baa3-1e17fd70dd71	Obtain management approval	Task for Infrastructure Redundancy	e4a2a06a-e399-4efb-895e-f607075a50a9	in_progress	2025-12-24	\N	2	2025-12-07 20:02:03.836358	2025-12-07 20:02:03.836358
69ccd016-2342-4f24-9051-aecd43f67c1c	6fab7f22-3fc8-4708-baa3-1e17fd70dd71	Execute implementation	Task for Infrastructure Redundancy	580d01e1-da18-49be-84aa-957ee84719ab	planned	2025-12-25	\N	3	2025-12-07 20:02:03.837477	2025-12-07 20:02:03.837477
f506b748-88cc-4277-8976-05c2dd13ca56	6fab7f22-3fc8-4708-baa3-1e17fd70dd71	Test and validate	Task for Infrastructure Redundancy	b5525c73-c26a-48d4-a90a-582fa451e518	planned	2025-12-31	\N	4	2025-12-07 20:02:03.838433	2025-12-07 20:02:03.838433
150cbc3a-7f30-4c3e-93fb-d2615c5d6d97	00016130-51f1-4497-a94f-f6ba44243c81	Conduct risk assessment	Task for Knowledge Management Program	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	2026-01-05	\N	0	2025-12-07 20:02:03.840209	2025-12-07 20:02:03.840209
dd4412d4-2a76-4361-9ce0-5ad53f32ce5d	00016130-51f1-4497-a94f-f6ba44243c81	Develop implementation plan	Task for Knowledge Management Program	580d01e1-da18-49be-84aa-957ee84719ab	completed	2025-12-10	\N	1	2025-12-07 20:02:03.84088	2025-12-07 20:02:03.84088
b0ec282a-ef22-481b-9130-9c5487f0127d	00016130-51f1-4497-a94f-f6ba44243c81	Obtain management approval	Task for Knowledge Management Program	b1b35a04-894c-4b77-b209-8d79bee05ec9	in_progress	2025-12-13	\N	2	2025-12-07 20:02:03.841466	2025-12-07 20:02:03.841466
6d1411e9-634b-40ae-8d56-9124fc2eb367	00016130-51f1-4497-a94f-f6ba44243c81	Execute implementation	Task for Knowledge Management Program	b1b35a04-894c-4b77-b209-8d79bee05ec9	planned	2025-12-13	\N	3	2025-12-07 20:02:03.842356	2025-12-07 20:02:03.842356
27a58982-5104-4add-b6f7-243ca6de93fa	00016130-51f1-4497-a94f-f6ba44243c81	Test and validate	Task for Knowledge Management Program	e4a2a06a-e399-4efb-895e-f607075a50a9	planned	2025-12-14	\N	4	2025-12-07 20:02:03.843619	2025-12-07 20:02:03.843619
ca015e9c-bb82-4aa5-b805-6438c116f61f	a447f4f4-43a0-45a9-b89a-0e9a65e23833	Conduct risk assessment	Task for Cloud Service Level Agreements	01180d49-d38b-4421-a130-b1ce4b7c34fa	completed	2025-12-08	\N	0	2025-12-07 20:02:03.846164	2025-12-07 20:02:03.846164
fe87e6e7-1d47-4cea-9359-59066b73f3b5	a447f4f4-43a0-45a9-b89a-0e9a65e23833	Develop implementation plan	Task for Cloud Service Level Agreements	e7f8a16b-c291-4696-8be0-992c381c8013	completed	2025-12-19	\N	1	2025-12-07 20:02:03.847337	2025-12-07 20:02:03.847337
cad966c8-3230-4131-8af4-c4470b901aaf	a447f4f4-43a0-45a9-b89a-0e9a65e23833	Obtain management approval	Task for Cloud Service Level Agreements	e4a2a06a-e399-4efb-895e-f607075a50a9	in_progress	2026-01-06	\N	2	2025-12-07 20:02:03.848341	2025-12-07 20:02:03.848341
c2f9b911-c458-41fe-b2b5-f0f5cc2636ad	a447f4f4-43a0-45a9-b89a-0e9a65e23833	Execute implementation	Task for Cloud Service Level Agreements	580d01e1-da18-49be-84aa-957ee84719ab	planned	2026-01-02	\N	3	2025-12-07 20:02:03.849398	2025-12-07 20:02:03.849398
d9f1a6e5-7bec-4c93-81fe-7a2ab7fa1a02	a447f4f4-43a0-45a9-b89a-0e9a65e23833	Test and validate	Task for Cloud Service Level Agreements	e7f8a16b-c291-4696-8be0-992c381c8013	planned	2025-12-15	\N	4	2025-12-07 20:02:03.850301	2025-12-07 20:02:03.850301
9b38bb46-8842-423c-95dd-5d7c939149a0	284e1508-021d-4e7e-adaf-8b6a38dd8f7a	Conduct risk assessment	Task for Enhanced Financial Controls	e4a2a06a-e399-4efb-895e-f607075a50a9	completed	2025-12-14	\N	0	2025-12-07 20:02:03.852754	2025-12-07 20:02:03.852754
b7137608-ff79-404b-9459-fe63debf8eac	284e1508-021d-4e7e-adaf-8b6a38dd8f7a	Develop implementation plan	Task for Enhanced Financial Controls	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	2025-12-13	\N	1	2025-12-07 20:02:03.853493	2025-12-07 20:02:03.853493
fa82a904-c72a-4995-99a5-52799532b2dd	284e1508-021d-4e7e-adaf-8b6a38dd8f7a	Obtain management approval	Task for Enhanced Financial Controls	e7f8a16b-c291-4696-8be0-992c381c8013	in_progress	2025-12-25	\N	2	2025-12-07 20:02:03.854296	2025-12-07 20:02:03.854296
ac94eac2-8ceb-4a5c-87dc-db08ae3f1933	284e1508-021d-4e7e-adaf-8b6a38dd8f7a	Execute implementation	Task for Enhanced Financial Controls	580d01e1-da18-49be-84aa-957ee84719ab	planned	2025-12-30	\N	3	2025-12-07 20:02:03.855576	2025-12-07 20:02:03.855576
5360ec14-8ae1-4c52-8fce-4164780e48c1	284e1508-021d-4e7e-adaf-8b6a38dd8f7a	Test and validate	Task for Enhanced Financial Controls	e7f8a16b-c291-4696-8be0-992c381c8013	planned	2025-12-22	\N	4	2025-12-07 20:02:03.856411	2025-12-07 20:02:03.856411
c122f936-3fb5-4dc7-bd6e-a4c7254ce34f	6c2eaf4e-8d73-4793-a559-d14fc7210fb7	Conduct risk assessment	Task for Incident Response Plan	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	2025-12-31	\N	0	2025-12-07 20:02:03.857751	2025-12-07 20:02:03.857751
3f5eedc8-3957-46d5-8d23-df4d09bd3e4f	6c2eaf4e-8d73-4793-a559-d14fc7210fb7	Develop implementation plan	Task for Incident Response Plan	95fb6e10-37bd-4afb-84ae-a947f08ba5a3	completed	2025-12-31	\N	1	2025-12-07 20:02:03.858263	2025-12-07 20:02:03.858263
bb26d071-4a15-40e6-8451-15a88df0faa3	6c2eaf4e-8d73-4793-a559-d14fc7210fb7	Obtain management approval	Task for Incident Response Plan	01180d49-d38b-4421-a130-b1ce4b7c34fa	in_progress	2025-12-16	\N	2	2025-12-07 20:02:03.858832	2025-12-07 20:02:03.858832
be3c07d0-9af2-46d1-88fb-64dc091f0a30	6c2eaf4e-8d73-4793-a559-d14fc7210fb7	Execute implementation	Task for Incident Response Plan	580d01e1-da18-49be-84aa-957ee84719ab	planned	2025-12-30	\N	3	2025-12-07 20:02:03.859916	2025-12-07 20:02:03.859916
66f1be36-9b5d-48e5-b875-e34a561cada9	6c2eaf4e-8d73-4793-a559-d14fc7210fb7	Test and validate	Task for Incident Response Plan	01180d49-d38b-4421-a130-b1ce4b7c34fa	planned	2026-01-06	\N	4	2025-12-07 20:02:03.860707	2025-12-07 20:02:03.860707
\.


--
-- Data for Name: unified_controls; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unified_controls (id, control_identifier, title, description, control_type, control_category, domain, complexity, cost_impact, status, implementation_status, control_owner_id, control_procedures, testing_procedures, tags, custom_fields, created_by, created_at, updated_by, updated_at, deleted_at) FROM stdin;
ccc179a0-95c4-4d0b-9073-fd5321875893	UCL-IAM-001	Multi-Factor Authentication	Implement MFA for all privileged accounts and remote access	preventive	Identity and Access Management	IAM	medium	medium	active	in_progress	b1b35a04-894c-4b77-b209-8d79bee05ec9	1. Enable MFA on all privileged accounts\n2. Configure MFA for remote access\n3. Train users on MFA usage	1. Attempt login without MFA (should fail)\n2. Verify MFA prompts appear\n3. Test MFA backup codes	{mfa,authentication,iam}	\N	\N	2025-12-03 09:36:59.377449	\N	2025-12-03 09:36:59.377449	\N
4f26dfa5-2e88-4160-9741-e8d4753fd703	UCL-ENC-001	Data Encryption at Rest	Encrypt all sensitive data stored in databases and file systems	preventive	Cryptography	Data Protection	high	medium	active	implemented	b1b35a04-894c-4b77-b209-8d79bee05ec9	1. Enable database encryption\n2. Encrypt file systems\n3. Manage encryption keys securely	1. Verify encryption is enabled\n2. Test data access with encryption\n3. Verify key management	{encryption,data-protection,cryptography}	\N	\N	2025-12-03 09:36:59.377449	\N	2025-12-03 09:36:59.377449	\N
99df57a6-1efc-4693-bd96-222a0e1d72bb	UCL-ENC-002	Data Encryption in Transit	Use TLS 1.2+ for all data transmission	preventive	Cryptography	Data Protection	medium	low	active	implemented	b1b35a04-894c-4b77-b209-8d79bee05ec9	1. Configure TLS 1.2+ on all services\n2. Disable weak protocols\n3. Monitor certificate expiry	1. Test TLS handshake\n2. Verify weak protocols are disabled\n3. Check certificate validity	{encryption,tls,network-security}	\N	\N	2025-12-03 09:36:59.377449	\N	2025-12-03 09:36:59.377449	\N
b5ee8b21-32b5-49ce-9214-4a23ec0cd419	UCL-AC-001	Role-Based Access Control	Implement RBAC for all applications and systems	preventive	Access Control	IAM	high	medium	active	implemented	b1b35a04-894c-4b77-b209-8d79bee05ec9	1. Define roles and permissions\n2. Assign users to roles\n3. Review and update roles quarterly	1. Verify role assignments\n2. Test permission enforcement\n3. Review access logs	{rbac,access-control,iam}	\N	\N	2025-12-03 09:36:59.377449	\N	2025-12-03 09:36:59.377449	\N
e40a782a-a26d-423e-8a17-5488f9cdfb88	UCL-LOG-001	Security Event Logging	Log all security-relevant events for monitoring and investigation	detective	Logging and Monitoring	Security Operations	medium	medium	active	implemented	e4a2a06a-e399-4efb-895e-f607075a50a9	1. Enable logging on all systems\n2. Centralize logs in SIEM\n3. Retain logs for 1 year minimum	1. Verify logs are generated\n2. Test log aggregation\n3. Verify log retention	{logging,monitoring,siem}	\N	\N	2025-12-03 09:36:59.377449	\N	2025-12-03 09:36:59.377449	\N
57ab59e4-0a22-47ca-9f63-90b1cb2d5ad0	UCL-PW-001	Password Policy Enforcement	Enforce strong password requirements through technical controls	preventive	Authentication	IAM	low	low	active	implemented	b1b35a04-894c-4b77-b209-8d79bee05ec9	1. Configure password complexity rules\n2. Set minimum password length\n3. Enforce password history	1. Attempt weak password (should fail)\n2. Verify complexity requirements\n3. Test password history	{password,authentication,policy}	\N	\N	2025-12-03 09:36:59.377449	\N	2025-12-03 09:36:59.377449	\N
94208475-31af-4063-936d-3328f890d97f	TEST-CONTROL-001	Test Control	Updated test control description	\N	\N	\N	\N	\N	draft	not_implemented	\N	\N	\N	\N	\N	\N	2025-12-03 10:57:14.304641	\N	2025-12-03 10:57:14.349344	2025-12-03 10:57:14.349344
fb3a6dd9-1396-45b2-8988-6d152e49de79	TEST-CONTROL-1764759497	Test Control 1764759497	Updated test control description	\N	\N	\N	\N	\N	draft	not_implemented	\N	\N	\N	\N	\N	\N	2025-12-03 10:58:17.549729	\N	2025-12-03 10:58:17.591751	2025-12-03 10:58:17.591751
21850ae0-0d3d-4255-b763-f3be1bbc0f97	CTRL-1764853831126	E2E Test Control 1764853830980	E2E test control description	\N	\N	\N	\N	\N	draft	not_implemented	\N	\N	\N	\N	\N	\N	2025-12-04 13:10:31.125832	\N	2025-12-04 13:10:31.125832	\N
f4b89f75-b20a-46c5-949e-350a3bdd1f53	CTRL-1764854404751	E2E Test Control 1764854404645	E2E test control description	\N	\N	\N	\N	\N	draft	not_implemented	\N	\N	\N	\N	\N	\N	2025-12-04 13:20:05.024332	\N	2025-12-04 13:20:05.024332	\N
05e9dc0a-3415-4ff4-8531-04cf9bd95794	CTRL-1764855557720	E2E Test Control 1764855557589	E2E test control description	\N	\N	\N	\N	\N	draft	not_implemented	\N	\N	\N	\N	\N	\N	2025-12-04 13:39:18.034272	\N	2025-12-04 13:39:18.034272	\N
5c44ac72-335a-48b5-b2d0-91001dead3cf	UCL-TEST-1765639811431	E2E Test Control 1765639811431	Test control description for E2E testing	preventive	\N	IAM	medium	low	draft	not_implemented	\N	Test control procedures description	Test testing procedures description	\N	\N	\N	2025-12-13 15:30:18.676669	\N	2025-12-13 15:30:18.676669	\N
bb44c77e-afd4-4172-bb16-ae7ab591a9a8	UCL-TEST-1765640033844	E2E Test Control 1765640033844	Test control description for E2E testing	preventive	\N	IAM	medium	low	draft	not_implemented	\N	Test control procedures description	Test testing procedures description	\N	\N	\N	2025-12-13 15:34:00.029655	\N	2025-12-13 15:34:00.029655	\N
c3fd3ef6-5db1-4bd7-b1a8-88b34fdd3c42	UCL-TEST-1765643990951	E2E Test Control 1765643990951	Test control description for E2E testing	preventive	\N	IAM	medium	low	draft	not_implemented	\N	Test control procedures description	Test testing procedures description	\N	\N	\N	2025-12-13 16:39:58.508046	\N	2025-12-13 16:39:58.508046	\N
3646bd34-7d9b-46f6-bba0-fe289d90ec43	UCL-TEST-1765644110359	E2E Test Control 1765644110359	Test control description for E2E testing	preventive	\N	IAM	medium	low	draft	not_implemented	\N	Test control procedures description	Test testing procedures description	\N	\N	\N	2025-12-13 16:41:56.469672	\N	2025-12-13 16:41:56.469672	\N
0ef50dde-9a16-433b-973e-15cff9f635e1	UCL-TEST-1765644210849	E2E Test Control 1765644210849	Test control description for E2E testing	preventive	\N	IAM	medium	low	draft	not_implemented	\N	Test control procedures description	Test testing procedures description	\N	\N	\N	2025-12-13 16:43:43.354667	\N	2025-12-13 16:43:43.354667	\N
88594ffe-9df0-44e8-9ab7-37a127f843a1	UCL-TEST-1765644276171	E2E Test Control 1765644276171	Test control description for E2E testing	preventive	\N	IAM	medium	low	draft	not_implemented	\N	Test control procedures description	Test testing procedures description	\N	\N	\N	2025-12-13 16:44:43.486476	\N	2025-12-13 16:44:43.486476	\N
606b8372-9eea-49d7-a1af-e218c66eed54	UCL-TEST-1765644356855	E2E Test Control 1765644356855	Test control description for E2E testing	preventive	\N	IAM	medium	low	draft	not_implemented	\N	Test control procedures description	Test testing procedures description	\N	\N	\N	2025-12-13 16:46:03.982392	\N	2025-12-13 16:46:03.982392	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, phone, first_name, last_name, "avatarUrl", email_verified, phone_verified, last_login_at, password_changed_at, created_at, updated_at, role, status, password, business_unit_id) FROM stdin;
e4a2a06a-e399-4efb-895e-f607075a50a9	risk@grcplatform.com	+966501234570	Ahmed	Risk	\N	t	f	\N	\N	2025-11-29 10:12:09.346897	2025-11-29 10:12:09.346897	risk_manager	active	$2b$10$RV1bzI/BnAqOfiaTSeDI1uyzJBBA8Ql/.UxFxQPozIrHKQTjAF4h2	\N
b5525c73-c26a-48d4-a90a-582fa451e518	auditor@grcplatform.com	+966501234571	Fatima	Auditor	\N	t	f	\N	\N	2025-11-29 10:12:09.346897	2025-11-29 10:12:09.346897	auditor	active	$2b$10$RV1bzI/BnAqOfiaTSeDI1uyzJBBA8Ql/.UxFxQPozIrHKQTjAF4h2	\N
e7f8a16b-c291-4696-8be0-992c381c8013	user@grcplatform.com	+966501234572	Mohammed	User	\N	t	f	\N	\N	2025-11-29 10:12:09.346897	2025-11-29 10:12:09.346897	user	active	$2b$10$RV1bzI/BnAqOfiaTSeDI1uyzJBBA8Ql/.UxFxQPozIrHKQTjAF4h2	\N
b1b35a04-894c-4b77-b209-8d79bee05ec9	admin@grcplatform.com	+966501234567	Admin	User	\N	t	f	2025-12-18 17:12:20.696	\N	2025-11-29 10:12:09.346897	2025-12-18 17:12:20.699452	super_admin	active	$2b$10$6Flh0CEpup6/X0/QlIuaLevWLXg8O1RUyD36AKbYIOOofa7x7FecO	\N
95fb6e10-37bd-4afb-84ae-a947f08ba5a3	manager@grcplatform.com	+966501234568	John	Manager	\N	t	f	2025-12-01 21:04:31.808	\N	2025-11-29 10:12:09.346897	2025-12-01 21:04:31.815078	admin	active	$2b$10$RV1bzI/BnAqOfiaTSeDI1uyzJBBA8Ql/.UxFxQPozIrHKQTjAF4h2	\N
550e8400-e29b-41d4-a716-446655440001	test@example.com	\N	Test	User	\N	f	f	2025-12-04 11:48:48.26	\N	2025-12-04 11:45:49.453782	2025-12-04 11:48:48.261437	admin	active	$2b$10$h0p6g4rFPLhcFZmJjUNayOAL/5bbX4C8EkjQ5kRMbgXs5CAl4ACnW	\N
01180d49-d38b-4421-a130-b1ce4b7c34fa	compliance@grcplatform.com	+966501234569	Sarah	Compliance	\N	t	f	2025-12-04 19:11:56.707	\N	2025-11-29 10:12:09.346897	2025-12-04 19:11:56.708896	compliance_officer	active	$2b$10$RV1bzI/BnAqOfiaTSeDI1uyzJBBA8Ql/.UxFxQPozIrHKQTjAF4h2	\N
580d01e1-da18-49be-84aa-957ee84719ab	demo@grcplatform.com	\N	Demo	Account	\N	t	f	2025-12-06 20:23:00.613	\N	2025-11-29 10:12:09.346897	2025-12-06 20:23:00.615808	user	active	$2b$10$RV1bzI/BnAqOfiaTSeDI1uyzJBBA8Ql/.UxFxQPozIrHKQTjAF4h2	\N
\.


--
-- Data for Name: validation_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.validation_rules (id, name, description, asset_type, field_name, validation_type, regex_pattern, min_length, max_length, min_value, max_value, custom_validation_script, error_message, severity, dependencies, is_active, apply_to_import, created_by_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: workflow_approvals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_approvals (id, "workflowExecutionId", "approverId", status, comments, "stepOrder", "respondedAt", "createdAt", "updatedAt", signature_data, signature_timestamp, signature_method, signature_metadata) FROM stdin;
d3d168cf-fe2c-457f-afd9-8cf63b4e0ed4	6da7e623-8e5d-4ab8-a5d6-904994c10894	01180d49-d38b-4421-a130-b1ce4b7c34fa	approved	\N	1	2025-12-04 16:59:41.121	2025-12-04 16:35:39.354395	2025-12-04 16:59:41.126101	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAADICAYAAAAeGRPoAAAQAElEQVR4AeydS5I0t3WFSw4PPNQOTK3AUoTnkkYeagnkDiytQPIKSO2AXIKGDg8orkDcAem5I+yhZxS+6rr930JnVgKZQCYe5486jUcCF/cePE5m9uP/h1vJfz8raQxbxQ1iVBADYkAMiAExMBwDZQX9p9L8PAxK10sTK3tiQAxMzoCO1fEWQFlBj/kpVX7oeilzsiMGxIAYmJ0BHavjrYA0Qdet3Hgzr4jEQCYDOgYyCVNzMXAyA2mC3uat3MlUaTgxMDcDOgbmnn9F3z4DaYLefhzyUAyIATEgBsRAEwxc9TZLgr42/SfXX7UATg5Tw4kBMSAGhmfgqrdZTQn6zKJ21QIYfmcpQDEgBsTAJOLSlKD3ImoF1oY2mBgQA2JADJzFQC/iksTHugI1JehJsRRptE5Iivmh1kZKwBO3ObZSJiauldA1ga3MhPwoxsC6Ak0q6OuEFOP8SkMauxgDWinFqLzGkCbwGt6nHvW6u8hJBb3eartuKuvFJMtiQAyIATGQysB1d5ES9NQ5Smx33VQmOni8mSyIgQQGdGubQJKaTMZA7V0hQS+zoH4TzHwbQBoSfcTA7Azo1nb2FaD4PzJQe1dI0D9y/l6zcTeFeP8pNEbIwXch/9cAfY4woL4TM7Cx4yZmRqE7BrRMHBnPWQn6Mx9PpZW7KS/ivw4d/iOAJUZ9yOrTBgNMSRueyItUBlZ2XGr3ku20fEqyWdZWQ8ukbGDHrUnQ0zjkaZyncJbSH0MXnsbZ8r8NeT2VBxLa+zBVH7xShRhIY0DLJ42nuBWnYlyn8mkMrAu6JoZJMBEnpYyAw0wfT+N4iteCGBADYiCbgR0HiG6Eslku2WFd0OedGP80Tp4ncIQckC/Jf11bvczhjnOjLnE7raubGBiKgV4OkKFIPxTMuqAfMttlZ566WcE8jSPkfG8cEQd9Cfkm/Y0pKKxv+txgg8ZobJAhuSQGmmVgxO07u6Aj3Ag4ksL3xhFuBJy5RuApN7sg9ztGuPt7q+eDgXNpfAyqRAyIgRIMjLh9ZxV0E3LEnDzCjZAD8iXWi2yIATEgBsSAGDiNgRkFHREHEvLTlpkGap4BOSgGxED3DMwk6LxC5y2LhLz7ZRsHwHdI4jqVxYAYEANzMTCDoCPgCDnfI2d27Yfd9GodNorjCnFleosHIoPlGJAlMSAGTmBgZEFHyHm1DqASAUdteFKnfLtRuulfWQZ+Eq1lCZU1MSAGTmSgZ1loW9D3M4uIA0QdIeeH3cDzsvjpuahSGQbK0Lp/8stEcaKViULNZTWJmlyjM7QXcbtnucz5tXv4Qx3bFvR8ZhFwepFCjF6vw0KXYBq7dDzf6YlCzSVH1OQy9mifQ5zE/0Fa/0nbgp7OLwLOEzmglz2Vf3q9Tm0mWlvn8idzAjOaf+L2Uy6ju5qOy8D4keWI//hsdB3hCIKOaCPkiDqTwat1gKhT3o3sdV5ZC7L92R15WsfW/EnzernVp1g+5ZZbqlYMiAEx0CYDPQs6Ao6Q+59eR1IPC/nuqZIW7KZOHa9hgA1zzcga9c7Ari+atV20TdCpV0FHyAGijoDzRM6T+gRTphDFQDkG+r0HzRC1jKbvzGb2yWz+Psy+TL+zti9e9UploDdBR8BZzaTEqB96gwVBDEzHAMdAYtAZTd8tZvbJbP4+TOWMzE/GQE+CzhM5YIr0VA4LghjwDBR/TCxu0HurvBiIGNB6iwjJLvYg6DyNcwNMSoC8XgeIOmVBDIgBGGCXkBZDcYOJnulgTyTq2mbvo5ear6vW23sg3WdaF3SeyAFE83qdlSMhhw1BDAzLgA72vqZW89XKfLUo6DyJ8wNurBLyCDhP5NS1wpv8EANiQAyIgXoMyPIOBloTdAScX0MDhMNTOWKOqFMWmmWAlyfnOHfeSOfEo1FaYUArq5WZkB/7GGhF0BFyXq0D8gg5u0tP5fvm9YJevFA5Z9jzRjonHo3SCgNaWa3MRHU/Bh3gakFHvBFxQP67wDNP5BLyQIQ+YkAMiIFWGOAJ67AvRYwc9mJYA1cJOuKNiAPyvFJHyC0/LOEKTAyIATHQIwNF3l8UMdI8e5c5eKagI9Y8eSPigDKBI+QAUacsiAExIAbEgBgQA5kMnCHoCDcCDvhhN8qINyLOCxjymW6ruRgQA2JADIiBCRl4EXJNQUe4EXFAHjcQb4QckKdOEAMVGOBesYJZmRQDOxjQatxBmrpkM1BL0BFxICHPnhJ1KMOAvllXhkdZKcGAVmMJFmVji4ECgv40BALO2iXlAk/hPI0D8tQJYkAMiAExIAbEQGEGSgo6Is5TubmIiAMJuTGiVAyIATEgBsRAJQZKCjo/8GZuFhNyM6hUDIgBMSAGxIAYWGeglKDz62g8oTMSP//R4VM5buO+IAbEQFMMaGs2NR1ypl0GSgg6Qm5P5/zJ1naj/eCZr+Bb/76svBgQA00woK3ZxDTIiQQGLr75LCXoRIqY86ROXuiCgYtXXxccyUkxIAbEQCIDF998lhB0ezpPjHieZtdGmiLWF6++awnS6JMykLIzJqVGYXfOwFFBtyfy6Z7O2z8UJNad781y7h9brHxLrZwvDVjSztg/CceW0v5xZ+y5h+ujgv7rGYkm5t2Hwp5ZYsAPUIUYSGRg92K9/RBG4FdRsQDsBj5U6zMjAyyCGeO+IuY9XB8RdO7cAbFqo8NCCvbMUopdtREDZRlgT38WmeTba6xgrkWXShZ111uSTdmah4Gjgg5T3/NFGIsBRSMGXjCAsFcUde4ZXoyuS2JADCwycETQzeBfLDNuqieGD3MrSj5Q0n3F85z6b6d9E2Lj52RC8v45LOrPw73bHSYzenzDTNTOQFqc3yOCzoaGiop36pg3XEnfLE8MGRwfosTmtI80g5U+Alrz8nlO7dtptP4ifGGfFxX15+HCCIN9Ro9vsOnKDqfF+d0r6GzubAKOdWiRvmMRtddbHC/NyYSseDH3lLDvi4q6N668GGiDgX5v4fcKuvEeb26rv/VLyXsIynTKgNw+zABP5GYk3uNLov65Nb5p59/0r3cG+r2F3yvom6/b+6Wk98Uo/8XAYQZMoP8vWELAQ/L0oc7/fw38NDy/3hYaaecHEvQRA5cwsFfQL3FWg4qB6xkY3gPE2oL8s2UW0viHYXlN7/t+6qLXdZ+4UE4MVGRgj6Dbpo1fxVV0U6bFwCgMNK1uiLK9feMJ3Pb6EvlfhUrahOT9Q19svFfcM3pov9OgL2KgNgN7BN3/Oktt/2RfDAzGwGt1uzhYL8YpN+xLbRD1i8PQ8GJgTgb2CLpt+ld373OyqajFQL8MsJ9NjBHq+Ol7KTLa0NZf43zAlq9TXgyIgRMYyBV0NituxZuYOkEMiIGmGXjpnH/zliPItEXYvXFuDOys8PXKiwExUJGBvYJe0aUjppv+/uSRwNRXDNRk4PfBuAnwnpv1pT5mL5jWRwyIgTMYyBV07rzxi7ty0jxU19umvz+Zx5Vad8PA0rJeqms4oC8fvvEnXvfsbZ7Q//qwYYmdFVYeP+1s0sefkNwI+5/AXEGHITYvaT6kt/mcqUfzDCwt66W6EoFUOHK8gP94wEc9pdea9AOT0mfXEqt8jw0/gXv6X892jqDbxv/uerflgRiYkwF/5BRiwJ6kEWTb43tMc6OPDd/XbPu6nXl1m4eBEqv8qI2j/a+ZrRxBNw/ZuJZXKgbEQL8MeAH3+YSIFp9gYht8Hx0k2FMTMSAGjjKQI+h2ty1BP8q6+ouBNhiwPR0/WSd4t/oEE9uyMRJsXtdEI4/LwOKt56Dh5gg6FMSblTpBDIiB/hjwT9M+fzSS+IZfT+hHGVX/Qwys3noestpm51RBL7nh22RCXomBuRiwJ+fSN+kIOvBsTi7qngrlr2Rg9Kf1VEG3PzohYb9yNWpsMVCGAb+Pfb6M9dstvkmwm4dS9mVHDOxiYPSn9VRB30WeOokBMdAcA78JHpnAxsIbLhX58IQOzBhjAiunpaM/TqWxsNlKDcSAMZAi6GxEUGvzmy9KxYAYqM8Ae9lGqfF0brbj88KPa21ep6M/Tr2OfqSrzD1/jbDmehuJr92xpAo6A/g7bspCowzowabRibneLQ7U2k/nFiXnBbCyfdvOykrbZADxNfzpdruxZgzUW97Sb2+3W4wfHnXckgGu89cIWXtfh2v6VGIgRdBtaL85rU5pgwywgxp0Sy5dz4CJKk/PHMi1PWIcGwMxAFZWeg4DcA6YbwMC68GRYfD1CLAH13yZPLZjfBZCoy4kHz7/8qFm1ooKT14pgm6HwKy0K24xsMxAhQ25PFCRWl552iF71s054/i/LIkALAfTF5fLMdStZe4MJsykiOwSvEDb0zH8A+x4b7nxYq5IY/w2NDRwzfKWUufB/wfwn6HP/wcsff7iK6fOM0OFCUgRdCafCSs8tMyJgc4ZqLAhKzLCoY75P4QvHN4hOeWD6NhAnCXAyp/Svrj85HfZHNyAWKBhx+oQZB6ygB+dGycPE1zSX4WG3DKRJwXkDcwRedIYrBUD1ywfTN7w9Rb+4QvAt89D+d8C/ikg/qAj2IjrVd7FANP43HFL0G3CnntVKX10rsowSUZb8iXJYTUSA68Y8IfoV68aVrjmBQDzHPqkM4LzFDAfCDQpYs33lSnDDdcRPg8OJAPCa6C/z1M2GO+kxrXPW91Wij8Au/gI8JkUfwHXwStbxIONV20KXxvdHNPwHGOqoO9ZCM8jbZY+OrfZpVqDlnypFqQMz8MAhy7RcqiSng0/Lgc/ONuHM8YjLgOCF8Ou4QtCzLlK+kWoIAWIHvUe4fIpH/zzPnMQWpk1xHWQ4wxzb3Hl9FPbHQxsCbqZZHFZXqkYEAP9MIBAmLc+b3VnpJwfwMZCHCzfY4qoAfg0wTPxIzZgr78RMwPtDcQNJ4D8WcBvgB/ed/Ofa4Ycn4gDIOCAmHmrwDjU59jqom2LTm4JOt8X0WS0OHPySQykMYC40JJDlvQq+PH3CMYVfpufiJIXPzgFnI/EBUzASAF9wBV+M+aa7xYH/lsb2ucATQDECRBuUkDMgOs5NtW2AANbgs6Ec6dZYCiZEANi4GQGOFhtSJ+3ujNTDnhgYyIolm8h5awzsSPliRUfgRduL14IGDEZzo4DnwFzC8xvfCcP8J82YI9/xOZvWHz8XAN77KrPSwb2XdwS9H1W1UsMiIEWGOAwxw8OZNKr4f3YKzB7Y2A8g4kfgmfiZ1zxAIOfiLUHwgX2jr+3n/fZ/MZngP8A3wFt94xDXMDHjXADOGBcru+xrT4nMvBK0PcujhPd11BiQAysMMAhbJd83uquSBEFYGPXOmOwS8wGEz9ED/gnbgTLgz74CMzPmim+AsZgbIBI4zMgD/AbWFvap4A4DAg28PGaaFPH2NY2xbbaNMZAiqAzwY25LXfEgBjYYIDDnyYc4KStwPtjPub6hqgZEDuECPHjj+eQN7ucXYDfvTfhYnxAvY1LnzOArx74bGV+OvyuMQAAEABJREFUdQ2/AX6Zf6Qe+O6BEMcgVoO/ZjF6e4wlDMLAK0G3EJl8yysVA9MzwEnZOAkc3Oaiz1vdlSnnCcAHE2XyHlaP2P0tXDAgeuSJycAr8t+FNt8HkIbkRn+ewhFHbPBHdUhjAaUO0NZAH2DllNS3Jw/ifrfwD18NiLKJLUuKX10jBb7e8pZa3JbCZYwwlD4zMpAi6PV56XQEdl6nrsvtAwygCge61+6KmCEojINokNYGYzIGqYeJDiliDBDkf6XxA/8V0v8NgFYDIguw9ctwzcBfISOPWFpb8vw5URCa3j/EjXCSmhD6lK27JKC04RognwrfnjyI+8KBhxfhu9P60jsDTPu1MbwSdDYKi+5aDzNGP5tOTpQM99RUDOxgIHtVI4KMw95FQMi/Au2XQF8D4hqD5W/gGnlSD24sDIgxZ8rPgzP/E2CffwyZPwcgviAWQl+GDIOvNz+pszwpHBjCEDefv+mfGCjLAFugrMVca68EHVvc5ZJ2gRU6u/BdToqBZQayVjVPwAgopv47fEHUDF5oMWrw9T6P+BqCqfuH8wBgm/+EgzwgD3jtjSgDxNXE19JfBCsGxDUU7x/y5if5NdwbX/WFIK4aW+OKgRQGtgQ9xYbaiAExUI8Bnp4RO1IvuJY3YSblKRhPfgxf/jkAQQ7J/YPwGhDbJaBZBruOOFs/DGET+9w84BPg9TXgPwHBV4Ao034N2LVrdhNi5SZTCG7SMTklBh4MSNAfROxO1FEMpDGA8BkQPA/qrWx5BJs6yoxAasKK2CKIwASYn+SmHeApmDYAGzEQ2xj0YwxrSx5QT1urN5vUcW0v6A/ozziAvLDGADO9dk31YiAw8ErQtcECQfqIgQUG2BsIHCkgDyxPCqyOPGZIETED1wFlUmB5E07qYmCLdoA84Ce5Sb2wU46BDwCb3DQAHj6pA9hcQmxH5bMZYJbOHlPjdcXAK0HvKpBBnVVY9RlAxGIgcktABGmLV4iepdQD6iyN81a2PpTJlwBjmp2vHhn8NFgsSILlacYTPvA3D/gFuF4bjG1jdPHa3ZxVKgZaZECC3uKsyKfSDJiwWYoAImykJiRcMyFDaBC5GLSnjUdpX/fYsxj43jZxeeG2az4mXt7GsewZ92gf4xE78A/IC2JADOxgQIK+g7TnLpyNzzXdlMZxFCEwIFQAYSO1elITEOoRa0upJw8j5AH51kAMAF+JD+EG5ieCTt7Em8VJnICYDLRpBfhqvtjNh5WVioE+GGCnNeCpBP3wJPjz9LAxGfjIAAJGLSJG3lKI92XyJlikiBhtyZMC7PQC4gEINyBeUoDwcY3YLB6EkZgBsfpr1qbFtBc/W+ROPkUMXKar7M7IlyuKrwRdG+2KGRlnzJxIECdEyFLyCBfbhDry2CPPNfIIF2uUsoF66gD5nmCxEStxkwLqATEB4ubcAvzUu8UIB5bvLSUufCZOQF4QA9kMsHGyOw3U4ZWgEya/c0oqiIEjDHBIIzgAkTJYmevYJ6UO8MSJaJFHxEgB7RAAQL5XEKvxwDlE3j95Ex9xA3ggBdQTM1zQnjxckfaK3v3vlXf5PRgDW4I+WLgK5ygDKMuCDcQJIDIIE0CkAHmEx4SIwxsgTrS3lDww89beys/pZmnF05XqTXPHG8APXADjhTpArAAuPKgDj9GfnPc32563R9uuEhfjjbXSlfN9OPu0dsq7XNl8eYfHtChBH3NeS0eF6NwRlAhBisE1DmIOZsQaIExsc1LANYSHFJT2MbIXPI1q7sWV6vu1sl/gBMAVo5JSBsS/xhHXVjzBzP0SPGKHAnZIe4fF/VnvgbTp//vaqeNeZfN1nB7P6itB5/tzdmiMF7kiihlgrgHCg2AAyyPWXKMPAoJAe9CWMoeyB+17xF6f4Qgu4M1AHfbgBY7sJod21HEtF8yH9cGO5XtOWVf4j6AbZ5QFMSAGEhl4Jeh7D5vEodXsAgY4KAEiYIJjqYkEN3JcZ/4RIPKWUgcucL3ZIeETDnlGIYVH6uAJ3oCJOHVHA2E+zIaJoJV7TuEG3AJZcNhzLPJdDDwzEBb1c0Wd0itBtxE5nCyvtH0GOPCZM4DAAC82RMDBiRggNh7U09/akDqctCrdiA1m4RWOPK/U4Sr8wSdEkVIGXPuEYzkTO+zixzFrLfWGteBPWKzGZyid+3m4cO6gGm18BsKiPiPIFEE/w4+8MebddRx0Bg5zRCUGPyxFGzg10YYxBAYgBAbaZOCkVZnh0UlN4dPzjKhSB48xx9TVcos5N9u8SbH8GOlPN7i0WODX8qel067w0xieZSCO3PNjfSXodjBdsrFeUjH2roNvDw7xbwMfgPqQvX+YHw5ARDoGfbgO7o31JZsBuIZHeAeUMQKnnm/aUMe12uBGgjGYd8YlH6PnsufRYj0/no2zeOPy+f5qxAYZuEakXgk6JLHBeOIjLywycGh7IxIczB7UGeCfayYg5KnzWPRKldkMGOeIN7uRFFGhHgG1OSA1/rMHOdCBuT/Q/bnroVX7bKp0CW5L28yzx+y/6LFx+UVPXRIDJRhY371bgl5i9MFtrG5vhIDYSTmMEQjLUwZc5wAjvwSuC3UYYC4A8+JBHSMyL4g3u4e5oUz9VeDmgrHxA3/I78bqqt2yeN515gGcN6JGaocBdl073jTmyfru3RJ0nkzYVKCxoC53B04AjnDAGqgjT8o1wCGMOJByzUAZ0EaozwBzAvexgFPP6N+EL8wTxwlpK3Pz++CXfdiTlh8xHT2+EeesfEwrmsXGLD/YOBa3BL2VA+0qxjnoAeOTIgakgDoDPHEN+DzXKQPywrkMME8AAeeIIOVJlzrzhLlBvDkrvgiVlEPS1OfLhzf8b2qX+wdRD39KJ9jz8TFX1Ali4M4Am/ie0ZdFBrYEnU5ssBE3lj/UyQME2UCZ+A3wwDVSD65TJhXaYIC5Q7wNlL1nzJeJOCllf72lPGvO/OENguUvSw8fqtt3BDYf8bxdFrMGFgM9MJAi6MTR68bCb8ChaCl5QNlAjBwi1BsoG7gutM0Ac4mAozeklL3HNpcIOKDsr+flt0Upz956a38zzdpcb1n0SsUAmaHXvvrX7vE8vu756urA1yrO1sCsjRfaqqC7BWKbq9WNhV8eHHoc6KTU26xxgAPqDZQN1m6u1E10p4Ezx8w3IB+Hwfwi4AbKcZv88rYo5dv82IN1arW2D61cOT0nwJUg/Bz5G5qV5qq+dLZK0d//WVSKid12VgXdLRDbXEuH5e6BEzsypoHDDXBwA/JcM1P4Cajn8CYFVkc78qSCMeAm2qo6SZl71gEgH7uNALIOQK/z7sWs1xjieUktW7z8bffUPle2a2DszhWx37Oogbl/c2FV0N8uv39lc9X8fXQ7kBFgppUUUA8Y38ABDbhudaTvziozNAOsB0QckPfBsg5YG5xstj789Z7y+G/+Ehew8gwpN2TEiaDH80z9yWBJnTxk9nAcndmd1GEgBlIFnc1VY1NxaLEKeRIhz6HFziHvAeVcA+SF+Rhg/SHigLxngHWBkAPy/lpfeVb/m8fsibfc7Tben3m1yNZT5hHQwnNB+QJwTF0wrA2pVAwkMJAq6GYqPkitPjWlvxdqNixHGAcx9ZRTba23w+L6VV3pjwHWxpKQEwlrB5RZO1i8Em+6Qbzei7jsr82Q59wAM8SqGBti4HQpOThgqqBzWIK9Bwv9OKrYlOQN2Cw/fYxU3uoAFg+ulmsYQMiXntBYOwREeo1n9Ub18fJ2rN5IbVueOfYzZ0ZjrTBwupQcHDBV0AmXzcX30RFlylugHYcxLnLo8hSFkG/10/VqDDAV1YyXNsxawWHWkbdta4n15OtHyRP3KLEcjYO5BtjxNzmUBTEgBiIGcgSdjQXYWPEh680i4oB23ATYUxR9fTvlxcAaA7Z+4uusJ4Q8WksssbjpMGUJ/NtUcuaAt5K+9sOAPD2NgRxBxykOU35AhwOXg8ZAmacpwPWVgxcTHzHacTxaPB9nrFoN64k1FB/cCDhrj+sLg9Nlobq/KuLmRtg8Zx9ZftbUc+C5OcyH9ulOCmcg7pIYjw+aK+isAA5V22S8ggeIOAcuHnGdA5i2SRjmOH5EO1o8j7BqJ1+HAZYObNYaaytrTQVbPX4QdO83e8mXZ8wz74DY4QeQPwzt050UtkXcziA2ul0S4083BHTDs5eX9wg6BjloAActIG+bjuuCGMhhgPXzedSB9WRrK7o0bNHf0HAjM2ygmYF5LjxHmWbUXAy0zcBPB93bK+gHh1V3MfDEQHxIc4Aj5oj6U8OBC9zU+PDisr+2mD96d79otI1K1gHAG57QAXlBDNRloDPrEvTOJmwCd/8QYswWs9Cn94+/qeGGJjuepbv7gUSeGzzjhJ/ZsbxSMSAGHgy8EPSLjoKLhn3woeR8BvzTFk9hX53vwuUjVruBWRL5y6Pd74D/72OrcbbfPfUUA1kMFG/8QtAvOgouGrY4szKYygAintp21Hb/7gLj6Vxi5Qhx2S9C3tYLbzT8zWC4pI8YmJuBF4I+NzEp0etlQgpLSW3skOaABkmdBmnE6+Ofu1j4z0hcUdmIAW54rAruLK/0DAZ06J3B8u4xngR9t5VJO+plQrGJjw/pWUSdJ/E4Vp5CixE7oCFu/uL1MmCYjYakQ6/RiXlzS4L+xoO+XssAhzQwL3jyMrFD8DyszQgpr41HiOPsGFgbtl5YG5TP9kHjiYHmGDhR0JuLXQ61xQBPXfyBIvMKsUPYl/C30IhDnMM8ZK/5HHz7iP+x43AQ16m8zIDnirWyxOdyzz21Byd7z5Dqs8ZAp5NxgtsS9LU1o/qzGeCJC4H2B/WSD7T5ZbjAIY7Y8xIQkAcc7IB2oVm9D4PutI5/+B93pz6uU3mZAdaL/1U2+GT+l1sfrT0w2UeHVv+YgU4n44jbiTcDwwh6POUqd8sAosby5bCOgdiDH0N0HOgG/mQiAg442AGHuwGboUvTH+Jq2sEGnWP+PW/MP8cmaYPujuwSW3bk+C6OjVWd4IIEPYEkNbmEAQ7rGAgz+EXwyIv9z8J650Qx8MdpOOh5hc/hjsCHJjeAyGOD+mDm9A/j4k8YGHdD8vbBp7ecvuYwAG+she9dJ5tjV6VsXQbYWnVH6NL60xavH4EEPYljNeqMAf44DQc9YEsBBB4QCoLKoc8pRBuA0HLtRDD8fTjz617Ql2wGuPGzmzjrzBwzr1ZWKgbOZ+B9i58z9Jugc9ydM55GEQNXMcDhDniaY8WTmpBy+McCT9saIr/0a2mMdRUvo4yLqMOjzSlxMa/UkRfEwPAMvAn6yXcRw7OaGaCaX8KACQAHPgIPYjFA0L8O3rFDEHzaGrgGwuWsD9//9x24sfBl5Y8xwPzE88j8UX/MsnqLgcYZeBP0xp2Ue2LgJAY49A0IPHmeqBFdvh+PG78OX3jyQ+ABYgHI094jNP3wob9VIjzcWFhZaRkGmAPmzFtjzqj3dY88U/3IKvIYXlkAAAgbSURBVBEDHTMgQe948tJcV6sCDCC6iAFAKFAAgCAbGAbR8EDoDQg+8E/12KWfUJ4BuGWOSM06c8N8MI9WF1KqQqKPGOicAQl65xMo9y9lAGEwrAm9CQpCDrzDCDxqAsibLUvj9r6v8mkMMC/cdPnWK8Lumyg/HQPc/mUFnd0hy/qexhL0PaypzzsDyiwyYIJMiqCw80kBr+75ProJvRlAvBEaD0QesQfkDX8KBrEN6Gc2lC4zAE+BstuSsMOpOFzmba5adhkRs1JIN2EdNhuGBslGQ9v9Hwn6fu7UsyUGztkvRyJGwAHiYb9Hj9cGxB4gOoC2wMakn+GP4Sgx4UeQQvH+O/aklAEiBuhjNkZPidWD+D34+QU45abKuKA9fMEd18Dvw0V+GJJrSwiX9emZATbdqv+shNWLqRfiEYoY3Rx8WkGP6d5kSg0uYCBjyHP2S4ZD2U0REmAChLgDlqqBMmJvoD3wg5kALQk+wuVhYy2lZodrlieNy9TdEZwk5fpR4KO3QRmBJfVg1j38NfLGgaX4BxB2z5nlqQdfhorPA7CxBD+m5a2d+Y2/IJjRpzUGmLS6PtUfYcn/aQX9GrqXpkB1YiCZAcTbBIMUgQdBS28Gygi+/aEV8oC+DISgGUzollITqN+FTpYnpS3pB4Q9RR3XjwL/vA3KCCypR3CtmY/5ZX7jL/ihGQ/lyPAMTCvow8+sAtxkYNAGCDdi7/9aHmWEHpjw+zSupwxo86vAE/klcKNwFN5ubItrVufz1BHnEoK7TX0+a8obOdMIA2yt8q5I0MtzKotioDcGEEbvM2VgdeSXwI3CUXi7sS2uWZ3PU4fAL4GTcgm0Xar3dbQB1JGCbwIJBv/34kP1jR9uvG3889+v32iqyx8ZYCo+1vZfE95nVQiiA0EfdUIrzKZMNsSAXGmMAW4ItlyiDaAdKeAPCxl4W8GBZOCHGy0fp3zLA/AqHnvCLgbqCN8uVzro1IGga0LPXkecTGePqfHEwGAM8C0PMFhYCqdlBjoQ9Jbpy/WtD6nULVTuvJ7fXiOKATEgBmIGJOgxI1XLc0tlH7czVReAjIsBMSAGqjEwraBLXKqtqVXDc9/OrNLS4AW5JAbEQI8MTCvoEpcel6t8FgNiQAyIgTUGphX0NUJULwbEQF0GurauV3tdT9/ozg8s6Np5oy9exScGTmdAr/ZOp1wDpjMwsKBr56UvA7UUA6MwUCkOPR9UIlZmSzIwsKCXpEm2xIAYmJoBPR9UmH7dJZUmVYJemlHZu/8vIaJBDIzIgGIqyYDuknLZ3LoFkqDnMtpB+61Jrx2CtmlthmVfDIiBGRnYOlsl6JVXxRXiujXplUPONn8FR9lOqoMYqM6ABjifgbFOHwl65RXUm7hWpmPRvDhapEWVYkAMVGdgrNNHgl59wcwywFh3urPMmuKchwFFOj4DbQv6kkYs1Y0/T9dEmMX1WHe61xCuUcWAGBAD+xloW9CXNGKpbn/86vmKAXH9ih1dEwPnMJB1Y32OSx9H8TXdOeydL5Kvy8C69bYFvQi1MiIGjIH1jWAtlIqB5hjo7sb6TIfb3NN1GVi3LkFvbvfKoXoMrG+EemPKshgQA0cZWO+vPe25kaB7NpTviIE278w7IlCuioFGGNBeLjUREvRSTMrOyQy8ujPXAXHyZGg4MXCAgVd7+YDZ5K7jNJSgjzOXfUZSRXt1QPS5GLa8rrJYtgbVdTFQmYFy61qCXnmqZH6DgSLaW25DbHh77uVBw9pPYpHFsn949RQDOxh47rK0qdfW9VLbZ2txSYIeM6JyhwysbYjGQ9narx/C2urQeLxyTwxMz8CHTf2CkZy2b2Yk6G886GtBBiQ7iWRm79fsDomOqJkYEAN9MvDstQT9mQ+VCjAg2SlAokyIATEgBjIZkKBnEqbmYkAMiIFaDNR7u1XPci0uZDefgdKCnu+BeogBMSAGxMCdgXpvt+pZvjuuL00wIEFvYhrkhBgQA2JADHgG9E7Bs5GWP1nQD05RWkxqJQbEgBgQA40zsKUGeqeQP4EnC7qmKH+K1EMMiIF5GdiSvX6ZkRoUmLtoeZws6AUCqGdCls9kIFqIZw6tscRAPwxI9vqZqws8jZaHBP2COdCQgYFoIYYafcSAGBADOxnQEwLESdBh4QzkjqH1mcuY2osBMTAtAxc+ITR0VkvQW90AF67PVimRX2JADIiB5hho6KyWoO9ZHQ3dkT3cVyIG+magqz3VlbN9rwt5n8WABD2Lrkdjd0emrf3gRIkYOMKA21NHzJzTtytnz6FEo3xk4AJxmEbQa3E7xdb+uFRVIwZWGKi101aGU7UYaJWBC8QhTdAH2KMXcNvqMpNfYqAiA9ppFcmV6QG0qOYkpgm69mjNOZjdtuIXA2JADKQxIC16yVOaoL80oYu7GNCd5i7a1EkMiAExIAaWGZCgL/NSv1Z3mvU5ZgRBDIgBMTAJAxL0xYnW4/MiLZUqxXYlYoNZcRtI0EcMTMKABH1xovX4vEhLpcqO2a7ESDmz4rYcl3dLSXdISY3u5vRFDJRkoJCgawGXnBTZEgNioFEGku6Qkho1GqDc6pmBQoKuBdzzIpDvjTIgt1YZ0CPEKjW6MDEDhQR9YgYVuhgQA+kMFFJiPUKkU66W8zAgQZ9nrhWpGPAMXJOXEl/Du0adggEJ+hTTPF6QhR70xiNGEYkBMTAtAxL0aae+78D1oNf4/Mk9MSAGijCQ8/AiQS9CebtGchZDu1HIs1QGNN+pTA3aTgtguInNeXj5OwAAAP///CdntgAAAAZJREFUAwD1MwP9ydYLUAAAAABJRU5ErkJggg==	2025-12-04 16:59:41.121	drawn	{"method": "drawn", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36", "capturedAt": "2025-12-04T16:58:06.693Z"}
\.


--
-- Data for Name: workflow_executions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_executions (id, "workflowId", "entityType", "entityId", status, "inputData", "outputData", "errorMessage", "assignedToId", "startedAt", "completedAt", "createdAt", "updatedAt") FROM stdin;
6da7e623-8e5d-4ab8-a5d6-904994c10894	66ede8db-0d7d-47cf-b403-966aa0fa949a	policy	bdce65a7-d0c9-4f91-9185-210b53e1588e	in_progress	{"test": true}	\N	\N	\N	2025-12-04 20:35:39.35	\N	2025-12-04 16:35:39.349999	2025-12-04 16:35:39.349999
\.


--
-- Data for Name: workflows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflows (id, name, description, type, status, trigger, entity_type, conditions, actions, days_before_deadline, organization_id, created_by_id, created_at, updated_at) FROM stdin;
66ede8db-0d7d-47cf-b403-966aa0fa949a	Policy Approval Workflow	Workflow for testing digital signatures	approval	active	manual	policy	{}	{"notify": ["01180d49-d38b-4421-a130-b1ce4b7c34fa"], "approvers": ["01180d49-d38b-4421-a130-b1ce4b7c34fa"], "changeStatus": "active"}	\N	\N	01180d49-d38b-4421-a130-b1ce4b7c34fa	2025-12-04 16:34:16.488564	2025-12-04 16:34:16.488564
\.


--
-- Name: kri_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kri_id_seq', 17, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 65, true);


--
-- Name: risk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.risk_id_seq', 100, true);


--
-- Name: treatment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.treatment_id_seq', 48, true);


--
-- Name: asset_requirement_mapping PK_0227ed2291c8d965fa7150482ea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_requirement_mapping
    ADD CONSTRAINT "PK_0227ed2291c8d965fa7150482ea" PRIMARY KEY (id);


--
-- Name: control_dependencies PK_1098c0684491b644cd5c7f56b03; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_dependencies
    ADD CONSTRAINT "PK_1098c0684491b644cd5c7f56b03" PRIMARY KEY (id);


--
-- Name: compliance_obligations PK_2375252f856051e6f7a4ae7761c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_obligations
    ADD CONSTRAINT "PK_2375252f856051e6f7a4ae7761c" PRIMARY KEY (id);


--
-- Name: risk_assessments PK_2717ff3f294d30390a712653d63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessments
    ADD CONSTRAINT "PK_2717ff3f294d30390a712653d63" PRIMARY KEY (id);


--
-- Name: asset_types PK_2cf0314bcc4351b7f2827d57edb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_types
    ADD CONSTRAINT "PK_2cf0314bcc4351b7f2827d57edb" PRIMARY KEY (id);


--
-- Name: policy_acknowledgments PK_2f4b9afe4fd1fd2801545590e30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policy_acknowledgments
    ADD CONSTRAINT "PK_2f4b9afe4fd1fd2801545590e30" PRIMARY KEY (id);


--
-- Name: workflow_approvals PK_36949dc46e63a84b77b624651ef; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_approvals
    ADD CONSTRAINT "PK_36949dc46e63a84b77b624651ef" PRIMARY KEY (id);


--
-- Name: asset_dependencies PK_3d8f2d431047c127b593cd46f85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_dependencies
    ADD CONSTRAINT "PK_3d8f2d431047c127b593cd46f85" PRIMARY KEY (id);


--
-- Name: remediation_trackers PK_3f744ee36bf62c54b0c0e9fb493; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_trackers
    ADD CONSTRAINT "PK_3f744ee36bf62c54b0c0e9fb493" PRIMARY KEY (id);


--
-- Name: business_applications PK_430d7755457729d598cc886a80e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_applications
    ADD CONSTRAINT "PK_430d7755457729d598cc886a80e" PRIMARY KEY (id);


--
-- Name: distribution_list_users PK_4c0980817ec2b0cdda7b95cad17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distribution_list_users
    ADD CONSTRAINT "PK_4c0980817ec2b0cdda7b95cad17" PRIMARY KEY (distribution_list_id, user_id);


--
-- Name: framework_requirements PK_4fd95e1c363261b596b20c545f2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.framework_requirements
    ADD CONSTRAINT "PK_4fd95e1c363261b596b20c545f2" PRIMARY KEY (id);


--
-- Name: evidence_linkages PK_519cda34170141b362047ee85fe; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence_linkages
    ADD CONSTRAINT "PK_519cda34170141b362047ee85fe" PRIMARY KEY (id);


--
-- Name: software_assets PK_53a9646dfc45300b1a4cb1c75fb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.software_assets
    ADD CONSTRAINT "PK_53a9646dfc45300b1a4cb1c75fb" PRIMARY KEY (id);


--
-- Name: assessment_results PK_5907c861a69b7bf628090784637; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT "PK_5907c861a69b7bf628090784637" PRIMARY KEY (id);


--
-- Name: workflows PK_5b5757cc1cd86268019fef52e0c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflows
    ADD CONSTRAINT "PK_5b5757cc1cd86268019fef52e0c" PRIMARY KEY (id);


--
-- Name: integration_configs PK_5ca9b0024e0f8a3f00222bbe09d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integration_configs
    ADD CONSTRAINT "PK_5ca9b0024e0f8a3f00222bbe09d" PRIMARY KEY (id);


--
-- Name: policies PK_603e09f183df0108d8695c57e28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT "PK_603e09f183df0108d8695c57e28" PRIMARY KEY (id);


--
-- Name: import_logs PK_605638f3d14c87ce06601313f0e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs
    ADD CONSTRAINT "PK_605638f3d14c87ce06601313f0e" PRIMARY KEY (id);


--
-- Name: governance_metric_snapshots PK_66642cf3ab0dc5e7ffd588543f8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.governance_metric_snapshots
    ADD CONSTRAINT "PK_66642cf3ab0dc5e7ffd588543f8" PRIMARY KEY (id);


--
-- Name: business_units PK_685f717d6fba03f34e19aa51b9d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_units
    ADD CONSTRAINT "PK_685f717d6fba03f34e19aa51b9d" PRIMARY KEY (id);


--
-- Name: notifications PK_6a72c3c0f683f6462415e653c3a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY (id);


--
-- Name: treatment_tasks PK_6d4b53441b6e027dc2674306601; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatment_tasks
    ADD CONSTRAINT "PK_6d4b53441b6e027dc2674306601" PRIMARY KEY (id);


--
-- Name: compliance_requirements PK_7641c696a22c1cd007353a88900; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_requirements
    ADD CONSTRAINT "PK_7641c696a22c1cd007353a88900" PRIMARY KEY (id);


--
-- Name: compliance_assessments PK_7f46e8b880069fa6db479110e20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_assessments
    ADD CONSTRAINT "PK_7f46e8b880069fa6db479110e20" PRIMARY KEY (id);


--
-- Name: security_test_results PK_83c3b308fc67cc13b12ace3cc3b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_test_results
    ADD CONSTRAINT "PK_83c3b308fc67cc13b12ace3cc3b" PRIMARY KEY (id);


--
-- Name: physical_assets PK_88156fca8d14d35a23182639a49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.physical_assets
    ADD CONSTRAINT "PK_88156fca8d14d35a23182639a49" PRIMARY KEY (id);


--
-- Name: control_objectives PK_8c75b1f1aad55a78c1013f1f07b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_objectives
    ADD CONSTRAINT "PK_8c75b1f1aad55a78c1013f1f07b" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: tasks PK_8d12ff38fcc62aaba2cab748772; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY (id);


--
-- Name: integration_sync_logs PK_8e8dad0e3b5d6e569fd6bb1ce31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integration_sync_logs
    ADD CONSTRAINT "PK_8e8dad0e3b5d6e569fd6bb1ce31" PRIMARY KEY (id);


--
-- Name: asset_field_configs PK_8f2fc81a935bba22f1272e49012; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_field_configs
    ADD CONSTRAINT "PK_8f2fc81a935bba22f1272e49012" PRIMARY KEY (id);


--
-- Name: compliance_validation_rules PK_91095f1b05732d5967e6d4e8ed5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_validation_rules
    ADD CONSTRAINT "PK_91095f1b05732d5967e6d4e8ed5" PRIMARY KEY (id);


--
-- Name: asset_audit_logs PK_91a6111281e1d6c662e1970a0d5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_audit_logs
    ADD CONSTRAINT "PK_91a6111281e1d6c662e1970a0d5" PRIMARY KEY (id);


--
-- Name: kri_risk_links PK_983ba23125b83946bc27b17536d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kri_risk_links
    ADD CONSTRAINT "PK_983ba23125b83946bc27b17536d" PRIMARY KEY (id);


--
-- Name: workflow_executions PK_9d49b5c86c267d902145ed42c9d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_executions
    ADD CONSTRAINT "PK_9d49b5c86c267d902145ed42c9d" PRIMARY KEY (id);


--
-- Name: unified_controls PK_a212ae9a7864136944655bea64c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unified_controls
    ADD CONSTRAINT "PK_a212ae9a7864136944655bea64c" PRIMARY KEY (id);


--
-- Name: assessments PK_a3442bd80a00e9111cefca57f6c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT "PK_a3442bd80a00e9111cefca57f6c" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: influencers PK_a5bbdc11f7898f2a695208b337a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.influencers
    ADD CONSTRAINT "PK_a5bbdc11f7898f2a695208b337a" PRIMARY KEY (id);


--
-- Name: report_template_versions PK_a757315fecf1be7d90188d42e8c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_template_versions
    ADD CONSTRAINT "PK_a757315fecf1be7d90188d42e8c" PRIMARY KEY (id);


--
-- Name: findings PK_ae9807d6293c23c13ff8804d09c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT "PK_ae9807d6293c23c13ff8804d09c" PRIMARY KEY (id);


--
-- Name: risk_treatments PK_af5178953fb057e6acdc1fe1cea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_treatments
    ADD CONSTRAINT "PK_af5178953fb057e6acdc1fe1cea" PRIMARY KEY (id);


--
-- Name: risk_categories PK_b00e992eb624d7b0cb7a3c93e6f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_categories
    ADD CONSTRAINT "PK_b00e992eb624d7b0cb7a3c93e6f" PRIMARY KEY (id);


--
-- Name: suppliers PK_b70ac51766a9e3144f778cfe81e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY (id);


--
-- Name: risk_assessment_requests PK_b81513177702a072ae5643ad92d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessment_requests
    ADD CONSTRAINT "PK_b81513177702a072ae5643ad92d" PRIMARY KEY (id);


--
-- Name: evidence PK_b864cb5d49854f89917fc0b44b9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT "PK_b864cb5d49854f89917fc0b44b9" PRIMARY KEY (id);


--
-- Name: control_asset_mappings PK_b96db8f42b6f330d59552984e55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_asset_mappings
    ADD CONSTRAINT "PK_b96db8f42b6f330d59552984e55" PRIMARY KEY (id);


--
-- Name: risk_control_links PK_bef298dbfb8a2bc9f19d2fd593b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_control_links
    ADD CONSTRAINT "PK_bef298dbfb8a2bc9f19d2fd593b" PRIMARY KEY (id);


--
-- Name: compliance_frameworks PK_cd7feec99fba7a4fdf98e023c6b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_frameworks
    ADD CONSTRAINT "PK_cd7feec99fba7a4fdf98e023c6b" PRIMARY KEY (id);


--
-- Name: framework_control_mappings PK_d767d4d3c739113690dba9429e8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.framework_control_mappings
    ADD CONSTRAINT "PK_d767d4d3c739113690dba9429e8" PRIMARY KEY (id);


--
-- Name: kris PK_dbfa8c94d2eb6b783fa611d9da1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kris
    ADD CONSTRAINT "PK_dbfa8c94d2eb6b783fa611d9da1" PRIMARY KEY (id);


--
-- Name: risk_finding_links PK_dcb61840dde3bcc9d6bba99bafa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_finding_links
    ADD CONSTRAINT "PK_dcb61840dde3bcc9d6bba99bafa" PRIMARY KEY (id);


--
-- Name: risks PK_df437126f5dd05e856b8bf7157f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT "PK_df437126f5dd05e856b8bf7157f" PRIMARY KEY (id);


--
-- Name: risk_asset_links PK_e57cc1548ef8f61b3fdebffe683; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_asset_links
    ADD CONSTRAINT "PK_e57cc1548ef8f61b3fdebffe683" PRIMARY KEY (id);


--
-- Name: validation_rules PK_e716d3b67a48a975d22ecb7a0b5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validation_rules
    ADD CONSTRAINT "PK_e716d3b67a48a975d22ecb7a0b5" PRIMARY KEY (id);


--
-- Name: email_distribution_lists PK_e7b6357cda0e0c4ce044d0caed6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_distribution_lists
    ADD CONSTRAINT "PK_e7b6357cda0e0c4ce044d0caed6" PRIMARY KEY (id);


--
-- Name: kri_measurements PK_f7bb4ae6e3be990a6e5d8e7ce59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kri_measurements
    ADD CONSTRAINT "PK_f7bb4ae6e3be990a6e5d8e7ce59" PRIMARY KEY (id);


--
-- Name: information_assets PK_f8443f8f9b9b0875214c6326c72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.information_assets
    ADD CONSTRAINT "PK_f8443f8f9b9b0875214c6326c72" PRIMARY KEY (id);


--
-- Name: report_templates PK_f85e16e6beea41a2b3a3350b84e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_templates
    ADD CONSTRAINT "PK_f85e16e6beea41a2b3a3350b84e" PRIMARY KEY (id);


--
-- Name: risk_settings PK_risk_settings; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_settings
    ADD CONSTRAINT "PK_risk_settings" PRIMARY KEY (id);


--
-- Name: control_objectives UQ_0ed9cf361f82d82fb327438277e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_objectives
    ADD CONSTRAINT "UQ_0ed9cf361f82d82fb327438277e" UNIQUE (objective_identifier);


--
-- Name: software_assets UQ_0f8a83a3279457cb51b0f246dba; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.software_assets
    ADD CONSTRAINT "UQ_0f8a83a3279457cb51b0f246dba" UNIQUE (unique_identifier);


--
-- Name: physical_assets UQ_1e56caf9c3769072bc9e4c7d007; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.physical_assets
    ADD CONSTRAINT "UQ_1e56caf9c3769072bc9e4c7d007" UNIQUE (unique_identifier);


--
-- Name: risk_categories UQ_4972538f28b389e20d0b532733c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_categories
    ADD CONSTRAINT "UQ_4972538f28b389e20d0b532733c" UNIQUE (code);


--
-- Name: kris UQ_730a719b577db9ac4e707d14a67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kris
    ADD CONSTRAINT "UQ_730a719b577db9ac4e707d14a67" UNIQUE (kri_id);


--
-- Name: evidence UQ_754c53940f79ffb89538decf122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT "UQ_754c53940f79ffb89538decf122" UNIQUE (evidence_identifier);


--
-- Name: assessments UQ_764c76183f08c2919416346a805; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT "UQ_764c76183f08c2919416346a805" UNIQUE (assessment_identifier);


--
-- Name: business_applications UQ_7a8c23daad515e43e56b8939150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_applications
    ADD CONSTRAINT "UQ_7a8c23daad515e43e56b8939150" UNIQUE (unique_identifier);


--
-- Name: risk_assessment_requests UQ_7af28e831d9769b57d8aac86001; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessment_requests
    ADD CONSTRAINT "UQ_7af28e831d9769b57d8aac86001" UNIQUE (request_identifier);


--
-- Name: business_units UQ_875d522984844abe7b6f2d9c976; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_units
    ADD CONSTRAINT "UQ_875d522984844abe7b6f2d9c976" UNIQUE (code);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: unified_controls UQ_9c893af2558f9158d6454b40205; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unified_controls
    ADD CONSTRAINT "UQ_9c893af2558f9158d6454b40205" UNIQUE (control_identifier);


--
-- Name: risks UQ_a782eb78aac99cc175fe6a78e35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT "UQ_a782eb78aac99cc175fe6a78e35" UNIQUE (risk_id);


--
-- Name: influencers UQ_b6504d1a620d68e98a623693d2c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.influencers
    ADD CONSTRAINT "UQ_b6504d1a620d68e98a623693d2c" UNIQUE (reference_number);


--
-- Name: compliance_frameworks UQ_c47de1548f52cca0d1a7ef9aabb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_frameworks
    ADD CONSTRAINT "UQ_c47de1548f52cca0d1a7ef9aabb" UNIQUE (name);


--
-- Name: risk_treatments UQ_c497f8f5062ccfc641294fe7736; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_treatments
    ADD CONSTRAINT "UQ_c497f8f5062ccfc641294fe7736" UNIQUE (treatment_id);


--
-- Name: findings UQ_c6ba1b7138b51f24b314d6e8743; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT "UQ_c6ba1b7138b51f24b314d6e8743" UNIQUE (finding_identifier);


--
-- Name: suppliers UQ_d931ec2a4e4aa34b68e594ea0b8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "UQ_d931ec2a4e4aa34b68e594ea0b8" UNIQUE (unique_identifier);


--
-- Name: governance_metric_snapshots UQ_de9e2f660fb0e0c7ac48bab1da0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.governance_metric_snapshots
    ADD CONSTRAINT "UQ_de9e2f660fb0e0c7ac48bab1da0" UNIQUE (snapshot_date);


--
-- Name: information_assets UQ_fb14bf64486d6c99cc70ece8fc7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.information_assets
    ADD CONSTRAINT "UQ_fb14bf64486d6c99cc70ece8fc7" UNIQUE (unique_identifier);


--
-- Name: asset_requirement_mapping UQ_fd42b09e55c749c493dbfe6ba71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_requirement_mapping
    ADD CONSTRAINT "UQ_fd42b09e55c749c493dbfe6ba71" UNIQUE (asset_type, asset_id, requirement_id);


--
-- Name: control_asset_mappings unique_control_asset; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_asset_mappings
    ADD CONSTRAINT unique_control_asset UNIQUE (unified_control_id, asset_type, asset_id);


--
-- Name: control_dependencies unique_control_dependency; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_dependencies
    ADD CONSTRAINT unique_control_dependency UNIQUE (source_control_id, target_control_id, relationship_type);


--
-- Name: evidence_linkages unique_evidence_link; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence_linkages
    ADD CONSTRAINT unique_evidence_link UNIQUE (evidence_id, link_type, linked_entity_id);


--
-- Name: framework_control_mappings unique_framework_control; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.framework_control_mappings
    ADD CONSTRAINT unique_framework_control UNIQUE (framework_requirement_id, unified_control_id);


--
-- Name: framework_requirements unique_framework_requirement; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.framework_requirements
    ADD CONSTRAINT unique_framework_requirement UNIQUE (framework_id, requirement_identifier);


--
-- Name: kri_risk_links unique_kri_risk_link; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kri_risk_links
    ADD CONSTRAINT unique_kri_risk_link UNIQUE (kri_id, risk_id);


--
-- Name: policy_acknowledgments unique_policy_user_version; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policy_acknowledgments
    ADD CONSTRAINT unique_policy_user_version UNIQUE (policy_id, user_id, policy_version);


--
-- Name: risk_asset_links unique_risk_asset_link; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_asset_links
    ADD CONSTRAINT unique_risk_asset_link UNIQUE (risk_id, asset_type, asset_id);


--
-- Name: risk_control_links unique_risk_control_link; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_control_links
    ADD CONSTRAINT unique_risk_control_link UNIQUE (risk_id, control_id);


--
-- Name: risk_finding_links unique_risk_finding_link; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_finding_links
    ADD CONSTRAINT unique_risk_finding_link UNIQUE (risk_id, finding_id);


--
-- Name: IDX_03280bf5a3e4183b2665ec0587; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_03280bf5a3e4183b2665ec0587" ON public.kri_risk_links USING btree (risk_id);


--
-- Name: IDX_038d8d0fa3d883b0a8e300c2db; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_038d8d0fa3d883b0a8e300c2db" ON public.risk_finding_links USING btree (relationship_type);


--
-- Name: IDX_053245407efdbd008dbfe22705; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_053245407efdbd008dbfe22705" ON public.assessment_results USING btree (assessment_id);


--
-- Name: IDX_05d8396c476f18a7a4e2186386; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_05d8396c476f18a7a4e2186386" ON public.unified_controls USING btree (control_owner_id);


--
-- Name: IDX_0a093f50fee2dcbc2505161a1e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_0a093f50fee2dcbc2505161a1e" ON public.compliance_obligations USING btree (influencer_id);


--
-- Name: IDX_0ed9cf361f82d82fb327438277; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_0ed9cf361f82d82fb327438277" ON public.control_objectives USING btree (objective_identifier);


--
-- Name: IDX_0f8a83a3279457cb51b0f246db; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_0f8a83a3279457cb51b0f246db" ON public.software_assets USING btree (unique_identifier);


--
-- Name: IDX_13211982341b29f432e4f0d663; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_13211982341b29f432e4f0d663" ON public.kris USING btree (current_status);


--
-- Name: IDX_14067326353f9fa9910c1e802b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_14067326353f9fa9910c1e802b" ON public.policy_acknowledgments USING btree (policy_id, user_id) WHERE (acknowledged_at IS NULL);


--
-- Name: IDX_1655f77dba0c96e2cd70ac8bbc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_1655f77dba0c96e2cd70ac8bbc" ON public.risk_treatments USING btree (status);


--
-- Name: IDX_186a514b5d2e926846bf97b459; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_186a514b5d2e926846bf97b459" ON public.remediation_trackers USING btree (assigned_to_id);


--
-- Name: IDX_18904497714587c1df720c5a8e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_18904497714587c1df720c5a8e" ON public.assessments USING btree (status);


--
-- Name: IDX_1df8b58fb7e63a2ec9d1ecd1e5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_1df8b58fb7e63a2ec9d1ecd1e5" ON public.risk_treatments USING btree (risk_id);


--
-- Name: IDX_1e56caf9c3769072bc9e4c7d00; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_1e56caf9c3769072bc9e4c7d00" ON public.physical_assets USING btree (unique_identifier);


--
-- Name: IDX_2072f5a88cde23a1f9334f5e64; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2072f5a88cde23a1f9334f5e64" ON public.risk_assessment_requests USING btree (requested_by_id);


--
-- Name: IDX_234ec21b9aa6951e5cf8a0ee65; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_234ec21b9aa6951e5cf8a0ee65" ON public.framework_requirements USING btree (domain, category);


--
-- Name: IDX_246a959310f70fabb7f1b816ef; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_246a959310f70fabb7f1b816ef" ON public.risk_control_links USING btree (effectiveness_rating);


--
-- Name: IDX_2496ff5952e5d8dd45f09357b7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2496ff5952e5d8dd45f09357b7" ON public.control_asset_mappings USING btree (implementation_status);


--
-- Name: IDX_25ce35f7cae94fdd453f4b4656; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_25ce35f7cae94fdd453f4b4656" ON public.framework_control_mappings USING btree (unified_control_id);


--
-- Name: IDX_274b1c1cc6fe52f1df84bc1e81; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_274b1c1cc6fe52f1df84bc1e81" ON public.findings USING btree (remediation_due_date) WHERE (status = ANY (ARRAY['open'::public.finding_status_enum, 'in_progress'::public.finding_status_enum]));


--
-- Name: IDX_27bff38954870534d45abf7778; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_27bff38954870534d45abf7778" ON public.risk_treatments USING btree (treatment_owner_id);


--
-- Name: IDX_2b5632d557a8e8e687c93c65df; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2b5632d557a8e8e687c93c65df" ON public.asset_dependencies USING btree (relationship_type);


--
-- Name: IDX_2cd64ae1d166cdbce8fbc80606; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2cd64ae1d166cdbce8fbc80606" ON public.compliance_obligations USING btree (priority);


--
-- Name: IDX_2e78d05314be8912bc97e5d01e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2e78d05314be8912bc97e5d01e" ON public.compliance_assessments USING btree (assessed_at);


--
-- Name: IDX_2ee463f5e3fdb4a5ad1398accb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_2ee463f5e3fdb4a5ad1398accb" ON public.framework_control_mappings USING btree (framework_requirement_id);


--
-- Name: IDX_302cc372ed51376c03f29d1571; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_302cc372ed51376c03f29d1571" ON public.unified_controls USING btree (control_type);


--
-- Name: IDX_32c7b5c2cb28c0777803b4d930; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_32c7b5c2cb28c0777803b4d930" ON public.kris USING btree (kri_owner_id);


--
-- Name: IDX_3504237c8d7864ca355609bbff; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3504237c8d7864ca355609bbff" ON public.risk_assessments USING btree (assessment_date);


--
-- Name: IDX_35b62f30762eb1dea3a004ad92; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_35b62f30762eb1dea3a004ad92" ON public.software_assets USING btree (vendor);


--
-- Name: IDX_3601b0495f33e3d792350fb61a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3601b0495f33e3d792350fb61a" ON public.control_objectives USING btree (policy_id);


--
-- Name: IDX_3676155292d72c67cd4e090514; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON public.users USING btree (status);


--
-- Name: IDX_38af550bbb84037c50c030c2cc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_38af550bbb84037c50c030c2cc" ON public.influencers USING btree (category);


--
-- Name: IDX_3a22cc93be9abc8a95d501f951; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3a22cc93be9abc8a95d501f951" ON public.compliance_assessments USING btree (asset_type, asset_id);


--
-- Name: IDX_3bbf40ff5bc8e20da63eab96e6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3bbf40ff5bc8e20da63eab96e6" ON public.findings USING btree (severity);


--
-- Name: IDX_3c3d6f126d5b3ed1e5bb75ec61; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3c3d6f126d5b3ed1e5bb75ec61" ON public.risk_categories USING btree (is_active);


--
-- Name: IDX_3cc558d5160f6dbe3b801b3ad9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3cc558d5160f6dbe3b801b3ad9" ON public.business_applications USING btree (application_type);


--
-- Name: IDX_3db7e27e6a96afdd529393a846; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3db7e27e6a96afdd529393a846" ON public.risk_finding_links USING btree (finding_id);


--
-- Name: IDX_3fccf614beaafd33eb03a3eb9e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3fccf614beaafd33eb03a3eb9e" ON public.kris USING btree (is_active);


--
-- Name: IDX_40496d3db82e2c4ed65e910bb2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_40496d3db82e2c4ed65e910bb2" ON public.kri_risk_links USING btree (kri_id);


--
-- Name: IDX_430a8e85797156f9549543de6c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_430a8e85797156f9549543de6c" ON public.risk_asset_links USING btree (asset_type, asset_id);


--
-- Name: IDX_4972538f28b389e20d0b532733; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4972538f28b389e20d0b532733" ON public.risk_categories USING btree (code);


--
-- Name: IDX_521a8807d04c0d33ca8da38761; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_521a8807d04c0d33ca8da38761" ON public.assessment_results USING btree (assessor_id);


--
-- Name: IDX_525f0e3d5add8aa6e9622b0530; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_525f0e3d5add8aa6e9622b0530" ON public.findings USING btree (asset_type, asset_id);


--
-- Name: IDX_56321fca1b0fcb1914e28767f2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_56321fca1b0fcb1914e28767f2" ON public.evidence_linkages USING btree (link_type, linked_entity_id);


--
-- Name: IDX_57777028e2e28820d07f195d7c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_57777028e2e28820d07f195d7c" ON public.risks USING btree (current_risk_level);


--
-- Name: IDX_588096642d8fc4f3ef8eb1461b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_588096642d8fc4f3ef8eb1461b" ON public.unified_controls USING btree (implementation_status);


--
-- Name: IDX_594ac9598b595fdfb9b9ca3c09; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_594ac9598b595fdfb9b9ca3c09" ON public.physical_assets USING btree ("ownerId");


--
-- Name: IDX_5fc00da9a49645ec3c2e893557; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_5fc00da9a49645ec3c2e893557" ON public.risk_assessment_requests USING btree (assessment_type);


--
-- Name: IDX_600f2b2725f431964da34bf392; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_600f2b2725f431964da34bf392" ON public.influencers USING btree (next_review_date) WHERE ((next_review_date IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_602b39e2ce2d0571b5dd4f7b71; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_602b39e2ce2d0571b5dd4f7b71" ON public.risk_finding_links USING btree (risk_id);


--
-- Name: IDX_605f037a9230fff095dad05060; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_605f037a9230fff095dad05060" ON public.compliance_validation_rules USING btree (is_active);


--
-- Name: IDX_60b2f1a48f0072497173ce7baf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_60b2f1a48f0072497173ce7baf" ON public.asset_audit_logs USING btree (action);


--
-- Name: IDX_61617ab1f9b31573b9dc6de9e5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_61617ab1f9b31573b9dc6de9e5" ON public.risk_assessments USING btree (risk_id);


--
-- Name: IDX_62d3549102d47bf15b3da6a76b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_62d3549102d47bf15b3da6a76b" ON public.kri_measurements USING btree (kri_id);


--
-- Name: IDX_641f3a082603d9e0a3b2c8b1ed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_641f3a082603d9e0a3b2c8b1ed" ON public.kris USING btree (category_id);


--
-- Name: IDX_6468e86cf0d1fd7b2a848d2bd6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6468e86cf0d1fd7b2a848d2bd6" ON public.policies USING btree (next_review_date) WHERE ((next_review_date IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_66ecd346d0bd65cdd52a94d09d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_66ecd346d0bd65cdd52a94d09d" ON public.control_asset_mappings USING btree (asset_type, asset_id);


--
-- Name: IDX_6bf56593036f06822197520ffd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6bf56593036f06822197520ffd" ON public.kri_measurements USING btree (kri_id, measurement_date);


--
-- Name: IDX_6db7bfcbd3b1bf0c90c79e2ee4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6db7bfcbd3b1bf0c90c79e2ee4" ON public.suppliers USING btree (type);


--
-- Name: IDX_6ffb4b500a5d059f03b94a737d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6ffb4b500a5d059f03b94a737d" ON public.risk_treatments USING btree (target_completion_date);


--
-- Name: IDX_70772c245cfa9637b8021bbaeb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_70772c245cfa9637b8021bbaeb" ON public.remediation_trackers USING btree (remediation_priority);


--
-- Name: IDX_70830314995825b1a822f8c98a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_70830314995825b1a822f8c98a" ON public.treatment_tasks USING btree (treatment_id);


--
-- Name: IDX_7147eed683f48bf4ba4e1f626a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7147eed683f48bf4ba4e1f626a" ON public.asset_requirement_mapping USING btree (asset_type, asset_id);


--
-- Name: IDX_71c5d63002a009be1366ed0632; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_71c5d63002a009be1366ed0632" ON public.evidence USING btree (evidence_type);


--
-- Name: IDX_730a719b577db9ac4e707d14a6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_730a719b577db9ac4e707d14a6" ON public.kris USING btree (kri_id);


--
-- Name: IDX_754c53940f79ffb89538decf12; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_754c53940f79ffb89538decf12" ON public.evidence USING btree (evidence_identifier);


--
-- Name: IDX_764c76183f08c2919416346a80; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_764c76183f08c2919416346a80" ON public.assessments USING btree (assessment_identifier);


--
-- Name: IDX_76b27aff6f3b048bdbfce66b93; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_76b27aff6f3b048bdbfce66b93" ON public.risks USING btree (next_review_date);


--
-- Name: IDX_78f5bc37ac033eecb5e908c6ae; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_78f5bc37ac033eecb5e908c6ae" ON public.risk_control_links USING btree (risk_id);


--
-- Name: IDX_7a48c3d3689c10fe5d8aa5f3b2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7a48c3d3689c10fe5d8aa5f3b2" ON public.compliance_validation_rules USING btree (requirement_id);


--
-- Name: IDX_7a8c23daad515e43e56b893915; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_7a8c23daad515e43e56b893915" ON public.business_applications USING btree (unique_identifier);


--
-- Name: IDX_7af28e831d9769b57d8aac8600; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7af28e831d9769b57d8aac8600" ON public.risk_assessment_requests USING btree (request_identifier);


--
-- Name: IDX_7b0da1e2ebcb6071e0bf76b696; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7b0da1e2ebcb6071e0bf76b696" ON public.control_objectives USING btree (domain);


--
-- Name: IDX_7e92dcf9326d277010ddf517c4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7e92dcf9326d277010ddf517c4" ON public.risks USING btree (category_id);


--
-- Name: IDX_815624e685cee02caed29494aa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_815624e685cee02caed29494aa" ON public.evidence_linkages USING btree (evidence_id);


--
-- Name: IDX_83ffc55ff273a05f4445d1f395; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_83ffc55ff273a05f4445d1f395" ON public.risk_assessments USING btree (risk_level);


--
-- Name: IDX_85f81241b3b1fa1bd58038fd67; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_85f81241b3b1fa1bd58038fd67" ON public.assessments USING btree (lead_assessor_id);


--
-- Name: IDX_8b92fd5cc71f04b7ae5cb9eebd; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_8b92fd5cc71f04b7ae5cb9eebd" ON public.control_asset_mappings USING btree (unified_control_id);


--
-- Name: IDX_8ddcdcce4cf59c54a0e83463e5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_8ddcdcce4cf59c54a0e83463e5" ON public.unified_controls USING btree (domain);


--
-- Name: IDX_951dd2f1e50a5206826d4d2533; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_951dd2f1e50a5206826d4d2533" ON public.control_objectives USING btree (implementation_status);


--
-- Name: IDX_95777accff51c573945c394784; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_95777accff51c573945c394784" ON public.findings USING btree (remediation_owner_id);


--
-- Name: IDX_96d0cb063f57aaa89efb36ef2f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_96d0cb063f57aaa89efb36ef2f" ON public.evidence USING btree (valid_until_date) WHERE (valid_until_date IS NOT NULL);


--
-- Name: IDX_9721be8eab971530664a3bb5a2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_9721be8eab971530664a3bb5a2" ON public.risk_assessment_requests USING btree (status);


--
-- Name: IDX_97672ac88f789774dd47f7c8be; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON public.users USING btree (email);


--
-- Name: IDX_98774cf6c23bb398aec3940227; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_98774cf6c23bb398aec3940227" ON public.business_applications USING btree ("ownerId");


--
-- Name: IDX_9c893af2558f9158d6454b4020; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_9c893af2558f9158d6454b4020" ON public.unified_controls USING btree (control_identifier);


--
-- Name: IDX_9eca3b816756e41c6acfe7ddd1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_9eca3b816756e41c6acfe7ddd1" ON public.findings USING btree (assessment_id);


--
-- Name: IDX_FIELD_CONFIG_ASSET_TYPE; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_FIELD_CONFIG_ASSET_TYPE" ON public.asset_field_configs USING btree (asset_type);


--
-- Name: IDX_FIELD_CONFIG_ENABLED; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_FIELD_CONFIG_ENABLED" ON public.asset_field_configs USING btree (asset_type, is_enabled);


--
-- Name: IDX_FIELD_CONFIG_UNIQUE; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_FIELD_CONFIG_UNIQUE" ON public.asset_field_configs USING btree (asset_type, field_name);


--
-- Name: IDX_INTEGRATION_CONFIG_STATUS; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INTEGRATION_CONFIG_STATUS" ON public.integration_configs USING btree (status);


--
-- Name: IDX_INTEGRATION_CONFIG_TYPE; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_INTEGRATION_CONFIG_TYPE" ON public.integration_configs USING btree (integration_type);


--
-- Name: IDX_SECURITY_TEST_ASSET; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_SECURITY_TEST_ASSET" ON public.security_test_results USING btree (asset_type, asset_id);


--
-- Name: IDX_SECURITY_TEST_DATE; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_SECURITY_TEST_DATE" ON public.security_test_results USING btree (test_date);


--
-- Name: IDX_SECURITY_TEST_SEVERITY; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_SECURITY_TEST_SEVERITY" ON public.security_test_results USING btree (severity);


--
-- Name: IDX_SECURITY_TEST_STATUS; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_SECURITY_TEST_STATUS" ON public.security_test_results USING btree (status);


--
-- Name: IDX_SYNC_LOG_COMPLETED; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_SYNC_LOG_COMPLETED" ON public.integration_sync_logs USING btree (completed_at);


--
-- Name: IDX_SYNC_LOG_CONFIG; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_SYNC_LOG_CONFIG" ON public.integration_sync_logs USING btree (integration_config_id);


--
-- Name: IDX_SYNC_LOG_STATUS; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_SYNC_LOG_STATUS" ON public.integration_sync_logs USING btree (status);


--
-- Name: IDX_a17e0931d0d69d2fdecb6d61a8; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a17e0931d0d69d2fdecb6d61a8" ON public.framework_control_mappings USING btree (coverage_level);


--
-- Name: IDX_a30d47c687031ad607ba1947b3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a30d47c687031ad607ba1947b3" ON public.framework_requirements USING btree (requirement_identifier);


--
-- Name: IDX_a782eb78aac99cc175fe6a78e3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a782eb78aac99cc175fe6a78e3" ON public.risks USING btree (risk_id);


--
-- Name: IDX_abbe702807abad5fe9bbfd8337; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_abbe702807abad5fe9bbfd8337" ON public.influencers USING btree (owner_id);


--
-- Name: IDX_ac266f5c90629a39ea35446efe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ac266f5c90629a39ea35446efe" ON public.findings USING btree (status);


--
-- Name: IDX_ace513fa30d485cfd25c11a9e4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON public.users USING btree (role);


--
-- Name: IDX_aead18d5c74162744756fc3995; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_aead18d5c74162744756fc3995" ON public.policy_acknowledgments USING btree (policy_id);


--
-- Name: IDX_af3f7d3fa7cacb2675a06ec5de; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_af3f7d3fa7cacb2675a06ec5de" ON public.control_objectives USING btree (responsible_party_id);


--
-- Name: IDX_afaa000ed2d43103930d22c6e3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_afaa000ed2d43103930d22c6e3" ON public.asset_audit_logs USING btree (asset_type, asset_id);


--
-- Name: IDX_b0635e8cafa6fd24d4ab3356c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b0635e8cafa6fd24d4ab3356c0" ON public.risk_categories USING btree (parent_category_id);


--
-- Name: IDX_b099c26c7562555db527f12717; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b099c26c7562555db527f12717" ON public.influencers USING btree (applicability_status);


--
-- Name: IDX_b29b6ed0e663b6f7892a72595d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b29b6ed0e663b6f7892a72595d" ON public.risk_categories USING btree (display_order);


--
-- Name: IDX_b6504d1a620d68e98a623693d2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b6504d1a620d68e98a623693d2" ON public.influencers USING btree (reference_number);


--
-- Name: IDX_b66da7a008a160102b2a72ddf7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b66da7a008a160102b2a72ddf7" ON public.assessments USING btree (start_date, end_date);


--
-- Name: IDX_ba968b56d48a1a11b453db07f1; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ba968b56d48a1a11b453db07f1" ON public.compliance_validation_rules USING btree (asset_type);


--
-- Name: IDX_bbe3c51c8fb51035cc518cfb3d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_bbe3c51c8fb51035cc518cfb3d" ON public.policy_acknowledgments USING btree (user_id);


--
-- Name: IDX_be1f785a2402b02dc07425cd02; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_be1f785a2402b02dc07425cd02" ON public.physical_assets USING btree (criticality_level);


--
-- Name: IDX_bebaf3f362e232805c7bff7774; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_bebaf3f362e232805c7bff7774" ON public.asset_dependencies USING btree (source_asset_type, source_asset_id);


--
-- Name: IDX_c10150ab893e8eca780e7ca897; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c10150ab893e8eca780e7ca897" ON public.risk_assessment_requests USING btree (risk_id);


--
-- Name: IDX_c3a359cb4ddd63309e62f0e333; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c3a359cb4ddd63309e62f0e333" ON public.kri_measurements USING btree (measurement_date);


--
-- Name: IDX_c497f8f5062ccfc641294fe773; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c497f8f5062ccfc641294fe773" ON public.risk_treatments USING btree (treatment_id);


--
-- Name: IDX_c5b454a921d0887448d5606fa0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c5b454a921d0887448d5606fa0" ON public.framework_requirements USING btree (framework_id);


--
-- Name: IDX_c6ba1b7138b51f24b314d6e874; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c6ba1b7138b51f24b314d6e874" ON public.findings USING btree (finding_identifier);


--
-- Name: IDX_ccd96b72779c2bf4ad1ad2d43f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ccd96b72779c2bf4ad1ad2d43f" ON public.asset_audit_logs USING btree (created_at);


--
-- Name: IDX_cd3ec87f41ae846ac711ef8c0a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cd3ec87f41ae846ac711ef8c0a" ON public.assessment_results USING btree (result);


--
-- Name: IDX_d0c3eaab48ab1d92310ef986df; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d0c3eaab48ab1d92310ef986df" ON public.treatment_tasks USING btree (status);


--
-- Name: IDX_d283067051eeff8b0037a1a82c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d283067051eeff8b0037a1a82c" ON public.risk_asset_links USING btree (risk_id);


--
-- Name: IDX_d3d94560478a423a8d1e98746f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d3d94560478a423a8d1e98746f" ON public.asset_dependencies USING btree (target_asset_type, target_asset_id);


--
-- Name: IDX_d5b6f759597d6a091ae3880f45; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d5b6f759597d6a091ae3880f45" ON public.asset_audit_logs USING btree (changed_by_id);


--
-- Name: IDX_d931ec2a4e4aa34b68e594ea0b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_d931ec2a4e4aa34b68e594ea0b" ON public.suppliers USING btree (unique_identifier);


--
-- Name: IDX_d9edd545745feb9e3b912872d4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d9edd545745feb9e3b912872d4" ON public.evidence USING btree (collector_id);


--
-- Name: IDX_e0521c28ee356bc4a5b989d2ad; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e0521c28ee356bc4a5b989d2ad" ON public.information_assets USING btree ("ownerId");


--
-- Name: IDX_e094d522a297d28d5336001814; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e094d522a297d28d5336001814" ON public.control_dependencies USING btree (source_control_id);


--
-- Name: IDX_e0d4065bed6e7002cf041d30d5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e0d4065bed6e7002cf041d30d5" ON public.risk_assessment_requests USING btree (requested_for_id);


--
-- Name: IDX_e3aa6515a958d29ab185cf3c52; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e3aa6515a958d29ab185cf3c52" ON public.findings USING btree (unified_control_id);


--
-- Name: IDX_e56466762140df28564288eb72; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e56466762140df28564288eb72" ON public.risk_assessment_requests USING btree (due_date);


--
-- Name: IDX_e86ac43bd7846e0e1f3911ee18; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e86ac43bd7846e0e1f3911ee18" ON public.control_dependencies USING btree (relationship_type);


--
-- Name: IDX_ea526ab81c69137e6d87fe5c20; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ea526ab81c69137e6d87fe5c20" ON public.asset_requirement_mapping USING btree (compliance_status);


--
-- Name: IDX_ef83a60a56abaf45afd7a7f55e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_ef83a60a56abaf45afd7a7f55e" ON public.asset_dependencies USING btree (source_asset_type, source_asset_id, target_asset_type, target_asset_id);


--
-- Name: IDX_f04bfb7386701e81c9f57d2b12; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f04bfb7386701e81c9f57d2b12" ON public.assessment_results USING btree (unified_control_id);


--
-- Name: IDX_f072215e7df337a8125f642563; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f072215e7df337a8125f642563" ON public.unified_controls USING btree (status);


--
-- Name: IDX_f27115164a6f0270783ceb2cf5; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f27115164a6f0270783ceb2cf5" ON public.compliance_obligations USING btree (status);


--
-- Name: IDX_f296203ffc6404b72f8d3c5579; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f296203ffc6404b72f8d3c5579" ON public.control_dependencies USING btree (target_control_id);


--
-- Name: IDX_f3553d8720f72871ca3f0e3e67; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f3553d8720f72871ca3f0e3e67" ON public.influencers USING btree (status);


--
-- Name: IDX_f3e6008eb69df16bf171e6272e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f3e6008eb69df16bf171e6272e" ON public.remediation_trackers USING btree (finding_id);


--
-- Name: IDX_f5c34d94e880d616f4be4e11e4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f5c34d94e880d616f4be4e11e4" ON public.compliance_assessments USING btree (requirement_id);


--
-- Name: IDX_f6806c3ef39cf8bf4871cf66e6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f6806c3ef39cf8bf4871cf66e6" ON public.evidence USING btree (status);


--
-- Name: IDX_f97bde1df6be9e75b9a202b633; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_f97bde1df6be9e75b9a202b633" ON public.remediation_trackers USING btree (sla_due_date);


--
-- Name: IDX_fb14bf64486d6c99cc70ece8fc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_fb14bf64486d6c99cc70ece8fc" ON public.information_assets USING btree (unique_identifier);


--
-- Name: IDX_fb47541f89f8d12e72d2cffe8f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fb47541f89f8d12e72d2cffe8f" ON public.risk_treatments USING btree (priority);


--
-- Name: IDX_fb87c3c3323bde3d47e25d57ae; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fb87c3c3323bde3d47e25d57ae" ON public.asset_requirement_mapping USING btree (requirement_id);


--
-- Name: IDX_ff75d2688f3e37baa9c7624f47; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ff75d2688f3e37baa9c7624f47" ON public.risk_control_links USING btree (control_id);


--
-- Name: IDX_fff7faa6400117195ba02e0b86; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fff7faa6400117195ba02e0b86" ON public.compliance_obligations USING btree (responsible_party_id);


--
-- Name: IDX_governance_metric_snapshots_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_governance_metric_snapshots_date" ON public.governance_metric_snapshots USING btree (snapshot_date);


--
-- Name: IDX_remediation_trackers_open; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_remediation_trackers_open" ON public.remediation_trackers USING btree (completion_date);


--
-- Name: IDX_report_template_versions_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_report_template_versions_created_at" ON public.report_template_versions USING btree (created_at);


--
-- Name: IDX_report_template_versions_template_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_report_template_versions_template_id" ON public.report_template_versions USING btree (template_id);


--
-- Name: IDX_report_template_versions_template_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_report_template_versions_template_version" ON public.report_template_versions USING btree (template_id, version_number);


--
-- Name: IDX_risk_settings_organization; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_risk_settings_organization" ON public.risk_settings USING btree (organization_id);


--
-- Name: IDX_validation_rules_asset_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_validation_rules_asset_type" ON public.validation_rules USING btree (asset_type);


--
-- Name: IDX_validation_rules_field_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_validation_rules_field_name" ON public.validation_rules USING btree (field_name);


--
-- Name: idx_applications_unit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_unit ON public.business_applications USING btree (business_unit_id);


--
-- Name: idx_applications_vendor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_vendor ON public.business_applications USING btree (vendor_name);


--
-- Name: idx_asset_types_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asset_types_category ON public.asset_types USING btree (category);


--
-- Name: idx_business_units_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_business_units_code ON public.business_units USING btree (code);


--
-- Name: idx_business_units_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_business_units_parent ON public.business_units USING btree (parent_id);


--
-- Name: idx_evidence_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_evidence_search ON public.evidence USING gin (to_tsvector('english'::regconfig, (((COALESCE(title, ''::character varying))::text || ' '::text) || COALESCE(description, ''::text))));


--
-- Name: idx_influencers_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_influencers_search ON public.influencers USING gin (to_tsvector('english'::regconfig, (((((COALESCE(name, ''::character varying))::text || ' '::text) || (COALESCE(issuing_authority, ''::character varying))::text) || ' '::text) || COALESCE(description, ''::text))));


--
-- Name: idx_influencers_tags; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_influencers_tags ON public.influencers USING gin (tags);


--
-- Name: idx_info_assets_custodian; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_info_assets_custodian ON public.information_assets USING btree (asset_custodian_id);


--
-- Name: idx_info_assets_owner; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_info_assets_owner ON public.information_assets USING btree (information_owner_id);


--
-- Name: idx_info_assets_reclassification; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_info_assets_reclassification ON public.information_assets USING btree (reclassification_date) WHERE (reclassification_date IS NOT NULL);


--
-- Name: idx_info_assets_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_info_assets_type ON public.information_assets USING btree (information_type);


--
-- Name: idx_info_assets_unit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_info_assets_unit ON public.information_assets USING btree (business_unit_id);


--
-- Name: idx_physical_assets_connectivity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_physical_assets_connectivity ON public.physical_assets USING btree (connectivity_status);


--
-- Name: idx_physical_assets_ip; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_physical_assets_ip ON public.physical_assets USING gin (ip_addresses);


--
-- Name: idx_physical_assets_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_physical_assets_location ON public.physical_assets USING btree (physical_location);


--
-- Name: idx_physical_assets_mac; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_physical_assets_mac ON public.physical_assets USING gin (mac_addresses);


--
-- Name: idx_physical_assets_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_physical_assets_type ON public.physical_assets USING btree (asset_type_id);


--
-- Name: idx_physical_assets_unit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_physical_assets_unit ON public.physical_assets USING btree (business_unit_id);


--
-- Name: idx_policies_linked_influencers; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_linked_influencers ON public.policies USING gin (linked_influencers);


--
-- Name: idx_policies_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_search ON public.policies USING gin (to_tsvector('english'::regconfig, (((COALESCE(title, ''::character varying))::text || ' '::text) || COALESCE(content, ''::text))));


--
-- Name: idx_software_license_expiry; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_software_license_expiry ON public.software_assets USING btree (license_expiry) WHERE (license_expiry IS NOT NULL);


--
-- Name: idx_software_unit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_software_unit ON public.software_assets USING btree (business_unit_id);


--
-- Name: idx_software_vendor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_software_vendor ON public.software_assets USING btree (vendor_name);


--
-- Name: idx_suppliers_contract_end; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_contract_end ON public.suppliers USING btree (contract_end_date) WHERE (contract_end_date IS NOT NULL);


--
-- Name: idx_suppliers_unit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_unit ON public.suppliers USING btree (business_unit_id);


--
-- Name: idx_unified_controls_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_unified_controls_search ON public.unified_controls USING gin (to_tsvector('english'::regconfig, (((COALESCE(title, ''::character varying))::text || ' '::text) || COALESCE(description, ''::text))));


--
-- Name: idx_users_business_unit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_business_unit ON public.users USING btree (business_unit_id);


--
-- Name: risk_assessments trigger_calculate_assessment_risk_score; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_calculate_assessment_risk_score BEFORE INSERT OR UPDATE ON public.risk_assessments FOR EACH ROW EXECUTE FUNCTION public.calculate_assessment_risk_score();


--
-- Name: risk_treatments trigger_calculate_treatment_residual; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_calculate_treatment_residual BEFORE INSERT OR UPDATE ON public.risk_treatments FOR EACH ROW EXECUTE FUNCTION public.calculate_treatment_residual_score();


--
-- Name: kris trigger_generate_kri_id; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_generate_kri_id BEFORE INSERT ON public.kris FOR EACH ROW EXECUTE FUNCTION public.generate_kri_id();


--
-- Name: risks trigger_generate_risk_id; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_generate_risk_id BEFORE INSERT ON public.risks FOR EACH ROW EXECUTE FUNCTION public.generate_risk_id();


--
-- Name: risk_treatments trigger_generate_treatment_id; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_generate_treatment_id BEFORE INSERT ON public.risk_treatments FOR EACH ROW EXECUTE FUNCTION public.generate_treatment_id();


--
-- Name: risk_assessments trigger_mark_previous_assessments; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_mark_previous_assessments AFTER INSERT ON public.risk_assessments FOR EACH ROW EXECUTE FUNCTION public.mark_previous_assessments_not_latest();


--
-- Name: kri_measurements trigger_update_kri_on_measurement; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_kri_on_measurement BEFORE INSERT ON public.kri_measurements FOR EACH ROW EXECUTE FUNCTION public.update_kri_on_measurement();


--
-- Name: risks trigger_update_risk_scores; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_risk_scores BEFORE INSERT OR UPDATE ON public.risks FOR EACH ROW EXECUTE FUNCTION public.update_risk_scores();


--
-- Name: treatment_tasks trigger_update_treatment_progress; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_treatment_progress AFTER INSERT OR DELETE OR UPDATE ON public.treatment_tasks FOR EACH ROW EXECUTE FUNCTION public.update_treatment_progress();


--
-- Name: distribution_list_users FK_02f15eea33a5224bb823d6a7936; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distribution_list_users
    ADD CONSTRAINT "FK_02f15eea33a5224bb823d6a7936" FOREIGN KEY (distribution_list_id) REFERENCES public.email_distribution_lists(id) ON DELETE CASCADE;


--
-- Name: kri_risk_links FK_03280bf5a3e4183b2665ec0587b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kri_risk_links
    ADD CONSTRAINT "FK_03280bf5a3e4183b2665ec0587b" FOREIGN KEY (risk_id) REFERENCES public.risks(id) ON DELETE CASCADE;


--
-- Name: assessment_results FK_053245407efdbd008dbfe227053; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT "FK_053245407efdbd008dbfe227053" FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE CASCADE;


--
-- Name: unified_controls FK_05d8396c476f18a7a4e21863865; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unified_controls
    ADD CONSTRAINT "FK_05d8396c476f18a7a4e21863865" FOREIGN KEY (control_owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: suppliers FK_07837b276a6cef18a41c33b5ffb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "FK_07837b276a6cef18a41c33b5ffb" FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: compliance_obligations FK_0a093f50fee2dcbc2505161a1eb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_obligations
    ADD CONSTRAINT "FK_0a093f50fee2dcbc2505161a1eb" FOREIGN KEY (influencer_id) REFERENCES public.influencers(id) ON DELETE CASCADE;


--
-- Name: compliance_assessments FK_0e307ab38688035b87e1164fd6d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_assessments
    ADD CONSTRAINT "FK_0e307ab38688035b87e1164fd6d" FOREIGN KEY (assessed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: information_assets FK_11f72cdccc3f892190c38947b8f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.information_assets
    ADD CONSTRAINT "FK_11f72cdccc3f892190c38947b8f" FOREIGN KEY (information_owner_id) REFERENCES public.users(id);


--
-- Name: risk_assessments FK_14914b89e56b2a063cccf88a52f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessments
    ADD CONSTRAINT "FK_14914b89e56b2a063cccf88a52f" FOREIGN KEY (assessor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: remediation_trackers FK_186a514b5d2e926846bf97b459b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_trackers
    ADD CONSTRAINT "FK_186a514b5d2e926846bf97b459b" FOREIGN KEY (assigned_to_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: policies FK_1b2a9409b653ca88a881fd65918; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT "FK_1b2a9409b653ca88a881fd65918" FOREIGN KEY (supersedes_policy_id) REFERENCES public.policies(id);


--
-- Name: risk_treatments FK_1df8b58fb7e63a2ec9d1ecd1e54; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_treatments
    ADD CONSTRAINT "FK_1df8b58fb7e63a2ec9d1ecd1e54" FOREIGN KEY (risk_id) REFERENCES public.risks(id) ON DELETE CASCADE;


--
-- Name: remediation_trackers FK_1f9c705e6f32935b60dccb927fd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_trackers
    ADD CONSTRAINT "FK_1f9c705e6f32935b60dccb927fd" FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: risk_assessment_requests FK_2072f5a88cde23a1f9334f5e645; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessment_requests
    ADD CONSTRAINT "FK_2072f5a88cde23a1f9334f5e645" FOREIGN KEY (requested_by_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: framework_control_mappings FK_25ce35f7cae94fdd453f4b46565; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.framework_control_mappings
    ADD CONSTRAINT "FK_25ce35f7cae94fdd453f4b46565" FOREIGN KEY (unified_control_id) REFERENCES public.unified_controls(id) ON DELETE CASCADE;


--
-- Name: risk_treatments FK_27bff38954870534d45abf7778a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_treatments
    ADD CONSTRAINT "FK_27bff38954870534d45abf7778a" FOREIGN KEY (treatment_owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: influencers FK_2b6dba9ff5ea88c34ced5b99243; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.influencers
    ADD CONSTRAINT "FK_2b6dba9ff5ea88c34ced5b99243" FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: information_assets FK_2ba47beaaef2f2af80f2ffcff8d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.information_assets
    ADD CONSTRAINT "FK_2ba47beaaef2f2af80f2ffcff8d" FOREIGN KEY (business_unit_id) REFERENCES public.business_units(id) ON DELETE SET NULL;


--
-- Name: workflow_executions FK_2cb399c231cb3f82c63506794bc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_executions
    ADD CONSTRAINT "FK_2cb399c231cb3f82c63506794bc" FOREIGN KEY ("workflowId") REFERENCES public.workflows(id);


--
-- Name: framework_control_mappings FK_2ee463f5e3fdb4a5ad1398accb8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.framework_control_mappings
    ADD CONSTRAINT "FK_2ee463f5e3fdb4a5ad1398accb8" FOREIGN KEY (framework_requirement_id) REFERENCES public.framework_requirements(id) ON DELETE CASCADE;


--
-- Name: risk_assessment_requests FK_32954f2c1442fc10c95f3a767d5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessment_requests
    ADD CONSTRAINT "FK_32954f2c1442fc10c95f3a767d5" FOREIGN KEY (approved_by_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: kris FK_32c7b5c2cb28c0777803b4d930d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kris
    ADD CONSTRAINT "FK_32c7b5c2cb28c0777803b4d930d" FOREIGN KEY (kri_owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: risk_control_links FK_333ebae714c76d90e058f0d84e4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_control_links
    ADD CONSTRAINT "FK_333ebae714c76d90e058f0d84e4" FOREIGN KEY (linked_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: policies FK_34137cbe89e8c03c4cfbbcc902b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT "FK_34137cbe89e8c03c4cfbbcc902b" FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: control_objectives FK_3601b0495f33e3d792350fb61a7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_objectives
    ADD CONSTRAINT "FK_3601b0495f33e3d792350fb61a7" FOREIGN KEY (policy_id) REFERENCES public.policies(id) ON DELETE CASCADE;


--
-- Name: business_units FK_3a0ae06ee6ba6cf6e49951802b0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_units
    ADD CONSTRAINT "FK_3a0ae06ee6ba6cf6e49951802b0" FOREIGN KEY (manager_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: integration_configs FK_3a2575b3a25279b224c06b1be01; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integration_configs
    ADD CONSTRAINT "FK_3a2575b3a25279b224c06b1be01" FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: risk_finding_links FK_3db7e27e6a96afdd529393a8466; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_finding_links
    ADD CONSTRAINT "FK_3db7e27e6a96afdd529393a8466" FOREIGN KEY (finding_id) REFERENCES public.findings(id) ON DELETE CASCADE;


--
-- Name: kri_risk_links FK_40496d3db82e2c4ed65e910bb25; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kri_risk_links
    ADD CONSTRAINT "FK_40496d3db82e2c4ed65e910bb25" FOREIGN KEY (kri_id) REFERENCES public.kris(id) ON DELETE CASCADE;


--
-- Name: asset_dependencies FK_4710daa62f1f2e44bc9b8c31186; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_dependencies
    ADD CONSTRAINT "FK_4710daa62f1f2e44bc9b8c31186" FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: distribution_list_users FK_49d4dac222bba7bb2165594b84d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.distribution_list_users
    ADD CONSTRAINT "FK_49d4dac222bba7bb2165594b84d" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: asset_requirement_mapping FK_53512fc56eeb1ceb1fc184dc42d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_requirement_mapping
    ADD CONSTRAINT "FK_53512fc56eeb1ceb1fc184dc42d" FOREIGN KEY (assessed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: users FK_56121877f4ed1231aa044403f58; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_56121877f4ed1231aa044403f58" FOREIGN KEY (business_unit_id) REFERENCES public.business_units(id) ON DELETE SET NULL;


--
-- Name: integration_sync_logs FK_57fa9da8078dd3aa809e5387c76; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integration_sync_logs
    ADD CONSTRAINT "FK_57fa9da8078dd3aa809e5387c76" FOREIGN KEY (integration_config_id) REFERENCES public.integration_configs(id) ON DELETE CASCADE;


--
-- Name: asset_field_configs FK_58f388dd15b866b5a84c6771f2a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_field_configs
    ADD CONSTRAINT "FK_58f388dd15b866b5a84c6771f2a" FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: physical_assets FK_5acc4df2e6b7815698e7758fa4a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.physical_assets
    ADD CONSTRAINT "FK_5acc4df2e6b7815698e7758fa4a" FOREIGN KEY (business_unit_id) REFERENCES public.business_units(id) ON DELETE SET NULL;


--
-- Name: report_templates FK_5b6b297cc92f04823caa04a31ab; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_templates
    ADD CONSTRAINT "FK_5b6b297cc92f04823caa04a31ab" FOREIGN KEY (distribution_list_id) REFERENCES public.email_distribution_lists(id) ON DELETE SET NULL;


--
-- Name: compliance_requirements FK_5bdf0e163226889704c332862e0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_requirements
    ADD CONSTRAINT "FK_5bdf0e163226889704c332862e0" FOREIGN KEY (framework_id) REFERENCES public.compliance_frameworks(id);


--
-- Name: risk_finding_links FK_602b39e2ce2d0571b5dd4f7b71a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_finding_links
    ADD CONSTRAINT "FK_602b39e2ce2d0571b5dd4f7b71a" FOREIGN KEY (risk_id) REFERENCES public.risks(id) ON DELETE CASCADE;


--
-- Name: risk_assessments FK_61617ab1f9b31573b9dc6de9e5a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessments
    ADD CONSTRAINT "FK_61617ab1f9b31573b9dc6de9e5a" FOREIGN KEY (risk_id) REFERENCES public.risks(id) ON DELETE CASCADE;


--
-- Name: kri_measurements FK_62d3549102d47bf15b3da6a76bb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kri_measurements
    ADD CONSTRAINT "FK_62d3549102d47bf15b3da6a76bb" FOREIGN KEY (kri_id) REFERENCES public.kris(id) ON DELETE CASCADE;


--
-- Name: physical_assets FK_638daa566c2610ee87a258ec603; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.physical_assets
    ADD CONSTRAINT "FK_638daa566c2610ee87a258ec603" FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: kris FK_641f3a082603d9e0a3b2c8b1ed1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kris
    ADD CONSTRAINT "FK_641f3a082603d9e0a3b2c8b1ed1" FOREIGN KEY (category_id) REFERENCES public.risk_categories(id) ON DELETE SET NULL;


--
-- Name: business_units FK_6709fece57a9c7d4f9067294d56; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_units
    ADD CONSTRAINT "FK_6709fece57a9c7d4f9067294d56" FOREIGN KEY (parent_id) REFERENCES public.business_units(id) ON DELETE SET NULL;


--
-- Name: notifications FK_692a909ee0fa9383e7859f9b406; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: treatment_tasks FK_70830314995825b1a822f8c98ac; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatment_tasks
    ADD CONSTRAINT "FK_70830314995825b1a822f8c98ac" FOREIGN KEY (treatment_id) REFERENCES public.risk_treatments(id) ON DELETE CASCADE;


--
-- Name: information_assets FK_73813a80660946715991ce52e43; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.information_assets
    ADD CONSTRAINT "FK_73813a80660946715991ce52e43" FOREIGN KEY (asset_custodian_id) REFERENCES public.users(id);


--
-- Name: business_applications FK_750a340ab04ac162bbacd7b563d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_applications
    ADD CONSTRAINT "FK_750a340ab04ac162bbacd7b563d" FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: import_logs FK_78d2f2d4dd8dd8f0956e8d84b19; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs
    ADD CONSTRAINT "FK_78d2f2d4dd8dd8f0956e8d84b19" FOREIGN KEY (imported_by_id) REFERENCES public.users(id);


--
-- Name: risk_control_links FK_78f5bc37ac033eecb5e908c6aec; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_control_links
    ADD CONSTRAINT "FK_78f5bc37ac033eecb5e908c6aec" FOREIGN KEY (risk_id) REFERENCES public.risks(id) ON DELETE CASCADE;


--
-- Name: compliance_validation_rules FK_7a48c3d3689c10fe5d8aa5f3b2d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_validation_rules
    ADD CONSTRAINT "FK_7a48c3d3689c10fe5d8aa5f3b2d" FOREIGN KEY (requirement_id) REFERENCES public.compliance_requirements(id) ON DELETE CASCADE;


--
-- Name: report_template_versions FK_7a519442e62f53d87616dbb6537; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_template_versions
    ADD CONSTRAINT "FK_7a519442e62f53d87616dbb6537" FOREIGN KEY (template_id) REFERENCES public.report_templates(id) ON DELETE CASCADE;


--
-- Name: risks FK_7e92dcf9326d277010ddf517c43; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT "FK_7e92dcf9326d277010ddf517c43" FOREIGN KEY (category_id) REFERENCES public.risk_categories(id) ON DELETE SET NULL;


--
-- Name: evidence_linkages FK_815624e685cee02caed29494aa0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence_linkages
    ADD CONSTRAINT "FK_815624e685cee02caed29494aa0" FOREIGN KEY (evidence_id) REFERENCES public.evidence(id) ON DELETE CASCADE;


--
-- Name: risk_assessment_requests FK_8366f873bf8a3638ab7028223ea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessment_requests
    ADD CONSTRAINT "FK_8366f873bf8a3638ab7028223ea" FOREIGN KEY (rejected_by_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: assessments FK_85f81241b3b1fa1bd58038fd673; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT "FK_85f81241b3b1fa1bd58038fd673" FOREIGN KEY (lead_assessor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: physical_assets FK_87112a1f25a63e6c18fef99d2fa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.physical_assets
    ADD CONSTRAINT "FK_87112a1f25a63e6c18fef99d2fa" FOREIGN KEY (asset_type_id) REFERENCES public.asset_types(id) ON DELETE SET NULL;


--
-- Name: control_asset_mappings FK_8b92fd5cc71f04b7ae5cb9eebd2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_asset_mappings
    ADD CONSTRAINT "FK_8b92fd5cc71f04b7ae5cb9eebd2" FOREIGN KEY (unified_control_id) REFERENCES public.unified_controls(id) ON DELETE CASCADE;


--
-- Name: physical_assets FK_91c5a330cda4f3e0de4cf106256; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.physical_assets
    ADD CONSTRAINT "FK_91c5a330cda4f3e0de4cf106256" FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: findings FK_928533b23f2104436f6390468bf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT "FK_928533b23f2104436f6390468bf" FOREIGN KEY (risk_accepted_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tasks FK_9430f12c5a1604833f64595a57f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "FK_9430f12c5a1604833f64595a57f" FOREIGN KEY (assigned_to_id) REFERENCES public.users(id);


--
-- Name: findings FK_95777accff51c573945c3947841; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT "FK_95777accff51c573945c3947841" FOREIGN KEY (remediation_owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: information_assets FK_98cb99b3b57cf45e140314509ae; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.information_assets
    ADD CONSTRAINT "FK_98cb99b3b57cf45e140314509ae" FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: kri_measurements FK_9a96d3dc24dbcf99a2204cbbb8c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kri_measurements
    ADD CONSTRAINT "FK_9a96d3dc24dbcf99a2204cbbb8c" FOREIGN KEY (measured_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: findings FK_9eca3b816756e41c6acfe7ddd14; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT "FK_9eca3b816756e41c6acfe7ddd14" FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE SET NULL;


--
-- Name: remediation_trackers FK_9ef0b07bdf8a5e3612f948d0439; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_trackers
    ADD CONSTRAINT "FK_9ef0b07bdf8a5e3612f948d0439" FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: compliance_validation_rules FK_a21637e1f2d94648962eab7bae6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_validation_rules
    ADD CONSTRAINT "FK_a21637e1f2d94648962eab7bae6" FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: workflow_approvals FK_a3661d7640fa9fcf4c30b57afc9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_approvals
    ADD CONSTRAINT "FK_a3661d7640fa9fcf4c30b57afc9" FOREIGN KEY ("workflowExecutionId") REFERENCES public.workflow_executions(id);


--
-- Name: influencers FK_a4f23e42091eac63870673be495; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.influencers
    ADD CONSTRAINT "FK_a4f23e42091eac63870673be495" FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: software_assets FK_a73c3255645d678cf3c2d7e6c62; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.software_assets
    ADD CONSTRAINT "FK_a73c3255645d678cf3c2d7e6c62" FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: email_distribution_lists FK_a7c06deac44f62efca401452a80; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_distribution_lists
    ADD CONSTRAINT "FK_a7c06deac44f62efca401452a80" FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: business_applications FK_a81e1c4a7eb9a9ee12c94994bbd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_applications
    ADD CONSTRAINT "FK_a81e1c4a7eb9a9ee12c94994bbd" FOREIGN KEY (business_unit_id) REFERENCES public.business_units(id) ON DELETE SET NULL;


--
-- Name: suppliers FK_ab2fb3ffb9a500e76ea4937fdef; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "FK_ab2fb3ffb9a500e76ea4937fdef" FOREIGN KEY (business_unit_id) REFERENCES public.business_units(id) ON DELETE SET NULL;


--
-- Name: influencers FK_abbe702807abad5fe9bbfd83370; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.influencers
    ADD CONSTRAINT "FK_abbe702807abad5fe9bbfd83370" FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: policy_acknowledgments FK_aead18d5c74162744756fc39953; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policy_acknowledgments
    ADD CONSTRAINT "FK_aead18d5c74162744756fc39953" FOREIGN KEY (policy_id) REFERENCES public.policies(id) ON DELETE CASCADE;


--
-- Name: risk_categories FK_b0635e8cafa6fd24d4ab3356c02; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_categories
    ADD CONSTRAINT "FK_b0635e8cafa6fd24d4ab3356c02" FOREIGN KEY (parent_category_id) REFERENCES public.risk_categories(id) ON DELETE SET NULL;


--
-- Name: information_assets FK_b266d81ede337ed47e515bbb4bc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.information_assets
    ADD CONSTRAINT "FK_b266d81ede337ed47e515bbb4bc" FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: software_assets FK_b4c5d0620c90e878172721f0897; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.software_assets
    ADD CONSTRAINT "FK_b4c5d0620c90e878172721f0897" FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: software_assets FK_ba3126f4b0314b815fcfd845fb9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.software_assets
    ADD CONSTRAINT "FK_ba3126f4b0314b815fcfd845fb9" FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: report_template_versions FK_bab79148c8f6c7f12913eb2d639; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_template_versions
    ADD CONSTRAINT "FK_bab79148c8f6c7f12913eb2d639" FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: policy_acknowledgments FK_bbe3c51c8fb51035cc518cfb3d7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policy_acknowledgments
    ADD CONSTRAINT "FK_bbe3c51c8fb51035cc518cfb3d7" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: risk_assessment_requests FK_c10150ab893e8eca780e7ca8975; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessment_requests
    ADD CONSTRAINT "FK_c10150ab893e8eca780e7ca8975" FOREIGN KEY (risk_id) REFERENCES public.risks(id) ON DELETE CASCADE;


--
-- Name: treatment_tasks FK_c24bc2060bd6e1e28e31745fa12; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatment_tasks
    ADD CONSTRAINT "FK_c24bc2060bd6e1e28e31745fa12" FOREIGN KEY (assignee_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: framework_requirements FK_c5b454a921d0887448d5606fa0b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.framework_requirements
    ADD CONSTRAINT "FK_c5b454a921d0887448d5606fa0b" FOREIGN KEY (framework_id) REFERENCES public.compliance_frameworks(id) ON DELETE CASCADE;


--
-- Name: security_test_results FK_c760680797a30dac604226eebe4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_test_results
    ADD CONSTRAINT "FK_c760680797a30dac604226eebe4" FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: validation_rules FK_cbb20a18e0a1a942e92914b271b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validation_rules
    ADD CONSTRAINT "FK_cbb20a18e0a1a942e92914b271b" FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: risk_asset_links FK_d283067051eeff8b0037a1a82c3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_asset_links
    ADD CONSTRAINT "FK_d283067051eeff8b0037a1a82c3" FOREIGN KEY (risk_id) REFERENCES public.risks(id) ON DELETE CASCADE;


--
-- Name: asset_audit_logs FK_d5b6f759597d6a091ae3880f45c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_audit_logs
    ADD CONSTRAINT "FK_d5b6f759597d6a091ae3880f45c" FOREIGN KEY (changed_by_id) REFERENCES public.users(id);


--
-- Name: evidence FK_d9edd545745feb9e3b912872d49; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT "FK_d9edd545745feb9e3b912872d49" FOREIGN KEY (collector_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: software_assets FK_decc48cf518d5b1693c3fa18ae5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.software_assets
    ADD CONSTRAINT "FK_decc48cf518d5b1693c3fa18ae5" FOREIGN KEY (business_unit_id) REFERENCES public.business_units(id) ON DELETE SET NULL;


--
-- Name: risk_finding_links FK_df038f0912e174128ed42054d0f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_finding_links
    ADD CONSTRAINT "FK_df038f0912e174128ed42054d0f" FOREIGN KEY (linked_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: workflow_approvals FK_df57be097b7e7f632b124f98af6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_approvals
    ADD CONSTRAINT "FK_df57be097b7e7f632b124f98af6" FOREIGN KEY ("approverId") REFERENCES public.users(id);


--
-- Name: workflows FK_dfbe0c638e46e7d85735319d19e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflows
    ADD CONSTRAINT "FK_dfbe0c638e46e7d85735319d19e" FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: report_templates FK_e05ac21b1648da31c1793532822; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report_templates
    ADD CONSTRAINT "FK_e05ac21b1648da31c1793532822" FOREIGN KEY (created_by_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: control_dependencies FK_e094d522a297d28d53360018143; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_dependencies
    ADD CONSTRAINT "FK_e094d522a297d28d53360018143" FOREIGN KEY (source_control_id) REFERENCES public.unified_controls(id) ON DELETE CASCADE;


--
-- Name: risk_assessment_requests FK_e0d4065bed6e7002cf041d30d57; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessment_requests
    ADD CONSTRAINT "FK_e0d4065bed6e7002cf041d30d57" FOREIGN KEY (requested_for_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: workflow_executions FK_e39ffd7144106908bbf1b9d712b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_executions
    ADD CONSTRAINT "FK_e39ffd7144106908bbf1b9d712b" FOREIGN KEY ("assignedToId") REFERENCES public.users(id);


--
-- Name: findings FK_e3aa6515a958d29ab185cf3c528; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.findings
    ADD CONSTRAINT "FK_e3aa6515a958d29ab185cf3c528" FOREIGN KEY (unified_control_id) REFERENCES public.unified_controls(id) ON DELETE SET NULL;


--
-- Name: business_applications FK_e53886ea9657428848b044d3385; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_applications
    ADD CONSTRAINT "FK_e53886ea9657428848b044d3385" FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: risk_assessment_requests FK_e81cb6e40ce169e127f4fe4a471; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_assessment_requests
    ADD CONSTRAINT "FK_e81cb6e40ce169e127f4fe4a471" FOREIGN KEY (resulting_assessment_id) REFERENCES public.risk_assessments(id) ON DELETE SET NULL;


--
-- Name: physical_assets FK_e952f24ad5c7d0ad95b4b23c895; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.physical_assets
    ADD CONSTRAINT "FK_e952f24ad5c7d0ad95b4b23c895" FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: risks FK_ebed562805767d77399e0d31640; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT "FK_ebed562805767d77399e0d31640" FOREIGN KEY (sub_category_id) REFERENCES public.risk_categories(id) ON DELETE SET NULL;


--
-- Name: risk_asset_links FK_ecd92922ceebdc6299988aab292; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_asset_links
    ADD CONSTRAINT "FK_ecd92922ceebdc6299988aab292" FOREIGN KEY (linked_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: suppliers FK_eda48ebc94d0b4fba32baa7ca60; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "FK_eda48ebc94d0b4fba32baa7ca60" FOREIGN KEY (updated_by_id) REFERENCES public.users(id);


--
-- Name: assessment_results FK_f04bfb7386701e81c9f57d2b12c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_results
    ADD CONSTRAINT "FK_f04bfb7386701e81c9f57d2b12c" FOREIGN KEY (unified_control_id) REFERENCES public.unified_controls(id) ON DELETE CASCADE;


--
-- Name: control_dependencies FK_f296203ffc6404b72f8d3c55799; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_dependencies
    ADD CONSTRAINT "FK_f296203ffc6404b72f8d3c55799" FOREIGN KEY (target_control_id) REFERENCES public.unified_controls(id) ON DELETE CASCADE;


--
-- Name: remediation_trackers FK_f3e6008eb69df16bf171e6272ec; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.remediation_trackers
    ADD CONSTRAINT "FK_f3e6008eb69df16bf171e6272ec" FOREIGN KEY (finding_id) REFERENCES public.findings(id) ON DELETE CASCADE;


--
-- Name: policies FK_f5573b55afa97b5aca1f260c6f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT "FK_f5573b55afa97b5aca1f260c6f8" FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: compliance_assessments FK_f5c34d94e880d616f4be4e11e44; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compliance_assessments
    ADD CONSTRAINT "FK_f5c34d94e880d616f4be4e11e44" FOREIGN KEY (requirement_id) REFERENCES public.compliance_requirements(id) ON DELETE CASCADE;


--
-- Name: business_applications FK_f62771dc4280f9ca5838c9afdc2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_applications
    ADD CONSTRAINT "FK_f62771dc4280f9ca5838c9afdc2" FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: risks FK_f79785288f1b32c06d89004a8f8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT "FK_f79785288f1b32c06d89004a8f8" FOREIGN KEY (risk_analyst_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: asset_requirement_mapping FK_fb87c3c3323bde3d47e25d57aea; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_requirement_mapping
    ADD CONSTRAINT "FK_fb87c3c3323bde3d47e25d57aea" FOREIGN KEY (requirement_id) REFERENCES public.compliance_requirements(id) ON DELETE CASCADE;


--
-- Name: risk_control_links FK_ff75d2688f3e37baa9c7624f47b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_control_links
    ADD CONSTRAINT "FK_ff75d2688f3e37baa9c7624f47b" FOREIGN KEY (control_id) REFERENCES public.unified_controls(id) ON DELETE CASCADE;


--
-- Name: risk_settings FK_risk_settings_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_settings
    ADD CONSTRAINT "FK_risk_settings_created_by" FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: risk_settings FK_risk_settings_updated_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_settings
    ADD CONSTRAINT "FK_risk_settings_updated_by" FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: policies fk_policies_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT fk_policies_created_by FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: policies fk_policies_owner_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT fk_policies_owner_id FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: policies fk_policies_supersedes; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT fk_policies_supersedes FOREIGN KEY (supersedes_policy_id) REFERENCES public.policies(id) ON DELETE SET NULL;


--
-- Name: policies fk_policies_updated_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT fk_policies_updated_by FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict heVMQzsDiWfiJfm7iU0A3e7KpQ89GokNu6H33c3yLap8y1ef1HD1epoVWNI3r9Z

