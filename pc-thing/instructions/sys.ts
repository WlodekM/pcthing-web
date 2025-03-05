// deno-lint-ignore-file no-case-declarations no-process-globals
import { PC } from "../pc.ts";
import { type Terminal } from '@xterm/xterm';

declare global {
    var ttyRawMode: boolean
}

export default {
    function(this: PC) {
        //@ts-expect-error
        const terminal = globalThis.term as Terminal;
        switch (this.registers[0]) {
            case 0:
                switch (this.registers[1]) {
                    case 0:
                        const pc = this;
                        //.split('').reverse().join('').match(/.{1,8}/g).map(b=>b.split('').reverse().join('')).map(b=>parseInt(b, 2))
                        return new Promise<undefined>((resolve, reject) => {
                            const data = new Uint8Array(1024)
                            let len = 0;

                            function ret() {
                                data[len] = 0;
                                let i = 0;
                                while (i < len) {
                                    pc.mem[pc.registers[2] + i] = data[i]
                                    i++
                                }
                                pc.registers[0] = len
                                pc.mem[pc.registers[2] + i] = 0
                                return resolve(undefined);
                            }

                            terminal.onKey(({key, domEvent}: {key: string, domEvent: KeyboardEvent}) => {
                                if (domEvent.key.charCodeAt(0) == 10) {
                                    data[len] = 10;
                                    len++;
                                    return ret()
                                }
                                backspace:
                                if (domEvent.key.charCodeAt(0) == 8 || domEvent.key.charCodeAt(0) == 127) {
                                    if (window.ttyRawMode) break backspace;
                                    if (len < 1) return;
                                    len--;
                                    data[len] = 0; // set last char to NULL
                                    return;
                                }
                                data[len] = key.charCodeAt(0);
                                len++;
                                if (window.ttyRawMode) return ret()
                            })
                        })

                    default:
                        throw 'unknown fd'
                }
                break;
            case 1:
                const writeBuff = [];
                let i = this.registers[2];
                while (this.mem[i] != 0 && i <= this.mem.length) {
                    writeBuff.push(this.mem[i]);
                    i++
                }
                switch (this.registers[1]) {
                    case 1:
                        terminal.write(writeBuff.map(a => String.fromCharCode(a)).join(''))
                        break;

                    case 2:
                        terminal.write(writeBuff.map(a => String.fromCharCode(a)).join(''))
                        break;

                    default:
                        throw 'unknown fd'
                }
                break;
            
            case 2:
                if (typeof window.ttyRawMode == 'undefined') window.ttyRawMode = false;
                window.ttyRawMode = this.registers[1] ? true : false;
                break;

            default:
                throw 'unknown syscall id ' + this.registers[0]
        }
    },
    args: 0
}