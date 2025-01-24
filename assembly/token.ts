import { 
    storage, 
    Context, 
    logging, 
    PersistentMap,
} from "near-sdk-as";
import { u128Safe } from "./u128Safe";

// Custom assert function
function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}
// Custom SafeMath utility for u128Safe
class SafeMath {
    static add(a: u128Safe, b: u128Safe): u128Safe {
        const c = u128Safe.add(a, b);
        assert(c >= a, "SafeMath: addition overflow");
        return c;
    }

    static sub(a: u128Safe, b: u128Safe): u128Safe {
        assert(b <= a, "SafeMath: subtraction overflow");
        return u128Safe.sub(a, b); // Directly subtract u128 values
    }

    static mul(a: u128Safe, b: u128Safe): u128Safe {
        if (a == u128Safe.Zero()) {
            return u128Safe.Zero();
        }
        const c = u128Safe.mul(a, b);
        assert(u128Safe.div(c, a) == b, "SafeMath: multiplication overflow");
        return c;
    }

    static div(a: u128Safe, b: u128Safe): u128Safe {
        assert(b > u128Safe.Zero(), "SafeMath: division by zero");
        return u128Safe.div(a, b);
    }
}

// Storage for balances and allowances
const balances = new PersistentMap<string, u128Safe>("b:");
const allowances = new PersistentMap<string, PersistentMap<string, u128Safe>>("a:");

// Token metadata
const NAME: string = "My Token";
const SYMBOL: string = "MTK";
// @ts-ignore
const DECIMALS: u32 = 18; // Changed to u32
const TOTAL_SUPPLY: u128Safe = u128Safe.from("1000000000000000000000000"); // 1 million tokens

// Events
export function emitTransfer(from: string, to: string, value: u128Safe): void {
    logging.log(`Transfer: ${from} -> ${to} : ${value.toString()}`);
}

export function emitApproval(owner: string, spender: string, value: u128Safe): void {
    logging.log(`Approval: ${owner} -> ${spender} : ${value.toString()}`);
}

// Core ERC20 functions
export function totalSupply(): u128Safe {
    return TOTAL_SUPPLY;
}

export function balanceOf(owner: string): u128Safe {
    const balance = balances.get(owner);
    return balance ? balance : u128Safe.Zero();
}

export function allowance(owner: string, spender: string): u128Safe {
    const ownerAllowances = allowances.get(owner);
    if (!ownerAllowances) return u128Safe.Zero();

    const amount = ownerAllowances.get(spender);
    return amount ? amount : u128Safe.Zero();
}

export function transfer(to: string, amount: u128Safe): boolean {
    const sender = Context.sender;
    const senderBalance = balances.getSome(sender);
    assert(senderBalance >= amount, "ERC20: transfer amount exceeds balance");

    balances.set(sender, SafeMath.sub(senderBalance ? senderBalance : u128Safe.Zero(), amount));
    const recipientBalance = balances.get(to, u128Safe.Zero());
    balances.set(to, SafeMath.add(recipientBalance ? recipientBalance : u128Safe.Zero(), amount));

    emitTransfer(sender, to, amount);
    return true;
}

export function approve(spender: string, amount: u128Safe): boolean {
    const owner = Context.sender;
    let ownerAllowances = allowances.get(owner);
    if (!ownerAllowances) {
        ownerAllowances = new PersistentMap<string, u128Safe>(`aa:${owner}`);
        allowances.set(owner, ownerAllowances); // Ensure to set it in allowances map
    }
    ownerAllowances.set(spender, amount);

    emitApproval(owner, spender, amount);
    return true;
}

export function transferFrom(from: string, to: string, amount: u128Safe): boolean {
    const spender = Context.sender;
    const currentAllowance = allowance(from, spender);
    assert(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");

    const fromBalance = balanceOf(from);
    assert(fromBalance >= amount, "ERC20: transfer amount exceeds balance");

    let ownerAllowances = allowances.get(from);
    if (!ownerAllowances) {
        ownerAllowances = new PersistentMap<string, u128Safe>(`aa:${from}`);
        allowances.set(from, ownerAllowances); // Ensure to set it in allowances map
    }
    ownerAllowances.set(spender, SafeMath.sub(currentAllowance, amount));
    balances.set(from, SafeMath.sub(fromBalance, amount));
    const recipientBalance = balanceOf(to);
    balances.set(to, SafeMath.add(recipientBalance, amount));

    emitTransfer(from, to, amount);
    return true;
}

// Initialize the contract
export function init(): void {
   if (storage.hasKey("initialized")) {
       throw new Error("Already initialized");
   }

   balances.set(Context.sender, TOTAL_SUPPLY);

   storage.set("initialized", "true");

   emitTransfer("", Context.sender, TOTAL_SUPPLY);
}

// View functions for metadata
export function name(): string {
   return NAME;
}

export function symbol(): string {
   return SYMBOL;
}
// @ts-ignore
export function decimals(): u32 { // Changed to u32
   return DECIMALS;
}