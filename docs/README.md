# BottingAtHome - Commands Documentation

## `setprefix $prefix`

The default prefix for the bot is `s!`. Certain restrictions apply to the `$prefix` (regex: `/([a-zA-z])?[!\$&^|\*\?]$/gm`). Must have administrator role to use this.


## `scramble $event $num`

Can also be called with `scr`, or just the event name (ie `s!3`). The code used to generate these scrambles is forked from CSTimer, and as such, most event scrambles supported there are supported in BottingAtHome.

### `$event`

The type of scramble. Can be any of the following: 

#### WCA Events
- **3**
- **2**
- **4**
- **5**
- **6**
- **7**
- **oh**
- **fmc**
- **pyra**
- **sq1**
- **clock**
- **megaminx**
- **skewb**
- **3bld**
- **4bld**
- **5bld**
- **mbld**

#### Non-WCA Events
- **fto**
- **lsll**
- **zbll**
- **cll**
- **edge**
- **corner**
- **eoline**
- **f2l**
- **ll**
- **lse**
- **zbls**
- **zzll**
- **ell**
- **cmll**
- **pll**

### `$num`

The number of scrambles. It is capped at 5 for all events except for mbld.

## `wca $wca_id`

Get a basic overview of someone's WCA profile. `$wca_id` must be a valid WCA ID, ie) 2016MEUN01.

## `invite`

Sends you a dm with an link to add BottingAtHome to your own server.

## `help`

Sends you a link to this page.

## `suggest $suggestions`

Send me a suggestion about how to improve BottingAtHome!

## `suggestions`

Sends a list of your current suggestions to BottingAtHome. Once they are either added or denied, your suggestion will be deleted from the list.

## `changes`

Sends a list of recent updates to BottingAtHome.
