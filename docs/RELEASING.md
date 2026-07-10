# Releasing Assemble

Releases are tag-driven and must correspond exactly to `package.json`.

1. Update `package.json`, `src/config/defaults.yaml`, README version references, and `CHANGELOG.md`.
2. Run `npm test` and `npm pack --dry-run` locally.
3. Run the **Release beta** workflow manually. This is a validation-only dry run and cannot publish.
4. Review the packed file list and CI results.
5. Create and push the matching tag, for example `v1.1.2-beta.4`.

The tag run repeats tests, creates the npm archive, publishes it with the `beta` dist-tag, and creates or updates the GitHub Release. A mismatched tag fails before publication. Reruns skip an npm version that already exists and safely reuse the GitHub Release.

Required repository secret: `NPM_TOKEN`. The workflow uses explicit job permissions and never publishes from a branch or manual dispatch.
