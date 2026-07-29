import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, window, shell, layout } from "./utils";

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
        description: "change f9 to fastforward (only when hyper is NOT held)",
        type: "basic",
        from: {
          key_code: "f9",
        },
        to: [
          {
            key_code: "fastforward",
          },
        ],
        conditions: [
          {
            type: "variable_unless",
            name: "hyper",
            value: 1
          }
        ],
      },
      {
        description: "f7 stays f7 when hyper is held",
        type: "basic",
        from: {
          key_code: "f7",
        },
        to: [
          {
            key_code: "f7",
          },
        ],
        conditions: [
          {
            type: "variable_if",
            name: "hyper",
            value: 1
          }
        ],
      },
      {
        description: "f8 stays f8 when hyper is held",
        type: "basic",
        from: {
          key_code: "f8",
        },
        to: [
          {
            key_code: "f8",
          },
        ],
        conditions: [
          {
            type: "variable_if",
            name: "hyper",
            value: 1
          }
        ],
      },
      {
        description: "f9 stays f9 when hyper is held",
        type: "basic",
        from: {
          key_code: "fastforward",
        },
        to: [
          {
            key_code: "f9",
          },
        ],
        conditions: [
          {
            type: "variable_if",
            name: "hyper",
            value: 1
          }
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
    b: {
      g: open("https://github.com/"),
      y: open("https://youtube.com"),
      // reva
      r: open("https://mail.google.com/mail/u/0/#inbox"),
      i: open("https://instagram.com"),
    },

    // o = "Open" applications
    o: {
      // "b" for browser
      b: app("Zen"),
      n: app("Firefox Developer Edition"),
      v: app("Visual Studio Code"),
      d: app("Discord"),
      f: app("Figma"),
      // "h" for help ;(
      h: app("Claude"),
      t: app("Telegram"),
      s: app("Spotify"),
      x: app("Nuage"),
      // "C" for cli
      c: app("Ghostty"),
      // g: app("GitHub Desktop"),
      w: app("WhatsApp"),
      e: app("Finder"),
      // "P" for password
      p: app("Bitwarden"),
      comma: app("System Settings"),
      grave_accent_and_tilde: app("Activity Monitor")
    },

    // TODO: This doesn't quite work yet.
    // l = "Layouts" via Raycast's custom window management
    l: {
      // Coding layout
      c: layout({
        apps: [
          { name: "Visual Studio Code", pos: "left-half" },
          { name: "Claude", pos: "right-half" },
        ]
      })
    },

    // w = "Window" via raycast windown manager
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
      c: window("center"),
      r: window("restore"),
      u: window("previous-display"),
      o: window("next-display"),
      i: window("top-half"),
      j: window("left-half"),
      l: window("right-half"),
      k: window("bottom-half"),
      f: window("maximize"),
      g: window("reasonable-size"),
      y: window("maximize-height"),
      m: window("toggle-fullscreen"),
      hyphen: window("make-smaller"),
      equal_sign: window("make-larger"),
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
      a: open("-a Launchpad"),
      // set output devices via Set Audio Device[https://github.com/raycast/extensions/blob/fc737c076e1698e51f0378cd46293358e019ee91/extensions/audio-device/README.md] raycast extension
      // Macbook Pro Speakers
      1: open("raycast://extensions/benvp/audio-device/use-combo1?launchType=background"),
      // SRS-XB43 (my bluetooth speaker)
      2: open("raycast://extensions/benvp/audio-device/use-combo2?launchType=background"),
      // realme Buds Air7 Pro
      3: open("raycast://extensions/benvp/audio-device/use-combo3?launchType=background"),
      // bluetooth connection managing
      b: open("raycast://extensions/VladCuciureanu/toothpick/manage-bluetooth-connections")
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

    // t = toothpick (raycast bluetooth managing extension)
    t: {
      1: open(
        "raycast://extensions/VladCuciureanu/toothpick/toggle-favorite-device-1?launchType=background"
      ),
      2: open(
        "raycast://extensions/VladCuciureanu/toothpick/toggle-favorite-device-2?launchType=background"
      ),
    },

    // c = Capture using shortcuts assigned in shottr
    // c = Musi"c"
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
      // capture active window
      w: {
        description: 'Active window',
        to: [
          {
            key_code: "1",
            modifiers: ["left_command", "left_shift", "left_option"],
          },
        ],
      },
      o: app("Shottr"),
      p: {
        to: [{ key_code: "play_or_pause" }]
      },
      b: {
        to: [{ key_code: "rewind" }]
      },
      n: {
        to: [{ key_code: "fastforward" }]
      },
      // like now playing song in spotify
      l: open("raycast://extensions/mattisssa/spotify-player/like?launchType=background"),
      // change spotify output device
      comma: open("raycast://extensions/mattisssa/spotify-player/devices"),
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
  {
    description: "Change Slach to Spacebar when GD is focused",
    manipulators: [
      {
        type: "basic",
        from: {
          key_code: "slash",
        },
        to: [
          {
            key_code: "spacebar",
          },
        ],
        conditions: [
          {
            type: "frontmost_application_if",
            file_paths: [
              "/Users/hanishiryuu/Library/Application Support/Steam/steamapps/common/Geometry Dash/Geometry Dash.app",
            ],
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
