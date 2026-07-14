# Review lessons

- Test helpers that create fixed-path fixtures must refuse collisions before
  registering cleanup; otherwise a passing test can overwrite and delete real
  repository content.
- Classify code that invokes framework rendering or filesystem-backed content
  loading as an integration boundary, even when its output transformation is
  deterministic.
