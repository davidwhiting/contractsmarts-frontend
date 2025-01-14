#!/bin/bash
oci os object bulk-upload \
    --bucket-name "addin-hosting" \
    --prefix "addin/a/" \
    --src-dir "upload/a/" \
    --include "*.html" \
    --content-type "text/html" \
    --verify-checksum \
    --overwrite
