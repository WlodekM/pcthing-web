import crr from "../pc-thing/instructions/crr.ts";
import jz from "../pc-thing/instructions/jz.ts";
import sys from "../pc-thing/instructions/sys.ts";
import swp from "../pc-thing/instructions/swp.ts";
import sub from "../pc-thing/instructions/sub.ts";
import str from "../pc-thing/instructions/str.ts";
import ldr from "../pc-thing/instructions/ldr.ts";
import add from "../pc-thing/instructions/add.ts";
import cmr from "../pc-thing/instructions/cmr.ts";
import mod from "../pc-thing/instructions/mod.ts";
import srm from "../pc-thing/instructions/srm.ts";
import or from "../pc-thing/instructions/or.ts";
import jnz from "../pc-thing/instructions/jnz.ts";
import put from "../pc-thing/instructions/put.ts";
import ld from "../pc-thing/instructions/ld.ts";
import xor from "../pc-thing/instructions/xor.ts";
import div from "../pc-thing/instructions/div.ts";
import srr from "../pc-thing/instructions/srr.ts";
import jmp from "../pc-thing/instructions/jmp.ts";
import and from "../pc-thing/instructions/and.ts";
import ldm from "../pc-thing/instructions/ldm.ts";
import swpm from "../pc-thing/instructions/swpm.ts";
import dbg from "../pc-thing/instructions/dbg.ts";
import not from "../pc-thing/instructions/not.ts";
import cmp from "../pc-thing/instructions/cmp.ts";
import ret from "../pc-thing/instructions/ret.ts";
import halt from "../pc-thing/instructions/halt.ts";
import jnzr from "../pc-thing/instructions/jnzr.ts";
import mul from "../pc-thing/instructions/mul.ts";
import jmr from "../pc-thing/instructions/jmr.ts";
import { type PC } from "../pc-thing/pc.ts";

type instruction = {
    function: (this: PC, argv: number[] | string[]) => void | ((this: PC, argv: number[]) => Promise<void>),
    args: number
}

export default {
    crr,
    jz,
    sys,
    swp,
    sub,
    str,
    ldr,
    add,
    cmr,
    mod,
    srm,
    or,
    jnz,
    put,
    ld,
    xor,
    div,
    srr,
    jmp,
    and,
    ldm,
    swpm,
    dbg,
    not,
    cmp,
    ret,
    halt,
    jnzr,
    mul,
    jmr,
} as Record<string, instruction>