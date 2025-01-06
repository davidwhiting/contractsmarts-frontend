#!/bin/bash
oci os object bulk-upload \
    --bucket-name "addin-hosting" \
    --prefix "addin/v0.9/" \
    --src-dir "v0.1.0/dist/" \
    --include "*" \
    --verify-checksum \
    --overwrite
