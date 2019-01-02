# FuraffinityExport

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.3.

## Export Format

Application returns a file with an extension .faxp *(fa export)*
Formatting is *JSON*

JSON will be a list of individual submissions that are from Fur Affinity.
Each item in the list will be in this format
```
imageURL: string; // the download url for the submission file
title: string;
description: string;
rating: string; // 'General', 'Mature', 'Adult'
scraps: boolean;
tags: string[];
```
