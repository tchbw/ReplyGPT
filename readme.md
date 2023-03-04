# How to run

## Running the code
Do an npm install:
```
npm install
```

## Building the code
Build the extension with webpack:
```
npm run build
```

## Loading into Chrome
1. Go to `chrome://extensions` in Chrome
2. There’s a “Developer mode” switch. Turn it on.
3. Click “Load unpacked” button and select the ```dist``` folder created by webpack
4. If you make a code change, you need to refresh the plugin. There's a little refresh icon in the same page to do so.