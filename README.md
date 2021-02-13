# Cubing At Home Discord Bot
[![Discord](https://img.shields.io/discord/690084292323311720.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/FWcJFNFMAn)

This is the custom bot created for the Cubing@Home Discord server.


## Commands

### `scramble` *$event* *$number*

**Returns a set number of randomly generated scrambles.**


*$event* (**NOT** case sensitive):
- **333**, 3x3, 3x3x3, 3, 33
- **222**, 2x2, 2x2x2, 2, 22
- **444**, 4x4, 4x4x4, 4, 44
- **555**, 5x5, 5x5x5, 5, 55
- **666**, 6x6, 6x6x6, 6, 66
- **777**, 7x7, 7x7x7, 7, 77
- **OH**, 333oh, 3oh
- **FMC**, fm, fmc
- **pyram**, pyra, pyraminx
- **minx**, mega, megaminx
- **skewb**, sk, skb
- **bld**, 3bld, 3bf, bf
- **sq1**, squan, squareone, square1
- **clock**, clk, clok

*$number* (defaults to 1): must be an integer between 1 and 5 (doesn't error out at 5, simply caps it.)



### `wca` *$wca_id*


**Gets basic information from a user's WCA profile.**


### `help`
**Gets basic command help.**
    

## Bug Reporting/ Issue Request
Please open an issue with detailed information to request an issue or report a bug! 

## Acknowledgement

The code in  `/utils/scrambling` is from https://github.com/euphwes/pyTwistyScrambler, modified for this project. The majority of that code is from https://github.com/cs0x7f/cstimer. Each of those projects also borrow a lot of code from others, and are usually linked in the files themselves.

The icons in `/utils/icons` are from https://github.com/cubing/icons, converted to png because of how annoying it is to use svgs in Discord.js embeds.