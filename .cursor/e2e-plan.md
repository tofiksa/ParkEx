# E2E Testplan (ParkEx)

Mål: Verifisere kritiske brukerscenarier for garasjemarkedet (auth, selgerflyt, kjøpervisning, bud, opplasting) med fokus på Supabase-integrasjon, RLS, realtime og UI. Kjør mot lokal dev med reell Supabase prosjekt (parkex).

## Forutsetninger
- `.env.local` satt med Supabase URL/anon/service role.
- Migrasjon `supabase/migrations/0001_domain.sql` kjørt, bucket `garage-images` finnes.
- Google OAuth aktivert i Supabase og callback for localhost.
- Brukerprofiler kan registreres via `/register`.

## Scenarier
1) **Auth & profil**
   - Registrer bruker via e-post (Supabase Magic Link) eller Google.
   - Etter innlogging: submit profilskjema (fornavn, etternavn, epost, rolle=selger, optional phone/address).
   - Forvent: rad i `profiles` med korrekt role, RLS respekterer self-only updates.

2) **Selger oppretter garasje**
   - Gå til `/sell/new` som innlogget selger.
   - Fyll tittel, størrelse, adresse, startpris, la budfrist stå blank (default 30d).
   - Last opp bilde: kall `POST /api/storage/garage-upload-url` med filnavn, bruk signed URL til å PUT’e en liten jpeg, legg path inn i feltet.
   - Submit. Forvent: rad i `garages` med `bid_end_at` ~30d frem i tid, images[] fylt.

3) **Garasjer kan listes/browses**
   - Implementer/bruk `/listings` (når tilgjengelig) eller kall `GET` mot Supabase (REST) for å hente opprettet listing.
   - Forvent: listing er synlig uten auth (RLS select all).

4) **Budgivning (forberedt)**
   - (Når bud-API/side finnes) som innlogget kjøper: legg inn bud > startpris, før deadline.
   - Forvent: rad i `bids`, avvist etter deadline, avvist hvis lavere enn høyeste (når validering legges til).

5) **Realtime (forberedt)**
   - Åpne to klienter på samme listing-detail (når UI finnes).
   - Legg inn bud i klient A; klient B ser oppdatert høyeste bud <~1s.

6) **Helserute**
   - `GET /api/health` returnerer status ok.

7) **CI sanity**
   - `npm run lint` og `npm run build` passerer.

## Rask manuell sjekkliste (nåværende implementasjon)
- [ ] `/login` og `/register` viser Google provider; sign-in fungerer.
- [ ] Profilskjema oppdaterer `profiles`.
- [ ] `/sell/new` opprettet garasje uten budfrist gir `bid_end_at` ca. +30d.
- [ ] Signed upload URL fra `/api/storage/garage-upload-url` kan brukes til å PUT’e fil og fil-URL kan lagres i listing.
- [ ] `/listings` viser annonser; `/listings/[id]` viser realtime budoppdateringer etter innsending av bud fra en annen klient.
- [ ] `GET /api/health` returnerer 200/ok.
- [ ] Analytics/feedback: `POST /api/analytics` med event-name svarer 200; `POST /api/feedback` med message svarer 200.
- [ ] `npm run lint` og `npm run build` grønt.

## Notater
- Realtime og budvalidering testes først når bid-API/UI er implementert (TASK-008/009).
- Husk å bruke unike filnavn ved signed uploads for å unngå kollisjon.

