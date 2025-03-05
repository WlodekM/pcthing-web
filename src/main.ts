import { PC } from "../pc-thing/pc.ts";
import instructionsDict from "./instructions.ts";

type instruction = {
    function: (this: PC, argv: number[]) => void | ((this: PC, argv: number[]) => Promise<void>),
    args: number
}

class Runtime {
    pc: PC = new PC()
    instructions: Record<string, instruction> = {}
    instructionNames: string[] = []

    addInstruction(name: string, instruction: instruction) {
        this.instructionNames.push(name)
        this.instructions[name] = instruction
    }

    async run(line: number[]) {
        const instructionId = this.pc.instructions[line.shift() ?? -1]
        if (instructionId == undefined || !this.instructions[instructionId])
            throw 'unknown instruction (1)';
        const instruction = this.instructions[instructionId];
        if (!instruction)
            throw 'unknown instruction (2)';
        try {
            await instruction.function.call(this.pc, line)
        } catch (error) {
            console.error(error, 'at', this.pc.programPointer, instructionId)
        }
    }
}

export async function run(iram: Uint8Array, debug: boolean = false) {
    const runtime = new Runtime()
    
    const dir = Object.values(runtime.pc.instructions);
    
    for (const filename of dir) {
        const iImport = instructionsDict[filename];
        console.debug(`adding`, filename, iImport)
        runtime.addInstruction(filename,
            (iImport))
    }
    
    runtime.addInstruction('end', {function: () => { }, args: 0})
    
    runtime.pc.mem = runtime.pc.mem.toSpliced(65534 / 2 + 1, 0, ...[...iram].reduce<number[]>((result, value, index, array) => {
        if (index % 2 === 0) {
            result.push(value + (array[index + 1] << 8))
        }
        return result;
    }, []))
    
    runtime.pc.programPointer = 65536 / 2
    
    // function gotoInterrupt() {
    //     if (!runtime.pc.mem[65536 / 2 - 1])
    //         return;
    //     runtime.pc.returnStack.push(runtime.pc.programPointer);
    //     runtime.pc.programPointer = runtime.pc.mem[65536 / 2 - 1]
    // }
    
    // const interruptInterval = setInterval(gotoInterrupt, 10)
    
    const endInst = (Object.entries(runtime.pc.instructions) as [unknown, string][] as [number, string][])
        .find(([_, b]: [number, string]) => b == 'end')
    if (!endInst) throw 'where the fuck is the end instruction'
    const endInstId = endInst[0];
    
    console.debug(runtime)
    
    // let c = 0
    while (
        runtime.pc.mem[runtime.pc.programPointer] != endInstId &&
        runtime.pc.programPointer != 0xFFFF - 1) {
        try {
            const definition = Object.entries(runtime.pc.instructions).find(([a]) => +a == runtime.pc.mem[runtime.pc.programPointer])
            if (!definition || !definition[1]) throw 'what the fuck is that'
            const instruction = definition[1]
            runtime.pc.programPointer ++
            // console.debug(instruction, runtime.instructions, definition)
            const args = [];
            if (debug)
                console.debug(runtime.pc.programPointer, definition, instruction, runtime.pc.mem[runtime.pc.programPointer+1])
            while (args.length < runtime.instructions[instruction].args) {
                args.push(runtime.pc.mem[runtime.pc.programPointer])
                runtime.pc.programPointer++
            }
            await runtime.run([+definition[0], ...args])
            // runtime.pc.programPointer++
            // c++
        } catch (error) {
            console.error(error);
            break;
        }
    }
    
    // clearInterval(interruptInterval)
    
    if (debug)
        console.debug(Object.values(runtime.pc.instructions))
    // console.debug('end of execution, dumping ram', runtime.pc.mem)
    // Deno.writeFileSync('ram.bin', Uint8Array.from(runtime.pc.mem.map(a => [a & 0x00FF, (a & 0xFF00) >> 8]).flatMap(([a, b]) => [a, b])))
    // new Deno.Command('hexdump', {
    //     args: ['-C', 'ram.bin']
    // }).spawn()
}