# Changelog

## [1.3.2](https://github.com/tofiksa/ParkEx/compare/v1.3.1...v1.3.2) (2026-01-13)


### Bug Fixes

* **tsconfig:** updated the configuration to latest best practices for nextjs ([4342ce2](https://github.com/tofiksa/ParkEx/commit/4342ce2aaef4a47dd29a952e9aaf283798b7d30e))

## [1.3.1](https://github.com/tofiksa/ParkEx/compare/v1.3.0...v1.3.1) (2026-01-13)


### Bug Fixes

* **auth:** redirect to home page on logout from any page ([87647e3](https://github.com/tofiksa/ParkEx/commit/87647e3ec498d0e76d9fae6eb82e8982fce7f68c))

## [1.3.0](https://github.com/tofiksa/ParkEx/compare/v1.2.0...v1.3.0) (2026-01-13)


### Features

* **i18n:** add Norwegian localization to Supabase Auth UI ([3dd4c4c](https://github.com/tofiksa/ParkEx/commit/3dd4c4cdf050f9c68f7a1cd83142caf8813f1482))
* **privacy:** add Google OAuth data handling disclosure ([c7357c6](https://github.com/tofiksa/ParkEx/commit/c7357c65289686ca135b18bb935d71835dfa8bdd))


### Bug Fixes

* **i18n:** correct Norwegian text on forgot password view ([d71d845](https://github.com/tofiksa/ParkEx/commit/d71d845466c30130b955bd86e5481caa9f184f3e))
* **i18n:** translate remaining English terms to Norwegian ([18cbb97](https://github.com/tofiksa/ParkEx/commit/18cbb976616396cab2a2c0f85b4d9edf2df2b787))

## [1.2.0](https://github.com/tofiksa/ParkEx/compare/v1.1.0...v1.2.0) (2026-01-11)


### Features

* **pages:** add terms and privacy pages with email obfuscation ([7a8f27d](https://github.com/tofiksa/ParkEx/commit/7a8f27d238d62a716ea634c69b33b5cdf591a1c9))

## [1.1.0](https://github.com/tofiksa/ParkEx/compare/v1.0.0...v1.1.0) (2026-01-10)


### Features

* **auth:** add inactivity timeout with session guard ([751be89](https://github.com/tofiksa/ParkEx/commit/751be89a1d84256be46b1855efdc968eb33bc199))
* **homepage:** add realtime bid carousel ([ff2c413](https://github.com/tofiksa/ParkEx/commit/ff2c413e482d8ba594c71040f4560fe521908eae))
* **TASK-006:** add seller dashboard with listings overview and winner contact ([0d02d63](https://github.com/tofiksa/ParkEx/commit/0d02d63bc8148c7577117cecb29e1a37e7d17129))
* **TASK-007:** improve buyer bid overview with visual status indicators ([5989b03](https://github.com/tofiksa/ParkEx/commit/5989b03d39715123d7ee9c7d4d8f013b1dd861af))


### Bug Fixes

* **auth:** migrate to @supabase/ssr for proper cookie-based auth ([3138f29](https://github.com/tofiksa/ParkEx/commit/3138f290b088b9f91c0726fd5daea7efcb291113))
* **lint:** resolve biome lint warnings ([d09bc2d](https://github.com/tofiksa/ParkEx/commit/d09bc2dacd68cbe6b497eb62876931a507f151c1))

## 1.0.0 (2026-01-04)


### Features

* **TASK-005:** add auth flows with google and profile upsert ([2eec6bf](https://github.com/tofiksa/ParkEx/commit/2eec6bfa6a22a0ff4e53eab8029deb4fc8c52149))
* **TASK-006:** add seller listing flow and signed uploads ([fc54a03](https://github.com/tofiksa/ParkEx/commit/fc54a03d52dd8a524ea8b4ae20f4155450c79b94))
* **TASK-007:** add buyer listings, detail, and bid participations ([75261e7](https://github.com/tofiksa/ParkEx/commit/75261e729b444146b726ec8f86c9d98434833074))
* **TASK-008:** add bid validation and submission ([ac676e6](https://github.com/tofiksa/ParkEx/commit/ac676e6131af85010cfd0ad8a2168f1a6910efe5))
* **TASK-009:** add realtime bid updates ([b04382d](https://github.com/tofiksa/ParkEx/commit/b04382d060ef89e7d8918fec6b3d154b71d6e234))
* **TASK-010:** add analytics and feedback collectors ([7484670](https://github.com/tofiksa/ParkEx/commit/74846705ee462ec29197c9c9f12a02033f1aef72))


### Bug Fixes

* **BUG-001:** stabilize tailwind build and supabase guards ([9af052c](https://github.com/tofiksa/ParkEx/commit/9af052c11d7cfac73a57d12a298a5bc831e6a1d8))
* **BUG-004:** make getSupabaseServerClient async for Next.js 15+ cookies ([e07b63d](https://github.com/tofiksa/ParkEx/commit/e07b63d01a36acb6f96b69322a02b5179abf131e))
