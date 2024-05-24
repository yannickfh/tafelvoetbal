const fs = require('fs');
const ts = require('typescript');

// Read the types.ts file
const fileContent = fs.readFileSync('./types/supabase.ts', 'utf8');

// Function to transform enum names to PascalCase and remove '_enum' suffix
function transformEnumName(name) {
    return name
        .replace(/_enum$/, '') // Remove '_enum' suffix
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

// Function to parse and extract enums from Database['public']['Enums']
function extractEnums(content) {
    const sourceFile = ts.createSourceFile(
        'types.ts',
        content,
        ts.ScriptTarget.Latest,
        true
    );
    const enums = {};

    function visit(node) {
        if (
            ts.isPropertySignature(node) &&
            node.name.escapedText === 'Enums' &&
            node.type &&
            ts.isTypeLiteralNode(node.type)
        ) {
            node.type.members.forEach((member) => {
                if (
                    ts.isPropertySignature(member) &&
                    member.type &&
                    ts.isUnionTypeNode(member.type)
                ) {
                    const enumName = transformEnumName(member.name.escapedText);
                    const enumValues = member.type.types
                        .map((type) => {
                            if (
                                ts.isLiteralTypeNode(type) &&
                                type.literal &&
                                ts.isStringLiteral(type.literal)
                            ) {
                                return type.literal.text;
                            }
                            return null;
                        })
                        .filter(Boolean);

                    enums[enumName] = enumValues;
                }
            });
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return enums;
}

// Function to create enum strings
function createEnumStrings(enums) {
    return Object.entries(enums)
        .map(([enumName, enumValues]) => {
            const enumMembers = enumValues
                .map((value) => `${value} = "${value}"`)
                .join(',\n  ');
            return `export enum ${enumName} {\n  ${enumMembers}\n}`;
        })
        .join('\n\n');
}

// Extract enums
const extractedEnums = extractEnums(fileContent);

// Create enum strings
const enumStrings = createEnumStrings(extractedEnums);

// Write enums to a new file
fs.writeFileSync('./enums/supabase.ts', enumStrings);
