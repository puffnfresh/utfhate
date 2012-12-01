function evaluate(content) {
    var blocks = content.split(/[⌜⌟]/),
        result = '',
        mem = [],
        pos = {x: 0, y: 0},
        blockPointer = 0,
        instructionPointer = 0,
        basicBlocks = [],
        instruction,
        i;

    basicBlocks.push(blocks[0]);
    for(i = 1; i < blocks.length - 1; i++) {
        basicBlocks.push('⌜' + blocks[i] + '⌟');
    }
    basicBlocks.push(blocks[blocks.length - 1]);

    while(blockPointer < basicBlocks.length) {
        if(!mem[pos.x]) mem[pos.x] = [];
        if(!mem[pos.x][pos.y]) mem[pos.x][pos.y] = 0;

        if(instructionPointer >= basicBlocks[blockPointer].length) {
            blockPointer++;
            instructionPointer = 0;
        }

        if(!basicBlocks[blockPointer]) {
            break;
        }

        instruction = basicBlocks[blockPointer][instructionPointer];

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
                blockPointer++;
            } else {
                instructionPointer++;
            }
            break;
        case '⌟':
            if(mem[pos.x][pos.y]) {
                instructionPointer = 0;
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
