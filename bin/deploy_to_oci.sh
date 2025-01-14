#!/bin/bash
oci os object bulk-upload \
    --bucket-name "addin-hosting" \
    --prefix "addin/v1.0/" \
    --src-dir "excel-addin/dist/" \
    --include "*" \
    --verify-checksum \
    --overwrite
