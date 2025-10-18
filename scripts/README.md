# Runiq Scripts Directory

This directory contains utility scripts for the Runiq project.

## 📁 Files

### Utilities

- **`generate-example-svgs.mjs`** - Generates SVG outputs for example `.runiq` files (used for documentation)
- **`create-additional-issues.bat`** - Reference script used to create GitHub issues #47-54 (infrastructure features)

---

## 📊 GitHub Issues Status

**All 54 issues successfully created!** ✅

- **Issues #1-46**: Diagram types (Tiers 1-4)
- **Issues #47-54**: Infrastructure & libraries

View at: https://github.com/jgreywolf/runiq/issues

---

## 📚 Documentation References

For detailed information about planned features:

- **Master Roadmap**: `../docs/MASTER-ROADMAP.md` - Comprehensive strategic planning
- **Issue Templates**: `../docs/GITHUB-ISSUES-TEMPLATES.md` - Reference templates for all diagram types
- **CSV Import**: `../docs/github-issues-bulk-import.csv` - Bulk import format

---

## 🛠️ Usage

### Generate Example SVGs

```bash
cd scripts
node generate-example-svgs.mjs
```

This will scan the `examples/` directory and generate SVG outputs for all `.runiq` files.

---

## 🎯 Next Steps

With all issues created, development can begin:

1. **Start with Quick Wins** (Issues #1-12) - 4 hours to 3 days each
2. **High-Value Engineering** (Issues #4, #14) - P&ID, Pneumatic/Hydraulic circuits
3. **Architecture Foundation** (Issue #27) - C4 diagrams unlock containers for 10+ types

See `MASTER-ROADMAP.md` for full implementation strategy.

---

**Last Updated:** October 17, 2025  
**Status:** Planning complete, ready for implementation 🚀
