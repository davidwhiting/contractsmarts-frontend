#!/bin/bash
oci os object bulk-upload \
    --bucket-name "addin-hosting" \
    --prefix "addin/a/" \
    --src-dir "upload/a/" \
    --include "*" \
    --verify-checksum \
    --overwrite
