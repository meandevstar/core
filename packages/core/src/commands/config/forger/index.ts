import prompts from "prompts";
import { ConfigureBIP38 } from "./bip38";
import { ConfigureBIP39 } from "./bip39";

import { flags } from "@oclif/command";
import { BaseCommand as Command } from "../../command";

export class ForgerConfig extends Command {
    public static description = "Configure the forging delegate (BIP38)";

    public static examples = [
        `Configure a delegate using an encrypted BIP38
$ ark config:forger --method=bip38
`,
        `Configure a delegate using a BIP39 passphrase
$ ark config:forger --method=bip39
`,
    ];

    public static flags = {
        method: flags.string({ char: "m", description: "the configuration method to use (bip38 or bip39)" }),
    };

    public async run() {
        const { flags } = this.parse(ForgerConfig);

        if (flags.method === "bip38") {
            return ConfigureBIP38.run();
        }

        if (flags.method === "bip39") {
            return ConfigureBIP39.run();
        }

        // Interactive CLI
        const response = await prompts([
            {
                type: "select",
                name: "method",
                message: "What method would you like to use to store your passphrase?",
                choices: [
                    { title: "Encrypted BIP38 (Recommended)", value: "bip38" },
                    { title: "Plain BIP39", value: "bip39" },
                ],
            },
        ]);

        if (response.method === "bip38") {
            return ConfigureBIP38.run();
        }

        if (response.method === "bip39") {
            return ConfigureBIP39.run();
        }
    }
}