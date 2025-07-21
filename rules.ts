import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, windowManagement, shell } from "./utils";

const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Caps Lock -> Hyper Key",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [
          {
            key_code: "fn",
          },
        ],
        type: "basic",
      },
      {
        description: "Map left_command → left_option on Monsgeek",
        type: "basic",
        from: {
          key_code: "left_command",
        },
        to: [
          {
            key_code: "left_option",
          },
        ],
        conditions: [
          {
            type: "device_if",
            identifiers: [
              {
                vendor_id: 12625,
                product_id: 16400,
                is_keyboard: true,
              }
            ]
          },
        ],
      },
      {
        description: "Map left_option → left_command on Monsgeek",
        type: "basic",
        from: {
          key_code: "left_option",
        },
        to: [
          {
            key_code: "left_command",
          },
        ],
        conditions: [
          {
            type: "device_if",
            identifiers: [
              {
                vendor_id: 12625,
                product_id: 16400,
                is_keyboard: true
              }
            ]
          }
        ],
      },
      {
        description: "change f7 to rewind",
        type: "basic",
        from: {
          key_code: "f7",
        },
        to: [
          {
            key_code: "rewind",
          },
        ],
      },
      {
        description: "change f8 to play/pause",
        type: "basic",
        from: {
          key_code: "f8",
        },
        to: [
          {
            key_code: "play_or_pause",
          },
        ],
      },
      {
        description: "change f9 to fastforward",
        type: "basic",
        from: {
          key_code: "f9",
        },
        to: [
          {
            key_code: "fastforward",
          },
        ],
      },
      // {
      //   type: "basic",
      //   description: "Disable CMD + Tab to force Hyper Key usage",
      //   from: {
      //     key_code: "tab",
      //     modifiers: {
      //       mandatory: ["left_command"],
      //     },
      //   },
      //   to: [
      //     {
      //       key_code: "tab",
      //     },
      //   ],
      // },
    ],
  },
  ...createHyperSubLayers({
    // spacebar: open(
    //   "raycast://extensions/stellate/mxstbr-commands/create-notion-todo"
    // ),

    // b = browse
    // b: {
    //   g: open("https://github.com/"),
    //   y: open("https://youtube.com"),
    //   // reva
    //   r: open("https://mail.google.com/mail/u/0/#inbox"),
    //   // a3dm
    //   e: open("https://mail.google.com/mail/u/2/#inbox"),
    //   m: open("https://mangalib.me")
    // },

    // o = "Open" applications
    o: {
      b: app("Zen Browser"),
      v: app("Visual Studio Code"),
      d: app("Discord"),
      f: app("Figma"),
      // "h" for help ;(
      h: app("ChatGPT"),
      t: app("Telegram"),
      s: app("Spotify"),
      // "C" for cli
      c: app("Ghostty"),
      g: app("GitHub Desktop"),
      n: app("Notion"),
      w: app("WhatsApp")
    },

    // TODO: This doesn't quite work yet.
    // l = "Layouts" via Raycast's custom window management
    // l: {
    //   // Coding layout
    //   c: shell`
    //     open -a "Visual Studio Code.app"
    //     sleep 0.2
    //     open -g "raycast://customWindowManagementCommand?position=topLeft&relativeWidth=0.5"

    //     open -a "Terminal.app"
    //     sleep 0.2
    //     open -g "raycast://customWindowManagementCommand?position=topRight&relativeWidth=0.5"
    //   `,
    // },

    // w = "Window" via rectangle.app
    w: {
      h: {
        description: "Window: Hide",
        to: [
          {
            key_code: "h",
            modifiers: ["right_command"],
          },
        ],
      },
      c: windowManagement("center"),
      r: windowManagement("restore"),
      u: windowManagement("previous-display"),
      o: windowManagement("next-display"),
      i: windowManagement("top-half"),
      j: windowManagement("left-half"),
      l: windowManagement("right-half"),
      k: windowManagement("bottom-half"),
      f: windowManagement("maximize"),
      y: windowManagement("maximize-height"),
      hyphen: windowManagement("make-smaller"),
      equal_sign: windowManagement("make-larger"),
      comma: {
        description: "Window: Previous Tab",
        to: [
          {
            key_code: "tab",
            modifiers: ["right_control", "right_shift"],
          },
        ],
      },
      period: {
        description: "Window: Next Tab",
        to: [
          {
            key_code: "tab",
            modifiers: ["right_control"],
          },
        ],
      },
      b: {
        description: "Window: Back",
        to: [
          {
            key_code: "open_bracket",
            modifiers: ["right_command"],
          },
        ],
      },
      n: {
        description: "Window: Forward",
        to: [
          {
            key_code: "close_bracket",
            modifiers: ["right_command"],
          },
        ],
      },
    },

    // s = "System"
    s: {
      u: {
        to: [
          {
            key_code: "volume_increment",
          },
        ],
      },
      j: {
        to: [
          {
            key_code: "volume_decrement",
          },
        ],
      },
      i: {
        to: [
          {
            key_code: "display_brightness_increment",
          },
        ],
      },
      k: {
        to: [
          {
            key_code: "display_brightness_decrement",
          },
        ],
      },
      // "L"ock screen
      l: {
        to: [
          {
            key_code: "q",
            modifiers: ["right_control", "right_command"],
          },
        ],
      },
      p: {
        to: [
          {
            key_code: "play_or_pause",
          },
        ],
      },
      semicolon: {
        to: [
          {
            key_code: "fastforward",
          },
        ],
      },
      m: {
        to: [
          {
            key_code: "mission_control"
          }
        ]
      },
      e: {
        to: [
          {
            key_code: "down_arrow",
            modifiers: [
              "right_control"
            ]
          }
        ]
      },
      // "D"o not disturb toggle
      d: open(
        `raycast://extensions/yakitrak/do-not-disturb/toggle?launchType=background`
      ),
      c: open("raycast://extensions/raycast/system/open-camera"),
      // test internet speed
      t: open("raycast://extensions/tonka3000/speedtest/index"),
      // apps
      a: open("-a Launchpad")
    },

    // v = "moVe" which isn't "m" because we want it to be on the left hand
    // so that hjkl work like they do in vim
    v: {
      j: {
        to: [{ key_code: "left_arrow" }],
      },
      k: {
        to: [{ key_code: "down_arrow" }],
      },
      i: {
        to: [{ key_code: "up_arrow" }],
      },
      l: {
        to: [{ key_code: "right_arrow" }],
      },
      semicolon: {
        to: [{ key_code: "end" }],
      },
      h: {
        to: [{ key_code: "home" }],
      },
      // Magicmove via homerow.app
      m: {
        to: [{ key_code: "f", modifiers: ["right_control"] }],
        // TODO: Trigger Vim Easymotion when VSCode is focused
      },
      // Scroll mode via homerow.app
      s: {
        to: [{ key_code: "j", modifiers: ["right_control"] }],
      },
      d: {
        to: [{ key_code: "d", modifiers: ["right_shift", "right_command"] }],
      },
      u: {
        to: [{ key_code: "page_down" }],
      },
      y: {
        to: [{ key_code: "page_up" }],
      },
    },

    // b = bluetooth
    b: {
      1: open(
        "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1"
      ),
      2: open(
        "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2"
      ),
    },

    // c = Capture using shortcuts assigned in shottr
    c: {
      s: {
        description: "Fullscreen",
        to: [
          {
            key_code: "equal_sign",
            modifiers: ["left_command", "left_shift"],
          },
        ],
      },
      a: {
        description: "Area",
        to: [
          {
            key_code: "hyphen",
            modifiers: ["left_command", "left_shift"],
          },
        ],
      },
      d: {
        description: '"D"own - scrolling screenshot',
        to: [
          {
            key_code: "0",
            modifiers: ["left_command", "left_shift"],
          },
        ],
      },
      t: {
        description: '"T"ext recognition',
        to: [
          {
            key_code: "9",
            modifiers: ["left_command", "left_shift"],
          },
        ],
      },
      o: app("Shottr")
    },

    // r = "Raycast"
    r: {
      c: open("raycast://extensions/thomas/color-picker/pick-color?launchType=background"),
      e: open(
        "raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"
      ),
      p: open("raycast://extensions/raycast/raycast/confetti"),
    },
  }),
  {
    description: "Change Backspace to Delete when hyper key is held",
    manipulators: [
      {
        type: "basic",
        from: {
          key_code: "delete_or_backspace",
        },
        to: [
          {
            key_code: "delete_forward",
          },
        ],
        conditions: [
          {
            type: "variable_if",
            name: "hyper",
            value: 1
          },
        ],
      },
    ],
  },
  {
    description: "Hyper + Option + Backspace → Fn + Option + Backspace",
    manipulators: [
      {
        type: "basic",
        from: {
          key_code: "delete_or_backspace",
          modifiers: {
            mandatory: ["option"],
          },
        },
        to: [
          {
            key_code: "delete_or_backspace",
            modifiers: ["fn", "option"],
          },
        ],
        conditions: [
          {
            type: "variable_if",
            name: "hyper",
            value: 1,
          },
        ],
      },
    ],
  },
];

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: "Default",
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
