import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';

const hazards = [
  {
    element: 'Lead (Pb)',
    sources: 'Cathode Ray Tubes (CRTs), Printed Circuit Board Solders, Lead-Acid Batteries',
    risk: 'Severe nervous system and kidney damage; irreversible cognitive impairment in children when exposed via airborne dust or groundwater leaching.',
    severity: 'High Toxicity',
    color: '#ef4444'
  },
  {
    element: 'Mercury (Hg)',
    sources: 'Fluorescent display backlights, flat panel switches, legacy relays',
    risk: 'Bioaccumulates in brain and kidney tissues. Chronic neurological tremors and sensory impairment from vapor inhalation during glass breaking.',
    severity: 'Critical Hazard',
    color: '#dc2626'
  },
  {
    element: 'Cadmium (Cd)',
    sources: 'SMD chip resistors, infrared detectors, older Ni-Cd rechargeable batteries',
    risk: 'Severe lung damage upon inhalation, irreversible kidney tubular dysfunction, and osteomalacia (bone brittleness).',
    severity: 'Carcinogen',
    color: '#b91c1c'
  },
  {
    element: 'Brominated Retardants & Dioxins',
    sources: 'Plastic casing burnings, PVC insulation open-air cable stripping',
    risk: 'Extremely potent cancer-causing endocrine disruptors generated when plastic is burned in open scrap yard bonfires.',
    severity: 'Extreme Danger',
    color: '#991b1b'
  }
];

const SafetyGuide = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-page)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '4rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="shimmer-badge" style={{ marginBottom: '1rem' }}>
              <span className="live-pulse-dot" />
              <span>Occupational Health & Toxic Hazard Reduction</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.65rem', letterSpacing: '-0.02em' }}>
              Safe E-Waste <span className="gradient-text">Handling Protocols</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Informal scrap workers are on the front lines of electronic resource recovery. Unscientific dismantling, open-air acid baths, and wire burning pose deadly health hazards to workers and their families. Follow these certified safety mandates.
            </p>
          </div>

          {/* DOs & DON'Ts Visual Comparison Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
            {/* Strict Prohibitions */}
            <div
              className="card"
              style={{
                backgroundColor: '#fffdfd',
                borderColor: '#fca5a5',
                padding: '2.25rem',
                borderRadius: 'var(--radius-xl)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                  Hazardous Practices (Never Do)
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.1rem', fontSize: '0.92rem', color: '#475569' }}>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.1rem' }}>✗</span>
                  <span><strong>Never Burn Copper Wires:</strong> Open fires release chlorinated dioxins and toxic fumes that cause lung damage. Sell wires whole to mechanical strippers.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.1rem' }}>✗</span>
                  <span><strong>No Home Acid Leaching:</strong> Never immerse motherboards in nitric or cyanide acid baths in residential areas. Acid fumes cause blindness and asthma.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.1rem' }}>✗</span>
                  <span><strong>Never Puncture Lithium Batteries:</strong> Crushing laptop or phone batteries causes instant violent fireballs and toxic hydrofluoric gas release.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '1.1rem' }}>✗</span>
                  <span><strong>Never Smash CRT Glass or Tubes:</strong> Breaches vacuum and disperses airborne lead and phosphor dust directly into nasal airways.</span>
                </li>
              </ul>
            </div>

            {/* Mandatory Protocols */}
            <div
              className="card"
              style={{
                backgroundColor: '#fbfdfc',
                borderColor: 'var(--color-brand-400)',
                padding: '2.25rem',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-brand-glow)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--primary-100)',
                    color: 'var(--primary-800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)', margin: 0 }}>
                  Mandatory Safe Practices
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.1rem', fontSize: '0.92rem', color: '#172018' }}>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#059669', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                  <span><strong>Keep Materials Intact:</strong> Supply whole motherboards, cables, and electronics to certified buyers for higher cash value.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#059669', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                  <span><strong>Isolate Battery Scrap:</strong> Store lithium and lead batteries in dry, well-ventilated plastic crates away from direct sunlight and metal scrap.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#059669', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                  <span><strong>Wear Cut-Resistant Gloves:</strong> Protect fingers from razor-sharp chassis edges, solder points, and micro-shards of cracked glass.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: '#059669', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                  <span><strong>Wash Hands & Face Thoroughly:</strong> Always wash with soap before eating or touching family members after handling scrap e-waste lots.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Hazardous Heavy Metals Breakdown */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Recognizing Toxic Electronic Hazards
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
              Why industrial hydrometallurgical recycling is required under Government of India E-Waste Management Rules:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {hazards.map((h, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderLeft: `5px solid ${h.color}`,
                    borderRadius: 'var(--radius-lg)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
                      {h.element}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: '#fee2e2',
                        color: h.color,
                        border: '1px solid #fca5a5'
                      }}
                    >
                      {h.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                    <strong>Common Sources:</strong> {h.sources}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    {h.risk}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PPE Checklist */}
          <div
            className="card"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              border: '1.5px solid var(--color-brand-300)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--primary-900)' }}>
                Collector Personal Protective Equipment (PPE) Checklist
              </h3>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Essential low-cost safety gear recommended by Central Pollution Control Board (CPCB) guidelines:
            </p>

            <div className="grid-3">
              <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-default)' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-brand-700)', display: 'block', marginBottom: '0.35rem' }}>
                  1. Heavy Leather/Nitrile Gloves
                </strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Prevents puncture wounds from sharp copper pins, capacitor leads, and sheet metal edges.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-default)' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-brand-700)', display: 'block', marginBottom: '0.35rem' }}>
                  2. N95 Particle Dust Mask
                </strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Filters microscopic lead solder dust and glass fiber particles during lot sorting and weighing.
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-default)' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-brand-700)', display: 'block', marginBottom: '0.35rem' }}>
                  3. Closed Safety Footwear
                </strong>
                <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Stops heavy chassis, dropped battery packs, or stray glass shards from piercing feet in scrap storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default SafetyGuide;