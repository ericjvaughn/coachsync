# AI SELF-CONTROL PROTOCOL

## 🚨 CRITICAL RULES FOR AI (DO NOT IGNORE) 🚨

### Rule 1: NO REFACTORING
- Once code is written and working, it is LOCKED
- No "improvements" to existing code, EVER
- No "better ways" to do things, even if obvious
- No "efficiency improvements", even if simple
- If it works, DO NOT TOUCH IT
- No "cleanup" or "organization" of working code
- No "standardizing" or "consistent styling"
- WORKING CODE > PERFECT CODE

### Rule 2: STRICT PHASE ADHERENCE
- Build ONLY what is listed in Phase 1
- Each task must map to a specific line item
- No "implied" or "assumed" features
- No "preparation" for future features
- No "while we're here" additions
- If it's not explicitly listed, it doesn't exist
- Future problems are future problems
- EXPLICIT > IMPLICIT

### Rule 3: SCOPE CONTROL
- Check "What NOT to Build" before EVERY task
- If you think "it would be nice to also...", STOP
- No adding "useful" features not in spec
- No "preparing" for future phases

### Rule 4: COMMUNICATION REQUIRED
- If stuck, ASK instead of modifying
- If you see a "better way", DISCUSS it first
- If you feel the urge to refactor, STOP and EXPLAIN why
- Never assume it's okay to modify existing code

### Rule 5: FOUNDATION IS FOREVER
- Phase 1 code is the BEDROCK - never changes
- Future phases MUST adapt to Phase 1, not vice versa
- Technical debt is BETTER than breaking working code
- Bad architecture > Broken architecture
- No "temporary" changes to Phase 1
- No "quick fixes" to Phase 1
- No "small tweaks" to Phase 1
- STABILITY > PERFECTION

### Rule 6: LESS IS MORE
- Every line of code is a liability
- If it "might be useful later", don't write it
- Complexity dies by a thousand "helpful" additions
- No "just in case" code
- No "this might be handy" functions
- No "wrapper for future use"
- SIMPLE > CLEVER
- READABLE > ELEGANT
- MINIMAL > FLEXIBLE

### Rule 7: COMPLETE, DON'T FRAGMENT
- Finish EVERY task in the current scope
- No "I'll come back to this later"
- No partial implementations
- No "skeleton code" to fill in later
- If you start something, FINISH IT
- No moving on until current task is 100% done
- No splitting tasks across multiple sessions
- COMPLETION > PROGRESSION

Remember:
- Half-finished features are technical debt
- Partial implementations create confusion
- Coming back later means never
- Context switching kills productivity

EMBRACE:
✓ One task at a time
✓ Full implementation
✓ Complete documentation
✓ Thorough testing

AVOID:
✗ "We can finish this later"
✗ "Let's just get the basic structure"
✗ "I'll add the details next time"
✗ "This is good enough for now"

Remember:
- Each line of code you write is a line you'll maintain forever
- Each abstraction you add is complexity you'll explain forever
- Each "helpful utility" is a dependency you'll manage forever
- Each "flexible solution" is a decision you'll defend forever

Your job is to solve the problem, not build a framework.
Your goal is working software, not a showcase of patterns.
Your measure is business value, not code elegance.

EMBRACE:
✓ Small, focused functions
✓ Direct solutions
✓ Obvious code
✓ Clear names

AVOID:
✗ "Flexible" abstractions
✗ "Reusable" utilities
✗ "Future-proof" patterns
✗ "Generic" solutions

THE BEST CODE IS THE CODE YOU DIDN'T WRITE

## Documentation Search Guide

### Project Setup Docs
- Vite: search "vite react typescript setup official documentation"
- React: search "react.dev official documentation"
- TypeScript: search "typescript official documentation"
- ESLint/Prettier: search "eslint typescript react configuration"
- Tailwind: search "tailwindcss.com documentation"
- Zustand: search "zustand state management documentation"

### Canvas Docs
- Konva.js core: search "konvajs.org documentation"
- Line drawing: search "konva.js line drawing documentation"
- Arrow heads: search "konva.js arrow heads documentation"
- Curved lines: search "konva.js curved lines documentation"
- Zoom/Pan: search "konva.js zoom pan documentation"

### Testing Docs
- Vitest: search "vitest testing documentation"
- React Testing Library: search "react testing library documentation"
- MSW: search "msw mock service worker documentation"

### Search Tips
1. Always include "documentation" in search
2. Include "official" for primary sources
3. Add "typescript" for type definitions
4. Add "examples" for implementation patterns
5. Prioritize official docs over blog posts

## BEFORE EVERY TASK, I MUST:
1. Read these rules again, EVERY TIME
2. Check the "What NOT to Build" list, NO EXCEPTIONS
3. Find the EXACT line item in Phase 1 for this task
4. If the task isn't listed word-for-word, STOP
5. If I feel the urge to improve anything, STOP
6. If I see a better way to do it, STOP
7. If I think "but what about...", STOP
8. ASK FIRST, CODE SECOND

# Phase 1: Foundation

## Documentation Search Guide

### Project Setup Docs
- Vite: search "vite react typescript setup official documentation"
- React: search "react.dev official documentation"
- TypeScript: search "typescript official documentation"
- ESLint/Prettier: search "eslint typescript react configuration"
- Tailwind: search "tailwindcss.com documentation"
- Zustand: search "zustand state management documentation"

### Canvas Docs
- Konva.js core: search "konvajs.org documentation"
- Line drawing: search "konva.js line drawing documentation"
- Arrow heads: search "konva.js arrow heads documentation"
- Curved lines: search "konva.js curved lines documentation"
- Zoom/Pan: search "konva.js zoom pan documentation"

### Testing Docs
- Vitest: search "vitest testing documentation"
- React Testing Library: search "react testing library documentation"
- MSW: search "msw mock service worker documentation"

### Search Tips
1. Always include "documentation" in search
2. Include "official" for primary sources
3. Add "typescript" for type definitions
4. Add "examples" for implementation patterns
5. Prioritize official docs over blog posts

## Project Setup
1. Initialize React + TypeScript project with Vite
2. Configure ESLint + Prettier
3. Set up Git repository
4. Configure Tailwind CSS
5. Add Zustand for state management

## Field Canvas (Core)
1. Create basic field SVG
2. Implement Konva.js canvas
3. Set up field dimensions (1000x569)
4. Add basic zoom/pan functionality
5. Implement grid system

## Basic State Management
1. Set up Zustand store
2. Implement tool state management
3. Create basic undo/redo system
4. Add keyboard shortcut system
5. Configure action tracking

## Core Components
1. Create TopNav component (minimal)
2. Implement basic Toolbar
3. Add Field component
4. Create PlayerLayer component
5. Set up RouteLayer component

## Testing Infrastructure
1. Configure Vitest
2. Set up React Testing Library
3. Add MSW for API mocking
4. Create test utilities
5. Write basic component tests

## What NOT to Build Yet
- Formation management system
- Play variations
- Defense-specific features
- Advanced route tools
- Real-time collaboration
- Database integration
