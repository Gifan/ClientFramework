module.exports = {
    eBuff : { path : `import { eBuff } from "../fight/actor/eBuff";\n`, isJson : false },
    eOccur : { path :`import { eOccur } from "../fight/actor/eOccur";\n`, isJson : false },
    eAffect : { path :`import { eAffect } from "../fight/buffAffect/eAffect";\n`, isJson : false },
    Affect : { path :`import { Affect } from "../fight/buffAffect/Affect";\n`, isJson : true },
    "Affect[]" : { path :`import { Affect } from "../fight/buffAffect/Affect";\n`, isJson : true },
    Condition : { path :`import { Condition } from "../fight/buffTerm/Condition";\n`, isJson : true },
    "Condition[]" : { path :`import { Condition } from "../fight/buffTerm/Condition";\n`, isJson : true },
    eSkill : { path : `import { eSkill } from "../fight/actor/eSkill";\n`, isJson : false },
}