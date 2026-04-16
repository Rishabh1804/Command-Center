#!/bin/bash
# Command Center Build Script
# Concat order: data -> core -> rooms -> ostia -> start
# Output: split/command-center.html + split/index.html + repo root index.html
# Pattern per Codex canon-0033: build.sh outputs directly, no stdout redirect.

SPLIT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$SPLIT_DIR/.."
OUTPUT="$SPLIT_DIR/command-center.html"

{
cat "$SPLIT_DIR/template.html"
echo '<style>'
cat "$SPLIT_DIR/styles.css"
echo '</style>'
echo '<script>'
cat "$SPLIT_DIR/data.js"
echo ''
cat "$SPLIT_DIR/core.js"
echo ''
cat "$SPLIT_DIR/rooms.js"
echo ''
cat "$SPLIT_DIR/ostia.js"
echo ''
cat "$SPLIT_DIR/start.js"
echo '</script>'
echo '</body>'
echo '</html>'
} > "$OUTPUT"

# Pattern per Codex canon-0033: root index.html must always be the build output
cp "$OUTPUT" "$SPLIT_DIR/index.html"
cp "$OUTPUT" "$REPO_ROOT/index.html"

echo "Built: $(wc -l < "$OUTPUT") lines"
echo "  -> $OUTPUT"
echo "  -> $SPLIT_DIR/index.html"
echo "  -> $REPO_ROOT/index.html"
