# How to Build application 

## 1. electron App test
Check if the electron app is performing fine by running the command below:
```
npm bundle:test or yarn bundle:test
```

## 2. electron App build 
If the test is successful, try to build,

### Mac OS
```
npm bundle:osx or yarn bundle:osx
```

### Windows
```
npm bundle:win64 or yarn bundle:win64
```

## 3. Run App 
check the dist directory

## Skip prebuild or prebundle
The prebuild and prebundle performed in advance when building the app are
This is to update the code contents built under the resources folder.

If there is no update in the code contents, it is okay to do it only once for the first time.
If you want to omit the prebuild and prebundle commands, run the commands as follows

### Mac os
```
yarn electron-builder build --mac
```
### Windows
```
yarn electron-builder build --x64
```

