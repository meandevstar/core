import envfile from "envfile";
import expandHomeDir from "expand-home-dir";
import { existsSync } from "fs-extra";
import Command from "../command";

export class ConfigGet extends Command {
    public static description = "Get a value from the configuration";

    public static examples = [
        `Get the log level
$ ark config:get ARK_LOG_LEVEL
`,
    ];

    public static flags = {
        ...Command.flagsConfig,
    };

    public static args = [{ name: "key" }];

    public async run() {
        const { args, flags } = this.parse(ConfigGet);

        const envFile = `${expandHomeDir(flags.data)}/.env`;

        if (!existsSync(envFile)) {
            throw new Error(`No environment file found at ${envFile}`);
        }

        console.log(envfile.parseFileSync(envFile)[args.key]);
    }
}
