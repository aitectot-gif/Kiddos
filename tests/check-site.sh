#!/usr/bin/env bash
# Static checks for the Kiddos Paradise site. Run from anywhere: bash tests/check-site.sh
cd "$(dirname "$0")/.." || exit 1

PAGES="index.html about.html programs.html curriculum.html evening-activities.html admissions.html gallery.html contact.html privacy.html 404.html"
fails=0
fail() { echo "FAIL: $*"; fails=$((fails + 1)); }

for p in $PAGES; do
  [ -f "$p" ] || { fail "$p missing"; continue; }
  grep -q 'href="tel:+919972776012"' "$p" || fail "$p: no tel link for 99727 76012"
  grep -q 'href="tel:+919187963957"' "$p" || fail "$p: no tel link for 91879 63957"
  grep -q '99727 76012' "$p" || fail "$p: number 99727 76012 not displayed"
  grep -q '91879 63957' "$p" || fail "$p: number 91879 63957 not displayed"
  h1=$(grep -o '<h1[ >]' "$p" | wc -l)
  [ "$h1" -eq 1 ] || fail "$p: expected 1 <h1>, found $h1"
  grep -q '<title>[^<]\+</title>' "$p" || fail "$p: missing <title>"
  grep -q 'assets/css/styles.css' "$p" || fail "$p: stylesheet not linked"
  grep -q 'assets/js/main.js' "$p" || fail "$p: script not linked"

  # Internal links: page.html, page.html#id, #id
  for href in $(grep -o 'href="[^"]*"' "$p" | sed 's/^href="//;s/"$//'); do
    case "$href" in
      http*|mailto:*|tel:*|assets/*|https*) continue ;;
    esac
    file="${href%%#*}"; file="${file%%\?*}"; file="${file#/}"; anchor=""
    [[ "$href" == *"#"* ]] && anchor="${href#*#}"
    [ -z "$file" ] && file="$p"
    [ -f "$file" ] || { fail "$p: link to missing file '$href'"; continue; }
    if [ -n "$anchor" ]; then
      grep -q "id=\"$anchor\"" "$file" || fail "$p: link '$href' has no matching id in $file"
    fi
  done
done

# Every page must request the same CSS/JS version (bump ?v= on all pages together after changing them)
versions=$(grep -hoE 'styles\.css\?v=[^"]*|main\.js\?v=[^"]*' $PAGES | sort -u | wc -l)
[ "$versions" -eq 2 ] || fail "CSS/JS ?v= version differs between pages (or is missing)"

# Repo-wide content rules (deployable files only)
deploy_files=$(find . -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' -o -name '*.xml' -o -name '*.txt' \) \
  -not -path './_draft/*' -not -path './docs/*' -not -path './.git/*' -not -path './tests/*')
grep -l 'unsplash' $deploy_files 2>/dev/null | while read -r f; do echo "FAIL: stock photo reference in $f"; done | grep . && fails=$((fails + 1))
# WhatsApp: confirmed number is 99727 76012 only; every page has the floating button
grep -ho 'wa\.me/[0-9]*\|api\.whatsapp[^"]*' $deploy_files 2>/dev/null | grep -v '^wa\.me/919972776012$' | sort -u | while read -r w; do echo "FAIL: unconfirmed WhatsApp link $w"; done | grep . && fails=$((fails + 1))
for p in $PAGES; do
  grep -q 'class="whatsapp-float" href="https://wa\.me/919972776012' "$p" || fail "$p: WhatsApp button missing"
done

# Logo must be byte-identical to the supplied file
if [ -f assets/img/kiddos-paradise-logo.png ]; then
  cmp -s assets/img/kiddos-paradise-logo.png "docs/brief/Kiddos Paradise - Logo.png" || fail "logo differs from supplied file"
else
  fail "assets/img/kiddos-paradise-logo.png missing"
fi

# No font sizes below 12px
if [ -f assets/css/styles.css ]; then
  small=$(grep -o 'font-size:[0-9.]\+px' assets/css/styles.css | sed 's/font-size://;s/px//' | awk '$1 < 12' | sort -u | tr '\n' ' ')
  [ -z "$small" ] || fail "styles.css has font sizes below 12px: $small"
else
  fail "assets/css/styles.css missing"
fi

if [ "$fails" -eq 0 ]; then echo "PASS: all site checks"; else echo "$fails check(s) failed"; exit 1; fi
