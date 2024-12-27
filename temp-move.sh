#!/bin/bash

# Define the destination directory
DEST_DIR="/mnt/music/music/Big Star/#1 Album"

# Create the destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# List of files to move
files=(
"folder.jpg"
"large_cover.jpg"
"12 - Big Star - St 1006 (Remastered 2024).flac"
"04 - Big Star - Thirteen (Remastered 2024).flac"
"06 - Big Star - The India Song (Remastered 2024).flac"
"03 - Big Star - In The Street (Remastered 2024).flac"
"05 - Big Star - Don't Lie To Me (Remastered 2024).flac"
"09 - Big Star - Give Me Another Chance (Remastered 2024).flac"
"08 - Big Star - My Life Is Right (Remastered 2024).flac"
"10 - Big Star - Try Again (Remastered 2024).flac"
"01 - Big Star - Feel (Remastered 2024).flac"
"07 - Big Star - When My Baby's Beside Me (Remastered 2024).flac"
"11 - Big Star - Watch The Sunrise (Remastered 2024).flac"
"02 - Big Star - The Ballad Of El Goodo (Remastered 2024).flac"
)

# Move each file to the destination directory
for file in "${files[@]}"; do
    mv "$file" "$DEST_DIR"
done
