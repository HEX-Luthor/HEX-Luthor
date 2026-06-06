# Contributing to HEX Luthor

Thank you for your interest in contributing! Here are some guidelines:

## Adding New Patterns

To add a new pattern to the PatternEngine:

1. Open `src/hex-luthor.js`
2. Add your pattern function to the `patterns` object in `PatternEngine.generate`
3. Your pattern must return a valid SVG string that tiles seamlessly using `patternUnits="userSpaceOnUse"`
4. Test with `npm test`
5. Submit a PR with a preview screenshot

### Pattern Requirements

- Must use `patternUnits="userSpaceOnUse"` for seamless tiling
- Must accept `c1` (background) and `c2` (foreground) colors
- Should support `opacity` and `size` options
- Must be pure SVG (no external resources)

## Code Style

- Use single quotes for strings
- 2-space indentation
- JSDoc comments for public APIs
- Keep functions under 50 lines where possible

## Testing

```bash
npm test
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
