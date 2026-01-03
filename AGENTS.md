# Agent Development Guidelines

## 🌐 Language Requirements

**CRITICAL RULE**: All code, methods, comments, and documentation MUST be written in English.

This includes:
- Variable names
- Function names
- Class names
- Type definitions
- Comments and inline documentation
- JSDoc documentation
- README files and technical documentation
- Commit messages
- Error messages (where technically feasible)

**Exception**: User-facing content (page text, blog posts, metadata visible to Italian users) should remain in Italian.

---

## 📋 Project Overview

This is a modern travel blog built with Next.js 14+ (App Router), TypeScript, and Tailwind CSS. The site features:
- Static site generation for optimal performance
- Travel blog posts written in Markdown
- Photo galleries
- Interactive maps with travel routes
- Tag-based filtering
- Responsive design

---

## 🏗️ Architecture & Structure

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts and metadata
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── galleria/          # Gallery page
│   └── viaggi/            # Travel posts
│       ├── page.tsx       # Travel list
│       └── [slug]/        # Individual travel post
├── components/            # React components
│   ├── home/             # Homepage-specific components
│   ├── map/              # Map-related components
│   └── ...               # Shared components
├── config/               # Configuration files
│   ├── fonts.ts          # Google Fonts configuration
│   ├── navigation.ts     # Navigation links
│   ├── continents.ts     # Continent tags definition
│   └── metadata.ts       # Site metadata
├── lib/                  # Utility functions and business logic
│   ├── travels.ts        # Travel data parsing and management
│   ├── tags.ts           # Tag filtering utilities
│   ├── travelNavigation.ts # Travel navigation logic
│   ├── typeGuards.ts     # Type guard utilities
│   ├── dates.ts          # Date formatting
│   └── paths.ts          # Path utilities
└── content/              # Markdown content
    └── travels/          # Travel blog posts (.md files)
```

---

## 🎯 Development Principles

### 1. Separation of Concerns

- **Configuration** → `src/config/`
- **Business Logic** → `src/lib/`
- **Presentation** → `src/components/`
- **Pages** → `src/app/`
- **Content** → `src/content/`

### 2. Component Design

- Keep components small and focused (Single Responsibility Principle)
- Extract reusable components into `src/components/`
- Page-specific components go in subdirectories (e.g., `components/home/`)
- Prefer composition over large monolithic components

### 3. Type Safety

- Always use TypeScript with strict mode
- Define interfaces for all data structures
- Use type guards for runtime validation (see `src/lib/typeGuards.ts`)
- Export types from the same file where they're primarily used

### 4. Code Reusability

- Extract repeated patterns into utilities (`src/lib/`)
- Create reusable components for common UI patterns
- Use configuration files for constants and settings
- Avoid hardcoding values; prefer configuration

---

## 🔍 Analysis Guidelines

### Code Suggestions During Analysis

**CRITICAL RULE**: When performing analysis or code review, NEVER suggest code examples or provide code snippets. Analysis should focus on:

- Identifying problems and issues
- Explaining what's wrong or what could be improved
- Describing the impact of issues
- Discussing design patterns and approaches conceptually
- Providing recommendations in natural language

**Exception**: Only provide code when explicitly asked to implement changes or when the user requests code examples.

---

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ GOOD: Clear, typed function with JSDoc
/**
 * Filters travels by tag with case-insensitive matching
 */
export function filterTravelsByTag(travels: Travel[], tag: string): Travel[] {
  const normalizedTag = normalizeTag(tag);
  return travels.filter((travel) =>
    travel.tags.some((travelTag) => tagsMatch(travelTag, tag)) ||
    tagsMatch(travel.location, tag)
  );
}

// ❌ BAD: No types, unclear naming
function filter(arr: any, t: any) {
  return arr.filter((x: any) => x.tags.includes(t));
}
```

### React Components

```typescript
// ✅ GOOD: Typed props, clear interface
interface SectionHeaderProps {
  label: string;
  title?: string;
  linkText?: string;
  linkHref?: string;
}

export function SectionHeader({ 
  label, 
  title, 
  linkText, 
  linkHref 
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Component content */}
    </div>
  );
}

// ❌ BAD: No types, unclear props
export function Header(props: any) {
  return <div>{props.children}</div>;
}
```

### File Naming

- **Components**: PascalCase (e.g., `TravelCard.tsx`, `SectionHeader.tsx`)
- **Utilities**: camelCase (e.g., `typeGuards.ts`, `travelNavigation.ts`)
- **Config**: camelCase (e.g., `fonts.ts`, `navigation.ts`)
- **Pages**: lowercase with hyphens for routes (Next.js convention)

---

## 🔧 Configuration Management

### Adding New Configuration

1. Create file in `src/config/` with descriptive name
2. Export typed constants or functions
3. Import and use in relevant components/pages
4. Update this document with the new config file

### Example: Adding Site-wide Constants

```typescript
// src/config/site.ts
export const siteConfig = {
  postsPerPage: 10,
  maxGalleryPhotos: 50,
  defaultLocale: "it-IT",
} as const;

export type SiteConfig = typeof siteConfig;
```

---

## 🧩 Component Guidelines

### Creating Reusable Components

1. **Identify Repetition**: If a pattern appears 2+ times, consider extracting it
2. **Define Props Interface**: Always type your component props
3. **Keep It Focused**: Component should do one thing well
4. **Make It Flexible**: Use optional props for variants

### Example: Section Header Pattern

```typescript
// Before: Repeated in multiple files
<div className="flex flex-col gap-4">
  <p className="text-xs uppercase">{label}</p>
  {title && <h2>{title}</h2>}
  {link && <Link href={link}>View all →</Link>}
</div>

// After: Extracted component
<SectionHeader label={label} title={title} linkHref={link} linkText="View all" />
```

---

## 📦 Utility Functions

### When to Create a Utility

- Logic is used in 2+ places
- Complex algorithm that benefits from isolation
- Pure function with no side effects
- Type validation or data transformation

### Utility Categories

- **Type Guards** (`typeGuards.ts`): Runtime type checking
- **Formatters** (`dates.ts`): Data formatting
- **Filters** (`tags.ts`): Data filtering and searching
- **Navigation** (`travelNavigation.ts`): Navigation logic
- **Paths** (`paths.ts`): Path manipulation

---

## 🗺️ Adding New Features

### Travel Post

1. Create Markdown file in `src/content/travels/`
2. Add frontmatter with required fields:
   - `title`, `date`, `description`, `coverImage`
3. Optional: Add `gallery`, `map`, `timeline`, `coords`
4. No code changes needed; static generation handles it

### New Page

1. Create folder in `src/app/[page-name]/`
2. Add `page.tsx` with default export
3. Update `src/config/navigation.ts` if adding to menu
4. Follow existing layout patterns

### New Component

1. Determine if page-specific or shared
2. Create in appropriate directory
3. Define TypeScript interface for props
4. Export as named export
5. Use in relevant pages

### New Utility

1. Create file in `src/lib/` with descriptive name
2. Write pure functions with clear types
3. Add type guards if working with unknown data
4. Export individual functions (no default export)

---

## 🎨 Styling Guidelines

### Tailwind CSS

- Use Tailwind utility classes (no custom CSS unless necessary)
- Keep classes organized: layout → spacing → typography → colors → effects
- Use custom colors from `tailwind.config.ts`:
  - `bg-brand-background`
  - `text-brand-primary`
  - `text-brand-secondary`
  - `text-brand-muted`

### Responsive Design

```typescript
// ✅ GOOD: Mobile-first responsive classes
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* Content */}
</div>

// ❌ BAD: Desktop-first or no responsive variants
<div className="grid-cols-4">
  {/* Content */}
</div>
```

---

## 📊 Data Management

### Travel Data Flow

1. **Source**: Markdown files in `src/content/travels/`
2. **Parsing**: `src/lib/travels.ts` reads and parses files
3. **Caching**: Data cached in memory after first read
4. **Type Safety**: Parsed into `Travel` interface
5. **Consumption**: Components receive typed data

### Adding Travel Fields

1. Update `Travel` interface in `src/lib/travels.ts`
2. Add parsing logic in `parseTravelFromFile()`
3. Update Markdown frontmatter documentation
4. Use in components as needed

---

## 🔍 Type Safety Patterns

### Type Guards

```typescript
// Use existing type guards from typeGuards.ts
import { isNonEmptyString, isValidNumber, isObject } from "@/lib/typeGuards";

function parseData(raw: unknown) {
  if (!isObject(raw)) return undefined;
  
  const name = isNonEmptyString(raw.name) ? raw.name : undefined;
  const age = isValidNumber(raw.age) ? raw.age : undefined;
  
  return { name, age };
}
```

### Creating New Type Guards

```typescript
// Add to typeGuards.ts if reusable
export function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard);
}
```

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before considering a feature complete:

- [ ] Run `npm run build` - no errors
- [ ] Run `npm run dev` - test locally
- [ ] Test on mobile viewport (responsive)
- [ ] Test all links work
- [ ] Verify no TypeScript errors
- [ ] Check for linter warnings

### Future: Automated Testing

When adding tests:
- Use Jest for unit tests
- Test utilities in `src/lib/`
- Test component rendering
- Mock Next.js specific features

---

## 📐 Performance Considerations

### Image Optimization

```typescript
// ✅ GOOD: Always use next/image with sizes
<Image
  src={travel.coverImage}
  alt={travel.title}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
/>

// ❌ BAD: Regular img tag
<img src={travel.coverImage} alt={travel.title} />
```

### Static Generation

- All pages use Static Site Generation (SSG)
- Travel posts use `generateStaticParams()`
- No client-side data fetching for content
- Dynamic behavior only for filters/interactions

---

## 🚫 Common Pitfalls

### Don't Do This

❌ **Inline large components in pages**
```typescript
// BAD: 100+ line component inline
export default function Page() {
  return (
    <div>
      {/* Huge inline JSX */}
    </div>
  );
}
```

✅ **Extract into components**
```typescript
// GOOD: Clean, composed page
export default function Page() {
  return (
    <div>
      <HeroSection />
      <ContentSection />
      <FooterSection />
    </div>
  );
}
```

❌ **Hardcode configuration values**
```typescript
// BAD
const links = [
  { href: "/", label: "HOME" },
  // ...
];
```

✅ **Use config files**
```typescript
// GOOD
import { navigationLinks } from "@/config/navigation";
```

❌ **Duplicate logic**
```typescript
// BAD: Same logic in multiple files
const normalized = tag.toLowerCase().trim();
```

✅ **Create utilities**
```typescript
// GOOD: Shared utility
import { normalizeTag } from "@/lib/tags";
const normalized = normalizeTag(tag);
```

---

## 📚 Key Files to Understand

### Must-Read Files

1. **`src/lib/travels.ts`** - Core data management
2. **`src/app/layout.tsx`** - App structure and fonts
3. **`src/config/navigation.ts`** - Site navigation
4. **`tailwind.config.ts`** - Design system

### Important Patterns

- **Font Configuration**: See `src/config/fonts.ts` for Next.js font loader pattern
- **Tag Filtering**: See `src/lib/tags.ts` for reusable filter pattern
- **Component Composition**: See `src/app/page.tsx` for clean composition
- **Type Guards**: See `src/lib/typeGuards.ts` for validation patterns

---

## 🔄 Refactoring Guidelines

### When to Refactor

- Code appears in 2+ places (DRY principle)
- File exceeds ~200 lines
- Function exceeds ~50 lines
- Complex logic without clear structure
- Poor naming or unclear intent

### Refactoring Process

1. Identify duplication or complexity
2. Extract to utility/component
3. Add TypeScript types
4. Update imports
5. Test build succeeds
6. Verify functionality unchanged

---

## 🐛 Debugging Tips

### Common Issues

**Build Fails with Font Loader Error**
- Font loaders must be const declarations at module scope
- Cannot use spread operator in font configuration
- See `src/config/fonts.ts` for correct pattern

**Type Errors in Parsing**
- Use type guards from `typeGuards.ts`
- Check that interfaces match Markdown frontmatter
- Validate unknown data before using

**Styling Not Applied**
- Check Tailwind config includes file path
- Verify class names are correct
- Use browser DevTools to inspect classes

---

## 📖 Additional Resources

### Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) (Markdown parsing)

### Project-Specific Docs

- `README.md` - General project information
- `PROJECT_SPECS.md` - Original project specifications
- `REFACTORING_SUMMARY.md` - Recent refactoring details
- `STRUCTURE.md` - Detailed file structure

---

## ✅ Pre-Deployment Checklist

Before deploying changes:

- [ ] All code, comments, and documentation in English
- [ ] TypeScript compiles without errors
- [ ] Build succeeds (`npm run build`)
- [ ] No linter errors
- [ ] Responsive design tested
- [ ] All new files follow naming conventions
- [ ] New utilities have clear documentation
- [ ] Configuration properly externalized

---

## 🤝 Contributing Best Practices

1. **Read First**: Understand existing patterns before adding code
2. **Follow Conventions**: Match existing code style and structure
3. **Type Everything**: No `any` types without good reason
4. **Document Complex Logic**: Add comments for non-obvious code
5. **Test Locally**: Always test before considering work complete
6. **Keep It Simple**: Prefer simple, clear code over clever solutions
7. **English Only**: Remember - all technical content in English

---

## 🔮 Future Considerations

When adding new features, consider:

- **Accessibility**: WCAG AA compliance
- **Performance**: Lighthouse scores > 90
- **SEO**: Proper metadata and semantic HTML
- **Mobile Experience**: Touch-friendly interactions
- **Internationalization**: While content is Italian, code supports future i18n
- **Testing**: Add automated tests for critical paths
- **Documentation**: Update this guide with new patterns

---

**Remember**: Good code is code that the next developer (or AI agent) can easily understand and modify. Write code as if you're having a conversation with a colleague.

---

*Last Updated: December 2025*

