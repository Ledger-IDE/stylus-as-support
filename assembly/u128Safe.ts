export class u128Safe {
    private value: u64;

    constructor(value: u64) {
        this.value = value;
    }

    static from(value: string): u128Safe {
        return new u128Safe(<u64>parseInt(value));
    }

    static Zero(): u128Safe {
        return new u128Safe(0);
    }

    static add(a: u128Safe, b: u128Safe): u128Safe {
        const result = a.value + b.value;
        assert(result >= a.value, "Addition overflow");
        return new u128Safe(result);
    }

    static sub(a: u128Safe, b: u128Safe): u128Safe {
        assert(b.value <= a.value, "Subtraction overflow");
        return new u128Safe(a.value - b.value);
    }

    static mul(a: u128Safe, b: u128Safe): u128Safe {
        if (a.value === 0) {
            return new u128Safe(0);
        }
        const result = a.value * b.value;
        assert(result / a.value === b.value, "Multiplication overflow");
        return new u128Safe(result);
    }

    static div(a: u128Safe, b: u128Safe): u128Safe {
        assert(b.value > 0, "Division by zero");
        return new u128Safe(a.value / b.value);
    }

    toString(): string {
        return this.value.toString();
    }

    // Overload the '>=' operator
    @operator(">=")
    static ge(a: u128Safe, b: u128Safe): bool {
        return a.value >= b.value;
    }

    // Overload the '<=' operator
    @operator("<=")
    static le(a: u128Safe, b: u128Safe): bool {
        return a.value <= b.value;
    }

    // Overload the '>' operator
    @operator(">")
    static gt(a: u128Safe, b: u128Safe): bool {
        return a.value > b.value;
    }

    // Overload the '<' operator
    @operator("<")
    static lt(a: u128Safe, b: u128Safe): bool {
        return a.value < b.value;
    }
}

function assert(arg0: boolean, arg1: string): void {
    if (!arg0) {
        throw new Error(arg1);
    }
}