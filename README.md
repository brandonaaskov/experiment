# Experiment

This is an Angular playground/sandbox to either fork from or just dive into and play around with. Nothing crazy. This is a thing you'd either fork and/or build off of. Setting up an app environment is such a pain in the butt, and this makes it a lot easier. Tools like `yo` are great, but still need configuration and that's another barrier to entry.

## First Order Retrievability

You see, having working examples to look at makes it _far_ easier to start working. And having that code in front of you with a simple command to get up and running is key. First-order retrievability comes from [Adam Savage](http://www.wired.com/2012/08/inside-adam-savages-toolbox/) (of Mythbusters fame), as far as I can tell. It's the key to working fast, in my opinion. It breaks down walls. Which is a great segue to...

## Getting Up and Running
```
npm install
bower install
```

If you don't have gulp installed locally, you'll need to `npm install -g gulp`.

Then just `gulp` to get a build and a local server running on port 3000. If you need to change the port, you can do that in `gulpfile.js`.
