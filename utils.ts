import type { To, KeyCode, Manipulator, KarabinerRules, WindowManagementPosition, ModifiersKeys } from "./types";

/**
 * Custom way to describe a command in a layer
 */
export interface LayerCommand {
  to: To[];
  description?: string;
}

type HyperKeySublayer = {
  // The ? is necessary, otherwise we'd have to define something for _every_ key code
  [key_code in KeyCode]?: LayerCommand;
};

/**
 * Create a Hyper Key sublayer, where every command is prefixed with a key
 * e.g. Hyper + O ("Open") is the "open applications" layer, I can press
 * e.g. Hyper + O + G ("Google Chrome") to open Chrome
 */
export function createHyperSubLayer(
  sublayer_key: KeyCode,
  commands: HyperKeySublayer,
  allSubLayerVariables: string[]
): Manipulator[] {
  const subLayerVariableName = generateSubLayerVariableName(sublayer_key);

  return [
    // When Hyper + sublayer_key is pressed, set the variable to 1; on key_up, set it to 0 again
    {
      description: `Toggle Hyper sublayer ${sublayer_key}`,
      type: "basic",
      from: {
        key_code: sublayer_key,
        modifiers: {
          optional: ["any"],
        },
      },
      to_after_key_up: [
        {
          set_variable: {
            name: subLayerVariableName,
            // The default value of a variable is 0: https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/conditions/variable/
            // That means by using 0 and 1 we can filter for "0" in the conditions below and it'll work on startup
            value: 0,
          },
        },
      ],
      to: [
        {
          set_variable: {
            name: subLayerVariableName,
            value: 1,
          },
        },
      ],
      // This enables us to press other sublayer keys in the current sublayer
      // (e.g. Hyper + O > M even though Hyper + M is also a sublayer)
      // basically, only trigger a sublayer if no other sublayer is active
      conditions: [
        ...allSubLayerVariables
          .filter(
            (subLayerVariable) => subLayerVariable !== subLayerVariableName
          )
          .map((subLayerVariable) => ({
            type: "variable_if" as const,
            name: subLayerVariable,
            value: 0,
          })),
        {
          type: "variable_if",
          name: "hyper",
          value: 1,
        },
      ],
    },
    // Define the individual commands that are meant to trigger in the sublayer
    ...(Object.keys(commands) as (keyof typeof commands)[]).map(
      (command_key): Manipulator => ({
        ...commands[command_key],
        type: "basic" as const,
        from: {
          key_code: command_key,
          modifiers: {
            optional: ["any"],
          },
        },
        // Only trigger this command if the variable is 1 (i.e., if Hyper + sublayer is held)
        conditions: [
          {
            type: "variable_if",
            name: subLayerVariableName,
            value: 1,
          },
        ],
      })
    ),
  ];
}

/**
 * Create all hyper sublayers. This needs to be a single function, as well need to
 * have all the hyper variable names in order to filter them and make sure only one
 * activates at a time
 */
export function createHyperSubLayers(subLayers: {
  [key_code in KeyCode]?: HyperKeySublayer | LayerCommand;
}): KarabinerRules[] {
  const allSubLayerVariables = (
    Object.keys(subLayers) as (keyof typeof subLayers)[]
  ).map((sublayer_key) => generateSubLayerVariableName(sublayer_key));

  return Object.entries(subLayers).map(([key, value]) =>
    "to" in value
      ? {
          description: `Hyper Key + ${key}`,
          manipulators: [
            {
              ...value,
              type: "basic" as const,
              from: {
                key_code: key as KeyCode,
                modifiers: {
                  optional: ["any"],
                },
              },
              conditions: [
                {
                  type: "variable_if",
                  name: "hyper",
                  value: 1,
                },
                ...allSubLayerVariables.map((subLayerVariable) => ({
                  type: "variable_if" as const,
                  name: subLayerVariable,
                  value: 0,
                })),
              ],
            },
          ],
        }
      : {
          description: `Hyper Key sublayer "${key}"`,
          manipulators: createHyperSubLayer(
            key as KeyCode,
            value,
            allSubLayerVariables
          ),
        }
  );
}

function generateSubLayerVariableName(key: KeyCode) {
  return `hyper_sublayer_${key}`;
}

/**
 * Shortcut for "open" shell command
 */
export function open(...what: string[]): LayerCommand {
  return {
    to: what.map((w) => ({
      shell_command: `open ${w}`,
    })),
    description: `Open ${what.join(" & ")}`,
  };
}

/**
 * Utility function to create a LayerCommand from a tagged template literal
 * where each line is a shell command to be executed.
 */
export function shell(
  strings: TemplateStringsArray,
  ...values: any[]
): LayerCommand {
  const commands = strings.reduce((acc, str, i) => {
    const value = i < values.length ? values[i] : "";
    const lines = (str + value)
      .split("\n")
      .filter((line) => line.trim() !== "");
    acc.push(...lines);
    return acc;
  }, [] as string[]);

  return {
    to: commands.map((command) => ({
      shell_command: command.trim(),
    })),
    description: commands.join(" && "),
  };
}

/**
 * Shortcut for managing window sizing
 */
export function window(name: WindowManagementPosition): LayerCommand {
  return {
    to: [
      {
        shell_command: `open -g raycast://extensions/raycast/window-management/${name}`,
      },
    ],
    description: `Window: ${name}`,
  };
}

/**
 * Shortcut for "Open an app" command (of which there are a bunch)
 */
export function app(name: string): LayerCommand {
  return open(`-a '${name}.app'`);
}

/**
 * Utility for laying out predetermined windows via raycast window manager (for free even)
 */
export function layout({
  apps,
  waitMs = 2000,
}: {
  apps: { name: string, pos: WindowManagementPosition}[];
  waitMs?: number;
}): LayerCommand {
  const appEntries = apps.map(({ name, pos }) => [name, pos] as [string, WindowManagementPosition]);

  const openAll = appEntries
    .map(([name]) => `open -a '${name}.app'`)
    .join(" && ");

  const wait = `sleep ${waitMs / 1000}`;

  const positionAll = appEntries
    .map(
      ([name, pos]) =>
        `open -a '${name}.app' && sleep 0.3 && open -g 'raycast://extensions/raycast/window-management/${pos}'`
    )
    .join(" && ");

  const fullCommand = `${openAll} && ${wait} && ${positionAll}`;

  return {
    to: [{ shell_command: fullCommand }],
    description: `Layout: ${appEntries.map(([name]) => name).join(", ")}`,
  };
}


/**
 * Shortcut for "switching to a language" command
 */
export function switchToLanguage(languageCode: string): LayerCommand {
  return {
    to: [
      {
        select_input_source: {
          language: languageCode,
        },
      },
    ],
    description: `Switch keyboard language to ${languageCode}`,
  };
}

/**
 * Shortcut for making a key combination with a key code and modifiers
 */
export function keyCombination({ 
  key_code,
  modifiers,
  description 
} : { key_code: KeyCode, modifiers: ModifiersKeys[], description: string }): LayerCommand {
  return {
    description: description,
    to: [
      {
        key_code: key_code,
        modifiers: modifiers
      }
    ]
  }
}

/**
 * Shortcut for a key press
 */
export function bareKey({ 
  key_code,
  description 
} : { key_code: KeyCode, description?: string }): LayerCommand {
  return {
    description: description ?? key_code,
    to: [
      {
        key_code: key_code,
      }
    ]
  }
}


/**
 * Shortcut for mapping a key to another on an external keyboard
 * @param from_key_code key_code of the built-in key when pressed on the external keyboard
 * @param to_key_code key_code of the desired key
 * @param device device vendor and product ids (can be found in the Karabiner-EventViewer/devices)
 */
export function changeKeyActionOnExternalKeyboard({
  from_key_code,
  to_key_code,
  device,
}: { 
  from_key_code: KeyCode;
  to_key_code: KeyCode;
  device: { 
    name?: string;
    vendor_id: number;
    product_id: number;
  };
}
): Manipulator {
  return {
    description: `Map ${from_key_code} → ${to_key_code} on ${device.name ?? device.product_id}`,
    type: "basic",
    from: {
      key_code: from_key_code,
    },
    to: [
      {
        key_code: to_key_code,
      },
    ],
    conditions: [
      {
        type: "device_if",
        identifiers: [
          {
            vendor_id: device.vendor_id,
            product_id: device.product_id,
            is_keyboard: true,
          }
        ]
      },
    ],
  }
}
