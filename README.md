# Steem Keychain for Mobile

React Native wallet for the Steem Blockchain

<a href='https://play.google.com/store/apps/details?id=com.mobilekeychain.steem&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://user-images.githubusercontent.com/3969643/126021936-a8d7c5e5-cfcf-42bb-a72c-5ddbacf3170a.png' width="200"/></a>
<img alt="Download on the App Store" src="https://user-images.githubusercontent.com/3969643/126021934-917a1d07-77e1-4f70-9b3b-e1a6dd04f8a6.png" width="200"/>

# Install

- `npm i`
- `cp android/gradle.properties.example android/gradle.properties`
- `cd ios; pod install`

# Run in dev environment

## Android:

`npm run android`

## iOS:

`npm run ios`

# Test production

## Android:

Bundle : `npm run android-bundle`
Test Production Release : `npm run android-release`

## iOS:

Coming soon

## Troubleshooting

- SHA1 error : `watchman watch-del-all && npm run clean`
