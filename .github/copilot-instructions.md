# AI Copilot Instructions for Time-Scheduling-UI

## Project Overview

**TimePoll** - A time-scheduling service for university team projects, clubs, and study groups. Users share a link, participants input their available time slots, and the system identifies optimal meeting times. Built with Next.js 16, React 19, Tailwind CSS, and Supabase.

## Architecture & Key Patterns

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS with class-variance-authority (CVA), deployed via `cn()` utility
- **UI Components**: Radix UI primitives (40+ components in `components/ui/`)
- **Database**: Supabase (PostgreSQL with client-side queries)
- **Forms**: react-hook-form + Zod for validation
- **Toast/Notifications**: Sonner
- **Language**: Korean-first (UI copy, error messages)

### Project Structure
```
app/                    # Next.js app router pages
  page.tsx             # Landing page (hero, features, recent polls sidebar)
  create/page.tsx      # Poll creation form (date/time range, duration)
  poll/[id]/page.tsx   # Poll participation (time grid, voting)
  poll/[id]/result/    # Results heatmap
  
components/
  poll/                # Poll-specific logic components
    time-grid.tsx      # 30-min slot grid with drag-to-select
    heatmap.tsx        # Visualization of availability overlap
    auth-dialog.tsx    # Participant registration (name + role)
  ui/                  # Reusable Radix-based primitives
  
lib/
  supabase.ts          # Supabase client init (public anon key)
  utils.ts             # cn() - Tailwind merge utility
```

### Critical Data Flows

1. **Poll Creation** (`app/create/page.tsx`)
   - Form validation via Zod schema (title, date range, time range, duration)
   - Saves to Supabase `polls` table
   - Redirects to poll page with generated ID
   - Participant role: "member" (1x weight) or "leader" (2x weight)

2. **Time Slot Voting** (`components/poll/time-grid.tsx`)
   - Generates 30-min intervals from poll `start_time`/`end_time`
   - Participants drag-select available slots → stored in `participant_availability`
   - Save triggers Supabase insert
   - Real-time toggle: on drag-down = add, on drag-up = remove

3. **Results Aggregation** (`components/poll/heatmap.tsx`)
   - Counts votes per slot (weighted by role: member=1, leader=2)
   - Displays heatmap with highest availability slots highlighted

### Styling Conventions
- Use `cn()` utility for conditional Tailwind classes: `cn("base-class", condition && "active-class")`
- Responsive grid: `grid-cols-1 lg:grid-cols-[1fr_380px]` for desktop/mobile layouts
- Mobile-first approach with sticky sidebars on desktop
- Color themes managed via `next-themes` (light/dark support)

### Form Handling Pattern
```tsx
// Use react-hook-form + Zod
const formSchema = z.object({ field: z.string().min(1) })
const form = useForm({ resolver: zodResolver(formSchema) })
// Radix components wrapped in Form* helpers for validation display
```

### Supabase Integration
- Client-side queries only (public anon key in `.env.local`)
- No server-side SQL—all queries from client components marked `"use client"`
- Tables: `polls`, `participants`, `participant_availability`
- Error handling: catch Supabase errors, display via `toast.error()`

## Developer Workflows

### Build & Run
```bash
pnpm install           # Install dependencies (uses pnpm lockfile)
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint check
```

### Environment Setup
- Create `.env.local` with:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  ```
- Public env vars prefixed with `NEXT_PUBLIC_`

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` → project root
- Build ignores TypeScript errors (see `next.config.mjs`)

## Project-Specific Conventions

### Language & Localization
- **All UI text in Korean** (even though comments may be English)
- Use `date-fns/locale/ko` for Korean date formatting
- Error messages: `toast.error("이름을 입력해주세요.")` pattern

### Component Naming
- Page components: `page.tsx` (Next.js convention)
- Feature components: PascalCase descriptive names (e.g., `TimeGrid`, `AuthDialog`, `HeatMap`)
- UI primitives: Lowercase or PascalCase (e.g., `button.tsx` exports `Button`)

### State Management
- React hooks only—no external state library
- `useState` for local UI state, `useParams/useRouter` for navigation
- Props drilling is acceptable; complexity suggests API route needs

### Toast Notifications
- Use Sonner: `toast.success()`, `toast.error()`, `toast.loading()`
- **Always** validate input before async operations, show error toast on failure

## Integration Points & External Dependencies

### Supabase Tables Structure (inferred from code)
```
polls:
  id, title, start_date, end_date, start_time, end_time, created_at

participants:
  id, poll_id, name, role ('member'|'leader')

participant_availability:
  participant_id, poll_id, date, time_slot, is_available
```

### Icons & Assets
- Icons: Lucide React (`lucide-react` package)
- UI patterns: Radix UI (40+ components pre-built in `components/ui/`)
- No custom icon files—all from Lucide

### Third-Party Services
- **Vercel Analytics**: Included in layout (`@vercel/analytics/next`)
- **Next-Themes**: Dark mode toggle (initialize in `components/theme-provider.tsx`)

## Common Tasks & Patterns

### Adding a New Page
1. Create `app/[feature]/page.tsx`
2. Mark with `"use client"` if using React hooks
3. Import UI components from `@/components/ui/*`
4. Use `useRouter` from `next/navigation` (not router)

### Creating Form Components
1. Define Zod schema
2. Use `useForm(zodResolver(schema))`
3. Wrap inputs in `Form*` helpers (FormField, FormLabel, FormControl, FormMessage)
4. Submit: validate → Supabase insert/update → toast feedback

### Styling Components
- Always use `cn()` for conditional classes
- Export Tailwind variants via `cva()` (class-variance-authority)
- No inline styles—Tailwind only

### Handling Async Operations
```tsx
const [loading, setLoading] = useState(false)
try {
  setLoading(true)
  await supabase.from('table').insert(...)
  toast.success('성공!')
} catch (error) {
  toast.error('오류 발생!')
} finally {
  setLoading(false)
}
```

## Important Notes for Agents

- **Ignore build errors**: TypeScript errors don't block builds (`ignoreBuildErrors: true`)
- **No server components**: All interactive features use `"use client"`
- **Public Supabase key**: Don't expose `.env.local`—use `.env.local.example` template
- **Duplicate file structure**: `time-scheduling-ui/src/` mirrors `app/` and `components/`—maintain parity if editing both
- **Mobile-first mindset**: Always test responsive behavior (Tailwind breakpoints: `sm`, `lg`, `xl`)
- **Role-weighted voting**: "Leader" participants count 2x in availability calculations—verify in vote aggregation logic

---

**Last Updated**: January 2026
