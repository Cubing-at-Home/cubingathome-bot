# Cubing At Home Discord Bot
[![Discord](https://img.shields.io/discord/690084292323311720.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/FWcJFNFMAn)

This is the custom bot originally created for the Cubing@Home Discord server, but constantly expanding with more cubing-related features.


## Commands

### `scramble` *$event* *$number*

**Returns a set number of randomly generated scrambles, AND scramble previews available for 30 seconds after being called**


*$event* (**NOT** case sensitive):
- **333**, 3x3, 3x3x3, 3, 33
- **222**, 2x2, 2x2x2, 2, 22
- **444**, 4x4, 4x4x4, 4, 44
- **555**, 5x5, 5x5x5, 5, 55
- **666**, 6x6, 6x6x6, 6, 66
- **777**, 7x7, 7x7x7, 7, 77
- **OH**, 333oh, 3oh
- **333fm**, fm, fmc, 333fmc, 33fm, 33fmc
- **pyram**, pyra, pyraminx
- **minx**, mega, megaminx
- **skewb**
- **333bf**, 3bld, 3bf, bf, 33bld, 33bf, 333bld
- **sq1**, squan, squareone, square1
- **clock**
- **333mbf**, mbld, 333mbld, 3x3mbld, 33mbld *(note: default is 3, max is 25)*
- **444bf**, 4bld, 4bf, 44bld, 44bf, 444bld
- **555bf**, 5bld, 5bf, 55bld, 55bf, 5555bld
- *(3x3 subsets)*: **zbll, cll, edge, corner, eoline, f2l, ll, lse, lsll, zbls, zzll, ell, cmll, pll**

*$number* (defaults to 1): must be an integer between 1 and 5 (doesn't error out at 5, simply caps it.)



### `wca` *$wca_id*


**Gets basic information from a user's WCA profile.**


### `help`
**Gets help command.**
    
### `invite`
**Invite to your own server**

### `changes`
**View recent updates to the bot**

### `setprefix` *$new_prefix*
**Customize the prefix of the bot, must have *Administrator* role**

### `suggest` *$suggestions*
**Suggest changes and give feedback directly in Discord! You are limited to having 5 open suggestions at a time, and will be banned from suggesting if command is abused.**

## To Do
### In-Progress
- Solver, for any scramble AND previously called scramble on react (necessary?)
- Add `log` command to get the newest updates (Github api?)

### Maybe?
- Better logo
- Head-to-head comparison
- Competition feature (eh)
- OAuth w/ WCA account?? (probably possible but would have to change hosting to have storage)
- Alg search with algdb.net
- Discord solves using three.js/canvas??? (I think this would be very cool but hard to implement)
## Bug Reporting/Feature Request
Please open an issue in this repo using [bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md) and clearly describe the issue. To request a new feature, please use [feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md).

## Acknowledgement

The code in  [/utils/scrambling](/utils/scrambling) is from [euphwes/pyTwistyScrambler](https://github.com/euphwes/pyTwistyScrambler), modified for this project. The majority of that code is from [cs0x7f/cstimer](https://github.com/cs0x7f/cstimer). Each of those projects also borrow a lot of code from others, and are usually linked in the files themselves.

The logic in [/utils/visualizer](/utils/visualizer) is also from [cs0x7f/cstimer](https://github.com/cs0x7f/cstimer), specifically the `Draw Scramble` tool function. However, it is **heavily** edited so that it works with `canvas-node` rather than the intended web canvas. It can also be used stand-alone as a way to generate scrambles for almost any event using Node JS. The main function in `image.js` returns an image buffer, but can be modified to return a png, canvas object, etc..

The icons in [/utils/icons](/utils/icons) are from [cubing/icons](https://github.com/cubing/icons), converted to png because of how annoying it is to use svgs in Discord.js embeds.

Other resources used include:
- [World Cube Association API](https://www.worldcubeassociation.org/api/v0), for `wca` command
- [alg.cubing.net](alg.cubing.net), for `scramble` links
- [Country Flags API](https://www.countryflags.io/), for the flags used in `wca` command