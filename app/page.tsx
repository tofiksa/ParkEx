export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Garasjemegling, forenklet</p>
          <h1>Finn eller selg garasje med bud i sanntid</h1>
          <p className="lede">
            Registrer deg som kjøper eller selger. Legg ut garasjen, sett budfrist,
            og følg bud direkte.
          </p>
          <div className="cta-row">
            <a className="button button--primary" href="/sell/new">
              Opprett annonse
            </a>
            <a className="button button--ghost" href="/listings">
              Se alle garasjer
            </a>
          </div>
        </div>
        <div className="hero__card">
          <div className="card">
            <div className="card__header">
              <div>
                <p className="label">Budrunde</p>
                <h3>Sentrum P2</h3>
              </div>
              <span className="pill">Pågår</span>
            </div>
            <div className="card__body">
              <p className="muted">Siste bud</p>
              <p className="price">1 250 000 kr</p>
              <p className="muted">Budfrist: 12. feb 2026, 18:00</p>
            </div>
            <div className="card__footer">
              <a className="button button--full" href="/listings/sentrum-p2">
                Legg inn bud
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

