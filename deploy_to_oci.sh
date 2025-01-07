#!/bin/bash
oci os object bulk-upload \
    --bucket-name "addin-hosting" \
    --prefix "addin/v0.9/" \
    --src-dir "dist/v0.1.1/" \
    --include "*" \
    --verify-checksum \
    --overwrite
