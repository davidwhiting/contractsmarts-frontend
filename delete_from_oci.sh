#!/bin/bash
oci os object bulk-delete \
    --bucket-name "addin-hosting" \
    --prefix "addin/v1.0/" \
    --force
