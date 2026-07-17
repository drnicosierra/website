# Workflow: CSS / visual fix

Read first: CLAUDE.md + docs/design-system.md. If component structure involved: docs/architecture.md.

## Steps
1. Reproduce: Renier describes the issue + provides screenshot or DevTools output (Elements panel: computed styles of the broken element). DevTools output is the primary debugging source — not guesses from reading CSS.
2. Locate: grep for the selector/class before proposing anything. Verify the actual current CSS.
3. One change. Respect design-system rules (no inline margin-top, no cross-.reveal siblings, --sc allowed uses, variables not raw hex).
4. `npm run build` + visual check in dev.
5. iOS Safari check if the change touches reveal/section elements (WebKit blank-section history — translateZ(0) must stay in both states).
6. Commit.

## Escalation
Fix fails twice → stop. Request fresh DevTools computed-styles output and re-diagnose. Don't iterate blind.
