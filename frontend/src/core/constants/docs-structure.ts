import { API_EXAMPLES, CODE_SAMPLES, SYSTEM_PROMPT_EXAMPLE } from "./api-docs";

export const DOCS_STRUCTURE = {
    endpoint: {
        title: "POST /analyze",
        description: "Metin analizi başlatır ve yapay zeka & kural tabanlı düzeltmeleri döner.",

        request: {
            headers: {
                "Content-Type": "application/json"
            },
            body: API_EXAMPLES.main.payload
        },

        response: API_EXAMPLES.main.response
    },

    examples: CODE_SAMPLES,

    systemRole: {
        request: SYSTEM_PROMPT_EXAMPLE.payload,
        response: SYSTEM_PROMPT_EXAMPLE.response
    },

    quickCheck: API_EXAMPLES.quickCheck,

    batch: API_EXAMPLES.batch,

    errors: [
        API_EXAMPLES.error401,
        API_EXAMPLES.error429
    ]
};