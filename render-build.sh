#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "--- Installing Server Dependencies ---"
cd server
npm install

echo "--- Installing Client Dependencies ---"
cd ../client
npm install

echo "--- Building Client ---"
npm run build

echo "--- Build Complete ---"
