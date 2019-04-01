# Core

- Find a better solution to `.parseLogs(logs: Log[])`.

# Tools

- Rework `constructor` for `Keystore`, `Config` and `Database` to initialize
  with the full path to its respective self rather than the `parent` followed
  by a `name`.
