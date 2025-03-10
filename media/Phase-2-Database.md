# AI SELF-CONTROL PROTOCOL

## 🚨 CRITICAL RULES FOR AI (DO NOT IGNORE) 🚨

### Rule 1: NO REFACTORING
- Phase 1 code is LOCKED and UNTOUCHABLE
- No "improvements" to existing code
- No "better ways" to do things
- No "efficiency improvements"
- If it works, DO NOT TOUCH IT

### Rule 2: STRICT PHASE ADHERENCE
- Build ONLY what is listed in Phase 2
- If a feature isn't listed, DO NOT BUILD IT
- If a task requires modifying Phase 1, STOP and ASK
- No "while we're here" additions

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

### Rule 5: ADAPT, DON'T MODIFY
- Database must work WITH existing UI, not change it
- Create adapters for data integration
- Add new components, don't modify old ones
- If Phase 1 code needs changes, STOP and DISCUSS

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

### Supabase Core Docs
- Project Setup: search "supabase project setup documentation"
- Environment: search "supabase environment variables documentation"
- TypeScript: search "supabase typescript integration documentation"
- Client SDK: search "supabase javascript client documentation"

### Authentication Docs
- Auth System: search "supabase auth documentation"
- User Management: search "supabase user management documentation"
- Row Level Security: search "supabase rls documentation"
- Session Handling: search "supabase session management documentation"

### Database Docs
- Schema Design: search "supabase database schema documentation"
- TypeScript Types: search "supabase typescript database types"
- Migrations: search "supabase migrations documentation"
- Relationships: search "supabase foreign keys documentation"

### Storage Docs
- Setup: search "supabase storage setup documentation"
- File Upload: search "supabase storage upload documentation"
- CDN: search "supabase storage cdn documentation"
- Policies: search "supabase storage policies documentation"

### State Management Docs
- Zustand Persist: search "zustand persist state documentation"
- Auth State: search "zustand auth state management"
- TypeScript: search "zustand typescript documentation"

### Search Tips
1. Always include "documentation" in search
2. Include "official" for primary sources
3. Add version numbers if needed
4. Add "typescript" for type definitions
5. Prioritize Supabase docs over blog posts

## BEFORE EVERY TASK, I MUST:
1. Read these rules again
2. Check the "What NOT to Build" list
3. Verify the task is explicitly listed in Phase 2
4. Confirm no modifications to Phase 1 code are needed
5. If in doubt, STOP and ASK

# Phase 2: Core Experience & Database Integration

## Supabase Setup
1. Initialize Supabase project
2. Configure environment variables
3. Set up authentication system
4. Generate TypeScript types
5. Configure row-level security

## Database Schema
1. Create users table
2. Set up teams table
3. Implement formations table
4. Create plays table
5. Add playbooks table

## State Persistence
1. Implement formation saving
2. Add play persistence
3. Set up playbook management
4. Set up data validation
5. Implement data recovery mechanisms

## Enhanced Play Design (From Phase 3)
1. Improve player placement tools
2. Implement advanced route drawing
3. Add play variations system
4. Create basic play templates
5. Enhance user feedback during drawing

## Formation Enhancement (From Phase 3)
1. Improve formation creation interface
2. Add basic formation templates
3. Implement simple formation editing tools
4. Create formation preview system
5. Add formation categorization

## Authentication Flow
1. Add sign up process
2. Implement login system
3. Create team management
4. Set up basic access controls
5. Add simple session management

## What NOT to Build Yet
- Real-time collaboration features
- Advanced search capabilities
- AI/ML integrations
- Analytics systems
- External API integrations
