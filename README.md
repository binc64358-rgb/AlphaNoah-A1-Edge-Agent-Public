# AlphaNoah A1 Edge Agent

A local-first industrial edge agent validated on AMD Ryzen AI Max+ 395.

AlphaNoah turns an industrial incident report into a guarded, human-approved, evidence-backed, auditable work closure on a local edge device.

This repository is a **Sanitized Public Release Snapshot** for the AMD Hackathon. It contains the validated source and local release tooling, not the private development history.

## What AlphaNoah is

AlphaNoah combines deterministic workflow controls with selectable AI inference. Providers may analyze an incident, but they cannot bypass Human Review, Task lifecycle rules, Evidence semantics, Final Review, or the auditable `CLOSED` transition.

## Architecture

```text
Browser → localhost HTTP service → Runtime → Local SQLite
                         ↓
        Ollama / OpenAI-compatible / Fake Provider
```

The browser uses one loopback entry point for static frontend assets and `/api/*`. Provider adapters remain outside the state machine.

## Verified Golden Path

```text
Incident Report
→ Local AI Analysis
→ Digital Employee / Skill
→ Knowledge
→ Responsibility
→ Human Review
→ Task
→ Evidence
→ Final Review
→ CLOSED
→ Audit Timeline
```

## AMD validated platform

- AMD Ryzen AI Max+ 395
- GPU: gfx1151
- ROCm HSA 1.18
- Ubuntu 24.04
- Ollama 0.20.3
- qwen3.5:9b
- Web Ollama E2E: `CLOSED`

This release does not claim NPU inference, universal GPU acceleration, or real vLLM host validation.

## Online Demo

See the current live demo URL in the AMD Hackathon submission page. Online demo URLs may change during final judging; no temporary tunnel URL is embedded here.

## Local Edge Package

Download the Linux archive and `SHA256SUMS` from this repository’s GitHub Release. Models are not bundled.

Expected artifact:

```text
AlphaNoah-A1-Edge-Agent-v0.1.1-linux-x86_64.tar.gz
SHA256: 8a0e44b72c4e6e48013d1fe7819796dfc031fb15bba5d9c3dfeb626427f4a7b5
```

## Quick Start

```bash
./scripts/install.sh
./scripts/configure.sh
./scripts/start.sh
```

Then open the local URL printed by the launcher. See [README_LOCAL.md](README_LOCAL.md), [PROVIDER_SETUP.md](PROVIDER_SETUP.md), and [DEMO_GUIDE_LOCAL.md](DEMO_GUIDE_LOCAL.md).

## Provider options

- Ollama — SUPPORTED / HOST VALIDATED.
- vLLM / OpenAI-Compatible — SUPPORTED VIA OPENAI-COMPATIBLE; REAL vLLM HOST NOT VALIDATED.
- Remote API Key — SUPPORTED VIA OPENAI-COMPATIBLE; TEST HARNESS VALIDATED.
- Fake — SUPPORTED for deterministic evaluation.

## Privacy boundary

Provider choice determines the inference boundary:

- Ollama localhost: event data stays on the machine.
- LAN-compatible endpoint: data may travel within the enterprise LAN.
- Remote API: incident, knowledge, and analysis context may leave the enterprise environment.
- Fake: deterministic simulation with no model egress.

See [SECURITY_AND_PRIVACY.md](SECURITY_AND_PRIVACY.md).

## Validation summary

- Backend tests: 218 PASS
- Frontend tests: 198 PASS
- Fresh Fake E2E: `CLOSED`
- Fresh Ollama E2E: `CLOSED`
- Provider configuration security: PASS
- Archive secret scan: PASS
- Local SQLite persistence: PASS

## Source provenance

This public tag represents a sanitized public snapshot. Validated private development provenance:

- Core release: `v0.1.1-amd-hackathon-final`
- Core commit: `31d74174db86584f26be8761848486ca32359168`
- Packaging commit: `e690066cd6cf08910eb4c851ae295d32f8557329`

The public snapshot intentionally contains no private Git history.

## Known issues

- A real vLLM host was not validated.
- The frontend production build has a non-blocking bundle-size warning.
- Models must be managed by the selected inference provider.

## License

See [LICENSE](LICENSE) and [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
