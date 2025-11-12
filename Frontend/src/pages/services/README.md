# RTI Service Pages - Production Structure

This directory contains production-ready service pages with proper separation of concerns and maintainable architecture.

## Architecture Overview

The service pages follow a modular, component-based architecture:

```
src/
├── components/
│   └── services/          # Service-specific components
│       ├── ServiceSidebar.tsx
│       ├── ServiceHero.tsx
│       ├── ServiceFeatures.tsx
│       ├── ServiceOutline.tsx
│       ├── WhyThisService.tsx
│       ├── HowItWorks.tsx
│       ├── Testimonials.tsx
│       ├── ServiceFAQ.tsx
│       ├── ConsultationModal.tsx
│       └── index.ts         # Barrel exports
├── data/
│   └── rtiModels.ts        # RTI service data
├── hooks/
│   ├── useRTIService.ts    # Service data hook
│   ├── useVideoLazyLoad.ts # Video lazy loading
│   └── useConsultationForm.ts # Form management
├── utils/
│   ├── seo.ts              # SEO utilities
│   └── validation.ts       # Form validation
├── constants/
│   └── services.ts         # Service constants
└── types/
    └── services.ts         # TypeScript types
```

## Key Features

### 1. **Separation of Concerns**
- **Data Layer**: All service data is in `data/rtiModels.ts`
- **Business Logic**: Custom hooks handle data fetching and form management
- **Presentation**: Components are focused solely on rendering
- **Utilities**: Reusable functions for SEO, validation, etc.

### 2. **Type Safety**
- Comprehensive TypeScript types in `types/services.ts`
- All components and functions are fully typed
- No `any` types used

### 3. **Reusability**
- Components are modular and can be reused
- Hooks can be shared across different pages
- Utilities are framework-agnostic

### 4. **Performance**
- Components are memoized with `React.memo`
- Lazy loading for videos using Intersection Observer
- Code splitting via Vite's build configuration

### 5. **SEO Optimization**
- Structured data (JSON-LD) for services, breadcrumbs, and FAQs
- Comprehensive meta tags
- Proper semantic HTML

### 6. **Error Handling**
- Error boundary component for graceful error handling
- Form validation with user-friendly error messages
- Loading states for async operations

## Usage

### Adding a New Service

1. **Add service data** to `data/rtiModels.ts`:
```typescript
export const rtiModels: Record<string, RTIModel> = {
  'new-service': {
    id: '7',
    name: 'New Service',
    // ... other properties
  }
};
```

2. **Add images** to `constants/services.ts`:
```typescript
export const SERVICE_IMAGES: ServiceImageMapping = {
  'new-service': '/images/NewService.webp',
  // ...
};
```

3. **Add route** in `App.tsx`:
```typescript
<Route path="/services/new-service" element={<RTIModelPage />} />
```

### Customizing Components

All components are designed to be easily customizable:

- **ServiceHero**: Modify pricing display, CTA buttons
- **ServiceFeatures**: Update feature cards
- **ServiceFAQ**: Add/remove FAQ items
- **Testimonials**: Update testimonial data

## Best Practices

1. **Always use TypeScript types** - Never use `any`
2. **Memoize components** - Use `React.memo` for expensive renders
3. **Extract constants** - Don't hardcode values
4. **Validate forms** - Always validate user input
5. **Handle errors** - Use error boundaries and try-catch
6. **Optimize images** - Use WebP format, lazy loading
7. **SEO first** - Always include structured data and meta tags

## Testing

When testing:

1. Test each component in isolation
2. Test hooks separately
3. Test form validation
4. Test error boundaries
5. Test responsive layouts

## Performance Considerations

- Images are lazy-loaded
- Videos load only when in viewport
- Components are code-split
- Unused code is tree-shaken
- CSS is purged in production

## Maintenance

- **Data Updates**: Modify `data/rtiModels.ts`
- **Styling**: Update Tailwind classes in components
- **SEO**: Modify `utils/seo.ts`
- **Validation**: Update `utils/validation.ts`
- **Constants**: Modify `constants/services.ts`

