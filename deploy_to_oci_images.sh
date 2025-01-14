#!/bin/bash

BUCKET="addin-hosting"
PREFIX="addin/a/"
SRCDIR="upload/a/"

# Define content type mappings
declare -A content_types=(
    ["html"]="text/html"
    ["js"]="application/javascript"
    ["css"]="text/css"
    ["svg"]="image/svg+xml"
    ["png"]="image/png"
    ["jpg"]="image/jpeg"
    ["xml"]="application/xml"
)

oci os object bulk-upload \
    --bucket-name "$BUCKET" \
    --prefix "$PREFIX" \
    --src-dir "$SRCDIR" \
    --include "*.css" \
    --content-type "text/css" \
    --verify-checksum \
    --overwrite

oci os object bulk-upload \
    --bucket-name "$BUCKET" \
    --prefix "$PREFIX" \
    --src-dir "$SRCDIR" \
    --include "*.svg" \
    --content-type "image/svg+xml" \
    --verify-checksum \
    --overwrite

oci os object bulk-upload \
    --bucket-name "$BUCKET" \
    --prefix "$PREFIX" \
    --src-dir "$SRCDIR" \
    --include "*.xml" \
    --content-type "application/xml" \
    --verify-checksum \
    --overwrite

oci os object bulk-upload \
    --bucket-name "$BUCKET" \
    --prefix "$PREFIX" \
    --src-dir "$SRCDIR" \
    --include "*.png" \
    --content-type "image/png" \
    --verify-checksum \
    --overwrite

oci os object bulk-upload \
    --bucket-name "$BUCKET" \
    --prefix "$PREFIX" \
    --src-dir "$SRCDIR" \
    --include "*.js" \
    --content-type "application/javascript" \
    --verify-checksum \
    --overwrite