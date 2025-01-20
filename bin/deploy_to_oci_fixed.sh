#!/bin/bash
python oci_upload.py \
    --bucket addin-hosting \
    --local-dir excel-addin/dist/ \
    --bucket-prefix addin/v1.0
