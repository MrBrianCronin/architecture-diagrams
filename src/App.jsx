import React, { useState, useEffect } from 'react';

const DISCLAIMER = 'These architecture diagrams represent design patterns and approaches I am experienced with. They are illustrative examples created for this portfolio and do not represent the actual implementation or intellectual property of any current or former employer.';
const CARD_DISCLAIMER = 'Illustrative design pattern — not based on any company\'s actual architecture';

const DIAGRAMS = [
  { id: 'aws', title: 'AWS native event-driven platform', tag: 'Cloud Architecture', tagColor: '#F59E0B', desc: 'Event-driven data platform using API Gateway, EventBridge, Kinesis, Lambda, AWS Glue, and a multi-store persistence layer feeding downstream consumers.', icon: '☁️' },
  { id: 'snowflake', title: 'Snowflake + dbt modern data stack', tag: 'Data Engineering', tagColor: '#4F6EF7', desc: 'Medallion architecture with bronze/silver/gold layers, showcasing dynamic tables, transient tables for dbt intermediates, and hybrid tables for OLTP serving.', icon: '❄️' },
  { id: 'ai-analytics', title: 'AI-driven conversational analytics', tag: 'Agentic AI', tagColor: '#8B5CF6', desc: 'Agent orchestration that scans data sources to auto-generate semantic views and callable skills, consumed by any LLM through MCP or tool-use protocols.', icon: '🤖' },
];

// ── Component info databases ──
const AWS_INFO = {
  'API Gateway': { title: 'API Gateway — Event ingestion', desc: 'Serves as the front door for all real-time event ingestion. Handles authentication, throttling, and request validation before routing events into the processing pipeline. Supports REST and WebSocket APIs with automatic scaling.' },
  'S3 Landing': { title: 'S3 Landing Zone — Batch file ingestion', desc: 'Receives batch file drops from partner systems and internal processes. Files land in raw format (CSV, JSON, Parquet) and trigger downstream processing via S3 event notifications or scheduled Glue crawlers.' },
  'EventBridge': { title: 'EventBridge — Event routing', desc: 'Provides rules-based event routing to multiple consumers. Events are matched against patterns and fanned out to the appropriate processing targets. Supports cross-account and cross-region event delivery with built-in retry logic.' },
  'Kinesis': { title: 'Kinesis — Stream processing', desc: 'Handles high-throughput, real-time streaming for use cases requiring ordered processing and replay capability. Ideal for clickstream data, IoT telemetry, and financial transaction streams where event ordering matters.' },
  'AWS Glue': { title: 'AWS Glue — ETL + data catalog', desc: 'Manages batch ETL jobs for file-based data, crawls data sources to build and maintain the data catalog, and handles schema discovery. Serverless Spark-based processing scales automatically with data volume.' },
  'Lambda Transform': { title: 'Lambda — Transform', desc: 'Serverless functions that enrich, transform, and normalize incoming events in real-time. Each function handles a specific transformation concern — field mapping, data type conversion, business rule application — and scales automatically per event volume.' },
  'Lambda Validate': { title: 'Lambda — Validate', desc: 'Enforces data quality at the point of ingestion. Validates schemas, checks required fields, applies business rules, and routes invalid records to a dead-letter queue for investigation. Catches data issues before they reach storage.' },
  'Step Functions': { title: 'Step Functions — Orchestration', desc: 'Coordinates complex multi-step data processing workflows that span multiple Lambda functions, Glue jobs, and service calls. Provides visual workflow tracking, automatic retry with backoff, and error handling for long-running batch processes.' },
  'S3 Lake': { title: 'S3 Data Lake — Raw + processed storage', desc: 'Central data lake storing both raw ingested data and processed/transformed outputs in columnar formats (Parquet, ORC). Organized by zone (raw, curated, published) with lifecycle policies managing storage tiers and retention.' },
  'DynamoDB': { title: 'DynamoDB — Key-value lookups', desc: 'Provides single-digit millisecond reads for operational lookups — current account state, latest transaction status, real-time entity views. Ideal for serving layers that need fast point reads by primary key.' },
  'Redshift': { title: 'Redshift — Analytical warehouse', desc: 'Handles heavy analytical workloads — trend analysis, aggregations across billions of rows, regulatory reporting. Materialized views and result caching accelerate repeated dashboard queries. Redshift Spectrum extends queries to S3 data without loading.' },
  'APIs': { title: 'APIs — Data serving', desc: 'RESTful and GraphQL APIs that serve processed event data to downstream applications, mobile apps, and partner integrations. Backed by DynamoDB for low-latency reads and Redshift for analytical queries.' },
  'Dashboards': { title: 'BI Dashboards', desc: 'Business intelligence tools (Tableau, QuickSight, Power BI) connected to Redshift for executive reporting, operational monitoring, and trend analysis. Dashboards refresh on schedule or near-real-time depending on the use case.' },
  'ML models': { title: 'ML Models — Predictive analytics', desc: 'Machine learning models that consume both real-time event streams and historical data from the lake for training and inference. SageMaker endpoints serve predictions while batch models run against Redshift or S3 data.' },
  'Downstream': { title: 'Downstream Systems', desc: 'External systems and partner integrations that consume processed events — CRM updates, notification services, compliance reporting systems, and third-party data feeds.' },
  'CloudWatch': { title: 'CloudWatch — Observability', desc: 'Centralized monitoring, logging, and alerting across all services. Custom metrics track event throughput, processing latency, error rates, and queue depths. Alarms trigger when SLAs are at risk.' },
  'IAM': { title: 'IAM — Security & access control', desc: 'Identity and access management controlling who and what can access each service. Least-privilege roles for Lambda functions, encryption at rest (KMS) and in transit (TLS), and VPC security groups isolating the data plane.' },
};

const SNOW_INFO = {
  'Raw tables': { title: 'Raw Tables — 1:1 source replica', desc: 'Direct copies of source system tables landed by Fivetran or Airbyte. No transformations applied — preserves the exact structure and data types from the source. Serves as the system of record for all downstream processing.' },
  'Dynamic': { title: 'Dynamic Tables — Declarative auto-refresh', desc: 'A Snowflake table type that automatically refreshes based on a defined query and target freshness (target lag). Instead of writing complex Streams + Tasks pipelines, you declare the desired transformation in SQL and Snowflake handles incremental processing, dependency tracking, and scheduling. Ideal for structuring raw data declaratively without manual orchestration.' },
  'Snowpipe': { title: 'Snowpipe — Continuous ingestion', desc: 'Serverless, continuous data ingestion service that loads data from S3/Azure/GCS within minutes of file arrival. Event-driven via cloud storage notifications — no warehouses to manage for ingestion workloads.' },
  'CDC logs': { title: 'CDC via Streams — Change data capture', desc: 'Snowflake Streams track row-level changes (inserts, updates, deletes) on source tables. Combined with Tasks, they enable incremental processing patterns for slowly changing dimensions and event sourcing.' },
  'Conformed': { title: 'Conformed Dimensions — Cleaned & standardized', desc: 'Dimension tables with consistent naming, data types, and business key resolution across sources. dbt models handle deduplication, null handling, and business logic to produce a single source of truth for each entity.' },
  'Transient': { title: 'Transient Tables — Persistent dbt intermediates', desc: 'Snowflake transient tables provide persistence for intermediate dbt processing steps without the fail-safe storage overhead of permanent tables (no 7-day fail-safe period). Unlike dbt ephemeral models which exist only as CTEs and vanish after the DAG completes, transient tables remain queryable for debugging, auditing, and downstream reprocessing between runs.' },
  'Fact tables': { title: 'Fact Tables — Event grain', desc: 'Transaction-level fact tables at the most granular event grain. Each row represents a single business event (a trade, a page view, a policy change) with foreign keys to conformed dimensions and measurable quantities.' },
  'dbt tests': { title: 'dbt Tests — Data quality gates', desc: 'Automated data quality checks that run as part of every dbt build. Schema tests (not null, unique, accepted values, relationships) and custom data tests catch issues before data reaches the gold layer. Failed tests block downstream models.' },
  'Metrics': { title: 'Metrics — KPIs & aggregates', desc: 'Pre-computed business metrics and KPIs aggregated from fact tables. Revenue, retention, conversion rates, AUM — calculated once with consistent business logic and served to all downstream consumers.' },
  'Semantic': { title: 'Semantic Layer — Business terms', desc: 'A business-friendly abstraction that maps technical column names to plain-language terms. "Monthly recurring revenue" instead of "sum_amt_usd_mrr". Ensures every consumer — BI tool, analyst, executive — uses the same metric definitions.' },
  'Data marts': { title: 'Data Marts — Domain views', desc: 'Purpose-built views organized by business domain (Sales, Operations, Risk, Compliance). Each mart pre-joins the relevant facts and dimensions so business users can query without complex joins.' },
  'Hybrid': { title: 'Hybrid Tables — OLTP serving for apps', desc: 'A Snowflake table type optimized for low-latency, high-concurrency transactional workloads. Uses row-based storage with automatic indexing, enforced primary keys, foreign key constraints, and row-level locking. Enables applications to perform sub-millisecond point reads and writes directly against Snowflake — eliminating the need for a separate OLTP database alongside the warehouse.' },
  'BI tools': { title: 'BI Tools — Tableau / Power BI', desc: 'Business intelligence platforms connected directly to gold-layer views via Snowflake connectors. Live queries against optimized views with Snowflake handling concurrency and caching.' },
  'Self-serve': { title: 'Self-Serve Analytics', desc: 'Ad hoc query tools that let analysts explore the semantic layer without writing complex SQL. The semantic layer ensures consistent metrics regardless of who is querying.' },
  'Reverse ETL': { title: 'Reverse ETL — Push to SaaS', desc: 'Tools like Census or Hightouch that sync curated data back to operational systems — pushing enriched customer profiles to Salesforce, audience segments to ad platforms, or product analytics to Intercom.' },
  'ML / DS': { title: 'ML & Data Science', desc: 'Data science teams consuming gold-layer tables via Snowpark (Python/Java/Scala) or Snowflake Cortex for ML training, feature engineering, and inference directly within the Snowflake compute environment.' },
  'App layer': { title: 'Application Layer — Via hybrid tables', desc: 'Applications that interact with Snowflake hybrid tables for OLTP-like workloads — user session state, real-time inventory, app configuration. Combines transactional and analytical data on one platform.' },
  'Orchestration': { title: 'dbt Cloud / Airflow — Orchestration', desc: 'Scheduling and CI/CD pipeline that runs dbt models on a cadence, manages dependencies, runs tests, and deploys changes through environments (dev → staging → production). Includes alerting on failures.' },
  'Governance': { title: 'Data Governance', desc: 'End-to-end governance including column-level lineage via dbt docs, dynamic data masking for PII, object tagging for classification, role-based access control, and audit trails for compliance.' },
};

const AI_INFO = {
  'Databases': { title: 'Database Sources', desc: 'Relational and NoSQL databases that contain the organization\'s operational and analytical data. The scanner agent connects via JDBC/ODBC, reads schema metadata, samples data profiles, and maps relationships between tables.' },
  'Catalogs': { title: 'Data Catalogs — Alation / Collibra', desc: 'Enterprise data catalogs that store curated metadata, business glossaries, and data stewardship information. The scanner agent extracts business context, ownership, and data quality scores that enrich the semantic layer.' },
  'Dictionaries': { title: 'Data Dictionaries', desc: 'Column-level definitions and documentation maintained by data teams. Provides the business meaning behind technical column names — essential for the mapping agent to generate accurate semantic views.' },
  'BI tools': { title: 'BI Tool Metadata', desc: 'Existing Tableau workbooks, Power BI reports, and Looker explores contain implicit business logic — calculated fields, filter definitions, and metric formulas. The scanner agent extracts these to avoid reinventing definitions.' },
  'dbt models': { title: 'dbt Models & Documentation', desc: 'dbt YAML schema files and SQL models contain transformation logic, column descriptions, and test definitions. The scanner agent parses these to understand data lineage and business rules already encoded in the pipeline.' },
  'API specs': { title: 'API Specifications', desc: 'OpenAPI/Swagger specifications and API documentation that describe available data endpoints, request/response schemas, and authentication methods. Enables the skill builder to create callable data access patterns.' },
  'Scanner': { title: 'Scanner Agent — Crawl & discover', desc: 'Autonomously connects to all registered data sources, reads schema metadata, samples data distributions, detects relationships, and builds a unified metadata graph. Runs on schedule to detect schema changes and new tables.' },
  'Mapper': { title: 'Mapping Agent — Resolve & align', desc: 'Resolves naming conflicts across sources (e.g., "cust_id" vs "customer_id" vs "client_number"), maps business terms to physical columns, and identifies semantic duplicates. Produces a canonical business vocabulary.' },
  'View builder': { title: 'View Builder Agent — Generate views', desc: 'Auto-generates SQL views that join, filter, and aggregate data according to the semantic model. Produces business-friendly abstractions like "active_customers_last_30_days" from raw tables, complete with documentation.' },
  'Skill builder': { title: 'Skill Builder Agent — Create callable skills', desc: 'Creates reusable, parameterized query templates that LLMs can invoke without writing SQL. Skills like "get_revenue_by_region(quarter, region)" encapsulate business logic, access controls, and optimization hints.' },
  'Validator': { title: 'Validation Agent — Test & verify', desc: 'Tests generated views and skills against known queries with expected results. Validates that semantic mappings produce correct answers, checks for performance issues, and flags potential data quality concerns before publishing.' },
  'Semantic views': { title: 'Semantic Views — Business terms', desc: 'Auto-generated SQL views that present data in business-friendly terms. Instead of "SELECT acct_bal_amt FROM tbl_fa_positions", users see "account_balance" from the "financial_advisor_positions" view.' },
  'Skills library': { title: 'Skills Library — Query templates', desc: 'A registry of callable, parameterized query functions that any LLM can invoke. Each skill has a natural language description, typed parameters, and returns structured results. Think of it as a function library for data access.' },
  'Metric catalog': { title: 'Metric Catalog — KPI definitions', desc: 'Curated, versioned definitions of business KPIs with exact SQL formulas, grain specifications, and dimension breakdowns. Ensures every LLM consumer calculates "monthly active users" or "net revenue retention" identically.' },
  'Guardrails': { title: 'Guardrails — Access & cost controls', desc: 'Policy layer that enforces row-level security, column masking for PII, query cost limits (prevent runaway full-table scans), and rate limiting. Every LLM-generated query passes through guardrails before execution.' },
  'Context index': { title: 'Context Index — Embeddings', desc: 'Vector embeddings of skill descriptions, table documentation, and sample queries. When a user asks a natural language question, the LLM searches this index to find the most relevant skill or view to invoke.' },
  'Chatbot': { title: 'Conversational Chatbot', desc: 'Natural language interface where users ask data questions in plain English. The LLM searches the context index, selects the right skill, invokes it with parameters extracted from the question, and presents results with narrative explanation.' },
  'BI copilot': { title: 'BI Copilot — In-tool assistant', desc: 'An AI assistant embedded directly inside BI tools that helps analysts build queries, suggests relevant metrics, explains chart anomalies, and auto-generates dashboard narratives using the semantic layer.' },
  'Report agent': { title: 'Report Agent — Auto-generation', desc: 'Scheduled agent that generates and distributes reports on a cadence — weekly business reviews, monthly compliance reports, daily KPI digests. Uses skills to pull data and LLMs to generate narrative summaries.' },
  'Anomaly agent': { title: 'Anomaly Detection Agent', desc: 'Continuously monitors key metrics using the skills library, detects statistical anomalies (sudden drops, trend breaks, threshold violations), and surfaces proactive alerts to the right stakeholders via Slack, email, or PagerDuty.' },
  'Any LLM': { title: 'Any LLM — Claude / GPT / Gemini', desc: 'The semantic layer is LLM-agnostic. Any model that supports tool use or MCP can discover and invoke skills. This prevents vendor lock-in and lets you swap or combine models based on cost, latency, or capability.' },
  'MCP': { title: 'MCP / Tool Use Protocol', desc: 'Model Context Protocol (MCP) provides a universal interface for LLMs to discover available skills, understand their parameters, and invoke them. Any MCP-compatible LLM can connect to the semantic layer without custom integration.' },
  'Governance': { title: 'Governance & Audit', desc: 'Complete audit trail of every LLM-generated query — who asked, what skill was invoked, what data was accessed, and what results were returned. RBAC ensures users only see data they\'re authorized for, even through natural language queries.' },
  'Feedback': { title: 'Feedback Loop', desc: 'User corrections ("that\'s not the right metric for churn") flow back to the orchestrator, which updates the semantic views, refines skill definitions, and improves the context index. The system gets smarter with use.' },
};

function useRoute() {
  const [hash, setHash] = useState(window.location.hash.slice(1) || '');
  useEffect(() => {
    const handler = () => setHash(window.location.hash.slice(1) || '');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash;
}

const S = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFBFD', fontFamily: "'DM Sans', sans-serif", color: '#1A1F36' },
  header: { background: '#fff', borderBottom: '1px solid #E2E6EF', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 12 },
  back: { fontSize: 12, color: '#8792A8', textDecoration: 'none', fontWeight: 500, marginRight: 4 },
  logo: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: "'Outfit', sans-serif" },
  h1: { fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", lineHeight: 1.1 },
  sub: { fontSize: 12, color: '#8792A8', marginTop: 2 },
  footer: { background: '#fff', borderTop: '1px solid #E2E6EF', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 12, color: '#8792A8' },
};

function Header({ showBack }) {
  return (
    <header style={S.header}>
      {showBack ? <a href="#" style={S.back}>← All diagrams</a> : <a href="/" style={S.back}>← briancronin.ai</a>}
      <div style={S.logo}>A</div>
      <div>
        <h1 style={S.h1}>Architecture Diagrams</h1>
        <p style={S.sub}>Design patterns and approaches from enterprise data platforms</p>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={S.footer}>
      <span>Architecture Diagrams · <a href="/" style={{ color: '#8B5CF6', textDecoration: 'none' }}>briancronin.ai</a></span>
      <span style={{ maxWidth: 500, textAlign: 'right', lineHeight: 1.5 }}>{CARD_DISCLAIMER}</span>
    </footer>
  );
}

// ── Detail panel ──
function DetailPanel({ info, onClose, color = '#4F6EF7' }) {
  if (!info) return null;
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: `1.5px solid ${color}`,
      padding: '20px 24px', marginTop: 16, animation: 'fadeIn 0.2s ease',
      position: 'relative',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 12, right: 16, background: 'none', border: 'none',
        fontSize: 18, color: '#8792A8', cursor: 'pointer', lineHeight: 1,
      }}>×</button>
      <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color, marginBottom: 8, paddingRight: 24 }}>{info.title}</h3>
      <p style={{ fontSize: 14, color: '#3C4257', lineHeight: 1.7 }}>{info.desc}</p>
    </div>
  );
}

// ── Clickable SVG rect helper ──
function CBox({ x, y, w, h, rx = 8, fill, stroke, sw = 0.5, title, subtitle, titleFill, subFill, onClick, selected }) {
  const border = selected ? 2 : sw;
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }} opacity={selected === false ? 0.5 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={border}/>
      <text style={{ fontSize: 13, fontWeight: 500, fill: titleFill }} x={x + w/2} y={subtitle ? y + h*0.38 : y + h/2} textAnchor="middle" dominantBaseline="central">{title}</text>
      {subtitle && <text style={{ fontSize: 11, fill: subFill }} x={x + w/2} y={y + h*0.68} textAnchor="middle" dominantBaseline="central">{subtitle}</text>}
    </g>
  );
}

// ── Landing ──
function Landing() {
  return (
    <div style={S.page}>
      <Header />
      <main style={{ flex: 1, padding: 32, maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 15, color: '#5A5E6B', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>{DISCLAIMER}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {DIAGRAMS.map(d => (
            <a key={d.id} href={`#${d.id}`} style={{
              background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E2E6EF',
              textDecoration: 'none', color: 'inherit', transition: 'all 0.2s ease',
              display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer',
            }} onMouseEnter={e => { e.currentTarget.style.borderColor = d.tagColor; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E6EF'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${d.tagColor}15`, color: d.tagColor }}>{d.tag}</span>
                <span style={{ fontSize: 24 }}>{d.icon}</span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", lineHeight: 1.3 }}>{d.title}</h2>
              <p style={{ fontSize: 13, color: '#5A5E6B', lineHeight: 1.6, flex: 1 }}>{d.desc}</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: d.tagColor }}>Explore diagram →</span>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ── Diagram wrapper ──
function DiagramPage({ diagram, children, selected, infoDb, onSelect, color }) {
  const info = selected ? infoDb[selected] : null;
  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes hintPulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        svg g[style*="cursor: pointer"] rect { transition: stroke-width 0.15s ease, filter 0.15s ease; }
        svg g[style*="cursor: pointer"]:hover rect { filter: brightness(0.95); stroke-width: 2 !important; }
        .click-hint { animation: hintPulse 2s ease-in-out 3; color: ${diagram.tagColor}; }
      `}</style>
      <Header showBack />
      <main style={{ flex: 1, padding: '24px 32px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{diagram.icon}</span>
            <div>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${diagram.tagColor}15`, color: diagram.tagColor }}>{diagram.tag}</span>
              <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginTop: 6 }}>{diagram.title}</h1>
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#5A5E6B', lineHeight: 1.7, maxWidth: 800 }}>{diagram.desc}</p>
        </div>
        {!selected && (
          <div className="click-hint" style={{ textAlign: 'center', marginBottom: 12, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>👇</span> Click any component to explore its role in this architecture
          </div>
        )}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E6EF', padding: 24 }}>
          {children}
        </div>
        <DetailPanel info={info} onClose={() => onSelect(null)} color={color} />
        <p style={{ fontSize: 12, color: '#8792A8', textAlign: 'center', fontStyle: 'italic', marginTop: 8 }}>{CARD_DISCLAIMER}</p>
      </main>
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════
// AWS DIAGRAM
// ═══════════════════════════════════════
function AWSPage() {
  const [sel, setSel] = useState(null);
  const toggle = (k) => setSel(s => s === k ? null : k);
  const hi = (k) => sel === null ? 1 : sel === k ? 1 : 0.45;
  const diagram = DIAGRAMS[0];

  return (
    <DiagramPage diagram={diagram} selected={sel} infoDb={AWS_INFO} onSelect={setSel} color="#F59E0B">
      <svg width="100%" viewBox="0 0 680 470" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <defs><marker id="aw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>

        {/* AWS container */}
        <rect x="120" y="15" width="550" height="370" rx="16" fill="#E6F1FB" stroke="#85B7EB" strokeWidth="0.5"/>
        <text style={{ fontSize:12, fill:'#185FA5' }} x="395" y="32" textAnchor="middle">AWS cloud</text>

        {/* Sources */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="55" y="32" textAnchor="middle">SOURCES</text>
        {[['Core apps',48],['Partners',96],['User events',144],['File feeds',192]].map(([l,y]) => (
          <g key={l} onClick={() => toggle(l)} style={{ cursor:'pointer' }} opacity={hi(l)}>
            <rect x="15" y={y} width="85" height="36" rx="8" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5"/>
            <text style={{ fontSize:12, fontWeight:500, fill:'#1A1F36' }} x="57" y={y+18} textAnchor="middle" dominantBaseline="central">{l}</text>
          </g>
        ))}

        {/* Ingest */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="175" y="32" textAnchor="middle">INGEST</text>
        <g onClick={() => toggle('API Gateway')} style={{ cursor:'pointer' }} opacity={hi('API Gateway')}>
          <rect x="130" y="80" width="90" height="48" rx="8" fill="#FAECE7" stroke="#D85A30" strokeWidth={sel==='API Gateway'?2:0.5}/>
          <text style={{ fontSize:13, fontWeight:500, fill:'#712B13' }} x="175" y="98" textAnchor="middle" dominantBaseline="central">API</text>
          <text style={{ fontSize:11, fill:'#993C1D' }} x="175" y="114" textAnchor="middle" dominantBaseline="central">Gateway</text>
        </g>
        <g onClick={() => toggle('S3 Landing')} style={{ cursor:'pointer' }} opacity={hi('S3 Landing')}>
          <rect x="130" y="175" width="90" height="48" rx="8" fill="#FAECE7" stroke="#D85A30" strokeWidth={sel==='S3 Landing'?2:0.5}/>
          <text style={{ fontSize:13, fontWeight:500, fill:'#712B13' }} x="175" y="193" textAnchor="middle" dominantBaseline="central">S3</text>
          <text style={{ fontSize:11, fill:'#993C1D' }} x="175" y="209" textAnchor="middle" dominantBaseline="central">Landing zone</text>
        </g>

        {/* Source arrows */}
        <line x1="100" y1="66" x2="128" y2="95" stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="100" y1="114" x2="128" y2="107" stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="100" y1="162" x2="128" y2="112" stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="100" y1="210" x2="128" y2="199" stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#aw)"/>

        {/* Route */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="295" y="32" textAnchor="middle">ROUTE</text>
        {[['EventBridge','Event routing',55,'EventBridge'],['Kinesis','Streaming',118,'Kinesis'],['AWS Glue','ETL + catalog',180,'AWS Glue']].map(([t,s,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="250" y={y} width="90" height="48" rx="8" fill="#FAEEDA" stroke="#BA7517" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:13, fontWeight:500, fill:'#633806' }} x="295" y={y+18} textAnchor="middle" dominantBaseline="central">{t}</text>
            <text style={{ fontSize:11, fill:'#854F0B' }} x="295" y={y+34} textAnchor="middle" dominantBaseline="central">{s}</text>
          </g>
        ))}
        <line x1="220" y1="96" x2="248" y2="79" stroke="#BA7517" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="220" y1="108" x2="248" y2="136" stroke="#BA7517" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="220" y1="199" x2="248" y2="199" stroke="#BA7517" strokeWidth="0.5" markerEnd="url(#aw)"/>

        {/* Compute */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="415" y="32" textAnchor="middle">COMPUTE</text>
        {[['Lambda','Transform',55,'Lambda Transform'],['Lambda','Validate',118,'Lambda Validate'],['Step Fns','Orchestrate',180,'Step Functions']].map(([t,s,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="370" y={y} width="90" height="48" rx="8" fill="#EEEDFE" stroke="#534AB7" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:13, fontWeight:500, fill:'#26215C' }} x="415" y={y+18} textAnchor="middle" dominantBaseline="central">{t}</text>
            <text style={{ fontSize:11, fill:'#3C3489' }} x="415" y={y+34} textAnchor="middle" dominantBaseline="central">{s}</text>
          </g>
        ))}
        <line x1="340" y1="79" x2="368" y2="79" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="340" y1="142" x2="368" y2="142" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="340" y1="204" x2="368" y2="204" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw)"/>

        {/* Store */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="535" y="32" textAnchor="middle">STORE</text>
        {[['S3 lake','Raw + processed',55,'S3 Lake'],['DynamoDB','Key-value',118,'DynamoDB'],['Redshift','Warehouse',180,'Redshift']].map(([t,s,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="490" y={y} width="90" height="48" rx="8" fill="#E1F5EE" stroke="#0F6E56" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:13, fontWeight:500, fill:'#04342C' }} x="535" y={y+18} textAnchor="middle" dominantBaseline="central">{t}</text>
            <text style={{ fontSize:11, fill:'#085041' }} x="535" y={y+34} textAnchor="middle" dominantBaseline="central">{s}</text>
          </g>
        ))}
        <line x1="460" y1="79" x2="488" y2="79" stroke="#0F6E56" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="460" y1="142" x2="488" y2="142" stroke="#0F6E56" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="460" y1="204" x2="488" y2="204" stroke="#0F6E56" strokeWidth="0.5" markerEnd="url(#aw)"/>

        {/* Consumption */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="395" y="265" textAnchor="middle">CONSUMPTION</text>
        {[['APIs',140,'APIs'],['Dashboards',260,'Dashboards'],['ML models',380,'ML models'],['Downstream',500,'Downstream']].map(([l,x,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x={x} y={275} width={l==='Downstream'?110:100} height="36" rx="8" fill="#EAF3DE" stroke="#3B6D11" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:12, fontWeight:500, fill:'#173404' }} x={x+(l==='Downstream'?55:50)} y={293} textAnchor="middle" dominantBaseline="central">{l}</text>
          </g>
        ))}
        <line x1="535" y1="103" x2="190" y2="273" stroke="#3B6D11" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="535" y1="166" x2="310" y2="273" stroke="#3B6D11" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="535" y1="228" x2="430" y2="273" stroke="#3B6D11" strokeWidth="0.5" markerEnd="url(#aw)"/>
        <line x1="580" y1="228" x2="555" y2="273" stroke="#3B6D11" strokeWidth="0.5" markerEnd="url(#aw)"/>

        {/* CloudWatch */}
        <g onClick={() => toggle('CloudWatch')} style={{ cursor:'pointer' }} opacity={hi('CloudWatch')}>
          <rect x="140" y="330" width="480" height="24" rx="6" fill="#FBEAF0" stroke="#993556" strokeWidth={sel==='CloudWatch'?2:0.5}/>
          <text style={{ fontSize:10, fill:'#4B1528' }} x="380" y="342" textAnchor="middle" dominantBaseline="central">CloudWatch — monitoring, alerting, and observability</text>
        </g>
        <g onClick={() => toggle('IAM')} style={{ cursor:'pointer' }} opacity={hi('IAM')}>
          <rect x="140" y="360" width="480" height="24" rx="6" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth={sel==='IAM'?2:0.5}/>
          <text style={{ fontSize:10, fill:'#5F5E5A' }} x="380" y="372" textAnchor="middle" dominantBaseline="central">IAM — identity, access control, encryption at rest and in transit</text>
        </g>
      </svg>
    </DiagramPage>
  );
}

// ═══════════════════════════════════════
// SNOWFLAKE DIAGRAM
// ═══════════════════════════════════════
function SnowflakePage() {
  const [sel, setSel] = useState(null);
  const toggle = (k) => setSel(s => s === k ? null : k);
  const hi = (k) => sel === null ? 1 : sel === k ? 1 : 0.45;
  const diagram = DIAGRAMS[1];

  return (
    <DiagramPage diagram={diagram} selected={sel} infoDb={SNOW_INFO} onSelect={setSel} color="#4F6EF7">
      <svg width="100%" viewBox="0 0 680 520" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <defs><marker id="aw2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>

        {/* Snowflake container */}
        <rect x="130" y="15" width="400" height="370" rx="16" fill="#E6F1FB" stroke="#85B7EB" strokeWidth="0.5"/>
        <text style={{ fontSize:12, fill:'#185FA5' }} x="330" y="32" textAnchor="middle">Snowflake platform</text>

        {/* Sources */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="55" y="32" textAnchor="middle">SOURCES</text>
        {[['Databases',48],['SaaS apps',88],['Files / CSVs',128],['APIs / events',168]].map(([l,y]) => (
          <g key={l}><rect x="10" y={y} width="90" height="30" rx="6" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5"/><text style={{ fontSize:11, fontWeight:500, fill:'#1A1F36' }} x="55" y={y+15} textAnchor="middle" dominantBaseline="central">{l}</text></g>
        ))}
        <rect x="10" y="220" width="90" height="36" rx="8" fill="#FAECE7" stroke="#D85A30" strokeWidth="0.5"/>
        <text style={{ fontSize:11, fontWeight:500, fill:'#712B13' }} x="55" y="233" textAnchor="middle" dominantBaseline="central">Fivetran /</text>
        <text style={{ fontSize:10, fill:'#993C1D' }} x="55" y="247" textAnchor="middle" dominantBaseline="central">Airbyte</text>
        {[63,103,143,183].map((y,i) => <line key={i} x1="100" y1={y} x2="106" y2="238" stroke="#B4B2A9" strokeWidth="0.5" strokeDasharray="3 3"/>)}
        <line x1="100" y1="238" x2="128" y2="140" stroke="#D85A30" strokeWidth="0.5" markerEnd="url(#aw2)"/>

        {/* Bronze */}
        <rect x="140" y="40" width="105" height="260" rx="12" fill="#FAEEDA" stroke="#BA7517" strokeWidth="0.5"/>
        <text style={{ fontSize:13, fontWeight:500, fill:'#633806' }} x="192" y="58" textAnchor="middle">Bronze</text>
        <text style={{ fontSize:10, fill:'#854F0B' }} x="192" y="72" textAnchor="middle">Raw / staged</text>
        {[['Raw tables','1:1 source',85,'Raw tables'],['Snowpipe','Streaming',175,'Snowpipe'],['CDC logs','Streams',220,'CDC logs']].map(([t,s,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="148" y={y} width="88" height="35" rx="6" fill="#FAEEDA" stroke="#BA7517" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:11, fontWeight:500, fill:'#633806' }} x="192" y={y+13} textAnchor="middle" dominantBaseline="central">{t}</text>
            <text style={{ fontSize:10, fill:'#854F0B' }} x="192" y={y+26} textAnchor="middle" dominantBaseline="central">{s}</text>
          </g>
        ))}
        {/* Dynamic table - special styling */}
        <g onClick={() => toggle('Dynamic')} style={{ cursor:'pointer' }} opacity={hi('Dynamic')}>
          <rect x="148" y="130" width="88" height="35" rx="6" fill="#FFF3D6" stroke="#D4920A" strokeWidth={sel==='Dynamic'?2.5:1.5} strokeDasharray="4 2"/>
          <text style={{ fontSize:11, fontWeight:500, fill:'#633806' }} x="192" y="143" textAnchor="middle" dominantBaseline="central">Dynamic</text>
          <text style={{ fontSize:10, fill:'#854F0B' }} x="192" y="156" textAnchor="middle" dominantBaseline="central">Auto-refresh</text>
        </g>

        {/* dbt 1 */}
        <rect x="255" y="132" width="28" height="18" rx="4" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/>
        <text style={{ fontSize:9, fill:'#3C3489' }} x="269" y="141" textAnchor="middle" dominantBaseline="central">dbt</text>
        <line x1="236" y1="145" x2="253" y2="141" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw2)"/>
        <line x1="283" y1="141" x2="295" y2="141" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw2)"/>

        {/* Silver */}
        <rect x="260" y="40" width="105" height="260" rx="12" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/>
        <text style={{ fontSize:13, fontWeight:500, fill:'#04342C' }} x="312" y="58" textAnchor="middle">Silver</text>
        <text style={{ fontSize:10, fill:'#085041' }} x="312" y="72" textAnchor="middle">Cleaned</text>
        {[['Conformed','Cleaned dims',85,'Conformed'],['Fact tables','Event grain',175,'Fact tables'],['dbt tests','Quality gates',220,'dbt tests']].map(([t,s,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="268" y={y} width="88" height="35" rx="6" fill="#E1F5EE" stroke="#0F6E56" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:11, fontWeight:500, fill:'#04342C' }} x="312" y={y+13} textAnchor="middle" dominantBaseline="central">{t}</text>
            <text style={{ fontSize:10, fill:'#085041' }} x="312" y={y+26} textAnchor="middle" dominantBaseline="central">{s}</text>
          </g>
        ))}
        {/* Transient table - special styling */}
        <g onClick={() => toggle('Transient')} style={{ cursor:'pointer' }} opacity={hi('Transient')}>
          <rect x="268" y="130" width="88" height="35" rx="6" fill="#D0F0E4" stroke="#0A8A5C" strokeWidth={sel==='Transient'?2.5:1.5} strokeDasharray="4 2"/>
          <text style={{ fontSize:11, fontWeight:500, fill:'#04342C' }} x="312" y="143" textAnchor="middle" dominantBaseline="central">Transient</text>
          <text style={{ fontSize:10, fill:'#085041' }} x="312" y="156" textAnchor="middle" dominantBaseline="central">dbt intermediates</text>
        </g>

        {/* dbt 2 */}
        <rect x="375" y="175" width="28" height="18" rx="4" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/>
        <text style={{ fontSize:9, fill:'#3C3489' }} x="389" y="184" textAnchor="middle" dominantBaseline="central">dbt</text>
        <line x1="356" y1="184" x2="373" y2="184" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw2)"/>
        <line x1="403" y1="184" x2="415" y2="184" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw2)"/>

        {/* Gold */}
        <rect x="380" y="40" width="105" height="260" rx="12" fill="#EAF3DE" stroke="#3B6D11" strokeWidth="0.5"/>
        <text style={{ fontSize:13, fontWeight:500, fill:'#173404' }} x="432" y="58" textAnchor="middle">Gold</text>
        <text style={{ fontSize:10, fill:'#27500A' }} x="432" y="72" textAnchor="middle">Business-ready</text>
        {[['Metrics','KPIs / aggs',85,'Metrics'],['Semantic','Business terms',130,'Semantic'],['Data marts','Domain views',175,'Data marts']].map(([t,s,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="388" y={y} width="88" height="35" rx="6" fill="#EAF3DE" stroke="#3B6D11" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:11, fontWeight:500, fill:'#173404' }} x="432" y={y+13} textAnchor="middle" dominantBaseline="central">{t}</text>
            <text style={{ fontSize:10, fill:'#27500A' }} x="432" y={y+26} textAnchor="middle" dominantBaseline="central">{s}</text>
          </g>
        ))}
        {/* Hybrid table - special styling */}
        <g onClick={() => toggle('Hybrid')} style={{ cursor:'pointer' }} opacity={hi('Hybrid')}>
          <rect x="388" y="220" width="88" height="35" rx="6" fill="#D8EDCA" stroke="#2D7A0E" strokeWidth={sel==='Hybrid'?2.5:1.5} strokeDasharray="4 2"/>
          <text style={{ fontSize:11, fontWeight:500, fill:'#173404' }} x="432" y="233" textAnchor="middle" dominantBaseline="central">Hybrid</text>
          <text style={{ fontSize:10, fill:'#27500A' }} x="432" y="246" textAnchor="middle" dominantBaseline="central">OLTP serving</text>
        </g>

        {/* Consume */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="570" y="32" textAnchor="middle">CONSUME</text>
        {[['BI tools',52,'BI tools'],['Self-serve',96,'Self-serve'],['Reverse ETL',140,'Reverse ETL'],['ML / DS',184,'ML / DS'],['App layer',228,'App layer']].map(([l,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="530" y={y} width="90" height="30" rx="6" fill="#FBEAF0" stroke="#993556" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:11, fontWeight:500, fill:'#4B1528' }} x="575" y={y+15} textAnchor="middle" dominantBaseline="central">{l}</text>
          </g>
        ))}
        <line x1="476" y1="102" x2="528" y2="67" stroke="#993556" strokeWidth="0.5" markerEnd="url(#aw2)"/>
        <line x1="476" y1="147" x2="528" y2="111" stroke="#993556" strokeWidth="0.5" markerEnd="url(#aw2)"/>
        <line x1="476" y1="192" x2="528" y2="155" stroke="#993556" strokeWidth="0.5" markerEnd="url(#aw2)"/>
        <line x1="476" y1="210" x2="528" y2="199" stroke="#993556" strokeWidth="0.5" markerEnd="url(#aw2)"/>
        <line x1="476" y1="237" x2="528" y2="243" stroke="#993556" strokeWidth="0.5" markerEnd="url(#aw2)"/>

        {/* Bars */}
        <g onClick={() => toggle('Orchestration')} style={{ cursor:'pointer' }} opacity={hi('Orchestration')}>
          <rect x="140" y="318" width="345" height="22" rx="5" fill="#EEEDFE" stroke="#534AB7" strokeWidth={sel==='Orchestration'?2:0.5}/>
          <text style={{ fontSize:10, fill:'#3C3489' }} x="312" y="329" textAnchor="middle" dominantBaseline="central">dbt Cloud / Airflow — orchestration, scheduling, CI/CD</text>
        </g>
        <g onClick={() => toggle('Governance')} style={{ cursor:'pointer' }} opacity={hi('Governance')}>
          <rect x="140" y="348" width="345" height="22" rx="5" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth={sel==='Governance'?2:0.5}/>
          <text style={{ fontSize:10, fill:'#5F5E5A' }} x="312" y="359" textAnchor="middle" dominantBaseline="central">Governance — lineage, access control, PII tagging, masking</text>
        </g>

        {/* Legend */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="340" y="405" textAnchor="middle">SNOWFLAKE TABLE TYPES</text>
        <g><rect x="110" y="420" width="14" height="14" rx="3" fill="#FFF3D6" stroke="#D4920A" strokeWidth="1.5" strokeDasharray="4 2"/><text style={{ fontSize:11, fill:'#5F5E5A' }} x="130" y="430">Dynamic tables — declarative auto-refresh on raw data</text></g>
        <g><rect x="110" y="440" width="14" height="14" rx="3" fill="#D0F0E4" stroke="#0A8A5C" strokeWidth="1.5" strokeDasharray="4 2"/><text style={{ fontSize:11, fill:'#5F5E5A' }} x="130" y="450">Transient tables — persist dbt intermediates without fail-safe</text></g>
        <g><rect x="110" y="460" width="14" height="14" rx="3" fill="#D8EDCA" stroke="#2D7A0E" strokeWidth="1.5" strokeDasharray="4 2"/><text style={{ fontSize:11, fill:'#5F5E5A' }} x="130" y="470">Hybrid tables — OLTP serving with row-level locking</text></g>
      </svg>
    </DiagramPage>
  );
}

// ═══════════════════════════════════════
// AI DIAGRAM
// ═══════════════════════════════════════
function AIPage() {
  const [sel, setSel] = useState(null);
  const toggle = (k) => setSel(s => s === k ? null : k);
  const hi = (k) => sel === null ? 1 : sel === k ? 1 : 0.45;
  const diagram = DIAGRAMS[2];

  return (
    <DiagramPage diagram={diagram} selected={sel} infoDb={AI_INFO} onSelect={setSel} color="#8B5CF6">
      <svg width="100%" viewBox="0 0 680 470" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <defs><marker id="aw3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>

        {/* Sources */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="50" y="28" textAnchor="middle">SOURCES</text>
        {[['Databases',42,'Databases'],['Catalogs',80,'Catalogs'],['Dictionaries',118,'Dictionaries'],['BI tools',156,'BI tools'],['dbt models',194,'dbt models'],['API specs',232,'API specs']].map(([l,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="10" y={y} width="80" height="28" rx="6" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:11, fontWeight:500, fill:'#1A1F36' }} x="50" y={y+14} textAnchor="middle" dominantBaseline="central">{l}</text>
          </g>
        ))}
        {[56,94,132,170,208,246].map((y,i) => <line key={i} x1="90" y1={y} x2="118" y2={y < 150 ? 85 : 175} stroke="#B4B2A9" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

        {/* Agent Orchestrator */}
        <rect x="115" y="20" width="140" height="260" rx="14" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/>
        <text style={{ fontSize:12, fontWeight:500, fill:'#26215C' }} x="185" y="38" textAnchor="middle">Agent orchestrator</text>
        {[['Scanner','Crawl + discover',50,'Scanner'],['Mapper','Resolve + align',96,'Mapper'],['View builder','Generate views',142,'View builder'],['Skill builder','Create skills',188,'Skill builder'],['Validator','Test + verify',234,'Validator']].map(([t,s,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="125" y={y} width="120" height="35" rx="6" fill="#EEEDFE" stroke="#534AB7" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:11, fontWeight:500, fill:'#26215C' }} x="185" y={y+13} textAnchor="middle" dominantBaseline="central">{t}</text>
            <text style={{ fontSize:10, fill:'#3C3489' }} x="185" y={y+26} textAnchor="middle" dominantBaseline="central">{s}</text>
          </g>
        ))}
        {[85,131,177,223].map((y,i) => <line key={i} x1="185" y1={y} x2="185" y2={y+11} stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

        {/* Semantic Layer */}
        <rect x="280" y="20" width="120" height="260" rx="14" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/>
        <text style={{ fontSize:12, fontWeight:500, fill:'#04342C' }} x="340" y="38" textAnchor="middle">Semantic layer</text>
        {[['Semantic views','Business terms',50,'Semantic views'],['Skills library','Query templates',96,'Skills library'],['Metric catalog','KPI defs',142,'Metric catalog'],['Guardrails','Access + cost',188,'Guardrails'],['Context index','Embeddings',234,'Context index']].map(([t,s,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="288" y={y} width="104" height="35" rx="6" fill="#E1F5EE" stroke="#0F6E56" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:11, fontWeight:500, fill:'#04342C' }} x="340" y={y+13} textAnchor="middle" dominantBaseline="central">{t}</text>
            <text style={{ fontSize:10, fill:'#085041' }} x="340" y={y+26} textAnchor="middle" dominantBaseline="central">{s}</text>
          </g>
        ))}
        {[67,113,159,205,251].map((y,i) => <line key={i} x1="245" y1={y} x2="286" y2={y} stroke="#0F6E56" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

        {/* LLM Consumers */}
        <rect x="425" y="20" width="120" height="260" rx="14" fill="#FAECE7" stroke="#D85A30" strokeWidth="0.5"/>
        <text style={{ fontSize:12, fontWeight:500, fill:'#712B13' }} x="485" y="38" textAnchor="middle">LLM consumers</text>
        {[['Chatbot','NL to insight',50,'Chatbot'],['BI copilot','In-tool assist',96,'BI copilot'],['Report agent','Auto-generate',142,'Report agent'],['Anomaly agent','Monitor + alert',188,'Anomaly agent'],['Any LLM','Claude / GPT',234,'Any LLM']].map(([t,s,y,k]) => (
          <g key={k} onClick={() => toggle(k)} style={{ cursor:'pointer' }} opacity={hi(k)}>
            <rect x="433" y={y} width="104" height="35" rx="6" fill="#FAECE7" stroke="#D85A30" strokeWidth={sel===k?2:0.5}/>
            <text style={{ fontSize:11, fontWeight:500, fill:'#712B13' }} x="485" y={y+13} textAnchor="middle" dominantBaseline="central">{t}</text>
            <text style={{ fontSize:10, fill:'#993C1D' }} x="485" y={y+26} textAnchor="middle" dominantBaseline="central">{s}</text>
          </g>
        ))}
        {[67,113,159,205,251].map((y,i) => <line key={i} x1="392" y1={y} x2="431" y2={y} stroke="#D85A30" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

        {/* Users */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="610" y="28" textAnchor="middle">USERS</text>
        {[['C-suite',50],['Analysts',96],['Teams',142],['Ops',188],['Apps',234]].map(([l,y]) => (
          <g key={l}><rect x="575" y={y} width="60" height="35" rx="6" fill="#EAF3DE" stroke="#3B6D11" strokeWidth="0.5"/><text style={{ fontSize:11, fontWeight:500, fill:'#173404' }} x="605" y={y+17} textAnchor="middle" dominantBaseline="central">{l}</text></g>
        ))}
        {[67,113,159,205,251].map((y,i) => <line key={i} x1="537" y1={y} x2="573" y2={y} stroke="#3B6D11" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

        {/* Feedback */}
        <g onClick={() => toggle('Feedback')} style={{ cursor:'pointer' }} opacity={hi('Feedback')}>
          <path d="M605 272 L605 305 L185 305 L185 272" fill="none" stroke="#B4B2A9" strokeWidth="0.5" strokeDasharray="4 3" markerEnd="url(#aw3)"/>
          <text style={{ fontSize:10, fill:'#8792A8' }} x="390" y="300" textAnchor="middle">Feedback loop — user corrections refine views + skills</text>
        </g>

        {/* MCP */}
        <g onClick={() => toggle('MCP')} style={{ cursor:'pointer' }} opacity={hi('MCP')}>
          <rect x="280" y="320" width="265" height="22" rx="5" fill="#E6F1FB" stroke="#85B7EB" strokeWidth={sel==='MCP'?2:0.5}/>
          <text style={{ fontSize:10, fill:'#185FA5' }} x="412" y="331" textAnchor="middle" dominantBaseline="central">MCP / tool use — universal LLM interface</text>
        </g>

        {/* Governance */}
        <g onClick={() => toggle('Governance')} style={{ cursor:'pointer' }} opacity={hi('Governance')}>
          <rect x="115" y="350" width="430" height="22" rx="5" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth={sel==='Governance'?2:0.5}/>
          <text style={{ fontSize:10, fill:'#5F5E5A' }} x="330" y="361" textAnchor="middle" dominantBaseline="central">Governance — RBAC, PII masking, query cost limits, audit trail</text>
        </g>

        {/* Key principle */}
        <text style={{ fontSize:11, fill:'#8792A8', letterSpacing:'.06em' }} x="340" y="400" textAnchor="middle">KEY DESIGN PRINCIPLE</text>
        <text style={{ fontSize:12, fill:'#1A1F36' }} x="340" y="418" textAnchor="middle">Agents build the semantic layer once — any LLM consumes it</text>
        <text style={{ fontSize:12, fill:'#1A1F36' }} x="340" y="435" textAnchor="middle">No LLM writes raw SQL against production tables directly</text>
      </svg>
    </DiagramPage>
  );
}

// ═══════════════════════════════════════
// APP ROUTER
// ═══════════════════════════════════════
export default function App() {
  const route = useRoute();
  if (route === 'aws') return <AWSPage />;
  if (route === 'snowflake') return <SnowflakePage />;
  if (route === 'ai-analytics') return <AIPage />;
  return <Landing />;
}
