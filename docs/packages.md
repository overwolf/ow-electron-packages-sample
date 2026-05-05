
# Working with ow-electron packages

In order to add more/remove certain ow-electron "packages" from the project, simply edit the `overwolf.packages` array in the [package.json](/package.json) file, like so:

```json
{
  ...
  "overwolf": {
    "packages": [
      "gep",
      "overlay",
      "recorder"
    ]
  },
  ...
}
```

## Available packages detailed information
* [recorder](./recorder/recorder.md)
* [gep]()
* [overlay]()
