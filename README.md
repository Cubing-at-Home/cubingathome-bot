# Cubing At Home Discord Bot
[![Discord](https://img.shields.io/discord/690084292323311720.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/FWcJFNFMAn)

This is the custom bot originally created for the Cubing@Home Discord server, but constantly expanding with more cubing-related features.


## Commands

Please see [the docs](/docs/README.md) for command documentation.
## Bug Reporting/Feature Request
Please open an issue in this repo using [bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md) and clearly describe the issue. To request a new feature, please use [feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md).

## Acknowledgement

The code in  [/utils/scrambling](/utils/scrambling) is primarily from [cs0x7f/cstimer](https://github.com/cs0x7f/cstimer). The kilo scrambling is adapted from [this](https://gist.github.comtorchlight/994d1faf4359f969456bb47415c878ed) gist, from @xyzzy on the speedsolving forums, found [in this thread](https://www.speedsolving.com/threads/one-answer-software-question-thread.50244/page-21#post-1379853).

The logic in [/utils/visualizer](/utils/visualizer) is also from [cs0x7f/cstimer](https://github.com/cs0x7f/cstimer), specifically the `Draw Scramble` tool function. However, it is **heavily** edited so that it works with `canvas-node` rather than the intended web canvas. It can also be used stand-alone as a way to generate scrambles for almost any event using Node JS. The main function in `image.js` returns an image buffer, but can be modified to return a png, canvas object, etc..

The icons in [/utils/icons](/utils/icons) are from [cubing/icons](https://github.com/cubing/icons), converted to png because of how annoying it is to use svgs in Discord.js embeds.

Other resources used include:
- [World Cube Association API](https://www.worldcubeassociation.org/api/v0), for `wca` command
- [alg.cubing.net](alg.cubing.net), for `scramble` links
- [Country Flags API](https://www.countryflags.io/), for the flags used in `wca` command