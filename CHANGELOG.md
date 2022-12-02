# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.)

## [js-v1.0.0] - 2022-12-02

### Added
- Mechanism system to include 'templates' and 'blocks' format
- New `docs/` files have been added

### Changed
- Action architecture is now using JS (node 16x)
- `README.md` has been updated and simplified

## [v0.2.0] - 2022-09-20

### Added
- Using GitHub Actions native way of using parameters
- Add `action.yml` file according to GitHub Actions guideline 

### Changed
- `entrypoint.sh` has been updated according to the new parameters
- `Dockerfile` is using `alpine:3.16` as base image
- `README.md` has been updated and simplified