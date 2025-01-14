#!/bin/bash

BUCKET="addin-hosting"
PREFIX="addin/a/"

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

update_all_content_types() {
    for extension in "${!content_types[@]}"; do
        local content_type="${content_types[$extension]}"
        
        echo "Processing files with extension .$extension to content-type $content_type"
        
        oci os object list \
            --bucket-name "$BUCKET" \
            --prefix "$PREFIX" \
            --query "data[?ends_with(name, '.$extension')].name" \
            --raw-output | while read -r object_name; do
            
            echo "Updating content-type for: $object_name"
            
            oci os object update \
                --bucket-name "$BUCKET" \
                --name "$object_name" \
                --content-type "$content_type"
        done
    done
}

# Run all updates
update_all_content_types