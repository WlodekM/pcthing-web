import { PC } from "../pc.ts";

export default {
    function(this: PC, [msg]: string[]) {
        console.log(msg, this.mem, this.registers, this.returnFlag, this.returnStack);
        console.warn("WARNING - UNIMPLEMENTED: dbg")
        // Deno.stdin.readSync(new Uint8Array(1))
    },
    args: 1
}