function evaluate(content) {
    var result = '',
        mem = [],
        pos = {x: 0, y: 0},
        instructionPointer = 0,
        instruction;

    function findOpeningPoint(pointer) {
        var stack = 1;

        while(--pointer > 0) {
            if(content[pointer] == '⌜') stack--;
            else if(content[pointer] == '⌟') stack++;
            if(stack == 0) return pointer;
        }

        throw new Error('No matching start block');
    }

    function findClosingPoint(pointer) {
        var stack = 1;

        while(++pointer < content.length) {
            if(content[pointer] == '⌜') stack++;
            else if(content[pointer] == '⌟') stack--;
            if(stack == 0) return pointer;
        }

        throw new Error('No matching end block');
    }

    while(instructionPointer < content.length) {
        if(!mem[pos.x]) mem[pos.x] = [];
        if(!mem[pos.x][pos.y]) mem[pos.x][pos.y] = 0;

        instruction = content[instructionPointer];

        switch(instruction) {
        case '⊕':
            mem[pos.x][pos.y]++;
            instructionPointer++;
            break;
        case '⊖':
            mem[pos.x][pos.y]--;
            instructionPointer++;
            break;
        case '⌜':
            if(!mem[pos.x][pos.y]) {
                instructionPointer = findClosingPoint(instructionPointer);
            } else {
                instructionPointer++;
            }
            break;
        case '⌟':
            if(mem[pos.x][pos.y]) {
                instructionPointer = findOpeningPoint(instructionPointer);
            } else {
                instructionPointer++;
            }
            break;
        case '←':
            pos.x--;
            instructionPointer++;
            break;
        case '→':
            pos.x++;
            instructionPointer++;
            break;
        case '↑':
            pos.y--;
            instructionPointer++;
            break;
        case '↓':
            pos.y++;
            instructionPointer++;
            break;
        case '∘':
            result += String.fromCharCode(mem[pos.x][pos.y]);
            instructionPointer++;
            break;
        default:
            throw new Error("Unknown instruction: " + instruction);
        }
    }

    return result;
}

if(typeof require != 'undefined' && require.main == module) {
    console.log(evaluate(require('fs').readFileSync(process.argv[2], 'utf8')));
}
