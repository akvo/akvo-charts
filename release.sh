#!/bin/bash
# This script is used to generate new version for nmis-mobile

APK_NAME="akvo-charts"
CURRENT_TAG=$(git describe --abbrev=0)
# GET CURRENT VERSION IN /package.json
CURRENT_VERSION=$(cat ./package.json | grep "\"version"\" | awk -F\" '{print $4}')
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" != "main" ]]; then
    printf "Current Branch: %s\n" "${CURRENT_BRANCH}"
    printf "Please checkout to main branch\n"
    exit 0
else
    git pull
fi

MAJOR=$(echo "${CURRENT_TAG}" | awk -F. '{print $1}')
MINOR=$(echo "${CURRENT_TAG}" | awk -F. '{print $2}')
PATCH=$(echo "${CURRENT_TAG}" | awk -F. '{print $3}')

printf "Current Version: %s\n" "${CURRENT_VERSION}"
printf "Last Release: %s\n" "${CURRENT_TAG}"
read -r -p "Do you want to release new version? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]; then
    read -r -p "Please select release type [major/minor/patch] " response
    # GENERATE NEW VERSION
    if [[ "$response" == "major" ]]; then
        NEW_VERSION=$(echo "${CURRENT_TAG}" | awk -F. '{$1 = $1 + 1; $2=0; $3=0;} 1' OFS=.)
    elif [[ "$response" == "minor" ]]; then
        NEW_VERSION="${MAJOR}.$((MINOR + 1)).0"
    elif [[ "$response" == "patch" ]]; then
        NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))"
    else
        printf "Aborted\n"
        exit 0
    fi
    DESC=$(git log --pretty=format:"%s" -n 20 "${CURRENT_TAG}"..main)
    READ_MORE="\nRead more: https://github.com/akvo/akvo-charts/compare/${CURRENT_TAG}...main"
    printf "Processing New Release: %s %s\n" "${APK_NAME}" "${NEW_VERSION}"
    # UPDATE VERSION IN /package.json
    sed -i "s/\"version\": \"${CURRENT_VERSION}\"/\"version\": \"${NEW_VERSION}\"/g" ./package.json
    # Commit and Push new tag
    git add ./package.json
    echo "Update version to ${NEW_VERSION}"
    git commit -m "Update version to ${NEW_VERSION}"
    git push
    git tag -a "${NEW_VERSION}" -m "Release ${NEW_VERSION}"
    git push --tags
    gh release create "${NEW_VERSION}" -t "${NEW_VERSION}"
    exit 0
else
    printf "Aborted\n"
    exit 0
fi
