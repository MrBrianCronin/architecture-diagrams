import React, { useState, useEffect } from 'react';

const DISCLAIMER = 'These architecture diagrams represent design patterns and approaches I am experienced with. They are illustrative examples created for this portfolio and do not represent the actual implementation or intellectual property of any current or former employer.';
const CARD_DISCLAIMER = 'Illustrative design pattern — not based on any company\'s actual architecture';

const DIAGRAMS = [
  { id: 'aws', title: 'AWS native event-driven platform', tag: 'Cloud Architecture', tagColor: '#F59E0B', desc: 'Event-driven data platform using API Gateway, EventBridge, Kinesis, Lambda, AWS Glue, and a multi-store persistence layer feeding downstream consumers.', icon: '☁️' },
  { id: 'snowflake', title: 'Snowflake + dbt modern data stack', tag: 'Data Engineering', tagColor: '#4F6EF7', desc: 'Medallion architecture with bronze/silver/gold layers, showcasing dynamic tables, transient tables for dbt intermediates, and hybrid tables for OLTP serving.', icon: '❄️' },
  { id: 'ai-analytics', title: 'AI-driven conversational analytics', tag: 'Agentic AI', tagColor: '#8B5CF6', desc: 'Agent orchestration that scans data sources to auto-generate semantic views and callable skills, consumed by any LLM through MCP or tool-use protocols.', icon: '🤖' },
];

function useRoute() {
  const [hash, setHash] = useState(window.location.hash.slice(1) || '');
  useEffect(() => {
    const handler = () => setHash(window.location.hash.slice(1) || '');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash;
}

// ── Shared styles ──
const S = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFBFD', fontFamily: "'DM Sans', sans-serif", color: '#1A1F36' },
  header: { background: '#fff', borderBottom: '1px solid #E2E6EF', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 12 },
  back: { fontSize: 12, color: '#8792A8', textDecoration: 'none', fontWeight: 500, marginRight: 4 },
  logo: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: "'Outfit', sans-serif" },
  h1: { fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", lineHeight: 1.1 },
  sub: { fontSize: 12, color: '#8792A8', marginTop: 2 },
  main: { flex: 1, padding: 32, maxWidth: 1200, width: '100%', margin: '0 auto' },
  footer: { background: '#fff', borderTop: '1px solid #E2E6EF', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: 12, color: '#8792A8' },
};

function Header({ showBack }) {
  return (
    <header style={S.header}>
      {showBack ? (
        <a href="#" style={S.back}>← All diagrams</a>
      ) : (
        <a href="/" style={S.back}>← briancronin.ai</a>
      )}
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

// ── Landing page ──
function Landing() {
  return (
    <div style={S.page}>
      <Header />
      <main style={S.main}>
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

// ── Diagram detail page wrapper ──
function DiagramPage({ diagram, children }) {
  return (
    <div style={S.page}>
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
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E6EF', padding: 24, marginBottom: 20 }}>
          {children}
        </div>
        <p style={{ fontSize: 12, color: '#8792A8', textAlign: 'center', fontStyle: 'italic' }}>{CARD_DISCLAIMER}</p>
        <p style={{ fontSize: 12, color: '#8792A8', textAlign: 'center', marginTop: 6 }}>Click any component to learn more about its role in this architecture pattern.</p>
      </main>
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════
// AWS DIAGRAM
// ═══════════════════════════════════════
function AWSDigram() {
  return (
    <svg width="100%" viewBox="0 0 680 520" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <defs><marker id="aw" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>

      <text style={{ fontSize:14, fontWeight:500, fill:'var(--color-text-primary,#1A1F36)' }} x="340" y="20" textAnchor="middle">AWS native event-driven data platform</text>

      {/* AWS container */}
      <rect x="120" y="35" width="550" height="400" rx="16" fill="var(--color-background-info, #E6F1FB)" stroke="var(--color-border-info, #85B7EB)" strokeWidth="0.5"/>
      <text style={{ fontSize:12, fill:'var(--color-text-info, #185FA5)' }} x="395" y="52" textAnchor="middle">AWS cloud</text>

      {/* Sources */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="55" y="52" textAnchor="middle">SOURCES</text>
      {[['Core apps',72],['Partners',122],['User events',172],['File feeds',222]].map(([l,y]) => (
        <g key={l}><rect x="15" y={y} width="85" height="38" rx="8" fill="var(--color-background-secondary,#F1EFE8)" stroke="var(--color-border-tertiary,#B4B2A9)" strokeWidth="0.5"/><text style={{ fontSize:13, fontWeight:500, fill:'var(--color-text-primary,#1A1F36)' }} x="57" y={y+19} textAnchor="middle" dominantBaseline="central">{l}</text></g>
      ))}

      {/* Ingest */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="175" y="52" textAnchor="middle">INGEST</text>
      <rect x="130" y="105" width="90" height="50" rx="8" fill="#FAECE7" stroke="#D85A30" strokeWidth="0.5"/>
      <text style={{ fontSize:13, fontWeight:500, fill:'#712B13' }} x="175" y="123" textAnchor="middle" dominantBaseline="central">API</text>
      <text style={{ fontSize:11, fill:'#993C1D' }} x="175" y="141" textAnchor="middle" dominantBaseline="central">Gateway</text>
      <rect x="130" y="205" width="90" height="50" rx="8" fill="#FAECE7" stroke="#D85A30" strokeWidth="0.5"/>
      <text style={{ fontSize:13, fontWeight:500, fill:'#712B13' }} x="175" y="223" textAnchor="middle" dominantBaseline="central">S3</text>
      <text style={{ fontSize:11, fill:'#993C1D' }} x="175" y="241" textAnchor="middle" dominantBaseline="central">Landing zone</text>

      {/* Source arrows */}
      {[[100,91,128,120],[100,141,128,133],[100,191,128,140],[100,241,128,230]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-border-secondary,#B4B2A9)" strokeWidth="1" markerEnd="url(#aw)"/>
      ))}

      {/* Route & Process */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="295" y="52" textAnchor="middle">ROUTE</text>
      {[['EventBridge','Event routing',75],['Kinesis','Streaming',140],['AWS Glue','ETL + catalog',205]].map(([t,s,y]) => (
        <g key={t}><rect x="250" y={y} width="90" height="50" rx="8" fill="#FAEEDA" stroke="#BA7517" strokeWidth="0.5"/><text style={{ fontSize:13, fontWeight:500, fill:'#633806' }} x="295" y={y+18} textAnchor="middle" dominantBaseline="central">{t}</text><text style={{ fontSize:11, fill:'#854F0B' }} x="295" y={y+36} textAnchor="middle" dominantBaseline="central">{s}</text></g>
      ))}
      {/* Ingest to route */}
      <line x1="220" y1="120" x2="248" y2="100" stroke="#BA7517" strokeWidth="0.5" markerEnd="url(#aw)"/>
      <line x1="220" y1="135" x2="248" y2="160" stroke="#BA7517" strokeWidth="0.5" markerEnd="url(#aw)"/>
      <line x1="220" y1="230" x2="248" y2="230" stroke="#BA7517" strokeWidth="0.5" markerEnd="url(#aw)"/>

      {/* Compute */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="415" y="52" textAnchor="middle">COMPUTE</text>
      {[['Lambda','Transform',75],['Lambda','Validate',140],['Step Fns','Orchestrate',205]].map(([t,s,y]) => (
        <g key={t+y}><rect x="370" y={y} width="90" height="50" rx="8" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/><text style={{ fontSize:13, fontWeight:500, fill:'#26215C' }} x="415" y={y+18} textAnchor="middle" dominantBaseline="central">{t}</text><text style={{ fontSize:11, fill:'#3C3489' }} x="415" y={y+36} textAnchor="middle" dominantBaseline="central">{s}</text></g>
      ))}
      {[[340,100,368,100],[340,165,368,165],[340,230,368,230]].map(([x1,y1,x2,y2],i) => (
        <line key={'c'+i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw)"/>
      ))}

      {/* Store */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="535" y="52" textAnchor="middle">STORE</text>
      {[['S3 lake','Raw + processed',75],['DynamoDB','Key-value',140],['Redshift','Warehouse',205]].map(([t,s,y]) => (
        <g key={t}><rect x="490" y={y} width="90" height="50" rx="8" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/><text style={{ fontSize:13, fontWeight:500, fill:'#04342C' }} x="535" y={y+18} textAnchor="middle" dominantBaseline="central">{t}</text><text style={{ fontSize:11, fill:'#085041' }} x="535" y={y+36} textAnchor="middle" dominantBaseline="central">{s}</text></g>
      ))}
      {[[460,100,488,100],[460,165,488,165],[460,230,488,230]].map(([x1,y1,x2,y2],i) => (
        <line key={'s'+i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0F6E56" strokeWidth="0.5" markerEnd="url(#aw)"/>
      ))}

      {/* Consumption */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="395" y="290" textAnchor="middle">CONSUMPTION</text>
      {[['APIs',140],['Dashboards',260],['ML models',380],['Downstream',500]].map(([l,x]) => (
        <g key={l}><rect x={x} y={300} width={l==='Downstream'?110:100} height="38" rx="8" fill="#EAF3DE" stroke="#3B6D11" strokeWidth="0.5"/><text style={{ fontSize:13, fontWeight:500, fill:'#173404' }} x={x+(l==='Downstream'?55:50)} y={319} textAnchor="middle" dominantBaseline="central">{l}</text></g>
      ))}
      {[[535,125,190,298],[535,190,310,298],[535,255,430,298],[580,255,555,298]].map(([x1,y1,x2,y2],i) => (
        <line key={'d'+i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3B6D11" strokeWidth="0.5" markerEnd="url(#aw)"/>
      ))}

      {/* CloudWatch */}
      <rect x="140" y="360" width="480" height="26" rx="6" fill="#FBEAF0" stroke="#993556" strokeWidth="0.5"/>
      <text style={{ fontSize:11, fill:'#4B1528' }} x="380" y="373" textAnchor="middle" dominantBaseline="central">CloudWatch — monitoring, alerting, and observability across all services</text>
      {/* IAM */}
      <rect x="140" y="395" width="480" height="26" rx="6" fill="var(--color-background-secondary,#F1EFE8)" stroke="var(--color-border-tertiary,#B4B2A9)" strokeWidth="0.5"/>
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#5F5E5A)' }} x="380" y="408" textAnchor="middle" dominantBaseline="central">IAM — identity, access control, encryption at rest and in transit</text>
    </svg>
  );
}

// ═══════════════════════════════════════
// SNOWFLAKE DIAGRAM
// ═══════════════════════════════════════
function SnowflakeDiagram() {
  return (
    <svg width="100%" viewBox="0 0 680 560" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <defs><marker id="aw2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>

      <text style={{ fontSize:14, fontWeight:500, fill:'var(--color-text-primary,#1A1F36)' }} x="340" y="20" textAnchor="middle">Snowflake + dbt modern data stack</text>

      {/* Snowflake container */}
      <rect x="130" y="35" width="400" height="395" rx="16" fill="var(--color-background-info,#E6F1FB)" stroke="var(--color-border-info,#85B7EB)" strokeWidth="0.5"/>
      <text style={{ fontSize:12, fill:'var(--color-text-info,#185FA5)' }} x="330" y="52" textAnchor="middle">Snowflake platform</text>

      {/* Sources */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="55" y="52" textAnchor="middle">SOURCES</text>
      {[['Databases',72],['SaaS apps',118],['Files / CSVs',164],['APIs / events',210]].map(([l,y]) => (
        <g key={l}><rect x="10" y={y} width="90" height="34" rx="8" fill="var(--color-background-secondary,#F1EFE8)" stroke="var(--color-border-tertiary,#B4B2A9)" strokeWidth="0.5"/><text style={{ fontSize:12, fontWeight:500, fill:'var(--color-text-primary,#1A1F36)' }} x="55" y={y+17} textAnchor="middle" dominantBaseline="central">{l}</text></g>
      ))}
      <rect x="10" y="270" width="90" height="38" rx="8" fill="#FAECE7" stroke="#D85A30" strokeWidth="0.5"/>
      <text style={{ fontSize:12, fontWeight:500, fill:'#712B13' }} x="55" y="284" textAnchor="middle" dominantBaseline="central">Fivetran /</text>
      <text style={{ fontSize:11, fill:'#993C1D' }} x="55" y="298" textAnchor="middle" dominantBaseline="central">Airbyte</text>

      {/* Leader lines */}
      {[89,135,181,227].map((y,i) => <line key={i} x1="100" y1={y} x2="106" y2="289" stroke="var(--color-border-tertiary,#B4B2A9)" strokeWidth="0.5" strokeDasharray="3 3"/>)}
      <line x1="100" y1="289" x2="128" y2="165" stroke="#D85A30" strokeWidth="0.5" markerEnd="url(#aw2)"/>

      {/* Bronze */}
      <rect x="140" y="60" width="105" height="280" rx="12" fill="#FAEEDA" stroke="#BA7517" strokeWidth="0.5"/>
      <text style={{ fontSize:13, fontWeight:500, fill:'#633806' }} x="192" y="80" textAnchor="middle">Bronze</text>
      <text style={{ fontSize:11, fill:'#854F0B' }} x="192" y="95" textAnchor="middle">Raw / staged</text>
      {[['Raw tables','1:1 source',110],['Dynamic','Auto-refresh',158],['Snowpipe','Streaming',210],['CDC logs','Streams',258]].map(([t,s,y]) => (
        <g key={t}><rect x="148" y={y} width="88" height="38" rx="6" fill="#FAEEDA" stroke="#BA7517" strokeWidth="0.5"/><text style={{ fontSize:12, fontWeight:500, fill:'#633806' }} x="192" y={y+14} textAnchor="middle" dominantBaseline="central">{t}</text><text style={{ fontSize:10, fill:'#854F0B' }} x="192" y={y+28} textAnchor="middle" dominantBaseline="central">{s}</text></g>
      ))}

      {/* dbt marker 1 */}
      <rect x="255" y="155" width="28" height="20" rx="4" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/>
      <text style={{ fontSize:10, fill:'#3C3489' }} x="269" y="165" textAnchor="middle" dominantBaseline="central">dbt</text>
      <line x1="236" y1="172" x2="253" y2="165" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw2)"/>
      <line x1="283" y1="165" x2="295" y2="165" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw2)"/>

      {/* Silver */}
      <rect x="260" y="60" width="105" height="280" rx="12" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/>
      <text style={{ fontSize:13, fontWeight:500, fill:'#04342C' }} x="312" y="80" textAnchor="middle">Silver</text>
      <text style={{ fontSize:11, fill:'#085041' }} x="312" y="95" textAnchor="middle">Cleaned</text>
      {[['Conformed','Cleaned dims',110],['Transient','dbt intermediates',158],['Fact tables','Event grain',210],['dbt tests','Quality gates',258]].map(([t,s,y]) => (
        <g key={t}><rect x="268" y={y} width="88" height="38" rx="6" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/><text style={{ fontSize:12, fontWeight:500, fill:'#04342C' }} x="312" y={y+14} textAnchor="middle" dominantBaseline="central">{t}</text><text style={{ fontSize:10, fill:'#085041' }} x="312" y={y+28} textAnchor="middle" dominantBaseline="central">{s}</text></g>
      ))}

      {/* dbt marker 2 */}
      <rect x="375" y="200" width="28" height="20" rx="4" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/>
      <text style={{ fontSize:10, fill:'#3C3489' }} x="389" y="210" textAnchor="middle" dominantBaseline="central">dbt</text>
      <line x1="356" y1="210" x2="373" y2="210" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw2)"/>
      <line x1="403" y1="210" x2="415" y2="210" stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw2)"/>

      {/* Gold */}
      <rect x="380" y="60" width="105" height="280" rx="12" fill="#EAF3DE" stroke="#3B6D11" strokeWidth="0.5"/>
      <text style={{ fontSize:13, fontWeight:500, fill:'#173404' }} x="432" y="80" textAnchor="middle">Gold</text>
      <text style={{ fontSize:11, fill:'#27500A' }} x="432" y="95" textAnchor="middle">Business-ready</text>
      {[['Metrics','KPIs / aggs',110],['Semantic','Business terms',158],['Data marts','Domain views',210],['Hybrid','OLTP serving',258]].map(([t,s,y]) => (
        <g key={t}><rect x="388" y={y} width="88" height="38" rx="6" fill="#EAF3DE" stroke="#3B6D11" strokeWidth="0.5"/><text style={{ fontSize:12, fontWeight:500, fill:'#173404' }} x="432" y={y+14} textAnchor="middle" dominantBaseline="central">{t}</text><text style={{ fontSize:10, fill:'#27500A' }} x="432" y={y+28} textAnchor="middle" dominantBaseline="central">{s}</text></g>
      ))}

      {/* Consume */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="570" y="52" textAnchor="middle">CONSUME</text>
      {[['BI tools',72],['Self-serve',122],['Reverse ETL',172],['ML / DS',222],['App layer',272]].map(([l,y]) => (
        <g key={l}><rect x="530" y={y} width="90" height="34" rx="8" fill="#FBEAF0" stroke="#993556" strokeWidth="0.5"/><text style={{ fontSize:12, fontWeight:500, fill:'#4B1528' }} x="575" y={y+17} textAnchor="middle" dominantBaseline="central">{l}</text></g>
      ))}

      {/* Gold to consume arrows */}
      {[[476,129,528,89],[476,177,528,139],[476,229,528,189],[476,248,528,239],[476,277,528,289]].map(([x1,y1,x2,y2],i) => (
        <line key={'g'+i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#993556" strokeWidth="0.5" markerEnd="url(#aw2)"/>
      ))}

      {/* Orchestration + governance bars */}
      <rect x="140" y="358" width="345" height="22" rx="5" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/>
      <text style={{ fontSize:10, fill:'#3C3489' }} x="312" y="369" textAnchor="middle" dominantBaseline="central">dbt Cloud / Airflow — orchestration, scheduling, CI/CD</text>
      <rect x="140" y="388" width="345" height="22" rx="5" fill="var(--color-background-secondary,#F1EFE8)" stroke="var(--color-border-tertiary,#B4B2A9)" strokeWidth="0.5"/>
      <text style={{ fontSize:10, fill:'var(--color-text-secondary,#5F5E5A)' }} x="312" y="399" textAnchor="middle" dominantBaseline="central">Governance — lineage, access control, PII tagging, masking</text>

      {/* Legend */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="340" y="440" textAnchor="middle">SNOWFLAKE TABLE TYPES HIGHLIGHTED</text>
      {[['#FAEEDA','#BA7517','Dynamic tables — declarative auto-refresh overlays on raw data',455],['#E1F5EE','#0F6E56','Transient tables — persist dbt intermediates without fail-safe overhead',475],['#EAF3DE','#3B6D11','Hybrid tables — OLTP serving with row-level locking for app workloads',495]].map(([f,s,t,y]) => (
        <g key={y}><rect x="110" y={y} width="12" height="12" rx="3" fill={f} stroke={s} strokeWidth="0.5"/><text style={{ fontSize:11, fill:'var(--color-text-secondary,#5F5E5A)' }} x="128" y={y+10}>{t}</text></g>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════
// AI ANALYTICS DIAGRAM
// ═══════════════════════════════════════
function AIDiagram() {
  return (
    <svg width="100%" viewBox="0 0 680 560" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <defs><marker id="aw3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>

      <text style={{ fontSize:14, fontWeight:500, fill:'var(--color-text-primary,#1A1F36)' }} x="340" y="20" textAnchor="middle">AI-driven conversational analytics</text>

      {/* Sources */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="50" y="50" textAnchor="middle">SOURCES</text>
      {[['Databases',65],['Catalogs',107],['Dictionaries',149],['BI tools',191],['dbt models',233],['API specs',275]].map(([l,y]) => (
        <g key={l}><rect x="10" y={y} width="80" height="32" rx="6" fill="var(--color-background-secondary,#F1EFE8)" stroke="var(--color-border-tertiary,#B4B2A9)" strokeWidth="0.5"/><text style={{ fontSize:11, fontWeight:500, fill:'var(--color-text-primary,#1A1F36)' }} x="50" y={y+16} textAnchor="middle" dominantBaseline="central">{l}</text></g>
      ))}

      {/* Source arrows */}
      {[81,123,165,207,249,291].map((y,i) => <line key={i} x1="90" y1={y} x2="118" y2={y < 180 ? 100 : 200} stroke="var(--color-border-secondary,#B4B2A9)" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

      {/* Agent Orchestrator */}
      <rect x="115" y="40" width="140" height="290" rx="14" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/>
      <text style={{ fontSize:13, fontWeight:500, fill:'#26215C' }} x="185" y="58" textAnchor="middle">Agent orchestrator</text>
      {[['Scanner','Crawl + discover',70],['Mapper','Resolve + align',120],['View builder','Generate views',170],['Skill builder','Create skills',220],['Validator','Test + verify',270]].map(([t,s,y]) => (
        <g key={t}><rect x="125" y={y} width="120" height="38" rx="6" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5"/><text style={{ fontSize:12, fontWeight:500, fill:'#26215C' }} x="185" y={y+14} textAnchor="middle" dominantBaseline="central">{t}</text><text style={{ fontSize:10, fill:'#3C3489' }} x="185" y={y+28} textAnchor="middle" dominantBaseline="central">{s}</text></g>
      ))}
      {[108,158,208,258].map((y,i) => <line key={i} x1="185" y1={y} x2="185" y2={y+12} stroke="#534AB7" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

      {/* Semantic Layer */}
      <rect x="280" y="40" width="120" height="290" rx="14" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/>
      <text style={{ fontSize:13, fontWeight:500, fill:'#04342C' }} x="340" y="58" textAnchor="middle">Semantic layer</text>
      {[['Semantic views','Business terms',70],['Skills library','Query templates',120],['Metric catalog','KPI defs',170],['Guardrails','Access + cost',220],['Context index','Embeddings',270]].map(([t,s,y]) => (
        <g key={t}><rect x="288" y={y} width="104" height="38" rx="6" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5"/><text style={{ fontSize:12, fontWeight:500, fill:'#04342C' }} x="340" y={y+14} textAnchor="middle" dominantBaseline="central">{t}</text><text style={{ fontSize:10, fill:'#085041' }} x="340" y={y+28} textAnchor="middle" dominantBaseline="central">{s}</text></g>
      ))}

      {/* Agent to semantic arrows */}
      {[89,139,189,239,289].map((y,i) => <line key={i} x1="245" y1={y} x2="286" y2={y} stroke="#0F6E56" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

      {/* LLM Consumers */}
      <rect x="425" y="40" width="120" height="290" rx="14" fill="#FAECE7" stroke="#D85A30" strokeWidth="0.5"/>
      <text style={{ fontSize:13, fontWeight:500, fill:'#712B13' }} x="485" y="58" textAnchor="middle">LLM consumers</text>
      {[['Chatbot','NL to insight',70],['BI copilot','In-tool assist',120],['Report agent','Auto-generate',170],['Anomaly agent','Monitor + alert',220],['Any LLM','Claude / GPT',270]].map(([t,s,y]) => (
        <g key={t}><rect x="433" y={y} width="104" height="38" rx="6" fill="#FAECE7" stroke="#D85A30" strokeWidth="0.5"/><text style={{ fontSize:12, fontWeight:500, fill:'#712B13' }} x="485" y={y+14} textAnchor="middle" dominantBaseline="central">{t}</text><text style={{ fontSize:10, fill:'#993C1D' }} x="485" y={y+28} textAnchor="middle" dominantBaseline="central">{s}</text></g>
      ))}

      {/* Semantic to LLM arrows */}
      {[89,139,189,239,289].map((y,i) => <line key={i} x1="392" y1={y} x2="431" y2={y} stroke="#D85A30" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

      {/* End Users */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="605" y="50" textAnchor="middle">USERS</text>
      {[['C-suite',70],['Analysts',120],['Teams',170],['Ops',220],['Apps',270]].map(([l,y]) => (
        <g key={l}><rect x="570" y={y} width="60" height="38" rx="6" fill="#EAF3DE" stroke="#3B6D11" strokeWidth="0.5"/><text style={{ fontSize:12, fontWeight:500, fill:'#173404' }} x="600" y={y+19} textAnchor="middle" dominantBaseline="central">{l}</text></g>
      ))}

      {/* LLM to user arrows */}
      {[89,139,189,239,289].map((y,i) => <line key={i} x1="537" y1={y} x2="568" y2={y} stroke="#3B6D11" strokeWidth="0.5" markerEnd="url(#aw3)"/>)}

      {/* Feedback loop */}
      <path d="M600 310 L600 345 L185 345 L185 312" fill="none" stroke="var(--color-border-secondary,#B4B2A9)" strokeWidth="0.5" strokeDasharray="4 3" markerEnd="url(#aw3)"/>
      <text style={{ fontSize:10, fill:'var(--color-text-secondary,#8792A8)' }} x="390" y="340" textAnchor="middle">Feedback loop — user corrections refine views + skills</text>

      {/* MCP bar */}
      <rect x="280" y="365" width="265" height="22" rx="5" fill="var(--color-background-info,#E6F1FB)" stroke="var(--color-border-info,#85B7EB)" strokeWidth="0.5"/>
      <text style={{ fontSize:10, fill:'var(--color-text-info,#185FA5)' }} x="412" y="376" textAnchor="middle" dominantBaseline="central">MCP / tool use — universal LLM interface</text>

      {/* Governance */}
      <rect x="115" y="395" width="430" height="22" rx="5" fill="var(--color-background-secondary,#F1EFE8)" stroke="var(--color-border-tertiary,#B4B2A9)" strokeWidth="0.5"/>
      <text style={{ fontSize:10, fill:'var(--color-text-secondary,#5F5E5A)' }} x="330" y="406" textAnchor="middle" dominantBaseline="central">Governance — RBAC, PII masking, query cost limits, audit trail</text>

      {/* Key principle */}
      <text style={{ fontSize:11, fill:'var(--color-text-secondary,#8792A8)', letterSpacing:'.06em' }} x="340" y="445" textAnchor="middle">KEY DESIGN PRINCIPLE</text>
      <text style={{ fontSize:12, fill:'var(--color-text-primary,#1A1F36)' }} x="340" y="465" textAnchor="middle">Agents build the semantic layer once — any LLM consumes it</text>
      <text style={{ fontSize:12, fill:'var(--color-text-primary,#1A1F36)' }} x="340" y="482" textAnchor="middle">No LLM writes raw SQL against production tables directly</text>
    </svg>
  );
}

// ═══════════════════════════════════════
// APP ROUTER
// ═══════════════════════════════════════
export default function App() {
  const route = useRoute();
  const diagram = DIAGRAMS.find(d => d.id === route);

  if (!diagram) return <Landing />;

  return (
    <DiagramPage diagram={diagram}>
      {route === 'aws' && <AWSDigram />}
      {route === 'snowflake' && <SnowflakeDiagram />}
      {route === 'ai-analytics' && <AIDiagram />}
    </DiagramPage>
  );
}
